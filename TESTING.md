# Basis - Test Spec

## Strategy

This project has no external services to fake in tests except Supabase, and
Supabase is threaded through nearly every Server Action and page. Rather
than build a mocked Supabase client (which mostly tests the mock, not the
app), this pass focuses on **unit tests for pure business logic** - code
that has no database, network, or React rendering dependency and can be
fully verified with plain function calls. This is the highest-value,
lowest-cost testing layer available right now, and it directly covers the
two areas where a silent bug would be worst: **data validation** (the
security boundary every Server Action relies on) and **generated content
correctness** (scoring, marketing text, PDF text rendering).

Framework: [Vitest](https://vitest.dev/) - chosen over Jest because it
needs zero extra config to understand this project's native ESM + TypeScript
setup, and it's already compatible with Vite's transform pipeline that
Next.js itself is built on.

Run the suite:

```bash
npm test          # single run
npm run test:watch  # watch mode while developing
```

## What is covered, and why

| File | What it tests | Why this file specifically |
|---|---|---|
| `lib/validations/validations.test.ts` | Every Zod schema in `lib/validations/` - the `authSchema`, `businessProfileSchema`, `quoteSchema`, `profileContentSchema` + file upload constants, `pricingRequestSchema`, `fitAssessmentSchema`, `brandingSchema` | These schemas are re-run server-side inside every Server Action - they're the app's real security boundary against malformed or malicious input, not just a UI nicety. A hole here is a hole in the whole app. |
| `lib/fit-assessment/scoring.test.ts` | `scoreFitAssessment` - averaging logic and the pricing/branding/both decision, including the tie-threshold branch | Silently mis-scoring this quiz would route a user to the wrong tool (pricing advisor vs. branding) with no visible error - the kind of bug nobody notices until a user complains. |
| `lib/templates/branding-templates.test.ts` | `generateMarketingContent` - confirms all 6 answers actually appear in the 4 generated texts | This is the "no external AI" content engine. A template typo that drops a field is invisible until a real user notices their own answer missing from their marketing copy. |
| `lib/pdf/bidi-text.test.ts` | `splitBidiRuns` - the fix for a real, previously-shipped Hebrew/PDF rendering bug (mixed Hebrew + digits/punctuation corrupting inside `@react-pdf/renderer`) | This is a regression test for a bug that already happened once in this project. Locking in the exact split behavior (Hebrew run / digit run / punctuation run) means it can't silently break again during a refactor. |
| `lib/actions/quotes.test.ts` | `createQuote` and `deleteQuote` - the auth check (rejects when no user is logged in), the ownership check (rejects when the target row doesn't belong to the logged-in user), and that invalid input never even reaches Supabase | This is the one Server Action file that was previously untested (see below) - it now has direct coverage of the exact logic described in the security document as the third defense layer against one user touching another user's data. |
| `lib/actions/auth.test.ts` | `signUpAction` and `signInAction` - both reject invalid input (bad email, weak password, empty password) before Supabase is ever called; `signInAction` returns the identical vague error regardless of *why* Supabase rejected the login; `signUpAction` returns a specific message when Supabase reports success but issues no session | This is the anti-enumeration guarantee described in the security document - the whole point is that an attacker can't tell "wrong password" apart from "no such account" from the response alone. A test is the only way to lock that in, since the bug (accidentally returning Supabase's real error message) wouldn't look wrong in a screenshot - it would just quietly leak information. |
| `lib/actions/profile-media.test.ts` | `uploadProfileDocument` and `deleteProfileDocument` with Storage and DB failures forced on purpose: a failed record insert rolls back the uploaded file; a failed Storage removal returns an error and leaves the record in place (never reports success while the file is still reachable); a successful delete removes the file *before* the row | A real Supabase project can't be made to fail on demand, so only a mock can prove the failure paths. These cover a review finding: the earlier version could leave public files behind with no record, or report a delete as successful while the file's URL still worked. |

**71 tests total, across 7 files, all passing** (`npm test`).

## End-to-end tests (Playwright)

Framework: [Playwright](https://playwright.dev/). Unlike the Vitest suite
above, these drive a real browser against a real running instance of the
app (`npm run dev`, started automatically by `playwright.config.ts`) and a
real Supabase project - they're the only tests here that exercise Next.js
routing/redirects, RLS, and the actual PDF Route Handler together, instead
of one layer at a time with everything else mocked.

Run the suite. One-time setup, both steps:

1. `npx playwright install chromium`
2. Run `supabase/grant_service_role_for_tests.sql` once in the Supabase SQL
   Editor - the test helpers seed a business profile, fit assessment, and
   quote directly through the `service_role` admin client, which (like every
   other role in this project) has no table access until it's explicitly
   granted one. Not needed to run the app itself, only the e2e tests.

```bash
npm run test:e2e
```

| File | What it covers |
|---|---|
| `tests/e2e/full-flow.spec.ts` | The full mandatory funnel a brand-new user must pass through: signup → onboarding → fit assessment → dashboard. Walks through every gate in `app/(private)/layout.tsx` and `dashboard/page.tsx` the same way a real user would, through the real forms. |
| `tests/e2e/quote-pdf.spec.ts` | Quote creation end to end, then downloading the generated file from `app/api/quotes/[id]/pdf/route.ts` and checking it's a real PDF (`%PDF-` header, `Content-Type: application/pdf`) - not just that a 200 came back. A second test confirms the same route returns 401 for a logged-out request. |
| `tests/e2e/authorization.spec.ts` | Two real accounts: user B cannot download user A's quote PDF (real RLS returns no row, route responds 404, not the file) and never sees it in their own `/quotes` list. This is the "wrong user" version of the authorization check - `quote-pdf.spec.ts`'s 401 test only covers "no user at all". Matches Basis_מסמך_אפיון_בדיקות.pdf section 4 (#2/#3). |
| `tests/e2e/onboarding-slug.spec.ts` | The slug-collision loop in `createBusinessProfile` (`baseSlug-2`, `baseSlug-3`, ...) - two different real signups deliberately choose the same public URL, and the test confirms Postgres actually stored the second one with a `-2` suffix rather than just not erroring. This logic had no automated coverage anywhere before (it needs a live "is this slug taken" lookup, so it can't be a Vitest unit test). Matches Basis_מסמך_אפיון_בדיקות.pdf section 6 (#3). |
| `tests/e2e/public-access.spec.ts` | Calls the Supabase REST API directly with the public anon key (no app pages involved): the public view refuses `linkedin_text`/`sales_pitch` even when asked for them by name; a logged-out visitor and a logged-in non-owner get the same public documents; a logged-in non-owner still can't delete someone else's document | What the page renders isn't what's public - what the database returns is. These lock in `supabase/fix_public_access.sql` and cover both public-reader roles (`anon` and `authenticated`), which RLS treats as separate. |

**Test data**: every spec creates its own throwaway Supabase Auth user(s)
(`e2e-<label>-<timestamp>@example.com`) via the `service_role` key, and
delete it in an `afterAll` hook - deleting the auth user cascades
(`on delete cascade` on `business_profiles.user_id`) through the profile,
fit assessment, and any quotes created during the test, so nothing is left
behind in the database on a normal run. If a run crashes mid-test the
cleanup hook won't fire, so an `e2e-...@example.com` row could theoretically
be left behind - the email prefix makes any leftover easy to spot and
delete by hand in Supabase Studio.

**Requires real credentials**: these tests need a real `.env.local` (same
three variables as running the app locally) and real outbound network
access to your Supabase project - they will not run in a network-restricted
sandbox. They have been verified to type-check, lint cleanly, and be
correctly discovered by Playwright (`npx playwright test --list`), but have
not yet been executed end-to-end in this environment - run `npm run test:e2e`
locally once before relying on them, the same way `npm test` and
`npm run build` are already verified locally rather than in the assistant's
sandbox.

## How the Server Action test works, and what it does and doesn't prove

`lib/actions/quotes.test.ts` replaces `createClient()` (from
`lib/supabase/server.ts`) with a small hand-built mock that mimics
Supabase's chainable, "thenable" query builder (`.from().select().eq()...`)
and returns pre-set results instead of talking to a real database. This
proves that the *action's own code* makes the right decision - refuse to
act - the moment an ownership lookup comes back empty, whether that
lookup came back empty because the row doesn't exist or because it
belongs to someone else.

It does **not** re-test Row Level Security itself - RLS is a database-level
guarantee enforced by Postgres, not by this TypeScript code, and is
documented separately (with the actual policies) in the security document.
Mocking Supabase means this test can't catch a bug in the RLS policies
themselves - only a bug in how the Server Action responds to what RLS (or
an empty result) hands back.

## What is still not covered, and why

- **`auth.ts`'s success paths** (`redirect("/onboarding")`, `redirect("/dashboard")`)
  and `signOutAction` - every test added only exercises the branches that
  return *before* `redirect()` is called, since redirecting throws a
  special Next.js control-flow error that would need `next/navigation`
  mocked too. These paths were verified manually instead (signing up and
  logging in on the live deployment).
- **Other Server Actions** (`branding.ts`, `business-profile.ts`,
  `pricing.ts`, `profile-media.ts`) - `quotes.ts` and `auth.ts` were picked
  first because they cover the two most security-relevant patterns
  (ownership checks, anti-enumeration); the same mocking approach would
  extend directly to the others, but doing all of them was a larger scope
  than this pass.
- **Pages / React components** - would need `@testing-library/react` (or
  similar) plus a jsdom environment, and most pages here are async Server
  Components that fetch from Supabase directly - the same blocker as
  Server Actions.
- **File upload** (`profile-media.ts`) - still only verified manually
  against the live Vercel deployment; the two Playwright specs above don't
  touch Storage.

## If continuing this work

Apply the same Supabase-mocking pattern to the remaining Server Actions,
starting with `profile-media.ts` (the file-upload ownership +
path-sanitization checks) - the mock would also need extending to fake
`supabase.storage`, which none of the current tests do yet, since none of
the other Server Actions touch Storage.
