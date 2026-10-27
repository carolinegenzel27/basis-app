import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

// Rounded, friendly typeface with full Hebrew support - exposed as a CSS
// variable that globals.css plugs into Tailwind's font-sans.
const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Basis - פלטפורמת מינוף לעסקים קטנים",
  description: "עוזר לכל עסק קטן למתג, לתמחר, ולהפיק הצעות מחיר מקצועיות",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
