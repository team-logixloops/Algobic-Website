import type { Metadata } from "next";
import * as React from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/site/landing/landing-header";
import { NextDoors } from "@/components/site/next-doors";
import { PageMasthead } from "@/components/site/page-masthead";
import { PageSection } from "@/components/site/page-section";
import { SiteCta } from "@/components/site/site-cta";
import { SiteFooter } from "@/components/site/site-footer";
import { JsonLd } from "@/components/ui/json-ld";
import { Marquee, MarqueeItem } from "@/components/ui/marquee";
import { Rise } from "@/components/ui/scroll-fx";
import { ANSWERS } from "@/lib/answers";
import {
  breadcrumbNode,
  faqNode,
  itemListNode,
  webPageNode,
} from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-meta";
import { SITE } from "@/lib/site";

/**
 * `/answers`: the AEO and GEO surface.
 *
 * Twelve questions, each answered in 40 to 60 declarative words, which is the
 * length an answer engine extracts whole rather than truncating mid-clause.
 * The tone is encyclopedia rather than persuasion, and that is not a
 * concession: objective sentences get selected more often than persuasive ones,
 * and `brand.md`'s voice was already numbers over adverbs with no adjectives
 * doing verbs' work.
 *
 * The reasoning behind answering inline on a hub, when `website.md` specifies
 * one page per question, is recorded at the top of `answers.ts` along with the
 * argument against it. The short version: the inline answer is deliberately the
 * short one, so the eventual page has the long one and there is nothing to
 * cannibalise.
 *
 * Every answer is rendered from the same strings the `FAQPage` block is built
 * from. Structured data that says something the visible page does not is the
 * one schema mistake carrying a manual penalty rather than an indifferent
 * shrug, so there is no second copy to drift.
 *
 * ⚠️ `FAQPage` rich results were fully deprecated on 7 May 2026. This page
 * budgets zero Google SERP lift from that block and builds no expandable
 * dropdown to match it. It is emitted because answer engines parse it.
 */

const DESCRIPTION =
  "Twelve straight answers about building apps with AI: what vibe coding is, whether AI-written code is safe, how long a build takes, and what it costs in India.";

export const metadata: Metadata = pageMetadata({
  path: "/answers",
  title: "Answers about building apps with AI",
  description: DESCRIPTION,
});

/**
 * Questions this page deliberately does not answer.
 *
 * `website.md` section 4: every query has exactly one owner, and every other
 * page links to the owner instead of re-answering. Printing that table on the
 * page rather than only obeying it privately does two useful things: it sends
 * the reader to the right page in one click, and it puts three internal links
 * on the surface with the most inbound long-tail traffic.
 */
const OWNED_ELSEWHERE = [
  {
    question: "What should I build first?",
    owner: "/start",
    label: "What to build first",
  },
  {
    question: "Which AI app builder is best for beginners?",
    owner: "/tools",
    label: "Which tool",
  },
  {
    question: "Can students in India use these tools free?",
    owner: "/tools",
    label: "Which tool",
  },
] as const;

