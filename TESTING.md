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

**56 tests total, across 5 files, all passing** (`npm test`).

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

- **Other Server Actions** (`lib/actions/auth.ts`, `branding.ts`,
  `business-profile.ts`, `pricing.ts`, `profile-media.ts`) - `quotes.ts`
  was picked as the representative example because it has the clearest
  ownership-check pattern; the same mocking approach would extend
  directly to the others, but doing all of them was a larger scope than
  this pass.
- **Pages / React components** - would need `@testing-library/react` (or
  similar) plus a jsdom environment, and most pages here are async Server
  Components that fetch from Supabase directly - the same blocker as
  Server Actions.
- **End-to-end flows** (signup → onboarding → quote → PDF download) - this
  was instead verified manually against the live Vercel deployment
  (signup, PDF generation, and file upload were each exercised by hand
  after deploying).

## If continuing this work

Apply the same Supabase-mocking pattern used in `lib/actions/quotes.test.ts`
to the remaining Server Actions, starting with `auth.ts` (the sign-up
user-enumeration behavior) and `profile-media.ts` (the file-upload
ownership + path-sanitization checks) - these are the two other files
where a silent bug would be most security-relevant.
