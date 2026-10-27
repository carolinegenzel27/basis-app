import Link from "next/link";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { AuthShell } from "@/components/layout/AuthShell";

export default function SignUpPage() {
  return (
    <AuthShell
      title="הרשמה"
      subtitle="פותחים חשבון בחינם - לכל סוג של עסק"
      footer={
        <>
          כבר יש חשבון?{" "}
          <Link href="/login" className="text-coral font-bold underline underline-offset-4">
            להתחברות
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
