"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "@/components/ui/motion-provider";

/**
 * The preloader.
 *
 * One sentence condensing out of noise, over a field of dashes blowing across
 * the screen on the mark's own diagonal. The sentence is about the field: the
 * page's whole argument is scattered material becoming one finished thing,
 * which is also the mark read backwards, so the copy and the animation are
 * saying the same thing twice rather than one decorating the other.
 *
 * The dashes carry the site's glyphs and nothing else: hyphen, backslash, the
 * multiplication sign and the middot. All four are already on the page, and all
 * four are inside the Latin subset Plex Mono actually serves. A wider pool was
 * tried on the original and dropped: `what-this-is-not.tsx` records what
 * happens when a glyph falls outside the served range, which is tofu rather
 * than a graceful fallback.
 *
 * It runs on every arrival at the home page. A hard refresh is an arrival, and
 * so is coming back from another route, so both play it. Other routes never
 * show it.
 *
 * Nothing here is required for the page to work, and that is the point of how
 * it is built. Every piece of timing lives in CSS, keyed off a `data-preload`
 * attribute the inline head script stamps on `<html>` during parse. This file
 * owns three things: the canvas field, the scramble, and re-stamping that
 * attribute on a return the head script cannot see. The first two are
 * decorative. If it never hydrates the overlay still fades its sentence in,
 * still wipes off on the slash, still clears, and still hands the hero its
 * entrance on time. If JavaScript is off entirely the attribute is never set
 * and there is no overlay at all.
 *
 * That split is also why the exit is not scheduled here. A JS-owned exit is a
 * JS-owned failure: one thrown error and the reader is behind a full-screen
 * panel with no way out.
 *
 * Under reduced motion the field paints one frame and stops, the sentence is
 * never scrambled, and the wipe becomes an opacity fade. The same shape as
 * `glitch-field`, for the same reason: a still image costs one paint, and a
 * loop that produces an identical frame at display refresh rate costs a phone
 * its battery on behalf of someone who asked for less.
 */

/** The sentence. The full stop is a sibling node so the accent survives the
    scramble, and so it can arrive as punctuation once the line resolves. */
const LINE = "Everything here was noise first";

/** Scramble pool. ASCII only, so Plex Mono is guaranteed to cover it. The
    original included an em-dash, which this repo does not use anywhere. */
const SCRAMBLE_POOL = "!<>-_\\/[]{}=+*^?#";

/** The field's glyphs, weighted by repetition rather than by a table.
    The hyphen carries six tenths of it on purpose: the mark is horizontal bars,
    and an even split across four glyphs read as rain rather than as those bars
    moving. The backslash is the mark's own. */
const FIELD_POOL = ["-", "-", "-", "-", "-", "-", "\\", "\\", "×", "·"];

/** Matches `--preload-total` in globals.css. The loop stops itself here rather
    than being torn down, so a hidden tab that never schedules a frame simply
    never runs it. */
const TOTAL_MS = 2200;
/** Matches `--preload-resolve`. Every character is legible by this point. */
const RESOLVE_MS = 1100;
/** The wind decays to nothing across this span, so the field is already still
    when the sentence completes. */
const CALM_FROM = 1100;
const CALM_TO = 1600;

const MAX_DPR = 2;
/** Longest frame the loop will integrate. A backgrounded tab returning after
    two seconds would otherwise advance every mark straight off the canvas. */
const MAX_FRAME_MS = 50;
/** Five discrete sizes rather than a continuum. `ctx.font` is the expensive
    write in a text field, so marks are grouped and it lands five times a frame
    instead of once per mark. */
const SIZE_STEPS = [0.72, 0.9, 1.1, 1.38, 1.85];
/** Threshold on a mark's own speed times the current gust, both dimensionless,
    above which it draws ghosts back along the wind. Set low enough that roughly
    a third of the field is streaking at peak gust: at 1.15 the streaks were
    technically present and never once visible. */
const STREAK_AT = 0.8;

