// Picks a visual theme for a business's public page from its profession, so
// a bakery's page looks warm and sweet, a nail studio's soft and lilac, a
// photographer's cool and blue - and every business gets a page that feels
// like its own. Serious, B2B-ish businesses (a building contractor, a lawyer,
// an accountant) get the "professional" style instead: a clean, corporate
// layout with line icons and no playful stickers. Pure function (no React),
// so it's easy to unit test.

export type IconKey =
  | "cupcake"
  | "coffee"
  | "nailPolish"
  | "scissors"
  | "camera"
  | "dumbbell"
  | "palette"
  | "car"
  | "storefront"
  | "priceTag"
  | "megaphone"
  // Line icons for the professional style
  | "helmet"
  | "scales"
  | "chart"
  | "laptop"
  | "house"
  | "compass";

export type ThemeStyle = "playful" | "professional";

export type PatternKey = "dots" | "confetti" | "waves";

export type BusinessTheme = {
  key: string;
  style: ThemeStyle;
  // Hebrew greeting line above the business name
  tagline: string;
  // accent = decorations only; deep = text and buttons (AA contrast on
  // white and on soft); soft = section backgrounds; wash = page background.
  colors: { accent: string; deep: string; soft: string; wash: string };
  icons: IconKey[];
  pattern: PatternKey;
  // Section titles that fit the kind of business ("פרויקטים נבחרים" for a
  // contractor, "גלריה" for a bakery).
  labels: { gallery: string; documents: string; contact: string };
};

type ThemeDef = Omit<BusinessTheme, "pattern" | "style" | "labels"> & {
  keywords: string[];
  style?: ThemeStyle;
  labels?: Partial<BusinessTheme["labels"]>;
};

const PLAYFUL_LABELS: BusinessTheme["labels"] = {
  gallery: "גלריה",
  documents: "מסמכים להורדה",
  contact: "בואו נדבר! 💬",
};

const PROFESSIONAL_LABELS: BusinessTheme["labels"] = {
  gallery: "עבודות נבחרות",
  documents: "מסמכים ותעודות",
  contact: "יצירת קשר",
};

// For professional themes: deep = the dark hero/header color (white text on
// it); accent = buttons and highlights (dark text on it, AA contrast).
// Checked before the playful themes, so e.g. "בניית אתרים" is tech, not
// construction, and "הנהלת חשבונות" never falls through to anything cute.
const PROFESSIONAL_THEMES: ThemeDef[] = [
  {
    key: "tech",
    style: "professional",
    keywords: ["בניית אתרים", "אתרים", "תוכנ", "פיתוח", "מתכנת", "סייבר", "מחשב", "דיגיטל", "software", "developer", "web"],
    tagline: "פתרונות טכנולוגיים שעובדים",
    colors: { accent: "#38bdf8", deep: "#0f172a", soft: "#f1f5f9", wash: "#ffffff" },
    icons: ["laptop"],
    labels: { gallery: "פרויקטים נבחרים" },
  },
  {
    key: "construction",
    style: "professional",
    keywords: ["קבלן", "בנייה", "בניה", "שיפוצ", "שיפוץ", "אינסטלט", "חשמלא", "ריצוף", "גבס", "איטום", "מסגר", "נגר", "construction", "contractor"],
    tagline: "בונים נכון, מהיסוד",
    colors: { accent: "#f59e0b", deep: "#1f2937", soft: "#f3f4f6", wash: "#ffffff" },
    icons: ["helmet"],
    labels: { gallery: "פרויקטים נבחרים", documents: "רישיונות ותעודות" },
  },
  {
    key: "legal",
    style: "professional",
    keywords: ["עורך דין", "עורכת דין", "עו\"ד", "משפט", "נוטריון", "lawyer", "legal"],
    tagline: "ליווי משפטי מקצועי ואישי",
    colors: { accent: "#c9a96e", deep: "#1e293b", soft: "#f8f6f1", wash: "#ffffff" },
    icons: ["scales"],
    labels: { gallery: "מהמשרד" },
  },
  {
    key: "finance",
    style: "professional",
    keywords: ["רואה חשבון", "רואת חשבון", "חשבונות", "יועץ מס", "יועצת מס", "פיננס", "ביטוח", "משכנת", "כלכל", "ייעוץ עסקי", "יועץ עסקי", "יועצת עסקית", "accountant", "finance", "consult"],
    tagline: "שקט נפשי בכל מה שקשור לכסף",
    colors: { accent: "#34d399", deep: "#0f2f2a", soft: "#f0fdf8", wash: "#ffffff" },
    icons: ["chart"],
  },
  {
    key: "realestate",
    style: "professional",
    keywords: ["נדל", "תיווך", "מתווך", "שמאי", "real estate"],
    tagline: "הבית הבא שלכם מתחיל כאן",
    colors: { accent: "#fbbf24", deep: "#172554", soft: "#f5f7fb", wash: "#ffffff" },
    icons: ["house"],
    labels: { gallery: "נכסים נבחרים" },
  },
  {
    key: "architecture",
    style: "professional",
    keywords: ["אדריכל", "מהנדס", "הנדס", "שרטוט", "architect", "engineer"],
    tagline: "תכנון מדויק, ביצוע מושלם",
    colors: { accent: "#fb923c", deep: "#18181b", soft: "#f4f4f5", wash: "#ffffff" },
    icons: ["compass"],
    labels: { gallery: "פרויקטים נבחרים" },
  },
];

