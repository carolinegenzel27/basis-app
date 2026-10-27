"use client";

import { useActionState } from "react";
import { saveBrandingAnswers, type ActionState } from "@/lib/actions/branding";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { AiWorkingStatus } from "@/components/ui/AiWorkingStatus";
import { BRANDING_QUESTIONS, TONE_LABELS } from "@/lib/templates/branding-questions";
import { BRANDING_TONES } from "@/lib/validations/branding";
import { ui } from "@/lib/ui";

const initialState: ActionState = { success: false };

export function BrandingQuestionnaire({
  existingAnswers,
  hasIdeas,
}: {
  existingAnswers?: Record<string, string>;
  hasIdeas: boolean;
}) {
  const [state, formAction] = useActionState(saveBrandingAnswers, initialState);
  const currentTone = existingAnswers?.tone ?? "warm";

  return (
    <form action={formAction} className="space-y-5">

      <fieldset>
        <legend className={`${ui.label} mb-3`}>באיזה טון לכתוב?</legend>
        <div className="flex flex-wrap gap-2">
          {BRANDING_TONES.map((tone) => (
            <label key={tone} className="cursor-pointer">
              <input
                type="radio"
                name="tone"
                value={tone}
                defaultChecked={currentTone === tone}
                className="peer sr-only"
              />
              <span className="inline-block rounded-xl border border-ink/12 bg-white px-4 py-2 text-sm font-semibold text-ink/75 transition hover:border-ink/30 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-ink peer-checked:ring-4 peer-checked:ring-blue-600/10 peer-focus-visible:ring-4 peer-focus-visible:ring-blue-600/30">
                {TONE_LABELS[tone]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <details className="group rounded-xl border border-ink/10 bg-ink/[0.02]" open={!hasIdeas}>
        <summary className="cursor-pointer list-none px-4 py-3 font-semibold flex items-center justify-between">
          <span>
            ספרו לנו קצת יותר <span className="font-normal text-ink/50 text-sm">(לא חובה - אבל הרעיונות יהיו אישיים יותר)</span>
          </span>
          <span className="text-ink/40 transition group-open:rotate-180" aria-hidden="true">
            ▾
          </span>
        </summary>
        <div className="px-4 pb-4 space-y-4">
          {BRANDING_QUESTIONS.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium mb-1">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type="text"
                maxLength={120}
                defaultValue={existingAnswers?.[field.name] ?? ""}
                className={ui.input}
              />
            </div>
          ))}
        </div>
      </details>

      {state.error && <p className={ui.error} role="alert">{state.error}</p>}
      {state.success && (
        <p className={ui.success} role="status">הרעיונות מוכנים! גללו למטה ✨</p>
      )}
      <AiWorkingStatus
        title="כותבים לך רעיונות"
        messages={[
          "קוראים על העסק שלך...",
          "מנסחים סלוגנים קליטים...",
          "כותבים ביו לאינסטגרם...",
          "מכינים טקסט לאתר ופוסטים...",
          "מלטשים את הניסוחים האחרונים ✨",
        ]}
      />

      <div className="sm:max-w-xs">
        <SubmitButton pendingText="כותבים...">
          {hasIdeas ? "✨ צרו לי רעיונות חדשים" : "✨ צרו לי רעיונות כתיבה"}
        </SubmitButton>
      </div>
    </form>
  );
}
