import * as React from "react";

/**
 * The official lockup: cat, shatter field, ALGOBIC\ and the tagline.
 *
 * Drawn as two CSS-masked layers rather than <img>, so the ink follows
 * `currentColor` and the accent follows `--accent` — one pair of assets, both
 * themes. Traced outlines, so the custom Λ and \ marks survive (Orbitron's own
 * glyphs do not have them).
 *
 * The `-spaced-` pair is the shipped one: same art, with the type translated
 * 64 units down the 829-unit box (hence the 893 height) so the cat is not
 * sitting on the A.
 */

const ASPECT = 1492 / 893;

function MaskLayer({ src, color }: { src: string; color: string }) {
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

export function AlgobicLockup({
  className = "",
  label = "ALGOBIC — Build Before They Do",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative ${className}`}
      style={{ aspectRatio: String(ASPECT) }}
    >
      <MaskLayer
        src="/brand/algobic-lockup-spaced-ink.svg"
        color="currentColor"
      />
      <MaskLayer
        src="/brand/algobic-lockup-spaced-accent.svg"
        color="var(--accent)"
      />
    </div>
  );
}
