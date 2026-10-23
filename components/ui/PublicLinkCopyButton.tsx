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

export function PublicLinkCopyButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const origin = useOrigin();

  const url = origin ? `${origin}/p/${slug}` : `/p/${slug}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={`/p/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        dir="ltr"
        className="text-sm text-blue-950 underline truncate"
      >
        {url}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="text-xs text-slate-600 hover:text-blue-800 underline shrink-0"
      >
        {copied ? "הועתק!" : "העתק קישור"}
      </button>
    </div>
  );
}
