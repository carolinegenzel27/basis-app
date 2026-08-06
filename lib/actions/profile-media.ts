"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  profileContentSchema,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
} from "@/lib/validations/profile-media";

export type ActionState = {
  success: boolean;
  error?: string;
};

// Shared by both upload actions - confirms the business_profile_id in the
// form actually belongs to the logged-in user, same ownership-check pattern
// used everywhere else in the app (a null result already means "not found
// or not yours", so the caller doesn't need to know which).
async function getOwnedBusinessProfileId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  businessProfileId: string
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("business_profiles")
    .select("id")
    .eq("id", businessProfileId)
    .eq("user_id", user.id)
    .maybeSingle();

  return data?.id ?? null;
}

export async function updateProfileContent(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = profileContentSchema.safeParse({
    business_profile_id: formData.get("business_profile_id"),
    about_me: formData.get("about_me") ?? "",
    experience_text: formData.get("experience_text") ?? "",
    additional_info: formData.get("additional_info") ?? "",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "יש להתחבר מחדש" };
  }

  const { error } = await supabase
    .from("business_profiles")
    .update({
      about_me: parsed.data.about_me || null,
      experience_text: parsed.data.experience_text || null,
      additional_info: parsed.data.additional_info || null,
    })
    .eq("id", parsed.data.business_profile_id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/public-profile");
  return { success: true };
}

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  // Fallback if the browser didn't give a usable filename extension.
  return file.type === "application/pdf" ? "pdf" : "jpg";
}

export async function uploadProfilePhoto(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const businessProfileId = formData.get("business_profile_id");
  const file = formData.get("photo");

  if (typeof businessProfileId !== "string" || !businessProfileId) {
    return { success: false, error: "חסר מזהה עסק" };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "יש לבחור תמונה" };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { success: false, error: "התמונה חייבת להיות JPG, PNG או WEBP" };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: "התמונה גדולה מדי - עד 5MB" };
  }

  const supabase = await createClient();
  const ownedId = await getOwnedBusinessProfileId(supabase, businessProfileId);
  if (!ownedId) {
    return { success: false, error: "פרופיל עסק לא נמצא" };
  }

  const { data: existing } = await supabase
    .from("business_profiles")
    .select("photo_url")
    .eq("id", ownedId)
    .maybeSingle();

  const path = `${ownedId}/photo-${Date.now()}.${extensionFor(file)}`;

  const { error: uploadError } = await supabase.storage
    .from("public-media")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    return { success: false, error: "העלאת התמונה נכשלה: " + uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("public-media").getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("business_profiles")
    .update({ photo_url: publicUrl })
    .eq("id", ownedId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Best-effort cleanup of the previous photo - not critical if it fails
  // (an orphaned file in Storage costs nothing functionally), so this
  // doesn't block the response either way.
  if (existing?.photo_url) {
    const oldPath = existing.photo_url.split("/public-media/")[1];
    if (oldPath) {
      await supabase.storage.from("public-media").remove([oldPath]);
    }
  }

  revalidatePath("/public-profile");
  return { success: true };
}

export async function uploadProfileDocument(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const businessProfileId = formData.get("business_profile_id");
  const file = formData.get("document");

  if (typeof businessProfileId !== "string" || !businessProfileId) {
    return { success: false, error: "חסר מזהה עסק" };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "יש לבחור קובץ" };
  }
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    return { success: false, error: "הקובץ חייב להיות PDF, JPG או PNG" };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: "הקובץ גדול מדי - עד 5MB" };
  }

  const supabase = await createClient();
  const ownedId = await getOwnedBusinessProfileId(supabase, businessProfileId);
  if (!ownedId) {
    return { success: false, error: "פרופיל עסק לא נמצא" };
  }

  // Strip anything that isn't a safe filename character - the original name
  // is kept for display (file_name column), but the Storage path itself
  // can't contain slashes or other characters that would break the path.
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${ownedId}/documents/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("public-media")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    return { success: false, error: "העלאת הקובץ נכשלה: " + uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("public-media").getPublicUrl(path);

  const { error: insertError } = await supabase
    .from("business_profile_documents")
    .insert({
      business_profile_id: ownedId,
      file_name: file.name,
      file_url: publicUrl,
    });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  revalidatePath("/public-profile");
  return { success: true };
}

export async function deleteProfileDocument(
  documentId: string
): Promise<ActionState> {
  const supabase = await createClient();

  // RLS already limits this to documents owned by the current user - a null
  // result means "not found or not yours", same pattern as deleteQuote.
  const { data: document } = await supabase
    .from("business_profile_documents")
    .select("id, file_url")
    .eq("id", documentId)
    .maybeSingle();

  if (!document) {
    return { success: false, error: "המסמך לא נמצא" };
  }

  const { error } = await supabase
    .from("business_profile_documents")
    .delete()
    .eq("id", documentId);

  if (error) {
    return { success: false, error: error.message };
  }

  const storagePath = document.file_url.split("/public-media/")[1];
  if (storagePath) {
    await supabase.storage.from("public-media").remove([storagePath]);
  }

  revalidatePath("/public-profile");
  return { success: true };
}
