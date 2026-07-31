"use client";

import * as React from "react";
import gsap from "gsap";
import { PinScrub } from "@/components/ui/scroll-fx";

/**
 * The count.
 *
 * Every brand with nothing shipped writes around its zero. This one pins the
 * screen and makes you scroll through it.
 *
 * The glyph is clipped on the slash and the clip opens as you scroll, so the
 * number is drawn by the reader rather than presented to them, on the site's
 * one angle. It scales as it opens and the copy counter-travels, which is the
 * only place two things move against each other on the page. Nothing here is
 * decoration: the number is the least flattering fact the brand owns, and
 * spending the page's one pinned screen on it is the argument. If the figure
 * that embarrasses us gets the most room, the ones that flatter us can be
 * believed.
 *
 * `--slash-angle` drives the clip, so the reveal runs on the same diagonal as
 * the seams, the hover wipes and the mark's own trailing backslash.
 *
 * Set in the data face. It is a count, counts belong to the mono, and
 * Orbitron's zero is a slashed rectangle that at this size reads as a filled
 * black box rather than a digit.
 */
export function TheCount() {
  const glyph = React.useRef<HTMLSpanElement>(null);
  const copy = React.useRef<HTMLDivElement>(null);

  const onProgress = React.useCallback((_root: HTMLElement, p: number) => {
    // Eased by hand rather than by the scrub, so the opening is fast and the
    // settle is long: the number should arrive, not creep.
    const open = 1 - Math.pow(1 - Math.min(p / 0.72, 1), 3);

    if (glyph.current) {
      gsap.set(glyph.current, {
        // A wedge on the slash, widening from the leading edge.
        clipPath: `polygon(0% 0%, ${open * 118}% 0%, ${open * 118 - 18}% 100%, 0% 100%)`,
        scale: 0.86 + open * 0.14,
        yPercent: (1 - open) * 8,
      });
    }
    if (copy.current) {
      const c = Math.max(0, (p - 0.28) / 0.62);
      gsap.set(copy.current, {
        opacity: Math.min(c, 1),
        yPercent: (1 - Math.min(c, 1)) * 42,
      });
    }
  }, []);

  return (
    <PinScrub distance={1.1} onProgress={onProgress}>
      <section className="flex min-h-[100svh] items-center">
        <div className="mx-auto w-full max-w-[110rem] px-[max(1rem,4vw)]">
          <h2 className="eyebrow text-eyebrow">
            <span className="sr-only">Zero </span>builds published
          </h2>

          <div className="mt-[clamp(1.5rem,4vw,2.5rem)] grid items-end gap-[clamp(1.5rem,4vw,4rem)] border-t border-line pt-[clamp(1.5rem,4vw,3rem)] lg:grid-cols-[auto_1fr]">
            <span
              ref={glyph}
              aria-hidden="true"
              className="block origin-bottom-left font-mono text-[clamp(7rem,32vw,28rem)] leading-[0.72] font-medium tabular-nums text-foreground will-change-transform"
            >
              0
            </span>

            {/* Pushed to the far edge rather than sitting next to the glyph.
                The span between them is the point: the eye crosses an empty
                measure to get from the number to what it means. */}
            <div
              ref={copy}
              className="max-w-[34ch] pb-[clamp(0.5rem,2vw,3rem)] will-change-transform lg:justify-self-end lg:text-right"
            >
              <p className="text-[clamp(1rem,1.6vw,1.375rem)] leading-relaxed text-foreground">
                A build appears here once it is shipped, reachable and free to
                run. Never before.
              </p>
              <p className="mt-[clamp(0.75rem,2vw,1.25rem)] font-mono text-micro text-muted">
                Nothing on this page is a mockup.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PinScrub>
  );
}
