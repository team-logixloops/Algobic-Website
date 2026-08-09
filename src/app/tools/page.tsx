import type { Metadata } from "next";
import * as React from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/site/landing/landing-header";
import { Ledger } from "@/components/site/ledger";
import { NextDoors } from "@/components/site/next-doors";
import { PageMasthead } from "@/components/site/page-masthead";
import { PageSection } from "@/components/site/page-section";
import { SiteCta } from "@/components/site/site-cta";
import { SiteFooter } from "@/components/site/site-footer";
import { SlabList, type SlabItem } from "@/components/site/slab";
import { JsonLd } from "@/components/ui/json-ld";
import { Rise } from "@/components/ui/scroll-fx";
import { breadcrumbNode, itemListNode, webPageNode } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-meta";
import { SITE } from "@/lib/site";
import { OPEN_THIS_ONE, TOOL_FACTS } from "@/lib/tool-facts";
import { TOOL_PAGES } from "@/lib/tools";

/**
 * `/tools`: which one to open first.
 *
 * The highest commercial-intent search real estate available to this site.
 * People search "lovable vs bolt" constantly and the results are mostly vendor
 * blogs, which is a gap that exists for a structural reason rather than a
 * lucky one: a vendor cannot write the row that says where their own tool
 * stops. The whole page is that column.
 *
 * Two absences here are decisions rather than gaps, and both are stated on the
 * page itself rather than left for a reader to notice:
 *
 * **No prices.** Every one of these companies has changed pricing in the last
 * year. A stale ₹ figure is worse than no figure, because it is checkable, it
 * is wrong, and it loses the ranking the page earned. The free-tier column
 * carries the shape of each limit, which is stable.
 *
 * **No winner.** There is no best AI app builder. There is a best one for the
 * thing being built tonight, and a roundup that crowns one is a roundup with an
 * affiliate link behind it. `OPEN_THIS_ONE` is the actual deliverable and the
 * table is the evidence underneath it.
 *
 * Cost intent belongs to `/answers/cost-to-build-an-app-with-ai-india` per the
 * ownership table, so this page links there and never re-answers it.
 */

const DESCRIPTION =
  "Lovable, Bolt, Replit, v0 and Emergent compared on one decision: which AI app builder to open first, what each is best at, and where each one stops.";

export const metadata: Metadata = pageMetadata({
  path: "/tools",
  /* Not "Which tool", which is the nav label. `design.md` section 7: the title
     does the keyword work and the H1 does the human work, and "Which tool |
     ALGOBIC" was a title that matched no search anybody performs. 44 characters
     with the brand appended, comfortably inside what a SERP renders. */
  title: "Which AI app builder to open first",
  description: DESCRIPTION,
});

const COMPARISON_SLABS: readonly SlabItem[] = TOOL_PAGES.map((page) => ({
  href: page.live ? `/tools/${page.slug}` : undefined,
  title: page.title,
  body: page.answers,
  meta: [page.kind, `/tools/${page.slug}`],
}));

