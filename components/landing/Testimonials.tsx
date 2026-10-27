import {
  Camera,
  Car,
  Coffee,
  Cupcake,
  Dumbbell,
  NailPolish,
  Palette,
  Scissors,
  Storefront,
  PriceTag,
} from "@/components/illustrations/BusinessIcons";
import { HelmetIcon, ScalesIcon, ChartIcon } from "@/components/illustrations/ProIcons";

type Testimonial = {
  name: string;
  business: string;
  quote: string;
  Icon: (props: { className?: string }) => React.ReactElement;
  tint: string;
};

// ⚠️ SAMPLE CONTENT - placeholder testimonials to show the layout. Replace
// with real quotes from real customers (with their permission) before this
// page goes live; publishing invented reviews as real ones misleads visitors.
const TESTIMONIALS: Testimonial[] = [
  { name: "נועה", business: "קונדיטוריה ביתית", quote: "תמיד תמחרתי עוגות לפי תחושת בטן. יועץ התמחור הראה לי שהייתי זולה מדי - העליתי מחירים ואף לקוחה לא עזבה.", Icon: Cupcake, tint: "bg-coral-soft" },
  { name: "ליה", business: "סטודיו לציפורניים", quote: "הביו החדש באינסטגרם נכתב תוך דקה. קיבלתי חמש אפשרויות ופשוט בחרתי את זו שהכי מרגישה אני.", Icon: NailPolish, tint: "bg-lilac-soft" },
  { name: "יוסי", business: "קבלן שיפוצים", quote: "הצעות מחיר מסודרות ב-PDF עם הלוגו שלי. לקוחות אומרים שזה נראה כמו חברה גדולה.", Icon: HelmetIcon, tint: "bg-sun-soft" },
  { name: "דניאל", business: "צלם אירועים", quote: "העמוד הציבורי החליף לי את האתר. שולח לינק אחד בוואטסאפ וכל התיק עבודות שם.", Icon: Camera, tint: "bg-sky-soft" },
  { name: "מאיה", business: "מאמנת כושר", quote: "סוף סוף מחירון שאני שלמה איתו. הנתונים מהשוק נתנו לי ביטחון לבקש את מה שמגיע לי.", Icon: Dumbbell, tint: "bg-mint-soft" },
  { name: "רון", business: "ספר ומעצב שיער", quote: "הסלוגנים שה-AI כתב פשוט מצחיקים ומדויקים. אחד מהם כבר תלוי על הקיר במספרה.", Icon: Scissors, tint: "bg-mint-soft" },
  { name: "מיכל", business: "עורכת דין", quote: "חשבתי שזה רק לעסקים 'כיפיים'. העמוד שלי יצא רציני, נקי ומקצועי בדיוק כמו שרציתי.", Icon: ScalesIcon, tint: "bg-sun-soft" },
  { name: "אבי", business: "מורה לנהיגה", quote: "תוך עשר דקות היה לי עמוד, מחירון והצעת מחיר ראשונה ששלחתי ללקוח.", Icon: Car, tint: "bg-sky-soft" },
  { name: "שירן", business: "מעצבת גרפית", quote: "הכלי היחיד שלא הייתי צריכה להסביר לו מה אני עושה - הוא פשוט הבין ממה שכתבתי.", Icon: Palette, tint: "bg-lilac-soft" },
  { name: "עומר", business: "בית קפה שכונתי", quote: "את התפריט והמחירים העליתי לעמוד הציבורי, ועכשיו כולם שולחים את הלינק אחד לשני.", Icon: Coffee, tint: "bg-coral-soft" },
  { name: "גלית", business: "הנהלת חשבונות", quote: "חיפשתי משהו שיעזור לי להיראות מקצועית בלי לשלם לסוכנות. זה בדיוק זה.", Icon: ChartIcon, tint: "bg-mint-soft" },
  { name: "תמר", business: "חנות מתנות", quote: "ההצעות מחיר חוסכות לי שעה ביום. ממש ככה.", Icon: Storefront, tint: "bg-sun-soft" },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label="5 מתוך 5 כוכבים" role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </div>
  );
}

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="w-[300px] sm:w-[340px] shrink-0 rounded-2xl bg-white border border-ink/[0.08] shadow-card p-5 flex flex-col gap-4">
      <Stars />
      <blockquote className="text-ink/80 leading-relaxed flex-1">״{t.quote}״</blockquote>
      <figcaption className="flex items-center gap-3">
        <span className={`w-12 h-12 rounded-full ${t.tint} ring-4 ring-white shadow-sm flex items-center justify-center shrink-0 text-ink`} aria-hidden="true">
          <t.Icon className="w-8 h-8" />
        </span>
        <span>
          <span className="block font-bold text-ink">{t.name}</span>
          <span className="block text-sm text-ink/55">{t.business}</span>
        </span>
      </figcaption>
    </figure>
  );
}

// Two rows of testimonial cards drifting in opposite directions. Each row's
// list is rendered twice for a seamless loop - the second copy is hidden from
// screen readers. Hovering (or focusing inside) pauses the motion, and with
// reduced motion on the rows simply become horizontally scrollable.
function Row({ items, reverse }: { items: Testimonial[]; reverse?: boolean }) {
  return (
    <div className="group overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_left,transparent,black_8%,black_92%,transparent)]">
      <div
        className={`flex w-max gap-5 py-3 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]`}
      >
        <ul className="flex gap-5">
          {items.map((t) => (
            <li key={t.name}>
              <Card t={t} />
            </li>
          ))}
        </ul>
        <ul className="flex gap-5 motion-reduce:hidden" aria-hidden="true">
          {items.map((t) => (
            <li key={t.name}>
              <Card t={t} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Testimonials() {
  const half = Math.ceil(TESTIMONIALS.length / 2);
  return (
    <div className="space-y-4">
      <Row items={TESTIMONIALS.slice(0, half)} />
      <Row items={TESTIMONIALS.slice(half)} reverse />
    </div>
  );
}

// Small overlapping stack of business "avatars" for the hero's social-proof line.
export function BusinessAvatarStack() {
  const avatars = [
    { Icon: Cupcake, tint: "bg-coral-soft" },
    { Icon: NailPolish, tint: "bg-lilac-soft" },
    { Icon: HelmetIcon, tint: "bg-sun-soft" },
    { Icon: Camera, tint: "bg-sky-soft" },
    { Icon: PriceTag, tint: "bg-mint-soft" },
  ];
  return (
    <div className="flex -space-x-3" aria-hidden="true">
      {avatars.map(({ Icon, tint }, i) => (
        <span key={i} className={`w-10 h-10 rounded-full ${tint} ring-[3px] ring-cream flex items-center justify-center text-ink`}>
          <Icon className="w-6 h-6" />
        </span>
      ))}
    </div>
  );
}
