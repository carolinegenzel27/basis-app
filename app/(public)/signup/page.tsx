import Link from "next/link";
import Image from "next/image";
import { SignUpForm } from "@/components/forms/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="w-full max-w-sm space-y-6 bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-900/5 p-8">
        <div className="flex flex-col items-center space-y-3">
          {/* Intrinsic width/height on purpose - see Navbar.tsx comment. */}
          <Image src="/logo-full.png" alt="Basis" width={72} height={90} className="h-24 w-auto" priority />
          <h1 className="text-xl font-bold text-blue-950">הרשמה</h1>
        </div>
        <SignUpForm />
        <p className="text-center text-sm text-gray-600">
          כבר יש חשבון?{" "}
          <Link href="/login" className="text-blue-800 font-medium underline">
            להתחברות
          </Link>
        </p>
      </div>
    </div>
  );
}
