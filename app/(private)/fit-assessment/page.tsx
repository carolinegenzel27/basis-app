import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FitAssessmentQuestionnaire } from "@/components/forms/FitAssessmentQuestionnaire";
import { Logo } from "@/components/brand/Logo";
import { ui } from "@/lib/ui";

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
    <div className={`${ui.pageNarrow} space-y-8`}>
      <Logo href="/fit-assessment" />
      <div className="animate-fade-up">
        <p className="text-sm font-semibold text-blue-700">שלב 2 מתוך 3</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight">שאלון התאמה</h1>
        <p className={`${ui.muted} mt-2 text-lg`}>
          כמה שאלות קצרות שיעזרו לנו להמליץ לך במה כדאי להתחיל.
        </p>
      </div>

      <div className={`${ui.card} ${ui.cardPad}`}>
        <FitAssessmentQuestionnaire businessProfileId={businessProfile.id} />
      </div>
    </div>
  );
}
