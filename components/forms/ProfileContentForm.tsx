"use client";

import { useActionState } from "react";
import {
  updateProfileContent,
  type ActionState,
} from "@/lib/actions/profile-media";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: ActionState = { success: false };

export function ProfileContentForm({
  businessProfileId,
  defaultAboutMe = "",
  defaultExperienceText = "",
  defaultAdditionalInfo = "",
}: {
  businessProfileId: string;
  defaultAboutMe?: string;
  defaultExperienceText?: string;
  defaultAdditionalInfo?: string;
}) {
  const [state, formAction] = useActionState(updateProfileContent, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="business_profile_id" value={businessProfileId} />

      <div>
        <label htmlFor="about_me" className="block text-sm font-medium mb-1">
          קצת עליי
        </label>
        <textarea
          id="about_me"
          name="about_me"
          rows={3}
          maxLength={600}
          defaultValue={defaultAboutMe}
          placeholder="כמה משפטים על מי שאת ומה מייחד אותך"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>

      <div>
        <label htmlFor="experience_text" className="block text-sm font-medium mb-1">
          ניסיון
        </label>
        <textarea
          id="experience_text"
          name="experience_text"
          rows={3}
          maxLength={600}
          defaultValue={defaultExperienceText}
          placeholder="ותק, הכשרות, הישגים בולטים"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>

      <div>
        <label htmlFor="additional_info" className="block text-sm font-medium mb-1">
          לפרטים נוספים
        </label>
        <textarea
          id="additional_info"
          name="additional_info"
          rows={3}
          maxLength={600}
          defaultValue={defaultAdditionalInfo}
          placeholder="שעות פעילות, אזור שירות, כל דבר אחר שחשוב שלקוחות ידעו"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-green-700">נשמר!</p>
      )}
      <SubmitButton>שמירה</SubmitButton>
    </form>
  );
}
