import { test, expect } from "@playwright/test";
import { signUpAndReachOnboarding, testEmail, TEST_PASSWORD, deleteTestUser } from "./helpers";
import { FIT_QUESTIONS } from "../../lib/fit-assessment/questions";

// Covers the entire mandatory funnel a brand-new user has to go through
// before reaching the dashboard: signup -> onboarding -> fit assessment.
// Every gate along the way (app/(private)/layout.tsx, and the two explicit
// redirects in dashboard/page.tsx) is a real product decision documented in
// Basis_מסמך_תכנון_טכני.pdf section 8 (onboarding as a mandatory gate) -
// this test walks through them the same way a real user would, through the
// real UI, against the real Supabase project.
//
// Form labels/button text below are quoted in Hebrew on purpose - that's
// the app's real UI text, so the selectors have to match it exactly.

test.describe("signup through dashboard", () => {
  const email = testEmail("fullflow");
  // English test fixture on purpose - unlike the getByLabel/getByRole
  // selectors below, this name is data we made up, not real app UI text,
  // so there's no reason for it to be Hebrew.
  const businessName = "E2E Test Driving School";
  const slug = `e2e-driving-${Date.now()}`;

  test.afterAll(async () => {
    await deleteTestUser(email);
  });

  test("a new user signs up, completes onboarding and the fit assessment, and reaches the dashboard", async ({ page }) => {
    await signUpAndReachOnboarding(page, email, TEST_PASSWORD);

    await page.getByLabel("שם העסק").fill(businessName);
    await page.getByLabel("תחום עיסוק").fill("מורה לנהיגה");
    await page.getByLabel("שנות ותק").fill("5");
    await page.getByLabel("גודל צוות").fill("1");
    await page.getByLabel("כתובת הדף הציבורי שלך").fill(slug);
    await page.getByRole("button", { name: "המשך לשאלון התאמה" }).click();

    // fit assessment - createBusinessProfile always redirects here first
    // (lib/actions/business-profile.ts), regardless of whether the
    // dashboard would also redirect here on its own.
    test.setTimeout(180_000);
    // Onboarding now runs the AI market search first - allow up to a minute+.
    await page.waitForURL(/\/fit-assessment/, { timeout: 120_000 });

    for (let i = 0; i < FIT_QUESTIONS.length; i++) {
      const isLast = i === FIT_QUESTIONS.length - 1;
      // Answer every question the same way ("מסכים/ה") - the actual
      // recommendation isn't what this test is checking; reaching the
      // dashboard afterward is.
      await page.getByRole("button", { name: "מסכים/ה", exact: true }).click();
      await page
        .getByRole("button", { name: isLast ? "קבלת המלצה" : "הבא" })
        .click();
    }

    // Success state shows the recommendation message and a link onward.
    await expect(page.getByRole("heading", { name: "ההמלצה שלנו" })).toBeVisible();
    await page.getByRole("link", { name: "המשך למסך הבית" }).click();

    await page.waitForURL(/\/dashboard/, { timeout: 10_000 });
    await expect(page.getByRole("heading", { name: `שלום, ${businessName}` })).toBeVisible();
  });
});
