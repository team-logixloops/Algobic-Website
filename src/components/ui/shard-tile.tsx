import * as React from "react";

/**
 * One tile of the shatter field, composed from a seed.
 *
 * `website.md` section 4: *"Real screenshots with descriptive alt text, not
 * stock, not AI-generated."* A wall of build cards therefore cannot carry
 * photography until real builds exist to photograph, and stock imagery is
 * ruled out twice over: by that line, and by the CSP in `next.config.ts`,
 * which pins `img-src` to `'self' data: blob:`.
 *
 * So the empty cards draw the only picture the site is entitled to draw: the
 * mark's own vocabulary. Horizontal bars, thickest at the left edge, thinning
 * rightward, with one accent shard and one diagonal on the slash. That is a
 * literal description of the logo, and it is the same grammar `Seam` and
 * `GlitchField` already speak, so fifteen of these read as one field rather
 * than as fifteen decorations.
 *
 * Every value is derived from a seeded PRNG rather than `Math.random`, because
 * this renders on the server and again on the client and the two have to agree.
 * The tone tokens are CSS variables, so a tile trades colours with the theme
 * for free.
 */

const TILE_W = 480;
const TILE_H = 384;

/** 16deg, as `tan(16°) ≈ 0.287` over the tile's own height. */
const SLASH_RUN = Math.round(TILE_H * 0.287);

/** mulberry32. Small, fast, and identical on both sides of hydration. */
function mulberry32(a: number) {
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a. Turns a tile's key into the seed, so the art is stable per tile. */
function seedFrom(key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Tone = "shard" | "accent" | "fore";

type Bar = { x: number; y: number; w: number; h: number; tone: Tone };

const FILL: Record<Tone, string> = {
  shard: "var(--shard)",
  accent: "var(--accent)",
  fore: "var(--foreground)",
};

/**
 * The composition is clusters, not rows.
 *
 * The first version of this laid one to three thin bars on each of sixteen
 * evenly spaced bands. On screen that is a paragraph: uniform height, uniform
 * spacing, ragged right edge. It read as a skeleton loader, which is the exact
 * impression `design.md` section 5 forbids these cards from giving.
 *
 * A shatter burst is the opposite shape. A thick bar throws off progressively
 * thinner ones, they crowd at uneven intervals, and the group has a centre.
 * So the tile is built from six to eight of those bursts placed with a
 * left-biased draw, a scatter of strays to break the grouping, and one accent
 * slab. Height variance is the load-bearing part: nothing here may be a line
 * of text.
 */
function composeBars(key: string): Bar[] {
  const rand = mulberry32(seedFrom(key));
  const bars: Bar[] = [];

  const clusters = 6 + Math.floor(rand() * 3);

  for (let c = 0; c < clusters; c += 1) {
    /* Squaring a uniform draw pulls the mass toward zero. That is the mark's
       own falloff: thickest where the shards leave the animal, thinning as
       they travel. Bars are allowed to start off the left edge and bleed. */
    const originX = Math.round(-40 + rand() * rand() * TILE_W * 1.15);
    let y = Math.round(rand() * (TILE_H - 70));
    let w = Math.round(96 + rand() * 216);

    const rows = 2 + Math.floor(rand() * 4);

    for (let r = 0; r < rows; r += 1) {
      // The head of a burst is a slab; everything after it is debris.
      const h = r === 0 ? 11 + Math.round(rand() * 17) : 3 + Math.round(rand() * 7);

      bars.push({
        x: originX + Math.round(rand() * 34) - 17,
        y,
        w: Math.max(20, w),
        h,
        tone: rand() > 0.78 ? "fore" : "shard",
      });

      y += h + 3 + Math.round(rand() * 11);
      if (y > TILE_H) break;
      w = Math.round(w * (0.54 + rand() * 0.32));
    }
  }

  const strays = 6 + Math.floor(rand() * 6);
  for (let s = 0; s < strays; s += 1) {
    bars.push({
      x: Math.round(rand() * TILE_W),
      y: Math.round(rand() * (TILE_H - 6)),
      w: Math.round(12 + rand() * 76),
      h: 2 + Math.round(rand() * 4),
      tone: rand() > 0.72 ? "fore" : "shard",
    });
  }

  /* Exactly one accent slab per tile. `--accent` measures 2.44:1 on paper, so
     it may fill and decorate and nothing else; here it is the single loudest
     mark in an otherwise ambient field, which is the role the token was split
     for. */
  bars.push({
    x: Math.round(rand() * TILE_W * 0.42),
    y: Math.round(28 + rand() * (TILE_H - 96)),
    w: Math.round(126 + rand() * 186),
    h: 9 + Math.round(rand() * 13),
    tone: "accent",
  });

  return bars;
}

export function ShardTile({
  seed,
  className = "",
}: {
  /** Anything stable and unique per tile. The composition is a function of it. */
  seed: string;
  className?: string;
}) {
  const bars = React.useMemo(() => composeBars(seed), [seed]);
  const rand = mulberry32(seedFrom(`${seed}/slash`));
  const slashX = Math.round(TILE_W * (0.58 + rand() * 0.3));

  return (
    <svg
      viewBox={`0 0 ${TILE_W} ${TILE_H}`}
      preserveAspectRatio="xMidYMid slice"
      shapeRendering="crispEdges"
      /* Decorative in full: the card's own text carries every fact. */
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width={TILE_W} height={TILE_H} fill="var(--surface)" />

      {bars.map((bar, i) => (
        <rect
          key={i}
          x={bar.x}
          y={bar.y}
          width={bar.w}
          height={bar.h}
          fill={FILL[bar.tone]}
          /* Ambient ink is ambient. The accent slab is the one that reads. */
          opacity={bar.tone === "accent" ? 1 : bar.tone === "fore" ? 0.42 : 0.85}
        />
      ))}

      {/* The jog. Drawn as a polygon rather than skewed in CSS so the angle
          survives `preserveAspectRatio="slice"` cropping the box. */}
      <polygon
        points={`${slashX},0 ${slashX + 4},0 ${slashX + SLASH_RUN + 4},${TILE_H} ${slashX + SLASH_RUN},${TILE_H}`}
        fill="var(--accent)"
        opacity={0.62}
      />
    </svg>
  );
}
