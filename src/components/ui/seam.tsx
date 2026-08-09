import * as React from "react";

/**
 * The section divider.
 *
 * A hairline interrupted by a shatter cluster and one diagonal jog on the
 * slash angle: the mark's whole vocabulary at rule scale. Built from three
 * skewed spans rather than an SVG because a stretched SVG distorts the angle,
 * and the angle is the point.
 *
 * Not a clipped section edge: clipping whole sections swallows focus rings and
 * descendants. This is a sibling element, so nothing is at risk.
 *
 * `label` is optional and, when present, earns its place: it names the
 * section that follows rather than decorating the rule.
 *
 * `shards` is how the page carries its argument in the one element that has no
 * content to get in the way. The landing page counts them down as it descends,
 * so the dividers lose their shatter on the way to the foot of the page and the
 * last one is a clean line with a single mark on it. Same dissolve as the cat,
 * read the other way, spread across the whole document.
 */

/** Widths thin outward from the accent, matching the artwork's own clusters. */
const CLUSTER = [
  { w: "clamp(0.75rem,2vw,1.25rem)", accent: false },
  { w: "clamp(0.375rem,1vw,0.75rem)", accent: true },
  { w: "0.25rem", accent: false },
] as const;

export function Seam({
  label,
  shards = CLUSTER.length,
  draw = true,
  className = "",
}: {
  label?: string;
  /** 0 to 3. Counted down across a page to make the dissolve legible. */
  shards?: number;
  /**
   * Whether the long leg draws itself against the scroll.
   *
   * Off for the footer, and the reason is mechanical rather than stylistic.
   * `.draw-scroll` is an `animation-timeline: view()`, and a view timeline needs
   * its subject to be a box inside the scroller's own subtree. The footer's
   * content is `position: fixed`, so it is not, and the timeline resolves as
   * inactive. What an inactive timeline does to an animation filling `both` is
   * not worth betting a visible rule on, so the one seam that lives in fixed
   * content asks for a plain hairline instead.
   */
  draw?: boolean;
  className?: string;
}) {
  return (
    <div
      role="presentation"
      className={`flex items-center gap-[clamp(0.5rem,1.6vw,1rem)] py-[clamp(1.75rem,5vw,3.25rem)] ${className}`}
    >
      {/* Short leg left, long leg right: a centred rule reads as decoration. */}
      <span aria-hidden="true" className="h-px w-[clamp(1rem,6vw,5rem)] bg-line" />

      {/* Shatter cluster, thinning outward. Same bar vocabulary as the field.
          Trimmed from the wide end, so what survives longest is the accent and
          the smallest shard: the tail of the dissolve, not the head of it. */}
      {shards > 0 ? (
        <span aria-hidden="true" className="flex items-center gap-[3px]">
          {CLUSTER.slice(CLUSTER.length - shards).map((bar) => (
            <span
              key={bar.w}
              className={`block h-[2px] ${bar.accent ? "bg-accent" : "bg-shard"}`}
              style={{ width: bar.w }}
            />
          ))}
        </span>
      ) : null}

      {/* The jog. A near-vertical bar skewed to the slash. */}
      <span
        aria-hidden="true"
        className="block h-[clamp(1rem,3vw,1.5rem)] w-[1.5px] bg-accent"
        style={{ transform: "skewX(calc(-1 * var(--slash-angle)))" }}
      />

      {/* Hidden on the narrowest viewports: 0.42em tracking on a shrink-0 span
          pushes the rule past a 240px screen. The section's own h2 names it
          anyway, so nothing is lost. */}
      {label ? (
        <span className="eyebrow text-eyebrow hidden shrink-0 pl-[clamp(0.25rem,1vw,0.75rem)] sm:block">
          {label}
        </span>
      ) : null}

      <span
        aria-hidden="true"
        className={`h-px flex-1 bg-line ${draw ? "draw-scroll" : ""}`}
      />
    </div>
  );
}
