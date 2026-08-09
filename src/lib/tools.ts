/**
 * `/tools/[comparison]` pages, from `website.md` section 3.
 *
 * Comparison slugs are **alphabetical**, always: `bolt-vs-lovable`, never
 * `lovable-vs-bolt`. Both orderings are real searches but only one page may
 * exist, so the reverse 301s to the alphabetical slug the day it ships. The
 * title is free to use whichever ordering has more volume; it does not have to
 * match the slug, and below it deliberately does not.
 *
 * ⚠️ None of the six is written. `live` is the same opt-in flag `nav.ts` uses
 * and for the same reason: `/tools` renders every row, and links only the rows
 * that resolve. An unshipped comparison arrives as a dimmed label with no
 * anchor and no place in the tab order, so the index's shape is final today and
 * each page lights up by adding one word here.
 */

export type ToolPage = {
  slug: string;
  /** H1. May reverse the slug's ordering to match search volume. */
  title: string;
  /** What the page settles, in one line. */
  answers: string;
  kind: "comparison" | "review" | "roundup";
  /** Whether the page resolves today. Opt-in: a missing flag under-promises. */
  live?: true;
};

export const TOOL_PAGES: readonly ToolPage[] = [
  {
    slug: "bolt-vs-lovable",
    title: "Lovable vs Bolt",
    answers: "Which one to open first, and what each is bad at.",
    kind: "comparison",
  },
  {
    slug: "lovable-vs-replit",
    title: "Replit vs Lovable",
    answers: "One hosts and one designs. Which matters for your build.",
    kind: "comparison",
  },
  {
    slug: "bolt-vs-v0",
    title: "Bolt vs v0",
    answers: "Full app against a component. Where each stops.",
    kind: "comparison",
  },
  {
    slug: "best-ai-app-builder-india",
    title: "Best AI app builder in India",
    answers: "Priced in ₹, tested on Indian cards and Indian connections.",
    kind: "roundup",
  },
  {
    slug: "free-ai-app-builders",
    title: "Free AI app builders",
    answers: "What the free tier actually gives you before it stops.",
    kind: "roundup",
  },
  {
    slug: "emergent-ai-review",
    title: "Emergent AI review",
    answers: "An Indian builder at a $25M ARR run rate. Worth using or not.",
    kind: "review",
  },
] as const;

export function comparisons(): readonly ToolPage[] {
  return TOOL_PAGES.filter((page) => page.kind === "comparison");
}

/** How many of the six resolve today. Rendered as the honest count on `/tools`. */
export function publishedToolPages(): number {
  return TOOL_PAGES.filter((page) => page.live).length;
}
