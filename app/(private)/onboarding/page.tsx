import { OnboardingForm } from "@/components/forms/OnboardingForm";
import { IllustratedBackground } from "@/components/illustrations/IllustratedBackground";
import { HeroScene } from "@/components/illustrations/HeroScene";

// Submitting runs the AI market search (lib/actions/business-profile.ts),
// which can take up to a minute - give the Server Action room to finish.
export const maxDuration = 120;

const STEPS = ["פרטי העסק", "שאלון התאמה", "מתחילים!"];

export default function OnboardingPage() {
  return (
    <div className="relative min-h-screen bg-cream overflow-hidden text-ink">
      <IllustratedBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-10">
        {/* Intro across the top - text on the right (RTL), illustration on the left */}
        <header className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center animate-pop-in">
          <div className="space-y-6">
            <div className="font-extrabold text-2xl text-blue-950">
              Basis<span className="text-coral">.</span>
            </div>

            <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold" aria-label="שלבי ההרשמה">
              {STEPS.map((label, i) => (
                <li key={label} className="flex items-center gap-2">
                  <span
                    className={`inline-flex w-7 h-7 items-center justify-center rounded-full border-2 border-ink text-xs ${
                      i === 0 ? "bg-coral text-white" : "bg-white text-ink/50"
                    }`}
                    aria-current={i === 0 ? "step" : undefined}
                  >
                    {i + 1}
                  </span>
                  <span className={i === 0 ? "" : "text-ink/45"}>{label}</span>
                  {i < STEPS.length - 1 && <span className="w-6 h-0.5 bg-ink/20 rounded" aria-hidden="true" />}
                </li>
              ))}
            </ol>

            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-950 leading-tight">
                ברוכים הבאים! 👋 ספרו לנו על העסק
              </h1>
              <p className="text-ink/65 mt-4 text-lg sm:text-xl leading-relaxed max-w-2xl">
                כל עסק מתאים - מאפייה ביתית, סטודיו לציפורניים, צלם או מאמנת. לפי מה
                שתכתבו נחפש בשוק מחירים לשירותים שלכם.
              </p>
            </div>
          </div>

          <HeroScene className="hidden lg:block w-full max-w-md mx-auto h-auto" />
        </header>

        {/* The form itself, spread across the page */}
        <section className="animate-pop-in border-t-2 border-dashed border-ink/15 pt-10">
          <OnboardingForm />
        </section>
      </div>
    </div>
  );
}
