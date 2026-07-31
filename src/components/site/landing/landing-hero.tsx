import * as React from "react";
import { GlitchField } from "@/components/ui/glitch-field";
import { SITE } from "@/lib/site";

/**
 * Dispersion.
 *
 * The page is one long assembly: it opens scattered and closes with the mark
 * whole. This is the scattered end, so the shatter field runs live behind it
 * and the composition is deliberately off-axis, headline high and left, answer
 * block low and right, with the shards running between them the way they run
 * off the cat.
 *
 * The h1 is the LCP element: plain text, no image, and no entrance animation.
 * It holds still as the one fixed statement while everything else arrives.
 */

/**
 * The shatter row. Widths thin and gaps widen left to right, which is the
 * mark's own dissolve read in reading order. Accent lands on two of the five
 * because the artwork keeps accent shards in the minority.
 */
const SHARDS = [
  { w: "4rem", gap: "0.35rem", accent: false },
  { w: "1.75rem", gap: "0.5rem", accent: true },
  { w: "2.5rem", gap: "0.75rem", accent: false },
  { w: "0.75rem", gap: "1.1rem", accent: true },
  { w: "1.25rem", gap: "1.6rem", accent: false },
  { w: "0.5rem", gap: "0", accent: false },
] as const;

export function LandingHero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Overscanned top and bottom so the parallax drift never exposes a bare
          edge where the field has slid away from. Clipped by the section. */}
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute top-[-16vh] bottom-[-16vh] left-0 -z-20 w-full"
        style={{ "--parallax": "10vh" } as React.CSSProperties}
      >
        <GlitchField />
      </div>

      <div className="mx-auto max-w-[92rem] px-[max(1rem,4vw)] pt-[clamp(3rem,10vw,6.5rem)] pb-[clamp(2rem,5vw,3.5rem)]">
        <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="eyebrow text-eyebrow rise">{SITE.tagline}</p>

            <h1 className="mt-[clamp(1rem,2.5vw,1.75rem)] max-w-[13ch] font-display text-display-xl text-balance text-foreground">
              You could have built that.
            </h1>

            <div
              aria-hidden="true"
              className="mt-[clamp(1.5rem,3.5vw,2.5rem)] flex items-center"
            >
              {SHARDS.map((shard, i) => (
                <span
                  key={i}
                  className={`draw block h-[2px] ${shard.accent ? "bg-accent" : "bg-shard"}`}
                  style={
                    {
                      width: shard.w,
                      marginRight: shard.gap,
                      "--d": `${140 + i * 60}ms`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          </div>

          {/* Dropped a full display line on desktop so the two columns never
              share a baseline. On phones it simply follows the headline. */}
          <div className="lg:pt-[clamp(3rem,8vw,7rem)]">
            <p
              className="rise max-w-[46ch] text-[clamp(0.95rem,1.4vw,1.0625rem)] leading-relaxed text-foreground"
              style={{ "--d": "380ms" } as React.CSSProperties}
            >
              ALGOBIC is where people build the AI projects they see online. No
              coding background required, and no course to buy. Every build is
              documented end to end: the exact prompts, where it broke, what it
              cost, and a live URL you can open.
            </p>
          </div>
        </div>

        {/* The count, stated rather than hidden.

            Every brand with nothing shipped writes around the zero. Printing it
            at display size is the cheapest possible proof that the numbers on
            this page are not being managed, which is the only reason to believe
            the ones further down. */}
        <div
          className="rise mt-[clamp(2.5rem,7vw,5rem)] flex items-start gap-[clamp(1rem,3vw,2.25rem)] border-t border-line pt-[clamp(1.25rem,3vw,2rem)]"
          style={{ "--d": "700ms" } as React.CSSProperties}
        >
          {/* Mono, not Orbitron. Orbitron's zero is a slashed rectangle that at
              this size reads as a filled black box rather than a digit. It is
              also a count, and the data face owns counts, so this matches the
              figures in "Why now" instead of competing with the headline. */}
          <span
            className="shrink-0 font-mono text-[clamp(2.75rem,7vw,5rem)] leading-[0.85] font-medium tabular-nums text-foreground"
            aria-hidden="true"
          >
            0
          </span>
          <div className="pt-[0.2em]">
            <h2 className="eyebrow text-eyebrow">
              <span className="sr-only">Zero </span>builds published
            </h2>
            <p className="mt-[clamp(0.625rem,1.5vw,0.875rem)] max-w-[48ch] text-[clamp(0.875rem,1.25vw,0.9375rem)] leading-relaxed text-muted">
              A build appears here once it is shipped, reachable and free to
              run. Never before. Nothing on this page is a mockup.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
