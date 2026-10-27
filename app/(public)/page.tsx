import Link from "next/link";
import { HeroScene } from "@/components/illustrations/HeroScene";
import { IllustratedBackground } from "@/components/illustrations/IllustratedBackground";
import {
  Megaphone,
  PriceTag,
  QuoteDoc,
  Storefront,
  Sparkle,
  Squiggle,
  Cupcake,
  NailPolish,
  Camera,
  Scissors,
  Dumbbell,
  Coffee,
  Palette,
} from "@/components/illustrations/BusinessIcons";

const BUSINESS_TYPES = [
  { label: "קונדיטוריות", Icon: Cupcake },
  { label: "מניקוריסטיות", Icon: NailPolish },
  { label: "צלמים", Icon: Camera },
  { label: "מספרות", Icon: Scissors },
  { label: "מאמני כושר", Icon: Dumbbell },
  { label: "בתי קפה", Icon: Coffee },
  { label: "מעצבים", Icon: Palette },
];

const HIGHLIGHTS = [
  {
    title: "יועץ תמחור",
    description: "מחפשים בשבילך מחירי שוק אמיתיים לשירותים שלך - עוגה, לק ג'ל, צילום או כל דבר אחר.",
    Icon: PriceTag,
    tint: "bg-sun-soft",
  },
  {
    title: "מיתוג עם AI",
    description: "רעיונות לסלוגנים, ביו לאינסטגרם, טקסט לאתר ופוסטים - מעתיקים בלחיצה ומשתמשים.",
    Icon: Megaphone,
    tint: "bg-coral-soft",
  },
  {
    title: "הצעות מחיר",
    description: "הצעות מחיר מקצועיות שיורדות כ-PDF תוך שנייה, ישר מהמחיר המומלץ.",
    Icon: QuoteDoc,
    tint: "bg-sky-soft",
  },
  {
    title: "עמוד ציבורי",
    description: "כרטיס ביקור דיגיטלי לעסק - לינק אחד שאפשר לשלוח לכל לקוח.",
    Icon: Storefront,
    tint: "bg-mint-soft",
  },
];

