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

    /**
     * Re-measure both halves, in this order, always.
     *
     * This is the fix for "the page sometimes will not scroll to the footer",
     * and the cause is worth writing down because the symptom points at the
     * wrong component. Lenis caches the scroll limit as `scrollHeight -
     * clientHeight` and clamps its target to it. Every wheel event is
     * interpreted against that cached number, so if the document grows after
     * Lenis measured it, the last stretch of the page is not slow or janky, it
     * is unreachable: the wheel keeps firing and the target stops moving.
     *
     * On `/` the document does grow after init, more than once. Webfonts land
     * and re-flow six full-height panels. Six ScrollTrigger pins are created
     * and `pinSpacing: false` changes what the panels below them contribute to
     * document height. The preloader holds a fixed overlay for the first two
     * seconds. Any of those can land after Lenis has taken its measurement, and
     * the last 100svh of the page, which is exactly the curtain the footer
     * lives in, is what falls off the end.
     *
     * `lenis.resize()` first, then `ScrollTrigger.refresh()`: the triggers'
     * start and end positions are resolved against the scroller, so refreshing
     * before the scroller knows its own size means doing it twice.
     */
    const resync = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    // Webfonts land after first paint and change every measurement ScrollTrigger
    // took. Without this, every trigger on the page is positioned against
    // fallback metrics.
    let fontSync: number | undefined;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        fontSync = window.setTimeout(resync, 60);
      });
    }

    /* The preloader's own release, plus a beat. It holds a fixed, full-screen
       overlay for 2.2s and drops `data-preload` at 3.6s, and the entrance
       animations keyed off that attribute are still settling until then. One
       measurement taken after all of it has finished is cheap insurance against
       every ordering the first two seconds can produce. */
    const settleSync = window.setTimeout(resync, 3800);

    /* Anything else that changes the document's height: a pin being created,
       an image arriving, a section revealing, a phone collapsing its URL bar.
       Observing the body catches all of them without knowing which one
       happened. `lenis.resize()` alone here rather than the full `resync`,
       because ScrollTrigger already installs its own resize handling and
       running a refresh on every observed frame is how a scroll starts
       stuttering. */
    const observer = new ResizeObserver(() => lenis.resize());
    observer.observe(document.body);

    /* Restoring from the back/forward cache replays none of the above: the
       document is handed back whole, with Lenis holding whatever it last
       measured on a page that may have been resized in another tab since. */
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) resync();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      if (fontSync) window.clearTimeout(fontSync);
      window.clearTimeout(settleSync);
      window.removeEventListener("pageshow", onPageShow);
      observer.disconnect();
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
