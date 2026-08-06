import { z } from "zod";

export const pricingRequestSchema = z.object({
  business_profile_id: z.string().uuid(),
  project_type: z.string().min(1, "יש לבחור סוג פרויקט"),
});
