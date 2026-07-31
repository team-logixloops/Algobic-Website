"use client";

import * as React from "react";

/**
 * The shatter field, in WebGL.
 *
 * Replaces the canvas-2D version, which drew a few hundred rectangles and could
 * not afford any more. A fragment shader draws the same vocabulary (thin
 * horizontal bars on a coarse row grid, mostly ink with an accent minority) at
 * whatever density the screen can carry, and gets three things the 2D version
 * could not have at any price:
 *
 * - Per-row displacement driven by pointer distance and scroll velocity, so the
 *   field tears rather than twitches.
 * - Chromatic split on the torn rows. The mark is ink plus one accent, so the
 *   split is between those two colours rather than the usual red/cyan, which
 *   would introduce two hues the brand does not own.
 * - A dissolve threshold that eats rows away from the edges as the hero leaves,
 *   which is the mark's own gesture applied to the whole screen.
 *
 * Raw WebGL, no library. This is one fullscreen triangle and one shader;
 * three.js would be 150 KB to avoid about eighty lines, and `ogl` would still
 * be a dependency for a file that needs no scene graph, no camera and no
 * geometry.
 *
 * Everything degrades. No WebGL, reduced motion, or a lost context that cannot
 * be rebuilt, and the canvas hides itself. The page beneath it is complete
 * without it.
 */

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

/**
 * Row-major on purpose. `row` quantises Y into bands the height of the mark's
 * own shards, and every displacement is applied per row rather than per pixel,
 * which is what keeps this reading as broken horizontal bars instead of as
 * generic noise.
 */
