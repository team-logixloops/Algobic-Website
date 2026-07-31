import * as React from "react";

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
    <section className="mx-auto max-w-[110rem] px-[max(1rem,4vw)]">
      <h2 className="eyebrow text-eyebrow">What this is not</h2>

      <dl className="mt-[clamp(1.5rem,4vw,2.5rem)] grid gap-x-[clamp(2rem,5vw,4rem)] lg:grid-cols-2">
        {REFUSALS.map((item, i) => (
          <div
            key={item.head}
            className="reveal flex flex-col gap-1.5 border-t border-line py-[clamp(1rem,2vw,1.375rem)] sm:flex-row sm:gap-6"
            style={{ "--r": `${2 + i * 2}%` } as React.CSSProperties}
          >
            <dt className="flex shrink-0 items-baseline gap-2.5 sm:w-[13.5rem]">
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
            <dd className="max-w-[46ch] text-[clamp(0.875rem,1.25vw,0.9375rem)] leading-relaxed text-muted">
              {item.body}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
