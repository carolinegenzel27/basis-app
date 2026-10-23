"use server";

import { createClient } from "@/lib/supabase/server";
import { brandingSchema } from "@/lib/validations/branding";
import { generateMarketingContent } from "@/lib/templates/branding-templates";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  error?: string;
};

export async function saveBrandingAnswers(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = brandingSchema.safeParse({
    ideal_client: formData.get("ideal_client"),
    problem_solved: formData.get("problem_solved"),
    desired_outcome: formData.get("desired_outcome"),
    unique_approach: formData.get("unique_approach"),
    credential: formData.get("credential"),
    cta: formData.get("cta"),
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
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!businessProfile) {
    return { success: false, error: "יש להשלים קודם את פרופיל העסק" };
  }

  const content = generateMarketingContent(parsed.data);

  const { error } = await supabase.from("branding_profiles").upsert(
    {
      business_profile_id: businessProfile.id,
      answers: parsed.data,
      ...content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "business_profile_id" }
  );

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/branding");
  return { success: true };
}
