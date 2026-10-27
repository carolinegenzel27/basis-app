"use server";

import { createClient } from "@/lib/supabase/server";
import { brandingSchema } from "@/lib/validations/branding";
import { generateBrandingIdeas } from "@/lib/ai/branding-ideas";
import { describeAiError } from "@/lib/ai/claude";
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
    ideal_client: formData.get("ideal_client") ?? "",
    problem_solved: formData.get("problem_solved") ?? "",
    desired_outcome: formData.get("desired_outcome") ?? "",
    unique_approach: formData.get("unique_approach") ?? "",
    credential: formData.get("credential") ?? "",
    cta: formData.get("cta") ?? "",
    tone: formData.get("tone") ?? undefined,
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
    .eq("user_id", user.id)
    .maybeSingle();

  if (!businessProfile) {
    return { success: false, error: "יש להשלים קודם את פרופיל העסק" };
  }

  let ideas;
  try {
    ideas = await generateBrandingIdeas(businessProfile, parsed.data);
  } catch (error) {
    console.error("branding ideas failed:", describeAiError(error));
    return { success: false, error: "לא הצלחנו ליצור רעיונות כרגע, כדאי לנסות שוב בעוד רגע" };
  }

  // The first idea of each category also fills the original single-text
  // columns - the public business page (/p/[slug]) still reads those.
  const content = {
    uvp_statement: ideas.uvp_statement[0] ?? null,
    website_text: ideas.website_text[0] ?? null,
    linkedin_text: ideas.social_post[0] ?? null,
    sales_pitch: ideas.sales_pitch[0] ?? null,
  };

  const { error } = await supabase.from("branding_profiles").upsert(
    {
      business_profile_id: businessProfile.id,
      answers: parsed.data,
      ...content,
      ai_ideas: ideas,
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
