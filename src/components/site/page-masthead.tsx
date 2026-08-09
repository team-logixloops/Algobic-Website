import * as React from "react";
import {
  SplitHeadline,
  type HeadlineLine,
} from "@/components/ui/split-headline";

/**
 * The opening of every interior page.
 *
 * Three things, in the order an answer engine reads them and in the order a
 * person needs them:
 *
 * 1. The eyebrow, naming the section.
 * 2. The h1, set at display scale and arriving character by character. One per
 *    page, matching search intent, never animated from `opacity: 0`: it is the
 *    LCP element on every one of these routes, and `SplitHeadline` animates
 *    transform only for exactly that reason.
 * 3. The answer block. 40 to 60 words, declarative, inside the first 100 words
 *    of the document, written to survive being quoted without the page around
 *    it. `website.md` section 4 requires it on every page and section 5 explains
 *    why: objective sentences get selected by answer engines more often than
 *    persuasive ones, and our voice was already that.
 *
 * It shipped with a fourth: a mono spec block in the right gutter, five
 * label-and-value rows of facts the page was accountable for. It is gone, and
 * the reasoning is worth keeping because the idea will look good again. Read
 * once it was dense and considered. Read nine times, on nine routes, in the same
 * position, at the same size, always five rows deep and always ending on
 * `Updated`, it stopped reading as facts and started reading as a template with
 * the values swapped, which is precisely the tell of a page nobody wrote. Every
 * fact that mattered had somewhere better to be: the costs belong in the answer
 * block, the counts belong beside the things they count, and the date is already
 * in the footer of every page on the site.
 */

export function PageMasthead({
  eyebrow,
  lines,
  label,
  answer,
  children,
}: {
  eyebrow: string;
  /** Authored line breaks. Long lines still wrap inside their clip window. */
  lines: readonly HeadlineLine[];
  /** The whole sentence, for assistive technology. */
  label: string;
  /** 40 to 60 words. Count them. */
  answer: React.ReactNode;
  /** One optional action. Never two: `brand.md` allows one decision per screen. */
  children?: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-[110rem] px-[max(1rem,4vw)] pt-[clamp(1.5rem,4vw,3rem)] pb-[clamp(1rem,3vw,2rem)]">
      <p className="eyebrow text-eyebrow rise">{eyebrow}</p>

      {/* Draws in on load on the beat after the eyebrow, then holds. Same
          opening gesture as the header's rule, so an interior page arrives the
          way the chrome above it did. */}
      <span
        aria-hidden="true"
        className="draw mt-[clamp(0.625rem,1.5vw,1rem)] block h-[3px] w-[clamp(2.5rem,8vw,5rem)] origin-left bg-accent"
        style={{ "--d": "90ms" } as React.CSSProperties}
      />

      <SplitHeadline
        lines={lines}
        label={label}
        className="mt-[clamp(0.875rem,2vw,1.5rem)] max-w-[18ch] text-balance font-display text-display-xl text-foreground"
      />

      {/* The spec block used to hold the right gutter, and removing it left a
          54ch column sitting under a headline that runs most of the page: more
          than half a laptop screen empty, with the answer reading as a caption
          on the h1 rather than as the opening statement of the page.

          Rather than pad the gap with something invented, the block moves into
          the space the block vacated. Mass at the top left, statement at the
          bottom right, which is the site's one owned angle drawn at masthead
          scale and the same descending-left-to-right move the headline itself
          makes. One step up the type scale so it carries at that distance, and
          66ch so the measure stays readable at the larger size.

          Left-aligned below `lg`, where there is no gutter to sit in and a
          right-shifted paragraph is just an indent nobody asked for. */}
      <div className="mt-[clamp(1.25rem,3vw,2.25rem)]">
        <div className="max-w-[66ch] lg:ml-auto">
          {/* `data-answer-block` is read by the `speakable` selector in
              `webPageNode`. It marks the one paragraph on the page written to
              be extracted verbatim, so an assistant reading this route aloud
              starts at the answer rather than at the first sentence it finds. */}
          <p
            data-answer-block
            className="rise text-[clamp(1.0625rem,1.75vw,1.375rem)] leading-relaxed text-foreground"
            style={{ "--d": "220ms" } as React.CSSProperties}
          >
            {answer}
          </p>

          {children ? (
            <div
              className="rise mt-[clamp(1.25rem,3vw,1.75rem)]"
              style={{ "--d": "300ms" } as React.CSSProperties}
            >
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
