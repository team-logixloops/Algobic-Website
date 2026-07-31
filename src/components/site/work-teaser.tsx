import * as React from "react";
import Link from "next/link";
import { formatCost } from "@/lib/builds";
import { latestWork } from "@/lib/work";

/**
 * Founder-built case studies. Credibility, not traffic.
 *
 * Returns null when there is nothing to show. The hero already carries one
 * honest empty state; a second one on the same page reads as an empty site
 * rather than a site being built in the open.
 */
export function WorkTeaser() {
  const work = latestWork(2);
  if (work.length === 0) return null;

  return (
    <section className="mx-auto max-w-[92rem] px-[max(1rem,4vw)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="eyebrow text-eyebrow">Harder things, built here</h2>
        <Link
          href="/work"
          className="group inline-flex items-baseline gap-2 font-mono text-micro text-muted uppercase transition-colors hover:text-foreground"
        >
          All case studies
          <span aria-hidden="true" className="slash-glyph">
            \
          </span>
        </Link>
      </div>

      <p className="mt-[clamp(1rem,2.5vw,1.5rem)] max-w-[54ch] text-[clamp(0.9rem,1.3vw,1rem)] leading-relaxed text-muted">
        Not beginner builds and not pretending to be. These cost money to run,
        so they carry a recorded demo instead of a live URL.
      </p>

      <ul className="mt-[clamp(1.25rem,3vw,2rem)] grid gap-px border border-line bg-line lg:grid-cols-2">
        {work.map((study) => (
          <li key={study.slug}>
            <Link
              href={`/work/${study.slug}`}
              className="wipe corner-cut flex h-full flex-col gap-3 bg-background p-[clamp(1.125rem,2.5vw,1.75rem)]"
            >
              <span className="font-display text-[clamp(1.0625rem,1.9vw,1.375rem)] leading-tight font-bold text-foreground">
                {study.title}
              </span>
              <span className="max-w-[42ch] text-[clamp(0.85rem,1.25vw,0.9375rem)] leading-relaxed text-muted">
                {study.oneLine}
              </span>

              {/* The Catch is the whole point of a case study, so it surfaces
                  on the card rather than waiting for the click. */}
              <span className="mt-1 border-t border-line pt-3">
                <span className="eyebrow text-eyebrow block">The catch</span>
                <span className="mt-1.5 block max-w-[46ch] font-mono text-micro text-muted">
                  {study.theCatch}
                </span>
              </span>

              <span className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-3 font-mono text-micro text-muted">
                <span>{study.stack.join(" + ")}</span>
                <span aria-hidden="true">·</span>
                <span>{formatCost(study.cost)} to run</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
