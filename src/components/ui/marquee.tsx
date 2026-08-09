"use client";

import * as React from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/ui/motion-provider";

/**
 * A strip of items that runs, and slows when you reach for it.
 *
 * The behaviour is the whole reason this is a component rather than a CSS
 * keyframe loop. A marquee that stops dead on hover reads as broken: the reader
 * moved the pointer somewhere near it and the page froze. A marquee that ignores
 * the pointer is unreadable, because the item you were about to read has
 * already left. Easing the timeScale down to a crawl does what the reader
 * actually meant, which is *slow down, I am reading this one*.
 *
 * Focus is treated differently from hover and the difference is not cosmetic.
 * Hover is ambient and reversible; focus means a keyboard reader is on an item
 * and is about to act on it, and a target that is still moving under a keyboard
 * reader is a target they cannot hit. So focus pauses outright.
 * `design.md` section 8 requires a full stop on focus and under reduced motion,
 * and both are honoured. It also asks for a full stop on hover; slowing rather
 * than stopping is the one deliberate divergence, recorded here rather than
 * left to be discovered.
 *
 * `xPercent` rather than a pixel offset, deliberately. GSAP resolves a percent
 * transform against the element's current width on every tick, so a webfont
 * landing after first paint and widening the strip cannot desynchronise the
 * loop from its own seam. Only the duration has to be re-measured, and a
 * `ResizeObserver` does that.
 *
 * Under reduced motion, and with no JavaScript at all, nothing here runs. The
 * `.ticker` rules in `globals.css` turn the strip into an ordinary horizontally
 * scrollable row and drop the duplicate half, so what a reader gets is a list
 * they can operate rather than a frozen animation they cannot reach the end of.
 */
export function Marquee({
  children,
  /** Pixels per second. Slow enough to read at a glance, not slow enough to nag. */
  speed = 46,
  label,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  /** Names the strip for assistive technology. It is a list, so it gets a name. */
  label: string;
  className?: string;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const tweenRef = React.useRef<gsap.core.Tween | null>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const track = root.querySelector<HTMLElement>("[data-track]");
    if (!track) return;

    /* Half, because the track holds the items twice. One loop of the animation
       travels exactly one copy, so the seam between the copies lands where the
       start was and nothing visibly jumps. */
    const measure = () => Math.max(1, track.scrollWidth / 2);

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: measure() / speed,
        ease: "none",
        repeat: -1,
      });
      tweenRef.current = tween;
    }, root);

    /* Webfonts land after first paint and change the strip's width, which
       changes nothing about where the loop seams but everything about how fast
       it should run. Same reason `MotionProvider` refreshes ScrollTrigger. */
    const resync = () => {
      const tween = tweenRef.current;
      if (!tween) return;
      const next = measure() / speed;
      /* `duration()` preserves the current progress, so a resize slides the
         speed rather than snapping the strip back to its start. */
      if (Math.abs(tween.duration() - next) > 0.05) tween.duration(next);
    };

    const observer = new ResizeObserver(resync);
    observer.observe(track);
    document.fonts?.ready.then(resync);

    return () => {
      observer.disconnect();
      ctx.revert();
      tweenRef.current = null;
    };
  }, [speed]);

  const scale = (value: number, duration: number) => {
    const tween = tweenRef.current;
    if (!tween) return;
    tween.resume();
    gsap.to(tween, { timeScale: value, duration, ease: "power2.out" });
  };

  return (
    <div
      ref={rootRef}
      className={`ticker relative w-full overflow-hidden ${className}`}
      onPointerEnter={() => scale(0.12, 0.55)}
      onPointerLeave={() => scale(1, 0.9)}
      /* React's onFocus and onBlur map to focusin and focusout, so both fire
         for descendants. A plain `focus` listener would not. */
      onFocus={() => tweenRef.current?.pause()}
      onBlur={() => {
        tweenRef.current?.resume();
        scale(1, 0.6);
      }}
    >
      {/* Two complete lists inside one track, rather than one list holding its
          own items twice. A duplicate wrapper inside the `<ul>` would have to
          be an `<li>` containing more `<li>`s, which is invalid markup and
          which assistive technology resolves in its own way per implementation.
          Two sibling lists are valid, and the second one can be hidden outright.

          `xPercent: -50` therefore travels exactly one list, so the seam
          between the copies lands where the start was and nothing visibly
          jumps. */}
      <div data-track className="flex w-max items-stretch will-change-transform">
        <ul aria-label={label} className="flex w-max shrink-0 items-stretch">
          {children}
        </ul>

        {/* The copy the loop runs into. It carries no information a reader has
            not already been given, so it is hidden from assistive technology
            and removed entirely when the strip is not animating. */}
        <ul
          aria-hidden="true"
          className="ticker__clone flex w-max shrink-0 items-stretch"
        >
          {children}
        </ul>
      </div>
    </div>
  );
}

/**
 * One item on the strip.
 *
 * A list item rather than a link, because nothing on either strip has a
 * destination yet: `/start`'s remaining topics and `/answers`'s questions are
 * both waiting on pages that have not been written. A moving link that goes
 * nowhere is worse than a moving label that never claimed to.
 */
export function MarqueeItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex shrink-0 items-center gap-[clamp(1rem,2.5vw,2rem)] pr-[clamp(1rem,2.5vw,2rem)] font-mono text-data whitespace-nowrap text-muted">
      {children}
      {/* The jog, on the slash, between every pair. The site's one angle doing
          the job a bullet would otherwise do. */}
      <span
        aria-hidden="true"
        className="block h-[clamp(0.75rem,1.6vw,1rem)] w-[1.5px] shrink-0 bg-accent"
        style={{ transform: "skewX(calc(-1 * var(--slash-angle)))" }}
      />
    </li>
  );
}
