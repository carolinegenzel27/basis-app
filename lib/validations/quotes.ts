import { z } from "zod";

export const quoteSchema = z.object({
  business_profile_id: z.string().uuid(),
  pricing_recommendation_id: z.string().uuid().nullable().optional(),
  client_name: z.string().min(2, "יש להזין שם לקוח"),
  client_email: z.string().email("כתובת אימייל לא תקינה"),
  project_description: z
    .string()
    .max(300, "תיאור ארוך מדי - עד 300 תווים")
    .optional()
    .or(z.literal("")),
  price: z.coerce.number().positive("המחיר חייב להיות מספר חיובי"),
  // Optional - empty means "use the default title" (handled at PDF-render time,
  // not here, so the default lives in one place: QuoteDocument.tsx).
  document_title: z
    .string()
    .max(60, "כותרת ארוכה מדי - עד 60 תווים")
    .optional()
    .or(z.literal("")),
});
