import { createClient } from "@supabase/supabase-js";
import type { Page } from "@playwright/test";

// Admin client - uses the service_role key, the same secret described in
// Basis_מסמך_אבטחה.docx section 7. Only ever used here, in test code that
// runs on the developer's machine (or CI), never shipped in the app itself.
// It exists in this file for exactly one reason: real E2E tests need to
// confirm/clean up real rows in the same Supabase project the app runs
// against, and there's no other way to do that from outside the app.
function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY - make sure .env.local is set before running the e2e tests."
    );
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Every test run gets its own throwaway email, so runs never collide with
// each other and never touch a real account. The "e2e-" prefix plus the
// timestamp makes it obvious in Supabase Studio that a row is test data
// and not a real signup, in case cleanup below ever fails to run (e.g. the
// test crashes mid-run).
export function testEmail(label: string) {
  return `e2e-${label}-${Date.now()}@example.com`;
}

export const TEST_PASSWORD = "TestPass123";

// Signs up through the real UI (the same form a real user fills in). This
// project doesn't use Supabase's "Confirm email" step (see signUpAction in
// lib/actions/auth.ts), so a successful signUp always returns a session
// immediately and redirects straight to /onboarding - no separate
// email-confirmation branch to handle here.
export async function signUpAndReachOnboarding(page: Page, email: string, password: string) {
  await page.goto("/signup");
  await page.getByLabel("אימייל").fill(email);
  await page.getByLabel("סיסמה").fill(password);
  await page.getByRole("button", { name: "להירשם" }).click();
  await page.waitForURL(/\/onboarding/, { timeout: 10_000 });
}

// Turns a Supabase/PostgREST error into a readable one-liner for test
// output - the client library's own .message is sometimes just "{}" or
// omits the actual reason, so this pulls in whatever extra fields exist.
function describeError(error: unknown): string {
  if (!error || typeof error !== "object") return String(error);
  const e = error as Record<string, unknown>;
  const parts = [e.message, e.status ? `status=${e.status}` : null, e.code ? `code=${e.code}` : null]
    .filter(Boolean);
  return parts.length ? parts.join(" | ") : JSON.stringify(error);
}

// Creates a fully onboarded user directly through the admin API + a real
// DB insert (not through the UI) - used by the quote/PDF test, which is
// testing quote creation and PDF generation, not signup or onboarding
// (that's covered by full-flow.spec.ts already). Keeps that test focused
// and fast instead of re-running the entire funnel just to get a user.
export async function createOnboardedTestUser(email: string, password: string) {
  const admin = adminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createError || !created.user) {
    throw new Error(`admin.createUser failed for ${email}: ${describeError(createError)}`);
  }

  const slug = `e2e-quote-${Date.now()}`;
  const { data: profile, error: profileError } = await admin
    .from("business_profiles")
    .insert({
      user_id: created.user.id,
      business_name: "E2E Test Business",
      profession: "driving_instructor",
      years_experience: 5,
      team_size: 1,
      slug,
    })
    .select("id")
    .single();
  if (profileError || !profile) {
    throw new Error(`business_profiles insert failed: ${describeError(profileError)}`);
  }

  const { error: fitError } = await admin.from("fit_assessments").insert({
    business_profile_id: profile.id,
    // Scores/answers don't matter for this test - only that the
    // fit-assessment gate (dashboard/page.tsx Gate 2) is satisfied so
    // /quotes is reachable. answers is NOT NULL in the schema even though
    // nothing reads it back here.
    answers: [3, 3, 3, 3, 3],
    pricing_score: 3,
    branding_score: 3,
    recommendation: "both",
  });
  if (fitError) {
    throw new Error(`fit_assessments insert failed: ${describeError(fitError)}`);
  }

  return { userId: created.user.id, businessProfileId: profile.id as string };
}

// Seeds a quote directly for an already-onboarded test user - used by the
// cross-user authorization test, which needs a quote that belongs to
// someone other than the user driving the browser. Going through the UI
// would need a second logged-in session just to create it; the admin
// insert does the same thing in one call.
export async function createQuoteForUser(businessProfileId: string) {
  const admin = adminClient();
  const { data: quote, error } = await admin
    .from("quotes")
    .insert({
      business_profile_id: businessProfileId,
      client_name: "Other User's Client",
      client_email: "other-client@example.com",
      project_description: "Belongs to a different account - e2e fixture",
      price: 300,
    })
    .select("id")
    .single();
  if (error || !quote) {
    throw new Error(`quotes insert failed: ${describeError(error)}`);
  }
  return quote.id as string;
}

// Looks up a user's id by email - useful after signing up through the real
// UI (signUpAndReachOnboarding doesn't return an id, since a real signup
// form doesn't either), when a test needs the id afterward for a DB check.
export async function getUserIdByEmail(email: string) {
  const admin = adminClient();
  const { data: usersPage, error } = await admin.auth.admin.listUsers();
  if (error) {
    throw new Error(`listUsers failed while looking up ${email}: ${describeError(error)}`);
  }
  const user = usersPage.users.find((u) => u.email === email);
  if (!user) {
    throw new Error(`No user found for ${email} - did signup actually succeed?`);
  }
  return user.id;
}

// Reads back the slug Postgres actually assigned - createBusinessProfile
// (lib/actions/business-profile.ts) appends "-2", "-3", etc. on a
// collision, but the redirect after onboarding never surfaces the final
// slug in the URL, so the only way to check it is to ask the database.
export async function getBusinessProfileSlug(userId: string) {
  const admin = adminClient();
  const { data, error } = await admin
    .from("business_profiles")
    .select("slug")
    .eq("user_id", userId)
    .single();
  if (error || !data) {
    throw new Error(`business_profiles lookup failed for user ${userId}: ${describeError(error)}`);
  }
  return data.slug as string;
}

export async function loginViaUi(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("אימייל").fill(email);
  await page.getByLabel("סיסמה").fill(password);
  await page.getByRole("button", { name: "להתחבר" }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 10_000 });
}

// Deletes the auth user - business_profiles.user_id has "on delete cascade"
// (supabase/schema.sql line 9), and every other table cascades from
// business_profiles.id, so this one call removes all of the test's rows:
// the profile, the fit assessment, and any quotes created during the test.
export async function deleteTestUser(email: string) {
  const admin = adminClient();
  const { data: usersPage, error: listError } = await admin.auth.admin.listUsers();
  if (listError) {
    console.warn(`cleanup: listUsers failed for ${email}: ${describeError(listError)}`);
    return;
  }
  const user = usersPage.users.find((u) => u.email === email);
  if (user) {
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.warn(`cleanup: deleteUser failed for ${email}: ${describeError(deleteError)}`);
    }
  }
}
