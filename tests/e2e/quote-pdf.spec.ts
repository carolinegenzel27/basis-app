import { test, expect } from "@playwright/test";
import { createOnboardedTestUser, deleteTestUser, loginViaUi, testEmail, TEST_PASSWORD } from "./helpers";

// Covers the app's actual core value: turning a filled-in form into a real,
// downloadable PDF quote (app/api/quotes/[id]/pdf/route.ts - the app's only
// Route Handler, and the one piece of the funnel not already covered by
// full-flow.spec.ts). The prerequisite user/profile/fit-assessment are
// seeded directly through the admin client instead of the UI - onboarding
// itself is already exercised end-to-end by the other test, so repeating it
// here would only slow this one down without testing anything new.
//
// Form labels/button text below are quoted in Hebrew on purpose - that's
// the app's real UI text, so the selectors have to match it exactly.

test.describe("quote creation and PDF download", () => {
  const email = testEmail("quotepdf");

  test.beforeAll(async () => {
    await createOnboardedTestUser(email, TEST_PASSWORD);
  });

  test.afterAll(async () => {
    await deleteTestUser(email);
  });

  test("an existing user creates a quote and downloads a valid PDF", async ({ page }) => {
    await loginViaUi(page, email, TEST_PASSWORD);

    await page.goto("/quotes/new");
    await expect(page.getByRole("heading", { name: "הצעת מחיר חדשה" })).toBeVisible();

    // English test fixtures on purpose - unlike the getByLabel/getByRole
    // selectors, this is data we made up, not real app UI text.
    await page.getByLabel("שם לקוח").fill("Test Client");
    await page.getByLabel("אימייל לקוח").fill("test-client@example.com");
    await page.getByLabel("תיאור הפרויקט").fill("10-lesson package (e2e test)");
    await page.getByLabel("מחיר (₪)").fill("250");
    await page.getByRole("button", { name: "שמירת הצעת מחיר" }).click();

    await expect(page.getByText("הצעת המחיר נשמרה!")).toBeVisible();
    // exact: true because the page also has a "← חזרה לרשימת ההצעות" link
    // above the form (the back link shown before submitting) - without it,
    // Playwright's substring match resolves to both and throws.
    await page.getByRole("link", { name: "חזרה לרשימת ההצעות", exact: true }).click();

    await page.waitForURL(/\/quotes(?!\/new)/, { timeout: 10_000 });
    const quoteRow = page.locator("li", { hasText: "Test Client" }).first();
    await expect(quoteRow).toBeVisible();

    const pdfLink = quoteRow.getByRole("link", { name: "הורדת PDF" });
    const pdfHref = await pdfLink.getAttribute("href");
    expect(pdfHref).toBeTruthy();

    // Hit the Route Handler directly (through the same authenticated
    // context the page is using) rather than dealing with an actual browser
    // download - what matters for this test is that the server returns a
    // real PDF to the owner, which is exactly what
    // Basis_מסמך_תכנון_טכני.pdf section 4 documents for this endpoint.
    const response = await page.request.get(pdfHref!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");

    const body = await response.body();
    // A real PDF file starts with the "%PDF-" magic bytes - cheap sanity
    // check that this is an actual PDF and not, say, an error page that
    // happened to get a 200.
    expect(body.subarray(0, 5).toString("utf-8")).toBe("%PDF-");
    expect(body.byteLength).toBeGreaterThan(500);
  });

  test("an unauthenticated request to the PDF route is rejected with 401 (end-to-end permission check)", async ({ request }) => {
    // Same check documented in Basis_מסמך_אפיון_בדיקות.pdf section 4 (#8),
    // but as a real HTTP call instead of a unit-test mock: the `request`
    // fixture here is a fresh, cookie-less context (unrelated to `page`),
    // so this is exactly what a logged-out visitor or a leaked link would
    // get - the route must reject it with 401, not return a file.
    const anonResponse = await request.get("/api/quotes/00000000-0000-0000-0000-000000000000/pdf");
    expect(anonResponse.status()).toBe(401);
  });
});
