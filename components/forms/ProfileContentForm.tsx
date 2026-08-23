"use client";

import { useActionState, useRef } from "react";
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
  defaultPublicUvpText = "",
  defaultPublicWebsiteText = "",
  generatedUvpStatement,
  generatedWebsiteText,
}: {
  businessProfileId: string;
  defaultAboutMe?: string;
  defaultExperienceText?: string;
  defaultAdditionalInfo?: string;
  defaultPublicUvpText?: string;
  defaultPublicWebsiteText?: string;
  // The current output of the מיתוג questionnaire, if she's filled it out -
  // only used here as a one-click starting point (see the "טעינה מהמיתוג"
  // buttons below), never written to the public page on its own.
  generatedUvpStatement?: string | null;
  generatedWebsiteText?: string | null;
}) {
  const [state, formAction] = useActionState(updateProfileContent, initialState);
  const uvpRef = useRef<HTMLTextAreaElement>(null);
  const websiteRef = useRef<HTMLTextAreaElement>(null);
  const hasBranding = !!(generatedUvpStatement || generatedWebsiteText);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="business_profile_id" value={businessProfileId} />

      {hasBranding && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 space-y-4">
          <p className="text-sm text-blue-900">
            יצרת חומרי מיתוג בעמוד &quot;מיתוג&quot; - כאן אפשר לבחור אם להציג
            אותם בעמוד הציבורי שלך, ולערוך את הניסוח בדיוק כרצונך. שדה ריק לא
            יוצג בעמוד.
          </p>

          {generatedUvpStatement && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="public_uvp_text" className="block text-sm font-medium">
                  משפט מיתוג (UVP)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (uvpRef.current) uvpRef.current.value = generatedUvpStatement;
                  }}
                  className="text-xs text-blue-800 underline"
                >
                  טעינה מהמיתוג
                </button>
              </div>
              <textarea
                id="public_uvp_text"
                name="public_uvp_text"
                ref={uvpRef}
                dir="rtl"
                rows={2}
                maxLength={400}
                defaultValue={defaultPublicUvpText}
                placeholder='לחצו "טעינה מהמיתוג" כדי להתחיל מהטקסט שיצרת, או כתבו בעצמכם'
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
          )}

          {generatedWebsiteText && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="public_website_text" className="block text-sm font-medium">
                  טקסט לאתר
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (websiteRef.current) websiteRef.current.value = generatedWebsiteText;
                  }}
                  className="text-xs text-blue-800 underline"
                >
                  טעינה מהמיתוג
                </button>
              </div>
              <textarea
                id="public_website_text"
                name="public_website_text"
                ref={websiteRef}
                dir="rtl"
                rows={4}
                maxLength={800}
                defaultValue={defaultPublicWebsiteText}
                placeholder='לחצו "טעינה מהמיתוג" כדי להתחיל מהטקסט שיצרת, או כתבו בעצמכם'
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
          )}
        </div>
      )}

      <div>
        <label htmlFor="about_me" className="block text-sm font-medium mb-1">
          קצת עליי
        </label>
        <textarea
          id="about_me"
          name="about_me"
          dir="rtl"
          rows={3}
          maxLength={600}
          defaultValue={defaultAboutMe}
          placeholder="כמה משפטים על עצמך ומה מייחד אותך"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
      </div>

      <div>
        <label htmlFor="experience_text" className="block text-sm font-medium mb-1">
          ניסיון
        </label>
        <textarea
          id="experience_text"
          name="experience_text"
          dir="rtl"
          rows={3}
          maxLength={600}
          defaultValue={defaultExperienceText}
          placeholder="ותק, הכשרות, הישגים בולטים"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
      </div>

      <div>
        <label htmlFor="additional_info" className="block text-sm font-medium mb-1">
          לפרטים נוספים
        </label>
        <textarea
          id="additional_info"
          name="additional_info"
          dir="rtl"
          rows={3}
          maxLength={600}
          defaultValue={defaultAdditionalInfo}
          placeholder="שעות פעילות, אזור שירות, כל דבר אחר שחשוב שלקוחות ידעו"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-700"
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