/**
 * When `data-preload` comes off `<html>`.
 *
 * Not at the end of the overlay. The attribute carries the entrance offset as
 * well as the overlay, and those entrances are still running: the last of them
 * starts at 1900ms plus its own 760ms step and takes 620ms more. Dropping the
 * attribute under a running animation rewrites its delay from beneath it, and
 * an entrance whose delay retroactively becomes shorter than its own elapsed
 * time does not play, it appears finished.
 *
 * It comes off at all so that nothing mounting later on this route inherits an
 * offset for an overlay that ended seconds ago.
 */
const RELEASE_MS = 3600;

/**
 * How late this file may arrive and still rewind the sequence to meet it.
 *
 * The two halves of the preloader start at different moments and there is no
 * arranging otherwise: CSS begins at first render, and nothing here can run
 * until React has hydrated. On a warm cache that gap is tens of milliseconds
 * and nobody could see it. On a cold one, or a development bundle, it is well
 * past a second, and the component then woke to find the scramble's own
 * deadline behind it and the wind already decayed to nothing. What the reader
 * got was a plain sentence on an empty ground, which is the whole effect
 * missing while every timing in the file was technically correct.
 *
 * So the CSS clock is rewound on mount instead, and both halves run from zero
 * together. Past this point they are not: the ground has begun to leave, and
 * rewinding would pull a cover back over a page the reader can already see. A
 * late arrival that late does nothing at all and lets the CSS finish alone.
 */
const SYNC_BEFORE_MS = 1700;

/**
 * The animations a rewind is allowed to touch: this file's own, plus the two
 * load-time entrances that are offset to wait for it.
 *
 * The timeline check is not optional. `.reveal` runs `algobic-rise` as well, on
 * a scroll timeline, and rewinding one of those would drag content back to its
 * unentered state at whatever scroll position the reader happens to be at.
 */
const SYNCABLE = /^(preload-|algobic-rise$|algobic-draw$)/;

function rewindSequence() {
  for (const anim of document.getAnimations()) {
    const name = (anim as CSSAnimation).animationName;
    if (!name || !SYNCABLE.test(name)) continue;
    if (anim.timeline !== document.timeline) continue;
    anim.currentTime = 0;
  }
}

type Mark = {
  x: number;
  y: number;
  /** Multiplier on the shared wind. The spread is what makes it a field rather
      than a conveyor belt. */
  speed: number;
  glyph: string;
  /** Index into `SIZE_STEPS`. Marks are stored sorted by it. */
  step: number;
  alpha: number;
  accent: boolean;
  /** Elapsed time at which this mark takes a different glyph. */
  swapAt: number;
};

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

/** Indexed off the string rather than spread into an array. Spreading allocated
    a seventeen element array per character per frame, which is the kind of
    garbage a phone pays for in dropped frames rather than in memory. */
function dud() {
  return SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
}

/** Swap interval, shortened by wind. A gust scrambles the field harder, which
    is the same coupling the centre line has between noise and resolution. */
function nextSwap(t: number, gust: number) {
  return t + (70 + Math.random() * 520) / (0.35 + gust);
}

function buildMarks(w: number, h: number): Mark[] {
  const target = Math.min(Math.max(Math.round((w * h) / 2600), 120), 460);
  const marks: Mark[] = [];

  for (let i = 0; i < target; i++) {
    marks.push({
      x: Math.random() * w,
      // Overshoots the box top and bottom. Marks drift downward as they travel,
      // so seeding only inside the viewport leaves the top third bare within a
      // second.
      y: Math.random() * h * 1.5 - h * 0.35,
      // Squared, so most of the field is slow and a few marks tear across it.
      speed: 0.32 + Math.random() * Math.random() * 2,
      glyph: pick(FIELD_POOL),
      step: Math.floor(Math.random() * Math.random() * SIZE_STEPS.length),
      alpha: 0.12 + Math.random() * 0.46,
      accent: Math.random() < 0.1,
      swapAt: 0,
    });
  }

  return marks.sort((a, b) => a.step - b.step);
}

