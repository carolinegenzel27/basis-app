import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteQuote } from "@/lib/actions/quotes";
import { ui } from "@/lib/ui";
import { PageHeader } from "@/components/ui/PageHeader";
import { QuoteDoc } from "@/components/illustrations/BusinessIcons";

// Kept as a plain constant (not imported from lib/pdf/QuoteDocument) so this
// page doesn't pull @react-pdf/renderer into its bundle just to know the
// fallback title string.
const DEFAULT_QUOTE_TITLE = "הצעת מחיר";

// Pagination - see Basis_מסמך_סקייל_בסיסי.pdf section 5. Page-based via a
// URL search param (?page=2), which is the idiomatic Next.js App Router
// pattern for a Server Component: no client-side state, no extra Server
// Action, the URL itself is the source of truth and is shareable/bookmarkable.
const PAGE_SIZE = 10;

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const from = (page - 1) * PAGE_SIZE;
  // Ask for one extra row past the page size - if it comes back, there's a
  // next page. Avoids a separate COUNT(*) query just to know that.
  const to = from + PAGE_SIZE;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!businessProfile) {
    redirect("/onboarding");
  }

  const { data: fitAssessment } = await supabase
    .from("fit_assessments")
    .select("id")
    .eq("business_profile_id", businessProfile.id)
    .maybeSingle();

  if (!fitAssessment) {
    redirect("/fit-assessment");
  }

  const { data: quotesPageRows } = await supabase
    .from("quotes")
    .select("id, client_name, project_description, price, created_at, document_title")
    .eq("business_profile_id", businessProfile.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  const hasNextPage = (quotesPageRows?.length ?? 0) > PAGE_SIZE;
  const quotes = (quotesPageRows ?? []).slice(0, PAGE_SIZE);

  return (
    <div className={`${ui.pageNarrow} space-y-8`}>
      <PageHeader
        title="הצעות מחיר"
        subtitle="כל ההצעות ששלחת, מוכנות להורדה ולשכפול."
        icon={<QuoteDoc className="w-10 h-10" />}
        tint="bg-sky-soft"
        actions={
          <a href="/quotes/new" className={ui.btnPrimary}>
            + הצעה חדשה
          </a>
        }
      />

      {page === 1 && (!quotes || quotes.length === 0) && (
        <div className={`${ui.card} p-10 text-center space-y-3`}>
          <QuoteDoc className="w-16 h-16 mx-auto" />
          <p className="text-lg font-bold">עדיין אין הצעות מחיר</p>
          <p className={ui.muted}>הצעה ראשונה לוקחת פחות מדקה.</p>
          <a href="/quotes/new" className={`${ui.btnPrimary} mt-2`}>
            יצירת הצעה ראשונה
          </a>
        </div>
      )}

      <ul className="space-y-3">
        {quotes?.map((quote) => (
          <li key={quote.id} className={`${ui.card} p-5 sm:p-6`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink/45">
                  {quote.document_title || DEFAULT_QUOTE_TITLE} ·{" "}
                  {new Date(quote.created_at).toLocaleDateString("he-IL")}
                </p>
                <p className="mt-1 text-lg font-bold truncate">{quote.client_name}</p>
                {quote.project_description && (
                  <p className="text-ink/60 mt-0.5">{quote.project_description}</p>
                )}
              </div>
              <p className="text-xl font-extrabold whitespace-nowrap">
                {Number(quote.price).toLocaleString("he-IL")} ₪
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-ink/[0.06]">
              <a href={`/api/quotes/${quote.id}/pdf`} className={ui.btnSmall}>
                הורדת PDF
              </a>
              <a href={`/quotes/new?duplicateFrom=${quote.id}`} className={ui.btnSmall}>
                שכפול
              </a>
              <form
                className="ms-auto"
                action={async () => {
                  "use server";
                  await deleteQuote(quote.id);
                }}
              >
                <button type="submit" className={ui.linkDanger}>
                  מחיקה
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>

      {(page > 1 || hasNextPage) && (
        <nav aria-label="עמודי הצעות" className="flex items-center justify-between pt-2 text-sm">
          {page > 1 ? (
            <a href={`/quotes?page=${page - 1}`} className={ui.btnSmall}>
              &rarr; הצעות קודמות
            </a>
          ) : (
            <span />
          )}
          <span className="text-ink/45 font-semibold">עמוד {page}</span>
          {hasNextPage ? (
            <a href={`/quotes?page=${page + 1}`} className={ui.btnSmall}>
              הצעות הבאות &larr;
            </a>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
