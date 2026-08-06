-- Fix: "permission denied for table X" errors.
-- Because "Automatically expose new tables" was left OFF when creating the
-- Supabase project (the recommended, more secure choice), tables don't get
-- base read/write privileges for the `authenticated` role by default.
-- RLS policies only RESTRICT access - they don't grant it in the first place.
-- Run this once, in addition to schema.sql.

grant select, insert, update on business_profiles to authenticated;
grant select, insert, update on branding_profiles to authenticated;
grant select on market_pricing_data to authenticated;
grant select, insert on pricing_recommendations to authenticated;
grant select, insert, delete on quotes to authenticated;
grant select on public_business_profiles to anon, authenticated;
