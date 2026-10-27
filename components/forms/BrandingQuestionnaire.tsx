"use client";

import { useActionState } from "react";
import { saveBrandingAnswers, type ActionState } from "@/lib/actions/branding";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { AiWorkingOverlay } from "@/components/ui/AiWorkingOverlay";
import { BRANDING_QUESTIONS, TONE_LABELS } from "@/lib/templates/branding-questions";
import { BRANDING_TONES } from "@/lib/validations/branding";

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
      <AiWorkingOverlay
        title="כותבים לך רעיונות"
        messages={[
          "קוראים על העסק שלך...",
          "מנסחים סלוגנים קליטים...",
          "כותבים ביו לאינסטגרם...",
          "מכינים טקסט לאתר ופוסטים...",
          "מלטשים את הניסוחים האחרונים ✨",
        ]}
      />

      <fieldset>
        <legend className="block text-sm font-semibold mb-2">באיזה טון לכתוב?</legend>
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
              <span className="inline-block rounded-full border-2 border-ink/10 bg-white px-4 py-1.5 text-sm font-medium transition peer-checked:border-ink peer-checked:bg-coral-soft peer-checked:shadow-[2px_2px_0_#1e1b4b] peer-focus-visible:ring-4 peer-focus-visible:ring-blue-700/20 hover:border-ink/40">
                {TONE_LABELS[tone]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <details className="group rounded-2xl border-2 border-ink/10 bg-white" open={!hasIdeas}>
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
                placeholder={field.placeholder}
                defaultValue={existingAnswers?.[field.name] ?? ""}
                className="w-full rounded-xl border-2 border-ink/15 px-3.5 py-2.5 focus:outline-none focus:border-blue-700 placeholder:text-ink/35"
              />
            </div>
          ))}
        </div>
      </details>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-mint font-semibold">הרעיונות מוכנים! גללו למטה ✨</p>
      )}
      <SubmitButton pendingText="כותבים...">
        {hasIdeas ? "✨ צרו לי רעיונות חדשים" : "✨ צרו לי רעיונות כתיבה"}
      </SubmitButton>
    </form>
  );
}
