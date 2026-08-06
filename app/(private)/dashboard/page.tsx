import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicLinkCopyButton } from "@/components/ui/PublicLinkCopyButton";

// Sign-out and the top-level nav links now live in the shared Navbar
// (app/(private)/layout.tsx) - this page only needs its own content.
const FEATURES = [
  {
    href: "/branding",
    title: "מיתוג ומיצוב",
    description: "שאלון קצר שהופך לחומרים שיווקיים מוכנים - הצהרת ערך, טקסט לאתר, ופיץ' מכירתי.",
  },
  {
    href: "/pricing-advisor",
    title: "יועץ תמחור",
    description: "טווח מחיר מומלץ מבוסס נתוני שוק אמיתיים, לפי המקצוע שלך.",
  },
  {
    href: "/quotes",
    title: "הצעות מחיר",
    description: "יצירת הצעות מחיר מקצועיות והורדה כ-PDF, תוך שנייה.",
  },
  {
    href: "/public-profile",
    title: "הכנת עמוד ציבורי",
    description: "טקסט, תמונה, ומסמכים שיוצגו בעמוד שאפשר לשלוח ללקוחות.",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gate: the fit assessment is a required one-time step right after
  // onboarding. If it hasn't been completed yet, send the user there first.
  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("id, slug, business_name")
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
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-blue-950">
          {businessProfile?.business_name
            ? `שלום, ${businessProfile.business_name}`
            : "מסך הבית"}
        </h1>
        <p className="text-gray-500 mt-1">מה עושים היום?</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {FEATURES.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition"
          >
            <h2 className="font-semibold text-blue-950">{feature.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
          </Link>
        ))}
      </div>

      {businessProfile?.slug && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2">
          <p className="text-sm font-medium text-blue-950">הדף הציבורי שלך</p>
          <p className="text-xs text-gray-500">
            זו הכתובת שאפשר לשלוח ללקוחות פוטנציאליים - היא מציגה את שם
            העסק והמיתוג שלך, בלי צורך בהתחברות.
          </p>
          <PublicLinkCopyButton slug={businessProfile.slug} />
        </div>
      )}
    </div>
  );
}
