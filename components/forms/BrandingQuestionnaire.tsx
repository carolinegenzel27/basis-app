"use client";

import { useActionState } from "react";
import { saveBrandingAnswers, type ActionState } from "@/lib/actions/branding";
import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  getBrandingQuestions,
  type Profession,
} from "@/lib/templates/branding-questions";

const initialState: ActionState = { success: false };

export function BrandingQuestionnaire({
  profession,
  existingAnswers,
}: {
  profession: Profession;
  existingAnswers?: Record<string, string>;
}) {
  const [state, formAction] = useActionState(saveBrandingAnswers, initialState);
  const fields = getBrandingQuestions(profession);

  return (
    <form action={formAction} className="space-y-4">
      <p className="text-xs text-gray-500 -mt-2">
        יש לענות בביטוי קצר לכל שאלה, לא במשפט שלם - זה מה שהופך את התוצאה
        לקריאה וברורה.
      </p>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium mb-1">
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type="text"
            required
            maxLength={60}
            placeholder={field.placeholder}
            defaultValue={existingAnswers?.[field.name] ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 placeholder:text-gray-400"
          />
        </div>
      ))}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-green-700">
          נשמר! החומרים השיווקיים עודכנו למטה.
        </p>
      )}
      <SubmitButton>
        {existingAnswers ? "עדכן ויצר מחדש" : "צור חומרים שיווקיים"}
      </SubmitButton>
    </form>
  );
}
