import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    /* No `changeFrequency`, no `priority`. Verified 2026-07-30: Google ignores
       both, because they are self-reported and every site claims 1.0. `lastmod`
       is the only attribute it acts on, and only while it stays accurate, which
       is why `SITE.updated` is bumped by hand on substantive change rather than
       derived from the build. */
    {
      url: SITE.url,
      lastModified: SITE.updated,
    },
  ];
}
