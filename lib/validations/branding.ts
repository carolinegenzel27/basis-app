import { z } from "zod";

export const brandingSchema = z.object({
  ideal_client: z.string().min(3, "יש למלא שדה זה"),
  problem_solved: z.string().min(3, "יש למלא שדה זה"),
  desired_outcome: z.string().min(3, "יש למלא שדה זה"),
  unique_approach: z.string().min(3, "יש למלא שדה זה"),
  credential: z.string().min(3, "יש למלא שדה זה"),
  cta: z.string().min(3, "יש למלא שדה זה"),
});

export type BrandingAnswers = z.infer<typeof brandingSchema>;
