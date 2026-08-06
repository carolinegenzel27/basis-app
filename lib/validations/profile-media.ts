import { z } from "zod";

// All three fields are optional free text - this page is meant to be
// fillable gradually, not another mandatory gate like fit-assessment.
export const profileContentSchema = z.object({
  business_profile_id: z.string().uuid(),
  about_me: z.string().max(600, "קצת עליי - עד 600 תווים").optional().or(z.literal("")),
  experience_text: z.string().max(600, "ניסיון - עד 600 תווים").optional().or(z.literal("")),
  additional_info: z.string().max(600, "לפרטים נוספים - עד 600 תווים").optional().or(z.literal("")),
});

// Shared limits for both the photo and each document - checked in the
// Server Action (not just here) since a <input type="file"> accept
// attribute is only a UI hint and can't be trusted on its own.
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];
