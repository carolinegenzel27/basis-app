import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileContentForm } from "@/components/forms/ProfileContentForm";
import { PhotoUploadForm } from "@/components/forms/PhotoUploadForm";
import { DocumentUploadForm } from "@/components/forms/DocumentUploadForm";
import { DeleteDocumentButton } from "@/components/forms/DeleteDocumentButton";
import { ui } from "@/lib/ui";
import { PageHeader } from "@/components/ui/PageHeader";
import { Storefront } from "@/components/illustrations/BusinessIcons";
import { getBusinessTheme } from "@/lib/business-theme";
import { professionLabel } from "@/lib/professions";

export default async function PublicProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: businessProfile, error: profileError } = await supabase
    .from("business_profiles")
    .select(
      "id, slug, profession, about_me, experience_text, additional_info, photo_url, public_uvp_text, public_website_text, public_tagline"
    )
    .eq("user_id", user!.id)
    .maybeSingle();

  // A query error (e.g. the about_me/experience_text/additional_info/photo_url
  // columns don't exist yet because supabase/add_profile_media.sql hasn't
  // been run) is NOT the same thing as "no profile exists yet" - conflating
  // them used to silently redirect back to onboarding even for someone who
  // already has a profile, which looked like the whole feature was missing.
  if (profileError) {
    return (
      <div className={ui.pageNarrow}>
        <p className={ui.error}>
          שגיאה בטעינת העמוד: {profileError.message}
        </p>
        <p className={`${ui.muted} text-sm mt-2`}>
          סביר שצריך להריץ ב-SQL Editor את supabase/add_profile_media.sql או
          את supabase/public_page_tagline.sql.
        </p>
      </div>
    );
  }

  if (!businessProfile) {
    redirect("/onboarding");
  }

  const { data: fitAssessment } = await supabase
    .from("fit_assessments")
    .select("id")
    .eq("business_profile_id", businessProfile.id)
    .maybeSingle();

  if (!fitAssessment) {
    redirect("/fit-assessment");
  }

  const { data: documents } = await supabase
    .from("business_profile_documents")
    .select("id, file_name, file_url, created_at")
    .eq("business_profile_id", businessProfile.id)
    .order("created_at", { ascending: false });

  // The branding-generated texts (if she's filled out the מיתוג questionnaire) -
  // shown as a one-click "load" starting point in ProfileContentForm, but
  // never written to the public page directly. Her own public_uvp_text /
  // public_website_text columns are what actually get published, so a later
  // branding re-generation can't silently overwrite what she chose to show.
  const { data: branding } = await supabase
    .from("branding_profiles")
    .select("uvp_statement, website_text")
    .eq("business_profile_id", businessProfile.id)
    .maybeSingle();

  // What each field starts with: the owner's saved text if they ever saved
  // one ("" = they removed it), otherwise the branding idea / automatic line.
  const defaultTagline = getBusinessTheme(
    professionLabel(businessProfile.profession),
    businessProfile.slug
  ).tagline;
  const brandingUvp = branding?.uvp_statement ?? null;
  const brandingAbout = branding?.website_text ?? null;

  return (
    <div className={`${ui.pageNarrow} space-y-6`}>
      <PageHeader
        title="הכנת עמוד ציבורי"
        subtitle="כל מה שממלאים כאן מוצג בעמוד העסקי שלך. אפשר למלא חלק ולהשלים מתי שנוח."
        icon={<Storefront className="w-10 h-10" />}
        tint="bg-mint-soft"
        actions={
          <a
            href={`/p/${businessProfile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={ui.btnSecondary}
          >
            צפייה בעמוד
            <span className="sr-only"> (נפתח בחלון חדש)</span>
          </a>
        }
      />

      <section aria-labelledby="photo-title" className={`${ui.card} ${ui.cardPad} space-y-4`}>
        <h2 id="photo-title" className={ui.h2}>תמונה</h2>
        <PhotoUploadForm
          businessProfileId={businessProfile.id}
          currentPhotoUrl={businessProfile.photo_url}
        />
      </section>

      <section aria-labelledby="content-title" className={`${ui.card} ${ui.cardPad} space-y-4`}>
        <h2 id="content-title" className={ui.h2}>מה כתוב בעמוד</h2>
        <ProfileContentForm
          businessProfileId={businessProfile.id}
          tagline={businessProfile.public_tagline ?? defaultTagline}
          defaultTagline={defaultTagline}
          uvpText={businessProfile.public_uvp_text ?? brandingUvp ?? ""}
          aboutMe={
            businessProfile.about_me ??
            (businessProfile.public_website_text || brandingAbout || "")
          }
          experienceText={businessProfile.experience_text ?? ""}
          additionalInfo={businessProfile.additional_info ?? ""}
          brandingUvp={brandingUvp}
          brandingAbout={brandingAbout}
        />
      </section>

      <section aria-labelledby="docs-title" className={`${ui.card} ${ui.cardPad} space-y-4`}>
        <div>
          <h2 id="docs-title" className={ui.h2}>תמונות ומסמכים</h2>
          <p className={`${ui.muted} mt-1`}>
            תמונות של עבודות, תעודות, תפריט, מחירון - כל קובץ שיעזור ללקוח להכיר אותך.
          </p>
        </div>

        {documents && documents.length > 0 && (
          <ul className="divide-y divide-ink/[0.06] rounded-xl border border-ink/10">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-ink hover:underline truncate"
                >
                  {doc.file_name}
                  <span className="sr-only"> (נפתח בחלון חדש)</span>
                </a>
                <DeleteDocumentButton documentId={doc.id} />
              </li>
            ))}
          </ul>
        )}

        <DocumentUploadForm businessProfileId={businessProfile.id} />
      </section>
    </div>
  );
}
