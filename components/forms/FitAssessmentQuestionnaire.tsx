"use client";

import { useState, useActionState } from "react";
import { submitFitAssessment, type ActionState } from "@/lib/actions/fit-assessment";
import { FIT_QUESTIONS, LIKERT_OPTIONS } from "@/lib/fit-assessment/questions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ui } from "@/lib/ui";

const initialState: ActionState = { success: false };

export function FitAssessmentQuestionnaire({ businessProfileId }: { businessProfileId: string }) {
  const [state, formAction] = useActionState(submitFitAssessment, initialState);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(FIT_QUESTIONS.length).fill(0));

  if (state.success) {
    return (
      <div className="space-y-4 text-center py-4 animate-fade-up">
        <span className="mx-auto flex w-14 h-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-2xl" aria-hidden="true">
          ✓
        </span>
        <h2 className={ui.h2}>ההמלצה שלנו</h2>
        <p className="text-ink/70 text-lg leading-relaxed max-w-lg mx-auto">{state.resultMessage}</p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {state.recommendation !== "both" && (
            <a
              href={state.recommendation === "branding" ? "/branding" : "/pricing-advisor"}
              className={ui.btnPrimary}
            >
              {state.recommendation === "branding" ? "מתחילים במיתוג" : "מתחילים ביועץ התמחור"}
            </a>
          )}
          <a href="/dashboard" className={state.recommendation === "both" ? ui.btnPrimary : ui.btnSecondary}>
            המשך למסך הבית
          </a>
        </div>
      </div>
    );
  }

  const isLastStep = step === FIT_QUESTIONS.length - 1;
  const currentAnswer = answers[step];
  const progress = ((step + (currentAnswer ? 1 : 0)) / FIT_QUESTIONS.length) * 100;

  function selectAnswer(value: number) {
    const next = [...answers];
    next[step] = value;
    setAnswers(next);
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between text-sm font-semibold text-ink/55">
          <span>
            שאלה {step + 1} מתוך {FIT_QUESTIONS.length}
          </span>
        </div>
        <div
          className="mt-2 h-2 rounded-full bg-ink/[0.06] overflow-hidden"
          role="progressbar"
          aria-label="התקדמות בשאלון"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div className="h-full rounded-full bg-gradient-to-l from-blue-600 to-lilac transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <p className="text-xl font-bold leading-snug" id="question">
        {FIT_QUESTIONS[step].text}
      </p>

      <div className="grid gap-2.5" role="radiogroup" aria-labelledby="question">
        {LIKERT_OPTIONS.map((opt) => {
          const selected = currentAnswer === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => selectAnswer(opt.value)}
              className={`w-full ${selected ? ui.optionActive : ui.option} focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          className={`${ui.btnSecondary} disabled:invisible`}
        >
          חזרה
        </button>

        {!isLastStep ? (
          <button
            type="button"
            disabled={currentAnswer === 0}
            onClick={() => setStep((s) => s + 1)}
            className={ui.btnPrimary}
          >
            הבא
          </button>
        ) : currentAnswer === 0 ? (
          <button type="button" disabled className={ui.btnPrimary}>
            קבלת המלצה
          </button>
        ) : (
          <form action={formAction}>
            <input type="hidden" name="business_profile_id" value={businessProfileId} />
            <input type="hidden" name="answers" value={JSON.stringify(answers)} />
            <SubmitButton>קבלת המלצה</SubmitButton>
          </form>
        )}
      </div>

      {state.error && <p className={ui.error} role="alert">{state.error}</p>}
    </div>
  );
}
