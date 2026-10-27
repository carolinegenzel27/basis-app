"use client";

import { useActionState } from "react";
import { createQuote, type ActionState } from "@/lib/actions/quotes";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ui } from "@/lib/ui";

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
      <div className="text-center space-y-4 py-4" role="status">
        <span className="mx-auto flex w-14 h-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-2xl" aria-hidden="true">
          ✓
        </span>
        <p className="text-lg font-bold">הצעת המחיר נשמרה!</p>
        <a href="/quotes" className={ui.btnPrimary}>
          חזרה לרשימת ההצעות
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="business_profile_id" value={businessProfileId} />
      {pricingRecommendationId && (
        <input type="hidden" name="pricing_recommendation_id" value={pricingRecommendationId} />
      )}

      <div>
        <label htmlFor="document_title" className={ui.label}>
          כותרת המסמך (לא חובה)
        </label>
        <input
          id="document_title"
          name="document_title"
          type="text"
          maxLength={60}
          placeholder="הצעת מחיר"
          defaultValue={defaultDocumentTitle}
          className={ui.input}
        />
        <p className={ui.hint}>
          בלי מילוי, ה-PDF יוצג עם הכותרת &quot;הצעת מחיר&quot;
        </p>
      </div>

      <div>
        <label htmlFor="client_name" className={ui.label}>
          שם לקוח
        </label>
        <input
          id="client_name"
          name="client_name"
          type="text"
          required
          className={ui.input}
        />
      </div>

      <div>
        <label htmlFor="client_email" className={ui.label}>
          אימייל לקוח
        </label>
        <input
          id="client_email"
          name="client_email"
          type="email"
          required
          className={ui.input}
        />
      </div>

      <div>
        <label htmlFor="project_description" className={ui.label}>
          תיאור הפרויקט
        </label>
        <textarea
          id="project_description"
          name="project_description"
          rows={3}
          maxLength={300}
          defaultValue={defaultProjectDescription}
          className={ui.input}
        />
      </div>

      <div>
        <label htmlFor="price" className={ui.label}>
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
          className={ui.input}
        />
        {(defaultPrice !== undefined || defaultProjectDescription) && (
          <p className={ui.hint}>מולא אוטומטית - אפשר לערוך</p>
        )}
        {marketRange && (
          <p className="mt-2 rounded-lg bg-sun-soft px-3 py-2 text-sm text-ink/80">
            💡 אנחנו ממליצים לגבות בין{" "}
            {marketRange.min.toLocaleString("he-IL")}-
            {marketRange.max.toLocaleString("he-IL")} ₪ עבור שירות בודד מהסוג
            הזה.
          </p>
        )}
      </div>

      {state.error && <p className={ui.error} role="alert">{state.error}</p>}
      <SubmitButton>שמירת הצעת מחיר</SubmitButton>
    </form>
  );
}