function readField() {
  const s = getComputedStyle(document.documentElement);
  return {
    // `--foreground` at low alpha, which is what `glitch-field` uses for the
    // same material. `--shard` was tried first on the grounds that it is named
    // the shatter field's ambient ink, and on the dark ground it is #2e2640
    // against #08070c: at these alphas the whole field read as dust on the
    // lens rather than as anything moving.
    ink: s.getPropertyValue("--foreground").trim() || "#888",
    accent: s.getPropertyValue("--accent").trim() || "#f70",
    mono: `${s.getPropertyValue("--font-plex-mono").trim()}, ui-monospace, monospace`,
    // 16deg, or 8deg on a phone. The field runs on the site's only angle, so
    // the wind and the exit wipe are the same gesture at two scales.
    angle: (parseFloat(s.getPropertyValue("--slash-angle")) || 16) *
      (Math.PI / 180),
  };
}

export function Preloader() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  /**
   * The route the last run belonged to, and null before any of them.
   *
   * A boolean was the obvious thing and it is wrong in development, where
   * StrictMode mounts every effect twice: the second pass saw the flag already
   * set, read it as a return visit, and restarted a sequence that was two
   * frames old. Comparing the route instead makes a repeat of the same route a
   * no-op and a genuine return the only thing that restarts.
   */
  const ranFor = React.useRef<string | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    const html = document.documentElement;
    const root = rootRef.current;
    const canvas = canvasRef.current;

    // Home only. Every other route drops the attribute, which is also what
    // releases the entrance offset on anything that route renders.
    if (pathname !== "/") {
      html.removeAttribute("data-preload");
      ranFor.current = pathname;
      return;
    }

    if (!root || !canvas) return;

    // Arriving back at the home page without a document load. The head script
    // runs once per document and cannot see this, so the attribute is cycled
    // by hand. Removing it drops every animation the attribute selector
    // created; the reflow between commits that removal, so adding it back
    // builds them again from zero rather than adopting the finished ones.
    if (ranFor.current !== null && ranFor.current !== pathname) {
      html.removeAttribute("data-preload");
      void root.offsetWidth;
      html.setAttribute("data-preload", "");
    }
    ranFor.current = pathname;

    if (!html.hasAttribute("data-preload")) return;

    // Flips `.preloader__line` from invisible to its real reveal in globals.css.
    // Before this, the sentence sits server-rendered but hidden, so nobody sees
    // the finished line before this component exists to scramble it. Set before
    // anything else in this effect so the reveal lands with the same frame as
    // the field and text setup below, not a tick after it.
    root.classList.add("preloader--ready");

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    let field = readField();
    const cells = Array.from(
      root.querySelectorAll<HTMLElement>("[data-cell]")
    ).map((el, i) => ({
      el,
      /* Taken from the constant, not from the node. On a second run the node
         holds whatever the last run left in it, and a run abandoned mid
         scramble leaves a dud. Reading the DOM here made the sentence decay a
         character at a time across repeat visits. */
      to: LINE[i] ?? "",
      /* Resolution order, not entry order. Every character is noise from the
         first frame, so the only thing staggered is when each one stops. */
      end: RESOLVE_MS * (0.35 + Math.random() * 0.65),
      /* -1 before the first frame, 0 while scrambling, 1 once resolved.
         Compared before every write, so a settled character is not rewritten
         sixty times a second and the dud class is set once rather than always. */
      state: -1,
    }));

    let marks: Mark[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    let last = 0;
    let textDone = reduced;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      // Assigned only past the guard. Writing them first and bailing afterwards
      // left the closure holding a zero width, which every later frame divided
      // the wind by.
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!marks.length) {
        marks = buildMarks(w, h);
      } else {
        // Carried across rather than rebuilt. A phone collapsing its URL bar
        // fires this, and reseeding threw away every position, glyph and swap
        // schedule, so the field visibly restarted a second into a two second
        // sequence. Positions scale with the box, which keeps the composition.
        const sx = w / width;
        const sy = h / height;
        for (const mark of marks) {
          mark.x *= sx;
          mark.y *= sy;
        }
      }

      width = w;
      height = h;
      // The slash halves below 40rem, and a rotation can cross that. Re-read, or
      // the wind keeps blowing on an angle the exit wipe no longer uses.
      field = readField();
    };

    /** Base travel in pixels per millisecond at wind 1, speed 1. Derived from
        the viewport so a phone and a desktop read at the same tempo rather than
        the same absolute rate. */
    const base = () => width / 2600;

    const paintField = (t: number, dt: number) => {
      const dx = Math.cos(field.angle);
      const dy = Math.sin(field.angle);
      // Two periods beating against each other. One sine reads as a pulse; two
      // incommensurate ones read as weather.
      const gust = reduced
        ? 0
        : Math.max(
            0,
            (0.58 + Math.sin(t / 620) * 0.24 + Math.sin(t / 271) * 0.18) *
              (1 - Math.min(Math.max((t - CALM_FROM) / (CALM_TO - CALM_FROM), 0), 1))
          );

      const travel = base() * gust * dt;
      const size = Math.min(Math.max(width / 74, 11), 22);
      const margin = size * 3;

      ctx.clearRect(0, 0, width, height);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let step = -1;
      let fill = "";

      for (const mark of marks) {
        if (travel > 0) {
          const d = travel * mark.speed;
          mark.x += d * dx;
          mark.y += d * dy;
          if (t >= mark.swapAt) {
            mark.glyph = pick(FIELD_POOL);
            mark.swapAt = nextSwap(t, gust);
          }
          if (mark.x > width + margin || mark.y > height + margin) {
            mark.x = -margin;
            mark.y = Math.random() * height * 1.35 - height * 0.3;
            mark.glyph = pick(FIELD_POOL);
          }
        }

        if (mark.step !== step) {
          step = mark.step;
          ctx.font = `500 ${size * SIZE_STEPS[step]}px ${field.mono}`;
        }
        const next = mark.accent ? field.accent : field.ink;
        if (next !== fill) {
          fill = next;
          ctx.fillStyle = next;
        }

        // Speed as blur. A mark moving fast enough leaves two dimmer copies of
        // itself back along the wind, which is what stops a hard glyph at high
        // travel from reading as a jump cut between frames.
        const streak = mark.speed * gust;
        if (streak > STREAK_AT) {
          const reach = size * (streak - STREAK_AT) * 1.4;
          for (let g = 2; g >= 1; g--) {
            ctx.globalAlpha = (mark.alpha * 0.3) / g;
            ctx.fillText(
              mark.glyph,
              mark.x - dx * reach * g,
              mark.y - dy * reach * g
            );
          }
        }

        ctx.globalAlpha = mark.alpha;
        ctx.fillText(mark.glyph, mark.x, mark.y);
      }

      ctx.globalAlpha = 1;
    };

    const paintText = (t: number) => {
      let done = 0;

      for (const cell of cells) {
        if (t >= cell.end) {
          if (cell.state !== 1) {
            cell.el.textContent = cell.to;
            cell.el.removeAttribute("data-dud");
            cell.state = 1;
          }
          done++;
          continue;
        }
        // Spaces are never scrambled. A moving gap between words reads as a
        // typo rather than as noise, and it costs the line its word shapes,
        // which is the thing that makes a resolve legible before it finishes.
        if (cell.to === " ") {
          done++;
          continue;
        }
        if (cell.state !== 0) {
          // First frame for this character. The write is unconditional here:
          // the markup ships as the finished sentence, so leaving it to the
          // probability below meant roughly seven characters in ten spent the
          // opening frame showing the answer.
          cell.el.setAttribute("data-dud", "");
          cell.el.textContent = dud();
          cell.state = 0;
          continue;
        }
        // Held for a few frames at a time. Swapping every character every frame
        // is a uniform grey shimmer, not noise.
        if (Math.random() < 0.28) cell.el.textContent = dud();
      }

      if (done === cells.length) textDone = true;
    };

    /**
     * The finished sentence, unconditionally.
     *
     * The loop's exit test runs before it paints, so a frame that arrives with
     * the clock already past the end returns without ever resolving the line.
     * That is not a rare path: a starved rAF on a throttled device, or a tab
     * backgrounded across the whole sequence, both produce exactly one enormous
     * jump between frames. Measured under a 6x CPU throttle, the overlay wiped
     * away on schedule and left the sentence stranded as noise underneath it.
     *
     * Cheap enough to run on every exit rather than reason about which ones
     * need it.
     */
    const settleText = () => {
      for (const cell of cells) {
        if (cell.state === 1) continue;
        cell.el.textContent = cell.to;
        cell.el.removeAttribute("data-dud");
        cell.state = 1;
      }
      textDone = true;
    };

    /**
     * The CSS clock, read rather than reconstructed.
     *
     * `.preloader` carries `preload-clear`, whose `currentTime` counts from the
     * moment the browser started the overlay's animations and runs through its
     * delay to the end of the sequence. Every other time in this file is
     * measured against the same origin, so the sentence cannot resolve against
     * a wipe that has already begun.
     *
     * Reconstructing it here was tried and is what this replaces. An effect
     * captures `performance.now()` after hydration, CSS started counting at
     * first render, and the gap between those two is a whole device class: on a
     * slow client the field was still at full gust while the ground was leaving.
     *
     * `performance.now()` is the fallback rather than the default. Navigation
     * start is earlier than the moment the animations began, so it reads a
     * larger number than the CSS clock and every cue it drives lands ahead of
     * schedule. That is the safe direction: the sentence finishes before the
     * wipe rather than during it.
     */
    const clock = root.getAnimations()[0] ?? null;
    const readClock = () =>
      typeof clock?.currentTime === "number"
        ? clock.currentTime
        : performance.now();

    const frame = (now: number) => {
      const t = readClock();
      if (t >= TOTAL_MS) {
        running = false;
        settleText();
        // Releases the bitmap. The overlay is at zero opacity from here and
        // stays in the document for the life of it, and a full screen canvas
        // is four bytes a pixel held for nothing.
        canvas.width = 0;
        canvas.height = 0;
        return;
      }

      const dt = Math.min(now - last, MAX_FRAME_MS);
      last = now;

      paintField(t, dt);
      if (!textDone) paintText(t);

      if (running) raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      resize();
      if (reduced) paintField(TOTAL_MS, 0);
    };

    // The overlay takes no clicks, so the theme toggle behind it is live for the
    // whole two seconds. Anyone who hits it is clicking somewhere they cannot
    // see, which is unlikely and not impossible, and the ground under the field
    // flips instantly because it is a custom property while the canvas keeps
    // whatever it read at setup. Same observer `glitch-field` uses.
    const onTheme = () => {
      field = readField();
      if (reduced) paintField(TOTAL_MS, 0);
    };
    const themeObserver = new MutationObserver(onTheme);
    themeObserver.observe(html, {
      attributes: true,
      attributeFilter: ["class"],
    });

    resize();

    // Both halves from zero, or neither. Done after `resize()` so the first
    // frame the rewind buys has a sized canvas and a built field to paint.
    if (readClock() < SYNC_BEFORE_MS) rewindSequence();

    if (reduced) {
      // One frame. Nothing above mutates at gust zero, so a second frame would
      // be pixel-identical to this one, and the sentence is already its own
      // finished state in the markup.
      paintField(0, 0);
      running = false;
    } else {
      // Only reachable when the rewind above declined, which means the ground
      // is already leaving. Pulling a resolved sentence back into noise under a
      // wipe in progress reads as a fault rather than as an entrance.
      if (readClock() > RESOLVE_MS) textDone = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener("resize", onResize, { passive: true });

    const release = window.setTimeout(() => {
      html.removeAttribute("data-preload");
      window.removeEventListener("resize", onResize);
      themeObserver.disconnect();
    }, RELEASE_MS);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(release);
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      // A navigation away mid scramble would otherwise park a row of duds in
      // the markup, which is the state the next visit paints before its own
      // first frame.
      settleText();
    };
  }, [pathname]);

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      {/* The ground. It leaves on the slash, which is the only angle the site
          owns, so the page is uncovered from the top left and the hero is the
          first thing exposed. */}
      <div className="preloader__sheet" />

      <div className="preloader__content">
        <canvas ref={canvasRef} className="preloader__field" />

        {/* Server rendered as the finished sentence, one span per character.
            The resting state of this element is legible text, so the worst a
            failed scramble can do is show the line early. Splitting it here
            rather than at runtime also means there is no rewrite of the DOM
            between hydration and the first frame. */}
        <p className="preloader__line">
          <span>
            {[...LINE].map((ch, i) => (
              <span key={i} data-cell>
                {ch}
              </span>
            ))}
          </span>
          <span className="preloader__stop">.</span>
        </p>
      </div>
    </div>
  );
}
