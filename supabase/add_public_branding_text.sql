-- Lets the owner choose whether her branding-generated UVP / website text
-- shows on her public page, and edit the wording however she wants (e.g.
-- change "אני עוזר/ת" to "אנחנו עוזרים", or delete it entirely).
--
-- Two new columns hold HER OWN edited copy, separate from
-- branding_profiles.uvp_statement/website_text (which stay as the
-- auto-generated output of the מיתוג questionnaire and can be
-- re-generated any time without touching what's actually published).
-- Run this whole file once in the SQL Editor.

-- ==========================================================
-- 1. New columns on business_profiles
-- ==========================================================
alter table business_profiles add column public_uvp_text text;
alter table business_profiles add column public_website_text text;

-- ==========================================================
-- 2. Point the public view at the new columns instead of
--    branding_profiles directly - same column names (uvp_statement,
--    website_text) so the public page component doesn't need to change.
-- ==========================================================
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
  bp.public_website_text as website_text,
  br.linkedin_text,
  br.sales_pitch
from business_profiles bp
left join branding_profiles br on br.business_profile_id = bp.id;

grant select on public_business_profiles to anon, authenticated;
