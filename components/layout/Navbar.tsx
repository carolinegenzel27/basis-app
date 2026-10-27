import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/actions/auth";
import { Logo } from "@/components/brand/Logo";
import { NavLinks } from "./NavLinks";

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

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-ink/[0.07]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <Logo href="/dashboard" />

        <NavLinks />

        <div className="flex items-center gap-3 shrink-0">
          {user?.email && (
            <span className="text-xs text-ink/45 hidden lg:inline" dir="ltr">
              {user.email}
            </span>
          )}
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-ink/60 hover:text-ink hover:bg-ink/[0.05] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30"
            >
              התנתקות
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
