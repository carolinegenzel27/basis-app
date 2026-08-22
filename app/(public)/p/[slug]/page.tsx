import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Public, unauthenticated page - this is what a business owner sends to
// potential clients. Reads from the "public_business_profiles" view (see
// supabase/schema.sql), which is the ONLY thing exposed to anonymous
// visitors - the real business_profiles/branding_profiles tables stay
// locked behind RLS to the owner only. No auth check here on purpose: this
// route lives outside the (private) route group.
export const runtime = "nodejs";

const PROFESSION_LABELS: Record<string, string> = {
  driving_instructor: "מורה לנהיגה",
  dietitian: "דיאטנית",
  private_chef: "שף פרטי",
};

type PublicProfile = {
  business_profile_id: string;
  slug: string;
  business_name: string;
  profession: string;
  about_me: string | null;
  experience_text: string | null;
  additional_info: string | null;
  photo_url: string | null;
  uvp_statement: string | null;
  website_text: string | null;
  linkedin_text: string | null;
  sales_pitch: string | null;
};

type PublicDocument = {
  id: string;
  file_name: string;
  file_url: string;
};

// business_profile_documents doesn't store a content-type column - only
// PDF/JPG/PNG are ever accepted at upload time (see
// lib/validations/profile-media.ts's ALLOWED_DOCUMENT_TYPES), so the file
// extension alone is enough to tell an image apart from a document here.
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
function isImageFile(fileName: string): boolean {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return !!ext && IMAGE_EXTENSIONS.includes(ext);
}

async function getProfile(slug: string): Promise<PublicProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("public_business_profiles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return data;
}

async function getDocuments(businessProfileId: string): Promise<PublicDocument[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("business_profile_documents")
    .select("id, file_name, file_url")
    .eq("business_profile_id", businessProfileId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getProfile(slug);

  if (!profile) {
    return { title: "העמוד לא נמצא - Basis" };
  }

  return {
    title: `${profile.business_name} | ${PROFESSION_LABELS[profile.profession] ?? profile.profession}`,
    description: profile.uvp_statement ?? profile.about_me ?? undefined,
  };
}

export default async function PublicBusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getProfile(slug);

  if (!profile) {
    notFound();
  }

  const documents = await getDocuments(profile.business_profile_id);
  // Split into images (shown inline, as a small gallery) vs everything else
  // (PDFs etc, shown as a plain link to open/download) - same list of
  // uploaded files, just rendered according to what they actually are.
  const imageDocuments = documents.filter((doc) => isImageFile(doc.file_name));
  const otherDocuments = documents.filter((doc) => !isImageFile(doc.file_name));
  const professionLabel =
    PROFESSION_LABELS[profile.profession] ?? profile.profession;

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-10 text-center space-y-6">
          {profile.photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photo_url}
              alt={profile.business_name}
              className="w-24 h-24 rounded-full object-cover mx-auto border border-gray-200"
            />
          )}

          <div>
            <p className="text-sm font-medium text-slate-500">
              {professionLabel}
            </p>
            <h1 className="text-3xl font-bold text-blue-950 mt-1">
              {profile.business_name}
            </h1>
          </div>

          {profile.uvp_statement && (
            <p className="text-lg text-slate-700 leading-relaxed">
              {profile.uvp_statement}
            </p>
          )}

          {profile.website_text && (
            <div className="pt-6 border-t border-gray-100 text-right">
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {profile.website_text}
              </p>
            </div>
          )}

          {profile.about_me && (
            <div className="pt-6 border-t border-gray-100 text-right">
              <h2 className="text-sm font-semibold text-slate-500 mb-1">קצת עליי</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {profile.about_me}
              </p>
            </div>
          )}

          {profile.experience_text && (
            <div className="pt-6 border-t border-gray-100 text-right">
              <h2 className="text-sm font-semibold text-slate-500 mb-1">ניסיון</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {profile.experience_text}
              </p>
            </div>
          )}

          {profile.additional_info && (
            <div className="pt-6 border-t border-gray-100 text-right">
              <h2 className="text-sm font-semibold text-slate-500 mb-1">לפרטים נוספים</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {profile.additional_info}
              </p>
            </div>
          )}

          {imageDocuments.length > 0 && (
            <div className="pt-6 border-t border-gray-100 text-right">
              <h2 className="text-sm font-semibold text-slate-500 mb-2">תמונות</h2>
              <div className="grid grid-cols-3 gap-2">
                {imageDocuments.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-square rounded-lg overflow-hidden border border-gray-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={doc.file_url}
                      alt={doc.file_name}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {otherDocuments.length > 0 && (
            <div className="pt-6 border-t border-gray-100 text-right">
              <h2 className="text-sm font-semibold text-slate-500 mb-2">מסמכים</h2>
              <ul className="space-y-1">
                {otherDocuments.map((doc) => (
                  <li key={doc.id}>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-950 underline text-sm"
                    >
                      {doc.file_name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          עמוד זה הופק באמצעות Basis
        </p>
      </div>
    </div>
  );
}
