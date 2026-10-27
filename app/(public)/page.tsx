import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ui } from "@/lib/ui";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { Testimonials, BusinessAvatarStack } from "@/components/landing/Testimonials";
import {
  Camera,
  Car,
  Coffee,
  Cupcake,
  Dumbbell,
  Megaphone,
  NailPolish,
  Palette,
  PriceTag,
  QuoteDoc,
  Scissors,
  Storefront,
} from "@/components/illustrations/BusinessIcons";
import { ChartIcon, HelmetIcon, ScalesIcon } from "@/components/illustrations/ProIcons";

const BUSINESS_TYPES = [
  { label: "קונדיטוריות", Icon: Cupcake },
  { label: "סטודיו לציפורניים", Icon: NailPolish },
  { label: "קבלנים", Icon: HelmetIcon },
  { label: "צלמים", Icon: Camera },
  { label: "מספרות", Icon: Scissors },
  { label: "עורכי דין", Icon: ScalesIcon },
  { label: "מאמני כושר", Icon: Dumbbell },
  { label: "בתי קפה", Icon: Coffee },
  { label: "רואי חשבון", Icon: ChartIcon },
  { label: "מעצבים", Icon: Palette },
  { label: "מורים לנהיגה", Icon: Car },
];

const FEATURES = [
  {
    title: "יועץ תמחור חכם",
    description: "מחפשים בשבילך מחירי שוק אמיתיים לשירותים שלך - ומראים לך בדיוק כמה לגבות.",
    Icon: PriceTag,
    tint: "bg-sun-soft",
  },
  {
    title: "מיתוג וכתיבה עם AI",
    description: "סלוגנים, ביו לאינסטגרם, טקסט לאתר ופוסטים - כמה גרסאות לכל אחד, מוכנים להעתקה.",
    Icon: Megaphone,
    tint: "bg-coral-soft",
  },
  {
    title: "הצעות מחיר ב-PDF",
    description: "הצעת מחיר מעוצבת ומקצועית תוך שניות, ישר מהמחיר המומלץ.",
    Icon: QuoteDoc,
    tint: "bg-sky-soft",
  },
  {
    title: "עמוד עסקי משלך",
    description: "מיני-אתר שמותאם לסוג העסק שלך - לינק אחד לשלוח לכל לקוח.",
    Icon: Storefront,
    tint: "bg-mint-soft",
  },
];

const STEPS = [
  { title: "מספרים על העסק", text: "שם, תחום ומה אתם מוכרים. לוקח פחות משתי דקות." },
  { title: "אנחנו עושים את העבודה", text: "חיפוש מחירים בשוק, רעיונות למיתוג ועמוד עסקי - מותאמים בדיוק אליכם." },
  { title: "מתחילים להרוויח", text: "מתמחרים בביטחון, משתפים את העמוד ושולחים הצעות מחיר." },
];

