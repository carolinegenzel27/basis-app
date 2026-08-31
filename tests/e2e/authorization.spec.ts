import { test, expect } from "@playwright/test";
import {
  createOnboardedTestUser,
  createQuoteForUser,
  deleteTestUser,
  loginViaUi,
  testEmail,
  TEST_PASSWORD,
} from "./helpers";

// The real-world version of Basis_מסמך_אפיון_בדיקות.docx section 4 (#2/#3):
// "user A tries to view/download a quote belonging to user B, by changing
// the id in the URL". lib/actions/quotes.test.ts already proves this at the
// unit level with a mocked Supabase client - this test proves the same
// guarantee end to end, against real RLS policies in the real database,
// with two real logged-in accounts. Unlike quote-pdf.spec.ts's anonymous
// 401 check, this is "wrong user", not "no user at all" - a meaningfully
// different (and more important) case.

test.describe("cross-user authorization", () => {
  const ownerEmail = testEmail("authz-owner");
  const otherEmail = testEmail("authz-other");
  let ownerQuoteId: string;

  test.beforeAll(async () => {
    const owner = await createOnboardedTestUser(ownerEmail, TEST_PASSWORD);
    ownerQuoteId = await createQuoteForUser(owner.businessProfileId);
    await createOnboardedTestUser(otherEmail, TEST_PASSWORD);
  });

  test.afterAll(async () => {
    await deleteTestUser(ownerEmail);
    await deleteTestUser(otherEmail);
  });

  test("a logged-in user cannot download another user's quote PDF", async ({ page }) => {
    await loginViaUi(page, otherEmail, TEST_PASSWORD);

    // RLS on the quotes table (supabase/schema.sql: "read own quotes")
    // means the route's own .select().eq("id", id) simply returns no row
    // for a quote that isn't this user's - the Route Handler then responds
    // with 404, deliberately not distinguishing "doesn't exist" from
    // "exists but isn't yours" (same anti-enumeration pattern as sign-in).
    const response = await page.request.get(`/api/quotes/${ownerQuoteId}/pdf`);
    expect(response.status()).toBe(404);
    expect(response.headers()["content-type"]).not.toContain("application/pdf");
  });

  test("a logged-in user's quote list never shows another user's quote", async ({ page }) => {
    await loginViaUi(page, otherEmail, TEST_PASSWORD);
    await page.goto("/quotes");
    await expect(page.getByText("Other User's Client")).not.toBeVisible();
  });
});
