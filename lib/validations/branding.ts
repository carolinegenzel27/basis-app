import { z } from "zod";

// Short phrases, not full sentences - this is what keeps the generated
// marketing text (branding-templates.ts) reading naturally instead of
// stitching together mismatched full sentences.
const shortPhrase = z
  .string()
  .min(3, "יש למלא שדה זה")
  .max(60, "יש לענות בביטוי קצר - עד 60 תווים, לא משפט שלם");

export const brandingSchema = z.object({
  ideal_client: shortPhrase,
  problem_solved: shortPhrase,
  desired_outcome: shortPhrase,
  unique_approach: shortPhrase,
  credential: shortPhrase,
  cta: shortPhrase,
});

export type BrandingAnswers = z.infer<typeof brandingSchema>;
