import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BrandingQuestionnaire } from "@/components/forms/BrandingQuestionnaire";
import {
  MarketingContentDisplay,
  type Ideas,
} from "@/components/forms/MarketingContentDisplay";
import { Megaphone } from "@/components/illustrations/BusinessIcons";
import { ui } from "@/lib/ui";
import { PageHeader } from "@/components/ui/PageHeader";

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
      <div className={ui.pageNarrow}>
        <p className={ui.muted}>
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
    <div className={`${ui.pageNarrow} space-y-6`}>
      <PageHeader
        title="מיתוג"
        subtitle="ה-AI כותב בשבילך סלוגנים, ביו לאינסטגרם, טקסט לאתר ופוסטים. בוחרים, מעתיקים ומשתמשים."
        icon={<Megaphone className="w-10 h-10" />}
        tint="bg-coral-soft"
      />

      <div className={`${ui.card} ${ui.cardPad}`}>
      <BrandingQuestionnaire
        existingAnswers={branding?.answers ?? undefined}
        hasIdeas={!!ideas}
        />
      </div>

      {ideas && (
        <div className={`${ui.card} ${ui.cardPad}`}>
          <h2 className={`${ui.h2} mb-4`}>הרעיונות שלך</h2>
          <MarketingContentDisplay ideas={ideas} />
        </div>
      )}
    </div>
  );
}
