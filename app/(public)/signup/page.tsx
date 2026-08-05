import Link from "next/link";
import { SignUpForm } from "@/components/forms/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">הרשמה ל-Basis</h1>
        <SignUpForm />
        <p className="text-center text-sm text-gray-600">
          כבר יש לך חשבון?{" "}
          <Link href="/login" className="text-slate-900 underline">
            להתחברות
          </Link>
        </p>
      </div>
    </div>
  );
}
