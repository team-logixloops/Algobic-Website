import * as React from "react";
import Link from "next/link";
import { ANSWERS, featuredAnswers } from "@/lib/answers";

/**
 * The AEO surface. One question per page, encyclopedia tone.
 *
 * Rendered as a plain question list rather than an accordion: an accordion
 * hides text behind client JS, and these questions are the whole point of the
 * block. The count is stated because it is a fact, not a boast.
 */
export function AnswersTeaser() {
  const featured = featuredAnswers(6);

  return (
    <section className="mx-auto max-w-[92rem] px-[max(1rem,4vw)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="eyebrow text-eyebrow">Questions people actually ask</h2>
        <Link
          href="/answers"
          className="group inline-flex items-baseline gap-2 font-mono text-micro text-muted uppercase transition-colors hover:text-foreground"
        >
          All {ANSWERS.length} answers
          <span aria-hidden="true" className="slash-glyph">
            \
          </span>
        </Link>
      </div>

      <ul className="mt-[clamp(1.25rem,3vw,2rem)] grid border-t border-line lg:grid-cols-2 lg:gap-x-[clamp(2rem,5vw,4rem)]">
        {featured.map((answer, i) => (
          <li
            key={answer.slug}
            className="reveal border-b border-line"
            style={{ "--r": `${2 + i * 2}%` } as React.CSSProperties}
          >
            <Link
              href={`/answers/${answer.slug}`}
              className="wipe flex items-baseline gap-4 py-[clamp(0.875rem,2vw,1.125rem)] pr-3 pl-3 sm:pl-4"
            >
              <span
                aria-hidden="true"
                className="mt-[0.55em] block h-[1.5px] w-[clamp(0.75rem,2vw,1.25rem)] shrink-0 bg-accent"
              />
              <span className="text-[clamp(0.9rem,1.35vw,1.0625rem)] leading-snug text-foreground">
                {answer.question}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
