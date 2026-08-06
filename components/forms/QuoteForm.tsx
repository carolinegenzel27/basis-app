"use client";

import { useActionState } from "react";
import { createQuote, type ActionState } from "@/lib/actions/quotes";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: ActionState = { success: false };

export function QuoteForm({
  businessProfileId,
  defaultProjectDescription = "",
  defaultPrice,
  defaultDocumentTitle = "",
  pricingRecommendationId,
  marketRange,
}: {
  businessProfileId: string;
  defaultProjectDescription?: string;
  defaultPrice?: number;
  defaultDocumentTitle?: string;
  pricingRecommendationId?: string;
  marketRange?: { min: number; max: number };
}) {
  const [state, formAction] = useActionState(createQuote, initialState);

  if (state.success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="text-sm text-green-700">הצעת המחיר נשמרה!</p>
        <a href="/quotes" className="text-sm text-blue-950 underline mt-2 inline-block">
          חזרה לרשימת ההצעות
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="business_profile_id" value={businessProfileId} />
      {pricingRecommendationId && (
        <input type="hidden" name="pricing_recommendation_id" value={pricingRecommendationId} />
      )}

      <div>
        <label htmlFor="document_title" className="block text-sm font-medium mb-1">
          כותרת המסמך (לא חובה)
        </label>
        <input
          id="document_title"
          name="document_title"
          type="text"
          maxLength={60}
          placeholder="הצעת מחיר"
          defaultValue={defaultDocumentTitle}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
        <p className="text-xs text-gray-400 mt-1">
          בלי מילוי, ה-PDF יוצג עם הכותרת &quot;הצעת מחיר&quot;
        </p>
      </div>

      <div>
        <label htmlFor="client_name" className="block text-sm font-medium mb-1">
          שם לקוח
        </label>
        <input
          id="client_name"
          name="client_name"
          type="text"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
      </div>

      <div>
        <label htmlFor="client_email" className="block text-sm font-medium mb-1">
          אימייל לקוח
        </label>
        <input
          id="client_email"
          name="client_email"
          type="email"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
      </div>

      <div>
        <label htmlFor="project_description" className="block text-sm font-medium mb-1">
          תיאור הפרויקט
        </label>
        <textarea
          id="project_description"
          name="project_description"
          rows={3}
          maxLength={300}
          defaultValue={defaultProjectDescription}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium mb-1">
          מחיר (₪)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min={1}
          step="1"
          required
          defaultValue={defaultPrice}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
        {(defaultPrice !== undefined || defaultProjectDescription) && (
          <p className="text-xs text-gray-400 mt-1">מולא אוטומטית - אפשר לערוך</p>
        )}
        {marketRange && (
          <p className="text-xs text-slate-500 mt-1">
            בהתבסס על נתוני השוק, אנחנו ממליצים לגבות בין{" "}
            {marketRange.min.toLocaleString("he-IL")}-
            {marketRange.max.toLocaleString("he-IL")} ₪ עבור שירות בודד מהסוג
            הזה - גם אם הסכום ישתנה, ההמלצה הזו תישאר מוצגת כאן לתזכורת.
          </p>
        )}
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>שמירת הצעת מחיר</SubmitButton>
    </form>
  );
}
