-- Adds the "prepare your public page" content: three free-text fields the
-- owner fills in herself (not generated, unlike branding_profiles), one
-- profile photo, and any number of supporting documents (certificates,
-- brochures, etc). Run this whole file once in the SQL Editor.

-- ==========================================================
-- 1. Text fields + photo - simple columns on business_profiles, since
--    they're 1:1 just like business_name/slug already are.
-- ==========================================================
alter table business_profiles add column about_me text;
alter table business_profiles add column experience_text text;
alter table business_profiles add column additional_info text;
alter table business_profiles add column photo_url text;

-- ==========================================================
-- 2. business_profile_documents (1:N - a business can have several)
-- ==========================================================
create table business_profile_documents (
  id uuid primary key default gen_random_uuid(),
  business_profile_id uuid not null references business_profiles(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

alter table business_profile_documents enable row level security;

grant select, insert, delete on business_profile_documents to authenticated;
-- Also readable by anonymous visitors - same idea as public_business_profiles:
-- nothing sensitive in here (just a file name + a public Storage URL), and
-- the whole point is that clients on the public page can open these files.
grant select on business_profile_documents to anon;

create policy "owner can manage own documents" on business_profile_documents
  for all using (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  ) with check (
    exists (select 1 from business_profiles bp where bp.id = business_profile_id and bp.user_id = auth.uid())
  );

create policy "anyone can read documents" on business_profile_documents
  for select to anon using (true);

-- ==========================================================
-- 3. Storage bucket for the photo + documents themselves
-- ==========================================================
insert into storage.buckets (id, name, public)
values ('public-media', 'public-media', true)
on conflict (id) do nothing;

-- Files are stored under a path like "public-media/<business_profile_id>/photo.jpg"
-- or "public-media/<business_profile_id>/documents/<filename>" - the first
-- path segment is always the owner's business_profile_id, which is what the
-- upload/delete policies check against.
create policy "public read access to public-media" on storage.objects
  for select using (bucket_id = 'public-media');

create policy "owners can upload to their own folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'public-media'
    and (storage.foldername(name))[1] in (
      select id::text from business_profiles where user_id = auth.uid()
    )
  );

create policy "owners can delete from their own folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'public-media'
    and (storage.foldername(name))[1] in (
      select id::text from business_profiles where user_id = auth.uid()
    )
  );

-- ==========================================================
-- 4. Extend the public view with the new fields + the profile's own id
--    (needed to look up its documents in a second query - the id itself
--    isn't sensitive, it's just an internal key, same as elsewhere in the app).
-- ==========================================================
-- CREATE OR REPLACE VIEW can only append new columns at the end, not
-- reorder existing ones - business_profile_id needs to come before slug
-- for readability, so the view has to be dropped and recreated instead.
drop view if exists public_business_profiles;

create view public_business_profiles as
select
  bp.id as business_profile_id,
  bp.slug,
  bp.business_name,
  bp.profession,
  bp.about_me,
  bp.experience_text,
  bp.additional_info,
  bp.photo_url,
  br.uvp_statement,
  br.website_text,
  br.linkedin_text,
  br.sales_pitch
from business_profiles bp
left join branding_profiles br on br.business_profile_id = bp.id;

grant select on public_business_profiles to anon, authenticated;
