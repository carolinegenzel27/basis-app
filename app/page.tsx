import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center space-y-6">
      <h1 className="text-4xl font-bold">Basis</h1>
      <p className="max-w-md text-gray-600">
        עוזר לבעלי עסקים קטנים ועצמאים למתג, לתמחר, ולהפיק הצעות מחיר
        מקצועיות - מכל התהליכים באפליקציה אחת.
      </p>
      <div className="flex gap-4">
        <Link
          href="/signup"
          className="rounded-lg bg-slate-900 px-5 py-2 text-white font-medium hover:bg-slate-800"
        >
          הרשמה
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-gray-300 px-5 py-2 font-medium hover:bg-gray-50"
        >
          התחברות
        </Link>
      </div>
    </div>
  );
}
