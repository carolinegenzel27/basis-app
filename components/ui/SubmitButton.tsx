"use client";

import { useFormStatus } from "react-dom";
import { ui } from "@/lib/ui";

export function SubmitButton({
  children,
  pendingText = "רגע...",
}: {
  children: React.ReactNode;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={`${ui.btnPrimary} w-full`}>
      {pending && (
        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden="true" />
      )}
      {pending ? pendingText : children}
    </button>
  );
}
