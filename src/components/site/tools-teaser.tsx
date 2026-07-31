import * as React from "react";
import Link from "next/link";
import { comparisons } from "@/lib/tools";

/**
 * Highest commercial-intent surface on the site, so it gets a real block on the
 * homepage rather than a footer link.
 *
 * The differentiator is stated plainly here because it is the only thing a
 * vendor blog cannot copy: every comparison links to something built with the
 * tool.
 */
export function ToolsTeaser() {
  const pages = comparisons();

  return (
    <section className="mx-auto max-w-[110rem] px-[max(1rem,4vw)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="eyebrow text-eyebrow">Which tool for what</h2>
        <Link
          href="/tools"
          className="group inline-flex items-baseline gap-2 font-mono text-micro text-muted uppercase transition-colors hover:text-foreground"
        >
          All tool pages
          <span aria-hidden="true" className="slash-glyph">
            \
          </span>
        </Link>
      </div>

      <p className="mt-[clamp(1rem,2.5vw,1.5rem)] max-w-[54ch] text-[clamp(0.9rem,1.3vw,1rem)] leading-relaxed text-muted">
        Every comparison ends with something we built using the tool. That is the
        part a vendor blog cannot fake.
      </p>

      <ul className="mt-[clamp(1.25rem,3vw,2rem)] grid gap-px border border-line bg-line sm:grid-cols-3">
        {pages.map((page, i) => (
          <li
            key={page.slug}
            className="reveal-lift"
            style={{ "--r": `${2 + i * 3}%` } as React.CSSProperties}
          >
            <Link
              href={`/tools/${page.slug}`}
              className="wipe corner-cut flex h-full flex-col gap-2 bg-background p-[clamp(1.125rem,2.5vw,1.75rem)]"
            >
              <span className="font-display text-[clamp(1rem,1.7vw,1.25rem)] leading-tight font-bold text-foreground">
                {page.title}
              </span>
              <span className="max-w-[32ch] text-[clamp(0.8125rem,1.2vw,0.9375rem)] leading-relaxed text-muted">
                {page.answers}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
