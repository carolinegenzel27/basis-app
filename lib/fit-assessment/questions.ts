export type FitQuestionCategory = "pricing" | "branding";

export type FitQuestion = {
  id: string;
  category: FitQuestionCategory;
  text: string;
};

// Direct scale: agreeing with a question means the user *does* feel that
// need, so a higher score always means "more need for that service".
export const FIT_QUESTIONS: FitQuestion[] = [
  {
    id: "pricing_confidence",
    category: "pricing",
    text: "אני לא בטוח/ה כמה לגבות על השירותים שלי - לרוב אני מרגיש/ה שאני מנחש/ת.",
  },
  {
    id: "branding_pitch",
    category: "branding",
    text: "קשה לי להסביר ללקוח פוטנציאלי למה כדאי לבחור דווקא בי, ולא במתחרה.",
  },
  {
    id: "pricing_consistency",
    category: "pricing",
    text: "אני משנה את המחיר שלי בצורה לא עקבית, בלי שיטה ברורה, מלקוח ללקוח.",
  },
  {
    id: "branding_materials",
    category: "branding",
    text: "אין לי תיאור עסק או פרופיל מסודר שאני שולח/ת ללקוחות פוטנציאליים.",
  },
  {
    id: "pricing_value",
    category: "pricing",
    text: "אני לא בטוח/ה שאני מקבל/ת את השווי האמיתי שלי מהעבודה שאני עושה.",
  },
];

export const LIKERT_OPTIONS = [
  { value: 4, label: "מסכים/ה מאוד" },
  { value: 3, label: "מסכים/ה" },
  { value: 2, label: "לא מסכים/ה" },
  { value: 1, label: "לא מסכים/ה בכלל" },
] as const;
