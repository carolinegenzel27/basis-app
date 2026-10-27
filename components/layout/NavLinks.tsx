"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/dashboard", label: "מסך הבית" },
  { href: "/branding", label: "מיתוג" },
  { href: "/pricing-advisor", label: "יועץ תמחור" },
  { href: "/quotes", label: "הצעות מחיר" },
  { href: "/public-profile", label: "עמוד ציבורי" },
];

// Client-side only so it can highlight the page you're on (usePathname);
// the rest of the Navbar stays a Server Component.
export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="ניווט ראשי" className="order-last md:order-none w-full md:w-auto -mx-1 overflow-x-auto">
      <ul className="flex items-center gap-1 px-1 text-sm font-semibold">
        {LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`block whitespace-nowrap rounded-lg px-3 py-2 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30 ${
                  active ? "bg-ink text-white" : "text-ink/65 hover:text-ink hover:bg-ink/[0.05]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
