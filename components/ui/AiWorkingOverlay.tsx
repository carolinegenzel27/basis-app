"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Cupcake, Camera, NailPolish, PriceTag, Scissors } from "@/components/illustrations/BusinessIcons";

const ICONS = [PriceTag, Cupcake, NailPolish, Camera, Scissors];

// Full-screen "the AI is working" screen, shown while the surrounding form's
// Server Action is pending. The market search can take up to a minute, so
// instead of a frozen button it cycles through friendly status messages.
// Must be rendered inside the <form> (useFormStatus reads the parent form).
export function AiWorkingOverlay({ title, messages }: { title: string; messages: string[] }) {
  const { pending } = useFormStatus();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!pending) return;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-md px-4"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white border border-ink/[0.08] shadow-lift p-8 text-center space-y-5 animate-fade-up">
        <div className="relative mx-auto w-28 h-28">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-soft via-lilac-soft to-coral-soft animate-pulse" />
          <Icon key={step} className="relative w-28 h-28 p-4 animate-pop-in" />
        </div>
        <h2 className="text-xl font-extrabold tracking-tight text-ink">{title}</h2>
        <p key={message} className="text-ink/65 min-h-[3rem] animate-fade-up">
          {message}
        </p>
        <div className="flex justify-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-ink/70 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
