import {
  Blob,
  Camera,
  Coffee,
  Cupcake,
  Dumbbell,
  NailPolish,
  Palette,
  PriceTag,
  Scissors,
  Sparkle,
  Squiggle,
} from "./BusinessIcons";

// Decorative layer that scatters business illustrations all over the page -
// behind the welcome, login, signup and onboarding screens. Purely visual:
// aria-hidden and pointer-events-none, so it never gets in the way of the form.
// `--tilt` gives each floating sticker its own resting angle (see the float
// keyframes in globals.css).
// Positions hug the page edges (some peek in from just off-screen) so the
// stickers frame the content instead of sitting on top of it.
const STICKERS = [
  { Icon: Cupcake, className: "top-[3%] -right-3 w-16 sm:w-20 xl:right-[2%] xl:w-24", tilt: "-8deg", delay: "0s" },
  { Icon: NailPolish, className: "top-[42%] -right-4 w-12 sm:w-16 xl:right-[1%]", tilt: "10deg", delay: "1.2s" },
  { Icon: Scissors, className: "bottom-[4%] -right-2 w-14 sm:w-16 xl:right-[3%]", tilt: "-12deg", delay: "0.6s" },
  { Icon: Camera, className: "top-[3%] -left-3 w-14 sm:w-20 xl:left-[2%]", tilt: "8deg", delay: "0.9s" },
  { Icon: Coffee, className: "top-[46%] -left-4 w-12 sm:w-16 xl:left-[1%]", tilt: "-6deg", delay: "2s" },
  { Icon: Palette, className: "bottom-[4%] -left-2 w-14 sm:w-16 xl:left-[3%]", tilt: "12deg", delay: "1.5s" },
  { Icon: Dumbbell, className: "hidden 2xl:block top-[24%] left-[6%] w-14", tilt: "-14deg", delay: "2.4s" },
  { Icon: PriceTag, className: "hidden 2xl:block bottom-[24%] right-[6%] w-12", tilt: "16deg", delay: "0.3s" },
];

export function IllustratedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <Blob color="#ffe1d6" className="absolute -top-24 -right-24 w-[26rem] opacity-80" />
      <Blob color="#dde9ff" className="absolute -bottom-32 -left-24 w-[30rem] opacity-80" />
      <Blob color="#d4f5e9" className="absolute top-1/3 -left-40 w-[20rem] opacity-60" />
      <Blob color="#ebe4ff" className="absolute bottom-10 -right-32 w-[22rem] opacity-60" />

      {STICKERS.map(({ Icon, className, tilt, delay }, i) => (
        <div
          key={i}
          className={`absolute animate-float opacity-90 ${className}`}
          style={{ "--tilt": tilt, animationDelay: delay } as React.CSSProperties}
        >
          <Icon className="w-full h-auto drop-shadow-sm" />
        </div>
      ))}

      <Sparkle className="absolute top-[26%] right-[3%] w-5 animate-wiggle" />
      <Sparkle className="absolute bottom-[28%] left-[4%] w-5 animate-wiggle" color="#9b7bff" />
      <Sparkle className="hidden xl:block absolute top-[68%] right-[4%] w-4 animate-wiggle" color="#34c79a" />
      <Squiggle className="hidden xl:block absolute top-[30%] left-[2%] w-20 opacity-70" color="#ff7a59" />
      <Squiggle className="hidden xl:block absolute bottom-[14%] right-[2%] w-16 opacity-70" />
    </div>
  );
}
