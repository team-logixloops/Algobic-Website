import * as React from "react";

/**
 * Three lines: you saw it, you didn't build it, nobody showed you the door.
 *
 * Indent increases down the sequence, so the layout carries the progression
 * instead of a numbered marker. Numbering is reserved for "How it works",
 * where the order is genuinely instructional.
 *
 * The rule colour rotates accent → accent-2 → line, ending quiet.
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
    <section className="mx-auto max-w-[110rem] px-[max(1rem,4vw)]">
      <h2 className="eyebrow text-eyebrow">The gap</h2>

      <div className="mt-[clamp(1.5rem,4vw,2.5rem)] flex flex-col gap-[clamp(1.75rem,4.5vw,3rem)]">
        {LINES.map((line, i) => (
          <div
            key={line.head}
            className={`reveal ${line.indent}`}
            style={{ "--r": `${2 + i * 4}%` } as React.CSSProperties}
          >
            <span
              aria-hidden="true"
              className={`block h-[3px] w-[clamp(2.5rem,8vw,5rem)] ${line.rule}`}
            />
            {/* h3, not p. These are the largest type in the section and they
                head the paragraph under each one, so a reader navigating by
                heading should find them. The eyebrow h2 above names the
                section; these name its three parts. */}
            <h3 className="mt-4 max-w-[24ch] font-display text-display-l text-balance text-foreground">
              {line.head}
            </h3>
            <p className="mt-3 max-w-[52ch] text-[clamp(0.9rem,1.3vw,1rem)] leading-relaxed text-muted">
              {line.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
