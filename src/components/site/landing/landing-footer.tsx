import { formatUpdated, SITE } from "@/lib/site";

/**
 * A colophon, not a sitemap.
 *
 * The page has already resolved by the time anyone reaches this: the mark is
 * whole and the one action has been offered. Repeating the action here would
 * make it read as two decisions, and there is nothing else to link to yet. So
 * this carries the two facts a published page owes a reader and stops.
 *
 * The date is one of them. `website.md`: never publish an undated page.
 */
export function LandingFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[110rem] flex-col gap-2 px-[max(1rem,4vw)] py-[clamp(1.5rem,4vw,2.25rem)] font-mono text-micro text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {SITE.legalName}, a {SITE.parent} company
        </p>
        <p>
          Updated{" "}
          <time dateTime={SITE.updated}>{formatUpdated(SITE.updated)}</time>
        </p>
      </div>
    </footer>
  );
}
