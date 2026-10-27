import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { professionLabel } from "@/lib/professions";
import {
  PublicBusinessView,
  type PublicProfile,
  type PublicDocument,
} from "@/components/public-page/PublicBusinessView";

// Public, unauthenticated page - this is what a business owner sends to
// potential clients. Reads from the "public_business_profiles" view (see
// supabase/schema.sql), which is the ONLY thing exposed to anonymous
// visitors - the real business_profiles/branding_profiles tables stay
// locked behind RLS to the owner only. No auth check here on purpose: this
// route lives outside the (private) route group.
export const runtime = "nodejs";

// business_profile_documents doesn't store a content-type column - only
// PDF/JPG/PNG are ever accepted at upload time (see
// lib/validations/profile-media.ts's ALLOWED_DOCUMENT_TYPES), so the file
// extension alone is enough to tell an image apart from a document here.
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
function isImageFile(fileName: string): boolean {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return !!ext && IMAGE_EXTENSIONS.includes(ext);
}

const PROFILE_COLUMNS =
  "business_profile_id, slug, business_name, profession, about_me, experience_text, additional_info, photo_url, uvp_statement, website_text";

async function getProfile(slug: string): Promise<PublicProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("public_business_profiles")
    .select(`${PROFILE_COLUMNS}, public_tagline`)
    .eq("slug", slug)
    .maybeSingle();

  // Until supabase/public_page_tagline.sql has been run the view has no
  // public_tagline column - fall back instead of 404-ing every page.
  if (error) {
    const { data: fallback } = await supabase
      .from("public_business_profiles")
      .select(PROFILE_COLUMNS)
      .eq("slug", slug)
      .maybeSingle();
    return fallback;
  }

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
    title: `${profile.business_name} | ${professionLabel(profile.profession)}`,
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

  return (
    <PublicBusinessView
      profile={profile}
      imageDocuments={imageDocuments}
      otherDocuments={otherDocuments}
    />
  );
}
