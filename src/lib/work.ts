/**
 * `/work`: founder-built case studies. Real, but not replicable by a beginner:
 * agentic systems, heavy backend, anything that needs API spend.
 *
 * ⚠️ Empty on purpose, same rule as `builds.ts`. When it is empty the homepage
 * omits the section entirely rather than printing a second "nothing here yet"
 * panel: the hero already carries one, and saying it twice reads as an empty
 * site rather than an honest one.
 */

export type CaseStudy = {
  slug: string;
  title: string;
  oneLine: string;
  shipped: string;
  updated: string;
  stack: readonly string[];
  /** Required. A public URL that spends API credits is never shipped. */
  demoVideo: string;
  liveUrl?: string;
  repoUrl?: string;
  /** INR, real: case studies are not held to the ₹0 rule. */
  cost: number;
  /** The one-line version of where the model was wrong and how it was caught. */
  theCatch: string;
};

export const WORK: readonly CaseStudy[] = [] as const;

export function latestWork(count: number): readonly CaseStudy[] {
  return [...WORK]
    .sort((a, b) => b.shipped.localeCompare(a.shipped))
    .slice(0, count);
}
