// Clean line icons for the professional page style - thin strokes in
// currentColor, no fills or cartoon outlines, so they read as "corporate"
// next to the playful sticker set in BusinessIcons.tsx. 48x48 grid.

type IconProps = { className?: string };

function Line({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function HelmetIcon(props: IconProps) {
  return (
    <Line {...props}>
      <path d="M8 32 C8 20 15 12 24 12 C33 12 40 20 40 32" />
      <path d="M20 12.5 L20 22 M28 12.5 L28 22" />
      <path d="M5 32 L43 32 L43 36 L5 36 Z" />
      <path d="M12 40 L36 40" />
    </Line>
  );
}

export function ScalesIcon(props: IconProps) {
  return (
    <Line {...props}>
      <path d="M24 8 L24 40 M16 40 L32 40 M10 14 L38 14" />
      <circle cx="24" cy="8" r="2" />
      <path d="M10 14 L4 28 C4 31 7 33 10 33 C13 33 16 31 16 28 Z" />
      <path d="M38 14 L32 28 C32 31 35 33 38 33 C41 33 44 31 44 28 Z" />
    </Line>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <Line {...props}>
      <path d="M6 6 L6 42 L42 42" />
      <path d="M13 34 L13 26 M21 34 L21 20 M29 34 L29 24 M37 34 L37 14" strokeWidth={3} />
      <path d="M12 20 L20 13 L28 17 L38 7" />
      <path d="M33 7 L38 7 L38 12" />
    </Line>
  );
}

export function LaptopIcon(props: IconProps) {
  return (
    <Line {...props}>
      <rect x="9" y="10" width="30" height="21" rx="2" />
      <path d="M4 37 L44 37 L41 31 L7 31 Z" />
      <path d="M20 17 L16 21 L20 25 M28 17 L32 21 L28 25" />
    </Line>
  );
}

export function HouseIcon(props: IconProps) {
  return (
    <Line {...props}>
      <path d="M6 22 L24 7 L42 22" />
      <path d="M11 18 L11 41 L37 41 L37 18" />
      <path d="M20 41 L20 29 L28 29 L28 41" />
      <path d="M32 11 L32 6 L36 6 L36 14" />
    </Line>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <Line {...props}>
      <circle cx="24" cy="9" r="3" />
      <path d="M22 12 L11 41 M26 12 L37 41" />
      <path d="M14 33 C20 37 28 37 34 33" />
      <path d="M8 44 L40 44" />
    </Line>
  );
}
