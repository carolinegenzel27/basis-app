-- Fixes two issues raised in the course review. Run this whole file once in
-- the Supabase SQL Editor, after every earlier migration.

-- ==========================================================
-- 1. public_business_profiles exposed unpublished drafts
-- ==========================================================
-- The previous version joined branding_profiles and selected linkedin_text
-- and sales_pitch. The public page never shows them, but the view is
-- granted to anon - so anyone with the public anon key could request those
-- columns straight from the REST API (/rest/v1/public_business_profiles?
-- select=linkedin_text,sales_pitch). Hiding a column in the UI is not the
-- same as not exposing it.
--
-- The view now returns ONLY what the public page actually renders. The
-- uvp_statement / website_text columns already come from the owner's own
-- published copy on business_profiles (add_public_branding_text.sql), so
-- the branding_profiles join is no longer needed at all.
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
  bp.public_uvp_text as uvp_statement,
  bp.public_website_text as website_text
from business_profiles bp;

grant select on public_business_profiles to anon, authenticated;

-- ==========================================================
-- 2. Public documents were readable by anon but not by other signed-in users
-- ==========================================================
-- The old "anyone can read documents" policy was scoped "to anon" only. A
-- signed-in visitor runs as the "authenticated" role, so the only policy
-- that applied to her was "owner can manage own documents" - meaning a
-- logged-in business owner opening SOMEONE ELSE's public page saw no
-- documents, while a logged-out visitor saw all of them.
--
-- Public reads now apply to both roles. Writes are unchanged: insert and
-- delete still go through the owner-only policy.
drop policy if exists "anyone can read documents" on business_profile_documents;

create policy "anyone can read documents" on business_profile_documents
  for select to anon, authenticated using (true);
