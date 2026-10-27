import Link from "next/link";
import { SignInForm } from "@/components/forms/SignInForm";
import { AuthShell } from "@/components/layout/AuthShell";
import { ui } from "@/lib/ui";

export default function LoginPage() {
  return (
    <AuthShell
      title="שמחים לראות אותך שוב"
      subtitle="מתחברים וממשיכים בדיוק מאיפה שעצרת."
      footer={
        <>
          עוד אין חשבון?{" "}
          <Link href="/signup" className={ui.link}>
            הרשמה בחינם
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthShell>
  );
}
