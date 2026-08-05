-- Basis - database schema
-- Run once in Supabase: SQL Editor -> New query -> Paste -> Run

-- ==========================================================
-- 1. business_profiles
-- ==========================================================
create table business_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  business_name text not null,
  profession text not null check (profession in ('driving_instructor', 'dietitian', 'private_chef')),
  years_experience integer,
  team_size integer,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table business_profiles enable row level security;

-- Base privileges for the API role - required because this project was
-- created with "Automatically expose new tables" turned OFF.
grant select, insert, update on business_profiles to authenticated;

create policy "read own profile" on business_profiles
  for select using (auth.uid() = user_id);

create policy "insert own profile" on business_profiles
  for insert with check (auth.uid() = user_id);

create policy "update own profile" on business_profiles
  for update using (auth.uid() = user_id);

-- ==========================================================
-- 2. branding_profiles
-- ==========================================================
create table branding_profiles (
  id uuid primary key default gen_random_uuid(),
  business_profile_id uuid not null unique references business_profiles(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  uvp_statement text,
  website_text text,
  linkedin_text text,
  sales_pitch text,
  updated_at timestamptz not null default now()
);

alter table branding_profiles enable row level security;

grant select, insert, update on branding_profiles to authenticated;

create policy "read own branding" on branding_profiles
  for select using (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  );

create policy "insert own branding" on branding_profiles
  for insert with check (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  );

create policy "update own branding" on branding_profiles
  for update using (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  );

-- ==========================================================
-- 3. market_pricing_data (reference table, read-only from the app)
-- ==========================================================
create table market_pricing_data (
  id uuid primary key default gen_random_uuid(),
  profession text not null check (profession in ('driving_instructor', 'dietitian', 'private_chef')),
  project_type text not null,
  project_type_label text not null,
  price_min numeric not null,
  price_max numeric not null,
  source text,
  updated_at timestamptz not null default now()
);

alter table market_pricing_data enable row level security;

grant select on market_pricing_data to authenticated;

create policy "any logged in user can read pricing data" on market_pricing_data
  for select to authenticated using (true);

-- Seed data - TODO: replace with real figures from the chosen rating site before final submission
insert into market_pricing_data (profession, project_type, project_type_label, price_min, price_max, source) values
  ('driving_instructor', 'single_lesson', 'Single lesson', 130, 180, 'placeholder'),
  ('driving_instructor', 'package_10', '10-lesson package', 1100, 1500, 'placeholder'),
  ('driving_instructor', 'test_prep_intensive', 'Intensive test prep', 200, 280, 'placeholder'),
  ('dietitian', 'single_consultation', 'Single consultation', 300, 450, 'placeholder'),
  ('dietitian', 'monthly_program', 'Monthly program', 800, 1200, 'placeholder'),
  ('dietitian', 'follow_up_session', 'Follow-up session', 150, 250, 'placeholder'),
  ('private_chef', 'single_dinner_event', 'Single dinner event', 800, 1500, 'placeholder'),
  ('private_chef', 'weekly_meal_prep', 'Weekly meal prep', 1200, 2000, 'placeholder'),
  ('private_chef', 'catering_small_event', 'Small event catering', 2500, 5000, 'placeholder');

-- ==========================================================
-- 4. pricing_recommendations (append-only history)
-- ==========================================================
create table pricing_recommendations (
  id uuid primary key default gen_random_uuid(),
  business_profile_id uuid not null references business_profiles(id) on delete cascade,
  profession text not null,
  project_type text not null,
  project_type_label text not null,
  recommended_min numeric not null,
  recommended_max numeric not null,
  created_at timestamptz not null default now()
);

alter table pricing_recommendations enable row level security;

grant select, insert on pricing_recommendations to authenticated;

create policy "read own recommendations" on pricing_recommendations
  for select using (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  );

create policy "insert own recommendations" on pricing_recommendations
  for insert with check (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  );

-- ==========================================================
-- 5. quotes
-- ==========================================================
create table quotes (
  id uuid primary key default gen_random_uuid(),
  business_profile_id uuid not null references business_profiles(id) on delete cascade,
  pricing_recommendation_id uuid references pricing_recommendations(id) on delete set null,
  client_name text not null,
  client_email text not null,
  project_description text,
  price numeric not null check (price > 0),
  created_at timestamptz not null default now()
);

alter table quotes enable row level security;

grant select, insert, delete on quotes to authenticated;

create policy "read own quotes" on quotes
  for select using (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  );

create policy "insert own quotes" on quotes
  for insert with check (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  );

create policy "delete own quotes" on quotes
  for delete using (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  );

-- ==========================================================
-- 6. public_business_profiles (view) - powers the public /p/[slug] page
-- ==========================================================
create view public_business_profiles as
select
  bp.slug,
  bp.business_name,
  bp.profession,
  br.uvp_statement,
  br.website_text,
  br.linkedin_text,
  br.sales_pitch
from business_profiles bp
left join branding_profiles br on br.business_profile_id = bp.id;

grant select on public_business_profiles to anon, authenticated;