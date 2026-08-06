export type Profession = "driving_instructor" | "dietitian" | "private_chef";

export type QuestionField = { name: string; label: string; placeholder: string };

// Same 6 underlying field names for every profession (so the DB schema and
// the template engine in branding-templates.ts stay generic) - only the
// wording and example changes, to feel natural for each profession.
//
// Placeholders are real example ANSWERS (short phrases, not full sentences) -
// they double as a format hint, so people answer in a way that slots
// cleanly into the generated sentences instead of writing full paragraphs.
const QUESTIONS_BY_PROFESSION: Record<Profession, QuestionField[]> = {
  driving_instructor: [
    {
      name: "ideal_client",
      label: "מי התלמיד האידיאלי שלך? (בביטוי קצר)",
      placeholder: "הורים לנוער חסר ביטחון",
    },
    {
      name: "problem_solved",
      label: "איזה פחד או קושי בנהיגה הכי בולט אצל התלמידים שלך?",
      placeholder: "פחד מכבישים מהירים",
    },
    {
      name: "desired_outcome",
      label: "מה התלמיד מרגיש אחרי שעבר איתך את הטסט?",
      placeholder: "ביטחון מלא מאחורי ההגה",
    },
    {
      name: "unique_approach",
      label: "מה מייחד את שיטת ההוראה שלך?",
      placeholder: "לימוד הדרגתי וסבלני, בקצב של כל תלמיד",
    },
    {
      name: "credential",
      label: "מה ההישג הכי בולט שלך?",
      placeholder: "12 שנות ניסיון, מעל 500 תלמידים שעברו טסט",
    },
    {
      name: "cta",
      label: "מה הפעולה שחשוב שהלקוח יעשה?",
      placeholder: "לקבוע שיעור ניסיון",
    },
  ],
  dietitian: [
    {
      name: "ideal_client",
      label: "מי הלקוח/ה האידיאלי/ת שלך? (בביטוי קצר)",
      placeholder: "נשים אחרי לידה שרוצות לחזור לעצמן",
    },
    {
      name: "problem_solved",
      label: "עם איזה אתגר תזונתי הלקוחות שלך הכי מתמודדים?",
      placeholder: "חוסר זמן לבשל בריא",
    },
    {
      name: "desired_outcome",
      label: "לאיזו תוצאה הם מגיעים אחרי התהליך?",
      placeholder: "אנרגיה יציבה וירידה במשקל בלי דיאטות קיצוניות",
    },
    {
      name: "unique_approach",
      label: "מה מייחד את שיטת הליווי התזונתי שלך?",
      placeholder: "תפריטים אישיים גמישים, בלי הימנעות מוחלטת",
    },
    {
      name: "credential",
      label: "מה ההישג הכי בולט שלך?",
      placeholder: "דיאטנית קלינית מוסמכת, ליוותה מעל 300 לקוחות",
    },
    {
      name: "cta",
      label: "מה הפעולה שחשוב שהלקוח יעשה?",
      placeholder: "לקבוע פגישת ייעוץ ראשונה",
    },
  ],
  private_chef: [
    {
      name: "ideal_client",
      label: "מי הלקוח האידיאלי שמזמין אותך? (בביטוי קצר)",
      placeholder: "זוגות שמארחים אירועים קטנים ואינטימיים",
    },
    {
      name: "problem_solved",
      label: "מה הצורך או האירוע שבשבילו לקוחות פונים אליך?",
      placeholder: "ארוחת יום הולדת מיוחדת בבית",
    },
    {
      name: "desired_outcome",
      label: "איזו חוויה הלקוחות מקבלים מהארוחה או מהאירוע?",
      placeholder: "חוויית מסעדה יוקרתית בלי לצאת מהבית",
    },
    {
      name: "unique_approach",
      label: "מה מייחד את סגנון הבישול או השירות שלך?",
      placeholder: "מטבח ים-תיכוני עונתי עם מגע אישי",
    },
    {
      name: "credential",
      label: "מה ההישג הכי בולט שלך?",
      placeholder: "שף מוסמך, הגיש מעל 200 אירועים פרטיים",
    },
    {
      name: "cta",
      label: "מה הפעולה שחשוב שהלקוח יעשה?",
      placeholder: "לתאם שיחת תכנון תפריט",
    },
  ],
};

export function getBrandingQuestions(profession: Profession): QuestionField[] {
  return (
    QUESTIONS_BY_PROFESSION[profession] ?? QUESTIONS_BY_PROFESSION.driving_instructor
  );
}
