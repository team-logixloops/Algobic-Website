"use client";

import * as React from "react";

/**
 * The lockup's shatter field, extended across the page.
 *
 * Same vocabulary as the artwork: thin horizontal bars on a coarse row grid,
 * mostly ink with an accent minority. Density thins toward the middle so the
 * lockup always sits on quiet ground. The pointer corrupts whatever it passes
 * — bars jump along their row, brighten, then decay back.
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

/** Deterministic per-bar, per-tick noise — keeps the jitter digital, not smooth. */
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

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bars = buildBars(width, height);
    };

    const paint = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const tick = Math.floor(t / STEP_MS);
      const live = !reduced.matches;

      for (const bar of bars) {
        if (live) {
          if (pointer.active) {
            const dx = bar.x + bar.w / 2 - pointer.x;
            const dy = bar.y - pointer.y;
            const d = Math.hypot(dx, dy);
            if (d < REACH) bar.energy = Math.max(bar.energy, 1 - d / REACH);
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

      if (running) frame = requestAnimationFrame(paint);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    const onThemeChange = () => {
      palette = readPalette();
    };
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        frame = requestAnimationFrame(paint);
      }
    };

    resize();
    frame = requestAnimationFrame(paint);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
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
