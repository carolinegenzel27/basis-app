-- Basis - open the app to every kind of small business + AI pricing/branding
-- Run once in Supabase SQL Editor, after all the other migration files.
-- Safe to re-run (every statement is "if exists" / "if not exists").

-- ==========================================================
-- 1. Profession becomes free text (e.g. "קונדיטורית", "מניקוריסטית")
-- ==========================================================
-- The original 3-value check constraint is what locked the app to driving
-- instructors / dietitians / private chefs. Existing rows keep their old
-- keys (the public page still maps them to Hebrew labels).
alter table business_profiles
  drop constraint if exists business_profiles_profession_check;

alter table market_pricing_data
  drop constraint if exists market_pricing_data_profession_check;

-- Optional free-text description of what the business actually sells -
-- gives the AI market search more to go on than a one-word profession.
alter table business_profiles
  add column if not exists business_description text;

-- ==========================================================
-- 2. business_pricing_options - per-business price list found by the AI
--    market search (replaces the fixed per-profession market_pricing_data
--    rows for new businesses)
-- ==========================================================
create table if not exists business_pricing_options (
  id uuid primary key default gen_random_uuid(),
  business_profile_id uuid not null references business_profiles(id) on delete cascade,
  project_type text not null,
  project_type_label text not null,
  price_min numeric not null check (price_min >= 0),
  price_max numeric not null check (price_max >= price_min),
  source text,
  created_at timestamptz not null default now(),
  unique (business_profile_id, project_type)
);

alter table business_pricing_options enable row level security;

grant select, insert, delete on business_pricing_options to authenticated;

drop policy if exists "read own pricing options" on business_pricing_options;
create policy "read own pricing options" on business_pricing_options
  for select using (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  );

drop policy if exists "insert own pricing options" on business_pricing_options;
create policy "insert own pricing options" on business_pricing_options
  for insert with check (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  );

drop policy if exists "delete own pricing options" on business_pricing_options;
create policy "delete own pricing options" on business_pricing_options
  for delete using (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  );

create index if not exists business_pricing_options_profile_idx
  on business_pricing_options (business_profile_id);

-- ==========================================================
-- 3. branding_profiles.ai_ideas - every AI-generated idea, grouped by
--    category ({ "slogans": [...], "uvp_statement": [...], ... })
-- ==========================================================
alter table branding_profiles
  add column if not exists ai_ideas jsonb;
