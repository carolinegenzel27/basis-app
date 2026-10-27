import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BrandingQuestionnaire } from "@/components/forms/BrandingQuestionnaire";
import {
  MarketingContentDisplay,
  type Ideas,
} from "@/components/forms/MarketingContentDisplay";
import { Megaphone, Sparkle } from "@/components/illustrations/BusinessIcons";

// Generating ideas is an AI call that can take ~30 seconds - give the
// Server Action room to finish.
export const maxDuration = 120;

export default async function BrandingPage() {
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

  // Rows saved before the AI ideas existed only have the four single texts -
  // show those as one idea each so nothing the owner had disappears.
  const ideas: Ideas | null =
    branding?.ai_ideas ??
    (branding?.uvp_statement
      ? {
          uvp_statement: [branding.uvp_statement],
          website_text: branding.website_text ? [branding.website_text] : [],
          social_post: branding.linkedin_text ? [branding.linkedin_text] : [],
          sales_pitch: branding.sales_pitch ? [branding.sales_pitch] : [],
        }
      : null);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      <div className="relative rounded-3xl bg-coral-soft border-2 border-ink p-6 shadow-[5px_5px_0_#1e1b4b] overflow-hidden">
        <Megaphone className="absolute -bottom-2 -left-2 w-24 rotate-[-8deg]" />
        <Sparkle className="absolute top-4 left-24 w-6 animate-wiggle" />
        <h1 className="text-3xl font-extrabold text-blue-950">מיתוג</h1>
        <p className="text-ink/70 mt-1 max-w-md">
          ה-AI כותב בשבילך סלוגנים, ביו לאינסטגרם, טקסט לאתר ופוסטים. בוחרים
          את מה שאוהבים, מעתיקים ומשתמשים.
        </p>
      </div>

      <BrandingQuestionnaire
        existingAnswers={branding?.answers ?? undefined}
        hasIdeas={!!ideas}
      />

      {ideas && (
        <div className="pt-6 border-t-2 border-ink/10">
          <h2 className="text-xl font-extrabold text-blue-950 mb-4">הרעיונות שלך</h2>
          <MarketingContentDisplay ideas={ideas} />
        </div>
      )}
    </div>
  );
}
