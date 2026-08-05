"use server";

import { createClient } from "@/lib/supabase/server";
import { pricingRequestSchema } from "@/lib/validations/pricing";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  error?: string;
  recommendation?: { min: number; max: number; label: string };
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

  const { data: pricingRow } = await supabase
    .from("market_pricing_data")
    .select("project_type_label, price_min, price_max")
    .eq("profession", businessProfile.profession)
    .eq("project_type", parsed.data.project_type)
    .maybeSingle();

  if (!pricingRow) {
    return { success: false, error: "לא נמצאו נתוני תמחור עבור הבחירה הזו" };
  }

  const { error } = await supabase.from("pricing_recommendations").insert({
    business_profile_id: businessProfile.id,
    profession: businessProfile.profession,
    project_type: parsed.data.project_type,
    project_type_label: pricingRow.project_type_label,
    recommended_min: pricingRow.price_min,
    recommended_max: pricingRow.price_max,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/pricing-advisor");

  return {
    success: true,
    recommendation: {
      min: pricingRow.price_min,
      max: pricingRow.price_max,
      label: pricingRow.project_type_label,
    },
  };
}
