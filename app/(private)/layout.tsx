import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { HideOnPaths } from "@/components/layout/HideOnPaths";

// Applies to every page inside app/(private)/ - one auth check protects
// onboarding, dashboard, branding, pricing-advisor, and quotes all at once.
// Also renders the shared Navbar here, once, instead of every page building
// its own header/back-link/sign-out button.
export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Hidden on /onboarding and /fit-assessment on purpose - someone still
          in the signup flow hasn't finished setting up their business yet,
          so navigating away via the navbar would drop them on a page that
          expects setup to already be complete. */}
      <HideOnPaths paths={["/onboarding", "/fit-assessment"]}>
        <Navbar />
      </HideOnPaths>
      {children}
    </div>
  );
}
