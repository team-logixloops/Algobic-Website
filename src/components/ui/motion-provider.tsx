"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Smooth scroll, and the one place ScrollTrigger is registered.
 *
 * Everything scroll-driven on this page is scrubbed against the scroll
 * position, and scrubbing against native wheel scroll on Windows looks broken:
 * the wheel arrives in coarse jumps, so a scrubbed timeline steps rather than
 * moves. Lenis interpolates the position, which is what makes scrubbing read as
 * motion instead of as a slideshow. It is the reason the effect works, not a
 * flourish on top of it.
 *
 * Lenis drives ScrollTrigger from GSAP's ticker rather than its own rAF, so the
 * whole page runs on one loop: scroll interpolation, every scrubbed timeline
 * and every pin update land in the same frame. Two loops means a scrubbed
 * element is always one frame behind the scroll it is scrubbing against.
 *
 * Under reduced motion none of it initialises. Native scroll returns, every
 * GSAP timeline elsewhere checks the same query and renders its end state
 * immediately, and the page is the static document it is authored as.
 */

gsap.registerPlugin(ScrollTrigger);

/** One source of truth. Every animated component asks this, never matchMedia. */
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * A media query as reactive state, without writing state from an effect.
 *
 * `useSyncExternalStore` is the shape React wants for anything the browser owns
 * and React does not: it subscribes, reads on demand, and gives the server a
 * deterministic answer instead of a hydration mismatch. Setting state inside an
 * effect to mirror a media query is the same idea done in a way that renders
 * twice and can cascade.
 *
 * The server snapshot is always `false`, which is the safe direction for every
 * caller here: features gate themselves on when it becomes true, so the
 * prerendered HTML never promises an effect it might not deliver.
 */
export function useMediaQuery(query: string) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Slightly overshooting exponential. The page's own easing vocabulary is
      // expo-out; the scroll matches it so nothing feels like a different site.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Touch is left alone. Hijacking momentum scrolling on a phone is the
      // single most common way a site like this becomes unusable, and this
      // audience is on phones.
      smoothWheel: true,
      touchMultiplier: 1,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Webfonts land after first paint and change every measurement ScrollTrigger
    // took. Without this, every trigger on the page is positioned against
    // fallback metrics.
    let refresh: number | undefined;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        refresh = window.setTimeout(() => ScrollTrigger.refresh(), 60);
      });
    }

    return () => {
      if (refresh) window.clearTimeout(refresh);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
