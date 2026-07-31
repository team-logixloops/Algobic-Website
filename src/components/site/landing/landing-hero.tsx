import * as React from "react";
import { GlitchField } from "@/components/ui/glitch-field";
import { SITE } from "@/lib/site";

/**
 * Dispersion.
 *
 * One screen, one sentence, set as large as the viewport will carry it. The
 * page is an argument about scale (you scrolled past something small; it could
 * have been something real), so the opening screen is the largest thing on the
 * site by a wide margin and everything after it is quiet by comparison.
 *
 * The sentence breaks by hand. "You could have built that." at this size has
 * exactly one good arrangement, and letting it reflow into two long lines and
 * one orphan wastes the only screen that gets to be loud. Below the breakpoint
 * the spans fall back to natural wrapping.
 *
 * The h1 is the LCP element: plain text, no image, and no entrance animation.
 * It holds still as the one fixed statement while everything else arrives.
 */

/**
 * The shatter row. Widths thin and gaps widen left to right, which is the
 * mark's own dissolve read in reading order. Accent lands on two of the six
 * because the artwork keeps accent shards in the minority.
 */
const SHARDS = [
  { w: "7rem", gap: "0.4rem", accent: false },
  { w: "2.25rem", gap: "0.6rem", accent: true },
  { w: "3.5rem", gap: "0.9rem", accent: false },
  { w: "1rem", gap: "1.4rem", accent: true },
  { w: "1.75rem", gap: "2rem", accent: false },
  { w: "0.625rem", gap: "0", accent: false },
] as const;

export function LandingHero() {
  /* 4.25rem is the sticky header's real height: a 40px control plus its
   * padding. Subtracting a round 4rem left the section four pixels taller than
   * the space under the header, which is exactly enough to clip the last line
   * of the paragraph pinned to its foot.
   *
   * The paragraph is pinned only from lg up. On a phone `justify-between`
   * across a full viewport put four hundred pixels of nothing between the
   * headline and the copy, which reads as a broken layout rather than as space.
   * Below lg the copy follows the shatter row and the screen ends quiet under
   * it.
   */
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4.25rem)] flex-col overflow-hidden lg:justify-between">
      {/* Overscanned top and bottom so the parallax drift never exposes a bare
          edge where the field has slid away from. Clipped by the section. */}
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute top-[-16vh] bottom-[-16vh] left-0 -z-20 w-full"
        style={{ "--parallax": "10vh" } as React.CSSProperties}
      >
        <GlitchField />
      </div>

      <div className="mx-auto w-full max-w-[110rem] px-[max(1rem,4vw)] pt-[clamp(2.5rem,7vw,5rem)]">
        <p className="eyebrow text-eyebrow rise">{SITE.tagline}</p>

        <h1 className="mt-[clamp(1.5rem,4vw,3rem)] font-display text-display-xl text-foreground">
          <span className="block">You could</span>
          <span className="block">have built</span>
          {/* The accent falls on the last word and nowhere else in the
              headline. It is the word the whole page is arguing about. */}
          <span className="block">
            that<span className="text-accent">.</span>
          </span>
        </h1>

        <div
          aria-hidden="true"
          className="mt-[clamp(1.75rem,4vw,3rem)] flex items-center"
        >
          {SHARDS.map((shard, i) => (
            <span
              key={i}
              className={`draw block h-[3px] ${shard.accent ? "bg-accent" : "bg-shard"}`}
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

      {/* Pinned to the foot of the screen rather than following the headline.
          The gap between them is the composition: one enormous statement at the
          top, one quiet paragraph at the bottom, and the shatter field running
          through the space between. */}
      <div className="mx-auto w-full max-w-[110rem] px-[max(1rem,4vw)] pt-[clamp(2.5rem,6vw,5rem)] pb-[clamp(1.5rem,3vw,2.25rem)]">
        <p
          className="rise ml-auto max-w-[42ch] text-[clamp(0.95rem,1.35vw,1.125rem)] leading-relaxed text-foreground lg:text-right"
          style={{ "--d": "380ms" } as React.CSSProperties}
        >
          ALGOBIC is where people build the AI projects they see online. No
          coding background required, and no course to buy. Every build is
          documented end to end: the exact prompts, where it broke, what it
          cost, and a live URL you can open.
        </p>
      </div>
    </section>
  );
}
