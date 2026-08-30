"use client";

import * as React from "react";
import gsap from "gsap";
import { HINGE_END, HINGE_START } from "@/components/ui/hinge-stack";
import { Scrub } from "@/components/ui/scroll-fx";

/**
 * The count.
 *
 * Every brand with nothing shipped writes around its zero. This one spends a
 * whole screen on it, on inverted ground, and makes you draw it.
 *
 * The glyph is clipped on the slash and the clip opens as the panel closes:
 * the same range, from the same constants, so the number finishes exactly as
 * the hinge lands. One gesture, not two. The panel swinging shut on the mark's
 * own diagonal is what draws the digit, which is why this is the screen the
 * page inverts: it is the least flattering fact the brand owns, and if the
 * figure that embarrasses us gets the most room, the ones that flatter us can
 * be believed.
 *
 * `--slash-angle` drives the clip, so the reveal runs on the same diagonal as
 * the hinge, the seams, the hover wipes and the mark's own trailing backslash.
 *
 * Set in the data face. It is a count, counts belong to the mono, and
 * Orbitron's zero is a slashed rectangle that at this size reads as a filled
 * black box rather than a digit.
 */
export function TheCount({ count = 1 }: { count?: number }) {
  const glyph = React.useRef<HTMLSpanElement>(null);
  const copy = React.useRef<HTMLDivElement>(null);

  const onProgress = React.useCallback((_root: HTMLElement, p: number) => {
    // Eased by hand rather than by the scrub, so the opening is fast and the
    // settle is long: the number should arrive, not creep. It completes a
    // little before the hinge does, so the panel lands on a finished digit.
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
    <Scrub
      trigger="[data-hinge-panel]"
      start={HINGE_START}
      end={HINGE_END}
      onProgress={onProgress}
      className="flex flex-1 flex-col justify-center lg:justify-end"
    >
      <div className="grid items-end gap-[clamp(1.5rem,4vw,4rem)] border-t border-line pt-[clamp(1.5rem,4vw,3rem)] lg:grid-cols-[auto_1fr]">
        <span
          ref={glyph}
          aria-hidden="true"
          className="block origin-bottom-left font-mono text-[clamp(8rem,42vw,34rem)] leading-[0.72] font-medium tabular-nums text-foreground will-change-transform"
        >
          {count}
        </span>

        <div
          ref={copy}
          className="max-w-[34ch] pb-[clamp(0.5rem,2vw,3rem)] will-change-transform lg:justify-self-end lg:text-right"
        >
          <p className="text-[clamp(1rem,1.6vw,1.375rem)] leading-relaxed text-foreground">
            {count === 0 ? (
              <>
                A build appears here once it is shipped, reachable and free to
                run. Never before.
              </>
            ) : count === 1 ? (
              <>
                One build published: verified end-to-end, reachable on a live
                URL, and free to run.
              </>
            ) : (
              <>
                {count} builds published: verified end-to-end, reachable on a
                live URL, and free to run.
              </>
            )}
          </p>
          <p className="mt-[clamp(0.75rem,2vw,1.25rem)] font-mono text-micro text-muted">
            {count === 0
              ? "Nothing on this page is a mockup."
              : "Verbatim prompts, failures, and ₹0 bills."}
          </p>
        </div>
      </div>
    </Scrub>
  );
}
