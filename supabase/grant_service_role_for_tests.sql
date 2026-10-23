-- Basis - grants service_role write access on the tables the Playwright
-- e2e test helpers seed directly (tests/e2e/helpers.ts).
--
-- Not required for the app itself - every real feature goes through the
-- regular client (anon key + user session) and relies on RLS, never on
-- service_role. This project was created with "Automatically expose new
-- tables" turned off (see schema.sql line 20-21), so - same as every other
-- role in this project - service_role was never automatically granted
-- anything either; it only had RLS-bypass power with nothing to use it on.
--
-- Safe to run once in Supabase SQL Editor. NOT part of the app's required
-- setup order in Basis_הוראות_הרצה_מקומית - only needed if you're running
-- `npm run test:e2e`.

grant select, insert, delete on business_profiles to service_role;
grant select, insert, delete on fit_assessments to service_role;
grant select, insert, delete on quotes to service_role;
-- Added for tests/e2e/public-access.spec.ts, which seeds a draft branding
-- row and a document row to check what the public API hands out.
grant select, insert, delete on branding_profiles to service_role;
grant select, insert, delete on business_profile_documents to service_role;
