import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/actions/auth";

// Server Component (like everything else that reads user state in this
// app) - fetches its own data instead of receiving it as a prop, so any
// page inside app/(private)/ can just render <Navbar /> with no wiring.
// Destination pages already guard themselves against a missing business
// profile (e.g. branding shows "complete onboarding first"), so it's safe
// to always show every link here rather than tracking setup progress twice.
export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const links = [
    { href: "/dashboard", label: "מסך הבית" },
    { href: "/branding", label: "מיתוג" },
    { href: "/pricing-advisor", label: "יועץ תמחור" },
    { href: "/quotes", label: "הצעות מחיר" },
    { href: "/public-profile", label: "עמוד ציבורי" },
  ];

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Explicit width/height (rendered as real <img> attributes) instead
            of the fill+positioned-parent pattern - fill depends on CSS
            classes sizing the parent box, so with a stale/missing stylesheet
            the logo exploded to full-page size. Intrinsic attributes cap the
            size at the HTML level, CSS or no CSS.
            This logo (logo-mark2.png) is deliberately shown ONLY here, once
            the user is actually inside the app - not on the public landing
            page or login/signup, which use the plain text wordmark. */}
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <Image src="/logo-mark2.png" alt="" width={40} height={32} className="h-8 w-auto shrink-0" priority />
          <span className="font-bold text-lg text-blue-950">Basis</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-y-1 text-sm divide-x divide-x-reverse divide-gray-200">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 text-gray-600 hover:text-blue-800 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {user?.email && (
            <span className="text-xs text-gray-400 hidden sm:inline" dir="ltr">
              {user.email}
            </span>
          )}
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-blue-800 underline"
            >
              התנתקות
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
