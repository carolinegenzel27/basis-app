import { createClient } from "@/lib/supabase/server";
import { BrandingQuestionnaire } from "@/components/forms/BrandingQuestionnaire";
import { MarketingContentDisplay } from "@/components/forms/MarketingContentDisplay";

export default async function BrandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  const { data: branding } = businessProfile
    ? await supabase
        .from("branding_profiles")
        .select("*")
        .eq("business_profile_id", businessProfile.id)
        .maybeSingle()
    : { data: null };

  if (!businessProfile) {
    return (
      <div className="max-w-lg mx-auto p-8">
        <p className="text-gray-600">
          יש להשלים קודם את פרופיל העסק ב-onboarding.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">מיתוג ומיצוב</h1>
        <p className="text-gray-600 mt-1">
          ענו על השאלות, ונבנה לכם חומרים שיווקיים מוכנים.
        </p>
      </div>

      <BrandingQuestionnaire existingAnswers={branding?.answers ?? undefined} />

      {branding?.uvp_statement && (
        <div className="pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-4">החומרים שלך</h2>
          <MarketingContentDisplay
            content={{
              uvp_statement: branding.uvp_statement,
              website_text: branding.website_text,
              linkedin_text: branding.linkedin_text,
              sales_pitch: branding.sales_pitch,
            }}
          />
        </div>
      )}
    </div>
  );
}
