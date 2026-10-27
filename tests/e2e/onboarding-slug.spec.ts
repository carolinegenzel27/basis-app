import { test, expect, type Page } from "@playwright/test";
import {
  deleteTestUser,
  getBusinessProfileSlug,
  getUserIdByEmail,
  signUpAndReachOnboarding,
  testEmail,
  TEST_PASSWORD,
} from "./helpers";

// Covers a real piece of business logic that currently has zero automated
// coverage anywhere: the slug-collision loop in createBusinessProfile
// (lib/actions/business-profile.ts) - "if the slug is taken, keep trying
// baseSlug-2, baseSlug-3, ... until free". It can't be a Vitest unit test
// (it needs a real "is this slug already in the table" lookup against a
// live database), and it isn't exercised by full-flow.spec.ts (that test
// always uses a fresh, unique slug). Documented as a manual test in
// Basis_מסמך_אפיון_בדיקות.pdf section 6 (#3) - this automates it.
//
// Fills the same onboarding form as full-flow.spec.ts, for two different
// signed-up users, on purpose - the interesting behavior only shows up
// when a *second* real row already exists with that slug.

async function fillOnboarding(page: Page, businessName: string, slug: string) {
  await page.getByLabel("שם העסק").fill(businessName);
  await page.getByLabel("תחום עיסוק").fill("מורה לנהיגה");
  await page.getByLabel("שנות ותק").fill("5");
  await page.getByLabel("גודל צוות").fill("1");
  await page.getByLabel("כתובת הדף הציבורי שלך").fill(slug);
  await page.getByRole("button", { name: "המשך לשאלון התאמה" }).click();
  test.setTimeout(180_000);
  // Onboarding now runs the AI market search before redirecting - allow
  // for it (it never blocks the redirect, but can take up to a minute).
  await page.waitForURL(/\/fit-assessment/, { timeout: 120_000 });
}

test.describe("onboarding slug collision", () => {
  const firstEmail = testEmail("slug-first");
  const secondEmail = testEmail("slug-second");
  const baseSlug = `e2e-collision-${Date.now()}`;

  test.afterAll(async () => {
    await deleteTestUser(firstEmail);
    await deleteTestUser(secondEmail);
  });

  test("a second signup with an already-taken slug gets an auto-numbered suffix instead of failing", async ({
    browser,
  }) => {
    // Two independent browser contexts, not one page reused for both users -
    // each needs its own signed-in session, exactly like two different
    // people signing up from two different computers.
    const firstContext = await browser.newContext();
    const firstPage = await firstContext.newPage();
    await signUpAndReachOnboarding(firstPage, firstEmail, TEST_PASSWORD);
    await fillOnboarding(firstPage, "E2E Collision Test A", baseSlug);
    await firstContext.close();

    const secondContext = await browser.newContext();
    const secondPage = await secondContext.newPage();
    await signUpAndReachOnboarding(secondPage, secondEmail, TEST_PASSWORD);
    // Same slug on purpose - this is the collision. The form has to
    // succeed anyway (that's the whole point of this feature: no error
    // shown to the second user), so reaching /fit-assessment here already
    // proves the insert didn't just fail outright.
    await fillOnboarding(secondPage, "E2E Collision Test B", baseSlug);
    await secondContext.close();

    // The redirect never reveals the final slug, and "it didn't error" by
    // itself doesn't prove the suffix logic actually ran (a real duplicate
    // slug would also have failed loudly, not succeeded) - so confirm what
    // Postgres actually stored for the second user.
    const secondUserId = await getUserIdByEmail(secondEmail);
    const finalSlug = await getBusinessProfileSlug(secondUserId);
    expect(finalSlug).toBe(`${baseSlug}-2`);
  });
});
