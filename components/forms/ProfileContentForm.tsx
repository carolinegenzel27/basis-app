"use client";

import { useActionState, useState } from "react";
import {
  updateProfileContent,
  type ActionState,
} from "@/lib/actions/profile-media";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ui } from "@/lib/ui";

const initialState: ActionState = { success: false };

// One field of the public page, with a small X in its corner to remove it
// from the page, and (when there's a suggested text - from the branding
// ideas or the automatic opening line) a link to bring that text back.
function RemovableField({
  name,
  label,
  description,
  initialValue,
  suggestion,
  suggestionLabel,
  placeholder,
  maxLength,
  rows,
}: {
  name: string;
  label: string;
  description?: string;
  initialValue: string;
  suggestion?: string | null;
  suggestionLabel?: string;
  placeholder?: string;
  maxLength: number;
  rows?: number;
}) {
  const [value, setValue] = useState(initialValue);
  const removed = value.trim() === "";
  const canRestore = !!suggestion && value !== suggestion;
  const inputId = `field-${name}`;

  const fieldClass = `${ui.input} pe-12 ${removed ? "bg-ink/[0.02]" : ""}`;

  return (
    <div className="rounded-2xl border border-ink/[0.08] bg-white p-4 sm:p-5 transition">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-2">
        <label htmlFor={inputId} className="font-semibold text-ink">
          {label}
        </label>
        {canRestore && (
          <button
            type="button"
            onClick={() => setValue(suggestion!)}
            className="text-sm font-semibold text-blue-700 hover:underline underline-offset-4"
          >
            {suggestionLabel ?? "שחזור הטקסט המוצע"}
          </button>
        )}
      </div>
      {description && <p className="text-sm text-ink/55 -mt-1 mb-2.5">{description}</p>}

      <div className="relative">
        {rows ? (
          <textarea
            id={inputId}
            name={name}
            dir="rtl"
            rows={rows}
            maxLength={maxLength}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className={`${fieldClass} resize-y min-h-[3.25rem] leading-relaxed`}
          />
        ) : (
          <input
            id={inputId}
            name={name}
            type="text"
            maxLength={maxLength}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className={fieldClass}
          />
        )}
        {!removed && (
          <button
            type="button"
            onClick={() => setValue("")}
            aria-label={`הסרת "${label}" מהעמוד`}
            title="הסרה מהעמוד"
            className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-ink/[0.06] text-ink/60 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
      </div>
      {removed && <p className="text-xs text-ink/45 mt-2">לא יוצג בעמוד</p>}
    </div>
  );
}

export function ProfileContentForm({
  businessProfileId,
  tagline,
  defaultTagline,
  uvpText,
  aboutMe,
  experienceText,
  additionalInfo,
  brandingUvp,
  brandingAbout,
}: {
  businessProfileId: string;
  // Current values (already resolved by the page: the owner's saved text,
  // or the branding idea / automatic line if they never set it).
  tagline: string;
  defaultTagline: string;
  uvpText: string;
  aboutMe: string;
  experienceText: string;
  additionalInfo: string;
  // The branding ideas, offered as a one-click "bring it back".
  brandingUvp?: string | null;
  brandingAbout?: string | null;
}) {
  const [state, formAction] = useActionState(updateProfileContent, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="business_profile_id" value={businessProfileId} />
      {/* The website text was merged into "קצת עליי" - clear the old field. */}
      <input type="hidden" name="public_website_text" value="" />

      <p className="text-sm text-ink/60 leading-relaxed">
        {brandingUvp || brandingAbout ? "מילאנו בשבילך את מה שיצרת בעמוד המיתוג. " : ""}
        מה שלא מתאים לך, מסירים בלחיצה על ה-X. השינויים יופיעו בעמוד אחרי שמירה.
      </p>

      <RemovableField
        name="public_tagline"
        label="שורת פתיחה"
        description="השורה הקטנה מעל שם העסק."
        initialValue={tagline}
        suggestion={defaultTagline}
        suggestionLabel="שחזור השורה האוטומטית"
        maxLength={80}
      />
      <RemovableField
        name="public_uvp_text"
        label="משפט מיתוג"
        description="המשפט הגדול מתחת לשם העסק."
        initialValue={uvpText}
        suggestion={brandingUvp}
        suggestionLabel="שחזור מהמיתוג"
        placeholder="משפט אחד שמסביר מה העסק נותן ולמי"
        maxLength={400}
        rows={2}
      />
      <RemovableField
        name="about_me"
        label="קצת עליי"
        initialValue={aboutMe}
        suggestion={brandingAbout}
        suggestionLabel="שחזור מהמיתוג"
        placeholder="כמה משפטים על עצמך ועל מה שמייחד את העסק"
        maxLength={1000}
        rows={5}
      />
      <RemovableField
        name="experience_text"
        label="ניסיון"
        initialValue={experienceText}
        placeholder="ותק, הכשרות, הישגים בולטים"
        maxLength={600}
        rows={3}
      />
      <RemovableField
        name="additional_info"
        label="יצירת קשר ופרטים נוספים"
        initialValue={additionalInfo}
        placeholder="טלפון, שעות פעילות, אזור שירות"
        maxLength={600}
        rows={3}
      />

      {state.error && <p className={ui.error} role="alert">{state.error}</p>}
      {state.success && <p className={ui.success} role="status">נשמר! העמוד שלך עודכן.</p>}
      <div className="sm:max-w-xs">
        <SubmitButton pendingText="שומרים...">שמירת העמוד</SubmitButton>
      </div>
    </form>
  );
}
