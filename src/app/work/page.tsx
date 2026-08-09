import type { Metadata } from "next";
import * as React from "react";
import { LandingHeader } from "@/components/site/landing/landing-header";
import { Ledger } from "@/components/site/ledger";
import { NextDoors } from "@/components/site/next-doors";
import { PageMasthead } from "@/components/site/page-masthead";
import { PageSection } from "@/components/site/page-section";
import { SiteCta } from "@/components/site/site-cta";
import { SiteFooter } from "@/components/site/site-footer";
import { JsonLd } from "@/components/ui/json-ld";
import { Rise } from "@/components/ui/scroll-fx";
import { breadcrumbNode, itemListNode, webPageNode } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-meta";
import { SITE } from "@/lib/site";
import { latestWork, WORK } from "@/lib/work";

/**
 * `/work`: founder-built case studies.
 *
 * Real, and deliberately not replicable by a beginner: agentic systems, heavy
 * backend, anything that needs API spend. These carry credibility rather than
 * traffic, and mixing them into `/builds` would break the promise `/builds`
 * makes, which is that one non-coder can follow the page start to finish and
 * end up with a working thing for ₹0.
 *
 * ⚠️ `WORK` is empty and this page does not pretend otherwise. No placeholder
 * cards, no skeleton rows, no invented titles. What it prints instead is the
 * template every case study arrives in and the rule that separates the three
 * content types, both of which are real information a reader can act on.
 *
 * `noindex` was considered and rejected. This is a footer link from day one
 * precisely so case study #1 is not an orphan when it lands, and a page that
 * states its own admission bar is not thin content: it is the bar.
 *
 * **No `HowTo` schema on this route, ever.** Case studies make no replicability
 * claim, and marking them up as instructions is a promise the page does not
 * keep.
 */

const DESCRIPTION =
  "Founder-built AI systems, documented with the part nobody publishes: where the model was wrong, the tell that caught it, and what it really cost.";

export const metadata: Metadata = pageMetadata({
  path: "/work",
  title: "Case studies",
  description: DESCRIPTION,
});

/** The template, identical every time. From `website.md` section 3. */
const TEMPLATE = [
  {
    head: "What it does",
    body: "One sentence and one screenshot. If it takes a paragraph, the project is not understood yet.",
  },
  {
    head: "The demo",
    body: "A screen recording, unedited, at real latency with the real failures left in. No public URL that spends API credits on a stranger's click.",
  },
  {
    head: "Why it exists",
    body: "The actual problem, named. Not a use case invented after the fact to justify the build.",
  },
  {
    head: "How it is built",
    body: "The architecture, honest about which parts are held together with tape.",
  },
  {
    head: "The catch",
    body: "Where the model was wrong and how it got caught. Transcript, diff, the tell. This section is the whole point of the page.",
  },
  {
    head: "What it cost",
    body: "Real rupees, API spend included. Case studies are not held to the ₹0 rule and do not pretend to be.",
  },
  {
    head: "The repo",
    body: "If it is public. If it is not, the page says why rather than staying quiet about it.",
  },
] as const;

