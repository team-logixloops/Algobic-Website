import type { Metadata } from "next";
import * as React from "react";
import { BuildIndex } from "@/components/site/build-index";
import { LandingHeader } from "@/components/site/landing/landing-header";
import { NextDoors } from "@/components/site/next-doors";
import { PageMasthead } from "@/components/site/page-masthead";
import { PageSection } from "@/components/site/page-section";
import { SiteCta } from "@/components/site/site-cta";
import { SiteFooter } from "@/components/site/site-footer";
import { SlabList, type SlabItem } from "@/components/site/slab";
import { JsonLd } from "@/components/ui/json-ld";
import { Marquee, MarqueeItem } from "@/components/ui/marquee";
import { Rise } from "@/components/ui/scroll-fx";
import { breadcrumbNode, itemListNode, webPageNode } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-meta";
import { SITE } from "@/lib/site";
import { formatBudget, MORE_IDEAS, PICK_TESTS, STARTERS } from "@/lib/starters";

/**
 * `/start`: the single most important conversion page on the site.
 *
 * It answers exactly one question, and it is the only page permitted to:
 * *what do I build first?* `website.md` section 4's ownership table sends every
 * other surface here rather than letting them re-answer it, including
 * `/answers` question 10, because two pages targeting one query split the link
 * equity and let the engine pick, usually wrongly.
 *
 * Not a quiz and not a form. Five links, or in this case five specifications,
 * plus the three tests that make the choice checkable rather than a matter of
 * taste. A quiz would imply the answer depends on the person; it does not.
 *
 * ⚠️ **Nothing here is published yet and the page says so four times**: in the
 * spec block, on every slab, in the section heading, and in the zero state at
 * the foot. `budgetMinutes` is a scope, not a measurement, and it is labelled
 * "budget" everywhere it appears. `the-bar.md` and `brand.md` both make
 * fabricated work terminal for a company whose product is verified work, and a
 * time figure that reads as measured when it was estimated is exactly that
 * fabrication in its most deniable form.
 *
 * What the page can honestly do today is make the choice, which is the thing
 * the reader is actually stuck on. The walkthrough arrives as
 * `/builds/[slug]`, and the slabs become links the day it does.
 */

const DESCRIPTION =
  "Five first builds worth one evening: what to build first with AI, each ₹0 to run, no coding background, each ending at a live URL you can send someone.";

export const metadata: Metadata = pageMetadata({
  path: "/start",
  title: "What to build first",
  description: DESCRIPTION,
});

const SLABS: readonly SlabItem[] = STARTERS.map((starter) => ({
  title: starter.title,
  /* The situation first, the description second. See the note at the head of
     `starters.ts`: people act on situations they recognise, not on categories. */
  body: starter.scene,
  detail: starter.does,
  meta: [
    formatBudget(starter.budgetMinutes),
    starter.tools.join(" + "),
    "₹0",
    "no code written",
  ],
}));

