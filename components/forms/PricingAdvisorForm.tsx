"use client";

import { useActionState } from "react";
import {
  getPricingRecommendation,
  type ActionState,
} from "@/lib/actions/pricing";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: ActionState = { success: false };

type ProjectTypeOption = { project_type: string; project_type_label: string };

export function PricingAdvisorForm({
  businessProfileId,
  options,
}: {
  businessProfileId: string;
  options: ProjectTypeOption[];
}) {
  const [state, formAction] = useActionState(getPricingRecommendation, initialState);

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="business_profile_id" value={businessProfileId} />
        <div>
          <label htmlFor="project_type" className="block text-sm font-medium mb-1">
            סוג הפרויקט
          </label>
          <select
            id="project_type"
            name="project_type"
            required
            defaultValue=""
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
          >
            <option value="" disabled>
              בחר את אחת מהאפשרויות הבאות
            </option>
            {options.map((opt) => (
              <option key={opt.project_type} value={opt.project_type}>
                {opt.project_type_label}
              </option>
            ))}
          </select>
        </div>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <SubmitButton>קבל טווח מחיר מומלץ</SubmitButton>
      </form>

      {state.success && state.recommendation && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-3">
          <div>
            <p className="text-sm text-gray-700">
              טווח מחיר מומלץ עבור &quot;{state.recommendation.label}&quot;:
            </p>
            <p className="text-2xl font-bold text-blue-950 mt-1">
              {state.recommendation.min}-{state.recommendation.max} ₪
            </p>
          </div>
          <a
            href={`/quotes/new?recommendationId=${state.recommendation.id}`}
            className="inline-block rounded-lg bg-blue-800 px-4 py-2 text-white text-sm font-medium hover:bg-blue-900"
          >
            יצירת הצעת מחיר עם המחיר הזה
          </a>
        </div>
      )}
    </div>
  );
}
