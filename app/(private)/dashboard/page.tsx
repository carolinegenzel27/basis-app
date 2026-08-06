import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/actions/auth";
import { PublicLinkCopyButton } from "@/components/ui/PublicLinkCopyButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gate: the fit assessment is a required one-time step right after
  // onboarding. If it hasn't been completed yet, send the user there first.
  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("id, slug")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (businessProfile) {
    const { data: fitAssessment } = await supabase
      .from("fit_assessments")
      .select("id")
      .eq("business_profile_id", businessProfile.id)
      .maybeSingle();

    if (!fitAssessment) {
      redirect("/fit-assessment");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">דשבורד</h1>
      <p className="text-gray-600">מחוברת בתור: {user?.email}</p>

      <div className="flex flex-col gap-2">
        <Link href="/branding" className="text-slate-900 underline">
          מיתוג ומיצוב
        </Link>
        <Link href="/pricing-advisor" className="text-slate-900 underline">
          יועץ תמחור
        </Link>
        <Link href="/quotes" className="text-slate-900 underline">
          הצעות מחיר
        </Link>
        <Link href="/public-profile" className="text-slate-900 underline">
          הכנת עמוד ציבורי
        </Link>
      </div>

      {businessProfile?.slug && (
        <div className="rounded-lg border border-gray-200 p-4 space-y-2">
          <p className="text-sm font-medium">הדף הציבורי שלך</p>
          <p className="text-xs text-gray-500">
            זו הכתובת שאפשר לשלוח ללקוחות פוטנציאליים - היא מציגה את שם
            העסק והמיתוג שלך, בלי צורך בהתחברות.
          </p>
          <PublicLinkCopyButton slug={businessProfile.slug} />
        </div>
      )}

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
