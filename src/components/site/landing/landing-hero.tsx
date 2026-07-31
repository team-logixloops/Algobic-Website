import * as React from "react";
import { Parallax } from "@/components/ui/scroll-fx";
import { ShatterGL } from "@/components/ui/shatter-gl";
import { SplitHeadline } from "@/components/ui/split-headline";
import { SITE } from "@/lib/site";

/**
 * Dispersion.
 *
 * One screen, one sentence, set as large as the viewport will carry it, over a
 * shader that tears where the pointer goes and shears with scroll speed. The
 * page is an argument about scale, so the opening screen is the largest thing
 * on the site by a wide margin and everything after it is quiet by comparison.
 *
 * Three layers moving at three rates, which is the whole depth budget: the
 * field dissolves as the hero leaves, the headline drifts slowest, the eyebrow
 * and the paragraph drift fastest. Nothing here scales or rotates. The mark is
 * built from horizontal bars and one diagonal, so vertical travel is the only
 * motion the page is allowed.
 */

/** The sentence, broken by hand. At 190px there is one good arrangement. */
const HEADLINE = [
  { text: "You could" },
  { text: "have built" },
  /* The accent falls on the full stop and nowhere else in the headline. It is
     the word the whole page is arguing about, and the mark's own accent is a
     single punctuation-sized mark, so this is the logo's gesture at type scale. */
  { text: "that", accentSuffix: "." },
] as const;

/**
 * The shatter row. Widths thin and gaps widen left to right, which is the
 * mark's own dissolve read in reading order.
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
   */
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4.25rem)] flex-col overflow-hidden lg:justify-between">
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <ShatterGL />
      </div>

      <div className="mx-auto w-full max-w-[110rem] px-[max(1rem,4vw)] pt-[clamp(2.5rem,7vw,5rem)]">
        <Parallax speed={0.55}>
          <p className="eyebrow text-eyebrow rise">{SITE.tagline}</p>
        </Parallax>

        <Parallax speed={0.14}>
          <SplitHeadline
            lines={HEADLINE}
            label="You could have built that."
            className="mt-[clamp(1.5rem,4vw,3rem)] font-display text-display-xl text-foreground"
          />
        </Parallax>

        <Parallax speed={0.34}>
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
                    "--d": `${520 + i * 60}ms`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </Parallax>
      </div>

      {/* Pinned to the foot of the screen rather than following the headline.
          The gap between them is the composition: one enormous statement at the
          top, one quiet paragraph at the bottom, and the field running through
          the space between. */}
      <div className="mx-auto w-full max-w-[110rem] px-[max(1rem,4vw)] pt-[clamp(2.5rem,6vw,5rem)] pb-[clamp(1.5rem,3vw,2.25rem)]">
        <Parallax speed={0.5}>
          <p
            className="rise ml-auto max-w-[42ch] text-[clamp(0.95rem,1.35vw,1.125rem)] leading-relaxed text-foreground lg:text-right"
            style={{ "--d": "760ms" } as React.CSSProperties}
          >
            ALGOBIC is where people build the AI projects they see online. No
            coding background required, and no course to buy. Every build is
            documented end to end: the exact prompts, where it broke, what it
            cost, and a live URL you can open.
          </p>
        </Parallax>
      </div>
    </section>
  );
}
