import * as React from "react";
import { Rise } from "@/components/ui/scroll-fx";

/**
 * Straight from `brand.md`'s "What we are not".
 *
 * The densest block on the page, and every row is a real position rather than
 * filler, which is the test the design plan sets for anything dense: delete
 * it and the reader loses a fact.
 */
const REFUSALS = [
  {
    head: "Not a school",
    body: "No courses, no modules, no certificates. AI already teaches better than any instructor, free, at 3am.",
  },
  {
    head: "Not a tool",
    body: "Lovable, Bolt, Replit and Emergent are the tools. We are the layer above: which one, for what, starting how.",
  },
  {
    head: "Not a placement service",
    body: "We never guarantee a job. Guarantees are either lies or refund liabilities.",
  },
  {
    head: "Not for engineers only",
    body: "A commerce student, a designer and a second-year CSE kid get the same promise on the same day.",
  },
  {
    head: "Not motivational",
    body: "No hustle, no grind. Demonstration, not encouragement.",
  },
] as const;

export function WhatThisIsNot() {
  return (
    /* The densest panel, so it is the one that takes its screen by letting the
       rows breathe rather than by growing the type. Five refusals set at reading
       size with air between them is the register this section wants: flat,
       unemphatic, and long enough that the list is the point. */
    <Rise stagger={0.07} y={30} select="[data-row]" className="flex flex-1 flex-col justify-center">
      {/* One column, not two.

          Five items in a two-up grid is three rows and a hole: the last cell is
          empty, the block sits short in the middle of a screen, and the reader
          has to decide whether to read across or down. Five full-width rows fill
          the panel exactly, read in one direction, and give the section the flat
          unemphatic register it is written in. */}
      <dl>
        {REFUSALS.map((item) => (
          <div
            key={item.head}
            data-row
            className="flex flex-col gap-1.5 border-t border-line py-[clamp(1rem,3vw,2.375rem)] sm:flex-row sm:gap-[clamp(1.5rem,4vw,3rem)]"
          >
            <dt className="flex shrink-0 items-baseline gap-2.5 sm:w-[clamp(13.5rem,22vw,20rem)]">
              {/* U+00D7, not the heavier U+2715. Plex Mono serves no
                  unicode-range covering 2715 and neither does the metric
                  fallback, so it dropped to a last-resort font or to tofu. */}
              <span
                aria-hidden="true"
                className="font-mono text-data text-accent-ink"
              >
                ×
              </span>
              <span className="font-display text-[clamp(0.9375rem,1.5vw,1.0625rem)] leading-tight font-bold text-foreground">
                {item.head}
              </span>
            </dt>
            <dd className="max-w-[62ch] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
              {item.body}
            </dd>
          </div>
        ))}
      </dl>
    </Rise>
  );
}
