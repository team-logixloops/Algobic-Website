/**
 * The build index.
 *
 * Fields mirror the frontmatter in `website.md` so that when builds move to
 * MDX files nothing has to be remapped, and so the same shape survives the
 * eventual move to a database.
 *
 * ⚠️ This array is empty on purpose. No build has been written yet, and
 * `brand.md` plus `the-bar.md` both make fabricated work terminal for a
 * company whose product is verified work. The homepage renders an honest zero
 * state instead of placeholder rows. One real entry here turns it into an
 * index: no other change needed.
 */

export type Build = {
  slug: string;
  title: string;
  oneLine: string;
  /** ISO date. Drives freshness signals. */
  shipped: string;
  /** ISO date. Bump only on substantive change. */
  updated: string;
  /** Stored in minutes so "3h 20m" is exact rather than rounded. */
  minutes: number;
  tools: readonly string[];
  codeWritten: boolean;
  /** Must stay reachable. A dead URL means the page is pulled or converted. */
  liveUrl: string;
  builder: string;
  /** INR. Must be 0 to qualify as a build page rather than a case study. */
  cost: number;
  difficulty: "first-build" | "second" | "harder";
};

export const BUILDS: readonly Build[] = [] as const;

/** "3h 20m", "45m". */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** "₹0": no decimals, because every build page is free by admission rule. */
export function formatCost(inr: number): string {
  return `₹${inr.toLocaleString("en-IN")}`;
}

/** Newest first. */
export function latestBuilds(count: number): readonly Build[] {
  return [...BUILDS]
    .sort((a, b) => b.shipped.localeCompare(a.shipped))
    .slice(0, count);
}