const STEPS = [
  { n: "1", title: "מספרים על העסק", text: "שם, תחום ומה מוכרים - דקה וחצי." },
  { n: "2", title: "אנחנו מחפשים בשוק", text: "מחירים ורעיונות שמותאמים בדיוק לעסק שלך." },
  { n: "3", title: "מתחילים להרוויח", text: "מתמחרים, ממתגים ושולחים הצעות מחיר." },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-cream overflow-hidden text-ink">
      <IllustratedBackground />

      <header className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        {/* Plain text wordmark - the logo image is kept for inside the app
            (see Navbar.tsx). */}
        <Link href="/" className="font-extrabold text-2xl text-blue-950 tracking-tight">
          Basis<span className="text-coral">.</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4 text-sm">
          <Link href="/login" className="px-3 py-2 font-medium text-ink/70 hover:text-blue-800">
            התחברות
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-ink px-5 py-2.5 text-white font-semibold hover:bg-blue-900 transition shadow-[0_4px_0_#ff7a59]"
          >
            הרשמה
          </Link>
        </nav>
      </header>

      <main className="relative z-10 flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-12 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-right space-y-6 animate-pop-in">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border-2 border-ink px-4 py-1.5 text-sm font-semibold shadow-[3px_3px_0_#1e1b4b]">
              <Sparkle className="w-4" />
              לכל עסק קטן, מכל תחום
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-blue-950">
              המינוף{" "}
              <span className="relative inline-block">
                <span className="relative z-10">שחסר</span>
                <span className="absolute inset-x-0 bottom-1 h-4 bg-sun/80 -z-0 rounded-full" aria-hidden="true" />
              </span>{" "}
              לעסק שלך
            </h1>
            <p className="text-lg sm:text-xl text-ink/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              קונדיטורית, מניקוריסטית, צלם או מאמנת - Basis מוצא בשבילך את המחירים
              בשוק, כותב לך טקסטים שיווקיים, ומפיק הצעות מחיר מקצועיות. הכל במקום אחד.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start pt-2">
              <Link
                href="/signup"
                className="rounded-full bg-coral px-8 py-4 text-lg text-white font-bold border-2 border-ink shadow-[4px_4px_0_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#1e1b4b] transition"
              >
                להתחיל בחינם
              </Link>
              <Link href="/login" className="text-ink/70 font-medium underline underline-offset-4 hover:text-blue-800">
                כבר יש לי חשבון
              </Link>
            </div>
          </div>

          <div className="relative">
            <HeroScene className="w-full max-w-lg mx-auto h-auto drop-shadow-[0_12px_24px_rgba(30,27,75,0.12)]" />
          </div>
        </section>

        {/* Every kind of business */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
          <p className="text-center text-sm font-semibold text-ink/60 mb-4">מתאים בדיוק ל...</p>
          <ul className="flex flex-wrap justify-center gap-3">
            {BUSINESS_TYPES.map(({ label, Icon }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full bg-white border-2 border-ink/10 pl-4 pr-2 py-1.5 font-medium shadow-sm"
              >
                <Icon className="w-8 h-8" />
                {label}
              </li>
            ))}
            <li className="flex items-center rounded-full bg-ink text-white px-4 py-1.5 font-medium">
              ועוד כל עסק שתחשבו עליו ✨
            </li>
          </ul>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-3xl font-extrabold text-blue-950">כל מה שהעסק צריך</h2>
            <Squiggle className="w-24 mx-auto" color="#ff7a59" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HIGHLIGHTS.map(({ title, description, Icon, tint }) => (
              <div
                key={title}
                className="group rounded-3xl bg-white border-2 border-ink p-6 shadow-[5px_5px_0_#1e1b4b] hover:-translate-y-1 transition"
              >
                <div className={`w-20 h-20 rounded-2xl ${tint} flex items-center justify-center mb-4 group-hover:rotate-[-4deg] transition`}>
                  <Icon className="w-14 h-14" />
                </div>
                <h3 className="text-lg font-bold text-blue-950">{title}</h3>
                <p className="text-sm text-ink/65 mt-1.5 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="rounded-[2rem] bg-white/80 backdrop-blur border-2 border-ink/10 p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 text-center mb-8">איך זה עובד?</h2>
            <ol className="grid sm:grid-cols-3 gap-6">
              {STEPS.map((step, i) => (
                <li key={step.n} className="text-center space-y-2">
                  <span
                    className={`inline-flex w-12 h-12 items-center justify-center rounded-full text-xl font-extrabold border-2 border-ink ${
                      ["bg-sun", "bg-coral text-white", "bg-mint text-white"][i]
                    }`}
                  >
                    {step.n}
                  </span>
                  <h3 className="font-bold text-lg">{step.title}</h3>
                  <p className="text-ink/65 text-sm">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
          <div className="relative rounded-[2rem] bg-blue-950 text-white px-6 py-12 text-center overflow-hidden">
            <Sparkle className="absolute top-6 right-8 w-8 animate-wiggle" />
            <Sparkle className="absolute bottom-8 left-10 w-6 animate-wiggle" color="#ff7a59" />
            <h2 className="text-3xl sm:text-4xl font-extrabold">העסק שלך מגיע לזה.</h2>
            <p className="mt-3 text-white/75 text-lg">פותחים חשבון בחינם ומתחילים תוך דקה.</p>
            <Link
              href="/signup"
              className="inline-block mt-7 rounded-full bg-sun text-ink px-8 py-4 text-lg font-bold border-2 border-ink shadow-[4px_4px_0_#ff7a59] hover:translate-y-[2px] transition"
            >
              יאללה, מתחילים
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
