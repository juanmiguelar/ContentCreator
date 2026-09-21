export const SOCIAL_FORMATS = {
  portrait: { width: 1080, height: 1350, label: "Portrait" },
  square: { width: 1080, height: 1080, label: "Square" },
  story: { width: 1080, height: 1920, label: "Story" },
} as const;
export type SocialFormat = keyof typeof SOCIAL_FORMATS;
export const FORMAT_KEYS = Object.keys(SOCIAL_FORMATS) as SocialFormat[];
export function weekBucket(day: number): 1 | 2 | 3 | 4 {
  if (!Number.isInteger(day) || day < 1 || day > 31)
    throw new Error("Invalid day");
  return Math.min(4, Math.ceil(day / 7)) as 1 | 2 | 3 | 4;
}
export function calendarFromDate(date: string) {
  const parsed = new Date(`${date}T12:00:00Z`);
  if (isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date)
    throw new Error("Invalid date");
  return {
    year: parsed.getUTCFullYear(),
    month: parsed.getUTCMonth() + 1,
    week: weekBucket(parsed.getUTCDate()),
  };
}
export function orderedSlides<T extends { id: string; order: number }>(
  slides: T[],
): T[] {
  if (
    new Set(slides.map((s) => s.id)).size !== slides.length ||
    new Set(slides.map((s) => s.order)).size !== slides.length
  )
    throw new Error("Slide IDs and ordering must be unique");
  return [...slides].sort((a, b) => a.order - b.order);
}
