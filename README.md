# Basis

Final project — Internet Technologies (Fullstack) course — Caroline Genzel

**Live site:** [basis-app-sigma.vercel.app](https://basis-app-sigma.vercel.app)

## What is Basis

Basis is a leverage platform for small business owners and freelancers -
driving instructors, dietitians, and private chefs. A small business owner
is usually very good at their craft, but weak on marketing, pricing, and
professional paperwork. The app takes minimal input from them (a short
questionnaire, filled out once) and turns it into professional
deliverables: marketing content, a data-driven price recommendation, price
quotes as PDF files, and a public business page that can be sent to
clients.

## Main Features

- Secure sign-up and login (Supabase Auth)
- Onboarding questionnaire that creates a business profile, including a
  unique public URL (slug)
- Short fit-assessment questionnaire that recommends whether to focus on
  the pricing advisor, branding, or both
- Branding questionnaire that automatically generates 4 marketing content
  pieces (value proposition, website text, LinkedIn text, sales pitch)
- Pricing advisor based on real market data by profession and project type
- Quote creation and PDF export, with correct Hebrew rendering
- Public business page (`/p/[slug]`) with a photo, free text, and
  downloadable documents - accessible without logging in

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Supabase** - Postgres database, Auth, and file storage in one project
- **Tailwind CSS v4**
- **Zod** - server-side validation on every write action
- **@react-pdf/renderer** - server-side PDF generation (quotes)
- **Vitest** - unit tests (see `TESTING.md`)
- **Vercel** - hosting and deployment

## Prerequisites

- Node.js 20+ and npm
- A [Supabase](https://supabase.com) project (free tier works)

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, under **SQL Editor**, run the following
   files, **in this exact order** (each one depends on the ones before
   it):

   ```
   supabase/schema.sql
   supabase/fix_grants.sql
   supabase/add_quote_title.sql
   supabase/add_fit_assessment.sql
   supabase/add_profile_media.sql
   supabase/fix_profile_view.sql
   supabase/update_pricing_real_data.sql
   supabase/add_public_branding_text.sql
   supabase/add_indexes.sql
   ```

3. Under **Settings → API**, copy the **Project URL**, the **anon
   public** key, and the **service_role** key (secret - never expose
   it).

### 3. Set environment variables

```bash
cp .env.local.example .env.local
```

Fill in the three values from step 2:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`.env.local` is already in `.gitignore` - never commit real values in it.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To try the full
flow: sign up, then go through onboarding → fit assessment → dashboard →
pricing advisor / branding / quotes / public page.

## Running Tests

```bash
npm test             # single run
npm run test:watch   # watch mode
```

For full details on what's tested, why, and what's intentionally out of
scope, see `TESTING.md`.

## Lint

```bash
npm run lint
```

## Deployment (Vercel)

1. Push the code to GitHub, then import it as a New Project on
   [Vercel](https://vercel.com).
2. Add the same three environment variables from step 3 under
   **Settings → Environment Variables** in the Vercel project.
3. Deploy - Vercel builds and redeploys automatically on every push.
4. **Final, critical step:** in Supabase, under **Authentication → URL
   Configuration**, set:
   - **Site URL** - the real Vercel domain (`https://the-app.vercel.app`)
   - **Redirect URLs** - the same domain with `/**` at the end

   Without this step, sign-up/login on the live site won't work -
   Supabase Auth will reject the redirect because it doesn't recognize
   the domain.

## Project Structure

```
app/
  (public)/       Pages that don't require login: landing, login,
                   sign-up, and the public business page /p/[slug]
  (private)/      Protected pages: onboarding, fit-assessment, dashboard,
                   branding, pricing-advisor, quotes, public-profile
  api/quotes/[id]/pdf/  The only API Route - generates and returns a PDF
                   file
components/
  forms/          All form components (Client Components)
  ui/             Small, reusable UI components
  layout/         Navbar
lib/
  actions/        Server Actions - every write action goes through them
  validations/    Zod schemas - the same schemas used client- and
                   server-side
  templates/      Branding questions and the rule-based content engine
  fit-assessment/ Questionnaire questions and scoring logic
  pdf/            The PDF document and the Hebrew bidi-text fix
  supabase/       Client creation (browser, server, admin)
supabase/
  schema.sql and migration files - run manually in the Supabase SQL
  Editor
proxy.ts          Runs before every request - refreshes the auth cookie
                   (the Next.js 16 equivalent of middleware.ts)
```