export default function WorkPage() {
  const count = WORK.length;

  const structuredData = [
    webPageNode({
      path: "/work",
      name: `Case studies | ${SITE.name}`,
      description: DESCRIPTION,
      type: "CollectionPage",
    }),
    itemListNode({
      path: "/work",
      name: "ALGOBIC case studies",
      /* Honest at zero. An ItemList claiming entries it cannot enumerate is the
         structured data version of a placeholder card, and it is checkable in
         one fetch. */
      items: latestWork(20).map((study) => ({
        name: study.title,
        url: `/work/${study.slug}`,
        description: study.oneLine,
      })),
    }),
    breadcrumbNode("/work", [{ name: "Case studies", path: "/work" }]),
  ];

  return (
    <div className="flex min-h-[100svh] flex-col">
      <JsonLd nodes={structuredData} />

      <LandingHeader />

      <main className="flex-1">
        <PageMasthead
          eyebrow="Case studies"
          lines={[{ text: "The part" }, { text: "nobody posts", accentSuffix: "\\" }]}
          label="The part nobody posts"
          answer={
            <>
              Everybody posts the demo that worked. A case study here is a
              founder-built system with the transcript of where the model was
              wrong and the tell that caught it. Agentic workflows, real
              backend, real API spend. Not replicable by a beginner, and it
              makes no claim to be.
            </>
          }
        />

        <PageSection
          id="the-index"
          title="The index"
          shards={3}
          lede={
            count === 0 ? (
              <>
                A case study without the recording, the transcript and the bill
                is a screenshot with a caption. Those three are what take the
                time, and they are the only reason anybody would read it.
              </>
            ) : undefined
          }
        >
          {count === 0 ? (
            <div className="max-w-[64rem] border border-line bg-surface p-[clamp(1.25rem,3vw,2rem)]">
              <p className="font-display text-[clamp(1rem,1.8vw,1.25rem)] leading-snug font-bold text-foreground">
                The catch is the page.
              </p>
              <p className="mt-2 max-w-[46ch] text-sm text-muted">
                Section five of every one of these is the moment the model was
                confidently wrong and the specific thing that gave it away.
                Nobody publishing AI app builder content has those, because you
                only get them by building the thing.
              </p>
            </div>
          ) : (
            <ul className="max-w-[64rem] border-t border-line">
              {latestWork(20).map((study) => (
                <li key={study.slug} className="border-b border-line py-4">
                  <span className="font-display font-bold text-foreground">
                    {study.title}
                  </span>
                  <span className="mt-1 block font-mono text-micro text-muted">
                    {study.stack.join(" + ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </PageSection>

        <PageSection
          id="the-template"
          title="What a case study contains"
          shards={2}
          lede={
            <>
              Seven sections, identical every time. Section five is the reason
              the page type exists: nobody publishing AI app builder content has
              real agentic failure transcripts, and that is the one thing a
              bigger competitor cannot outspend us into.
            </>
          }
        >
          <Rise stagger={0.06} y={26} select="[data-part]">
            <dl className="max-w-[72rem]">
              {TEMPLATE.map((part, i) => (
                <div
                  key={part.head}
                  data-part
                  className="flex flex-col gap-1.5 border-t border-line py-[clamp(0.875rem,2.2vw,1.5rem)] sm:flex-row sm:gap-[clamp(1.5rem,4vw,3rem)]"
                >
                  <dt className="flex shrink-0 items-baseline gap-2.5 sm:w-[clamp(11rem,20vw,16rem)]">
                    <span className="font-mono text-data tabular-nums text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[clamp(0.9375rem,1.5vw,1.0625rem)] leading-tight font-bold text-foreground">
                      {part.head}
                    </span>
                  </dt>
                  <dd className="max-w-[62ch] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
                    {part.body}
                  </dd>
                </div>
              ))}
            </dl>
          </Rise>
        </PageSection>

        <PageSection
          id="three-types"
          title="Three kinds of page"
          shards={1}
          lede={
            <>
              A page that tries to be two of these breaks the promise the first
              one makes. Knowing which you are reading is the difference between
              a guide you can follow and a demonstration you can only watch.
            </>
          }
        >
          <Ledger
            caption="How the three content types differ"
            columns={[
              { head: "Type", rowHeader: true },
              { head: "Lives at" },
              { head: "The promise" },
              { head: "What it costs you" },
            ]}
            rows={[
              [
                "Build",
                "/builds/*",
                "One non-coder can follow it start to finish",
                "₹0 to build, ₹0 to keep running",
              ],
              [
                "Case study",
                "/work/*",
                "Real, and not replicable by a beginner",
                "Nothing. You are reading, not following",
              ],
              [
                "Data",
                "/data/*",
                "Our own measurement, with the method published",
                "Nothing. Cite it if it is useful",
              ],
            ]}
          />
        </PageSection>

        <PageSection id="the-rule" title="The rule about live demos" shards={0}>
          <div className="max-w-[62ch] space-y-4 text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
            <p>
              No case study here will ever expose an agent on our own API key at
              a public URL. No hosting tier caps that spend, and one loop script
              drains it. That is why every case study ships with a recording
              instead of a link, and why the recording is unedited: a demo you
              cannot run is only worth watching if the failures are still in it.
            </p>
            <p>
              A build page is the opposite. Its live URL is a promise, and if it
              dies the page gets converted or pulled the same week rather than
              left as a broken result on the most valuable surface on the site.
            </p>
          </div>
        </PageSection>

        <div className="h-[clamp(2.5rem,7vw,4.5rem)]" />

        <NextDoors
          doors={[
            {
              href: "/builds",
              label: "Builds",
              detail:
                "The other kind of page: replicable, ₹0, and a live URL you can open right now.",
            },
            {
              href: "/data",
              label: "Data",
              detail:
                "Where every documented failure gets counted and sorted into a taxonomy.",
            },
            {
              href: "/about",
              label: "About",
              detail:
                "What ALGOBIC is, why now, and the five things it refuses to be.",
            },
          ]}
        />
        <SiteCta
          line={<>Watch the next one get made.</>}
          body={
            <>
              Each case study arrives with the prompts, the point it broke, the
              real rupee cost including API calls, and an unedited recording.
              Instagram is where the next one gets announced first.
            </>
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}
