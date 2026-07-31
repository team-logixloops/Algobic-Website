"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MARKS, MaskLayer } from "@/components/ui/brand-mask";
import { prefersReducedMotion } from "@/components/ui/motion-provider";

/**
 * The mark, assembling.
 *
 * `ALGOBIC` is drawn as a cat coming apart into horizontal bars, leftward. Read
 * the other way it is bars gathering into an animal, which is the company in
 * one gesture: scattered attention becoming one finished thing.
 *
 * So the artwork is sliced into bands and each band is scrubbed home along its
 * own row. At the top of the section the composition is the logo as drawn; by
 * the bottom the animal is whole. The reader is doing the assembling.
 *
 * Each band is a clipping window holding a full-size copy of the mark, offset
 * to show only that band's row. The window never moves; the copy inside it does,
 * on `translate3d` alone, so the whole sequence is compositor work with no
 * layout and no repaint.
 *
 * Scrubbed with GSAP rather than a CSS view timeline. The bands share one
 * trigger, so they resolve against one progress value instead of each deriving
 * its own from its own box, and the scrub rides the same interpolated scroll
 * position as everything else on the page.
 *
 * Cat only, deliberately. The wordmark was tried and cut: at 11.5:1 its bands
 * come out around two pixels tall, and shearing those sideways destroys the
 * letterforms rather than dissolving them.
 *
 * The resting state in the DOM is the assembled mark. Under reduced motion, or
 * with JavaScript off, that is simply what renders. A failure here can only
 * ever leave the artwork finished, never broken.
 */

/**
 * Horizontal displacement per band, as a percentage of the mark's width, from
 * the top of the artwork down.
 *
 * Negative because the mark's own shards stream left. Hand-set rather than
 * generated: the pattern has to read as the drawn dissolve, which is uneven
 * (long trails off the ears and tail, almost none across the body), and random
 * values give an even scatter that reads as a glitch instead.
 */
const BANDS = [
  -46, -18, -72, -9, -38, -61, -14, -29, -55, -7, -43, -24, -67, -12,
] as const;

export function AssemblingMark({ className = "" }: { className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { ink, accent, aspect } = MARKS.cat;
  const band = 100 / BANDS.length;

  React.useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    const movers = root.querySelectorAll<HTMLElement>("[data-band]");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 92%",
          end: "top 34%",
          scrub: 0.6,
        },
      });

      movers.forEach((el) => {
        const from = Number(el.dataset.band);
        tl.fromTo(
          el,
          { xPercent: from },
          { xPercent: 0, ease: "none" },
          // Bands land in sequence rather than together, spread across the
          // first three quarters of the scrub so the last one settles before
          // the section stops moving.
          Math.abs(from) / 260
        );
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`relative ${className}`}
      style={{ aspectRatio: String(aspect) }}
    >
      {BANDS.map((from, i) => (
        <div
          key={i}
          className="absolute left-0 w-full overflow-hidden"
          style={{ top: `${i * band}%`, height: `${band}%` }}
        >
          {/* Sized to the whole mark and pulled up by i bands, so this window
              shows row i and nothing else. Percentages resolve against the
              band, hence the 100 x band-count height. */}
          <div
            data-band={from}
            className="absolute left-0 w-full will-change-transform"
            style={{ height: `${BANDS.length * 100}%`, top: `${i * -100}%` }}
          >
            <MaskLayer src={ink} color="currentColor" />
            <MaskLayer src={accent} color="var(--accent)" />
          </div>
        </div>
      ))}
    </div>
  );
}
