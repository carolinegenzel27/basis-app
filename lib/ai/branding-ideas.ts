import { z } from "zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { getClaude, MODEL, FALLBACK_BETA, AiUnavailableError } from "./claude";
import type { BrandingAnswers } from "@/lib/validations/branding";
import { BRANDING_QUESTIONS, TONE_LABELS } from "@/lib/templates/branding-questions";
import { IDEA_CATEGORIES } from "@/lib/templates/idea-categories";

const IdeasSchema = z.object({
  slogans: z.array(z.string()),
  uvp_statement: z.array(z.string()),
  instagram_bio: z.array(z.string()),
  website_text: z.array(z.string()),
  social_post: z.array(z.string()),
  sales_pitch: z.array(z.string()),
});

export type BrandingIdeas = z.infer<typeof IdeasSchema>;

export type BusinessForBranding = {
  business_name: string;
  profession: string;
  business_description?: string | null;
  years_experience?: number | null;
};

const SYSTEM = `You are a warm, sharp Israeli copywriter who writes marketing text for small businesses.
Write everything in natural, modern Hebrew - the way a real Israeli business owner would post it, not a translation. Use gender-neutral phrasing or the business owner's natural voice; avoid slash forms like "את/ה" in the finished text.
Every idea must be ready to copy and use as-is: no placeholders, no brackets, no notes to the user.
Make the ideas within each category genuinely different from each other (different angle, length, or hook), so the owner has a real choice.
Counts: 5 slogans (up to 8 words each), 3 value propositions (one sentence), 3 Instagram bios (up to 150 characters, emojis welcome), 3 website "about" paragraphs (3-5 sentences), 3 social posts (Facebook/LinkedIn, with a call to action and line breaks), 3 sales pitches (a short first message to a potential client).`;

// Generates several ready-to-copy writing ideas per category for the
// branding page. Every questionnaire answer is optional - the more the owner
// fills in, the more personal the ideas get.
export async function generateBrandingIdeas(
  business: BusinessForBranding,
  answers: BrandingAnswers
): Promise<BrandingIdeas> {
  const claude = getClaude();

  const answerLines = BRANDING_QUESTIONS.map((q) => {
    const value = answers[q.name as keyof BrandingAnswers];
    return value ? `${q.label} ${value}` : null;
  }).filter(Boolean);

  const prompt = [
    `שם העסק: ${business.business_name}`,
    `תחום: ${business.profession}`,
    business.business_description ? `מה העסק מוכר: ${business.business_description}` : null,
    business.years_experience != null ? `שנות ותק: ${business.years_experience}` : null,
    `טון רצוי: ${TONE_LABELS[answers.tone]}`,
    answerLines.length > 0 ? `\nתשובות בעל/ת העסק:\n${answerLines.join("\n")}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await claude.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    betas: [FALLBACK_BETA],
    fallbacks: "default",
    output_config: { effort: "medium", format: betaZodOutputFormat(IdeasSchema) },
    system: SYSTEM,
    messages: [{ role: "user", content: prompt }],
  });

  if (response.stop_reason === "refusal" || !response.parsed_output) {
    throw new AiUnavailableError(`no ideas returned (stop_reason: ${response.stop_reason})`);
  }

  const ideas = response.parsed_output;
  // Trim and drop empty strings so the UI never shows a blank card.
  for (const { key } of IDEA_CATEGORIES) {
    ideas[key] = ideas[key].map((t) => t.trim()).filter(Boolean).slice(0, 6);
  }
  return ideas;
}
