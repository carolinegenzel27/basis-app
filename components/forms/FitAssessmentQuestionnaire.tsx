"use client";

import { useState, useActionState } from "react";
import { submitFitAssessment, type ActionState } from "@/lib/actions/fit-assessment";
import { FIT_QUESTIONS, LIKERT_OPTIONS } from "@/lib/fit-assessment/questions";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: ActionState = { success: false };

export function FitAssessmentQuestionnaire({ businessProfileId }: { businessProfileId: string }) {
  const [state, formAction] = useActionState(submitFitAssessment, initialState);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(FIT_QUESTIONS.length).fill(0));

  if (state.success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 space-y-4">
        <h2 className="text-lg font-semibold">ההמלצה שלנו</h2>
        <p className="text-gray-700">{state.resultMessage}</p>
        <a
          href="/dashboard"
          className="inline-block rounded-lg bg-slate-900 px-4 py-2 text-white text-sm font-medium hover:bg-slate-800"
        >
          המשך לדשבורד
        </a>
      </div>
    );
  }

  const isLastStep = step === FIT_QUESTIONS.length - 1;
  const currentAnswer = answers[step];

  function selectAnswer(value: number) {
    const next = [...answers];
    next[step] = value;
    setAnswers(next);
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">
        שאלה {step + 1} מתוך {FIT_QUESTIONS.length}
      </div>

      <p className="text-lg font-medium">{FIT_QUESTIONS[step].text}</p>

      <div className="space-y-2">
        {LIKERT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => selectAnswer(opt.value)}
            className={`w-full text-right rounded-lg border px-4 py-2 transition ${
              currentAnswer === opt.value
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          className="text-sm text-gray-500 disabled:opacity-0"
        >
          חזרה
        </button>

        {!isLastStep ? (
          <button
            type="button"
            disabled={currentAnswer === 0}
            onClick={() => setStep((s) => s + 1)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            הבא
          </button>
        ) : currentAnswer === 0 ? (
          <button
            type="button"
            disabled
            className="rounded-lg bg-slate-900 px-4 py-2 text-white text-sm font-medium opacity-50 cursor-not-allowed"
          >
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

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </div>
  );
}
