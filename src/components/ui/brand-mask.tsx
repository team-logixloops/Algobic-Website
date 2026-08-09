import * as React from "react";

/**
 * Two-layer CSS mask for the brand artwork.
 *
 * Drawn as masked layers rather than <img> so the ink follows `currentColor`
 * and the accent follows `--accent`: one pair of assets serves both themes,
 * and the theme toggle recolours the mark with no second download.
 *
 * Traced outlines, so the custom Λ and \ survive (Orbitron's own glyphs do
 * not have them).
 */

export const MARKS = {
  /** Cat, shatter field, ALGOBIC\ and the tagline. The `-spaced-` pair is the
      shipped one: type translated 64 units down the 829-unit box, hence 893,
      so the cat is not sitting on the A. */
  lockup: {
    ink: "/brand/algobic-lockup-spaced-ink.svg",
    accent: "/brand/algobic-lockup-spaced-accent.svg",
    aspect: 1492 / 893,
  },
  /**
   * `ALGOBIC\` alone, with a real O. Wide, for headers and inline use.
   *
   * NOT `algobic-catword-*.svg`: that variant seats the cat inside the O and
   * belongs to the theme transition only. Derived by tooling from the lockup's
   * wordmark path, which keeps the animal separate.
   */
  wordmark: {
    ink: "/brand/algobic-wordmark-ink.svg",
    accent: "/brand/algobic-wordmark-accent.svg",
    aspect: 1448.3 / 126.4,
  },
  /**
   * The cat mark: outlined animal plus the horizontal shatter bars streaming
   * off it. Landscape, because the shards run left out of frame.
   *
   * NOT `algobic-cat-mask.svg`: that pair is a solid silhouette intended for
   * mask effects and renders as a filled blob wherever the drawing is wanted.
   * Derived by tooling from everything in the lockup above the type group, so
   * the shards come along. They are part of the mark, not scenery.
   */
  cat: {
    ink: "/brand/algobic-cat-outline-ink.svg",
    accent: "/brand/algobic-cat-outline-accent.svg",
    aspect: 828.7 / 525.4,
  },
} as const;

export type MarkName = keyof typeof MARKS;

/**
 * One masked fill layer. Exported because the assembling mark slices the same
 * artwork into bands and needs the identical layer treatment; duplicating these
 * six mask properties is how the two drift apart.
 */
export function MaskLayer({ src, color }: { src: string; color: string }) {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

export function BrandMask({
  mark,
  label,
  className = "",
  accentColor = "var(--accent)",
}: {
  mark: MarkName;
  /** Omit to render decoratively: the box then carries no accessible name. */
  label?: string;
  className?: string;
  accentColor?: string;
}) {
  const { ink, accent, aspect } = MARKS[mark];
  const semantics = label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": true } as const);

  return (
    <div
      {...semantics}
      className={`relative ${className}`}
      style={{ aspectRatio: String(aspect) }}
    >
      <MaskLayer src={ink} color="currentColor" />
      <MaskLayer src={accent} color={accentColor} />
    </div>
  );
}
