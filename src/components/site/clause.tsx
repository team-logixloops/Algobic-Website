import * as React from "react";
import { Rise } from "@/components/ui/scroll-fx";

/**
 * The shape `/privacy` and `/terms` are set in.
 *
 * `website.md` section 3: *"Write them in plain language. A legal page nobody
 * can read is a trust cost, not a trust signal."* So these are not a wall of
 * numbered subclauses in 13px grey. Each clause gets a heading a person would
 * actually search for, one paragraph at reading size, and a mono answer line
 * carrying the single fact the clause exists to state.
 *
 * That last part is the whole idea. A privacy policy's job is to answer six
 * questions, and a reader scanning for one of them should be able to find it
 * without reading the prose around it. The mono line is the answer; the
 * paragraph is why.
 *
 * `h3` under the page's section `h2`, never `h2` directly under the `h1`: the
 * legal pages carry two levels of structure and skipping one to save a wrapper
 * breaks the outline for anyone navigating by heading.
 */

export type ClauseItem = {
  heading: string;
  /** The single fact. Mono, and it must be readable on its own. */
  answer: string;
  body: React.ReactNode;
};

export function Clauses({ items }: { items: readonly ClauseItem[] }) {
  return (
    <Rise stagger={0.05} y={24} select="[data-clause]">
      <div>
        {items.map((item) => (
          <article
            key={item.heading}
            data-clause
            className="border-t border-line py-[clamp(1.25rem,3vw,2rem)]"
          >
            <h3 className="font-display text-[clamp(1rem,1.7vw,1.25rem)] leading-tight font-bold text-foreground">
              {item.heading}
            </h3>

            <p className="mt-[clamp(0.5rem,1.2vw,0.75rem)] flex items-baseline gap-2.5 font-mono text-data text-accent-ink">
              <span
                aria-hidden="true"
                className="block h-[0.8rem] w-[1.5px] shrink-0 bg-accent"
                style={{ transform: "skewX(calc(-1 * var(--slash-angle)))" }}
              />
              {item.answer}
            </p>

            <div className="mt-[clamp(0.625rem,1.5vw,0.875rem)] max-w-[68ch] space-y-3 text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
              {item.body}
            </div>
          </article>
        ))}
      </div>
    </Rise>
  );
}
