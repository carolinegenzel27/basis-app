"use client";

import { useState } from "react";
import { IDEA_CATEGORIES, type IdeaKey } from "@/lib/templates/idea-categories";

export type Ideas = Partial<Record<IdeaKey, string[]>>;

const TINTS: Record<IdeaKey, string> = {
  slogans: "bg-sun-soft",
  uvp_statement: "bg-sky-soft",
  instagram_bio: "bg-lilac-soft",
  website_text: "bg-mint-soft",
  social_post: "bg-coral-soft",
  sales_pitch: "bg-sun-soft",
};

// Shows the AI writing ideas grouped into tabs (slogans, bio, website...),
// each idea in its own card with a one-click copy button.
export function MarketingContentDisplay({ ideas }: { ideas: Ideas }) {
  const categories = IDEA_CATEGORIES.filter((c) => (ideas[c.key]?.length ?? 0) > 0);
  const [active, setActive] = useState<IdeaKey>(categories[0]?.key ?? "slogans");
  const [copied, setCopied] = useState<string | null>(null);

  async function handleCopy(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  if (categories.length === 0) return null;
  const current = IDEA_CATEGORIES.find((c) => c.key === active) ?? categories[0];
  const list = ideas[current.key] ?? [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="tablist" aria-label="סוגי טקסטים">
        {categories.map((c) => {
          const isActive = c.key === current.key;
          return (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(c.key)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30 ${
                isActive
                  ? "bg-ink text-white"
                  : "bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-ink/50">{current.hint} · {list.length} רעיונות</p>

      <ul className="grid gap-3" role="tabpanel">
        {list.map((text, i) => {
          const id = `${current.key}-${i}`;
          return (
            <li
              key={id}
              className={`group relative rounded-xl border border-ink/[0.06] ${TINTS[current.key]} p-4 sm:p-5 pe-24 animate-fade-up`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <p className={`text-ink whitespace-pre-line ${current.key === "slogans" ? "text-lg font-bold" : "text-sm leading-relaxed"}`}>
                {text}
              </p>
              <button
                type="button"
                onClick={() => handleCopy(id, text)}
                className={`absolute top-3 left-3 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30 ${
                  copied === id
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-ink border border-ink/10 hover:bg-ink hover:text-white"
                }`}
              >
                {copied === id ? "הועתק! ✓" : "העתקה"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
