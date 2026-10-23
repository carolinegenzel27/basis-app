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
    public_uvp_text: formData.get("public_uvp_text") ?? "",
    public_website_text: formData.get("public_website_text") ?? "",
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
      public_uvp_text: parsed.data.public_uvp_text || null,
      public_website_text: parsed.data.public_website_text || null,
    })
    .eq("id", parsed.data.business_profile_id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/public-profile");
  return { success: true };
}

// The public URL looks like ".../storage/v1/object/public/public-media/<path>"
// - the part after the bucket name is the object's path inside the bucket.
function storagePathFromUrl(url: string): string | null {
  return url.split("/public-media/")[1] || null;
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
    // The new file is already in Storage but nothing points at it - remove
    // it so a failed save doesn't leave an orphaned public file behind.
    await supabase.storage.from("public-media").remove([path]);
    return { success: false, error: "שמירת התמונה נכשלה, נסי שוב" };
  }

  // Best-effort cleanup of the previous photo - not critical if it fails
  // (an orphaned file in Storage costs nothing functionally), so this
  // doesn't block the response either way.
  if (existing?.photo_url) {
    const oldPath = storagePathFromUrl(existing.photo_url);
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
    // Upload succeeded but the record didn't - without this, the file would
    // stay publicly reachable in Storage with no row that lists it and no
    // way for the owner to delete it from the UI. Roll the upload back.
    await supabase.storage.from("public-media").remove([path]);
    return { success: false, error: "שמירת המסמך נכשלה, נסי שוב" };
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

  const storagePath = storagePathFromUrl(document.file_url);
  if (!storagePath) {
    return { success: false, error: "לא ניתן לאתר את הקובץ למחיקה" };
  }

  // Order matters: delete the FILE first, and only remove the record once
  // the file is really gone. The file's public URL is the thing that leaks -
  // if Storage deletion failed after the record was already removed, the
  // file would stay reachable by anyone holding its link, with no row left
  // for the owner to retry from. Failing here instead keeps the document in
  // the list, so the owner can simply press delete again.
  const { error: storageError } = await supabase.storage
    .from("public-media")
    .remove([storagePath]);

  if (storageError) {
    return { success: false, error: "מחיקת הקובץ נכשלה, נסי שוב" };
  }

  const { error: deleteError } = await supabase
    .from("business_profile_documents")
    .delete()
    .eq("id", documentId);

  if (deleteError) {
    // The file is already gone, so nothing is exposed - the row just points
    // at a missing file. Retrying is safe: removing an already-missing
    // object from Storage is not an error, so the next attempt goes
    // straight through to deleting the row.
    return { success: false, error: "מחיקת המסמך נכשלה, נסי שוב" };
  }

  revalidatePath("/public-profile");
  return { success: true };
}

// Form-shaped wrapper so the delete button can use useActionState and show
// an error to the owner - the plain function above returns a result, but a
// bare <form action> would throw it away and a failed delete would be silent.
export async function deleteProfileDocumentAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const documentId = formData.get("document_id");
  if (typeof documentId !== "string" || !documentId) {
    return { success: false, error: "המסמך לא נמצא" };
  }
  return deleteProfileDocument(documentId);
}
