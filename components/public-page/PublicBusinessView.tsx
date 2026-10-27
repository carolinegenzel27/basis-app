import Link from "next/link";
import { professionLabel } from "@/lib/professions";
import { getBusinessTheme, type BusinessTheme } from "@/lib/business-theme";
import { ThemeIcon } from "@/components/public-page/ThemeIcon";
import { ShareButton } from "@/components/public-page/ShareButton";
import { PatternBackground } from "@/components/public-page/PatternBackground";
import { Blob, Sparkle } from "@/components/illustrations/BusinessIcons";

export type PublicProfile = {
  business_profile_id: string;
  slug: string;
  business_name: string;
  profession: string;
  about_me: string | null;
  experience_text: string | null;
  additional_info: string | null;
  photo_url: string | null;
  uvp_statement: string | null;
  website_text: string | null;
};

export type PublicDocument = {
  id: string;
  file_name: string;
  file_url: string;
};

type ViewProps = {
  profile: PublicProfile;
  imageDocuments: PublicDocument[];
  otherDocuments: PublicDocument[];
};

// The public business page itself - a themed "mini website" whose look
// follows the kind of business (lib/business-theme.ts): a playful,
// illustrated page for a bakery or a nail studio, a clean corporate one
// for a contractor or a lawyer. Split out of app/(public)/p/[slug]/page.tsx
// so the page only does the data loading.
export function PublicBusinessView(props: ViewProps) {
  const professionText = professionLabel(props.profile.profession);
  const theme = getBusinessTheme(professionText, props.profile.slug);

  return theme.style === "professional" ? (
    <ProfessionalBusinessView {...props} theme={theme} professionText={professionText} />
  ) : (
    <PlayfulBusinessView {...props} theme={theme} professionText={professionText} />
  );
}

function themeVars(theme: BusinessTheme) {
  return {
    "--accent": theme.colors.accent,
    "--deep": theme.colors.deep,
    "--soft": theme.colors.soft,
    "--wash": theme.colors.wash,
  } as React.CSSProperties;
}

const SKIP_LINK =
  "sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-50 focus:rounded-full focus:bg-ink focus:text-white focus:px-4 focus:py-2";

