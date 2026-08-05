import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/actions/auth";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">דשבורד</h1>
      <p className="text-gray-600">מחוברת בתור: {user?.email}</p>

      <div className="flex flex-col gap-2">
        <Link href="/branding" className="text-slate-900 underline">
          מיתוג ומיצוב
        </Link>
        <p className="text-sm text-gray-400">
          יועץ תמחור, הצעות מחיר, ודף עסק ציבורי - בקרוב
        </p>
      </div>

      <form action={signOutAction}>
        <button
          type="submit"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          התנתקות
        </button>
      </form>
    </div>
  );
}
