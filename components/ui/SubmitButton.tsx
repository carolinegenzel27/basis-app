"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingText = "רגע...",
}: {
  children: React.ReactNode;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-blue-800 px-4 py-2.5 text-white font-semibold shadow-[0_3px_0_#1e1b4b] hover:bg-blue-900 active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {pending ? pendingText : children}
    </button>
  );
}
