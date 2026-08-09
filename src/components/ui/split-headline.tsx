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

    /* The preloader's handoff, in seconds, or zero when it is not running.
       `.rise` and `.draw` are offset by a CSS rule keyed off the same attribute,
       and this is the one load-time entrance on the page that CSS cannot reach.
       Without it the headline played its whole 1.27s arrival behind an opaque
       overlay and the reader was handed a hero that was already finished, which
       is the single most visible thing on the site spent on nobody. */
    const doc = document.documentElement;
    const handoff = doc.hasAttribute("data-preload")
      ? (parseFloat(
          getComputedStyle(doc).getPropertyValue("--preload-handoff")
        ) || 0) / 1000
      : 0;

    const ctx = gsap.context(() => {
      gsap.set(chars, { yPercent: 118 });
      gsap.to(chars, {
        yPercent: 0,
        duration: 1.15,
        ease: "expo.out",
        stagger: { each: 0.016, from: "start" },
        delay: 0.12 + handoff,
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
          {/* Characters are grouped into words, and each word is an
              `inline-block` that refuses to break inside itself.

              This grouping is load-bearing rather than tidy. Every character is
              its own inline-level box so it can be translated independently,
              and inline boxes wrap wherever they run out of room, so without
              the grouping a line wider than its container breaks *between two
              letters*. Not hypothetical: `/data`'s headline rendered as
              "Method before n / umber" until this was added. The wrapper
              restores the only break opportunity a headline is allowed to have,
              which is a space.

              The accent suffix rides the last word for the same reason. Alone
              it is a one-character box that can wrap by itself, which parks the
              mark's backslash on an empty row under the sentence. */}
          <span className="block">
            {line.text.split(" ").map((word, wi, words) => (
              <React.Fragment key={wi}>
                {/* A real space, so lines still break between words and so
                    selecting the headline copies the sentence. */}
                {wi > 0 ? " " : null}

                <span className="inline-block whitespace-nowrap">
                  {[...word].map((ch, ci) => (
                    <span
                      key={ci}
                      data-char
                      className="inline-block will-change-transform"
                    >
                      {ch}
                    </span>
                  ))}

                  {line.accentSuffix && wi === words.length - 1 ? (
                    <span
                      data-char
                      className="inline-block text-accent will-change-transform"
                    >
                      {line.accentSuffix}
                    </span>
                  ) : null}
                </span>
              </React.Fragment>
            ))}
          </span>
        </span>
      ))}
    </h1>
  );
}
