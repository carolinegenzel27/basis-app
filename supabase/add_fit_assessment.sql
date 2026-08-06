-- Basis - adds the "fit assessment" questionnaire (5 questions -> recommend
-- pricing advisor and/or branding). Safe to run once in Supabase SQL Editor.
-- One row per business (like branding_profiles) - re-taking the quiz updates
-- the same row instead of creating a new one.

create table fit_assessments (
  id uuid primary key default gen_random_uuid(),
  business_profile_id uuid not null unique references business_profiles(id) on delete cascade,
  answers jsonb not null,
  pricing_score numeric not null,
  branding_score numeric not null,
  recommendation text not null check (recommendation in ('pricing', 'branding', 'both')),
  created_at timestamptz not null default now()
);

alter table fit_assessments enable row level security;

grant select, insert, update on fit_assessments to authenticated;

create policy "read own fit assessment" on fit_assessments
  for select using (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  );

create policy "insert own fit assessment" on fit_assessments
  for insert with check (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  );

create policy "update own fit assessment" on fit_assessments
  for update using (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  );
