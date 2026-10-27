import type { BRANDING_TONES } from "@/lib/validations/branding";

export type QuestionField = { name: string; label: string; placeholder: string };

// One generic set of questions for every kind of business - the AI adapts
// the wording of the ideas to the profession, so the questions don't have to.
// Placeholders are example answers (short phrases), which doubles as a hint
// for how much to write.
export const BRANDING_QUESTIONS: QuestionField[] = [
  {
    name: "ideal_client",
    label: "מי הלקוחות שהכי כיף לך לעבוד איתם?",
    placeholder: "אמהות צעירות שמחפשות עוגות יום הולדת מיוחדות",
  },
  {
    name: "problem_solved",
    label: "איזה צורך או בעיה את/ה פותר/ת להם?",
    placeholder: "אין להם זמן ורוצים משהו שנראה מושלם בתמונות",
  },
  {
    name: "desired_outcome",
    label: "מה הלקוח מרגיש או מקבל בסוף?",
    placeholder: "אורחים מתלהבים ורגע שזוכרים",
  },
  {
    name: "unique_approach",
    label: "מה מייחד אותך מהמתחרים?",
    placeholder: "עיצוב אישי לכל הזמנה, חומרי גלם טבעיים",
  },
  {
    name: "credential",
    label: "הישג או ניסיון שכדאי להבליט",
    placeholder: "8 שנים בתחום, מעל 1,000 הזמנות",
  },
  {
    name: "cta",
    label: "מה הפעולה שהכי חשוב שהלקוח יעשה?",
    placeholder: "לשלוח הודעה בוואטסאפ",
  },
];

export const TONE_LABELS: Record<(typeof BRANDING_TONES)[number], string> = {
  warm: "חם ואישי",
  professional: "מקצועי ורציני",
  playful: "קליל ושנון",
  luxury: "יוקרתי ומוקפד",
};
