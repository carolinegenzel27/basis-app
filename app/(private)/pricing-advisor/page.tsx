import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PricingAdvisorForm } from "@/components/forms/PricingAdvisorForm";

export default async function PricingAdvisorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("id, profession")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (businessProfile) {
    const { data: fitAssessment } = await supabase
      .from("fit_assessments")
      .select("id")
      .eq("business_profile_id", businessProfile.id)
      .maybeSingle();

    if (!fitAssessment) {
      redirect("/fit-assessment");
    }
  }

  if (!businessProfile) {
    return (
      <div className="max-w-lg mx-auto p-8">
        <p className="text-gray-600">
          יש להשלים קודם את פרופיל העסק ב-onboarding.
        </p>
      </div>
    );
  }

  const { data: options } = await supabase
    .from("market_pricing_data")
    .select("project_type, project_type_label")
    .eq("profession", businessProfile.profession)
    .order("project_type_label");

  const { data: history } = await supabase
    .from("pricing_recommendations")
    .select("project_type_label, recommended_min, recommended_max, created_at")
    .eq("business_profile_id", businessProfile.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="max-w-lg mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">יועץ תמחור</h1>
        <p className="text-gray-600 mt-1">
          בחרי סוג פרויקט וקבלי טווח מחיר מומלץ, מבוסס על נתוני שוק.
        </p>
      </div>

      <PricingAdvisorForm
        businessProfileId={businessProfile.id}
        options={options ?? []}
      />

      {history && history.length > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-3">המלצות קודמות</h2>
          <ul className="space-y-2">
            {history.map((h, i) => (
              <li key={i} className="text-sm text-gray-600">
                {h.project_type_label}: {h.recommended_min}-{h.recommended_max} ₪
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
