import { z } from "zod";

// All three fields are optional free text - this page is meant to be
// fillable gradually, not another mandatory gate like fit-assessment.
export const profileContentSchema = z.object({
  business_profile_id: z.string().uuid(),
  about_me: z.string().max(1000, "קצת עליי - עד 1000 תווים").optional().or(z.literal("")),
  experience_text: z.string().max(600, "ניסיון - עד 600 תווים").optional().or(z.literal("")),
  additional_info: z.string().max(600, "לפרטים נוספים - עד 600 תווים").optional().or(z.literal("")),
  // The owner's own editable copy of the branding-generated texts - stored
  // separately from branding_profiles so that (a) re-generating branding
  // later can't silently overwrite what she chose to publish, and (b) an
  // empty value here means "don't show this on the public page", same
  // pattern as about_me/experience_text/additional_info above.
  public_uvp_text: z.string().max(400, "משפט מיתוג - עד 400 תווים").optional().or(z.literal("")),
  public_website_text: z.string().max(800, "טקסט לאתר - עד 800 תווים").optional().or(z.literal("")),
  // The opening line above the business name on the public page.
  public_tagline: z.string().trim().max(80, "שורת פתיחה - עד 80 תווים").optional().or(z.literal("")),
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
