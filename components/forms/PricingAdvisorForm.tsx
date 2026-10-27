"use client";

import { useActionState, useState } from "react";
import {
  getPricingRecommendation,
  searchPricingOptions,
  type ActionState,
  type SearchState,
} from "@/lib/actions/pricing";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { AiWorkingStatus } from "@/components/ui/AiWorkingStatus";
import { PriceTag } from "@/components/illustrations/BusinessIcons";
import { ui } from "@/lib/ui";

const initialState: ActionState = { success: false };
const initialSearchState: SearchState = { success: false };

type ProjectTypeOption = { project_type: string; project_type_label: string };

const SEARCH_MESSAGES = [
  "מחפשים את השירות בשוק...",
  "סורקים מחירונים ואתרי השוואת מחירים...",
  "משווים מחירים בין עסקים דומים...",
  "מסדרים את התוצאות בשבילך",
  "כמעט שם! עוד כמה שניות...",
];

export function PricingAdvisorForm({
  businessProfileId,
  options,
}: {
  businessProfileId: string;
  options: ProjectTypeOption[];
}) {
  const [state, formAction] = useActionState(getPricingRecommendation, initialState);
  const [selected, setSelected] = useState("");

  return (
    <div className="space-y-5">
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="business_profile_id" value={businessProfileId} />
        <fieldset>
          <legend className={`${ui.label} mb-3`}>מה רוצים לתמחר?</legend>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {options.map((opt) => {
              const isSelected = selected === opt.project_type;
              return (
                <label
                  key={opt.project_type}
                  className={`flex items-center gap-3 cursor-pointer has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-blue-600/30 ${isSelected ? ui.optionActive : ui.option}`}
                >
                  <input
                    type="radio"
                    name="project_type"
                    value={opt.project_type}
                    required
                    checked={isSelected}
                    onChange={() => setSelected(opt.project_type)}
                    className="accent-blue-600 w-4 h-4 shrink-0"
                  />
                  <span className="font-medium">{opt.project_type_label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        {state.error && <p className={ui.error} role="alert">{state.error}</p>}
        <div className="sm:max-w-xs">
          <SubmitButton>קבלת טווח מחיר מומלץ</SubmitButton>
        </div>
      </form>

      {state.success && state.recommendation && (
        <div className="relative overflow-hidden rounded-2xl bg-ink text-white p-6 space-y-4 animate-fade-up" role="status">
          <div className="pointer-events-none absolute -top-16 -left-10 w-56 h-56 rounded-full bg-blue-500/30 blur-3xl" aria-hidden="true" />
          <PriceTag className="absolute top-5 left-5 w-12 opacity-90" />
          <div>
            <p className="relative text-sm text-white/70">
              טווח מחיר מומלץ עבור &quot;{state.recommendation.label}&quot;:
            </p>
            <p className="relative text-4xl font-extrabold tracking-tight mt-1">
              {state.recommendation.min}-{state.recommendation.max} ₪
            </p>
            {state.recommendation.source && (
              <p className="relative text-xs text-white/55 mt-2">מקור: {state.recommendation.source}</p>
            )}
          </div>
          <a
            href={`/quotes/new?recommendationId=${state.recommendation.id}`}
            className="relative inline-flex items-center gap-2 rounded-xl bg-white text-ink px-5 py-3 font-semibold hover:bg-sun transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            יצירת הצעת מחיר עם המחיר הזה
          </a>
        </div>
      )}
    </div>
  );
}

// "Couldn't find what you sell?" - researches one specific service and adds
// it to the options, or (empty query) re-runs the whole market search.
export function PricingSearchForm({
  businessProfileId,
  hasOptions,
}: {
  businessProfileId: string;
  hasOptions: boolean;
}) {
  const [state, formAction] = useActionState(searchPricingOptions, initialSearchState);

  return (
    <div className="space-y-3">
      <form action={formAction} className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
        <input type="hidden" name="business_profile_id" value={businessProfileId} />
        <label htmlFor="service_query" className="sr-only">
          שירות או מוצר לחיפוש
        </label>
        <input
          id="service_query"
          name="service_query"
          type="text"
          maxLength={80}
          required={hasOptions}
          className={`flex-1 ${ui.input}`}
        />
        <div className="sm:w-44">
          <SubmitButton pendingText="מחפשים...">{hasOptions ? "חפש מחיר" : "חפש בשוק"}</SubmitButton>
        </div>
        <AiWorkingStatus title="מחפשים מחירים בשוק" messages={SEARCH_MESSAGES} />
      </form>
      {state.error && <p className={ui.error} role="alert">{state.error}</p>}
      {state.success && (
        <p className={ui.success} role="status">
          נוספו {state.added} אפשרויות חדשות לרשימה ✨
        </p>
      )}
    </div>
  );
}

export function RefreshMarketSearchButton({ businessProfileId }: { businessProfileId: string }) {
  const [state, formAction] = useActionState(searchPricingOptions, initialSearchState);

  return (
    <form action={formAction} className="contents">
      <input type="hidden" name="business_profile_id" value={businessProfileId} />
      <button type="submit" className="text-sm font-semibold text-blue-700 hover:underline underline-offset-4">
        חיפוש מחדש של כל המחירים
      </button>
      {state.error && <span className="text-xs text-red-600 ms-2">{state.error}</span>}
      <AiWorkingStatus title="מרעננים את חיפוש השוק" messages={SEARCH_MESSAGES} />
    </form>
  );
}
