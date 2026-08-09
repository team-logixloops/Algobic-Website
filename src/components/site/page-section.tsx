import * as React from "react";
import { Seam } from "@/components/ui/seam";

/**
 * A section, its seam, and its heading, in one place.
 *
 * Every interior page is a sequence of these, and the sequence carries an
 * argument the same way the landing page's hinge angle does: `shards` counts
 * down as the page descends, so the dividers lose their shatter on the way to
 * the foot and the last one is a clean line with a single mark on it. It is the
 * cat's dissolve read backwards, spread across a document instead of across an
 * image, and nothing depends on noticing it.
 *
 * ### The rail
 *
 * On a laptop the heading sits in a narrow left column and stays there while
 * its section scrolls past. Two things made that necessary rather than
 * decorative.
 *
 * The first was measured by looking at it: with the heading stacked above the
 * body, every interior page was a narrow column of text pinned to the left of a
 * 1440px viewport with half the page empty beside it. The chrome is 110rem wide
 * because the header and footer need to be, and prose cannot follow it out
 * there without running past a readable measure. The rail spends that width on
 * structure instead, which is what the width was for.
 *
 * The second is that the seam used to carry the section's name as well, so the
 * name appeared twice in eleven pixels of each other: once on the rule, once as
 * the heading directly beneath it. The seam is decoration and `aria-hidden`,
 * the heading is the outline, and only one of them can be the label. The rail
 * took the heading and the seam gave up its copy.
 *
 * `position: sticky` and nothing else. No observer, no ScrollTrigger, no
 * timeline for anything to refresh, and it degrades to a static heading above
 * the content on every viewport below `lg`, which is where this audience is.
 *
 * The heading level is fixed at `h2` and not configurable. One `h1` per page
 * lives in the masthead, sections are its children, and anything sitting under
 * a section uses `h3` in its own markup. A `level` prop is how a heading
 * outline eventually skips from `h2` to `h4` on one page nobody rechecked.
 */
export function PageSection({
  id,
  title,
  lede,
  shards = 2,
  children,
  className = "",
}: {
  /** Anchors the section and names it for assistive technology. Stable forever. */
  id: string;
  title: string;
  /** One or two sentences under the heading. Optional, and usually unnecessary. */
  lede?: React.ReactNode;
  /** 0 to 3. Count it down across the page. */
  shards?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <div className="mx-auto w-full max-w-[110rem] px-[max(1rem,4vw)]">
        {/* No label. The heading below is the one that carries the name. */}
        <Seam shards={shards} />
      </div>

      <section
        id={id}
        aria-labelledby={`${id}-heading`}
        className={`mx-auto w-full max-w-[110rem] px-[max(1rem,4vw)] lg:grid lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] lg:gap-[clamp(2rem,5vw,4.5rem)] ${className}`}
      >
        <div
          /* Clears the sticky header, which is 4.25rem at its tallest. `self-start`
             is what lets a grid child be shorter than its row and therefore
             sticky at all: stretched to the row's height it has nothing to
             stick within. */
          className="lg:sticky lg:top-[clamp(5.25rem,10vw,7rem)] lg:self-start"
        >
          <h2 id={`${id}-heading`} className="eyebrow text-eyebrow">
            {title}
          </h2>

          {/* Closes the rail on the same hairline the seam above is made of, so
              the heading reads as sitting in a column rather than floating in
              the gutter. Laptop only: stacked, the rule would be a stray line
              between a heading and its own paragraph. */}
          <span
            aria-hidden="true"
            className="mt-[clamp(0.625rem,1.4vw,0.875rem)] hidden h-px w-full bg-line lg:block"
          />
        </div>

        <div className="mt-[clamp(1rem,2.5vw,1.5rem)] lg:mt-0">
          {lede ? (
            <p className="mb-[clamp(1.25rem,3vw,2rem)] max-w-[64ch] text-[clamp(1rem,1.4vw,1.125rem)] leading-relaxed text-foreground">
              {lede}
            </p>
          ) : null}

          {children}
        </div>
      </section>
    </>
  );
}
