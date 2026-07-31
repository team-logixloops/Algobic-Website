import * as React from "react";
import Link from "next/link";
import { BrandMask } from "@/components/ui/brand-mask";

/**
 * The only button on the page.
 *
 * `brand.md`: one decision per screen, never two CTAs. The hero's "Start with
 * this one" is a text link on purpose so this stays the single button, and the
 * build index rows stay the thing the eye lands on first.
 */
export function StartCta() {
  return (
    <section className="mx-auto max-w-[92rem] px-[max(1rem,4vw)]">
      <div className="reveal border border-line bg-surface px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(2rem,6vw,4rem)] text-center">
        {/* The mark, whole, signing the one decision on the page. Wide enough
            that the shatter bars still read; below roughly 5rem they collapse
            into noise. Ink follows the foreground so the outline reads, and the
            eye plus the accent shards take the theme's own accent (orange on
            paper, violet in the dark), exactly as the mark is drawn. */}
        <BrandMask
          mark="cat"
          className="mx-auto mb-[clamp(1rem,2.5vw,1.75rem)] w-[clamp(6rem,12vw,9rem)] text-foreground"
        />

        <h2 className="mx-auto max-w-[22ch] font-display text-display-l text-balance text-foreground">
          Start with the thing you scrolled past.
        </h2>

        <p className="mx-auto mt-4 max-w-[44ch] text-[clamp(0.9rem,1.3vw,1rem)] leading-relaxed text-muted">
          Five first builds. Each one free to run, each one finishable tonight.
        </p>

        {/* Fill and border are accent-ink, not accent: background-on-accent
            measured 2.44:1 light and 3.89:1 dark, so the hover state made the
            label unreadable in both themes. accent-ink gives 6.26 and 6.53. */}
        <Link
          href="/start"
          className="group mt-[clamp(1.5rem,4vw,2.25rem)] inline-flex items-baseline gap-2.5 border border-accent-ink px-[clamp(1.25rem,3vw,2rem)] py-3.5 font-display text-[clamp(0.6875rem,1.1vw,0.8125rem)] font-bold tracking-[0.28em] text-foreground uppercase transition-colors hover:bg-accent-ink hover:text-background"
        >
          Pick your first build
          <span
            aria-hidden="true"
            className="slash-glyph text-accent-ink group-hover:text-background"
          >
            \
          </span>
        </Link>
      </div>
    </section>
  );
}
