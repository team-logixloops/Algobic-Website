/**
 * Single source of truth for the canonical URL and the copy that search
 * engines, AI answer engines and social cards all read.
 *
 * Set NEXT_PUBLIC_SITE_URL in the deploy environment if the domain differs.
 *
 * The default is the www host on purpose: Vercel serves www and 308s the apex
 * to it, so canonicals, og:url, the sitemap and the schema @ids all have to
 * name www or every URL we declare points at a redirect.
 */
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.algobic.in").replace(
    /\/$/,
    ""
  ),
  name: "ALGOBIC",
  legalName: "Algobic",
  parent: "LogixLoops",
  tagline: "Build Before They Do",
  title: "ALGOBIC: Build Before They Do",
  /**
   * Meta description, kept under 160 characters.
   *
   * Rewritten 2026-07-31 to match the page. The previous copy was the
   * pre-D-007 employability framing ("the job market changed, education
   * didn't"), which `decisions.md` D-007 superseded on 2026-07-30 and which the
   * homepage no longer says. A snippet describing a different site than the one
   * that loads is a bounce, not a click.
   */
  description:
    "ALGOBIC is where people build the AI projects they see online. No coding background, no course. Every build documented end to end, with a live URL.",
  /** Long form, for structured data and answer engines. */
  about:
    "ALGOBIC is where people build the AI projects they see online. The tools solved capability; nobody solved activation. No degree, no coding background and no course to buy: you arrive with something you saw and you leave with a thing that exists. Every build is documented end to end, from the exact prompts through where it broke to what it cost and a live URL anyone can open. ALGOBIC is not a school, not a tool and not a placement service.",
  shortDescription:
    "Where people build the AI projects they see online. No coding background required. Every build documented end to end, with a live URL.",
  manifesto: [
    "The job market changed. Education didn't.",
    "Most students graduate. Very few builders do.",
    "The internet doesn't care about your CGPA.",
    "Companies don't hire notes.",
    "Ideas don't matter. Certificates don't matter.",
    "What matters is what you've shipped.",
  ],
  instagram: "https://www.instagram.com/algobic.in?igsh=cWlsZXNtZDJmOW1v",
  instagramHandle: "algobic.in",
  locale: "en_IN",
  /**
   * BCP 47 tag for `<html lang>` and schema `inLanguage`, which both want
   * hyphens, unlike Open Graph's `locale`, which wants the underscore form.
   * Regionalised on purpose: audience, use cases and domain are all Indian.
   */
  lang: "en-IN",
  /**
   * Date the page content last actually changed. Bump it by hand when it does.
   * A build-time `new Date()` here would change on every deploy and every
   * request, which is exactly the churn that makes crawlers ignore lastmod.
   *
   * Bumped 2026-08-09: ten routes shipped, which is a substantive change by any
   * reading. Mechanical bumping to fake freshness is what makes the signal
   * worthless, and it is worth the reminder that this is the one date the whole
   * site's `lastmod` and `dateModified` derive from.
   */
  updated: "2026-08-09",
  /**
   * The domain registered with the analytics provider.
   *
   * Plausible keys stats to this string and it has to match the site created in
   * their dashboard exactly, apex form, no `www` and no scheme. If it does not
   * match, the script loads, posts, and is discarded silently, which is the
   * worst failure mode available: everything looks correct and no data arrives.
   *
   * Derived from `url` rather than typed twice, so changing the domain cannot
   * leave analytics pointing at the old one.
   */
  analyticsDomain: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.algobic.in")
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, ""),
  /**
   * First publication. Fixed, and it does not move.
   *
   * `Article` schema wants `datePublished` alongside `dateModified`, and the
   * pair is only a freshness signal while the first half stays honest. A page
   * whose published date advances with its updated date is a page claiming to
   * be new every time it is edited.
   */
  published: "2026-07-31",
} as const;

/**
 * "31 Jul 2026". The visible freshness date every page carries.
 *
 * Pinned to UTC on both sides: parsing a bare ISO date as local time lands on
 * the previous day west of Greenwich, and formatting in the viewer's zone would
 * then disagree with the `datetime` attribute sitting next to it.
 */
export function formatUpdated(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
