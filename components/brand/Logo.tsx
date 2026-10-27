import Link from "next/link";

// Flat redraw of the Basis mark (three rising arrows on a base) so the logo
// matches the rest of the flat design at any size. The original glossy PNG
// logos are still in /public if they're ever needed again.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="#1e1b4b" />
      <path d="M8 31 L32 31" stroke="#ffc93c" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M11 27 L11 21" stroke="#7aa7ff" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M8.5 23 L11 20 L13.5 23" fill="none" stroke="#7aa7ff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 27 L19 16" stroke="#a9c4ff" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M16.5 18 L19 15 L21.5 18" fill="none" stroke="#a9c4ff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 27 C27 22 28 16 29 10" fill="none" stroke="#ff7a59" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M25.6 11.6 L29.2 8.6 L31.6 12.6" fill="none" stroke="#ff7a59" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({
  href = "/",
  tone = "dark",
  className = "",
}: {
  href?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30 ${className}`}
    >
      <LogoMark className="w-9 h-9 shrink-0" />
      <span className={`text-xl font-extrabold tracking-tight ${tone === "dark" ? "text-ink" : "text-white"}`}>
        basis
      </span>
    </Link>
  );
}
