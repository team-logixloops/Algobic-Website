import * as React from "react";
import { DrawRule, Parallax } from "@/components/ui/scroll-fx";

/**
 * Three lines: you saw it, you didn't build it, nobody showed you the door.
 *
 * Indent increases down the sequence, so the layout carries the progression
 * instead of a numbered marker. Numbering is reserved for "How it works",
 * where the order is genuinely instructional.
 *
 * The rule colour rotates accent, accent-2, line, ending quiet.
 */
const LINES = [
  {
    head: "You saw it.",
    body: "An app on your feed. Thirty seconds of video. You thought: I could make that.",
    rule: "bg-accent",
    indent: "lg:ml-0",
  },
  /* The figures that used to sit in these two lines moved to "Why now", where
     they are printed with a verification date and, in one case, with the fact
     that nobody has published a method for them. One owner per claim: a number
     asserted here and sourced there teaches the reader that the sourcing is
     decorative. */
  {
    head: "You didn't build it.",
    body: "Not because it's hard. The tools stopped requiring you to be a developer, and nobody mentioned it.",
    rule: "bg-accent-2",
    indent: "lg:ml-[8%]",
  },
  {
    head: "Nobody showed you the door.",
    body: "There are hundreds of platforms and almost nobody standing at the entrance saying: this one, start today.",
    rule: "bg-line",
    indent: "lg:ml-[16%]",
  },
] as const;

export function TheGap() {
  return (
    /* Takes the whole panel and spreads the three statements across it. Set at
       a fixed gap they sat as a clump in the middle of a screen with a void
       above and below; spread, the increasing indent has the full height to
       travel across and the space between them becomes the argument's own
       pacing rather than leftover room. */
    /* Spread on a laptop, grouped on a phone: stacked, the three statements
       already run most of a phone screen, and spreading what is left drives the
       gaps past the point where the three read as one sequence. */
    <div className="flex flex-1 flex-col justify-center gap-[clamp(2rem,5vw,3.5rem)] py-[clamp(1rem,3vw,2.5rem)] lg:justify-between">
      {LINES.map((line, i) => (
        /* Each statement drifts at its own rate, increasing down the sequence,
           so the indent that already carries the progression is reinforced by
           the three of them separating as you pass.

           These used to carry `.reveal` as well, on this same element. A CSS
           animation in its filled state outranks an inline style, so once the
           reveal finished it held `transform: none` and silently overwrote
           every frame GSAP wrote after it: the parallax was dead from the
           moment it became visible. Two things may not own one transform. The
           panel's own arrival is the reveal now. */
        <Parallax
          key={line.head}
          speed={0.1 + i * 0.14}
          className={line.indent}
        >
          {/* The rule draws itself as you arrive at the statement it heads. */}
          <DrawRule
            className={`h-[3px] w-[clamp(2.5rem,8vw,5rem)] ${line.rule}`}
          />
          {/* h3, not p. These are the largest type in the section and they head
              the paragraph under each one, so a reader navigating by heading
              should find them. The panel's eyebrow h2 names the section; these
              name its three parts. */}
          <h3 className="mt-4 max-w-[24ch] font-display text-display-l text-balance text-foreground">
            {line.head}
          </h3>
          <p className="mt-3 max-w-[52ch] text-[clamp(0.9rem,1.3vw,1rem)] leading-relaxed text-muted">
            {line.body}
          </p>
        </Parallax>
      ))}
    </div>
  );
}