export default function ToolsPage() {
  const structuredData = [
    webPageNode({
      path: "/tools",
      name: `Which AI app builder to open first | ${SITE.name}`,
      description: DESCRIPTION,
      type: "CollectionPage",
    }),
    itemListNode({
      path: "/tools",
      name: "AI app builders compared",
      items: TOOL_FACTS.map((tool) => ({
        name: tool.name,
        description: `Best at: ${tool.bestAt}. Stops at: ${tool.stopsAt}.`,
      })),
    }),
    breadcrumbNode("/tools", [{ name: "Tools", path: "/tools" }]),
  ];

  return (
    <div className="flex min-h-[100svh] flex-col">
      <JsonLd nodes={structuredData} />

      <LandingHeader current="/tools" />

      <main className="flex-1">
        <PageMasthead
          eyebrow="Which tool"
          lines={[{ text: "Open this" }, { text: "one first", accentSuffix: "\\" }]}
          label="Open this one first"
          answer={
            <>
              You have the idea. Now there are five tabs open and every one of
              them says it builds apps from a prompt. They are not
              interchangeable. Lovable makes it look designed. Bolt gets it
              running tonight. Replit hosts it and lets you edit the code. v0
              stops at one screen. Emergent is the Indian one.
            </>
          }
        />

        <PageSection
          id="open-this-one"
          title="Open this one"
          shards={3}
          lede={
            <>
              Nobody comparing these is asking what they do. You have already
              decided to build something and you want permission to open one
              tab. Here is the permission.
            </>
          }
        >
          <Rise stagger={0.07} y={28} select="[data-pick]">
            <dl className="max-w-[72rem]">
              {OPEN_THIS_ONE.map((pick) => (
                <div
                  key={pick.tool}
                  data-pick
                  className="flex flex-col gap-1.5 border-t border-line py-[clamp(1rem,2.5vw,1.75rem)] sm:flex-row sm:gap-[clamp(1.5rem,4vw,3rem)]"
                >
                  <dt className="flex shrink-0 items-baseline gap-2.5 sm:w-[clamp(9rem,16vw,13rem)]">
                    <span
                      aria-hidden="true"
                      className="block h-[0.8rem] w-[1.5px] shrink-0 bg-accent"
                      style={{
                        transform: "skewX(calc(-1 * var(--slash-angle)))",
                      }}
                    />
                    <span className="font-display text-[clamp(1rem,1.7vw,1.25rem)] leading-tight font-bold text-foreground">
                      {pick.tool}
                    </span>
                  </dt>
                  <dd className="max-w-[62ch] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
                    {pick.when}
                  </dd>
                </div>
              ))}
            </dl>
          </Rise>
        </PageSection>

        <PageSection
          id="the-table"
          title="The table"
          shards={2}
          lede={
            <>
              Read the third column first. Every vendor on earth publishes what
              their tool is best at. Not one of them publishes the row that says
              where it stops.
            </>
          }
        >
          {/* A real table, not three cards. `website.md` section 5: tables
              extract cleanly, which is most of what an answer engine can do
              with a comparison. Three cards side by side look better in a
              screenshot and are unreadable to the thing we most want reading
              this. */}
          <Ledger
            caption="AI app builders, compared on shape rather than on ranking"
            columns={[
              { head: "Tool", rowHeader: true },
              { head: "Best at" },
              { head: "Where it stops" },
              { head: "Free tier" },
              { head: "Based in" },
            ]}
            rows={TOOL_FACTS.map((tool) => [
              tool.name,
              tool.bestAt,
              tool.stopsAt,
              tool.freeTier,
              tool.base,
            ])}
          />
        </PageSection>

        <PageSection
          id="comparisons"
          title="Head to head"
          shards={1}
          lede={
            <>
              Six matchups, each settling one argument people are already having
              in comment sections. They arrive with a build made in each tool
              attached, which is the part a vendor blog cannot fake.
            </>
          }
        >
          <div className="max-w-[68rem]">
            <SlabList items={COMPARISON_SLABS} />
          </div>
        </PageSection>

        <PageSection
          id="on-prices"
          title="On prices"
          shards={0}
        >
          <div className="max-w-[62ch] space-y-4 text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
            <p>
              This page prints no prices. Every one of these five has changed
              its pricing at least once in the last year, and a page carrying a
              stale figure is worse than a page carrying none: it is checkable,
              it is wrong, and it is the fastest way to lose a ranking the page
              earned. Open the pricing page. It takes eleven seconds and it is
              correct.
            </p>
            <p>
              What a first build costs in rupees is a different question, and it
              has its own answer:{" "}
              <Link
                href="/answers#cost-to-build-an-app-with-ai-india"
                className="group inline-flex items-baseline gap-1.5 text-accent-ink underline decoration-line underline-offset-4 hover:decoration-accent-ink"
              >
                how much it costs to build an app with AI in India
                <span aria-hidden="true" className="slash-glyph">
                  \
                </span>
              </Link>
              .
            </p>
          </div>
        </PageSection>

        <div className="h-[clamp(2.5rem,7vw,4.5rem)]" />

        <NextDoors
          doors={[
            {
              href: "/start",
              label: "What to build first",
              detail:
                "The tool matters less than the thing. Five first builds, each ₹0 and one evening.",
            },
            {
              href: "/answers",
              label: "Answers",
              detail:
                "Vibe coding, AI code safety, deploying, and what employers make of an AI-built project.",
            },
            {
              href: "/builds",
              label: "Builds",
              detail:
                "Where each of these tools gets used in public, with the prompts and the failures.",
            },
          ]}
        />
        <SiteCta
          line={<>Pick one. Then stop reading about tools.</>}
          body={
            <>
              Comparing is the comfortable part and it does not produce a URL.
              Every build published here names the tool it used and the exact
              point that tool ran out, and each one is announced on Instagram
              first.
            </>
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}
