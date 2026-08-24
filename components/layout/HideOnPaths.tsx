"use client";

import { usePathname } from "next/navigation";

// Lets a Server Component (like <Navbar />) be conditionally hidden on
// specific routes, without turning it into a Client Component itself.
// The Server Component is rendered on the server as usual and passed in
// as `children` - this wrapper only decides, in the browser, whether to
// show it. Used to hide the navbar on /onboarding, so a user mid-signup
// can't wander off before finishing their business details.
export function HideOnPaths({
  paths,
  children,
}: {
  paths: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (paths.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
