import { PriceTag, Megaphone, QuoteDoc } from "@/components/illustrations/BusinessIcons";

// Hero visual for the welcome page: a stack of real-looking app cards
// (pricing advisor result, an AI slogan idea, a sent quote) - shows what the
// product actually does instead of an abstract illustration. Decorative:
// the page text already says all of this, so it's hidden from screen readers.
export function ProductPreview({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      {/* glow */}
      <div className="absolute inset-6 rounded-[2.5rem] bg-gradient-to-br from-blue-400/30 via-lilac/25 to-coral/30 blur-3xl" />

      {/* main card: pricing advisor */}
      <div className="relative rounded-3xl bg-white border border-ink/[0.08] shadow-lift p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-sun-soft flex items-center justify-center">
              <PriceTag className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-semibold text-ink/50">יועץ תמחור</p>
              <p className="font-bold text-ink">עוגת יום הולדת מעוצבת</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1">
            מחירי שוק
          </span>
        </div>

        <p className="mt-6 text-sm text-ink/55">טווח מחיר מומלץ</p>
        {/* dir="ltr" keeps "₪250–450" from flipping to "450–₪250" in RTL */}
        <p className="text-4xl font-extrabold tracking-tight text-ink mt-1 text-right">
          <span dir="ltr">₪250–450</span>
        </p>

        {/* price range bar */}
        <div className="mt-5">
          <div className="relative h-2.5 rounded-full bg-ink/[0.06]">
            <div className="absolute inset-y-0 right-[22%] left-[30%] rounded-full bg-gradient-to-l from-blue-500 to-lilac" />
            <div className="absolute -top-1 left-[42%] w-4.5 h-4.5 rounded-full bg-white border-[3px] border-ink shadow" />
          </div>
          <div className="flex justify-between text-[11px] text-ink/40 mt-2">
            <span>₪150</span>
            <span>₪600</span>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <span className="flex-1 rounded-xl bg-ink text-white text-sm font-semibold text-center py-2.5">
            יצירת הצעת מחיר
          </span>
          <span className="rounded-xl border border-ink/15 text-sm font-semibold text-ink px-4 py-2.5">
            עוד שירותים
          </span>
        </div>
      </div>

      {/* floating: AI slogan idea */}
      <div className="absolute -top-8 -left-4 sm:-left-10 w-60 rounded-2xl bg-white border border-ink/[0.08] shadow-lift p-4 animate-float-slow"
        style={{ "--tilt": "-3deg" } as React.CSSProperties}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-coral-soft flex items-center justify-center">
            <Megaphone className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-ink/60">רעיון לסלוגן · AI</p>
        </div>
        <p className="mt-2.5 font-bold text-ink leading-snug">עוגות שמספרות את הסיפור שלכם</p>
        <span className="mt-3 inline-block rounded-md bg-ink/[0.05] text-[11px] font-semibold text-ink/70 px-2 py-1">
          העתקה
        </span>
      </div>

      {/* floating: quote sent */}
      <div className="absolute -bottom-16 -right-3 sm:-right-8 rounded-2xl bg-white border border-ink/[0.08] shadow-lift p-3.5 pl-5 flex items-center gap-3 animate-float"
        style={{ "--tilt": "2deg" } as React.CSSProperties}
      >
        <div className="w-10 h-10 rounded-xl bg-sky-soft flex items-center justify-center">
          <QuoteDoc className="w-7 h-7" />
        </div>
        <div>
          <p className="text-sm font-bold text-ink">הצעת מחיר נשלחה</p>
          <p className="text-xs text-ink/50">PDF · ₪380 · לפני דקה</p>
        </div>
      </div>
    </div>
  );
}
