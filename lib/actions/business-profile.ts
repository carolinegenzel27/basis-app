"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { businessProfileSchema } from "@/lib/validations/business-profile";

export type ActionState = {
  success: boolean;
  error?: string;
};

export async function createBusinessProfile(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = businessProfileSchema.safeParse({
    business_name: formData.get("business_name"),
    profession: formData.get("profession"),
    years_experience: formData.get("years_experience"),
    team_size: formData.get("team_size"),
    slug: formData.get("slug"),
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

  const baseSlug = parsed.data.slug.trim().toLowerCase();

  // If the slug is taken, keep trying baseSlug-2, baseSlug-3, ... until free.
  let finalSlug = baseSlug;
  let attempt = 1;
  while (true) {
    const { data: existing } = await supabase
      .from("business_profiles")
      .select("id")
      .eq("slug", finalSlug)
      .maybeSingle();

    if (!existing) break;
    attempt += 1;
    finalSlug = `${baseSlug}-${attempt}`;
  }

  const { error } = await supabase.from("business_profiles").insert({
    user_id: user.id,
    business_name: parsed.data.business_name,
    profession: parsed.data.profession,
    years_experience: parsed.data.years_experience,
    team_size: parsed.data.team_size,
    slug: finalSlug,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // First stop after onboarding is the fit assessment, not the dashboard -
  // the dashboard itself will redirect here too if it's ever skipped.
  redirect("/fit-assessment");
}
