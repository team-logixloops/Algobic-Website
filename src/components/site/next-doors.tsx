import * as React from "react";
import Link from "next/link";
import { Rise } from "@/components/ui/scroll-fx";

/**
 * The end of a page, which is never the end of the visit.
 *
 * `website.md` section 6: *"No dead ends: every page has an obvious next
 * link."* That is an SXO requirement rather than a design preference. Ranking is
 * not the goal; the click has to survive, and a page that answers its question
 * and then stops is a page that hands the reader back to the search results
 * they came from.
 *
 * Two or three doors, never more, and each one says what is behind it. A row of
 * bare page names is a site map, not an offer, and the reader has no way to
 * choose between them.
 *
 * Deliberately not a CTA. `brand.md` allows one decision per screen and these
 * are the opposite of a decision: they are the cheapest possible continuation,
 * offered without asking for anything. The ask is `SiteCta`, which sits between
 * this and the footer, and the order matters: continuation first for the reader
 * who is still looking, the one action last for the reader who has finished.
 */

export type Door = {
  href: string;
  label: string;
  /** What the reader gets by opening it. One line, concrete. */
  detail: string;
};

export function NextDoors({ doors }: { doors: readonly Door[] }) {
  return (
    <section
      aria-labelledby="next-doors"
      className="mx-auto w-full max-w-[110rem] px-[max(1rem,4vw)] pb-[clamp(3rem,8vw,5.5rem)]"
    >
      <h2 id="next-doors" className="eyebrow text-eyebrow">
        Where next
      </h2>

      <Rise
        stagger={0.08}
        y={26}
        select="[data-door]"
        className="mt-[clamp(1rem,2.5vw,1.5rem)] grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3"
      >
        {doors.map((door) => (
          <Link
            key={door.href}
            href={door.href}
            data-door
            className="slab wipe corner-cut group relative flex min-h-11 flex-col overflow-hidden bg-background px-[clamp(0.875rem,2vw,1.5rem)] py-[clamp(1.125rem,2.75vw,1.75rem)]"
          >
            {/* Same four gestures the rows use, so a door and a row feel like
                one system rather than two hover treatments that happen to
                share a colour. */}
            <span
              aria-hidden="true"
              className="slab__lead absolute top-0 left-0 block h-[3px] w-[clamp(2.5rem,7vw,4.5rem)] bg-accent"
            />

            <span
              aria-hidden="true"
              className="slab__edge absolute top-0 bottom-0 left-0 block w-[3px] bg-accent-2"
            />

            <span className="slab__shift block">
              <span className="flex items-baseline gap-2">
                <span className="font-display text-[clamp(1rem,1.7vw,1.25rem)] leading-tight font-bold text-foreground">
                  {door.label}
                </span>
                <span aria-hidden="true" className="slash-glyph">
                  \
                </span>
              </span>

              <span className="slab__meta mt-2 block max-w-[36ch] font-mono text-micro text-muted">
                {door.detail}
              </span>
            </span>
          </Link>
        ))}
      </Rise>
    </section>
  );
}
