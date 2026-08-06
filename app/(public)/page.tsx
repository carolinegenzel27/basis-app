import Link from "next/link";
import Image from "next/image";

const HIGHLIGHTS = [
  {
    title: "מיתוג ומיצוב",
    description: "שאלון קצר שהופך לחומרים שיווקיים מוכנים לשימוש.",
  },
  {
    title: "יועץ תמחור",
    description: "טווח מחיר מומלץ, מבוסס נתוני שוק אמיתיים בתחום שלך.",
  },
  {
    title: "הצעות מחיר ועמוד ציבורי",
    description: "PDF מקצועי ללקוח, ועמוד שאפשר לשלוח לכל מי שרוצה להכיר אותך.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-white">
      <header className="max-w-4xl w-full mx-auto px-6 py-6 flex items-center justify-end">
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-gray-600 hover:text-blue-800">
            התחברות
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-blue-800 px-4 py-2 text-white font-medium hover:bg-blue-900 shadow-sm shadow-blue-900/20"
          >
            הרשמה
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 space-y-6">
        {/* Big, centered - not a small header icon. Intrinsic width/height
            (real <img> attributes, not fill+CSS) so it can never blow up in
            size even if a stylesheet fails to load - see Navbar.tsx. */}
        <Image src="/logo-full.png" alt="Basis" width={102} height={128} className="h-32 w-auto" priority />
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-950 max-w-2xl leading-tight">
          המינוף שחסר לעסק הקטן שלך
        </h1>
        <p className="max-w-md text-gray-600 text-lg">
          עוזר לבעלי עסקים קטנים ועצמאים למתג, לתמחר, ולהפיק הצעות מחיר
          מקצועיות - מכל התהליכים באפליקציה אחת.
        </p>
        {/* Single CTA - login already lives in the header, no need to repeat
            it a second time here. */}
        <div className="pt-2">
          <Link
            href="/signup"
            className="rounded-lg bg-blue-800 px-6 py-3 text-white font-medium hover:bg-blue-900 shadow-md shadow-blue-900/20"
          >
            להתחיל בחינם
          </Link>
        </div>
      </main>

      <section className="max-w-4xl w-full mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-3 gap-6">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-blue-100 bg-white p-5 text-right shadow-sm shadow-blue-900/5 border-t-4 border-t-blue-700"
            >
              <h2 className="font-semibold text-blue-950">{item.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
