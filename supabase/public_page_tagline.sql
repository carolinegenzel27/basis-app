-- Basis - let the owner control the opening line of their public page
-- (e.g. "עסק קטן, לב גדול"): keep the automatic one, write their own, or
-- remove it. Run once in Supabase SQL Editor, after any_business_ai.sql.
-- Safe to re-run.
--
-- public_tagline semantics:
--   null  -> use the automatic line for the kind of business
--   ''    -> the owner removed it, show nothing
--   text  -> the owner's own line

alter table business_profiles
  add column if not exists public_tagline text;

-- Same view as fix_public_access.sql, plus the new column at the end
-- ("create or replace" may only append columns).
create or replace view public_business_profiles as
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
  bp.public_tagline
from business_profiles bp;

grant select on public_business_profiles to anon, authenticated;
