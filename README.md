# Basis

Basis is a leverage platform for small business owners and freelancers -
driving instructors, dietitians, and private chefs. It takes a small amount
of input from the owner (a short questionnaire, filled once) and turns it
into professional output: marketing content, a data-backed pricing
recommendation, price-quote PDFs for clients, and a public business page
that can be shared with anyone.

**No external API dependency**: marketing content is generated from fixed
templates, pricing recommendations come from a pre-loaded reference table,
and PDFs are rendered on the server - no AI service or third-party API is
called at runtime. This is a deliberate architecture choice: the app is
deterministic, fast, free to run, and can't go down because a third-party
service did.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Supabase** - Postgres database, Auth, and file Storage in one project
- **Tailwind CSS v4**
- **Zod** - server-side validation on every write
- **@react-pdf/renderer** - server-side PDF generation (quotes)
- **Vitest** - unit tests (see `TESTING.md`)
- **Vercel** - hosting/deployment

## Prerequisites

- Node.js 20+ and npm
- A free [Supabase](https://supabase.com) project

## 1. Install dependencies

```bash
npm install
```

## 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in the Supabase dashboard and run the following
   files, **in this exact order** (each one builds on the last):

   ```
   supabase/schema.sql
   supabase/fix_grants.sql
   supabase/add_quote_title.sql
   supabase/add_fit_assessment.sql
   supabase/add_profile_media.sql
   supabase/fix_profile_view.sql
   supabase/update_pricing_real_data.sql
   ```

3. Go to **Settings → API** and copy the **Project URL**, the **anon
   public** key, and the **service_role** key (keep this one secret).

## 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in the three values from step 2:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`.env.local` is already git-ignored - never commit real keys.

## 4. Run the app locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create an account
through the signup page to try the full flow: onboarding → fit assessment →
dashboard → pricing advisor / branding / quotes / public profile.

## Running tests

```bash
npm test          # run once
npm run test:watch  # watch mode
```

See `TESTING.md` for what's covered and why.

## Linting

```bash
npm run lint
```

## Deploying (Vercel)

1. Push the repo to GitHub, then import it as a New Project in
   [Vercel](https://vercel.com).
2. Add the same three environment variables from step 3 in the Vercel
   project's **Settings → Environment Variables**.
3. Deploy. Vercel builds and redeploys automatically on every push.
4. **Critical last step**: in Supabase, go to **Authentication → URL
   Configuration** and set:
   - **Site URL** to your production Vercel domain
     (`https://your-app.vercel.app`)
   - **Redirect URLs** to the same domain with `/**` appended

   Without this step, signup/login on the live deployed site will not work
   - Supabase Auth will reject the redirect because it doesn't recognize
     the domain yet.

## Project structure

```
app/
  (public)/       pages that don't require login: landing, login, signup,
                   and the public /p/[slug] business page
  (private)/      pages behind auth: onboarding, fit-assessment, dashboard,
                   branding, pricing-advisor, quotes, public-profile
  api/quotes/[id]/pdf/  the one API route - renders and returns a quote PDF
components/
  forms/          all form components (Client Components)
  ui/             small reusable UI pieces
  layout/         Navbar
lib/
  actions/        Server Actions - all writes go through these
  validations/     Zod schemas - the same ones used client- and server-side
  templates/       branding questions + the rule-based content generator
  fit-assessment/  quiz questions + scoring logic
  pdf/             the quote PDF document + the Hebrew/bidi text fix
  supabase/        client creation (browser, server, admin)
supabase/
  schema.sql and migration files - run manually in the Supabase SQL Editor
proxy.ts           runs before every request; refreshes the auth session
                    cookie (the Next.js 16 equivalent of middleware.ts)
```

## Further reading

- `TESTING.md` - what's unit-tested and why, and what's intentionally out
  of scope
- `Basis_מסמך_אבטחה.docx` - security architecture: auth, RLS policies,
  file upload validation, secrets handling (supplied separately)
- `Basis_מסמך_סקיילביליות.docx` - current scale bottlenecks and the
  concrete growth path (supplied separately)
