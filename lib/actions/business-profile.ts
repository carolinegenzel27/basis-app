"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
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
  //
  // Uses the admin client here on purpose, not the regular one: RLS on
  // business_profiles only lets a user SELECT their *own* row
  // ("auth.uid() = user_id"), so checking whether someone else already has
  // this slug would otherwise always come back empty regardless of the
  // real answer - RLS would silently hide the collision, this loop would
  // never append "-2", and the insert below would fail on the slug's
  // "unique" constraint with a raw Postgres error instead. Safe to bypass
  // RLS for this one read: a slug is about to become a public URL anyway,
  // so its existence isn't sensitive, and only its id is read - never
  // returned to the caller.
  const admin = createAdminClient();
  let finalSlug = baseSlug;
  let attempt = 1;
  while (true) {
    const { data: existing } = await admin
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
