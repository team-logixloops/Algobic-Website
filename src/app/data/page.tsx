import type { Metadata } from "next";
import * as React from "react";
import { LandingHeader } from "@/components/site/landing/landing-header";
import { NextDoors } from "@/components/site/next-doors";
import { PageMasthead } from "@/components/site/page-masthead";
import { PageSection } from "@/components/site/page-section";
import { SiteCta } from "@/components/site/site-cta";
import { SiteFooter } from "@/components/site/site-footer";
import { JsonLd } from "@/components/ui/json-ld";
import { Rise } from "@/components/ui/scroll-fx";
import { citation, DATASETS, PRIOR_WORK } from "@/lib/datasets";
import { WHY_NOW } from "@/lib/evidence";
import { breadcrumbNode, itemListNode, webPageNode } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-meta";
import { SITE } from "@/lib/site";

/**
 * `/data`: the citable asset.
 *
 * Original measurement is the most-cited content type there is, and the only
 * kind a bigger competitor cannot outrank by being bigger. They can outspend us
 * on volume. They cannot publish our numbers.
 *
 * ⚠️ We have no numbers yet, and this page's whole design problem is being
 * useful anyway without inventing one. The resolution: publish the **method**
 * before the finding. What will be measured, over what sample, how often, and
 * what has to exist before the first run means anything. A reader deciding
 * whether to trust an eventual figure needs exactly that, and it is the only
 * honest thing this surface can say today.
 *
 * The second half of the page is different in kind and the page says so out
 * loud. Those are other people's figures, not our measurements, and they live
 * in `evidence.ts` with a verification date and a confidence mark each. The
 * most persuasive statistic available to this brand is the one rendered quiet,
 * because neither of its two published sources states a method. Marking down
 * your own best number in public is the cheapest way to earn the rest.
 *
 * **No `Dataset` schema on this route today.** `Dataset` asserts a distribution
 * exists. Three datasets with no measurements behind them marked up as
 * `Dataset` would be a machine-readable claim to data we do not have, which is
 * the exact failure this page is built to avoid. It arrives with dataset one.
 */

const DESCRIPTION =
  "Published measurements with the method under each one, plus every market figure this site prints, dated and marked with how far to trust it.";

export const metadata: Metadata = pageMetadata({
  path: "/data",
  title: "Data and method",
  description: DESCRIPTION,
});

const CONFIDENCE_LABEL = {
  verified: "verified at source",
  "no-methodology": "no method published",
} as const;

