import type { Metadata } from "next";
import { SITE } from "@/lib/site";

/**
 * One route, one metadata block, no inheritance surprises.
 *
 * `/builds` learned both traps the hard way and recorded them in its own file.
 * They are worth restating here because this helper exists to make them
 * unrepeatable:
 *
 * 1. Declaring `openGraph` at all replaces the parent's *resolved* block
 *    wholesale. The root layout never sets `openGraph.images`; the image comes
 *    from the `opengraph-image.png` file convention at the app root. So a child
 *    that declares `openGraph` without restating `images` ships with no
 *    `og:image` at all.
 * 2. Omitting `twitter` does not fall back to anything sensible. It inherits
 *    the homepage's title and description verbatim, so every shared link
 *    previews as the landing page.
 *
 * Both are restated on every call below rather than left to the framework.
 *
 * `canonical` is always the path, never inherited. The root layout
 * canonicalises to `/`, and an inherited canonical points ten pages at the
 * homepage, which is the single most expensive metadata bug available here.
 */
export function pageMetadata({
  path,
  title,
  description,
  index = true,
}: {
  /** Leading slash, no trailing slash. `/start`, never `start` or `/start/`. */
  path: string;
  /** The `%s` in the root layout's title template. Not the full title. */
  title: string;
  /** Under 160 characters, and it must describe the page that loads. */
  description: string;
  /**
   * `false` for `/join`, `/privacy` and `/terms`.
   *
   * `follow` stays true in every case: the pages carry real internal links and
   * there is no reason to strand the crawler once it is there. And nothing
   * `noindex` may also be `Disallow`ed in `robots.txt`: a blocked crawl cannot
   * read the `noindex`, so the URL can still surface with no description, which
   * is the worst of both. `robots.ts` allows everything and stays that way.
   */
  index?: boolean;
}): Metadata {
  const url = `${SITE.url}${path}`;
  const full = `${title} | ${SITE.name}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: full,
      description,
      url,
      locale: SITE.locale,
      images: ["/opengraph-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: ["/twitter-image.png"],
    },
    ...(index
      ? {}
      : {
          robots: {
            index: false,
            follow: true,
            googleBot: { index: false, follow: true },
          },
        }),
  };
}