function PlayfulBusinessView({
  profile,
  imageDocuments,
  otherDocuments,
  theme,
  professionText,
}: ViewProps & { theme: BusinessTheme; professionText: string }) {
  const [mainIcon, ...sideIcons] = theme.icons;

  const hasStory = !!(profile.website_text || profile.about_me || profile.experience_text);

  return (
    <div
      className="min-h-screen bg-[var(--wash)] text-ink"
      style={themeVars(theme)}
    >
      <a href="#content" className={SKIP_LINK}>
        דילוג לתוכן העמוד
      </a>

      {/* ---------- Hero ---------- */}
      <header className="relative overflow-hidden border-b-2 border-ink/10">
        <PatternBackground pattern={theme.pattern} color={theme.colors.deep} />
        <Blob color={theme.colors.soft} className="absolute -top-32 -left-24 w-[34rem] opacity-90" />
        <Blob color={theme.colors.soft} className="absolute -bottom-40 -right-32 w-[28rem] opacity-70" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20 grid md:grid-cols-[1.3fr_1fr] gap-10 items-center">
          <div className="space-y-5 text-center md:text-right animate-pop-in">
            <p className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-ink px-3 py-1 text-sm font-semibold shadow-[3px_3px_0_var(--deep)]">
              <ThemeIcon name={mainIcon} className="w-6 h-6" />
              {professionText}
            </p>
            <div>
              <p className="text-[var(--deep)] font-semibold text-lg">{theme.tagline}</p>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-ink leading-[1.1] mt-1 break-words">
                {profile.business_name}
              </h1>
            </div>
            {profile.uvp_statement && (
              <p className="text-xl sm:text-2xl text-ink/80 leading-relaxed max-w-xl mx-auto md:mx-0">
                {profile.uvp_statement}
              </p>
            )}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
              <ShareButton
                title={profile.business_name}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--deep)] text-white font-bold px-6 py-3 border-2 border-ink shadow-[4px_4px_0_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#1e1b4b] transition focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--deep)]"
              />
              {profile.additional_info && (
                <a
                  href="#contact"
                  className="inline-flex items-center rounded-full bg-white font-bold px-6 py-3 border-2 border-ink hover:bg-[var(--soft)] transition focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--deep)]"
                >
                  יצירת קשר
                </a>
              )}
            </div>
          </div>

          {/* Photo (or the business's illustration) in a playful tilted frame */}
          <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 animate-pop-in">
            <div className="absolute inset-0 rounded-[2.5rem] bg-[var(--accent)] rotate-6 border-2 border-ink" aria-hidden="true" />
            <div className="absolute inset-0 rounded-[2.5rem] bg-[var(--soft)] -rotate-3 border-2 border-ink overflow-hidden shadow-[6px_6px_0_#1e1b4b] flex items-center justify-center">
              {profile.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.photo_url}
                  alt={`תמונה של ${profile.business_name}`}
                  className="w-full h-full object-cover rotate-3 scale-110"
                />
              ) : (
                <ThemeIcon name={mainIcon} className="w-40 h-40 sm:w-48 sm:h-48 rotate-3" />
              )}
            </div>
            {sideIcons.map((icon, i) => (
              <div
                key={icon}
                className={`absolute w-16 sm:w-20 animate-float ${i === 0 ? "-top-6 -left-6" : "-bottom-6 -right-4"}`}
                style={{ "--tilt": i === 0 ? "-12deg" : "10deg", animationDelay: `${i * 1.3}s` } as React.CSSProperties}
                aria-hidden="true"
              >
                <ThemeIcon name={icon} className="w-full h-auto drop-shadow" />
              </div>
            ))}
            <Sparkle className="absolute top-2 -right-6 w-8 animate-wiggle" color={theme.colors.accent} />
          </div>
        </div>
      </header>

      <main id="content" className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-12">
        {/* ---------- Story ---------- */}
        {hasStory && (
          <div className="grid md:grid-cols-2 gap-6">
            {profile.website_text && (
              <section aria-labelledby="about-business" className="md:col-span-2 relative rounded-3xl bg-white border-2 border-ink p-6 sm:p-8 shadow-[6px_6px_0_var(--deep)]">
                <h2 id="about-business" className="flex items-center gap-3 text-2xl font-extrabold">
                  <span className="w-12 h-12 rounded-2xl bg-[var(--soft)] flex items-center justify-center shrink-0" aria-hidden="true">
                    <ThemeIcon name={mainIcon} className="w-9 h-9" />
                  </span>
                  על העסק
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-ink/85 whitespace-pre-line">{profile.website_text}</p>
              </section>
            )}

            {profile.about_me && (
              <section aria-labelledby="about-me" className={`rounded-3xl bg-[var(--soft)] border-2 border-ink/10 p-6 sm:p-8 ${profile.experience_text ? "" : "md:col-span-2"}`}>
                <h2 id="about-me" className="text-xl font-extrabold text-[var(--deep)]">
                  👋 קצת עליי
                </h2>
                <p className="mt-3 leading-relaxed text-ink/85 whitespace-pre-line">{profile.about_me}</p>
              </section>
            )}

            {profile.experience_text && (
              <section aria-labelledby="experience" className={`rounded-3xl bg-white border-2 border-ink/10 p-6 sm:p-8 ${profile.about_me ? "" : "md:col-span-2"}`}>
                <h2 id="experience" className="text-xl font-extrabold text-[var(--deep)]">
                  ⭐ ניסיון
                </h2>
                <p className="mt-3 leading-relaxed text-ink/85 whitespace-pre-line">{profile.experience_text}</p>
              </section>
            )}
          </div>
        )}

        {/* ---------- Gallery ---------- */}
        {imageDocuments.length > 0 && (
          <section aria-labelledby="gallery">
            <h2 id="gallery" className="text-2xl font-extrabold mb-5 flex items-center gap-2">
              <Sparkle className="w-6" color={theme.colors.accent} />
              {theme.labels.gallery}
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {imageDocuments.map((doc, i) => (
                <li key={doc.id} className={i % 5 === 0 ? "sm:row-span-2" : ""}>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full min-h-40 rounded-2xl overflow-hidden border-2 border-ink bg-[var(--soft)] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--deep)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={doc.file_url}
                      alt={`תמונה ${i + 1} מתוך ${imageDocuments.length} של ${profile.business_name}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span className="sr-only"> (נפתח בחלון חדש)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Documents ---------- */}
        {otherDocuments.length > 0 && (
          <section aria-labelledby="documents">
            <h2 id="documents" className="text-2xl font-extrabold mb-5">{theme.labels.documents}</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {otherDocuments.map((doc) => (
                <li key={doc.id}>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-2xl bg-white border-2 border-ink/10 p-4 hover:border-ink transition focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--deep)]"
                  >
                    <span className="w-12 h-12 rounded-xl bg-[var(--soft)] text-[var(--deep)] flex items-center justify-center shrink-0 font-extrabold text-xs" aria-hidden="true">
                      {doc.file_name.split(".").pop()?.toUpperCase() ?? "FILE"}
                    </span>
                    <span className="flex-1 min-w-0">
                      {/* Extension is already in the badge - and dropping it avoids
                          "2026.pdf" flipping to "pdf.2026" inside Hebrew text. */}
                      <span className="block font-semibold truncate">
                        {doc.file_name.replace(/\.[^.]+$/, "")}
                      </span>
                      <span className="block text-sm text-[var(--deep)] font-medium">
                        פתיחה והורדה<span className="sr-only"> (נפתח בחלון חדש)</span>
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Contact ---------- */}
        {profile.additional_info && (
          <section
            id="contact"
            aria-labelledby="contact-title"
            className="relative overflow-hidden rounded-[2rem] bg-[var(--deep)] text-white p-8 sm:p-10 scroll-mt-6"
          >
            <div className="hidden sm:block absolute -left-6 -bottom-6 w-32 opacity-90 rotate-12" aria-hidden="true">
              <ThemeIcon name={sideIcons[0] ?? mainIcon} className="w-full h-auto" />
            </div>
            <h2 id="contact-title" className="text-2xl sm:text-3xl font-extrabold">
              {theme.labels.contact}
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-white/90 whitespace-pre-line max-w-2xl sm:pl-28">
              {profile.additional_info}
            </p>
          </section>
        )}
      </main>

      <footer className="text-center pb-10 px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink rounded-full px-3 py-1 focus-visible:outline-2 focus-visible:outline-[var(--deep)]"
        >
          העמוד נבנה עם <span className="font-extrabold text-blue-950">Basis<span className="text-coral">.</span></span>
        </Link>
      </footer>
    </div>
  );
}

// Corporate look for serious businesses (contractor, lawyer, accountant...):
// a solid dark header with a faint blueprint grid, line icons, numbered
// sections, straight edges - no stickers, tilts, emoji or floating shapes.
function ProfessionalBusinessView({
  profile,
  imageDocuments,
  otherDocuments,
  theme,
  professionText,
}: ViewProps & { theme: BusinessTheme; professionText: string }) {
  const icon = theme.icons[0];
  const focusRing =
    "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]";

  // Only the sections that have content get a number, so they always read
  // 01, 02, 03... in order.
  const sections = [
    profile.website_text && { id: "about", title: "אודות", text: profile.website_text },
    profile.about_me && { id: "about-me", title: "קצת עליי", text: profile.about_me },
    profile.experience_text && { id: "experience", title: "ניסיון מקצועי", text: profile.experience_text },
  ].filter(Boolean) as { id: string; title: string; text: string }[];
  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-white text-slate-900" style={themeVars(theme)}>
      <a href="#content" className={SKIP_LINK}>
        דילוג לתוכן העמוד
      </a>

      {/* ---------- Top bar ---------- */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-md bg-[var(--deep)] text-[var(--accent)] flex items-center justify-center shrink-0" aria-hidden="true">
              <ThemeIcon name={icon} className="w-6 h-6" />
            </span>
            <span className="font-bold truncate">{profile.business_name}</span>
          </div>
          {profile.additional_info && (
            <a
              href="#contact"
              className={`shrink-0 rounded-md bg-[var(--accent)] text-[var(--deep)] font-bold text-sm px-4 py-2 hover:brightness-95 transition ${focusRing}`}
            >
              יצירת קשר
            </a>
          )}
        </div>
      </div>

      {/* ---------- Hero ---------- */}
      <header className="relative overflow-hidden bg-[var(--deep)] text-white">
        {/* faint blueprint grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" aria-hidden="true">
          <defs>
            <pattern id="pro-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0 L0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pro-grid)" />
        </svg>
        <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-white/5 to-transparent" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 grid md:grid-cols-[1.4fr_1fr] gap-12 items-center">
          <div className="space-y-6">
            <p className="flex items-center gap-3 text-[var(--accent)] font-semibold tracking-wide">
              <span className="w-10 h-0.5 bg-[var(--accent)]" aria-hidden="true" />
              {professionText}
            </p>
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.1] break-words">
              {profile.business_name}
            </h1>
            <p className="text-xl sm:text-2xl text-white/85 leading-relaxed max-w-2xl">
              {profile.uvp_statement ?? theme.tagline}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {profile.additional_info && (
                <a
                  href="#contact"
                  className={`inline-flex items-center rounded-md bg-[var(--accent)] text-[var(--deep)] font-bold px-6 py-3 hover:brightness-95 transition ${focusRing}`}
                >
                  לתיאום שיחה
                </a>
              )}
              <ShareButton
                title={profile.business_name}
                className={`inline-flex items-center gap-2 rounded-md border border-white/40 text-white font-semibold px-6 py-3 hover:bg-white/10 transition ${focusRing}`}
              />
            </div>
          </div>

          <div className="relative mx-auto w-64 h-72 sm:w-80 sm:h-96">
            <div className="absolute inset-0 translate-x-4 translate-y-4 border-2 border-[var(--accent)] rounded-md" aria-hidden="true" />
            <div className="absolute inset-0 rounded-md overflow-hidden bg-white/5 border border-white/15 flex items-center justify-center">
              {profile.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photo_url} alt={`תמונה של ${profile.business_name}`} className="w-full h-full object-cover" />
              ) : (
                <ThemeIcon name={icon} className="w-32 h-32 text-[var(--accent)]" />
              )}
            </div>
          </div>
        </div>
      </header>

      <main id="content" className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-20 space-y-16">
        {/* ---------- Text sections ---------- */}
        {sections.map((section) => (
          <section
            key={section.id}
            aria-labelledby={section.id}
            className="grid md:grid-cols-[240px_1fr] gap-4 md:gap-12 border-t border-slate-200 pt-10"
          >
            <h2 id={section.id} className="text-2xl font-bold">
              <span className="block text-sm font-semibold text-slate-500 mb-1" aria-hidden="true">
                {num()}
              </span>
              {section.title}
            </h2>
            <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-line max-w-3xl">{section.text}</p>
          </section>
        ))}

        {/* ---------- Gallery ---------- */}
        {imageDocuments.length > 0 && (
          <section aria-labelledby="gallery" className="border-t border-slate-200 pt-10 space-y-6">
            <h2 id="gallery" className="text-2xl font-bold">
              <span className="block text-sm font-semibold text-slate-500 mb-1" aria-hidden="true">
                {num()}
              </span>
              {theme.labels.gallery}
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imageDocuments.map((doc, i) => (
                <li key={doc.id}>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group block aspect-[4/3] rounded-md overflow-hidden bg-slate-100 border border-slate-200 ${focusRing}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={doc.file_url}
                      alt={`${theme.labels.gallery} - תמונה ${i + 1} מתוך ${imageDocuments.length}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                    <span className="sr-only"> (נפתח בחלון חדש)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Documents ---------- */}
        {otherDocuments.length > 0 && (
          <section aria-labelledby="documents" className="border-t border-slate-200 pt-10 space-y-6">
            <h2 id="documents" className="text-2xl font-bold">
              <span className="block text-sm font-semibold text-slate-500 mb-1" aria-hidden="true">
                {num()}
              </span>
              {theme.labels.documents}
            </h2>
            <ul className="divide-y divide-slate-200 border-y border-slate-200">
              {otherDocuments.map((doc) => (
                <li key={doc.id}>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 py-4 px-2 hover:bg-slate-50 transition ${focusRing}`}
                  >
                    <span className="w-12 text-xs font-bold text-slate-500 border border-slate-300 rounded px-1.5 py-1 text-center shrink-0" aria-hidden="true">
                      {doc.file_name.split(".").pop()?.toUpperCase() ?? "FILE"}
                    </span>
                    <span className="flex-1 min-w-0 font-semibold truncate">
                      {doc.file_name.replace(/\.[^.]+$/, "")}
                    </span>
                    <span className="text-sm font-semibold text-slate-600 shrink-0">
                      הורדה ←<span className="sr-only"> (נפתח בחלון חדש)</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Contact ---------- */}
        {profile.additional_info && (
          <section
            id="contact"
            aria-labelledby="contact-title"
            className="relative rounded-md bg-[var(--deep)] text-white p-8 sm:p-12 scroll-mt-6 border-r-8 border-[var(--accent)]"
          >
            <h2 id="contact-title" className="text-2xl sm:text-3xl font-bold">
              {theme.labels.contact}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/90 whitespace-pre-line max-w-2xl">
              {profile.additional_info}
            </p>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-200 py-8 px-4 text-center">
        <Link
          href="/"
          className={`text-sm text-slate-500 hover:text-slate-900 rounded px-2 py-1 ${focusRing}`}
        >
          העמוד נבנה עם <span className="font-bold text-slate-900">Basis</span>
        </Link>
      </footer>
    </div>
  );
}
