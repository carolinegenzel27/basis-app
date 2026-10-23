// Supabase client for use in the BROWSER (Client Components).
// Uses only the public URL + anon key - safe to expose, protected by RLS.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