export default function DataPage() {
  const structuredData = [
    webPageNode({
      path: "/data",
      name: `Data and method | ${SITE.name}`,
      description: DESCRIPTION,
      type: "CollectionPage",
    }),
    itemListNode({
      path: "/data",
      name: "ALGOBIC measurements",
      items: DATASETS.map((set) => ({
        name: set.title,
        description: set.question,
      })),
    }),
    breadcrumbNode("/data", [{ name: "Data", path: "/data" }]),
  ];

  return (
    <div className="flex min-h-[100svh] flex-col">
      <JsonLd nodes={structuredData} />

      <LandingHeader />

      <main className="flex-1">
        <PageMasthead
          eyebrow="Data"
          lines={[{ text: "Method before" }, { text: "number", accentSuffix: "\\" }]}
          label="Method before number"
          answer={
            <>
              Most sites publish a number and hide the method. Three
              measurements here publish the method first: what gets counted,
              over what sample, how often. Below them is every market figure
              this site prints, each with the date it was checked at source and
              a mark saying how far to trust it.
            </>
          }
        />

        <PageSection
          id="the-datasets"
          title="The datasets"
          shards={3}
          lede={
            <>
              Each of these is produced by work already happening rather than by
              work commissioned to fill a page, which is the only reason one
              person can sustain a research surface at all. The method is
              published first so the number cannot be quietly shaped to fit it.
            </>
          }
        >
          <Rise stagger={0.08} y={30} select="[data-set]">
            <div className="max-w-[74rem]">
              {DATASETS.map((set, i) => (
                <article
                  key={set.slug}
                  data-set
                  className="border-t border-line py-[clamp(1.25rem,3vw,2.25rem)]"
                >
                  <div className="flex items-baseline gap-[clamp(0.75rem,1.6vw,1.125rem)]">
                    <span className="font-mono text-[clamp(1.25rem,2.4vw,2rem)] leading-none tabular-nums text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="max-w-[34ch] text-balance font-display text-[clamp(1.0625rem,2vw,1.5rem)] leading-tight font-bold text-foreground">
                      {set.title}
                    </h3>
                  </div>

                  <p className="mt-[clamp(0.75rem,1.8vw,1.125rem)] max-w-[62ch] text-[clamp(0.9375rem,1.4vw,1.0625rem)] leading-relaxed text-foreground">
                    {set.question}
                  </p>

                  {/* The finding slot. Empty is a state this page renders
                      deliberately rather than a section that has not been
                      written: a dataset with no measurement behind it says so
                      where its number would go. */}
                  <p className="mt-[clamp(0.625rem,1.5vw,0.875rem)] flex items-baseline gap-2.5 font-mono text-data text-accent-ink">
                    <span
                      aria-hidden="true"
                      className="block h-[0.8rem] w-[1.5px] shrink-0 bg-accent"
                      style={{
                        transform: "skewX(calc(-1 * var(--slash-angle)))",
                      }}
                    />
                    {set.finding ?? "No finding yet. Nothing has been measured."}
                  </p>

                  <dl className="mt-[clamp(0.875rem,2.2vw,1.5rem)] grid gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-3 sm:grid-cols-2">
                    {[
                      { label: "Method", value: set.method },
                      { label: "Sample", value: set.sample },
                      { label: "Cadence", value: set.cadence },
                      { label: "Blocked by", value: set.blockedBy },
                    ].map((row) => (
                      <div key={row.label} className="border-t border-line pt-2.5">
                        <dt className="eyebrow text-eyebrow">{row.label}</dt>
                        <dd className="mt-1.5 max-w-[54ch] font-mono text-micro leading-relaxed text-muted">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
          </Rise>
        </PageSection>

        <PageSection
          id="figures"
          title="Figures this site prints"
          shards={2}
          lede={
            <>
              These are other people&apos;s numbers, not our measurements, and the
              distinction is the point of keeping them on a separate list. Each
              carries the date it was checked at source rather than the date it
              was published. Two figures were retracted from our own documents on
              2026-07-30 for being unverifiable, and neither appears anywhere on
              this site.
            </>
          }
        >
          <Rise stagger={0.07} y={28} select="[data-figure]">
            <div className="max-w-[74rem]">
              {WHY_NOW.map((figure) => (
                <div
                  key={figure.figure}
                  data-figure
                  className="border-t border-line py-[clamp(1rem,2.5vw,1.75rem)] lg:flex lg:gap-[clamp(1.5rem,4vw,3rem)]"
                >
                  {/* Set at display scale. A figure printed at body size is a
                      claim; printed at this size it is the subject of the row,
                      which is what a page of numbers is for. */}
                  {/* `whitespace-nowrap`: these are ranges, and a range that
                      breaks after its hyphen reads as two numbers stacked. It
                      did exactly that at 1440px before this was added. */}
                  <p className="shrink-0 font-display text-[clamp(1.75rem,4vw,3rem)] leading-none whitespace-nowrap tabular-nums text-foreground lg:w-[clamp(9rem,16vw,13rem)]">
                    {figure.figure}
                  </p>

                  <div className="mt-3 lg:mt-0">
                    <p className="max-w-[62ch] text-[clamp(0.9375rem,1.4vw,1.0625rem)] leading-relaxed text-foreground">
                      {figure.claim}
                    </p>

                    <p className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-micro text-muted">
                      {figure.source ? (
                        <>
                          <span>{figure.source}</span>
                          <span
                            aria-hidden="true"
                            className="block h-[0.7rem] w-px bg-line"
                            style={{
                              transform: "skewX(calc(-1 * var(--slash-angle)))",
                            }}
                          />
                        </>
                      ) : null}
                      <span>checked {figure.asOf}</span>
                      <span
                        aria-hidden="true"
                        className="block h-[0.7rem] w-px bg-line"
                        style={{
                          transform: "skewX(calc(-1 * var(--slash-angle)))",
                        }}
                      />
                      {/* The confidence mark takes `--accent-ink` when it is a
                          warning and stays muted when it is not, so the one
                          marked-down row is the one that catches the eye. */}
                      <span
                        className={
                          figure.confidence === "verified"
                            ? "text-muted"
                            : "text-accent-ink"
                        }
                      >
                        {CONFIDENCE_LABEL[figure.confidence]}
                      </span>
                    </p>

                    {figure.caveat ? (
                      <p className="mt-2.5 max-w-[58ch] border-l-2 border-accent pl-3 text-[clamp(0.875rem,1.25vw,0.9375rem)] leading-relaxed text-muted">
                        {figure.caveat}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Rise>
        </PageSection>

        <PageSection
          id="prior-work"
          title="Prior work"
          shards={1}
          lede={
            <>
              Three published studies this site&apos;s method rests on, linked
              rather than paraphrased. Each row states what the study found, how
              large its sample was, when we checked it at source, and what this
              site does differently because of it.
            </>
          }
        >
          <Rise stagger={0.07} y={26} select="[data-source]">
            <ol className="max-w-[74rem]">
              {PRIOR_WORK.map((source, i) => (
                <li
                  key={source.url}
                  data-source
                  className="border-t border-line py-[clamp(1rem,2.5vw,1.75rem)]"
                >
                  <div className="flex items-baseline gap-[clamp(0.75rem,1.6vw,1.125rem)]">
                    <span
                      aria-hidden="true"
                      className="font-mono text-data tabular-nums text-muted"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <h3 className="max-w-[42ch] text-balance font-display text-[clamp(0.9375rem,1.5vw,1.125rem)] leading-tight font-bold text-foreground">
                      {/* Dofollow, and no `target="_blank"`. Pages that cite get
                          cited, and opening a citation in a new tab is a
                          decision that belongs to the reader's own modifier
                          key rather than to us. */}
                      <a
                        href={source.url}
                        className="group inline-flex items-baseline gap-1.5 underline decoration-line underline-offset-4 hover:decoration-accent-ink"
                      >
                        {source.title}
                        <span aria-hidden="true" className="slash-glyph">
                          \
                        </span>
                      </a>
                    </h3>
                  </div>

                  <p className="mt-2.5 max-w-[62ch] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
                    {source.finding}
                  </p>

                  <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-micro text-muted">
                    <span className="text-accent-ink">{source.publisher}</span>
                    {source.sample ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="block h-[0.7rem] w-px bg-line"
                          style={{
                            transform: "skewX(calc(-1 * var(--slash-angle)))",
                          }}
                        />
                        <span>{source.sample}</span>
                      </>
                    ) : null}
                    <span
                      aria-hidden="true"
                      className="block h-[0.7rem] w-px bg-line"
                      style={{
                        transform: "skewX(calc(-1 * var(--slash-angle)))",
                      }}
                    />
                    <span>checked {source.verified}</span>
                  </p>

                  <p className="mt-2.5 max-w-[58ch] border-l-2 border-accent pl-3 text-[clamp(0.875rem,1.25vw,0.9375rem)] leading-relaxed text-muted">
                    {source.soWhat}
                  </p>
                </li>
              ))}
            </ol>
          </Rise>
        </PageSection>

        <PageSection
          id="cite-us"
          title="How to cite this"
          shards={0}
          lede={
            <>
              Attribution that takes effort does not happen. This is the line,
              ready to copy.
            </>
          }
        >
          <div className="max-w-[64rem]">
            <p className="border border-line bg-surface p-[clamp(0.875rem,2vw,1.25rem)] font-mono text-data leading-relaxed break-words text-foreground">
              {citation("/data", "Data")}
            </p>
            <p className="mt-[clamp(0.75rem,2vw,1.125rem)] max-w-[62ch] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
              Quote any figure on this page with its confidence mark attached.
              The mark is part of the figure. A number of ours reproduced without
              the sentence saying nobody published a method for it is a number we
              did not print.
            </p>
          </div>
        </PageSection>

        <div className="h-[clamp(2.5rem,7vw,4.5rem)]" />

        <NextDoors
          doors={[
            {
              href: "/about",
              label: "About",
              detail:
                "Why now, in the same figures, with the same dates attached.",
            },
            {
              href: "/work",
              label: "Case studies",
              detail:
                "Where the failure transcripts come from that dataset three counts.",
            },
            {
              href: "/builds",
              label: "Builds",
              detail:
                "Where the ₹ figures come from that dataset two measures.",
            },
          ]}
        />
        <SiteCta
          line={<>Think one of these numbers is wrong?</>}
          body={
            <>
              Say so. Two figures have already been pulled from our own
              documents for being unverifiable, and every correction gets made
              in public with the date on it. Instagram is the fastest way to
              reach a person here.
            </>
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}
