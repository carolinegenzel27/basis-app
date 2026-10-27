import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ui } from "@/lib/ui";

// Replaces Next.js's default (English) 404 page - relevant now that /p/[slug]
// can legitimately 404 for a slug that doesn't exist, and this is a Hebrew app.
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 bg-cream text-ink px-6">
      <Logo />
      <div className={`${ui.card} p-10 text-center space-y-3 max-w-md`}>
        <p className="text-6xl font-extrabold tracking-tight bg-gradient-to-l from-blue-600 to-coral bg-clip-text text-transparent">
          404
        </p>
        <h1 className={ui.h1}>הדף לא נמצא</h1>
        <p className={ui.muted}>ייתכן שהכתובת שגויה, או שהעמוד הוסר.</p>
        <Link href="/" className={`${ui.btnPrimary} mt-3`}>
          חזרה לעמוד הבית
        </Link>
      </div>
    </div>
  );
}
