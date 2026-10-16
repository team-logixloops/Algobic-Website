import { SITE } from "@/lib/site";

/**
 * The name as people read it on the page: always with its backslash.
 *
 * The mark is `ALGOBIC\`, and the backslash is the brand, not punctuation. A
 * bare "ALGOBIC" in running copy is the name with its signature cut off, so
 * every place a reader sees the name in text renders it through here rather
 * than typing it, and the slash cannot be dropped by a later edit.
 *
 * The slash is `aria-hidden`: a screen reader says the name, not "backslash".
 * It takes `.slash-glyph`, the same accent and display face the slash has in
 * every link on the site.
 *
 * Text only. Structured data and `og:site_name` keep the plain `SITE.name`,
 * because engines match an entity on its exact name and a stray character in
 * it reads as a second brand.
 */
export function BrandName({ legal = false }: { legal?: boolean }) {
  return (
    <span className="whitespace-nowrap">
      {legal ? SITE.legalName : SITE.name}
      <span aria-hidden="true" className="slash-glyph">
        \
      </span>
    </span>
  );
}