export default function AnswersPage() {
  const structuredData = [
    webPageNode({
      path: "/answers",
      name: `Answers about building apps with AI | ${SITE.name}`,
      description: DESCRIPTION,
      type: "CollectionPage",
    }),
    faqNode(
      "/answers",
      ANSWERS.map((entry) => ({
        question: entry.question,
        answer: entry.answer,
      }))
    ),
    itemListNode({
      path: "/answers",
      name: "Questions about building apps with AI",
      items: ANSWERS.map((entry) => ({ name: entry.question })),
    }),
    breadcrumbNode("/answers", [{ name: "Answers", path: "/answers" }]),
  ];

  return (
    <div className="flex min-h-[100svh] flex-col">
      <JsonLd nodes={structuredData} />

      <LandingHeader current="/answers" />

      <main className="flex-1">
        <PageMasthead
          eyebrow="Answers"
          lines={[{ text: "Twelve" }, { text: "straight", accentSuffix: "\\" }]}
          label="Twelve straight answers"
          answer={
            <>
              Twelve questions people actually type at 1am before building their
              first app. Whether you need a CS degree. Whether AI-written code
              is safe. How long it takes, what it costs in India, and how to
              tell when the model got it wrong. Each answered in under sixty
              words.
            </>
          }
        />

        <PageSection
          id="the-answers"
          title="The answers"
          shards={3}
          lede={
            <>
              No warm-up paragraph, no &ldquo;great question&rdquo;, no
              &ldquo;it depends&rdquo; where a straight answer exists. Where it
              genuinely does depend, the answer says what it depends on.
            </>
          }
        >
          <Rise stagger={0.05} y={26} select="[data-answer]">
            <div className="max-w-[74rem]">
              {ANSWERS.map((entry, i) => (
                /* `id` is the slug, so the anchor a page links to today is the
                   URL that answer eventually lives at, minus one path segment.
                   `/tools` already links to one of them. Anchors are stable
                   forever for the same reason URLs are. */
                <article
                  key={entry.slug}
                  id={entry.slug}
                  data-answer
                  className="scroll-mt-[6rem] border-t border-line py-[clamp(1.25rem,3vw,2rem)] lg:flex lg:gap-[clamp(1.5rem,4vw,3rem)]"
                >
                  <div className="flex shrink-0 items-baseline gap-[clamp(0.75rem,1.6vw,1.125rem)] lg:w-[clamp(20rem,34vw,32rem)]">
                    <span
                      aria-hidden="true"
                      className="font-mono text-data tabular-nums text-muted"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* h3 under the section's h2. These are the page's real
                        content and a reader navigating by heading should land
                        on each question. */}
                    <h3 className="max-w-[30ch] text-balance font-display text-[clamp(1rem,1.7vw,1.3125rem)] leading-tight font-bold text-foreground">
                      {entry.question}
                    </h3>
                  </div>

                  <div className="mt-3 lg:mt-0">
                    <p className="max-w-[62ch] text-[clamp(0.9375rem,1.4vw,1.0625rem)] leading-relaxed text-foreground">
                      {entry.answer}
                    </p>

                    {/* Only when there is somewhere to go. It printed
                        "/answers/… is not written yet" under all twelve, which
                        is twelve reminders of what the page does not have.
                        The absent link says the same thing and says it once. */}
                    {entry.live ? (
                      <Link
                        href={`/answers/${entry.slug}`}
                        className="group mt-3 inline-flex items-baseline gap-2 font-mono text-micro text-accent-ink uppercase"
                      >
                        The long answer
                        <span aria-hidden="true" className="slash-glyph">
                          \
                        </span>
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </Rise>
        </PageSection>

        <PageSection
          id="every-question"
          title="The strip"
          shards={2}
          lede={
            <>
              Every question on this page, running. Reach for it and it slows
              down.
            </>
          }
        >
          <Marquee label="Every question on this page" speed={52}>
            {ANSWERS.map((entry) => (
              <MarqueeItem key={entry.slug}>{entry.question}</MarqueeItem>
            ))}
          </Marquee>
        </PageSection>

        <PageSection
          id="owned-elsewhere"
          title="Answered elsewhere"
          shards={0}
          lede={
            <>
              Three questions are missing from the list above and it is
              deliberate. Two pages targeting one question split the link equity
              and let the engine choose, usually wrongly. Each of these has one
              owner.
            </>
          }
        >
          <Rise stagger={0.07} y={24} select="[data-owned]">
            <dl className="max-w-[72rem]">
              {OWNED_ELSEWHERE.map((item) => (
                <div
                  key={item.question}
                  data-owned
                  className="flex flex-col gap-2 border-t border-line py-[clamp(1rem,2.5vw,1.5rem)] sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <dt className="max-w-[46ch] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-snug text-foreground">
                    {item.question}
                  </dt>
                  <dd className="shrink-0">
                    <Link
                      href={item.owner}
                      className="group inline-flex min-h-11 items-center gap-2 font-mono text-data text-accent-ink uppercase sm:min-h-0"
                    >
                      {item.label}
                      <span aria-hidden="true" className="slash-glyph">
                        \
                      </span>
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
          </Rise>
        </PageSection>

        <div className="h-[clamp(2.5rem,7vw,4.5rem)]" />

        <NextDoors
          doors={[
            {
              href: "/start",
              label: "What to build first",
              detail:
                "Five first builds, each ₹0 to run and finishable in one evening.",
            },
            {
              href: "/tools",
              label: "Which tool",
              detail:
                "Five AI app builders, what each is best at, and where each one stops.",
            },
            {
              href: "/data",
              label: "Data",
              detail:
                "Every figure this site prints, with the date it was checked and how far to trust it.",
            },
          ]}
        />
        <SiteCta
          line={<>Asked something this page did not answer?</>}
          body={
            <>
              Send it. Questions that turn up twice get written into this page
              with the same forty to sixty words and the same absence of
              hedging, and they get answered on Instagram before they land here.
            </>
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}
