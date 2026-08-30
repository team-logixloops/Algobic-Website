import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { BUILDS, formatCost, formatDuration, getBuild } from "@/lib/builds";
import { breadcrumbNode, webPageNode } from "@/lib/json-ld";
import { SITE } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return BUILDS.map((build) => ({
    slug: build.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const build = getBuild(slug);
  if (!build) return {};

  const full = `${build.title} | ${SITE.name}`;
  const url = `${SITE.url}/builds/${build.slug}`;

  return {
    title: build.title,
    description: build.oneLine,
    alternates: { canonical: `/builds/${build.slug}` },
    openGraph: {
      type: "article",
      siteName: SITE.name,
      title: full,
      description: build.oneLine,
      url,
      locale: SITE.locale,
      images: ["/opengraph-image.png"],
      publishedTime: build.shipped,
      modifiedTime: build.updated,
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description: build.oneLine,
      images: ["/twitter-image.png"],
    },
  };
}

function getMastheadLines(title: string): Array<{ text: string; accentSuffix?: string }> {
  if (title.includes(" — ")) {
    const [name, ...rest] = title.split(" — ");
    const subtitle = rest.join(" — ");
    return [
      { text: name },
      { text: subtitle, accentSuffix: "\\" },
    ];
  }
  const words = title.split(" ");
  if (words.length <= 3) {
    return [{ text: title, accentSuffix: "\\" }];
  }
  const mid = Math.ceil(words.length / 2);
  return [
    { text: words.slice(0, mid).join(" ") },
    { text: words.slice(mid).join(" "), accentSuffix: "\\" },
  ];
}

export default async function BuildDetailPage({ params }: Props) {
  const { slug } = await params;
  const build = getBuild(slug);

  if (!build) {
    notFound();
  }

  const shortName = build.title.split(" — ")[0];

  const structuredData = [
    webPageNode({
      path: `/builds/${build.slug}`,
      name: `${build.title} | ${SITE.name}`,
      description: build.oneLine,
      type: "WebPage",
    }),
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "@id": `${SITE.url}/builds/${build.slug}#howto`,
      name: build.title,
      description: build.oneLine,
      totalTime: `PT${build.minutes}M`,
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: "INR",
        value: "0",
      },
      step: build.thePath.map((step) => ({
        "@type": "HowToStep",
        position: step.step,
        name: step.title,
        text: step.detail,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${SITE.url}/builds/${build.slug}#article`,
      headline: build.title,
      description: build.oneLine,
      url: `${SITE.url}/builds/${build.slug}`,
      inLanguage: SITE.lang,
      datePublished: build.shipped,
      dateModified: build.updated,
      author: {
        "@type": "Organization",
        name: build.builder,
        url: SITE.url,
      },
      publisher: {
        "@id": `${SITE.url}/#organization`,
      },
      isPartOf: {
        "@id": `${SITE.url}/#website`,
      },
    },
    breadcrumbNode(`/builds/${build.slug}`, [
      { name: "Builds", path: "/builds" },
      { name: build.title, path: `/builds/${build.slug}` },
    ]),
  ];

  return (
    <div className="flex min-h-[100svh] flex-col">
      <JsonLd nodes={structuredData} />

      <LandingHeader current="/builds" />

      <main className="flex-1">
        {/* Masthead */}
        <PageMasthead
          eyebrow={`Build · ${formatDuration(build.minutes)} · ${formatCost(build.cost)}`}
          lines={getMastheadLines(build.title)}
          label={build.title}
          answer={<>{build.oneLine}</>}
        >
          <div className="flex flex-wrap items-center gap-3 font-mono text-micro text-muted">
            <span className="text-accent-ink">{build.tools.join(" + ")}</span>
            <span aria-hidden="true">·</span>
            <span>{build.difficulty} build</span>
            <span aria-hidden="true">·</span>
            <span>By {build.builder}</span>
            {build.liveUrl ? (
              <>
                <span aria-hidden="true">·</span>
                <a
                  href={build.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground underline underline-offset-4 hover:text-accent-ink"
                >
                  Live demo <span className="slash-glyph">\</span>
                </a>
              </>
            ) : null}
          </div>
        </PageMasthead>

        {/* Section 1: What it does */}
        <PageSection
          id="what-it-does"
          title="What it does"
          shards={3}
          lede={
            <>
              The mechanics, data flow, and user interaction model behind {shortName}.
            </>
          }
        >
          <div className="max-w-[64rem] space-y-6">
            <p className="text-[clamp(1rem,1.5vw,1.1875rem)] leading-relaxed text-foreground">
              {build.whatItDoes}
            </p>

            <div className="border border-line bg-surface p-[clamp(1.25rem,3vw,2rem)]">
              <p className="font-display text-sm font-bold tracking-wider text-accent-ink uppercase">
                Technical Highlights
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {build.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-baseline gap-2.5 font-mono text-data text-muted"
                  >
                    <span aria-hidden="true" className="text-accent-ink">
                      \
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PageSection>

        {/* Section 2: Why it matters */}
        <PageSection
          id="why-it-matters"
          title="Why it matters"
          shards={2}
          lede={
            <>
              The architectural judgment, practical engineering decisions, and core problems solved.
            </>
          }
        >
          <div className="max-w-[64rem] space-y-6">
            <p className="text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
              {build.whyItMatters}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {build.useCases.map((useCase, idx) => (
                <div
                  key={useCase}
                  className="border-t border-line pt-3 sm:pt-4"
                >
                  <span className="font-mono text-micro text-muted">
                    0{idx + 1}
                  </span>
                  <p className="mt-1 font-display text-[clamp(0.9rem,1.4vw,1rem)] font-bold text-foreground">
                    {useCase}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </PageSection>

        {/* Section 3: System Architecture */}
        {build.architecture && build.architecture.length > 0 ? (
          <PageSection
            id="architecture"
            title="System architecture"
            shards={2}
            lede={
              <>
                End-to-end execution pipeline running across {build.tools.join(", ")}.
              </>
            }
          >
            <div className="max-w-[68rem]">
              <Rise stagger={0.06} y={20} select="[data-arch]">
                <div className="flex flex-col gap-3">
                  {build.architecture.map((layer) => (
                    <div
                      key={layer.step}
                      data-arch
                      className="flex flex-col gap-2 border-t border-line pt-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                    >
                      <div className="flex items-baseline gap-3 sm:w-64">
                        <span className="font-mono text-micro text-accent-ink tabular-nums">
                          {layer.step}
                        </span>
                        <span className="font-display font-bold text-foreground">
                          {layer.tool}
                        </span>
                      </div>
                      <p className="max-w-[54ch] font-mono text-micro text-muted sm:text-right">
                        {layer.role}
                      </p>
                    </div>
                  ))}
                </div>
              </Rise>
            </div>
          </PageSection>
        ) : null}

        {/* Section 4: The Path */}
        <PageSection
          id="the-path"
          title="The path"
          shards={2}
          lede={
            <>
              Step-by-step implementation guide. Verbatim code snippets, configurations, and prompts.
            </>
          }
        >
          <div className="max-w-[72rem]">
            <Rise stagger={0.08} y={28} select="[data-step]">
              <div className="flex flex-col gap-8">
                {build.thePath.map((step) => (
                  <div
                    key={step.step}
                    data-step
                    className="border-t border-line pt-4 sm:pt-6"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-data font-bold text-accent-ink tabular-nums">
                        0{step.step}
                      </span>
                      <h3 className="font-display text-[clamp(1rem,1.8vw,1.25rem)] font-bold text-foreground">
                        {step.title}
                      </h3>
                    </div>

                    <p className="mt-3 max-w-[64ch] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
                      {step.detail}
                    </p>

                    {step.prompt ? (
                      <div className="mt-4 border border-line bg-surface p-4">
                        <p className="font-mono text-micro text-accent-ink uppercase">
                          Verbatim Code / Config
                        </p>
                        <pre className="mt-2 overflow-x-auto font-mono text-micro text-foreground whitespace-pre-wrap">
                          <code>{step.prompt}</code>
                        </pre>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </Rise>
          </div>
        </PageSection>

        {/* Section 5: Where it broke */}
        <PageSection
          id="where-it-broke"
          title="Where it broke"
          shards={1}
          lede={
            <>
              The failure mode, root-cause breakdown, and resolution discovered during development.
            </>
          }
        >
          <div className="max-w-[64rem] border border-line bg-surface p-[clamp(1.25rem,3vw,2rem)] space-y-6">
            <div>
              <p className="font-mono text-micro text-accent-ink uppercase">
                The Tell
              </p>
              <p className="mt-1 font-display text-[clamp(0.95rem,1.6vw,1.15rem)] font-bold text-foreground">
                &ldquo;{build.whereItBroke.tell}&rdquo;
              </p>
            </div>

            <div className="border-t border-line pt-4">
              <p className="font-mono text-micro text-muted uppercase">
                Why it failed
              </p>
              <p className="mt-1 text-[clamp(0.875rem,1.3vw,1rem)] leading-relaxed text-muted">
                {build.whereItBroke.breakdown}
              </p>
            </div>

            <div className="border-t border-line pt-4">
              <p className="font-mono text-micro text-accent-ink uppercase">
                The Fix
              </p>
              <p className="mt-1 text-[clamp(0.875rem,1.3vw,1rem)] leading-relaxed text-foreground">
                {build.whereItBroke.solution}
              </p>
            </div>
          </div>
        </PageSection>

        {/* Section 6: What it cost */}
        <PageSection
          id="what-it-cost"
          title="What it cost"
          shards={1}
          lede={
            <>
              {formatCost(build.cost)} to build and run permanently within verified free tiers.
            </>
          }
        >
          <div className="max-w-[68rem]">
            <Ledger
              caption="Cost breakdown & free tier limits"
              columns={[
                { head: "Service / Tool", rowHeader: true },
                { head: "Cost" },
                { head: "Free Tier Limits" },
              ]}
              rows={build.costBreakdown.map((row) => [
                row.item,
                row.cost,
                row.note,
              ])}
            />
          </div>
        </PageSection>

        {/* Section 7: Make it yours */}
        <PageSection
          id="make-it-yours"
          title="Make it yours"
          shards={0}
          lede={
            <>
              Three concrete variations you can build and ship using this exact foundation.
            </>
          }
        >
          <div className="max-w-[68rem]">
            <ul className="flex flex-col gap-4">
              {build.makeItYours.map((variation, i) => (
                <li
                  key={variation}
                  className="flex flex-col gap-1 border-t border-line pt-3 sm:flex-row sm:gap-4"
                >
                  <span className="font-mono text-micro text-accent-ink">
                    0{i + 1}
                  </span>
                  <p className="text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-foreground">
                    {variation}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </PageSection>

        <div className="h-[clamp(2.5rem,7vw,4.5rem)]" />

        <NextDoors
          doors={[
            {
              href: "/builds",
              label: "All builds",
              detail:
                "Browse all verified build guides and start building your own AI apps.",
            },
            {
              href: "/start",
              label: "What to build first",
              detail:
                "Five first builds worth one evening, each ₹0 to run and finishable tonight.",
            },
            {
              href: "/tools",
              label: "Which tool for what",
              detail:
                "Lovable, Bolt, Replit, v0, Deepgram, LiveKit. What each is best at.",
            },
          ]}
        />

        <SiteCta
          line={<>Ready to ship {shortName}?</>}
          body={
            <>
              Review the architecture, clone the prompt and implementation steps, and deploy your live URL for ₹0.
            </>
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}
