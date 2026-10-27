"use client";

import { useActionState, useState } from "react";
import {
  getPricingRecommendation,
  searchPricingOptions,
  type ActionState,
  type SearchState,
} from "@/lib/actions/pricing";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { AiWorkingOverlay } from "@/components/ui/AiWorkingOverlay";
import { PriceTag } from "@/components/illustrations/BusinessIcons";

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
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="business_profile_id" value={businessProfileId} />
        <fieldset>
          <legend className="block text-sm font-semibold mb-2">מה רוצים לתמחר?</legend>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {options.map((opt) => {
              const isSelected = selected === opt.project_type;
              return (
                <label
                  key={opt.project_type}
                  className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 cursor-pointer transition ${
                    isSelected
                      ? "border-ink bg-sun-soft shadow-[3px_3px_0_#1e1b4b]"
                      : "border-ink/10 bg-white hover:border-ink/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="project_type"
                    value={opt.project_type}
                    required
                    checked={isSelected}
                    onChange={() => setSelected(opt.project_type)}
                    className="accent-blue-800 w-4 h-4 shrink-0"
                  />
                  <span className="font-medium">{opt.project_type_label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <SubmitButton>קבל טווח מחיר מומלץ</SubmitButton>
      </form>

      {state.success && state.recommendation && (
        <div className="relative rounded-3xl border-2 border-ink bg-mint-soft p-5 space-y-3 shadow-[4px_4px_0_#1e1b4b] animate-pop-in">
          <PriceTag className="absolute -top-6 -left-3 w-14 rotate-12" />
          <div>
            <p className="text-sm text-ink/70">
              טווח מחיר מומלץ עבור &quot;{state.recommendation.label}&quot;:
            </p>
            <p className="text-3xl font-extrabold text-blue-950 mt-1">
              {state.recommendation.min}-{state.recommendation.max} ₪
            </p>
            {state.recommendation.source && (
              <p className="text-xs text-ink/55 mt-2">מקור: {state.recommendation.source}</p>
            )}
          </div>
          <a
            href={`/quotes/new?recommendationId=${state.recommendation.id}`}
            className="inline-block rounded-xl bg-blue-800 px-4 py-2 text-white text-sm font-semibold shadow-[0_3px_0_#1e1b4b] hover:bg-blue-900"
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
      <form action={formAction} className="flex flex-col sm:flex-row gap-2">
        <AiWorkingOverlay title="מחפשים מחירים בשוק" messages={SEARCH_MESSAGES} />
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
          placeholder={hasOptions ? "למשל: עוגת חתונה 3 קומות" : "אפשר לכתוב שירות מסוים, או להשאיר ריק"}
          className="flex-1 rounded-xl border-2 border-ink/15 bg-white px-3.5 py-2.5 focus:outline-none focus:border-blue-700 placeholder:text-ink/35"
        />
        <div className="sm:w-40">
          <SubmitButton pendingText="מחפשים...">{hasOptions ? "חפש מחיר" : "חפש בשוק"}</SubmitButton>
        </div>
      </form>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-mint font-semibold">
          נוספו {state.added} אפשרויות חדשות לרשימה ✨
        </p>
      )}
    </div>
  );
}

export function RefreshMarketSearchButton({ businessProfileId }: { businessProfileId: string }) {
  const [state, formAction] = useActionState(searchPricingOptions, initialSearchState);

  return (
    <form action={formAction} className="inline">
      <AiWorkingOverlay title="מרעננים את חיפוש השוק" messages={SEARCH_MESSAGES} />
      <input type="hidden" name="business_profile_id" value={businessProfileId} />
      <button type="submit" className="text-xs text-ink/55 underline underline-offset-4 hover:text-blue-800">
        חיפוש מחדש של כל המחירים
      </button>
      {state.error && <span className="text-xs text-red-600 ms-2">{state.error}</span>}
    </form>
  );
}