const FRAG = `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uPointer;      // pixels, -1000 when absent
uniform float uVelocity;     // normalised scroll speed, 0..1
uniform float uReveal;       // 0 at load, 1 once the intro has run
uniform float uDissolve;     // 0 at rest, 1 as the hero leaves
uniform vec3  uInk;
uniform vec3  uAccent;
uniform vec3  uShard;

out vec4 fragColor;

float hash(vec2 v) {
  return fract(sin(dot(v, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 uv = px / uRes;

  // Row grid, scaled so a phone gets fewer, thicker bars than a desktop.
  float rowH = mix(9.0, 15.0, clamp(uRes.x / 1600.0, 0.0, 1.0));
  float row  = floor(px.y / rowH);
  float rSeed = hash(vec2(row, 3.7));

  // Pointer tears the rows nearest it. Distance is measured to the row, not to
  // the pixel, so a whole bar moves together.
  float pointerY = distance(px.y, uPointer.y);
  float pointerX = distance(px.x, uPointer.x);
  float near = uPointer.x < -900.0
    ? 0.0
    : exp(-pointerY / 90.0) * exp(-pointerX / 420.0);

  // Scroll shears everything, unevenly.
  float shear = uVelocity * (hash(vec2(row, floor(uTime * 8.0))) - 0.5) * 2.0;

  float energy = clamp(near * 1.4 + abs(shear), 0.0, 1.0);

  // Ambient: a row occasionally jumps on its own, quantised in time so it reads
  // digital rather than smooth.
  float tick = floor(uTime * 11.0);
  float amb = step(0.9955, hash(vec2(row, tick))) * 0.55;
  energy = max(energy, amb);

  float offset = (hash(vec2(row, tick)) - 0.5) * energy * 260.0
               + shear * 90.0;

  float x = px.x + offset;

  // Bars along the row. Widths vary by a lot: the artwork's clusters are long
  // trails next to single ticks, never an even dash pattern.
  float cell   = 46.0 + hash(vec2(row, 11.0)) * 150.0;
  float ci     = floor(x / cell);
  float cSeed  = hash(vec2(ci, row));
  float w      = 0.06 + cSeed * cSeed * 0.72;
  float inBar  = step(fract(x / cell), w);

  // Thickness. Without this the bar fills its whole row, the rows tile with no
  // gap between them, and the field reads as a loading skeleton rather than as
  // the mark: the artwork is thin rules with air around them, not blocks.
  float thick  = 2.0 + step(0.82, hash(vec2(row, 29.0))) * 1.0;
  inBar *= step(fract(px.y / rowH), thick / rowH);

  // Density thins toward the middle so type always sits on quiet ground, but
  // never to nothing: a field that vanishes behind the headline reads as a
  // rendering failure rather than as restraint.
  float band = abs(uv.y - 0.5) * 2.0;
  float keep = step(hash(vec2(ci, row + 91.0)), 0.34 + band * band * 1.05);

  float a = inBar * keep;

  // Dissolve eats rows from the outside in as the hero leaves.
  a *= step(uDissolve, band * 0.55 + rSeed * 0.6);

  // Intro: rows arrive from the top down.
  a *= step(1.0 - uReveal, uv.y * 0.85 + rSeed * 0.15);

  if (a < 0.01) discard;

  bool isAccent = hash(vec2(ci, row + 5.0)) < 0.24 || energy > 0.42;
  // Mostly ink. --shard is a light tint tuned for a 2px hairline on paper, and
  // at 45% toward ink it landed within a few percent of the background: the
  // field was drawing correctly and could not be seen.
  vec3 col = isAccent ? uAccent : mix(uShard, uInk, 0.82);

  // Chromatic split on torn rows, between the two colours the brand owns.
  float split = step(0.5, fract(x / cell + energy * 0.35));
  col = mix(col, isAccent ? uInk : uAccent, energy * 0.45 * split);

  float alpha = (0.10 + hash(vec2(ci, row + 17.0)) * 0.22 + energy * 0.55);
  fragColor = vec4(col, min(alpha, 0.85) * a);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

/** "#ff7712" to [1, 0.46, 0.07]. Reads whatever the theme currently is. */
function readPalette() {
  const s = getComputedStyle(document.documentElement);
  const rgb = (name: string, fallback: string) => {
    const hex = (s.getPropertyValue(name).trim() || fallback).replace("#", "");
    const n = parseInt(
      hex.length === 3
        ? hex
            .split("")
            .map((c) => c + c)
            .join("")
        : hex,
      16
    );
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  };
  return {
    ink: rgb("--foreground", "#000000"),
    accent: rgb("--accent", "#ff7712"),
    shard: rgb("--shard", "#b8b0a4"),
  };
}

const UNIFORMS = [
  "uRes",
  "uTime",
  "uPointer",
  "uVelocity",
  "uReveal",
  "uDissolve",
  "uInk",
  "uAccent",
  "uShard",
] as const;

export function ShatterGL({ className = "" }: { className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    /* Hidden from the effect rather than unmounted through state. Whether the
       GPU gives us a context is not React's business, and mirroring it into
       state costs a render, a commit and a second render to draw nothing. */
    const giveUp = () => {
      canvas.style.display = "none";
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      giveUp();
      return;
    }

    let gl: WebGL2RenderingContext | null = null;
    let prog: WebGLProgram | null = null;
    let buf: WebGLBuffer | null = null;
    let u: Record<string, WebGLUniformLocation | null> = {};

    let raf = 0;
    let running = false;
    let onScreen = true;
    let lost = false;
    let w = 0;
    let h = 0;

    let palette = readPalette();
    const startedAt = performance.now();
    const pointer = { x: -1000, y: -1000 };
    let velocity = 0;
    let lastScroll = window.scrollY;
    let reveal = 0;
    const box = { top: 0, left: 0, height: 1 };

    /**
     * Everything the GPU owns, in one function, because a lost context takes
     * all of it and a restored context needs all of it built again.
     *
     * The browser drops a context for reasons the page does not control: the
     * driver resets, another tab exhausts the pool, or the canvas is briefly
     * sized to zero. The failure is completely silent. Draw calls against a
     * dead context throw nothing, log nothing and paint nothing, so the loop
     * keeps running at sixty frames a second against a handle that will never
     * produce a pixel again. That is exactly what this component did before
     * this function existed.
     */
    const build = () => {
      gl = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        premultipliedAlpha: false,
        powerPreference: "low-power",
      });
      if (!gl) {
        giveUp();
        return false;
      }

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      prog = vs && fs ? gl.createProgram() : null;
      if (!vs || !fs || !prog) {
        giveUp();
        return false;
      }
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      // Attached shaders are kept alive by the program, so deleting the objects
      // now stops them accumulating across rebuilds.
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        giveUp();
        return false;
      }
      gl.useProgram(prog);

      buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      // One oversized triangle covering the viewport. A quad needs six vertices
      // and puts a seam straight through the middle of every fragment batch.
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
      );
      const loc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      u = {};
      for (const name of UNIFORMS) u[name] = gl.getUniformLocation(prog, name);

      canvas.style.display = "";
      return true;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      /* Never hand the driver a zero-sized drawing buffer. A ResizeObserver
         fires while a pinned section is being measured, and at that moment the
         box is genuinely 0 x 0. Setting `canvas.width = 0` is what killed the
         context, and nothing brought it back. */
      if (r.width < 1 || r.height < 1) return;

      box.top = r.top + window.scrollY;
      box.left = r.left;
      box.height = r.height;

      // Capped hard: this shader is fill-rate bound, and a 3x DPR phone would
      // paint nine times the pixels for a field nobody looks at directly.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const nw = Math.max(1, Math.round(r.width * dpr));
      const nh = Math.max(1, Math.round(r.height * dpr));
      if (nw === w && nh === h) return;

      w = nw;
      h = nh;
      canvas.width = w;
      canvas.height = h;
      gl?.viewport(0, 0, w, h);
    };

    const frame = (now: number) => {
      if (!gl || lost || gl.isContextLost()) {
        running = false;
        return;
      }

      const t = (now - startedAt) / 1000;

      // Scroll velocity, decayed. Read from the event loop, never measured here.
      const y = window.scrollY;
      const delta = Math.abs(y - lastScroll);
      lastScroll = y;
      velocity = Math.max(velocity * 0.9, Math.min(delta / 55, 1));

      reveal = Math.min(1, reveal + 0.018);

      // How far the hero has left the screen, 0 to 1.
      const dissolve = Math.min(
        1,
        Math.max(0, (y - box.top) / Math.max(box.height * 0.9, 1))
      );

      const dpr = w / Math.max(canvas.clientWidth, 1);
      gl.uniform2f(u.uRes, w, h);
      gl.uniform1f(u.uTime, t);
      // Flipped: WebGL's origin is bottom-left, the pointer's is top-left.
      gl.uniform2f(u.uPointer, pointer.x * dpr, h - pointer.y * dpr);
      gl.uniform1f(u.uVelocity, velocity);
      gl.uniform1f(u.uReveal, reveal);
      gl.uniform1f(u.uDissolve, dissolve);
      gl.uniform3fv(u.uInk, palette.ink);
      gl.uniform3fv(u.uAccent, palette.accent);
      gl.uniform3fv(u.uShard, palette.shard);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (running) raf = requestAnimationFrame(frame);
    };

    const setRunning = (next: boolean) => {
      if (next === running) return;
      running = next;
      if (next) {
        lastScroll = window.scrollY;
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
      }
    };
    const sync = () => setRunning(!document.hidden && onScreen && !lost);

    /* The default behaviour on loss is for the context to stay dead forever.
       Calling preventDefault is the only thing that makes a restore possible. */
    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      setRunning(false);
    };
    const onRestored = () => {
      lost = false;
      w = 0;
      h = 0;
      if (build()) {
        resize();
        sync();
      }
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    if (!build()) {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      return;
    }
    resize();
    setRunning(true);

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX - box.left;
      pointer.y = e.clientY + window.scrollY - box.top;
    };
    const onLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };
    const onTheme = () => {
      palette = readPalette();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const io = new IntersectionObserver(
      (es) => {
        onScreen = es.some((e) => e.isIntersecting);
        sync();
      },
      { rootMargin: "160px" }
    );
    io.observe(canvas);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onLeave, { passive: true });
    window.addEventListener("pointercancel", onLeave, { passive: true });
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", sync);

    const onMotion = () => {
      if (reduced.matches) {
        setRunning(false);
        giveUp();
      }
    };
    reduced.addEventListener("change", onMotion);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onLeave);
      window.removeEventListener("pointercancel", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", onMotion);
      if (gl && !gl.isContextLost()) {
        if (prog) gl.deleteProgram(prog);
        if (buf) gl.deleteBuffer(buf);
      }
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
