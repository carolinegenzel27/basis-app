import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Applies to every page inside app/(private)/ - one auth check protects
// onboarding, dashboard, branding, pricing-advisor, and quotes all at once.
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

  return <>{children}</>;
}
