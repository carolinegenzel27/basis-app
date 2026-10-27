import Link from "next/link";
import { SignInForm } from "@/components/forms/SignInForm";
import { AuthShell } from "@/components/layout/AuthShell";

export default function LoginPage() {
  return (
    <AuthShell
      title="שמחים לראות אותך שוב"
      subtitle="מתחברים וממשיכים מאיפה שעצרת"
      footer={
        <>
          עוד אין חשבון?{" "}
          <Link href="/signup" className="text-coral font-bold underline underline-offset-4">
            להרשמה
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthShell>
  );
}
