"use client";

import { useActionState, useState } from "react";
import {
  createBusinessProfile,
  type ActionState,
} from "@/lib/actions/business-profile";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { AiWorkingStatus } from "@/components/ui/AiWorkingStatus";
import { ui } from "@/lib/ui";
import {
  Camera,
  Cupcake,
  Dumbbell,
  NailPolish,
  Palette,
  Scissors,
} from "@/components/illustrations/BusinessIcons";

const initialState: ActionState = { success: false };

// Quick picks with an illustration - one tap fills the profession field.
// Any other business is just typed in; the datalist below suggests more.
const QUICK_PICKS = [
  { label: "קונדיטוריה / אפייה", Icon: Cupcake },
  { label: "מניקור ולק ג'ל", Icon: NailPolish },
  { label: "צילום", Icon: Camera },
  { label: "עיצוב שיער", Icon: Scissors },
  { label: "אימון כושר", Icon: Dumbbell },
  { label: "עיצוב גרפי", Icon: Palette },
];

const MORE_SUGGESTIONS = [
  "מורה לנהיגה",
  "דיאטנית",
  "שף פרטי",
  "קייטרינג",
  "מאפרת",
  "קוסמטיקאית",
  "הדבקת ריסים",
  "עיצוב גבות",
  "מעצבת פנים",
  "צלם אירועים",
  "די ג'יי",
  "מורה פרטי",
  "מורה ליוגה",
  "פילאטיס",
  "עיסוי",
  "מטפלת רגשית",
  "מאלפת כלבים",
  "דוגווקר",
  "שיפוצניק",
  "חשמלאי",
  "אינסטלטור",
  "ניקיון",
  "גינון",
  "תפירה ותיקונים",
  "תכשיטים בעבודת יד",
  "פרחים",
  "עיצוב אירועים",
  "בניית אתרים",
  "ניהול סושיאל",
  "הנהלת חשבונות",
];

const labelClass = ui.label;
const inputClass = ui.input;

export function OnboardingForm() {
  const [state, formAction] = useActionState(createBusinessProfile, initialState);
  const [profession, setProfession] = useState("");

  return (
    <form action={formAction} className="space-y-8">

      {/* Wide two-column grid across the whole page - not a small boxed
          card. Full-width rows are the fields that need the room. */}
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <label htmlFor="business_name" className={labelClass}>
            שם העסק
          </label>
          <input
            id="business_name"
            name="business_name"
            type="text"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>
            כתובת הדף הציבורי שלך
          </label>
          <div className="flex items-stretch rounded-xl border border-ink/15 bg-white focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/15 overflow-hidden transition" dir="ltr">
            <span className="flex items-center bg-ink/[0.04] border-r border-ink/10 px-3 text-sm text-ink/50 select-none">basis.app/p/</span>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              pattern="[a-z0-9-]+"
              className="flex-1 min-w-0 px-4 py-3 text-[15px] focus:outline-none placeholder:text-ink/35"
            />
          </div>
          <p className={ui.hint}>
            רק אותיות אנגליות קטנות, מספרים, ומקף. זו הכתובת שנשלחת ללקוחות.
          </p>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="profession" className={labelClass}>
            תחום עיסוק
          </label>
          <input
            id="profession"
            name="profession"
            type="text"
            required
            maxLength={60}
            list="profession-suggestions"
            autoComplete="off"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className={inputClass}
          />
          <datalist id="profession-suggestions">
            {[...QUICK_PICKS.map((p) => p.label), ...MORE_SUGGESTIONS].map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-3" role="group" aria-label="בחירה מהירה">
            {QUICK_PICKS.map(({ label, Icon }) => {
              const selected = profession === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setProfession(label)}
                  aria-pressed={selected}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30 ${
                    selected
                      ? "border-blue-600 bg-blue-50 ring-4 ring-blue-600/10"
                      : "border-ink/10 bg-white hover:border-ink/30 hover:shadow-card"
                  }`}
                >
                  <Icon className="w-11 h-11" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="business_description" className={labelClass}>
            מה בדיוק העסק מוכר? <span className="font-normal text-ink/50">(לא חובה, אבל עוזר)</span>
          </label>
          <textarea
            id="business_description"
            name="business_description"
            rows={3}
            maxLength={300}
            className={`${inputClass} resize-none`}
          />
          <p className={ui.hint}>
            לפי זה נחפש מחירים בשוק ונבנה לך את יועץ התמחור.
          </p>
        </div>

        <div>
          <label htmlFor="years_experience" className={labelClass}>
            שנות ותק
          </label>
          <input
            id="years_experience"
            name="years_experience"
            type="number"
            min={0}
            max={80}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="team_size" className={labelClass}>
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
            className={inputClass}
          />
        </div>
      </div>

      {state.error && <p className={ui.error} role="alert">{state.error}</p>}

      <AiWorkingStatus
        title="מחפשים את העסק שלך בשוק"
        messages={[
          "שומרים את פרטי העסק...",
          "בודקים מה עסקים כמו שלך מוכרים",
          "סורקים מחירונים ואתרי השוואת מחירים...",
          "משווים מחירים בין עסקים דומים...",
          "מסדרים לך רשימת שירותים עם טווחי מחיר",
          "כמעט שם! עוד כמה שניות...",
        ]}
      />

      <div className="md:max-w-sm">
        <SubmitButton pendingText="מחפשים...">המשך לשאלון התאמה</SubmitButton>
      </div>
    </form>
  );
}
