"use client";

import { useEffect, useState } from "react";

// Uses window.location.origin (not an env var) so the link is always correct
// for whatever domain the app is actually running on - localhost while
// developing, the real domain once deployed - with no config needed either way.
// Reading it inside useEffect (not directly during render) avoids a
// server/client hydration mismatch - the server has no "window" to render
// from, so the first client render intentionally matches that (relative
// path), then swaps to the full URL right after mount.
export function PublicLinkCopyButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

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
        className="text-sm text-slate-900 underline truncate"
      >
        {url}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="text-xs text-slate-600 hover:text-slate-900 underline shrink-0"
      >
        {copied ? "הועתק!" : "העתק קישור"}
      </button>
    </div>
  );
}
