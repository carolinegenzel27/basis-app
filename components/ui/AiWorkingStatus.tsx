"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Cupcake, Camera, NailPolish, PriceTag, Scissors } from "@/components/illustrations/BusinessIcons";

const ICONS = [PriceTag, Cupcake, NailPolish, Camera, Scissors];

// "The AI is working" card, shown inline in the page (not over it) while
// the surrounding form's Server Action is pending. The market search can
// take up to a minute, so it cycles through friendly status messages and
// scrolls itself into view. Render it inside the <form>, right by the
// submit button (useFormStatus reads the parent form).
export function AiWorkingStatus({ title, messages }: { title: string; messages: string[] }) {
  const { pending } = useFormStatus();
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pending) return;
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    const timer = setInterval(() => setStep((s) => s + 1), 3500);
    return () => {
      clearInterval(timer);
      setStep(0);
    };
  }, [pending]);

  if (!pending) return null;

  const Icon = ICONS[step % ICONS.length];
  const message = messages[Math.min(step, messages.length - 1)];

  return (
    <div
      ref={ref}
      className="w-full basis-full rounded-2xl border border-blue-200/70 bg-gradient-to-l from-sky-soft/70 via-white to-lilac-soft/60 p-4 sm:p-5 flex items-center gap-4 animate-fade-up"
      role="status"
      aria-live="polite"
    >
      <div className="relative w-14 h-14 shrink-0" aria-hidden="true">
        <div className="absolute inset-0 rounded-full bg-white shadow-card" />
        <span className="absolute inset-0 rounded-full border-2 border-blue-600/20 border-t-blue-600 animate-spin" />
        <Icon key={step} className="relative w-14 h-14 p-2.5 animate-fade-up" />
      </div>
      <div className="min-w-0">
        <p className="font-bold text-ink">{title}</p>
        <p key={message} className="text-sm text-ink/65 animate-fade-up">
          {message}
        </p>
      </div>
    </div>
  );
}
