import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteQuote } from "@/lib/actions/quotes";

// Kept as a plain constant (not imported from lib/pdf/QuoteDocument) so this
// page doesn't pull @react-pdf/renderer into its bundle just to know the
// fallback title string.
const DEFAULT_QUOTE_TITLE = "הצעת מחיר";

export default async function QuotesPage() {
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

  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, client_name, project_description, price, created_at, document_title")
    .eq("business_profile_id", businessProfile.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">הצעות מחיר</h1>
        <a
          href="/quotes/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-white text-sm font-medium hover:bg-slate-800"
        >
          + הצעה חדשה
        </a>
      </div>

      {(!quotes || quotes.length === 0) && (
        <p className="text-gray-500 text-sm">עדיין אין הצעות מחיר. אפשר להתחיל ליצור הצעה חדשה.</p>
      )}

      <ul className="space-y-3">
        {quotes?.map((quote) => (
          <li key={quote.id} className="rounded-lg border border-gray-200 p-4 space-y-2">
            <p className="text-xs text-gray-400">
              {quote.document_title || DEFAULT_QUOTE_TITLE}
            </p>
            <div className="flex items-center justify-between">
              <p className="font-medium">{quote.client_name}</p>
              <p className="font-bold">{Number(quote.price).toLocaleString("he-IL")} ₪</p>
            </div>
            {quote.project_description && (
              <p className="text-sm text-gray-600">{quote.project_description}</p>
            )}
            <p className="text-xs text-gray-400">
              {new Date(quote.created_at).toLocaleDateString("he-IL")}
            </p>
            <div className="flex items-center gap-4 pt-1 text-sm">
              <a href={`/api/quotes/${quote.id}/pdf`} className="text-slate-900 underline">
                הורדת PDF
              </a>
              <a href={`/quotes/new?duplicateFrom=${quote.id}`} className="text-slate-900 underline">
                שכפול
              </a>
              <form
                action={async () => {
                  "use server";
                  await deleteQuote(quote.id);
                }}
              >
                <button type="submit" className="text-red-600 underline">
                  מחיקה
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