const THEMES: ThemeDef[] = [
  {
    key: "sweets",
    keywords: ["קונדיט", "אפיי", "אופה", "עוג", "קינוח", "מאפ", "שוקולד", "bake", "cake", "pastry"],
    tagline: "נאפה באהבה, מוגש בחיוך",
    colors: { accent: "#ff7a59", deep: "#9a3412", soft: "#ffe8dd", wash: "#fff8f2" },
    icons: ["cupcake", "coffee", "priceTag"],
  },
  {
    key: "food",
    keywords: ["שף", "בישול", "קייטרינג", "אוכל", "מסעד", "בית קפה", "קפה", "chef", "food", "catering"],
    tagline: "טעמים שזוכרים",
    colors: { accent: "#f59e0b", deep: "#92400e", soft: "#fef3c7", wash: "#fffbeb" },
    icons: ["coffee", "cupcake", "storefront"],
  },
  {
    key: "nails",
    keywords: ["ציפורנ", "לק ג", "מניקור", "פדיקור", "ג'ל", "nail"],
    tagline: "הפינוק שמגיע לך",
    colors: { accent: "#9b7bff", deep: "#5b21b6", soft: "#efe9ff", wash: "#faf7ff" },
    icons: ["nailPolish", "palette", "priceTag"],
  },
  {
    key: "beauty",
    keywords: ["קוסמט", "איפור", "מאפר", "ריסים", "גבות", "יופי", "טיפוח", "beauty", "makeup"],
    tagline: "יופי שמרגישים",
    colors: { accent: "#ec4899", deep: "#9d174d", soft: "#fce7f3", wash: "#fff7fb" },
    icons: ["nailPolish", "scissors", "palette"],
  },
  {
    key: "hair",
    keywords: ["שיער", "מספרה", "ספרית", "תספור", "hair", "barber"],
    tagline: "הלוק החדש שלך מתחיל כאן",
    colors: { accent: "#14b8a6", deep: "#115e59", soft: "#ccfbf1", wash: "#f2fdfb" },
    icons: ["scissors", "palette", "nailPolish"],
  },
  {
    key: "photo",
    keywords: ["צילום", "צלם", "וידאו", "סרט", "photo", "video"],
    tagline: "רגעים שנשארים לתמיד",
    colors: { accent: "#4f8bff", deep: "#1e40af", soft: "#dde9ff", wash: "#f5f8ff" },
    icons: ["camera", "palette", "storefront"],
  },
  {
    key: "fitness",
    keywords: ["כושר", "אימון", "מאמנ", "יוגה", "פילאטיס", "ריצה", "fitness", "trainer", "yoga"],
    tagline: "בואו נזוז ביחד",
    colors: { accent: "#22c55e", deep: "#166534", soft: "#dcfce7", wash: "#f4fdf7" },
    icons: ["dumbbell", "coffee", "priceTag"],
  },
  {
    key: "wellness",
    keywords: ["דיאט", "תזונ", "עיסוי", "טיפול", "מטפל", "רפוא", "נטורופת", "wellness", "therapy"],
    tagline: "להרגיש טוב, מבפנים ומבחוץ",
    colors: { accent: "#34c79a", deep: "#065f46", soft: "#d4f5e9", wash: "#f3fcf8" },
    icons: ["coffee", "dumbbell", "priceTag"],
  },
  {
    key: "creative",
    keywords: ["עיצוב", "מעצב", "גרפ", "אמנ", "ציור", "יצירה", "תכשיט", "design", "art"],
    tagline: "רעיונות שהופכים למציאות",
    colors: { accent: "#eab308", deep: "#854d0e", soft: "#fef9c3", wash: "#fffdf0" },
    icons: ["palette", "camera", "megaphone"],
  },
  {
    key: "driving",
    keywords: ["נהיגה", "driving"],
    tagline: "בדרך הבטוחה לרישיון",
    colors: { accent: "#ff7a59", deep: "#1e3a8a", soft: "#dbeafe", wash: "#f5f8ff" },
    icons: ["car", "priceTag", "storefront"],
  },
];

const DEFAULT_THEME: ThemeDef = {
  key: "default",
  keywords: [],
  tagline: "עסק קטן, לב גדול",
  colors: { accent: "#ff7a59", deep: "#1e3a8a", soft: "#dde9ff", wash: "#fff8ef" },
  icons: ["storefront", "megaphone", "priceTag"],
};

const PATTERNS: PatternKey[] = ["dots", "confetti", "waves"];

// Tiny stable string hash - same slug always gives the same result, so a
// page never changes its look between visits.
function hash(text: string): number {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return h;
}

export function getBusinessTheme(profession: string, slug: string): BusinessTheme {
  const text = profession.toLowerCase();
  const def =
    [...PROFESSIONAL_THEMES, ...THEMES].find((t) => t.keywords.some((k) => text.includes(k))) ??
    DEFAULT_THEME;
  const style = def.style ?? "playful";
  // Two businesses of the same kind still get their own background pattern.
  return {
    key: def.key,
    style,
    tagline: def.tagline,
    colors: def.colors,
    icons: def.icons,
    labels: { ...(style === "professional" ? PROFESSIONAL_LABELS : PLAYFUL_LABELS), ...def.labels },
    pattern: PATTERNS[hash(slug) % PATTERNS.length],
  };
}
