import { z } from "zod";

// Every answer is optional now - the AI can write ideas from the business
// profile alone, and each extra answer just makes the ideas more personal.
const optionalAnswer = z
  .string()
  .trim()
  .max(120, "יש לענות בקצרה - עד 120 תווים")
  .optional()
  .default("");

export const BRANDING_TONES = ["warm", "professional", "playful", "luxury"] as const;

export const brandingSchema = z.object({
  ideal_client: optionalAnswer,
  problem_solved: optionalAnswer,
  desired_outcome: optionalAnswer,
  unique_approach: optionalAnswer,
  credential: optionalAnswer,
  cta: optionalAnswer,
  tone: z.enum(BRANDING_TONES).optional().default("warm"),
});

export type BrandingAnswers = z.infer<typeof brandingSchema>;
