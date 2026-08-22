import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";

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
      <Navbar />
      {children}
    </div>
  );
}
