"use client";

import { useActionState } from "react";
import { signUpAction, type AuthActionState } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ui } from "@/lib/ui";

const initialState: AuthActionState = { success: false };

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className={ui.label}>
          אימייל
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          dir="ltr"
          placeholder="you@example.com"
          className={`${ui.input} text-right`}
        />
      </div>
      <div>
        <label htmlFor="password" className={ui.label}>
          סיסמה
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          pattern="(?=.*[A-Za-z])(?=.*\d).{8,}"
          title="8 תווים לפחות, כולל אות אחת וספרה אחת"
          aria-describedby="password-hint"
          className={ui.input}
        />
        <p id="password-hint" className={ui.hint}>
          8 תווים לפחות, כולל אות אחת וספרה אחת
        </p>
      </div>
      {state.error && (
        <p className={ui.error} role="alert">
          {state.error}
        </p>
      )}
      <SubmitButton pendingText="יוצרים חשבון...">יצירת חשבון בחינם</SubmitButton>
    </form>
  );
}
