"use server";

import { createClient } from "@/lib/supabase/server";
import {
  pricingRequestSchema,
  pricingSearchSchema,
} from "@/lib/validations/pricing";
import { researchAndSavePricingOptions } from "@/lib/pricing/save-options";
import { describeAiError } from "@/lib/ai/claude";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  error?: string;
  recommendation?: { id: string; min: number; max: number; label: string; source: string | null };
};

export async function getPricingRecommendation(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = pricingRequestSchema.safeParse({
    business_profile_id: formData.get("business_profile_id"),
    project_type: formData.get("project_type"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "יש להתחבר מחדש" };
  }

  // Look up the business profile ourselves (server-side) instead of trusting
  // a profession value from the client - this also doubles as an ownership check.
  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("id, profession")
    .eq("id", parsed.data.business_profile_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!businessProfile) {
    return { success: false, error: "פרופיל עסק לא נמצא" };
  }

  // Options found by the AI market search for this business come first;
  // the old fixed per-profession table is only a fallback for businesses
  // created before the search existed.
  const { data: ownOption } = await supabase
    .from("business_pricing_options")
    .select("project_type_label, price_min, price_max, source")
    .eq("business_profile_id", businessProfile.id)
    .eq("project_type", parsed.data.project_type)
    .maybeSingle();

  const pricingRow =
    ownOption ??
    (
      await supabase
        .from("market_pricing_data")
        .select("project_type_label, price_min, price_max, source")
        .eq("profession", businessProfile.profession)
        .eq("project_type", parsed.data.project_type)
        .maybeSingle()
    ).data;

  if (!pricingRow) {
    return { success: false, error: "לא נמצאו נתוני תמחור עבור הבחירה הזו" };
  }

  // Don't save a duplicate history row if the last recommendation for this
  // exact project type already has the same price range.
  const { data: lastRecommendation } = await supabase
    .from("pricing_recommendations")
    .select("id, recommended_min, recommended_max")
    .eq("business_profile_id", businessProfile.id)
    .eq("project_type", parsed.data.project_type)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const isSameAsLast =
    lastRecommendation &&
    Number(lastRecommendation.recommended_min) === Number(pricingRow.price_min) &&
    Number(lastRecommendation.recommended_max) === Number(pricingRow.price_max);

  let recommendationId = lastRecommendation?.id;

  if (!isSameAsLast) {
    const { data: inserted, error } = await supabase
      .from("pricing_recommendations")
      .insert({
        business_profile_id: businessProfile.id,
        profession: businessProfile.profession,
        project_type: parsed.data.project_type,
        project_type_label: pricingRow.project_type_label,
        recommended_min: pricingRow.price_min,
        recommended_max: pricingRow.price_max,
      })
      .select("id")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    recommendationId = inserted.id;
    revalidatePath("/pricing-advisor");
  }

  return {
    success: true,
    recommendation: {
      id: recommendationId!,
      min: pricingRow.price_min,
      max: pricingRow.price_max,
      label: pricingRow.project_type_label,
      source: pricingRow.source ?? null,
    },
  };
}

export type SearchState = {
  success: boolean;
  error?: string;
  added?: number;
};

// Runs the AI market search again from the pricing advisor page - either a
// full refresh of the options list, or a search for one specific service the
// owner typed in ("couldn't find what you sell? search for it").
export async function searchPricingOptions(
  _prevState: SearchState,
  formData: FormData
): Promise<SearchState> {
  const parsed = pricingSearchSchema.safeParse({
    business_profile_id: formData.get("business_profile_id"),
    service_query: formData.get("service_query") ?? "",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "יש להתחבר מחדש" };
  }

  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("id, business_name, profession, business_description, years_experience")
    .eq("id", parsed.data.business_profile_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!businessProfile) {
    return { success: false, error: "פרופיל עסק לא נמצא" };
  }

  const serviceQuery = parsed.data.service_query || undefined;

  try {
    const added = await researchAndSavePricingOptions(
      supabase,
      businessProfile.id,
      businessProfile,
      { serviceQuery, replace: !serviceQuery }
    );
    if (added === 0) {
      return { success: false, error: "לא מצאנו מחירים מתאימים - אפשר לנסות לנסח אחרת" };
    }
    revalidatePath("/pricing-advisor");
    return { success: true, added };
  } catch (error) {
    console.error("pricing market search failed:", describeAiError(error));
    return { success: false, error: "החיפוש לא הצליח כרגע, כדאי לנסות שוב בעוד רגע" };
  }
}
