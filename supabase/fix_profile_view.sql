-- Everything else in add_profile_media.sql already ran successfully - this
-- is just the one failing statement, fixed. Run this on its own, not the
-- whole file again (the earlier parts would error with "already exists").
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
