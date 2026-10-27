"use client";

import { useActionState, useRef } from "react";
import {
  updateProfileContent,
  type ActionState,
} from "@/lib/actions/profile-media";
import { ui } from "@/lib/ui";
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
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="business_profile_id" value={businessProfileId} />

      {hasBranding && (
        <div className="rounded-xl bg-sky-soft/60 border border-blue-200/60 p-4 sm:p-5 space-y-4">
          <p className="text-sm text-ink/80 leading-relaxed">
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
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (uvpRef.current) uvpRef.current.value = generatedUvpStatement;
                    }}
                    className="text-xs font-semibold text-blue-700 hover:underline"
                  >
                    טעינה מהמיתוג
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (uvpRef.current) uvpRef.current.value = "";
                    }}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    מחיקה
                  </button>
                </div>
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
                className={ui.input}
              />
            </div>
          )}

          {generatedWebsiteText && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="public_website_text" className="block text-sm font-medium">
                  טקסט לאתר
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (websiteRef.current) websiteRef.current.value = generatedWebsiteText;
                    }}
                    className="text-xs font-semibold text-blue-700 hover:underline"
                  >
                    טעינה מהמיתוג
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (websiteRef.current) websiteRef.current.value = "";
                    }}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    מחיקה
                  </button>
                </div>
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
                className={ui.input}
              />
            </div>
          )}
        </div>
      )}

      <div>
        <label htmlFor="about_me" className={ui.label}>
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
          className={ui.input}
        />
      </div>

      <div>
        <label htmlFor="experience_text" className={ui.label}>
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
          className={ui.input}
        />
      </div>

      <div>
        <label htmlFor="additional_info" className={ui.label}>
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
          className={ui.input}
        />
      </div>

      {state.error && <p className={ui.error} role="alert">{state.error}</p>}
      {state.success && (
        <p className={ui.success} role="status">נשמר!</p>
      )}
      <SubmitButton>שמירה</SubmitButton>
    </form>
  );
}
