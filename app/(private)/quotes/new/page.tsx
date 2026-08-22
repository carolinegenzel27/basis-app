import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuoteForm } from "@/components/forms/QuoteForm";

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
    <div className="max-w-lg mx-auto p-8 space-y-6">
      <div>
        <a href="/quotes" className="text-sm text-gray-500 underline">
          ← חזרה לרשימת ההצעות
        </a>
        <h1 className="text-2xl font-bold text-blue-950 mt-2">הצעת מחיר חדשה</h1>
      </div>

      <QuoteForm
        businessProfileId={businessProfile.id}
        defaultProjectDescription={defaultProjectDescription}
        defaultPrice={defaultPrice}
        defaultDocumentTitle={defaultDocumentTitle}
        pricingRecommendationId={pricingRecommendationId}
        marketRange={marketRange}
      />
    </div>
  );
}
