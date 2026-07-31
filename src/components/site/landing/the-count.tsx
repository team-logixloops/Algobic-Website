import * as React from "react";

/**
 * The count.
 *
 * Every brand with nothing shipped writes around its zero. This one sets it
 * larger than any other single element on the page except the headline, which
 * is the cheapest possible proof that the figures further down are not being
 * managed. If the number that embarrasses us is the second biggest thing here,
 * the ones that flatter us can be believed.
 *
 * It is also the page's one moment of violent scale contrast: a glyph the
 * height of a hand next to type at eleven pixels. Nothing else on the site does
 * this, and it only earns it because the number is load-bearing rather than
 * decorative.
 *
 * Set in the data face, not the display face. It is a count, counts belong to
 * the mono, and Orbitron's zero is a slashed rectangle that at this size reads
 * as a filled black box rather than a digit.
 */
export function TheCount() {
  return (
    <section className="mx-auto max-w-[110rem] px-[max(1rem,4vw)]">
      <h2 className="eyebrow text-eyebrow">
        <span className="sr-only">Zero </span>builds published
      </h2>

      <div className="mt-[clamp(1.5rem,4vw,2.5rem)] grid items-end gap-[clamp(1.5rem,4vw,4rem)] border-t border-line pt-[clamp(1.5rem,4vw,3rem)] lg:grid-cols-[auto_1fr]">
        <span
          aria-hidden="true"
          className="block font-mono text-[clamp(7rem,32vw,28rem)] leading-[0.72] font-medium tabular-nums text-foreground"
        >
          0
        </span>

        {/* Pushed to the far edge rather than sitting next to the glyph. The
            span between them is the point: the eye crosses an empty measure to
            get from the number to what it means. */}
        <div className="max-w-[34ch] pb-[clamp(0.5rem,2vw,3rem)] lg:justify-self-end lg:text-right">
          <p className="text-[clamp(1rem,1.6vw,1.375rem)] leading-relaxed text-foreground">
            A build appears here once it is shipped, reachable and free to run.
            Never before.
          </p>
          <p className="mt-[clamp(0.75rem,2vw,1.25rem)] font-mono text-micro text-muted">
            Nothing on this page is a mockup.
          </p>
        </div>
      </div>
    </section>
  );
}
