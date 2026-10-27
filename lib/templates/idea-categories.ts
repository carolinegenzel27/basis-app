// The kinds of writing ideas the branding page generates. Kept apart from
// lib/ai/branding-ideas.ts so client components can import it without
// pulling the Anthropic SDK into the browser bundle.
export const IDEA_CATEGORIES = [
  { key: "slogans", label: "סלוגנים", hint: "משפט קצר וקליט" },
  { key: "uvp_statement", label: "הצהרת ערך", hint: "מה את/ה נותן/ת ולמי" },
  { key: "instagram_bio", label: "ביו לאינסטגרם", hint: "עד 150 תווים" },
  { key: "website_text", label: "טקסט לאתר", hint: "פסקת \"עליי\"" },
  { key: "social_post", label: "פוסט לרשתות", hint: "פייסבוק / לינקדאין" },
  { key: "sales_pitch", label: "פיץ' מכירתי", hint: "הודעה ללקוח חדש" },
] as const;

export type IdeaKey = (typeof IDEA_CATEGORIES)[number]["key"];
