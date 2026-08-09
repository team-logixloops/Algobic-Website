/**
 * `/tools`: which one to open first.
 *
 * The highest commercial-intent search real estate available to this site, and
 * the reason is that the existing results are almost entirely vendor blogs
 * ranking for their own comparisons. A vendor cannot write the row that says
 * where their own tool stops.
 *
 * ### Two rules this file follows, both of which cost it obvious content
 *
 * **No prices.** Every one of these companies has changed its pricing at least
 * once in the last year, and a page carrying a stale ₹ figure is worse than a
 * page carrying none: it is checkable, it is wrong, and it is the fastest way
 * to lose a ranking the page earned. The free-tier column states the *shape* of
 * each limit, which is stable, and the page tells the reader to open the
 * pricing page for the number.
 *
 * **No winner.** There is no best AI app builder, there is a best one for the
 * thing you are building tonight, and a roundup that crowns one is a roundup
 * whose author had an affiliate link. The decision list below is the actual
 * deliverable; the table is the evidence under it.
 *
 * Positioning claims here are about product shape rather than about quality
 * rankings, because product shape is checkable and quality rankings are the
 * part that goes stale. Verified against each product's own documentation on
 * 2026-08-09.
 */

export type ToolFact = {
  name: string;
  /** What it is genuinely best at. One clause, no hedging. */
  bestAt: string;
  /** Where it stops. This column is the reason the page exists. */
  stopsAt: string;
  /** The shape of the free tier, never the number. */
  freeTier: string;
  /** Where the company is. Relevant: support hours and payment methods are not universal. */
  base: string;
};

export const TOOL_FACTS: readonly ToolFact[] = [
  {
    name: "Lovable",
    bestAt: "A full app that already looks designed",
    stopsAt: "Heavier backend logic outgrows it faster than the interface does",
    freeTier: "Daily message quota, resets",
    base: "Sweden",
  },
  {
    name: "Bolt",
    bestAt: "Getting to a running full-stack app in one sitting",
    stopsAt: "Visual polish is yours to fix afterwards",
    freeTier: "Daily token allowance, resets",
    base: "United States",
  },
  {
    name: "Replit",
    bestAt: "Building and hosting in the same tab, then editing the real code",
    stopsAt: "Prompt-to-app output needs more correction than Lovable's",
    freeTier: "Free workspaces, always-on hosting is paid",
    base: "United States",
  },
  {
    name: "v0",
    bestAt: "One component or one screen, at a high standard",
    stopsAt: "It is not trying to be a whole app, and it does not host one",
    freeTier: "Monthly credit pool",
    base: "United States",
  },
  {
    name: "Emergent",
    bestAt: "Agentic builds, with Indian support hours and Indian payment rails",
    stopsAt: "Youngest of the five, so the smallest body of public failure reports",
    freeTier: "Trial credits, then paid",
    base: "India",
  },
] as const;

/**
 * The decision, stated as decisions rather than as features.
 *
 * "Use X if" is the format because that is the sentence the reader came for.
 * A feature matrix answers "what do these do"; nobody searching "lovable vs
 * bolt" is asking that. They have already decided to build something and want
 * permission to open one tab.
 */
export const OPEN_THIS_ONE: readonly { tool: string; when: string }[] = [
  {
    tool: "Lovable",
    when: "You want the thing to look right the first time, and it is mostly screens and a database.",
  },
  {
    tool: "Bolt",
    when: "You want it running tonight and you will fix how it looks tomorrow.",
  },
  {
    tool: "Replit",
    when: "You want to open the code the model wrote, change it, and host it in the same place.",
  },
  {
    tool: "v0",
    when: "You already have an app and one screen in it is bad.",
  },
  {
    tool: "Emergent",
    when: "You are paying in ₹, and you want support in your own working hours.",
  },
] as const;

/**
 * The comparison pages live in `tools.ts`, not here.
 *
 * They were briefly duplicated into this file and that is a real bug rather
 * than untidiness: `/preview` reads `tools.ts` through `tools-teaser.tsx`, so
 * two lists would have meant one slug quietly disagreeing with itself across
 * two routes, which is the exact failure the "a published URL never changes"
 * rule exists to prevent. One table, one owner.
 */
export { TOOL_PAGES, type ToolPage } from "@/lib/tools";
