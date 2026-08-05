import Link from "next/link";
import { SignInForm } from "@/components/forms/SignInForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">התחברות ל-Basis</h1>
        <SignInForm />
        <p className="text-center text-sm text-gray-600">
          עוד אין לך חשבון?{" "}
          <Link href="/signup" className="text-slate-900 underline">
            להרשמה
          </Link>
        </p>
      </div>
    </div>
  );
}
