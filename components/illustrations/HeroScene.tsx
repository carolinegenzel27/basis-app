// The big welcome-page illustration: a little shop with a striped awning,
// a price bubble and a growth chart floating around it - "your business,
// priced and branded". Drawn on a 520x460 grid.

const INK = "#1e1b4b";
const s = {
  stroke: INK,
  strokeWidth: 3.5,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

export function HeroScene({ className }: { className?: string }) {
  const stripes = Array.from({ length: 8 }, (_, i) => i);

  return (
    <svg viewBox="0 0 520 460" className={className} role="img" aria-label="איור של עסק קטן עם תג מחיר וגרף צמיחה">
      {/* background shapes */}
      <circle cx="270" cy="250" r="190" fill="#dde9ff" />
      <circle cx="420" cy="120" r="46" fill="#fff1c7" />

      {/* ground */}
      <path d="M40 404 L490 404" {...s} />
      <ellipse cx="262" cy="406" rx="200" ry="10" fill="#1e1b4b" opacity="0.08" />

      {/* building */}
      <rect x="120" y="170" width="290" height="234" rx="6" fill="#fff8ef" {...s} />

      {/* sign */}
      <rect x="168" y="112" width="194" height="52" rx="14" fill={INK} />
      <text x="265" y="147" textAnchor="middle" fontSize="26" fontWeight="700" fill="#ffffff">
        העסק שלי
      </text>
      <path d="M200 164 L200 176 M330 164 L330 176" {...s} />

      {/* awning */}
      {stripes.map((i) => (
        <rect
          key={i}
          x={108 + i * 39}
          y={176}
          width={39}
          height={40}
          fill={i % 2 === 0 ? "#ff7a59" : "#ffffff"}
        />
      ))}
      {stripes.map((i) => (
        <path
          key={`sc-${i}`}
          d={`M${108 + i * 39} 216 a19.5 19.5 0 0 0 39 0`}
          fill={i % 2 === 0 ? "#ff7a59" : "#ffffff"}
          {...s}
        />
      ))}
      <rect x="108" y="176" width="312" height="40" fill="none" {...s} />

      {/* shop window with a cake on a stand */}
      <rect x="148" y="252" width="140" height="112" rx="10" fill="#dde9ff" {...s} />
      <path d="M160 270 L190 300" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
      <path d="M190 344 L246 344 M218 344 L218 330" {...s} />
      <ellipse cx="218" cy="330" rx="36" ry="6" fill="#ffffff" {...s} />
      <rect x="192" y="300" width="52" height="28" rx="6" fill="#ffe1d6" {...s} />
      <path d="M192 310 C200 316 206 306 214 312 C222 318 228 306 236 312 C240 314 244 310 244 310" fill="none" {...s} />
      <circle cx="218" cy="292" r="7" fill="#e11d48" {...s} />

      {/* door */}
      <rect x="312" y="252" width="74" height="152" rx="6" fill="#ffc93c" {...s} />
      <rect x="324" y="266" width="50" height="50" rx="6" fill="#fff1c7" {...s} />
      <circle cx="372" cy="340" r="4.5" fill={INK} />
      <path d="M332 280 L349 266 L366 280" fill="none" {...s} strokeWidth={2.5} />
      <rect x="330" y="282" width="38" height="22" rx="4" fill="#34c79a" {...s} strokeWidth={2.5} />
      <text x="349" y="298" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ffffff">
        פתוח
      </text>

      {/* plant */}
      <path d="M70 404 L64 360 L104 360 L98 404 Z" fill="#ff7a59" {...s} />
      <path d="M84 360 C70 340 62 318 74 300 C88 316 90 340 84 360 Z" fill="#34c79a" {...s} />
      <path d="M84 360 C96 336 112 328 124 334 C118 350 102 358 84 360 Z" fill="#34c79a" {...s} />
      <path d="M84 360 C76 346 58 342 48 350 C56 362 72 364 84 360 Z" fill="#34c79a" {...s} />

      {/* floating price bubble */}
      <g className="animate-float" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <rect x="40" y="56" width="134" height="64" rx="18" fill="#ffffff" {...s} />
        <path d="M80 120 L74 140 L98 120" fill="#ffffff" {...s} />
        <text x="107" y="98" textAnchor="middle" fontSize="28" fontWeight="800" fill={INK}>
          ₪180
        </text>
        <circle cx="160" cy="58" r="12" fill="#34c79a" {...s} strokeWidth={3} />
        <path d="M154 58 L158 62 L166 54" fill="none" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* floating growth chart */}
      <g className="animate-float-slow" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <rect x="392" y="200" width="104" height="92" rx="16" fill="#ffffff" {...s} />
        <rect x="408" y="256" width="14" height="22" rx="3" fill="#9b7bff" {...s} strokeWidth={2.5} />
        <rect x="430" y="240" width="14" height="38" rx="3" fill="#4f8bff" {...s} strokeWidth={2.5} />
        <rect x="452" y="222" width="14" height="56" rx="3" fill="#34c79a" {...s} strokeWidth={2.5} />
        <path d="M406 240 L432 224 L452 230 L480 210" fill="none" {...s} strokeWidth={2.5} stroke="#ff7a59" />
        <path d="M470 208 L481 209 L478 220" fill="none" {...s} strokeWidth={2.5} stroke="#ff7a59" />
      </g>

      {/* sparkles */}
      <path d="M440 40 C442 52 448 58 460 60 C448 62 442 68 440 80 C438 68 432 62 420 60 C432 58 438 52 440 40 Z" fill="#ffc93c" {...s} strokeWidth={2.5} />
      <path d="M40 210 C41 218 45 222 53 223 C45 224 41 228 40 236 C39 228 35 224 27 223 C35 222 39 218 40 210 Z" fill="#9b7bff" {...s} strokeWidth={2.5} />
    </svg>
  );
}
