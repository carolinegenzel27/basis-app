import { z } from "zod";

export const pricingRequestSchema = z.object({
  business_profile_id: z.string().uuid(),
  project_type: z.string().min(1, "יש לבחור סוג פרויקט"),
});

export const pricingSearchSchema = z.object({
  business_profile_id: z.string().uuid(),
  // Empty = refresh the whole list; text = search for this one service.
  service_query: z.string().trim().max(80, "עד 80 תווים").optional().default(""),
});
