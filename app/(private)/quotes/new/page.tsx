import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { ui } from "@/lib/ui";
import { PageHeader } from "@/components/ui/PageHeader";
import { QuoteDoc } from "@/components/illustrations/BusinessIcons";

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ recommendationId?: string; duplicateFrom?: string }>;
}) {
  const { recommendationId, duplicateFrom } = await searchParams;

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

  // Two possible sources of default values - never both at once, and
  // client name/email are never prefilled from either one.
  let defaultProjectDescription = "";
  let defaultPrice: number | undefined;
  let defaultDocumentTitle = "";
  let pricingRecommendationId: string | undefined;
  // Shown as a reminder note under the price field in the form only - the
  // client-facing PDF deliberately never includes it (the client shouldn't
  // see the quote is based on a market average).
  let marketRange: { min: number; max: number } | undefined;

  if (recommendationId) {
    const { data: recommendation } = await supabase
      .from("pricing_recommendations")
      .select("id, project_type_label, recommended_min, recommended_max")
      .eq("id", recommendationId)
      .eq("business_profile_id", businessProfile.id)
      .maybeSingle();

    if (recommendation) {
      defaultProjectDescription = recommendation.project_type_label;
      defaultPrice = Number(recommendation.recommended_min);
      pricingRecommendationId = recommendation.id;
      marketRange = {
        min: Number(recommendation.recommended_min),
        max: Number(recommendation.recommended_max),
      };
    }
  } else if (duplicateFrom) {
    const { data: original } = await supabase
      .from("quotes")
      .select("project_description, price, document_title, pricing_recommendation_id")
      .eq("id", duplicateFrom)
      .eq("business_profile_id", businessProfile.id)
      .maybeSingle();

    if (original) {
      defaultProjectDescription = original.project_description ?? "";
      defaultPrice = Number(original.price);
      defaultDocumentTitle = original.document_title ?? "";

      // The original quote may itself have been created from a pricing
      // recommendation - carry that link (and its market range) forward so
      // a duplicated quote keeps showing the same in-form reminder.
      if (original.pricing_recommendation_id) {
        const { data: recommendation } = await supabase
          .from("pricing_recommendations")
          .select("id, recommended_min, recommended_max")
          .eq("id", original.pricing_recommendation_id)
          .eq("business_profile_id", businessProfile.id)
          .maybeSingle();

        if (recommendation) {
          pricingRecommendationId = recommendation.id;
          marketRange = {
            min: Number(recommendation.recommended_min),
            max: Number(recommendation.recommended_max),
          };
        }
      }
    }
  }

  return (
    <div className={`${ui.pageNarrow} space-y-6`}>
      <a href="/quotes" className={`${ui.link} text-sm`}>
        &rarr; חזרה לרשימת ההצעות
      </a>
      <PageHeader
        title="הצעת מחיר חדשה"
        subtitle="ממלאים פרטים, ומקבלים PDF מקצועי לשליחה ללקוח."
        icon={<QuoteDoc className="w-10 h-10" />}
        tint="bg-sky-soft"
      />

      <div className={`${ui.card} ${ui.cardPad}`}>
        <QuoteForm
          businessProfileId={businessProfile.id}
          defaultProjectDescription={defaultProjectDescription}
          defaultPrice={defaultPrice}
          defaultDocumentTitle={defaultDocumentTitle}
          pricingRecommendationId={pricingRecommendationId}
          marketRange={marketRange}
        />
      </div>
    </div>
  );
}
