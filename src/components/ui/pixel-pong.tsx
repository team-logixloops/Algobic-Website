"use client";

import * as React from "react";

/**
 * The 404, as a board you can break.
 *
 * The bricks are not a bitmap font. They are traced from the real `<h1>` at
 * runtime: the heading's own computed `font-family`, `font-size`, `font-weight`
 * and `letter-spacing` are copied onto an offscreen 2D context, the word is
 * drawn once, and every grid cell whose alpha clears the threshold becomes a
 * brick. The CSS stays the single source of truth for the type and the canvas
 * only follows it, so changing the clamp on the heading changes the bricks and
 * nothing here needs to know.
 *
 * The heading only goes transparent once a sample has actually produced bricks.
 * Without JS, without a 2D context, or with a webfont that never arrived, the
 * page is a readable Orbitron 404 and a working link. A failure here cannot
 * leave the headline invisible.
 *
 * Colours come from the theme's custom properties rather than literals, and the
 * canvas never fills its background, so the view-transition theme wipe passes
 * straight over the board instead of hitting an opaque rectangle.
 *
 * Under reduced motion the board is sampled, painted once, and left alone. No
 * frame is ever scheduled and no input is bound.
 */

type Brick = { x: number; y: number; hit: boolean };

type Ball = { x: number; y: number; dx: number; dy: number; half: number };

type Paddle = {
  x: number;
  y: number;
  w: number;
  h: number;
  vertical: boolean;
  player: boolean;
};

const MAX_DPR = 2;
/** Cells across the heading's ink height. Fourteen keeps Orbitron's squared
    counters legible while staying coarse enough to read as bricks. */
const ROWS = 14;
const MIN_CELL = 4;
const ALPHA_HIT = 128;
const BALL_CELLS = 1.5;
/** Detuned from the reference component's 0.1. At 0.1 the three AI paddles
    cover everything and the player's paddle decides nothing. */
const AI_LERP = 0.06;
const PLAYER_LERP = 0.35;
/** How far off-centre a hit on the player's paddle bends the ball. Without it
    the paddle is a wall and there is no skill in the game. */
const SPIN = 0.75;
/** Reference speed in px per frame, scaled against a 900px board. */
const BASE_SPEED = 5.2;
const SPEED_REF = 900;
const KEY_STEP = 16;
/** Floor on the vertical component, or a shallow rally can leave the ball
    skimming a wall for thousands of frames without reaching a brick. */
const MIN_VERTICAL = 0.28;

function readPalette() {
  const s = getComputedStyle(document.documentElement);
  return {
    ink: s.getPropertyValue("--foreground").trim() || "#0b0a0c",
    dead: s.getPropertyValue("--line").trim() || "#ddd7ce",
    live: s.getPropertyValue("--accent-ink").trim() || "#9c3d06",
    machine: s.getPropertyValue("--muted").trim() || "#6b6560",
  };
}

/**
 * `letterSpacing` on a 2D context is recent enough to need a guard, and it only
 * accepts a length: the computed value is `normal` whenever the heading has no
 * tracking, which would throw the assignment away anyway.
 */
