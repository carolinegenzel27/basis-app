import type { BrandingAnswers } from "@/lib/validations/branding";

// Rule-based content generation - NOT an external AI call.
// Every answer just gets slotted into a fixed sentence template.
export function generateMarketingContent(answers: BrandingAnswers) {
  const {
    ideal_client,
    problem_solved,
    desired_outcome,
    unique_approach,
    credential,
    cta,
  } = answers;

  const uvp_statement = `אני עוזר/ת ל${ideal_client} להתמודד עם ${problem_solved}, ולהגיע ל${desired_outcome} - באמצעות ${unique_approach}.`;

  const website_text = `${credential}. אני מתמחה בעזרה ל${ideal_client}, ומתמקד/ת ב${problem_solved}. הגישה שלי: ${unique_approach}. התוצאה? ${desired_outcome}. רוצה/ה ${cta}?`;

  const linkedin_text = `${uvp_statement}\n\n${credential}\n\nאם גם אתם מתמודדים עם ${problem_solved} - בואו נדבר. ${cta}.`;

  const sales_pitch = `שלום! אני עוזר/ת בדיוק ל${ideal_client} כמוך להתגבר על ${problem_solved} ולהגיע ל${desired_outcome}. ${credential}. רוצה/ה ${cta}?`;

  return { uvp_statement, website_text, linkedin_text, sales_pitch };
}
