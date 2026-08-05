"use client";

import { useActionState } from "react";
import { saveBrandingAnswers, type ActionState } from "@/lib/actions/branding";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: ActionState = { success: false };

const FIELDS: { name: string; label: string }[] = [
  { name: "ideal_client", label: "מי הלקוח האידיאלי שלך?" },
  { name: "problem_solved", label: "איזו בעיה עיקרית את/ה פותר/ת עבורו?" },
  { name: "desired_outcome", label: "לאיזו תוצאה הלקוח מגיע אחרי שעבד איתך?" },
  { name: "unique_approach", label: "מה מייחד את הגישה או השיטה שלך?" },
  { name: "credential", label: "הישג או ניסיון בולט (שנים, הסמכה, כמות לקוחות)" },
  { name: "cta", label: "מה הפעולה הבאה שאת רוצה שהלקוח יעשה?" },
];

export function BrandingQuestionnaire({
  existingAnswers,
}: {
  existingAnswers?: Record<string, string>;
}) {
  const [state, formAction] = useActionState(saveBrandingAnswers, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {FIELDS.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium mb-1">
            {field.label}
          </label>
          <textarea
            id={field.name}
            name={field.name}
            required
            rows={2}
            defaultValue={existingAnswers?.[field.name] ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
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
