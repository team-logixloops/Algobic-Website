"use client";

import * as React from "react";
import gsap from "gsap";
import { useMediaQuery } from "@/components/ui/motion-provider";

/**
 * The cursor, as a shard.
 *
 * Not a dot and not a ring. The mark is made of thin horizontal bars and one
 * diagonal, so the pointer is a bar skewed to `--slash-angle`: the smallest
 * possible piece of the logo, following you. It stretches along its own axis
 * with pointer speed, which is the same tearing the shader does to the rows it
 * passes, so the two read as one system rather than as a cursor effect bolted
 * over a background effect.
 *
 * Over anything interactive it swells and takes the accent, which is the only
 * job it does that the native cursor could not.
 *
 * Never replaces the real pointer. `cursor: none` on a page whose only control
 * is one link is a good way to lose the click, and a custom cursor that lags
 * behind the actual hit target is worse than none. This rides alongside, so the
 * system cursor still shows the true position and every hover, focus and click
 * behaves exactly as it did.
 *
 * Mounted only for devices that actually have a pointer that hovers, so touch
 * never pays for it, and never under reduced motion.
 */
export function ShardCursor() {
  const ref = React.useRef<HTMLDivElement>(null);
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = fine && !reduced;

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    // Written through quickTo so the position is interpolated on GSAP's ticker
    // rather than assigned per event. Pointer events fire faster than frames on
    // a high-polling mouse, and assigning directly means most of that work is
    // thrown away before it paints.
    const x = gsap.quickTo(el, "x", { duration: 0.28, ease: "expo.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.28, ease: "expo.out" });
    const w = gsap.quickTo(el, "scaleX", { duration: 0.4, ease: "expo.out" });

    let lastX = 0;
    let lastY = 0;
    let shown = false;

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to(el, { opacity: 1, duration: 0.3 });
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      x(e.clientX);
      y(e.clientY);
      // Stretches with speed, capped so a fast flick does not draw a full-width
      // bar across the screen.
      w(1 + Math.min(Math.hypot(dx, dy) / 26, 2.6));
    };

    const onLeave = () => {
      shown = false;
      gsap.to(el, { opacity: 0, duration: 0.2 });
    };

    // One delegated pair rather than a listener per control, so anything added
    // to the page later is covered without registering anything.
    const interactive = "a, button, [role='button'], input, summary";
    const onOver = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest?.(interactive);
      gsap.to(el, {
        scaleY: hit ? 3.4 : 1,
        backgroundColor: hit
          ? "var(--accent)"
          : "var(--foreground)",
        duration: 0.32,
        ease: "expo.out",
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      gsap.killTweensOf(el);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] h-[3px] w-[26px] opacity-0 mix-blend-difference"
      style={{
        backgroundColor: "var(--foreground)",
        transform: "translate(-50%, -50%)",
        rotate: "calc(-1 * var(--slash-angle))",
      }}
    />
  );
}
