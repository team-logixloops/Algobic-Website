"use client";

import * as React from "react";

/**
 * The lockup's shatter field, extended across the page.
 *
 * Same vocabulary as the artwork: thin horizontal bars on a coarse row grid,
 * mostly ink with an accent minority. Density thins toward the middle so the
 * lockup always sits on quiet ground. The pointer corrupts whatever it passes:
 * bars jump along their row, brighten, then decay back.
 *
 * Scroll velocity feeds the same corruption, so the field shatters harder the
 * faster you move. That is the mark's own dissolve responding to the reader
 * rather than a decorative loop.
 *
 * The loop stops entirely when the canvas leaves the viewport. Without that it
 * kept painting a hero nobody could see, which on a mid-range Android is frames
 * spent on nothing.
 */

type Bar = {
  x: number;
  y: number;
  w: number;
  h: number;
  seed: number;
  accent: boolean;
  base: number;
  energy: number;
  offset: number;
};

const MAX_DPR = 2;
const DECAY = 0.9;
const REACH = 150;
const STEP_MS = 70;
/** Pixels of scroll per frame that count as a full-strength disturbance. */
const SCROLL_FULL_TILT = 55;
/** Share of a bar's energy that scroll can contribute, so the pointer stays the
    louder input and fast scrolling does not white out the field. */
const SCROLL_MAX_ENERGY = 0.55;

