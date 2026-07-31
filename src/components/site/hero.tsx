import * as React from "react";
import Link from "next/link";
import { BuildIndex } from "@/components/site/build-index";
import { GlitchField } from "@/components/ui/glitch-field";

/**
 * `brand.md`: "The work: shipped things are the hero. Never the founder,
 * never us." So the right column is the evidence and the left is the itch.
 * The shards cross the seam between them, which is the whole thesis of the
 * mark rendered as layout.
 *
 * The h1 is the LCP element: plain text, no image, no entrance animation.
 */

/** Bar widths for the shatter row. Thinning rightward, into the seam. */
const SHARDS = [
  { w: "3.25rem", accent: false },
  { w: "1.5rem", accent: true },
  { w: "2.25rem", accent: false },
  { w: "0.5rem", accent: true },
  { w: "1rem", accent: false },
] as const;

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Bounded to the hero rather than the whole page: a full-height canvas
          on a scrolling document costs frames for ground nobody is looking at.
          The only ambient mark here: a bled, low-contrast cat cropped on two
          edges read as a blob rather than as the brand, so it moved to the CTA
          where it can be shown whole. */}
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute inset-0 -z-20"
        style={{ "--parallax": "10vh" } as React.CSSProperties}
      >
        <GlitchField />
      </div>

      <div className="mx-auto grid max-w-[110rem] items-start gap-[clamp(2.5rem,6vw,4.5rem)] px-[max(1rem,4vw)] pt-[clamp(3rem,9vw,6rem)] pb-[clamp(2rem,6vw,4rem)] lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="eyebrow text-eyebrow rise">Build before they do</p>

          {/* No entrance on the h1. It is the LCP element, and it holds still
              as the one fixed statement while the rest assembles. */}
          <h1 className="mt-[clamp(1rem,2.5vw,1.75rem)] max-w-[16ch] font-display text-display-xl text-balance text-foreground">
            You could have built that.
          </h1>

          {/* The shatter motif as motion: bars draw outward in sequence, which
              is the mark's own dissolve read left to right. */}
          <div
            aria-hidden="true"
            className="mt-[clamp(1.25rem,3vw,2rem)] flex items-center gap-[5px]"
          >
            {SHARDS.map((shard, i) => (
              <span
                key={i}
                className={`draw block h-[2px] ${shard.accent ? "bg-accent" : "bg-shard"}`}
                style={{ width: shard.w, "--d": `${120 + i * 55}ms` } as React.CSSProperties}
              />
            ))}
          </div>

          {/* Answer block. Inside the first 100 words, declarative, extractable. */}
          <p
            className="rise mt-[clamp(1.25rem,3vw,2rem)] max-w-[46ch] text-[clamp(0.95rem,1.4vw,1.0625rem)] leading-relaxed text-foreground"
            style={{ "--d": "420ms" } as React.CSSProperties}
          >
            ALGOBIC is where people build the AI projects they see online. No
            coding background required, and no course to buy. Every build is
            documented end to end: the exact prompts, where it broke, what it
            cost, and a live URL you can open.
          </p>

          {/* Subordinate to the index on purpose. One button on the page, and
              it is not this one. */}
          <Link
            href="/start"
            className="group rise mt-[clamp(1.5rem,3.5vw,2.25rem)] inline-flex items-baseline gap-2 font-mono text-data text-accent-ink uppercase"
            style={{ "--d": "560ms" } as React.CSSProperties}
          >
            Start with this one
            <span aria-hidden="true" className="slash-glyph">
              \
            </span>
          </Link>
        </div>

        <div>
          <h2
            className="eyebrow text-eyebrow rise mb-[clamp(0.875rem,2vw,1.25rem)]"
            style={{ "--d": "240ms" } as React.CSSProperties}
          >
            Shipped here
          </h2>
          <div className="rise" style={{ "--d": "340ms" } as React.CSSProperties}>
            <BuildIndex count={3} />
          </div>
        </div>
      </div>
    </section>
  );
}
