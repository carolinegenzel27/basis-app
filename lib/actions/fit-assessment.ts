"use server";

import { createClient } from "@/lib/supabase/server";
import { fitAssessmentSchema } from "@/lib/validations/fit-assessment";
import { scoreFitAssessment, type FitRecommendation } from "@/lib/fit-assessment/scoring";

export type ActionState = {
  success: boolean;
  error?: string;
  recommendation?: FitRecommendation;
  resultMessage?: string;
};

// Plain, short sentences - no dashes or slash forms, so they read well
// aloud (screen readers) and at a glance.
const RECOMMENDATION_MESSAGES: Record<FitRecommendation, string> = {
  pricing:
    "לפי התשובות שלך, כדאי להתחיל ביועץ התמחור. הוא יעזור לך לקבוע מחיר ברור לכל שירות, ולגבות אותו בביטחון.",
  branding:
    "לפי התשובות שלך, כדאי להתחיל במיתוג. הוא יעזור לך להציג את העסק ללקוחות בצורה ברורה ומקצועית.",
  both: "לפי התשובות שלך, גם התמחור וגם המיתוג יעזרו לעסק. אפשר להתחיל במה שנוח לך יותר.",
};

export async function submitFitAssessment(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  let rawAnswers: unknown;
  try {
    rawAnswers = JSON.parse(String(formData.get("answers")));
  } catch {
    return { success: false, error: "שגיאה בקריאת התשובות" };
  }

  const parsed = fitAssessmentSchema.safeParse({
    business_profile_id: formData.get("business_profile_id"),
    answers: rawAnswers,
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

  // Ownership check - same pattern as the other actions.
  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("id")
    .eq("id", parsed.data.business_profile_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!businessProfile) {
    return { success: false, error: "פרופיל עסק לא נמצא" };
  }

  const { pricingScore, brandingScore, recommendation } = scoreFitAssessment(parsed.data.answers);

  const { error } = await supabase.from("fit_assessments").upsert(
    {
      business_profile_id: businessProfile.id,
      answers: parsed.data.answers,
      pricing_score: pricingScore,
      branding_score: brandingScore,
      recommendation,
    },
    { onConflict: "business_profile_id" }
  );

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    recommendation,
    resultMessage: RECOMMENDATION_MESSAGES[recommendation],
  };
}
