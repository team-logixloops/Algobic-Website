/**
 * The Instagram glyph.
 *
 * Was a `motion/react` component with a hover-driven scale sequence and an
 * imperative handle. Three things were wrong with that. It was the only import
 * of `motion` anywhere in `src`, so a hover flourish was pulling an entire
 * animation runtime into the bundle. It carried no `use client` of its own and
 * only worked because its single importer had one, so any server component
 * importing it threw. And it lived inside `.trapdoor__reveal`, which sits at
 * `opacity: 0` until the doors part, so the animation ran where nobody could
 * see it and the ref nothing ever attached was dead code.
 *
 * Plain SVG, no hooks, no client boundary. Renders anywhere.
 */

type InstagramIconProps = {
  /** Rendered square. */
  size?: number;
  /** Defaults to `currentColor` so the trapdoor's own colour carries through. */
  color?: string;
  strokeWidth?: number;
  className?: string;
};

export default function InstagramIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className = "",
}: InstagramIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      <path d="M16.5 7.5v.01" />
    </svg>
  );
}
