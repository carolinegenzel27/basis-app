import { z } from "zod";

export const businessProfileSchema = z.object({
  business_name: z.string().min(2, "יש להזין שם עסק (לפחות 2 תווים)"),
  // Free text on purpose - any kind of small business (baker, nail artist,
  // photographer...). The AI market search reads it as-is.
  profession: z
    .string()
    .trim()
    .min(2, "יש להזין תחום עיסוק")
    .max(60, "תחום עיסוק ארוך מדי - עד 60 תווים"),
  business_description: z
    .string()
    .trim()
    .max(300, "תיאור ארוך מדי - עד 300 תווים")
    .optional()
    .default(""),
  years_experience: z.coerce
    .number()
    .int()
    .min(0, "מספר לא תקין")
    .max(80, "מספר לא תקין"),
  team_size: z.coerce
    .number()
    .int()
    .min(1, "מספר לא תקין")
    .max(500, "מספר לא תקין"),
  // Business names are typed in Hebrew, which can't become a readable URL slug
  // automatically - so we ask for the slug directly instead of generating it.
  slug: z
    .string()
    .min(3, "כתובת קצרה מדי")
    .max(50, "כתובת ארוכה מדי")
    .regex(/^[a-z0-9-]+$/, "רק אותיות אנגליות קטנות, מספרים, ומקף (-)"),
});
