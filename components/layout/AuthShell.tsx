import { Logo } from "@/components/brand/Logo";
import { PriceTag, Megaphone, Storefront } from "@/components/illustrations/BusinessIcons";

const PERKS = [
  { Icon: PriceTag, text: "מחירי שוק אמיתיים לשירותים שלך" },
  { Icon: Megaphone, text: "רעיונות למיתוג ולכתיבה עם AI" },
  { Icon: Storefront, text: "עמוד עסקי מעוצב, מותאם לתחום שלך" },
];

// Shared frame for the login and signup pages: the form on one side, a
// brand panel with what you get on the other (desktop only). Same visual
// language as the welcome page and the app.
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-cream text-ink">
      {/* ---------- Form side ---------- */}
      <main className="relative flex flex-col px-4 sm:px-10 py-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-blue-300/20 blur-3xl" />
        </div>
        <div className="relative">
          <Logo />
        </div>

        <div className="relative flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-md animate-fade-up">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
            <p className="mt-2 text-ink/60 text-lg">{subtitle}</p>
            <div className="mt-8 rounded-2xl bg-white border border-ink/[0.08] shadow-card p-6 sm:p-8">
              {children}
            </div>
            <p className="mt-6 text-center text-ink/65">{footer}</p>
          </div>
        </div>
      </main>

      {/* ---------- Brand side ---------- */}
      <aside className="hidden lg:flex relative overflow-hidden bg-ink text-white p-12 flex-col justify-between">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-24 -left-20 w-[28rem] h-[28rem] rounded-full bg-blue-500/30 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-coral/25 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>

        <p className="relative text-sm font-semibold text-white/60">הבסיס להצלחה שלך</p>

        <div className="relative">
          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
            כל הכלים של עסק גדול.
            <br />
            <span className="text-sun">בגודל שמתאים לך.</span>
          </h2>
          <ul className="mt-10 space-y-4">
            {PERKS.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-4">
                <span className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0" aria-hidden="true">
                  <Icon className="w-8 h-8" />
                </span>
                <span className="text-lg text-white/85">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-white/50 text-sm">חינם להתחלה · בעברית מלאה · בלי ידע טכני</p>
      </aside>
    </div>
  );
}
