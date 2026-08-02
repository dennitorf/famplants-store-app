import type { LucideIcon } from "lucide-react";
import {
  Badge,
  BookOpen,
  Bug,
  CalendarDays,
  CheckCircle2,
  Cloud,
  Droplets,
  Flower2,
  Gift,
  Heart,
  HelpCircle,
  Home,
  Leaf,
  Package,
  PawPrint,
  Recycle,
  ShoppingBag,
  Sparkles,
  Sprout,
  Star,
  Store,
  Sun,
  Tag,
  ThumbsUp,
  Tractor,
  TrendingUp,
  Trees,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  agriculture: Tractor,
  "all inbox": Package,
  allinbox: Package,
  award: Badge,
  badge: Badge,
  book: BookOpen,
  bug: Bug,
  calendar: CalendarDays,
  care: Heart,
  cat: PawPrint,
  check: CheckCircle2,
  climate: Cloud,
  cloud: Cloud,
  eco: Leaf,
  favorite: Heart,
  fertilizer: Recycle,
  flower: Flower2,
  garden: Sprout,
  gift: Gift,
  growth: TrendingUp,
  heart: Heart,
  help: HelpCircle,
  home: Home,
  indoor: Home,
  leaf: Leaf,
  light: Sun,
  outdoor: Trees,
  park: Trees,
  paw: PawPrint,
  pest: Bug,
  pet: PawPrint,
  pets: PawPrint,
  plant: Flower2,
  popular: Sparkles,
  rare: Star,
  seasonal: Sun,
  shop: Store,
  "shopping bag": ShoppingBag,
  shoppingbag: ShoppingBag,
  sprout: Sprout,
  star: Star,
  store: Store,
  sun: Sun,
  tag: Tag,
  "thumb up": ThumbsUp,
  thumbup: ThumbsUp,
  tropical: Sun,
  water: Droplets,
  watering: Droplets,
};

function normalizeIconName(value?: string): string {
  return (value || "")
    .trim()
    .toLowerCase()
    .replace(/^icons\./, "")
    .replace(/_(outlined|rounded|sharp|filled)$/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export default function TagIcon({ icon, className }: { icon?: string; className?: string }) {
  const Icon = icons[normalizeIconName(icon)] || Tag;
  return <Icon className={className} aria-hidden="true" />;
}
