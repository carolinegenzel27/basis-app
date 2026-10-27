import type { IconKey } from "@/lib/business-theme";
import {
  Camera,
  Car,
  Coffee,
  Cupcake,
  Dumbbell,
  Megaphone,
  NailPolish,
  Palette,
  PriceTag,
  Scissors,
  Storefront,
} from "@/components/illustrations/BusinessIcons";
import {
  ChartIcon,
  CompassIcon,
  HelmetIcon,
  HouseIcon,
  LaptopIcon,
  ScalesIcon,
} from "@/components/illustrations/ProIcons";

const ICONS: Record<IconKey, (props: { className?: string }) => React.ReactElement> = {
  cupcake: Cupcake,
  coffee: Coffee,
  nailPolish: NailPolish,
  scissors: Scissors,
  camera: Camera,
  dumbbell: Dumbbell,
  palette: Palette,
  car: Car,
  storefront: Storefront,
  priceTag: PriceTag,
  megaphone: Megaphone,
  helmet: HelmetIcon,
  scales: ScalesIcon,
  chart: ChartIcon,
  laptop: LaptopIcon,
  house: HouseIcon,
  compass: CompassIcon,
};

// Renders one of the business illustrations by its theme key. Always
// decorative (aria-hidden) - the text next to it carries the meaning.
export function ThemeIcon({ name, className }: { name: IconKey; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} />;
}
