"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/components/ui/motion-provider";

/**
 * The hinge.
 *
 * Every screen after the first arrives by rotating about its bottom-left corner
 * over the panel beneath it, which is pinned and therefore covered rather than
 * scrolled away.
 *
 * The angle is the site's one angle. `ALGOBIC\` ends in an accent backslash and
 * that diagonal is the only one the brand owns; a clockwise rotation about the
 * bottom-left corner puts the panel's leading edge on exactly that stroke,
 * running top-left to bottom-right. The page is not applying a rotation effect,
 * it is drawing the mark once per screen with the reader's scroll as the hand.
 *
 * The angle decays down the page: 16, 13, 10, 7, 4, 0. The stack visibly comes
 * to rest by the resolution, which is the same argument the seam's shard count
 * carries in the one element with no content to compete with. A strong gesture
 * repeated seven times at full strength is wallpaper; one that closes is a
 * composition.
 *
 * Nothing here runs under reduced motion, so the fallback is a plain stack of
 * full-height sections, each with its own ground, in document order.
 */

/**
 * The hinge's travel, as ScrollTrigger positions on the panel.
 *
 * Exported because "The count" scrubs its own reveal against the identical
 * range: the number is drawn by the panel closing, not by a second timeline
 * that happens to run alongside it. Two triggers built from one constant are
 * synchronised by construction; two built from two literals drift the moment
 * either is tuned.
 */
export const HINGE_START = "top bottom";
export const HINGE_END = "top 35%";

export function HingeStack({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const panels = Array.from(
        root.querySelectorAll<HTMLElement>("[data-hinge-panel]")
      );
      if (panels.length === 0) return;

      const last = panels.length - 1;

      panels.forEach((panel, i) => {
        /* Set through GSAP rather than assigned to `style`, so `ctx.revert()`
           takes it back with everything else. Later panels stack over earlier
           ones; without this the document order paints them the wrong way and
           the incoming panel rotates in behind the one it should cover. */
        gsap.set(panel, { zIndex: i + 1 });

        const leaf = panel.querySelector<HTMLElement>("[data-hinge-leaf]");
        const angle = Number(panel.dataset.hinge ?? 0);

        if (leaf && angle > 0) {
          gsap.fromTo(
            leaf,
            { rotation: angle, transformOrigin: "0% 100%" },
            {
              rotation: 0,
              /* Linear. The scrub is the easing: anything else here means the
                 panel stops tracking the wheel, which is the one thing a
                 scroll-driven rotation must never do. */
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: HINGE_START,
                end: HINGE_END,
                scrub: true,
              },
            }
          );
        }

        /* The last panel is never pinned. It is the one screen the stack does
           not cover, which is what makes it read as the end rather than as the
           next in a sequence. */
        if (i < last) {
          ScrollTrigger.create({
            trigger: panel,
            start: "bottom bottom",
            end: "bottom top",
            pin: true,
            /* No spacing. The pin holds the panel in place while the next one
               closes over it; adding spacing would insert a screen of nothing
               between every pair and the stack would never touch. */
            pinSpacing: false,
            /* Pinned by translating the panel, not by switching it to
               `position: fixed`, which is ScrollTrigger's default when the
               scroller is the window.

               Fixed pinning takes the element out of flow, and the browser
               books that as a layout shift of the entire viewport: measured at
               CLS 10.14 across one full-page scroll, one shift of ~1.0 per pin,
               each reported as a box going from 0x0 to 1440x900. Nothing
               visibly jumped, but Core Web Vitals does not score what a person
               sees, it scores what the layout-instability spec records, and
               scroll is not one of the inputs that excludes a shift.

               Translating leaves the panel in flow, so there is no box to
               appear or disappear. Same pin, same stack, and the page keeps the
               0.0000 it loads with. */
            pinType: "transform",
          });
        }
      });

      /* Pinning changes what every trigger after it measures. One refresh once
         the whole stack exists is cheaper and more correct than letting six
         pins each invalidate the ones below them as they are created. */
      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  /* `overflow-x-clip`, not `hidden`: the panels clip their own leaves, but a
     sub-pixel rounding on a rotated full-bleed element is enough to give the
     document a horizontal scrollbar, and `hidden` here would make this a scroll
     container and freeze every `view()` timeline on the page. */
  return (
    <div ref={ref} className={`overflow-x-clip ${className}`}>
      {children}
    </div>
  );
}
