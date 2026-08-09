import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Every indexable URL, and nothing else.
 *
 * `/join` is the only absent route. It is `noindex`, and a sitemap entry for a
 * page you have told engines to ignore is a contradictory signal: one of the
 * two gets believed and you do not get to choose which. It is **not**
 * disallowed in `robots.txt` either, because a blocked crawl cannot read the
 * `noindex` and the URL can still surface with no description, which is the
 * worst of both.
 *
 * `/privacy` and `/terms` were `noindex` until 2026-08-09 and are now indexed.
 * `website.md` section 2 always recorded that as a preference rather than a
 * rule, and reversible: indexing them is mildly useful as visible proof they
 * exist, and both now carry real, specific, plain-language content rather than
 * boilerplate. `/join` stays out because the reasoning there is different and
 * still holds: it owns no query and it is the wrong first page for somebody
 * arriving cold from a brand search.
 *
 * No `changeFrequency`, no `priority`. Verified 2026-07-30: Google ignores
 * both, because they are self-reported and every site claims 1.0. `lastmod` is
 * the only attribute it acts on, and only while it stays accurate, which is why
 * `SITE.updated` is bumped by hand on substantive change rather than derived
 * from the build.
 *
 * One shared `lastModified` today because these routes shipped together and
 * that is the truth. It stops being the truth the moment one page is edited
 * alone, which is when this file starts reading a per-page date, exactly as
 * `website.md` section 4 requires once builds move to MDX frontmatter. Faking
 * per-page freshness before it exists would poison the one signal we control
 * cheaply.
 */

/** Indexable routes. Adding one here is the only step needed to list it. */
const ROUTES = [
  "",
  "/builds",
  "/start",
  "/tools",
  "/answers",
  "/work",
  "/data",
  "/about",
  "/manifesto",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: SITE.updated,
  }));
}
