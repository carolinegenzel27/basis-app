import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Runs on (almost) every request, before any page or Server Action. Its one
// job: call getUser(), which - if Supabase decides the access token needs
// rotating - refreshes it and re-issues the auth cookie on the RESPONSE.
// That's the piece lib/supabase/server.ts's comment assumed existed: a plain
// Server Component can't write cookies during render (Next.js blocks it),
// so without this middleware a rotated token would just get silently
// dropped, and the user could get logged out unexpectedly mid-session.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Deliberately no logic between creating the client and this call - that's
  // the one thing Supabase's own docs warn not to get wrong here, since it's
  // easy to accidentally skip the refresh and reintroduce the bug this file
  // exists to fix.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Skip static assets - they don't need a fresh session cookie, and running
  // this on every image/CSS request would be pure overhead.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
