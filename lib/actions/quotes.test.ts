import { describe, it, expect, vi } from "vitest";

// Server Actions call revalidatePath, which needs a real Next.js request
// context - not present in a plain Vitest run. Stub it out.
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

// Replace the real Supabase server client with a lightweight, chainable
// mock. Supabase's query builder is "thenable" - every method (.select,
// .eq, .insert, .delete...) returns an object you can either keep
// chaining on, or await directly - so the mock needs to support both.
// `results` is a queue: each terminal await (an explicit .maybeSingle(),
// or a direct `await` on the end of a chain) consumes the next entry.
function makeSupabaseMock(user: { id: string } | null, results: unknown[]) {
  let i = 0;
  const nextResult = () => results[i++];

  const builder = {
    select: () => builder,
    eq: () => builder,
    order: () => builder,
    delete: () => builder,
    insert: () => builder,
    maybeSingle: () => Promise.resolve(nextResult()),
    then: (resolve: (value: unknown) => void) => resolve(nextResult()),
  };

  return {
    auth: { getUser: () => Promise.resolve({ data: { user } }) },
    from: () => builder,
  };
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { createQuote, deleteQuote } from "./quotes";

const mockedCreateClient = createClient as unknown as ReturnType<typeof vi.fn>;

function validQuoteForm() {
  const fd = new FormData();
  fd.set("business_profile_id", "11111111-1111-4111-8111-111111111111");
  fd.set("client_name", "לקוח לדוגמה");
  fd.set("client_email", "client@example.com");
  fd.set("project_description", "");
  fd.set("price", "500");
  fd.set("document_title", "");
  return fd;
}

// These tests cover the part of the app that TESTING.md previously flagged
// as untested: the ownership-check logic inside Server Actions - the code
// that actually decides whether a logged-in user may write to a given row.
// Supabase itself is mocked (no real DB/RLS here), so this doesn't replace
// the RLS policies in supabase/schema.sql - it verifies that the action's
// OWN logic correctly refuses to act the moment the ownership lookup comes
// back empty, exactly as described in the security document.
describe("createQuote - auth + ownership", () => {
  it("rejects when no user is logged in", async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock(null, []));

    const result = await createQuote({ success: false }, validQuoteForm());

    expect(result).toEqual({ success: false, error: "יש להתחבר מחדש" });
  });

  it("rejects when business_profile_id does not belong to the logged-in user", async () => {
    // The ownership lookup (business_profiles filtered by id + user_id)
    // comes back empty - same result whether the profile doesn't exist at
    // all, or exists but belongs to someone else.
    mockedCreateClient.mockResolvedValue(
      makeSupabaseMock({ id: "user-1" }, [{ data: null }])
    );

    const result = await createQuote({ success: false }, validQuoteForm());

    expect(result).toEqual({ success: false, error: "פרופיל עסק לא נמצא" });
  });

  it("rejects invalid input before ever calling Supabase", async () => {
    const spy = vi.fn();
    mockedCreateClient.mockImplementation(spy);

    const fd = validQuoteForm();
    fd.set("price", "-5"); // must be positive

    const result = await createQuote({ success: false }, fd);

    expect(result.success).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it("succeeds when the profile is owned and the insert succeeds", async () => {
    mockedCreateClient.mockResolvedValue(
      makeSupabaseMock({ id: "user-1" }, [
        { data: { id: "11111111-1111-4111-8111-111111111111" } }, // ownership check
        { error: null }, // insert
      ])
    );

    const result = await createQuote({ success: false }, validQuoteForm());

    expect(result).toEqual({ success: true });
  });
});

describe("deleteQuote - treats a not-owned/not-found quote the same way", () => {
  it("reports 'not found' when the ownership lookup comes back empty", async () => {
    mockedCreateClient.mockResolvedValue(
      makeSupabaseMock({ id: "user-1" }, [{ data: null }])
    );

    const result = await deleteQuote("some-quote-id");

    expect(result).toEqual({ success: false, error: "הצעת המחיר לא נמצאה" });
  });

  it("rejects when no user is logged in", async () => {
    mockedCreateClient.mockResolvedValue(makeSupabaseMock(null, []));

    const result = await deleteQuote("some-quote-id");

    expect(result).toEqual({ success: false, error: "יש להתחבר מחדש" });
  });

  it("deletes successfully when the quote belongs to the user", async () => {
    mockedCreateClient.mockResolvedValue(
      makeSupabaseMock({ id: "user-1" }, [
        { data: { id: "quote-1" } }, // ownership lookup
        { error: null }, // delete
      ])
    );

    const result = await deleteQuote("quote-1");

    expect(result).toEqual({ success: true });
  });
});
