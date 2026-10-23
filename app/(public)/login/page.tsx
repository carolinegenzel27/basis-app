import Link from "next/link";
import Image from "next/image";
import { SignInForm } from "@/components/forms/SignInForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="w-full max-w-sm space-y-6 bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-900/5 p-8">
        <div className="flex flex-col items-center space-y-3">
          {/* Intrinsic width/height on purpose - see Navbar.tsx comment. */}
          <Image src="/logo-full.png" alt="Basis" width={128} height={160} className="h-40 w-auto" priority />
          <h1 className="text-xl font-bold text-blue-950">התחברות</h1>
        </div>
        <SignInForm />
        <p className="text-center text-sm text-gray-600">
          עוד אין חשבון?{" "}
          <Link href="/signup" className="text-blue-800 font-medium underline">
            להרשמה
          </Link>
        </p>
      </div>
    </div>
  );
}
