-- Documents (as real, tracked SQL) three indexes that were already applied
-- directly in the Supabase SQL Editor earlier in the project, so they're
-- no longer only "live in production" with nothing to point to in the repo.
--
-- Why these three specifically: Postgres automatically creates an index on
-- any column with a primary key or unique constraint, but NOT on a plain
-- foreign key column. quotes, pricing_recommendations, and
-- business_profile_documents all get filtered by business_profile_id on
-- nearly every read (e.g. "all quotes for this business"), and none of
-- them had that column marked unique - so without an explicit index,
-- Postgres would have to scan the entire table row by row (a full table
-- scan) to answer that filter, getting slower as each table grows.
--
-- `if not exists` makes this safe to run even though the indexes already
-- exist in the live database - it's a no-op there, not an error.

create index if not exists idx_quotes_business_profile_id
  on quotes(business_profile_id);

create index if not exists idx_pricing_recommendations_business_profile_id
  on pricing_recommendations(business_profile_id);

create index if not exists idx_business_profile_documents_business_profile_id
  on business_profile_documents(business_profile_id);

-- Not needed here, for reference: branding_profiles.business_profile_id,
-- fit_assessments.business_profile_id, and business_profiles.slug are all
-- already indexed automatically, because each is declared `unique` in
-- schema.sql.
