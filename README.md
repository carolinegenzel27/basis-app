# Basis

פרויקט גמר בקורס טכנולוגיות אינטרנט (Fullstack) - Caroline Genzel

**האתר החי:** [basis-app-sigma.vercel.app](https://basis-app-sigma.vercel.app)

## מה זה Basis

Basis היא פלטפורמת מינוף (leverage) לבעלי עסקים קטנים ועצמאים - מורים
לנהיגה, דיאטניות, ושפים פרטיים. בעל עסק קטן בדרך כלל טוב מאוד במקצוע שלו,
אבל חלש בשיווק, בתמחור, ובניירת מקצועית. האפליקציה לוקחת ממנו קלט מינימלי
(שאלון קצר, שממולא פעם אחת) והופכת אותו לתוצרים מקצועיים: תוכן שיווקי,
המלצת מחיר מבוססת נתוני שוק, הצעות מחיר כקובץ PDF, ועמוד עסקי ציבורי
שאפשר לשלוח ללקוחות.

**עיקרון ארכיטקטוני מרכזי - אפס תלות ב-API חיצוני:** התוכן השיווקי נוצר
מתבניות קבועות, המלצות התמחור מגיעות מטבלת נתונים שהוזנה מראש, וקובצי
ה-PDF נוצרים בצד השרת - בלי שום קריאה לשירות AI או API של צד שלישי בזמן
ריצה. זו החלטה מכוונת: האפליקציה דטרמיניסטית, מהירה, חינמית להפעלה, ולא
יכולה "ליפול" בגלל ששירות חיצוני נפל.

## תכונות עיקריות

- הרשמה והתחברות מאובטחות (Supabase Auth)
- שאלון onboarding ליצירת פרופיל עסקי, כולל כתובת ציבורית ייחודית (slug)
- שאלון התאמה קצר שממליץ אם להתמקד ביועץ התמחור, במיתוג, או בשניהם
- שאלון מיתוג שמייצר אוטומטית 4 תוצרי תוכן שיווקי (הצהרת ערך, טקסט לאתר,
  טקסט ל-LinkedIn, פיץ' מכירה)
- יועץ תמחור מבוסס נתוני שוק אמיתיים לפי תחום עיסוק וסוג פרויקט
- יצירת הצעות מחיר והפקתן כקובץ PDF מקצועי, כולל תמיכה נכונה בעברית
- עמוד עסקי ציבורי (`/p/[slug]`) עם תמונה, טקסטים חופשיים, ומסמכים
  להורדה - נגיש בלי צורך בהתחברות

## סטאק טכנולוגי

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Supabase** - מסד נתונים (Postgres), Auth, ואחסון קבצים בפרויקט אחד
- **Tailwind CSS v4**
- **Zod** - ולידציה בצד השרת בכל פעולת כתיבה
- **@react-pdf/renderer** - הפקת PDF בצד השרת (הצעות מחיר)
- **Vitest** - בדיקות יחידה (ראו `TESTING.md`)
- **Vercel** - אירוח ופריסה

## דרישות מקדימות

- Node.js 20 ומעלה, ו-npm
- פרויקט [Supabase](https://supabase.com) (יש תוכנית חינמית)

## הרצה מקומית

### 1. התקנת תלויות

```bash
npm install
```

### 2. הגדרת Supabase

1. יוצרים פרויקט חדש ב-[supabase.com](https://supabase.com).
2. בדשבורד של Supabase, תחת **SQL Editor**, מריצים את הקבצים הבאים,
   **בסדר הזה בדיוק** (כל קובץ נשען על הקודם לו):

   ```
   supabase/schema.sql
   supabase/fix_grants.sql
   supabase/add_quote_title.sql
   supabase/add_fit_assessment.sql
   supabase/add_profile_media.sql
   supabase/fix_profile_view.sql
   supabase/update_pricing_real_data.sql
   ```

3. תחת **Settings → API**, מעתיקים את ה-**Project URL**, את מפתח ה-**anon
   public**, ואת מפתח ה-**service_role** (סודי - לא לחשוף).

### 3. הגדרת משתני סביבה

```bash
cp .env.local.example .env.local
```

וממלאים את שלושת הערכים משלב 2:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

הקובץ `.env.local` כבר מוגדר ב-`.gitignore` - אסור לשמור בו ערכים אמיתיים
ולהעלות אותו ל-Git.

### 4. הרצת האפליקציה

```bash
npm run dev
```

פותחים [http://localhost:3000](http://localhost:3000). כדי לנסות את
התהליך המלא: נרשמים דרך עמוד ההרשמה, וממשיכים דרך onboarding → שאלון
התאמה → דשבורד → יועץ תמחור / מיתוג / הצעות מחיר / עמוד ציבורי.

## הרצת בדיקות

```bash
npm test           # הרצה חד-פעמית
npm run test:watch   # מצב watch בזמן פיתוח
```

לפירוט מלא של מה נבדק, למה, ומה בכוונה לא נבדק - ראו `TESTING.md`,
ובמפורט יותר במסמך "אפיון בדיקות" המצורף בנפרד.

## Lint

```bash
npm run lint
```

## פריסה (Vercel)

1. דוחפים את הקוד ל-GitHub, ואז מייבאים אותו כ-New Project ב-
   [Vercel](https://vercel.com).
2. מוסיפים את אותם שלושה משתני סביבה משלב 3 תחת **Settings →
   Environment Variables** בפרויקט ב-Vercel.
3. מפעילים דיפלוי - Vercel בונה ופורס מחדש אוטומטית בכל push.
4. **שלב אחרון וקריטי:** ב-Supabase, תחת **Authentication → URL
   Configuration**, מגדירים:
   - **Site URL** - הדומיין האמיתי של Vercel (`https://the-app.vercel.app`)
   - **Redirect URLs** - אותו דומיין עם `/**` בסוף

   בלי השלב הזה, הרשמה/התחברות באתר החי פשוט לא יעבדו - Supabase Auth
   ידחה את ההפניה כי הוא לא מזהה את הדומיין.

## מבנה הפרויקט

```
app/
  (public)/       עמודים שלא דורשים התחברות: נחיתה, כניסה, הרשמה,
                   והעמוד העסקי הציבורי /p/[slug]
  (private)/      עמודים מוגנים: onboarding, fit-assessment, dashboard,
                   branding, pricing-advisor, quotes, public-profile
  api/quotes/[id]/pdf/  ה-API Route היחיד - מפיק ומחזיר קובץ PDF
components/
  forms/          כל רכיבי הטפסים (Client Components)
  ui/             רכיבי UI קטנים לשימוש חוזר
  layout/         Navbar
lib/
  actions/        Server Actions - כל פעולת כתיבה עוברת דרכן
  validations/     סכמות Zod - אותן הסכמות בצד הלקוח ובצד השרת
  templates/       שאלות המיתוג ומנוע התוכן מבוסס-הכללים
  fit-assessment/  שאלות השאלון ולוגיקת הניקוד
  pdf/             מסמך ה-PDF ותיקון הכיווניות (bidi) בעברית
  supabase/        יצירת הקליינטים (דפדפן, שרת, admin)
supabase/
  schema.sql וקבצי מיגרציה - מורצים ידנית ב-SQL Editor של Supabase
proxy.ts           רץ לפני כל בקשה - מרענן את עוגיית ההתחברות
                    (המקבילה ב-Next.js 16 ל-middleware.ts)
```

## מסמכים נלווים

- `TESTING.md` - מה נבדק אוטומטית, למה, ומה בכוונה נשאר מחוץ להיקף
- מסמך אפיון בדיקות (`Basis_מסמך_אפיון_בדיקות.docx`) - תוכנית בדיקות
  מלאה: תכונות מרכזיות, קלטים לא תקינים, תהליכים עסקיים, הרשאות, מסד
  הנתונים, מקרי קצה, ו-UI
- מסמך קוד הבדיקות (`Basis_קוד_הבדיקות.docx`) - קוד המקור המלא של
  בדיקות היחידה
- מסמך אבטחה (`Basis_מסמך_אבטחה.docx`) - שכבות ההגנה, RLS, ולידציה,
  אבטחת קבצים, וניהול סודות
- מסמך סקיילביליות (`Basis_מסמך_סקיילביליות.docx`) - צווארי בקבוק
  קיימים ומסלול צמיחה
