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
export function TheCount() {
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
    /* Measured against the panel, not against this element. The leaf is
       rotating while all of this is happening, and a rotated element reports a
       top that is wrong by up to its own width times the sine of the angle, so
       a trigger on `this` would drift by a few hundred pixels against the hinge
       it is supposed to be locked to. */
    <Scrub
      trigger="[data-hinge-panel]"
      start={HINGE_START}
      end={HINGE_END}
      onProgress={onProgress}
      /* Floored on a laptop, centred on a phone. The composition is a mass
         sitting on the floor of a wide screen; on a 390px one the same mass is
         a third of the height, so the floor leaves a void between the eyebrow
         and the digit that reads as a section that failed to load. */
      className="flex flex-1 flex-col justify-center lg:justify-end"
    >
      {/* Natural height, pushed to the foot of the panel by the wrapper. Given
          `flex-1` the box filled the screen and its top border ended up under
          the eyebrow with three hundred pixels between the rule and the digit
          it was supposed to be ruling. The emptiness above is the composition:
          this is the screen about having shipped nothing, so the mass sits on
          the floor and the rest of it is a black field. */}
      <div className="grid items-end gap-[clamp(1.5rem,4vw,4rem)] border-t border-line pt-[clamp(1.5rem,4vw,3rem)] lg:grid-cols-[auto_1fr]">
        {/* 42vw, not 32. This is the one inverted screen on the site and the
            argument is that the least flattering figure gets the most room, so
            the digit has to be the largest thing on the page by some distance.
            At 32vw it rendered shorter than a single line of the hero headline,
            which reads as a section that was given a screen and did not want
            one. */}
        <span
          ref={glyph}
          aria-hidden="true"
          className="block origin-bottom-left font-mono text-[clamp(8rem,42vw,34rem)] leading-[0.72] font-medium tabular-nums text-foreground will-change-transform"
        >
          0
        </span>

        {/* Pushed to the far edge rather than sitting next to the glyph. The
            span between them is the point: the eye crosses an empty measure to
            get from the number to what it means. */}
        <div
          ref={copy}
          className="max-w-[34ch] pb-[clamp(0.5rem,2vw,3rem)] will-change-transform lg:justify-self-end lg:text-right"
        >
          <p className="text-[clamp(1rem,1.6vw,1.375rem)] leading-relaxed text-foreground">
            A build appears here once it is shipped, reachable and free to run.
            Never before.
          </p>
          <p className="mt-[clamp(0.75rem,2vw,1.25rem)] font-mono text-micro text-muted">
            Nothing on this page is a mockup.
          </p>
        </div>
      </div>
    </Scrub>
  );
}
