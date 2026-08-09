import * as React from "react";
import { Rise } from "@/components/ui/scroll-fx";

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
    /* The path takes the whole panel. The rule runs across the top of the
       screen with the three numbers standing on it and the three answers at the
       foot, so the distance between asking and answering is the height of the
       screen. Sized to its content it was three small cards floating in the
       middle of a void, which is the shape this section was specifically drawn
       not to be. */
    <Rise stagger={0.12} y={38} select="[data-step]" className="flex flex-1 flex-col justify-center">
      {/* `flex-1` only where the steps are three columns standing on one rule.
          Stacked below `sm` the same class makes three equal rows out of the
          screen, and since each step's content is top-aligned and the path that
          would fill the rest is hidden at this width, every row ends in its own
          block of nothing. Stacked, the list takes the height it needs and the
          wrapper centres it. */}
      <ol className="grid gap-x-[clamp(1.5rem,4vw,3.5rem)] sm:flex-1 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <li
            key={step.n}
            data-step
            className="relative flex flex-col border-t border-line pt-[clamp(1.25rem,2.5vw,1.75rem)] pb-[clamp(1.5rem,3vw,2rem)]"
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

            {/* Set at screen scale rather than at caption scale. This panel is
                a whole screen and the step number is the only thing standing on
                the rule at the top of it; at 13px it read as a footnote to an
                empty column. In muted rather than the accent, so three of them
                do not compete with the one enormous digit two screens up. */}
            <span className="flex items-baseline gap-[clamp(0.5rem,1.2vw,0.875rem)]">
              <span className="font-mono text-[clamp(1.75rem,3.6vw,3rem)] leading-none tabular-nums text-muted">
                {step.n}
              </span>
              <span
                aria-hidden="true"
                className="block h-[clamp(0.75rem,1.6vw,0.9375rem)] w-[1.5px] bg-accent"
                style={{ transform: "skewX(calc(-1 * var(--slash-angle)))" }}
              />
            </span>

            {/* The path. A hairline descending from the step to its outcome,
                drawn on scroll, leaning on the slash.

                This space used to be five hundred pixels of nothing, which is
                what "the answer is at the foot of the screen" looks like when
                nothing occupies the distance. The section is called how it
                works and the distance between doing a thing and having done it
                is the subject, so the distance gets drawn. */}
            <span
              aria-hidden="true"
              /* Only where the steps are three tall columns. Stacked on a phone
                 each step is a short row, so the path came out as a 55px stub
                 between the number and its heading, which reads as a stray mark
                 rather than as a distance travelled. Below `sm` the rule at the
                 top of each step already carries the sequence. */
              className="draw-scroll-y my-[clamp(1rem,2.5vw,1.75rem)] hidden w-[1.5px] flex-1 bg-line sm:block"
              style={{
                /* Repeated from the keyframe so a browser without
                   `animation-timeline` still gets a leaning path rather than a
                   plumb line. The animation outranks this the moment it runs. */
                transform: "skewX(var(--slash-angle))",
                "--r": `${i * 5}%`,
                "--r-end": `${30 + i * 10}%`,
              } as React.CSSProperties}
            />

            {/* The answer sits on the floor of the screen, at the foot of the
                path that leads to it. */}
            <div>
              <h3 className="font-display text-[clamp(1.25rem,2.8vw,2.125rem)] leading-tight font-bold text-balance text-foreground">
                {step.head}
              </h3>
              <p className="mt-[clamp(0.625rem,1.4vw,1rem)] max-w-[32ch] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Rise>
  );
}
