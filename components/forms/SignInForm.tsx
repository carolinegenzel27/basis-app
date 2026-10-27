"use client";

import { useActionState } from "react";
import { signInAction, type AuthActionState } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ui } from "@/lib/ui";

const initialState: AuthActionState = { success: false };

export function SignInForm() {
  const [state, formAction] = useActionState(signInAction, initialState);

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
          autoComplete="current-password"
          className={ui.input}
        />
      </div>
      {state.error && (
        <p className={ui.error} role="alert">
          {state.error}
        </p>
      )}
      <SubmitButton pendingText="מתחברים...">להתחבר</SubmitButton>
    </form>
  );
}
