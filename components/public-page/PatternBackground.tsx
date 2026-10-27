import type { PatternKey } from "@/lib/business-theme";

// Subtle repeating background pattern in the business's accent color - one
// of three, picked per business (see getBusinessTheme), so two pages of the
// same kind of business still look different. Purely decorative.
export function PatternBackground({ pattern, color }: { pattern: PatternKey; color: string }) {
  const id = `pattern-${pattern}`;

  return (
    <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        {pattern === "dots" && (
          <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="2.4" fill={color} />
          </pattern>
        )}
        {pattern === "confetti" && (
          <pattern id={id} width="90" height="90" patternUnits="userSpaceOnUse">
            <rect x="10" y="12" width="10" height="4" rx="2" fill={color} transform="rotate(25 15 14)" />
            <circle cx="60" cy="20" r="3" fill={color} />
            <rect x="48" y="62" width="10" height="4" rx="2" fill={color} transform="rotate(-30 53 64)" />
            <path d="M18 64 l4 -7 l4 7 z" fill={color} />
            <circle cx="80" cy="78" r="2" fill={color} />
          </pattern>
        )}
        {pattern === "waves" && (
          <pattern id={id} width="80" height="24" patternUnits="userSpaceOnUse">
            <path d="M0 12 C10 2 30 2 40 12 C50 22 70 22 80 12" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          </pattern>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity="0.18" />
    </svg>
  );
}
