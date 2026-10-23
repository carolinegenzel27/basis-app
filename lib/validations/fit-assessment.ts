import { z } from "zod";
import { FIT_QUESTIONS } from "@/lib/fit-assessment/questions";

export const fitAssessmentSchema = z.object({
  business_profile_id: z.string().uuid(),
  answers: z.array(z.number().int().min(1).max(4)).length(FIT_QUESTIONS.length),
});
