// Hand-drawn "sticker" illustrations of different small businesses - flat
// colors with a thick ink outline. Pure SVG (no image files), so they stay
// crisp at any size and cost nothing to load. Each one draws on a 96x96 grid.

const INK = "#1e1b4b";
const stroke = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

type IconProps = { className?: string; title?: string };

function Svg({ className, title, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {children}
    </svg>
  );
}

export function Cupcake(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M24 50 L72 50 L64 84 L32 84 Z" fill="#ff7a59" {...stroke} />
      <path d="M38 50 L41 84 M48 50 L48 84 M58 50 L55 84" {...stroke} fill="none" />
      <path
        d="M20 50 C14 42 22 32 30 34 C30 24 42 20 48 26 C54 20 66 24 66 34 C74 32 82 42 76 50 Z"
        fill="#ffe1d6"
        {...stroke}
      />
      <path d="M34 42 C40 38 46 44 52 40 C58 36 62 42 66 40" fill="none" {...stroke} />
      <circle cx="49" cy="16" r="7" fill="#e11d48" {...stroke} />
      <path d="M49 9 C50 4 55 2 58 3" fill="none" {...stroke} />
      <circle cx="30" cy="28" r="1.8" fill={INK} />
      <circle cx="64" cy="27" r="1.8" fill={INK} />
    </Svg>
  );
}

export function NailPolish(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="38" y="8" width="20" height="34" rx="5" fill={INK} {...stroke} />
      <rect x="32" y="40" width="32" height="8" rx="3" fill="#ebe4ff" {...stroke} />
      <path
        d="M26 56 C26 50 30 48 36 48 L60 48 C66 48 70 50 70 56 L70 80 C70 86 66 88 60 88 L36 88 C30 88 26 86 26 80 Z"
        fill="#9b7bff"
        {...stroke}
      />
      <path d="M34 58 L34 74" stroke="#ffffff" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      <circle cx="56" cy="66" r="3" fill="#ffffff" opacity={0.6} />
    </Svg>
  );
}

export function Scissors(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M44 50 L78 12" fill="none" {...stroke} strokeWidth={6} stroke="#9ca3af" />
      <path d="M52 50 L18 12" fill="none" {...stroke} strokeWidth={6} stroke="#cbd5e1" />
      <path d="M44 50 L78 12 M52 50 L18 12" fill="none" {...stroke} />
      <circle cx="48" cy="48" r="4" fill="#ffc93c" {...stroke} />
      <circle cx="32" cy="72" r="13" fill="#34c79a" {...stroke} />
      <circle cx="64" cy="72" r="13" fill="#34c79a" {...stroke} />
      <circle cx="32" cy="72" r="5" fill="#fff8ef" {...stroke} />
      <circle cx="64" cy="72" r="5" fill="#fff8ef" {...stroke} />
      <path d="M41 62 L46 52 M55 62 L50 52" fill="none" {...stroke} />
    </Svg>
  );
}

export function Camera(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M32 24 L38 16 L58 16 L64 24 Z" fill="#ffc93c" {...stroke} />
      <rect x="10" y="24" width="76" height="56" rx="10" fill="#4f8bff" {...stroke} />
      <circle cx="48" cy="52" r="19" fill="#fff8ef" {...stroke} />
      <circle cx="48" cy="52" r="11" fill={INK} />
      <circle cx="44" cy="48" r="3.5" fill="#ffffff" />
      <rect x="70" y="32" width="9" height="6" rx="2" fill="#ffe1d6" {...stroke} />
    </Svg>
  );
}

export function Coffee(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M36 8 C30 14 42 18 36 26 M50 6 C44 12 56 16 50 24" fill="none" {...stroke} stroke="#9ca3af" />
      <path d="M18 34 L70 34 L64 82 C64 86 60 88 56 88 L32 88 C28 88 24 86 24 82 Z" fill="#34c79a" {...stroke} />
      <path d="M68 44 C82 42 84 62 66 64" fill="none" {...stroke} strokeWidth={5} />
      <path d="M68 44 C82 42 84 62 66 64" fill="none" stroke="#34c79a" strokeWidth={1.5} />
      <rect x="14" y="28" width="60" height="9" rx="4" fill="#fff8ef" {...stroke} />
      <path d="M38 58 C38 52 46 52 46 58 C46 52 54 52 54 58 C54 64 46 68 46 70 C46 68 38 64 38 58 Z" fill="#ffffff" />
    </Svg>
  );
}

export function Palette(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M48 10 C24 10 8 28 10 50 C12 72 30 86 50 86 C60 86 62 78 56 72 C50 66 54 58 62 58 L72 58 C82 58 88 50 86 40 C82 22 66 10 48 10 Z"
        fill="#fff1c7"
        {...stroke}
      />
      <circle cx="30" cy="40" r="7" fill="#ff7a59" {...stroke} />
      <circle cx="46" cy="26" r="7" fill="#ffc93c" {...stroke} />
      <circle cx="66" cy="32" r="7" fill="#4f8bff" {...stroke} />
      <circle cx="30" cy="64" r="7" fill="#9b7bff" {...stroke} />
    </Svg>
  );
}