export default function StartPage() {
  const structuredData = [
    webPageNode({
      path: "/start",
      name: `What to build first | ${SITE.name}`,
      description: DESCRIPTION,
      type: "CollectionPage",
    }),
    itemListNode({
      path: "/start",
      name: "Five first builds",
      items: STARTERS.map((starter) => ({
        name: starter.title,
        /* `does`, not `scene`. The scene is written to be read on the page and
           makes no sense stripped of the page around it; an ItemList
           description is quoted alone, so it gets the sentence that survives
           being quoted alone. */
        description: starter.does,
      })),
    }),
    breadcrumbNode("/start", [{ name: "Start", path: "/start" }]),
  ];

  return (
    <div className="flex min-h-[100svh] flex-col">
      <JsonLd nodes={structuredData} />

      <LandingHeader current="/start" />

      <main className="flex-1">
        <PageMasthead
          eyebrow="Start here"
          lines={[{ text: "What to build" }, { text: "first", accentSuffix: "\\" }]}
          label="What to build first"
          answer={
            <>
              It is 9pm on a Sunday and somebody in your section is asking for
              the timetable again. That is a build. Pick one small thing a real
              person needs this week and put it on a live URL tonight. These
              five cost ₹0 to build, ₹0 to keep running, and need no coding
              background.
            </>
          }
        />

        <PageSection
          id="the-five"
          title="The five"
          shards={3}
          lede={
            <>
              Every one of these already exists as a problem somebody has this
              week. None of them is clever. That is the point: the clever ones
              are the ones that sit at 80% forever.
            </>
          }
        >
          <div className="max-w-[68rem]">
            <SlabList items={SLABS} />
          </div>
        </PageSection>

        <PageSection
          id="how-to-pick"
          title="How to pick"
          shards={2}
          lede={
            <>
              Most first builds do not fail. They stall, at about 80%, on a
              Tuesday, and never get mentioned again. These three tests are what
              you run before the evening starts, not after.
            </>
          }
        >
          <Rise stagger={0.08} y={30} select="[data-test]">
            <dl className="max-w-[72rem]">
              {PICK_TESTS.map((item, i) => (
                <div
                  key={item.test}
                  data-test
                  className="relative border-t border-line py-[clamp(1.25rem,3vw,2.25rem)] lg:flex lg:gap-[clamp(1.5rem,4vw,3rem)]"
                >
                  {/* The tests are a genuine sequence: you cannot check the
                      second before the first has a name in it. `how-it-works` on
                      the homepage owns the same argument for the same reason,
                      and numbering appears nowhere else on this page. */}
                  <dt className="flex shrink-0 items-baseline gap-[clamp(0.75rem,1.6vw,1.125rem)] lg:w-[clamp(16rem,28vw,26rem)]">
                    <span className="font-mono text-[clamp(1.25rem,2.4vw,2rem)] leading-none tabular-nums text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[clamp(1.0625rem,2vw,1.5rem)] leading-tight font-bold text-balance text-foreground">
                      {item.test}
                    </span>
                  </dt>

                  <dd className="mt-3 max-w-[58ch] lg:mt-0">
                    <p className="text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
                      {item.detail}
                    </p>
                    {/* The counterexample, in the data face and marked with the
                        same × the refusals list uses. Naming what fails a test
                        is more useful than restating the test, and it is the
                        part people recognise themselves in. */}
                    <p className="mt-2.5 flex items-baseline gap-2 font-mono text-micro text-accent-ink">
                      <span aria-hidden="true">×</span>
                      {item.fails}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </Rise>
        </PageSection>

        <PageSection
          id="more-ideas"
          title="Ten more"
          shards={1}
          lede={
            <>
              If none of the five is yours, the problem is not taste, it is that
              nothing has occurred to you yet. Ten more, named. One of them is
              about your campus.
            </>
          }
        >
          {/* The strip runs, and slows to a crawl when you reach for it. Under
              reduced motion and with no JavaScript it is an ordinary
              horizontally scrollable list, which is the only honest fallback:
              a frozen strip whose far end nobody can reach is worse than no
              strip. See "The ticker" in `globals.css`. */}
          <Marquee label="More things worth building">
            {MORE_IDEAS.map((idea) => (
              <MarqueeItem key={idea}>{idea}</MarqueeItem>
            ))}
          </Marquee>
        </PageSection>

        <PageSection
          id="what-you-get"
          title="What you get on the way"
          shards={0}
          lede={
            <>
              Everybody posts the version that worked. What actually costs you
              the evening is the twenty minutes where the model confidently
              wrote something broken. That part gets written down too.
            </>
          }
        >
          <div className="max-w-[64rem]">
            <BuildIndex count={3} />
          </div>
        </PageSection>

        <div className="h-[clamp(2.5rem,7vw,4.5rem)]" />

        <NextDoors
          doors={[
            {
              href: "/tools",
              label: "Which tool",
              detail:
                "Lovable, Bolt, Replit, v0, Emergent. What each is best at and where each stops.",
            },
            {
              href: "/answers",
              label: "Answers",
              detail:
                "Twelve straight answers, including how long a build takes and what it costs in ₹.",
            },
            {
              href: "/builds",
              label: "Builds",
              detail:
                "The index every one of these five lands in, with prompts, failures and a live URL.",
            },
          ]}
        />
        <SiteCta
          line={<>So which one are you building tonight?</>}
          body={
            <>
              Block off the evening, pick the one you already have a person in
              mind for, and send the URL when it works. Every build that ships
              gets announced on Instagram before it appears here.
            </>
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}
