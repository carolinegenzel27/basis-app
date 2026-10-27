import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicLinkCopyButton } from "@/components/ui/PublicLinkCopyButton";
import { ui } from "@/lib/ui";
import {
  Megaphone,
  PriceTag,
  QuoteDoc,
  Storefront,
} from "@/components/illustrations/BusinessIcons";

// Sign-out and the top-level nav links now live in the shared Navbar
// (app/(private)/layout.tsx) - this page only needs its own content.
const FEATURES = [
  {
    href: "/branding",
    title: "מיתוג",
    Icon: Megaphone,
    tint: "bg-coral-soft",
    description: "רעיונות כתיבה עם AI - סלוגנים, ביו לאינסטגרם, טקסט לאתר ופוסטים, מוכנים להעתקה.",
  },
  {
    href: "/pricing-advisor",
    title: "יועץ תמחור",
    Icon: PriceTag,
    tint: "bg-sun-soft",
    description: "טווח מחיר מומלץ לשירותים שלך, לפי חיפוש מחירים אמיתי בשוק.",
  },
  {
    href: "/quotes",
    title: "הצעות מחיר",
    Icon: QuoteDoc,
    tint: "bg-sky-soft",
    description: "יצירת הצעות מחיר מקצועיות והורדה כ-PDF, תוך שנייה.",
  },
  {
    href: "/public-profile",
    title: "הכנת עמוד ציבורי",
    Icon: Storefront,
    tint: "bg-mint-soft",
    description: "טקסט, תמונה, ומסמכים שיוצגו בעמוד שאפשר לשלוח ללקוחות.",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gate 1: onboarding itself. A user who signed up, left before finishing
  // the business-profile form, and later logs back in (signInAction always
  // redirects to /dashboard, never back to /onboarding) would otherwise land
  // here with no business_profile row - every feature card below assumes
  // one exists. Send her to finish onboarding first.
  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("id, slug, business_name")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!businessProfile) {
    redirect("/onboarding");
  }

  // Gate 2: the fit assessment is a required one-time step right after
  // onboarding. If it hasn't been completed yet, send the user there first.
  const { data: fitAssessment } = await supabase
    .from("fit_assessments")
    .select("id")
    .eq("business_profile_id", businessProfile.id)
    .maybeSingle();

  if (!fitAssessment) {
    redirect("/fit-assessment");
  }

  return (
    <div className={`${ui.page} space-y-8`}>
      <div className="animate-fade-up">
        <p className="text-sm font-semibold text-blue-700">מסך הבית</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight">
          {businessProfile?.business_name
            ? `שלום, ${businessProfile.business_name}`
            : "מסך הבית"}
        </h1>
        <p className={`${ui.muted} mt-2 text-lg`}>מה עושים היום?</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {FEATURES.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className={`${ui.card} group p-6 flex items-start gap-4 hover:shadow-lift hover:-translate-y-0.5 transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30`}
          >
            <span className={`w-14 h-14 rounded-2xl ${feature.tint} flex items-center justify-center shrink-0`} aria-hidden="true">
              <feature.Icon className="w-10 h-10" />
            </span>
            <span className="flex-1">
              <span className="flex items-center justify-between">
                <span className="text-lg font-bold">{feature.title}</span>
                <span className="text-ink/30 group-hover:text-ink group-hover:-translate-x-1 transition" aria-hidden="true">←</span>
              </span>
              <span className="block text-ink/60 mt-1 leading-relaxed">{feature.description}</span>
            </span>
          </Link>
        ))}
      </div>

      {businessProfile?.slug && (
        <div className="relative overflow-hidden rounded-2xl bg-ink text-white p-6 sm:p-7">
          <div className="pointer-events-none absolute -top-16 -left-10 w-64 h-64 rounded-full bg-blue-500/30 blur-3xl" aria-hidden="true" />
          <div className="relative space-y-3">
            <p className="text-lg font-bold">הדף הציבורי שלך</p>
            <p className="text-white/70">
              כרטיס הביקור הדיגיטלי של העסק - אפשר לשלוח את הקישור לכל לקוח
              פוטנציאלי בשניות.
            </p>
            <PublicLinkCopyButton slug={businessProfile.slug} tone="light" />
          </div>
        </div>
      )}
    </div>
  );
}
