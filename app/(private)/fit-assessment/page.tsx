import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FitAssessmentQuestionnaire } from "@/components/forms/FitAssessmentQuestionnaire";

export default async function FitAssessmentPage() {
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

  const { data: existing } = await supabase
    .from("fit_assessments")
    .select("id")
    .eq("business_profile_id", businessProfile.id)
    .maybeSingle();

  if (existing) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-lg mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">שאלון התאמה</h1>
        <p className="text-gray-600 mt-1">
          כמה שאלות קצרות שיעזרו לנו להמליץ לך במה כדאי להתחיל.
        </p>
      </div>

      <FitAssessmentQuestionnaire businessProfileId={businessProfile.id} />
    </div>
  );
}
