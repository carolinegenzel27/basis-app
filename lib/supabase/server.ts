// Supabase client for use on the SERVER (Server Components, Server Actions, Route Handlers).
// Reads/writes the user's auth session via cookies, so RLS policies know who is asking.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll can be called from a Server Component during render,
            // where cookies can't be mutated - safe to ignore if middleware
            // is refreshing the session.
          }
        },
      },
    }
  );
}

// Admin client - uses the SERVICE ROLE key, which bypasses RLS entirely.
// Only ever import this inside server-only code (Server Actions / Route Handlers),
// and only for the one operation that legitimately needs to bypass RLS
// (e.g. reading market_pricing_data if it has no public policy).
// NEVER import this file in a Client Component.
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
