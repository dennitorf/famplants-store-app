// Temporary rotation in the supplied order, shared by all visitors.
export const HEADER_TIME_ZONE = "America/New_York";
export const HEADER_IMAGES = [
  { src: "/img/family/fam-8.png", alt: "Family planting together on a sunny day" },
  { src: "/img/family/fam-9.png", alt: "Family potting a plant with their baby nearby" },
  { src: "/img/family/fam-10.png", alt: "Parents and child walking through a garden" },
  { src: "/img/family/fam-14.png", alt: "Family with a newborn walking through a garden" },
  { src: "/img/family/fam-12.png", alt: "Family sitting together in a leafy greenhouse" },
  { src: "/img/family/fam-13.png", alt: "Parents holding their children in a greenhouse" },
  { src: "/img/family/fam-11.png", alt: "Mother holding her baby among greenhouse plants" },
] as const;

export function getDailyHeaderIndex(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: HEADER_TIME_ZONE,
    year: "numeric", month: "numeric", day: "numeric",
  }).formatToParts(date);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  // Calendar dates keep the rotation consistent through daylight saving changes.
  const day = Date.UTC(value("year"), value("month") - 1, value("day"));
  const start = Date.UTC(2026, 10, 24);
  const offset = Math.floor((day - start) / 86_400_000);
  return ((offset % HEADER_IMAGES.length) + HEADER_IMAGES.length) % HEADER_IMAGES.length;
}
