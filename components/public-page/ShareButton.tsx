"use client";

import { useState } from "react";

// Shares the page with the phone's native share sheet (WhatsApp, Instagram...)
// where available, and falls back to copying the link on desktop. The result
// is announced to screen readers through the aria-live region.
export function ShareButton({ title, className }: { title: string; className?: string }) {
  const [status, setStatus] = useState("");

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus("הקישור הועתק!");
      setTimeout(() => setStatus(""), 2000);
    } catch {
      // The user closed the share sheet - nothing to report.
    }
  }

  return (
    <>
      <button type="button" onClick={handleShare} className={className}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
        {status || "שיתוף העמוד"}
      </button>
      <span className="sr-only" aria-live="polite">
        {status}
      </span>
    </>
  );
}
