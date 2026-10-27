import Link from "next/link";
import Image from "next/image";
import { IllustratedBackground } from "@/components/illustrations/IllustratedBackground";

// Shared frame for the login and signup pages - the same illustrated,
// playful background as the welcome page, with the form in a card on top.
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10 bg-cream overflow-hidden text-ink">
      <IllustratedBackground />
      <div className="relative z-10 w-full max-w-sm animate-pop-in">
        <Link href="/" className="block text-center font-extrabold text-2xl text-blue-950 mb-5">
          Basis<span className="text-coral">.</span>
        </Link>
        <div className="space-y-6 bg-white rounded-3xl border-2 border-ink shadow-[6px_6px_0_#1e1b4b] p-7 sm:p-8">
          <div className="flex flex-col items-center text-center space-y-2">
            {/* Intrinsic width/height on purpose - see Navbar.tsx comment. */}
            <Image src="/logo-full.png" alt="Basis" width={64} height={80} className="h-20 w-auto" priority />
            <h1 className="text-2xl font-extrabold text-blue-950">{title}</h1>
            <p className="text-sm text-ink/60">{subtitle}</p>
          </div>
          {children}
          <p className="text-center text-sm text-ink/70">{footer}</p>
        </div>
      </div>
    </div>
  );
}
