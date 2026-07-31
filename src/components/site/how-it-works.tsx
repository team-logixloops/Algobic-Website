import * as React from "react";

/**
 * The only numbered thing on the page.
 *
 * Numbering is legitimate here because the order carries information the reader
 * needs: you cannot follow the path before picking the thing. It appears
 * nowhere else, so it stays meaningful.
 *
 * Drawn as a path rather than as three cards. A bordered three-up grid is the
 * one shape on this page that could have come off any SaaS template, and the
 * section is called "how it works", so the layout may as well be the thing it
 * describes: one continuous rule with a step standing on it at each stop. The
 * rule is assembled from the steps' own top borders, so it survives the stack
 * to a single column on a phone, where it becomes a vertical path instead of a
 * horizontal one.
 *
 * The accent leader under each border draws in on scroll, left to right, in
 * sequence. Same `.draw` vocabulary as the seam and the hero's shatter row.
 */
const STEPS = [
  {
    n: "01",
    head: "Pick a thing",
    body: "One you actually saw somewhere. Not an idea from a list.",
  },
  {
    n: "02",
    head: "Follow the path",
    body: "Every step, every prompt, and every break, written down before you hit it.",
  },
  {
    n: "03",
    head: "Ship it public",
    body: "A live URL with your name on it. Public, or it didn't happen.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-[92rem] px-[max(1rem,4vw)]">
      <h2 className="eyebrow text-eyebrow">How it works</h2>

      <ol className="mt-[clamp(1.75rem,4.5vw,3rem)] grid gap-x-[clamp(1.5rem,4vw,3.5rem)] sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <li
            key={step.n}
            className="reveal relative border-t border-line pt-[clamp(1.25rem,2.5vw,1.75rem)] pb-[clamp(1.5rem,3vw,2rem)]"
            style={{ "--r": `${2 + i * 3}%` } as React.CSSProperties}
          >
            {/* `-top-px`, not `top-0`. An absolutely positioned child resolves
                against the padding box, which starts below the 1px border, so
                `top-0` sat the leader one pixel under the rule instead of on
                it. The offset covers the border exactly.

                `--r` staggers the draw. The three items share a grid row and
                therefore identical geometry, so without it they derive the same
                view() progress and draw in lockstep, which is not what a path
                does. */}
            <span
              aria-hidden="true"
              className="draw-scroll absolute -top-px left-0 block h-[3px] w-[clamp(2rem,5vw,3.5rem)] origin-left bg-accent"
              style={{ "--r": `${i * 6}%`, "--r-end": `${20 + i * 8}%` } as React.CSSProperties}
            />

            <span className="flex items-center gap-2.5">
              <span className="font-mono text-data tabular-nums text-accent-ink">
                {step.n}
              </span>
              <span
                aria-hidden="true"
                className="block h-[clamp(0.75rem,1.6vw,0.9375rem)] w-[1.5px] bg-accent"
                style={{ transform: "skewX(calc(-1 * var(--slash-angle)))" }}
              />
            </span>

            <h3 className="mt-[clamp(0.75rem,1.8vw,1.125rem)] font-display text-[clamp(1.125rem,2.2vw,1.625rem)] leading-tight font-bold text-balance text-foreground">
              {step.head}
            </h3>
            <p className="mt-[clamp(0.5rem,1.2vw,0.75rem)] max-w-[32ch] text-[clamp(0.875rem,1.25vw,0.9375rem)] leading-relaxed text-muted">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
