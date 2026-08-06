import Link from "next/link";

// Replaces Next.js's default (English) 404 page - relevant now that /p/[slug]
// can legitimately 404 for a slug that doesn't exist, and this is a Hebrew app.
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="text-center space-y-3">
        <p className="text-sm font-medium text-slate-400">404</p>
        <h1 className="text-2xl font-bold text-slate-900">הדף לא נמצא</h1>
        <p className="text-gray-500">
          ייתכן שהכתובת שגויה, או שהעמוד הוסר.
        </p>
        <Link href="/" className="inline-block text-slate-900 underline text-sm">
          חזרה לעמוד הבית
        </Link>
      </div>
    </div>
  );
}