function applyFont(
  ctx: CanvasRenderingContext2D,
  font: string,
  spacing: string
) {
  ctx.font = font;
  if (spacing.endsWith("px") && "letterSpacing" in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
      spacing;
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

type Sample = { bricks: Brick[]; cell: number };

/**
 * Trace the heading into bricks, positioned in the canvas's coordinate space.
 *
 * The offscreen canvas is sized to the text's actual ink box rather than to the
 * element box, so the brick block can be centred on the heading without any
 * baseline arithmetic. Resizing a canvas resets its context, which is why the
 * font is applied twice.
 */
function sampleHeading(
  heading: HTMLElement,
  headingBox: DOMRect,
  canvasBox: DOMRect
): Sample {
  const text = (heading.textContent ?? "").trim();
  if (!text) return { bricks: [], cell: 0 };

  const style = getComputedStyle(heading);
  const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const spacing = style.letterSpacing;

  const off = document.createElement("canvas");
  off.width = Math.max(1, Math.ceil(headingBox.width));
  off.height = Math.max(1, Math.ceil(headingBox.height));
  const octx = off.getContext("2d", { willReadFrequently: true });
  if (!octx) return { bricks: [], cell: 0 };

  applyFont(octx, font, spacing);
  const metrics = octx.measureText(text);
  const inkW = Math.ceil(
    metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
  );
  const inkH = Math.ceil(
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
  );
  if (inkW < 1 || inkH < 1) return { bricks: [], cell: 0 };

  off.width = inkW;
  off.height = inkH;
  applyFont(octx, font, spacing);
  octx.fillStyle = "#fff";
  octx.fillText(text, metrics.actualBoundingBoxLeft, metrics.actualBoundingBoxAscent);

  const cell = Math.max(MIN_CELL, Math.round(inkH / ROWS));
  const cols = Math.ceil(inkW / cell);
  const rows = Math.ceil(inkH / cell);
  const alpha = octx.getImageData(0, 0, inkW, inkH).data;

  // The brick block is centred on the heading's box, which is already centred
  // in the layout, so this survives any change to the heading's clamp.
  const originX =
    headingBox.left - canvasBox.left + (headingBox.width - inkW) / 2;
  const originY =
    headingBox.top - canvasBox.top + (headingBox.height - inkH) / 2;

  const bricks: Brick[] = [];
  // Four probes per cell rather than one at the centre: a single centre sample
  // drops the thinnest part of a stroke and leaves holes in the glyph.
  const probes = [0.3, 0.7];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let a = 0;
      for (const fx of probes) {
        for (const fy of probes) {
          const sx = Math.min(inkW - 1, Math.floor((c + fx) * cell));
          const sy = Math.min(inkH - 1, Math.floor((r + fy) * cell));
          a = Math.max(a, alpha[(sy * inkW + sx) * 4 + 3]);
        }
      }
      if (a > ALPHA_HIT) {
        bricks.push({ x: originX + c * cell, y: originY + r * cell, hit: false });
      }
    }
  }

  return { bricks, cell };
}

