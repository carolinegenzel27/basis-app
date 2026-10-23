import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Basis - פלטפורמת מינוף לעסקים קטנים",
  description: "עוזר לבעלי עסקים קטנים למתג, לתמחר, ולהפיק הצעות מחיר מקצועיות",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
