import * as React from "react";
import { Parallax } from "@/components/ui/scroll-fx";
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
 * The base of the hinge stack, and the only panel nothing swings in over from
 * above. It is pinned from the first pixel of scroll, so the field does not
 * scroll away: it dissolves in place while the next panel closes over it.
 *
 * Three layers moving at three rates, which is the whole depth budget: the
 * field dissolves as the hero is covered, the headline drifts slowest, the
 * eyebrow and the paragraph drift fastest. Nothing here scales. Rotation
 * belongs to the panel, not to anything inside it.
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
  return (
    <>
      {/* No seam above this one: it is the base of the stack, so there is no
          leading edge because nothing arrives. It supplies its own top gutter
          for the same reason. */}
      {/* Trimmed from 7vw. The headline runs at 13vw and three lines of it plus
          the closing paragraph is already more than a 900px laptop has under
          the header, so the padding is what gives. Fixed gutters are the first
          thing to spend on a screen whose whole argument is the size of the
          type. */}
      <div className="pt-[clamp(1.5rem,4vw,3rem)]">
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

      {/* Pushed to the foot of the screen by the panel's own `justify-between`
          rather than following the headline. The gap between them is the
          composition: one enormous statement at the top, one quiet paragraph at
          the bottom, and the field running through the space between. */}
      <div className="pt-[clamp(1.25rem,3vw,2rem)]">
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
    </>
  );
}
