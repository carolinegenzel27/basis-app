import Link from "next/link";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { AuthShell } from "@/components/layout/AuthShell";
import { ui } from "@/lib/ui";

export default function SignUpPage() {
  return (
    <AuthShell
      title="בואו נבנה את העסק שלך"
      subtitle="חשבון חינמי, לכל סוג של עסק. לוקח פחות מדקה."
      footer={
        <>
          כבר יש חשבון?{" "}
          <Link href="/login" className={ui.link}>
            להתחברות
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
