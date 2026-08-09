import { SITE } from "@/lib/site";

/**
 * `<` becomes its unicode escape before a payload is embedded in a script tag.
 *
 * `JSON.stringify` does not sanitise for HTML context, so a value containing
 * `</script>` would close the tag and everything after it would be parsed as
 * markup. Every value fed to this today is authored in this repo, which is
 * exactly the reasoning that stops being true the first time any of it comes
 * from a file or a form.
 *
 * Lives here rather than beside one page because every route now emits
 * structured data and an escape that is only applied in some of them is the
 * same as no escape at all.
 */
export function embedJsonLd(node: object): string {
  return JSON.stringify(node).replace(/</g, "\\u003c");
}

/**
 * The node builders below exist so that `@id` values stay stable forever.
 *
 * `@id` is the join key across every page's schema: the Organization declared
 * once in `layout.tsx` is referenced by `@id` from ten pages, and an answer
 * engine deciding whether ALGOBIC is a real entity is corroborating exactly
 * those references. Hand-writing the strings on each page is how one of them
 * eventually gains a trailing slash and quietly becomes a second entity.
 */

type Node = Record<string, unknown> & { "@id": string };

const ORG = `${SITE.url}/#organization`;
const WEBSITE = `${SITE.url}/#website`;

/**
 * The page itself.
 *
 * `type` widens to the more specific schema.org subtypes where one applies:
 * `CollectionPage` for an index, `AboutPage` for `/about`, `ContactPage` for
 * `/join`. A subtype is only used where it is literally true. A generic page
 * marked up as a `FAQPage` because FAQ markup sounds valuable is the structured
 * data version of a placeholder card.
 */
export function webPageNode({
  path,
  name,
  description,
  type = "WebPage",
}: {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage" | "FAQPage";
}): Node {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${SITE.url}${path}#webpage`,
    /* The root is the one path that has to be normalised. `/` produces a URL
       ending in a slash, and Next resolves the root canonical to the bare
       origin, so leaving it would ship a page whose `url` and whose
       `rel=canonical` disagree by one character. Engines treat those as two
       URLs. The `@id` keeps its slash, because `/#webpage` is the identifier
       every earlier build already emitted and identifiers do not get rewritten
       for tidiness. */
    url: path === "/" ? SITE.url : `${SITE.url}${path}`,
    name,
    description,
    isPartOf: { "@id": WEBSITE },
    about: { "@id": ORG },
    inLanguage: SITE.lang,
    dateModified: SITE.updated,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE.url}/opengraph-image.png`,
    },
    /* The two elements worth reading aloud, and the two an extraction pass
       should take first: the headline and the answer block under it.
       `PageMasthead` stamps `data-answer-block` on that paragraph, so the
       selector is a contract between these two files rather than a guess about
       class names that a refactor would silently break.
       Every page on this site has exactly one of each. */
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-answer-block]"],
    },
  };
}

/**
 * Breadcrumbs, always rooted at the brand.
 *
 * Two levels everywhere on this site, because the URL rules cap paths at two
 * segments. Pass the trail without the root: `breadcrumbNode("/start", [{ name:
 * "Start", path: "/start" }])`.
 */
export function breadcrumbNode(
  path: string,
  trail: readonly { name: string; path: string }[]
): Node {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE.url}${path}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
      ...trail.map((step, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: step.name,
        item: `${SITE.url}${step.path}`,
      })),
    ],
  };
}

/**
 * An ordered list of things this page enumerates.
 *
 * `numberOfItems` is derived from the array rather than passed, so it cannot
 * drift from what the page actually renders. An ItemList claiming entries it
 * does not list is a claim an engine can check in one fetch.
 */
export function itemListNode({
  path,
  name,
  items,
}: {
  path: string;
  name: string;
  items: readonly { name: string; url?: string; description?: string }[];
}): Node {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE.url}${path}#itemlist`,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { url: `${SITE.url}${item.url}` } : {}),
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

/**
 * Question and answer pairs.
 *
 * ⚠️ `FAQPage` rich results were restricted to government and health sites in
 * August 2023 and fully deprecated for every site on 7 May 2026. Budget zero
 * Google SERP lift against this block. It is emitted because answer engines
 * parse it and extract from it cleanly, and because Google states unused
 * structured data causes no problems. No expandable dropdown was built to match
 * it, on purpose: design effort spent shaping markup for a dead rich result is
 * effort spent on nothing.
 *
 * The answers passed in must be the answers on the page, verbatim. Markup that
 * says something the visible page does not is the one structured-data mistake
 * that carries a manual penalty rather than an indifferent shrug.
 */
export function faqNode(
  path: string,
  items: readonly { question: string; answer: string }[]
): Node {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE.url}${path}#faq`,
    inLanguage: SITE.lang,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** A page whose body is prose worth attributing: `/about`, `/manifesto`. */
export function articleNode({
  path,
  headline,
  description,
}: {
  path: string;
  headline: string;
  description: string;
}): Node {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE.url}${path}#article`,
    headline,
    description,
    url: `${SITE.url}${path}`,
    inLanguage: SITE.lang,
    datePublished: SITE.published,
    dateModified: SITE.updated,
    author: { "@id": ORG },
    publisher: { "@id": ORG },
    isPartOf: { "@id": WEBSITE },
    mainEntityOfPage: { "@id": `${SITE.url}${path}#webpage` },
  };
}
