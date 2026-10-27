"use client";

import { useActionState, useState } from "react";
import {
  createBusinessProfile,
  type ActionState,
} from "@/lib/actions/business-profile";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { AiWorkingOverlay } from "@/components/ui/AiWorkingOverlay";
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

const labelClass = "block font-semibold mb-2";
const inputClass =
  "w-full rounded-2xl border-2 border-ink/15 bg-white px-4 py-3 text-lg focus:outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10 placeholder:text-ink/35 transition";

export function OnboardingForm() {
  const [state, formAction] = useActionState(createBusinessProfile, initialState);
  const [profession, setProfession] = useState("");

  return (
    <form action={formAction} className="space-y-8">
      <AiWorkingOverlay
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
            placeholder="למשל: המאפייה של נועה"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>
            כתובת הדף הציבורי שלך
          </label>
          <div className="flex items-stretch rounded-2xl border-2 border-ink/15 bg-white focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-700/10 overflow-hidden" dir="ltr">
            <span className="flex items-center bg-ink/5 px-3 text-ink/50 select-none">basis.app/p/</span>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              placeholder="noa-bakery"
              pattern="[a-z0-9-]+"
              className="flex-1 min-w-0 px-3 py-3 text-lg focus:outline-none placeholder:text-ink/35"
            />
          </div>
          <p className="text-xs text-ink/50 mt-1.5">
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
            placeholder="מה העסק עושה? אפשר לכתוב כל תחום"
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
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-2 py-3 text-sm font-semibold transition ${
                    selected
                      ? "border-ink bg-sun shadow-[3px_3px_0_#1e1b4b] -translate-y-0.5"
                      : "border-ink/10 bg-white hover:border-ink/40 hover:-translate-y-0.5"
                  }`}
                >
                  <Icon className="w-12 h-12" />
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
            placeholder="למשל: עוגות מעוצבות לימי הולדת, מגשי קינוחים לאירועים, סדנאות אפייה"
            className={`${inputClass} resize-none`}
          />
          <p className="text-xs text-ink/50 mt-1.5">
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

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="md:max-w-sm">
        <SubmitButton pendingText="מחפשים...">המשך לשאלון התאמה</SubmitButton>
      </div>
    </form>
  );
}