/** Deterministic per-bar, per-tick noise: keeps the jitter digital, not smooth. */
function noise(seed: number, tick: number) {
  const n = Math.sin(seed * 127.1 + tick * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function buildBars(w: number, h: number): Bar[] {
  const scale = Math.min(Math.max(w / 900, 0.62), 1.5);
  const rowGap = 13 * scale;
  const rows = Math.floor(h / rowGap);
  const target = Math.min(Math.max(Math.round((w * h) / 7000), 90), 620);
  const perRow = Math.max(1, Math.round(target / Math.max(rows, 1)));
  const bars: Bar[] = [];

  for (let r = 0; r < rows; r++) {
    const y = r * rowGap + rowGap * 0.5;
    // Quiet in the middle, busy at the edges.
    const dist = Math.abs(y / h - 0.5) * 2;
    const density = 0.18 + dist * dist * 1.5;
    const count = Math.round(perRow * density);
    for (let i = 0; i < count; i++) {
      bars.push({
        x: Math.random() * w,
        y,
        w: (4 + Math.random() * Math.random() * 46) * scale,
        h: Math.max(1, Math.round(2 * scale)),
        seed: Math.random() * 1000,
        accent: Math.random() < 0.28,
        base: 0.05 + Math.random() * 0.13,
        energy: 0,
        offset: 0,
      });
    }
  }
  return bars;
}

function readPalette() {
  const s = getComputedStyle(document.documentElement);
  return {
    ink: s.getPropertyValue("--foreground").trim() || "#000",
    accent: s.getPropertyValue("--accent").trim() || "#f70",
  };
}

export function GlitchField({ className = "" }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let bars: Bar[] = [];
    let width = 0;
    let height = 0;
    let palette = readPalette();
    const pointer = { x: -9999, y: -9999, active: false };
    let frame = 0;
    let running = true;
    /** Set by a passive listener, consumed once per frame. Reading scrollY here
        rather than inside the loop keeps the loop free of layout reads. */
    let scrollY = window.scrollY;
    let lastScrollY = scrollY;
    let onScreen = true;
    /** Cached canvas box, `top` in document space so vertical scrolling never
        invalidates it. Measuring per pointermove forced a layout on every move
        of the mouse, for the whole life of the page. */
    const box = { left: 0, top: 0 };
    /** Set once the field has been painted in its resting state, so the loop
        can stop rather than redraw an identical frame forever. */
    let settled = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const rect = canvas.getBoundingClientRect();
      box.left = rect.left;
      box.top = rect.top + window.scrollY;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bars = buildBars(width, height);
      // A resized field has to be redrawn even if it had already settled.
      repaint();
    };

    const paint = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const tick = Math.floor(t / STEP_MS);
      const live = !reduced.matches;

      // Scroll distance covered since the last frame, normalised. Consumed once
      // for the whole field rather than per bar.
      const scrolled = Math.abs(scrollY - lastScrollY);
      lastScrollY = scrollY;
      const scrollTilt = live
        ? Math.min(scrolled / SCROLL_FULL_TILT, 1) * SCROLL_MAX_ENERGY
        : 0;

      for (const bar of bars) {
        if (live) {
          if (pointer.active) {
            const dx = bar.x + bar.w / 2 - pointer.x;
            const dy = bar.y - pointer.y;
            const d = Math.hypot(dx, dy);
            if (d < REACH) bar.energy = Math.max(bar.energy, 1 - d / REACH);
          }
          // Scrolling disturbs the whole field, unevenly: the per-bar noise
          // keeps it from reading as one synchronised flash.
          if (scrollTilt > 0.01) {
            bar.energy = Math.max(
              bar.energy,
              scrollTilt * (0.45 + noise(bar.seed, tick) * 0.55)
            );
          }
          // Ambient: an occasional bar twitches on its own.
          if (bar.energy < 0.02 && noise(bar.seed, tick) > 0.9985) {
            bar.energy = 0.45;
          }
          bar.energy *= DECAY;
          const jump = (noise(bar.seed, tick) - 0.5) * 2;
          bar.offset = Math.round((jump * bar.energy * 30) / 2) * 2;
        }

        const lift = bar.energy * 0.5;
        ctx.globalAlpha = Math.min(bar.base + lift, 0.75);
        ctx.fillStyle = bar.accent || bar.energy > 0.35 ? palette.accent : palette.ink;
        ctx.fillRect(
          bar.x + bar.offset,
          bar.y,
          bar.w + bar.energy * 22,
          bar.h
        );
      }
      ctx.globalAlpha = 1;

      // Under reduced motion nothing above mutates: every bar keeps its initial
      // zero energy and zero offset, so the next frame would be pixel-identical
      // to this one. Painting it once and stopping is the difference between a
      // still image and a full-canvas clear plus a fillRect per bar at display
      // refresh rate, indefinitely, on a phone whose owner asked for less.
      if (!live) {
        settled = true;
        return;
      }
      if (running) frame = requestAnimationFrame(paint);
    };

    /** Restart a settled field. Used by anything that changes what it should
        show: a resize, a theme swap, or reduced motion being turned back off.
        A no-op while the loop is live, since a frame is already scheduled and a
        second one would run two loops against the same canvas. */
    const repaint = () => {
      if (!settled) return;
      settled = false;
      if (running) frame = requestAnimationFrame(paint);
    };

    // Reads the cached box rather than measuring. Measuring here forced a
    // layout on every single mouse move for the life of the page.
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX - box.left;
      pointer.y = e.clientY + window.scrollY - box.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    const onThemeChange = () => {
      palette = readPalette();
      // The new colours have to reach the canvas even when the field has
      // settled and stopped scheduling frames.
      repaint();
    };
    // Still no layout read in here. `box.top` is stored in document space, so
    // the viewport-relative offset is just `box.top - scrollY`, which
    // `onPointerMove` computes from values it already has.
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    // Turning reduced motion off mid-session has to bring the field back; the
    // settled path stops scheduling and nothing else would ever restart it.
    const onMotionPreference = () => repaint();

    /** One gate for both reasons to stop: hidden tab, or scrolled out of view. */
    const setRunning = (next: boolean) => {
      if (next === running) return;
      running = next;
      if (next) {
        // Reset the baseline, or the first frame back reads the whole scroll
        // distance travelled while paused as one enormous jolt.
        lastScrollY = window.scrollY;
        scrollY = lastScrollY;
        frame = requestAnimationFrame(paint);
      } else {
        cancelAnimationFrame(frame);
      }
    };

    const sync = () => setRunning(!document.hidden && onScreen);
    const onVisibility = () => sync();

    resize();
    frame = requestAnimationFrame(paint);

    // ResizeObserver delivers once on observe. Without this guard that initial
    // delivery reseeds the whole field a frame after the explicit resize above,
    // which is a visible reshuffle at mount for no reason.
    let lastW = width;
    let lastH = height;
    const observer = new ResizeObserver(() => {
      if (canvas.clientWidth === lastW && canvas.clientHeight === lastH) return;
      resize();
      lastW = width;
      lastH = height;
    });
    observer.observe(canvas);
    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    // Stop painting a hero that has scrolled away. The margin keeps the field
    // already running by the time any of it is on screen.
    const visibility = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { rootMargin: "120px" }
    );
    visibility.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    // `pointerleave` does not bubble, so on touch it never reaches window and
    // a tap used to latch the disturbance under the finger permanently. Touch
    // ends with pointerup or pointercancel, which do bubble.
    window.addEventListener("pointerup", onPointerLeave, { passive: true });
    window.addEventListener("pointercancel", onPointerLeave, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onMotionPreference);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      themeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      window.removeEventListener("pointerup", onPointerLeave);
      window.removeEventListener("pointercancel", onPointerLeave);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotionPreference);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