export function PixelPong({ className = "" }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const [cleared, setCleared] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const heading = headingRef.current;
    if (!canvas || !heading) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let palette = readPalette();
    let disposed = false;

    let width = 0;
    let height = 0;
    let cell = 0;
    let gap = 1;
    let speed = BASE_SPEED;
    let bricks: Brick[] = [];
    let remaining = 0;
    let paddles: Paddle[] = [];
    let player: Paddle | null = null;
    let ball: Ball = { x: 0, y: 0, dx: 0, dy: 0, half: 0 };
    let targetX = 0;
    let frame = 0;
    let running = false;
    let announced = false;
    let fontsReady = false;
    let lastW = 0;
    let lastH = 0;
    /** Canvas left edge in viewport space. Cached so pointer moves never force
        a layout read; this page does not scroll, so a resize is the only thing
        that can invalidate it. */
    const box = { left: 0 };
    const keys = { left: false, right: false };

    /**
     * Hold the ball at a constant speed, with a floor under the vertical
     * component so a shallow rally cannot leave it skimming a wall forever.
     *
     * The horizontal component is solved out of the speed budget rather than
     * renormalised after the floor is applied. Renormalising pulls the vertical
     * back under the floor, which re-triggers the correction and converges on
     * the floor without ever reaching it.
     */
    const normalise = () => {
      const s = Math.hypot(ball.dx, ball.dy) || 1;
      ball.dx = (ball.dx / s) * speed;
      ball.dy = (ball.dy / s) * speed;

      const floor = speed * MIN_VERTICAL;
      if (Math.abs(ball.dy) < floor) {
        ball.dy = Math.sign(ball.dy || 1) * floor;
        ball.dx =
          Math.sign(ball.dx || 1) *
          Math.sqrt(Math.max(0, speed * speed - floor * floor));
      }
    };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const rect = canvas.getBoundingClientRect();
      box.left = rect.left;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      // Left stale on failure on purpose, so the next resize retries rather
      // than matching against dimensions that never produced a board.
      if (width < 1 || height < 1) return false;
      lastW = width;
      lastH = height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Measured while the heading is opaque and laid out. Reset first so a
      // rebuild measures the real box rather than a previously hidden one.
      heading.style.color = "";
      const sample = sampleHeading(heading, heading.getBoundingClientRect(), rect);
      if (!sample.bricks.length) return false;

      bricks = sample.bricks;
      cell = sample.cell;
      gap = Math.max(1, Math.round(cell * 0.12));
      remaining = bricks.length;
      announced = false;
      heading.style.color = "transparent";

      speed =
        BASE_SPEED *
        Math.max(0.6, Math.min(1.4, Math.min(width, height) / SPEED_REF));

      const half = (cell * BALL_CELLS) / 2;
      ball = {
        x: width * 0.86,
        y: height * 0.14,
        dx: -speed,
        dy: speed,
        half,
      };
      normalise();

      const thick = Math.max(6, cell);
      const len = Math.max(64, Math.min(220, Math.min(width, height) * 0.26));
      paddles = [
        { x: 0, y: (height - len) / 2, w: thick, h: len, vertical: true, player: false },
        { x: width - thick, y: (height - len) / 2, w: thick, h: len, vertical: true, player: false },
        { x: (width - len) / 2, y: 0, w: len, h: thick, vertical: false, player: false },
        { x: (width - len) / 2, y: height - thick, w: len, h: thick, vertical: false, player: true },
      ];
      player = paddles[3];
      targetX = player.x;
      return true;
    };

    const step = () => {
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Every wall reflects. There is no fail state on an error page.
      if (ball.x - ball.half < 0) {
        ball.x = ball.half;
        ball.dx = Math.abs(ball.dx);
      } else if (ball.x + ball.half > width) {
        ball.x = width - ball.half;
        ball.dx = -Math.abs(ball.dx);
      }
      if (ball.y - ball.half < 0) {
        ball.y = ball.half;
        ball.dy = Math.abs(ball.dy);
      } else if (ball.y + ball.half > height) {
        ball.y = height - ball.half;
        ball.dy = -Math.abs(ball.dy);
      }

      for (const p of paddles) {
        if (
          ball.x + ball.half <= p.x ||
          ball.x - ball.half >= p.x + p.w ||
          ball.y + ball.half <= p.y ||
          ball.y - ball.half >= p.y + p.h
        ) {
          continue;
        }
        if (p.vertical) {
          if (ball.x < p.x + p.w / 2) {
            ball.x = p.x - ball.half;
            ball.dx = -Math.abs(ball.dx);
          } else {
            ball.x = p.x + p.w + ball.half;
            ball.dx = Math.abs(ball.dx);
          }
        } else {
          if (ball.y < p.y + p.h / 2) {
            ball.y = p.y - ball.half;
            ball.dy = -Math.abs(ball.dy);
          } else {
            ball.y = p.y + p.h + ball.half;
            ball.dy = Math.abs(ball.dy);
          }
          if (p.player) {
            const off = (ball.x - (p.x + p.w / 2)) / (p.w / 2);
            ball.dx += off * SPIN * speed;
            normalise();
          }
        }
      }

      // Flips are collected and applied once per axis. Flipping inside the loop
      // means a ball clearing three bricks in one frame reverses the same axis
      // three times, which cancels itself out and drives it through the wall.
      let flipX = false;
      let flipY = false;
      for (const b of bricks) {
        if (b.hit) continue;
        if (
          ball.x + ball.half <= b.x ||
          ball.x - ball.half >= b.x + cell ||
          ball.y + ball.half <= b.y ||
          ball.y - ball.half >= b.y + cell
        ) {
          continue;
        }
        b.hit = true;
        remaining--;
        const overlapX =
          Math.min(ball.x + ball.half, b.x + cell) -
          Math.max(ball.x - ball.half, b.x);
        const overlapY =
          Math.min(ball.y + ball.half, b.y + cell) -
          Math.max(ball.y - ball.half, b.y);
        if (overlapX < overlapY) flipX = true;
        else flipY = true;
      }
      if (flipX) ball.dx = -ball.dx;
      if (flipY) ball.dy = -ball.dy;

      if (remaining <= 0 && !announced) {
        announced = true;
        setCleared(true);
      }

      if (player) {
        if (keys.left) targetX -= KEY_STEP;
        if (keys.right) targetX += KEY_STEP;
        targetX = Math.max(0, Math.min(width - player.w, targetX));
        player.x += (targetX - player.x) * PLAYER_LERP;
      }

      for (const p of paddles) {
        if (p.player) continue;
        if (p.vertical) {
          const want = Math.max(
            0,
            Math.min(height - p.h, ball.y - p.h / 2)
          );
          p.y += (want - p.y) * AI_LERP;
        } else {
          const want = Math.max(0, Math.min(width - p.w, ball.x - p.w / 2));
          p.x += (want - p.x) * AI_LERP;
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const size = Math.max(1, cell - gap);

      for (const b of bricks) {
        ctx.fillStyle = b.hit ? palette.dead : palette.ink;
        ctx.fillRect(b.x, b.y, size, size);
      }

      // Square, not the reference's arc. Nothing else on this site is round,
      // and the ball is the same shape as the brick it destroys.
      ctx.fillStyle = palette.live;
      ctx.fillRect(
        ball.x - ball.half,
        ball.y - ball.half,
        ball.half * 2,
        ball.half * 2
      );

      for (const p of paddles) {
        ctx.fillStyle = p.player ? palette.live : palette.machine;
        ctx.fillRect(p.x, p.y, p.w, p.h);
      }
    };

    const loop = () => {
      step();
      draw();
      if (running) frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduced.matches || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!player) return;
      targetX = e.clientX - box.left - player.w / 2;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keys.left = true;
      else if (e.key === "ArrowRight") keys.right = true;
      else return;
      e.preventDefault();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keys.left = false;
      else if (e.key === "ArrowRight") keys.right = false;
    };

    const bindInput = () => {
      canvas.tabIndex = 0;
      canvas.removeAttribute("aria-hidden");
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerMove, { passive: true });
      canvas.addEventListener("keydown", onKeyDown);
      canvas.addEventListener("keyup", onKeyUp);
    };

    const unbindInput = () => {
      keys.left = false;
      keys.right = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      canvas.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("keyup", onKeyUp);
    };

    /**
     * A still board is not operable, so it must not be a focus stop either. The
     * heading and the line already carry everything this canvas is drawing.
     */
    const goStatic = () => {
      unbindInput();
      canvas.tabIndex = -1;
      canvas.setAttribute("aria-hidden", "true");
    };

    const rebuild = () => {
      stop();
      if (!build()) {
        heading.style.color = "";
        return;
      }
      draw();
      if (reduced.matches) goStatic();
      else {
        bindInput();
        start();
      }
    };

    const onThemeChange = () => {
      palette = readPalette();
      // The new colours have to reach a board that has stopped scheduling.
      if (!running) draw();
    };

    const onMotionPreference = () => rebuild();
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!reduced.matches) start();
    };

    // Sampling before the webfont lands traces the fallback face, and the
    // bricks come out shaped like Arial.
    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => {
      if (disposed) return;
      fontsReady = true;
      rebuild();
    });

    const resizeObserver = new ResizeObserver(() => {
      // Two things to ignore. The observer delivers once on observe, which
      // lands before the font does and would trace the fallback face; and it
      // delivers again right after the build that just set these dimensions.
      if (!fontsReady) return;
      if (canvas.clientWidth === lastW && canvas.clientHeight === lastH) return;
      rebuild();
    });
    resizeObserver.observe(canvas);

    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onMotionPreference);

    return () => {
      disposed = true;
      stop();
      unbindInput();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotionPreference);
      heading.style.color = "";
    };
  }, []);

  return (
    <div className={`relative isolate h-full w-full ${className}`}>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        aria-label="Pong. Move the paddle with the left and right arrow keys and knock out the 404."
        className="absolute inset-0 z-0 h-full w-full touch-none"
      />

      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center text-center">
        <h1
          ref={headingRef}
          className="font-display text-[clamp(3.5rem,16vw,9rem)] leading-none font-bold tracking-[0.08em] text-foreground"
        >
          404
        </h1>

        <p
          className="pong-line eyebrow text-eyebrow mt-[clamp(1rem,3vh,1.75rem)]"
          data-cleared={cleared}
          aria-live="polite"
        >
          <span data-state="play">Break it</span>
          <span data-state="done">Now go build</span>
        </p>
      </div>
    </div>
  );
}
