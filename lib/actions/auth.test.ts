import { describe, it, expect, vi } from "vitest";

// Same approach as quotes.test.ts: replace the real Supabase server client
// with a small controlled fake, so these tests run in-memory with no real
// network call and no real account being created. Unlike quotes.test.ts,
// every branch tested here returns *before* the action calls redirect() -
// so next/navigation doesn't need mocking at all.
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { signUpAction, signInAction } from "./auth";

const mockedCreateClient = createClient as unknown as ReturnType<typeof vi.fn>;

function makeAuthMock({
  signUpResult,
  signInResult,
}: {
  signUpResult?: { data: { session: unknown | null }; error: { message: string } | null };
  signInResult?: { error: { message: string } | null };
}) {
  return {
    auth: {
      signUp: vi.fn().mockResolvedValue(signUpResult),
      signInWithPassword: vi.fn().mockResolvedValue(signInResult),
    },
  };
}

function fd(fields: Record<string, string>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  return form;
}

describe("signUpAction - validation + Supabase error handling", () => {
  it("rejects an invalid email before ever calling Supabase", async () => {
    const spy = vi.fn();
    mockedCreateClient.mockImplementation(spy);

    const result = await signUpAction(
      { success: false },
      fd({ email: "not-an-email", password: "abc12345" })
    );

    expect(result.success).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it("rejects a password that fails the sign-up strength rule", async () => {
    const spy = vi.fn();
    mockedCreateClient.mockImplementation(spy);

    // No digit - signUpSchema requires letters AND a digit.
    const result = await signUpAction(
      { success: false },
      fd({ email: "new@example.com", password: "onlyletters" })
    );

    expect(result.success).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it("surfaces Supabase's own error message when signUp fails", async () => {
    mockedCreateClient.mockResolvedValue(
      makeAuthMock({
        signUpResult: { data: { session: null }, error: { message: "Email already registered" } },
      })
    );

    const result = await signUpAction(
      { success: false },
      fd({ email: "existing@example.com", password: "abc12345" })
    );

    expect(result).toEqual({ success: false, error: "Email already registered" });
  });

  it("returns a specific message when signUp 'succeeds' but issues no session", async () => {
    // Supabase can report success with no session - e.g. email confirmation
    // is required, or (deliberately, so as not to reveal which emails
    // already exist) the address belongs to an existing account.
    mockedCreateClient.mockResolvedValue(
      makeAuthMock({
        signUpResult: { data: { session: null }, error: null },
      })
    );

    const result = await signUpAction(
      { success: false },
      fd({ email: "new@example.com", password: "abc12345" })
    );

    expect(result).toEqual({
      success: false,
      error:
        "לא נוצרה התחברות אוטומטית. אם זה אימייל חדש - ייתכן שנשלח אליו מייל אישור. אם כבר יש חשבון עם האימייל הזה - יש להתחבר דרך מסך ההתחברות.",
    });
  });
});

describe("signInAction - validation + anti-enumeration", () => {
  it("rejects an empty password before ever calling Supabase", async () => {
    const spy = vi.fn();
    mockedCreateClient.mockImplementation(spy);

    const result = await signInAction(
      { success: false },
      fd({ email: "user@example.com", password: "" })
    );

    expect(result.success).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it("returns the same vague error whether the email doesn't exist or the password is wrong", async () => {
    // The point of this test: signInAction never sees *why* Supabase
    // rejected the login - it always returns the identical generic message,
    // so a caller can't tell "wrong password" apart from "no such account".
    mockedCreateClient.mockResolvedValue(
      makeAuthMock({
        signInResult: { error: { message: "Invalid login credentials" } },
      })
    );

    const result = await signInAction(
      { success: false },
      fd({ email: "user@example.com", password: "wrongpass123" })
    );

    expect(result).toEqual({ success: false, error: "אימייל או סיסמה שגויים" });
  });
});