export function Dumbbell(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="28" y="44" width="40" height="8" rx="3" fill="#cbd5e1" {...stroke} />
      <rect x="14" y="28" width="14" height="40" rx="5" fill="#ff7a59" {...stroke} />
      <rect x="68" y="28" width="14" height="40" rx="5" fill="#ff7a59" {...stroke} />
      <rect x="6" y="36" width="8" height="24" rx="3" fill="#ffe1d6" {...stroke} />
      <rect x="82" y="36" width="8" height="24" rx="3" fill="#ffe1d6" {...stroke} />
    </Svg>
  );
}

export function PriceTag(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M50 10 L84 10 C86 10 86 12 86 14 L86 46 L44 88 C42 90 40 90 38 88 L8 58 C6 56 6 54 8 52 Z"
        fill="#ffc93c"
        {...stroke}
      />
      <circle cx="70" cy="26" r="6" fill="#fff8ef" {...stroke} />
      <text x="44" y="62" textAnchor="middle" fontSize="26" fontWeight="800" fill={INK} transform="rotate(-45 44 54)">
        ₪
      </text>
    </Svg>
  );
}

export function Megaphone(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M16 40 L16 58 L30 58 L64 76 L64 22 L30 40 Z" fill="#ff7a59" {...stroke} />
      <rect x="10" y="38" width="20" height="22" rx="5" fill="#ffe1d6" {...stroke} />
      <path d="M26 58 L32 80 L42 80 L38 62" fill="#fff8ef" {...stroke} />
      <path d="M74 36 L84 30 M76 49 L88 49 M74 62 L84 68" fill="none" {...stroke} />
    </Svg>
  );
}

export function QuoteDoc(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 8 L60 8 L76 24 L76 88 L20 88 Z" fill="#ffffff" {...stroke} />
      <path d="M60 8 L60 24 L76 24" fill="#dde9ff" {...stroke} />
      <path d="M30 36 L66 36 M30 48 L66 48 M30 60 L52 60" fill="none" {...stroke} stroke="#9ca3af" />
      <circle cx="64" cy="74" r="13" fill="#34c79a" {...stroke} />
      <path d="M58 74 L62 78 L70 70" fill="none" {...stroke} stroke="#ffffff" />
    </Svg>
  );
}

export function Storefront(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="14" y="34" width="68" height="54" rx="4" fill="#fff8ef" {...stroke} />
      <path d="M10 22 L86 22 L86 36 C86 42 76 42 76 36 C76 42 66 42 66 36 C66 42 56 42 56 36 C56 42 46 42 46 36 C46 42 36 42 36 36 C36 42 26 42 26 36 C26 42 16 42 16 36 L10 36 Z" fill="#ff7a59" {...stroke} />
      <rect x="22" y="50" width="26" height="22" rx="3" fill="#dde9ff" {...stroke} />
      <rect x="56" y="50" width="18" height="38" rx="2" fill="#ffc93c" {...stroke} />
      <circle cx="70" cy="70" r="1.8" fill={INK} />
      <rect x="20" y="8" width="56" height="14" rx="5" fill={INK} />
    </Svg>
  );
}

export function Sparkle({ className, color = "#ffc93c" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M20 2 C21.5 13 27 18.5 38 20 C27 21.5 21.5 27 20 38 C18.5 27 13 21.5 2 20 C13 18.5 18.5 13 20 2 Z"
        fill={color}
        stroke={INK}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Soft organic background shape - used big and blurred-looking behind content.
export function Blob({ className, color }: { className?: string; color: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path
        fill={color}
        d="M47.1,-58.6C60.4,-46.5,70.1,-30.9,73.4,-13.9C76.7,3.1,73.6,21.5,64.1,35.6C54.6,49.7,38.7,59.5,21.4,65.6C4.1,71.7,-14.6,74.1,-31.1,67.9C-47.6,61.7,-61.9,46.9,-69.6,29.3C-77.3,11.7,-78.4,-8.7,-71.4,-25.6C-64.4,-42.5,-49.3,-55.9,-33.2,-67.2C-17.1,-78.5,0,-87.7,15.4,-84.9C30.8,-82.1,33.8,-70.7,47.1,-58.6Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

// Dotted squiggle line - a small playful accent.
export function Squiggle({ className, color = "#9b7bff" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 30" className={className} aria-hidden="true">
      <path
        d="M4 15 C14 2 24 2 34 15 C44 28 54 28 64 15 C74 2 84 2 94 15 C104 28 110 26 116 20"
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </svg>
  );
}
