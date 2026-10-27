import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PricingAdvisorForm,
  PricingSearchForm,
  RefreshMarketSearchButton,
} from "@/components/forms/PricingAdvisorForm";
import { professionLabel } from "@/lib/professions";
import { PriceTag } from "@/components/illustrations/BusinessIcons";
import { ui } from "@/lib/ui";
import { PageHeader } from "@/components/ui/PageHeader";

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
      <div className={ui.pageNarrow}>
        <p className={ui.muted}>
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
    <div className={`${ui.pageNarrow} space-y-6`}>
      <PageHeader
        title="יועץ תמחור"
        subtitle={<>מחירים שמצאנו בשוק עבור {professionLabel(businessProfile.profession)}. בוחרים שירות ומקבלים טווח מחיר מומלץ.</>}
        icon={<PriceTag className="w-10 h-10" />}
        tint="bg-sun-soft"
      />

      <div className={`${ui.card} ${ui.cardPad}`}>
        {hasOptions ? (
          <PricingAdvisorForm businessProfileId={businessProfile.id} options={options} />
        ) : (
          <div className="text-center space-y-2 py-4">
            <PriceTag className="w-14 h-14 mx-auto" />
            <p className="text-lg font-bold">עוד לא חיפשנו מחירים לעסק שלך</p>
            <p className={ui.muted}>לחיצה אחת - ונחפש בשוק מה עסקים כמו שלך גובים.</p>
          </div>
        )}
      </div>

      <div className={`${ui.card} ${ui.cardPad} space-y-4`}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className={ui.h2}>
            {hasOptions ? "לא מצאת את מה שאת/ה מוכר/ת?" : "חיפוש מחירים בשוק"}
          </h2>
          {hasOptions && <RefreshMarketSearchButton businessProfileId={businessProfile.id} />}
        </div>
        <PricingSearchForm businessProfileId={businessProfile.id} hasOptions={hasOptions} />
      </div>

      {history && history.length > 0 && (
        <div className={`${ui.card} ${ui.cardPad}`}>
          <h2 className={`${ui.h2} mb-4`}>המלצות קודמות</h2>
          <ul className="space-y-2">
            {history.map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-3 text-ink/70 rounded-xl px-4 py-3 bg-ink/[0.03]">
                <span>
                  {h.project_type_label}: <span className="font-semibold text-ink">{h.recommended_min}-{h.recommended_max} ₪</span>
                </span>
                <a
                  href={`/quotes/new?recommendationId=${h.id}`}
                  className={`${ui.link} text-sm shrink-0`}
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
