"use client";

import * as React from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/ui/motion-provider";

/**
 * The headline, arriving.
 *
 * Each line sits in its own clipping window and the characters rise into it
 * from below, staggered along the line and offset between lines. At this size
 * the letterforms are the size of a hand, so they arrive as objects rather than
 * as text fading in, which is the difference between a page that animates and a
 * page that reveals.
 *
 * The split is done in the markup rather than by a runtime splitter. Server
 * rendering it means the characters exist in the first HTML, so there is no
 * flash of unsplit text, no measurement pass, and no layout thrash on load. It
 * also means the animation can start on the first frame instead of after
 * hydration has rewritten the DOM.
 *
 * Accessibility: the `h1` carries the whole sentence as its accessible name and
 * every span is hidden, so assistive technology gets one heading and never a
 * letter-by-letter reading. Selecting and copying the visible text still yields
 * the sentence, because the spans are inline and the word breaks are real
 * spaces.
 *
 * This is the LCP element. It animates `transform` only and never `opacity`
 * from zero: the text is painted at full strength in the first frame and slides
 * into place, so the largest paint is not delayed by the entrance.
 */

export type HeadlineLine = {
  text: string;
  /** Rendered in `--accent`. The one coloured mark in the headline. */
  accentSuffix?: string;
};

export function SplitHeadline({
  lines,
  label,
  className = "",
}: {
  lines: readonly HeadlineLine[];
  /** The full sentence, for assistive technology. */
  label: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const chars = root.querySelectorAll<HTMLElement>("[data-char]");
    if (!chars.length) return;

    const ctx = gsap.context(() => {
      gsap.set(chars, { yPercent: 118 });
      gsap.to(chars, {
        yPercent: 0,
        duration: 1.15,
        ease: "expo.out",
        stagger: { each: 0.016, from: "start" },
        delay: 0.12,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <h1 ref={ref} aria-label={label} className={className}>
      {lines.map((line, li) => (
        <span
          key={li}
          aria-hidden="true"
          /* The clipping window. `pb` then a matching negative margin: Orbitron
             has descenders that a flush `overflow: hidden` would shave off the
             bottom of every line. */
          className="block overflow-hidden pb-[0.12em] [margin-bottom:-0.12em]"
        >
          <span className="block">
            {[...line.text].map((ch, ci) => (
              <span
                key={ci}
                data-char
                className="inline-block will-change-transform"
              >
                {ch === " " ? " " : ch}
              </span>
            ))}
            {line.accentSuffix ? (
              <span data-char className="inline-block text-accent will-change-transform">
                {line.accentSuffix}
              </span>
            ) : null}
          </span>
        </span>
      ))}
    </h1>
  );
}
