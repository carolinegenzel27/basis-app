"use client";

import { useState } from "react";

type Content = {
  uvp_statement: string | null;
  website_text: string | null;
  linkedin_text: string | null;
  sales_pitch: string | null;
};

const LABELS: Record<keyof Content, string> = {
  uvp_statement: "הצהרת ערך (UVP)",
  website_text: "טקסט לאתר",
  linkedin_text: "טקסט ל-LinkedIn",
  sales_pitch: "פיץ' מכירתי",
};

export function MarketingContentDisplay({ content }: { content: Content }) {
  const [copied, setCopied] = useState<string | null>(null);

  async function handleCopy(key: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-4">
      {(Object.keys(LABELS) as (keyof Content)[]).map((key) => {
        const text = content[key];
        if (!text) return null;
        return (
          <div key={key} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm">{LABELS[key]}</h3>
              <button
                onClick={() => handleCopy(key, text)}
                className="text-xs text-slate-600 hover:text-slate-900 underline"
              >
                {copied === key ? "הועתק!" : "העתק"}
              </button>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-line">{text}</p>
          </div>
        );
      })}
    </div>
  );
}
