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

**45 tests total, across 4 files, all passing** (`npm test`).

## What is deliberately NOT covered in this pass, and why

- **Server Actions** (`lib/actions/*.ts`) - every one of them calls
  `createClient()` and talks to Supabase for auth + DB reads/writes.
  Testing them meaningfully needs either a real Supabase test project or a
  hand-built mock of the Supabase JS client's query builder - both are
  real, valuable next steps, but a larger scope than this pass. The
  validation layer these actions depend on (see table above) is fully
  covered instead, since that's where most realistic bugs and all
  injection-style risks actually live.
- **Pages / React components** - would need `@testing-library/react` (or
  similar) plus a jsdom environment, and most pages here are async Server
  Components that fetch from Supabase directly - the same blocker as
  Server Actions.
- **End-to-end flows** (signup → onboarding → quote → PDF download) - this
  was instead verified manually against the live Vercel deployment
  (signup, PDF generation, and file upload were each exercised by hand
  after deploying).

## If continuing this work

The highest-value next step would be extracting the Supabase calls in one
representative Server Action (e.g. `createQuote`) behind a thin interface
that can be swapped for an in-memory fake in tests - this is the standard
pattern for testing code that currently calls `createClient()` directly,
and would unlock testing the ownership-check logic (a security-relevant
code path) without needing a real database.
