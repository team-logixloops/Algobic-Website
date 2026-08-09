import { SITE } from "@/lib/site";

/**
 * `/data`: the citable asset.
 *
 * Original measurement is the most-cited content type that exists, and it is
 * the only kind a bigger competitor cannot outrank by being bigger. They can
 * outspend us on volume. They cannot publish our numbers.
 *
 * ### The rule that governs this entire file
 *
 * **Never publish a number we cannot source to our own measurement.** Two
 * invented statistics were already retracted from `website.md` on 2026-07-30,
 * and a `/data` page carrying a fabricated figure would be terminal for the one
 * asset class where credibility is the whole product.
 *
 * So `finding` is optional and absent on all three entries below. A dataset
 * with no finding renders as its method: what will be measured, how, over what
 * sample, starting when, and what would invalidate it. That is genuinely useful
 * to a reader deciding whether to trust the eventual number, and it is the only
 * honest thing this page can say today. The day a measurement lands, `finding`
 * gains one sentence and nothing else on the page changes.
 *
 * Each of the three is produced by work already being done rather than by new
 * work commissioned to fill this page, which is the only reason a solo operator
 * can sustain a research surface at all.
 */

export type Dataset = {
  slug: string;
  title: string;
  /** The question the measurement settles. Present from day one. */
  question: string;
  /**
   * The headline finding, in one sentence.
   *
   * ⚠️ Absent until measured. Never write a placeholder here, never write a
   * rounded guess, and never write a figure copied from somebody else's study:
   * that is what `evidence.ts` is for, and the two files must not blur.
   */
  finding?: string;
  /** How it is measured. Specific enough that somebody could repeat it. */
  method: string;
  /** The sample, stated as a size rather than as an adjective. */
  sample: string;
  /** How often it is re-measured once it starts. */
  cadence: string;
  /** What has to exist before the first measurement is meaningful. */
  blockedBy: string;
  /** Whether `/data/[slug]` resolves today. Opt-in, same rule as `nav.ts`. */
  live?: true;
};

export const DATASETS: readonly Dataset[] = [
  {
    slug: "answer-engine-citations",
    title: "What AI answer engines cite for AI app builder questions",
    question:
      "When somebody asks ChatGPT, Perplexity, Claude or Gemini which AI app builder to use, which sources does the answer come from?",
    method:
      "A fixed set of 20 queries run weekly across four answer engines. Every cited source is logged with its URL, its publisher and the date of the run. Nothing is aggregated across engines: they retrieve differently and averaging them would hide the only interesting variable.",
    sample: "20 queries, 4 engines, weekly",
    cadence: "Run weekly, published monthly",
    blockedBy:
      "Nothing. The loop is already running as an internal check, and publishing it costs one export.",
  },
  {
    slug: "real-cost-of-a-student-build",
    title: "The real ₹ cost of shipping a student project with AI",
    question:
      "What does it actually cost, in rupees, to take one small project from nothing to a live URL that stays up?",
    method:
      "Measured off published build pages rather than estimated. Every build records what was spent to build it and what it costs per month to keep running, including the free-tier limits that keep the second figure at zero and the point at which each tier stops.",
    sample: "Every published build, no exclusions",
    cadence: "Recomputed whenever a build ships or a provider changes a tier",
    blockedBy:
      "Builds. The figure is meaningless below roughly ten of them, and there are none today.",
  },
  {
    slug: "where-ai-coding-tools-fail",
    title: "Where AI coding tools fail, categorised",
    question:
      "When an AI builder gets something wrong, what kind of wrong is it, and how often?",
    method:
      "Aggregated from the 'Where it broke' section of every build page and the 'The Catch' section of every case study, sorted into a failure taxonomy with counts. Every entry keeps a link to the write-up it came from, so any count can be traced back to the specific failure that produced it.",
    sample: "Every documented failure across builds and case studies",
    cadence: "Recomputed on each publish",
    blockedBy:
      "The same thing: no builds and no case studies means no failures to categorise.",
  },
] as const;

/**
 * The published research this site's method rests on.
 *
 * Distinct from `evidence.ts`, which holds market figures the brand is allowed
 * to print. These are studies about how search and answer engines behave, and
 * they are the reason specific decisions elsewhere in this codebase look the
 * way they do: why `sitemap.ts` drops `priority` and `changeFrequency`, why
 * `SITE.updated` is bumped by hand, and why `llms.txt` is kept but not
 * maintained.
 *
 * Every row carries a publisher, a real URL and the date it was verified at
 * source rather than the date it was published. `brand.md`'s rule holds here
 * exactly as it does everywhere else: every claim carries a name, a date or a
 * number. All three, in this case.
 *
 * The outbound links are deliberate and they are `dofollow`. Pages that cite
 * get cited, and a research page that names its sources without linking them is
 * asking the reader to take the citation on trust, which is the one thing this
 * surface exists not to do.
 */
export type PriorWork = {
  publisher: string;
  title: string;
  url: string;
  /** The finding, in one sentence, with its own numbers. */
  finding: string;
  /** Sample size, where the study states one. */
  sample?: string;
  /** When it was checked at source, not when it was published. */
  verified: string;
  /** What this site does differently because of it. */
  soWhat: string;
};

export const PRIOR_WORK: readonly PriorWork[] = [
  {
    publisher: "Ahrefs",
    title: "Do AI assistants prefer to cite fresh content?",
    url: "https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content",
    finding:
      "The average cited URL is 1,064 days old across AI surfaces against 1,432 days in organic Google results, making AI citations 25.7% fresher. ChatGPT is freshest at 958 days. Roughly half of AI citations point at content under 13 weeks old.",
    sample: "16,975,000 cited URLs across six surfaces",
    verified: "30 Jul 2026",
    soWhat:
      "Every page here carries a visible updated date, and that date is bumped by hand on substantive change rather than by the build. The recency window that wins citations is months, not years.",
  },
  {
    publisher: "Ahrefs",
    title: "We analysed 137,000 sites to see if llms.txt does anything",
    url: "https://ahrefs.com/blog/llmstxt-study/",
    finding:
      "97% of llms.txt files received zero traffic in May 2026. Across 500 million AI bot visits over 90 days, 408 targeted llms.txt.",
    sample: "137,000 sites",
    verified: "30 Jul 2026",
    soWhat:
      "This site keeps its llms.txt because coding tools genuinely read it, and spends no maintenance budget on it. Effort that would have gone there goes to off-site corroboration instead.",
  },
  {
    publisher: "Google Search Central",
    title: "Build and submit a sitemap",
    url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
    finding:
      "Google ignores the priority and changeFrequency attributes entirely. lastmod is the only sitemap attribute it acts on, and only while it stays verifiably accurate.",
    verified: "30 Jul 2026",
    soWhat:
      "Our sitemap declares neither. Mechanical date-bumping to fake freshness is the fastest way to make the one signal we control worthless.",
  },
] as const;

/**
 * The cite-us block, in the format a person quoting this actually needs.
 *
 * `website.md` section 3 requires one on every data page, and the reason is
 * mechanical rather than polite: attribution that takes effort does not happen.
 * A block that can be copied verbatim is the difference between being cited by
 * name and being described as "one site".
 */
export function citation(path: string, title: string): string {
  return `${SITE.name}. "${title}". ${SITE.url}${path}. Retrieved ${SITE.updated}.`;
}
