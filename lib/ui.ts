// The app's shared design language - one set of class strings for every
// button, field and card, so every screen (welcome, login, onboarding, the
// app itself) looks like the same product. Change a look here, not per page.

export const ui = {
  // Layout
  page: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12",
  pageNarrow: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12",
  card: "rounded-2xl bg-white border border-ink/[0.08] shadow-card",
  cardPad: "p-5 sm:p-7",
  soft: "rounded-2xl bg-ink/[0.03] border border-ink/[0.06]",

  // Text
  h1: "text-2xl sm:text-3xl font-extrabold tracking-tight text-ink",
  h2: "text-lg sm:text-xl font-bold tracking-tight text-ink",
  muted: "text-ink/60",

  // Forms
  label: "block text-sm font-semibold text-ink mb-1.5",
  hint: "text-xs text-ink/55 mt-1.5",
  input:
    "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink/35 shadow-[0_1px_0_rgba(20,18,56,0.03)] focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition",
  file:
    "block w-full text-sm text-ink/70 file:me-3 file:rounded-lg file:border-0 file:bg-ink/[0.06] file:px-4 file:py-2.5 file:text-ink file:font-semibold hover:file:bg-ink/10 file:cursor-pointer",
  error: "text-sm text-red-600",
  success: "text-sm font-medium text-emerald-700",

  // Buttons
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-white font-semibold shadow-sm hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition",
  btnSecondary:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-ink/15 px-5 py-3 text-ink font-semibold hover:bg-ink/[0.03] hover:border-ink/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30 transition",
  btnSmall:
    "inline-flex items-center justify-center gap-1.5 rounded-lg bg-white border border-ink/15 px-3 py-1.5 text-sm text-ink font-semibold hover:bg-ink/[0.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30 transition",
  link: "font-semibold text-blue-700 hover:text-blue-800 hover:underline underline-offset-4",
  linkDanger: "text-sm font-semibold text-red-600 hover:text-red-700 hover:underline underline-offset-4",

  // Selectable chips / option cards
  option:
    "rounded-xl border bg-white px-4 py-3 text-right font-medium transition border-ink/12 hover:border-ink/30",
  optionActive: "rounded-xl border px-4 py-3 text-right font-semibold transition border-blue-600 bg-blue-50 text-ink ring-4 ring-blue-600/10",
} as const;
