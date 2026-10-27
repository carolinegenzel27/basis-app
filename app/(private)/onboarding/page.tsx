import { OnboardingForm } from "@/components/forms/OnboardingForm";
import { Logo } from "@/components/brand/Logo";

// Submitting runs the AI market search (lib/actions/business-profile.ts),
// which can take up to a minute - give the Server Action room to finish.
export const maxDuration = 120;

const STEPS = ["פרטי העסק", "שאלון התאמה", "מתחילים!"];

export default function OnboardingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 right-[5%] w-[34rem] h-[34rem] rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute top-60 -left-32 w-[28rem] h-[28rem] rounded-full bg-coral/10 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Logo href="/onboarding" />
          <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold" aria-label="שלבי ההרשמה">
            {STEPS.map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-xs ${
                    i === 0 ? "bg-ink text-white" : "bg-ink/[0.06] text-ink/45"
                  }`}
                  aria-current={i === 0 ? "step" : undefined}
                >
                  {i + 1}
                </span>
                <span className={i === 0 ? "text-ink" : "text-ink/45"}>{label}</span>
                {i < STEPS.length - 1 && <span className="w-6 h-px bg-ink/15" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>

        <header className="max-w-3xl animate-fade-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            ברוכים הבאים! ספרו לנו על העסק
          </h1>
          <p className="text-ink/60 mt-4 text-lg sm:text-xl leading-relaxed">
            כל עסק מתאים - מאפייה ביתית, קבלן, סטודיו לציפורניים או משרד עורכי דין.
            לפי מה שתכתבו נחפש בשוק מחירים לשירותים שלכם ונבנה לכם עמוד עסקי.
          </p>
        </header>

        <section className="animate-fade-up [animation-delay:100ms] border-t border-ink/[0.08] pt-10">
          <OnboardingForm />
        </section>
      </div>
    </div>
  );
}
