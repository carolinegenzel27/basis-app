"use client";

import { useActionState } from "react";
import {
  createBusinessProfile,
  type ActionState,
} from "@/lib/actions/business-profile";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: ActionState = { success: false };

const PROFESSIONS = [
  { value: "driving_instructor", label: "מורה לנהיגה" },
  { value: "dietitian", label: "דיאטנית" },
  { value: "private_chef", label: "שף פרטי" },
];

export function OnboardingForm() {
  const [state, formAction] = useActionState(createBusinessProfile, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="business_name" className="block text-sm font-medium mb-1">
          שם העסק
        </label>
        <input
          id="business_name"
          name="business_name"
          type="text"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
      </div>

      <div>
        <label htmlFor="profession" className="block text-sm font-medium mb-1">
          תחום עיסוק
        </label>
        <select
          id="profession"
          name="profession"
          required
          defaultValue=""
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        >
          <option value="" disabled>
            בחירת תחום
          </option>
          {PROFESSIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="years_experience" className="block text-sm font-medium mb-1">
            שנות ותק
          </label>
          <input
            id="years_experience"
            name="years_experience"
            type="number"
            min={0}
            max={80}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>
        <div>
          <label htmlFor="team_size" className="block text-sm font-medium mb-1">
            גודל צוות
          </label>
          <input
            id="team_size"
            name="team_size"
            type="number"
            min={1}
            max={500}
            required
            defaultValue={1}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-1">
          כתובת הדף הציבורי שלך
        </label>
        <p className="text-xs text-gray-500 mb-1" dir="ltr">
          basis.app/p/...
        </p>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          dir="ltr"
          placeholder="dana-driving"
          pattern="[a-z0-9-]+"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
        <p className="text-xs text-gray-500 mt-1">
          רק אותיות אנגליות קטנות, מספרים, ומקף. זו הכתובת שנשלחת ללקוחות.
        </p>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton>המשך למסך הבית</SubmitButton>
    </form>
  );
}
