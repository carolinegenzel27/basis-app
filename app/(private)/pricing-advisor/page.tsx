import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PricingAdvisorForm,
  PricingSearchForm,
  RefreshMarketSearchButton,
} from "@/components/forms/PricingAdvisorForm";
import { professionLabel } from "@/lib/professions";
import { PriceTag, Sparkle } from "@/components/illustrations/BusinessIcons";

// The search forms on this page run the AI market search, which can take up
// to a minute - give their Server Actions room to finish.
export const maxDuration = 120;

export default async function PricingAdvisorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("id, profession, business_name")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (businessProfile) {
    const { data: fitAssessment } = await supabase
      .from("fit_assessments")
      .select("id")
      .eq("business_profile_id", businessProfile.id)
      .maybeSingle();

    if (!fitAssessment) {
      redirect("/fit-assessment");
    }
  }

  if (!businessProfile) {
    return (
      <div className="max-w-lg mx-auto p-8">
        <p className="text-gray-600">
          יש להשלים קודם את פרופיל העסק ב-onboarding.
        </p>
      </div>
    );
  }

  // This business's own options, found by the AI market search. Businesses
  // created before the search existed fall back to the fixed table.
  const { data: ownOptions } = await supabase
    .from("business_pricing_options")
    .select("project_type, project_type_label")
    .eq("business_profile_id", businessProfile.id)
    .order("created_at");

  const options =
    ownOptions && ownOptions.length > 0
      ? ownOptions
      : (
          await supabase
            .from("market_pricing_data")
            .select("project_type, project_type_label")
            .eq("profession", businessProfile.profession)
            .order("project_type_label")
        ).data ?? [];
  const hasOptions = options.length > 0;

  const { data: history } = await supabase
    .from("pricing_recommendations")
    .select("id, project_type_label, recommended_min, recommended_max, created_at")
    .eq("business_profile_id", businessProfile.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      <div className="relative rounded-3xl bg-sun-soft border-2 border-ink p-6 shadow-[5px_5px_0_#1e1b4b] overflow-hidden">
        <PriceTag className="absolute -bottom-3 -left-2 w-24 rotate-[-12deg] opacity-90" />
        <Sparkle className="absolute top-4 left-24 w-6 animate-wiggle" />
        <h1 className="text-3xl font-extrabold text-blue-950">יועץ תמחור</h1>
        <p className="text-ink/70 mt-1 max-w-md">
          מחירים שמצאנו בשוק עבור {professionLabel(businessProfile.profession)}. בחרו שירות וקבלו
          טווח מחיר מומלץ.
        </p>
      </div>

      {hasOptions ? (
        <PricingAdvisorForm businessProfileId={businessProfile.id} options={options} />
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-ink/20 bg-white p-6 text-center space-y-2">
          <p className="font-semibold text-blue-950">עוד לא חיפשנו מחירים לעסק שלך</p>
          <p className="text-sm text-ink/60">לחיצה אחת - ונחפש בשוק מה עסקים כמו שלך גובים.</p>
        </div>
      )}

      <div className="rounded-2xl bg-white border-2 border-ink/10 p-5 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-bold text-blue-950">
            {hasOptions ? "לא מצאת את מה שאת/ה מוכר/ת?" : "חיפוש מחירים בשוק"}
          </h2>
          {hasOptions && <RefreshMarketSearchButton businessProfileId={businessProfile.id} />}
        </div>
        <PricingSearchForm businessProfileId={businessProfile.id} hasOptions={hasOptions} />
      </div>

      {history && history.length > 0 && (
        <div className="pt-6 border-t-2 border-ink/10">
          <h2 className="text-lg font-bold text-blue-950 mb-3">המלצות קודמות</h2>
          <ul className="space-y-2">
            {history.map((h) => (
              <li key={h.id} className="flex items-center justify-between text-sm text-ink/70 bg-white rounded-xl px-4 py-2.5 border border-ink/10">
                <span>
                  {h.project_type_label}: <span className="font-semibold text-ink">{h.recommended_min}-{h.recommended_max} ₪</span>
                </span>
                <a
                  href={`/quotes/new?recommendationId=${h.id}`}
                  className="text-blue-800 underline text-xs shrink-0 ms-3"
                >
                  יצירת הצעת מחיר
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
