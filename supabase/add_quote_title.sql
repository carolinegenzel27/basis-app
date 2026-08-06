-- Lets the user override the PDF's document title (e.g. "הצעת מחיר - שיעורי נהיגה")
-- instead of always getting the generic "הצעת מחיר". Nullable - when left empty,
-- the app falls back to the default "הצעת מחיר" at read time (see QuoteDocument.tsx),
-- so no backfill is needed for existing rows.
alter table quotes add column document_title text;