const PROMISES = ["חינם להתחלה", "בעברית מלאה", "בלי ידע טכני"];

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-50 focus:rounded-lg focus:bg-ink focus:text-white focus:px-4 focus:py-2">
        דילוג לתוכן
      </a>

      {/* ---------- Nav ---------- */}
      <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-ink/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Logo />
          <nav aria-label="ניווט ראשי" className="hidden md:flex items-center gap-7 text-sm font-medium text-ink/70">
            <a href="#features" className="hover:text-ink">מה מקבלים</a>
            <a href="#how" className="hover:text-ink">איך זה עובד</a>
            <a href="#testimonials" className="hover:text-ink">המלצות</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-2 text-sm font-semibold text-ink/75 hover:text-ink rounded-lg">
              התחברות
            </Link>
            <Link href="/signup" className={`${ui.btnPrimary} !py-2.5 text-sm`}>
              התחילו בחינם
            </Link>
          </div>
        </div>
      </header>

      <main id="main">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden">
          {/* soft background glow + faint grid */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -top-40 right-[10%] w-[36rem] h-[36rem] rounded-full bg-blue-300/25 blur-3xl" />
            <div className="absolute top-40 -left-20 w-[30rem] h-[30rem] rounded-full bg-coral/15 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,27,75,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,27,75,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-20 sm:pt-20 sm:pb-28 grid lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-10 items-center">
            <div className="text-center lg:text-right animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-ink/10 shadow-sm px-3.5 py-1.5 text-sm font-semibold text-ink/80">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                הפלטפורמה לעסקים קטנים · מבוססת AI
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold tracking-tight leading-[1.08]">
                העסק שלך מגיע ל
                <span className="bg-gradient-to-l from-blue-600 via-lilac to-coral bg-clip-text text-transparent">
                  יותר
                </span>
                .
                <br />
                אנחנו נעזור לו להגיע לשם.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-ink/65 leading-relaxed max-w-xl mx-auto lg:mx-0">
                תמחור לפי מחירי השוק, מיתוג שכותב את עצמו, הצעות מחיר מקצועיות
                ועמוד עסקי מעוצב - הכל במקום אחד, לכל סוג של עסק.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                <Link href="/signup" className={`${ui.btnPrimary} w-full sm:w-auto !px-7 !py-3.5 text-lg`}>
                  התחילו בחינם
                  <span aria-hidden="true">←</span>
                </Link>
                <a href="#how" className={`${ui.btnSecondary} w-full sm:w-auto !px-7 !py-3.5 text-lg`}>
                  איך זה עובד?
                </a>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start text-sm text-ink/60">
                {PROMISES.map((p) => (
                  <li key={p} className="flex items-center gap-1.5">
                    <Check />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex items-center gap-3 justify-center lg:justify-start">
                <BusinessAvatarStack />
                <p className="text-sm text-ink/60">
                  <span className="font-bold text-ink">מאפיות, קבלנים, צלמים ועוד</span>
                  <br />
                  כל סוג של עסק מרגיש כאן בבית
                </p>
              </div>
            </div>

            <ProductPreview className="max-w-md w-full mx-auto lg:mr-auto animate-fade-up [animation-delay:150ms]" />
          </div>
        </section>

        {/* ---------- Business types ---------- */}
        <section aria-labelledby="types-title" className="border-y border-ink/[0.06] bg-white/60 py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 id="types-title" className="text-center text-sm font-semibold text-ink/50">
              בנוי לכל עסק קטן - מכל תחום
            </h2>
            <ul className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-5">
              {BUSINESS_TYPES.map(({ label, Icon }) => (
                <li key={label} className="flex items-center gap-2.5 text-ink/70 font-semibold">
                  <span className="w-10 h-10 rounded-full bg-white border border-ink/[0.08] shadow-sm flex items-center justify-center text-ink" aria-hidden="true">
                    <Icon className="w-6 h-6" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Features ---------- */}
        <section id="features" aria-labelledby="features-title" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 scroll-mt-16">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-bold text-blue-700">מה מקבלים</p>
            <h2 id="features-title" className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              ארבעה כלים שעושים לעסק סדר
            </h2>
            <p className="mt-4 text-lg text-ink/60">
              כל מה שבדרך כלל דורש יועץ, מעצב וקופירייטר - מוכן תוך דקות.
            </p>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ title, description, Icon, tint }) => (
              <div key={title} className={`${ui.card} p-6 hover:shadow-lift hover:-translate-y-1 transition duration-300`}>
                <div className={`w-14 h-14 rounded-2xl ${tint} flex items-center justify-center`} aria-hidden="true">
                  <Icon className="w-10 h-10" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-ink/60 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section id="how" aria-labelledby="how-title" className="bg-white border-y border-ink/[0.06] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-sm font-bold text-blue-700">איך זה עובד</p>
              <h2 id="how-title" className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
                שלושה צעדים, והעסק נראה אחרת
              </h2>
            </div>
            <ol className="mt-14 grid md:grid-cols-3 gap-10 md:gap-6 relative">
              <div className="hidden md:block absolute top-6 right-[16%] left-[16%] h-px bg-gradient-to-l from-blue-200 via-lilac/40 to-coral/40" aria-hidden="true" />
              {STEPS.map((step, i) => (
                <li key={step.title} className="relative text-center">
                  <span className="relative mx-auto flex w-12 h-12 items-center justify-center rounded-full bg-ink text-white text-lg font-extrabold ring-8 ring-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-ink/60 leading-relaxed max-w-xs mx-auto">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Testimonials ---------- */}
        <section id="testimonials" aria-labelledby="testimonials-title" className="py-20 sm:py-28 scroll-mt-16 overflow-hidden">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-sm font-bold text-blue-700">המלצות</p>
            <h2 id="testimonials-title" className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              בעלי עסקים כמוך כבר מרגישים את ההבדל
            </h2>
          </div>
          <div className="mt-12">
            <Testimonials />
          </div>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
          <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white px-6 py-16 sm:px-16 text-center">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-blue-500/30 blur-3xl" />
              <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-coral/25 blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                מוכנים לתת לעסק דחיפה?
              </h2>
              <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
                פותחים חשבון בחינם, מספרים על העסק - ותוך כמה דקות יש לכם מחירון,
                טקסטים שיווקיים ועמוד עסקי.
              </p>
              <Link
                href="/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white text-ink px-8 py-4 text-lg font-bold hover:bg-sun transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              >
                התחילו עכשיו - בחינם
                <span aria-hidden="true">←</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink/50">
          <Logo />
          <p>הבסיס להצלחה שלך · © {new Date().getFullYear()} Basis</p>
        </div>
      </footer>
    </div>
  );
}
