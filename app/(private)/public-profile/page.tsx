import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileContentForm } from "@/components/forms/ProfileContentForm";
import { PhotoUploadForm } from "@/components/forms/PhotoUploadForm";
import { DocumentUploadForm } from "@/components/forms/DocumentUploadForm";
import { deleteProfileDocument } from "@/lib/actions/profile-media";

export default async function PublicProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: businessProfile, error: profileError } = await supabase
    .from("business_profiles")
    .select("id, slug, about_me, experience_text, additional_info, photo_url")
    .eq("user_id", user!.id)
    .maybeSingle();

  // A query error (e.g. the about_me/experience_text/additional_info/photo_url
  // columns don't exist yet because supabase/add_profile_media.sql hasn't
  // been run) is NOT the same thing as "no profile exists yet" - conflating
  // them used to silently redirect back to onboarding even for someone who
  // already has a profile, which looked like the whole feature was missing.
  if (profileError) {
    return (
      <div className="max-w-lg mx-auto p-8">
        <p className="text-red-600 text-sm">
          שגיאה בטעינת העמוד: {profileError.message}
        </p>
        <p className="text-gray-500 text-sm mt-2">
          סביר שצריך להריץ את supabase/add_profile_media.sql ב-SQL Editor.
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

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <div>
        <a href="/dashboard" className="text-sm text-gray-500 underline">
          ← חזרה למסך הבית
        </a>
        <h1 className="text-2xl font-bold text-blue-950 mt-2">הכנת עמוד ציבורי</h1>
        <p className="text-gray-600 mt-1">
          כל מה שממלאים כאן מוצג בעמוד הציבורי שלך -{" "}
          <a
            href={`/p/${businessProfile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            dir="ltr"
          >
            /p/{businessProfile.slug}
          </a>
          . אפשר למלא חלק ולהשלים את השאר מתי שנוח.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-blue-950">תמונה</h2>
        <PhotoUploadForm
          businessProfileId={businessProfile.id}
          currentPhotoUrl={businessProfile.photo_url}
        />
      </section>

      <section className="space-y-3 pt-6 border-t border-gray-200">
        <h2 className="text-lg font-semibold text-blue-950">קצת עליי, ניסיון, ופרטים נוספים</h2>
        <ProfileContentForm
          businessProfileId={businessProfile.id}
          defaultAboutMe={businessProfile.about_me ?? ""}
          defaultExperienceText={businessProfile.experience_text ?? ""}
          defaultAdditionalInfo={businessProfile.additional_info ?? ""}
        />
      </section>

      <section className="space-y-3 pt-6 border-t border-gray-200">
        <h2 className="text-lg font-semibold text-blue-950">מסמכים</h2>
        <p className="text-sm text-gray-500 -mt-1">
          תעודות, תפריט, מחירון - כל קובץ שיעזור ללקוח פוטנציאלי להכיר אותך.
        </p>

        {documents && documents.length > 0 && (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
              >
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-950 underline truncate"
                >
                  {doc.file_name}
                </a>
                <form
                  action={async () => {
                    "use server";
                    await deleteProfileDocument(doc.id);
                  }}
                >
                  <button type="submit" className="text-xs text-red-600 underline shrink-0">
                    מחיקה
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <DocumentUploadForm businessProfileId={businessProfile.id} />
      </section>
    </div>
  );
}
