"use client";

import { useSyncExternalStore, useState } from "react";

// Uses window.location.origin (not an env var) so the link is always correct
// for whatever domain the app is actually running on - localhost while
// developing, the real domain once deployed - with no config needed either way.
// useSyncExternalStore is React's built-in way to read a browser-only value
// with different server/client snapshots and no hydration mismatch: the
// server snapshot ("") renders the relative path, the client snapshot swaps
// in the real origin right after mount. (Previously this used
// setState-inside-useEffect, which worked but triggered a lint error for
// causing an unnecessary extra render.)
const emptySubscribe = () => () => {};
function useOrigin() {
  return useSyncExternalStore(
    emptySubscribe,
    () => window.location.origin,
    () => ""
  );
}

export function PublicLinkCopyButton({
  slug,
  tone = "dark",
}: {
  slug: string;
  tone?: "dark" | "light";
}) {
  const [copied, setCopied] = useState(false);
  const origin = useOrigin();

  const url = origin ? `${origin}/p/${slug}` : `/p/${slug}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const light = tone === "light";

  return (
    <div className={`flex items-center gap-2 rounded-xl p-1.5 ${light ? "bg-white/10 border border-white/15" : "bg-ink/[0.03] border border-ink/10"}`}>
      <a
        href={`/p/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        dir="ltr"
        className={`flex-1 min-w-0 truncate px-2 text-sm font-medium hover:underline ${light ? "text-white" : "text-ink"}`}
      >
        {url}
        <span className="sr-only"> (נפתח בחלון חדש)</span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30 ${
          light ? "bg-white text-ink hover:bg-sun" : "bg-ink text-white hover:bg-ink-soft"
        }`}
      >
        {copied ? "הועתק! ✓" : "העתקת קישור"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "הקישור הועתק" : ""}
      </span>
    </div>
  );
}
