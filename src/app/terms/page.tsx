import type { Metadata } from "next";
import * as React from "react";
import Link from "next/link";
import { Clauses, type ClauseItem } from "@/components/site/clause";
import { LandingHeader } from "@/components/site/landing/landing-header";
import { NextDoors } from "@/components/site/next-doors";
import { PageMasthead } from "@/components/site/page-masthead";
import { PageSection } from "@/components/site/page-section";
import { SiteCta } from "@/components/site/site-cta";
import { SiteFooter } from "@/components/site/site-footer";
import { JsonLd } from "@/components/ui/json-ld";
import { breadcrumbNode, webPageNode } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-meta";
import { SITE } from "@/lib/site";

/**
 * `/terms`: what the guides promise, and what they do not.
 *
 * `website.md` section 3 requires four positions stated: that build guides are
 * provided as-is with no warranty, that third-party tools carry their own terms
 * and their own prices and their pricing changes are not ours, an IP position
 * on published builds and prompts, and that `/data` figures are our own
 * measurements with a method attached rather than guarantees.
 *
 * All four are below, in plain language, because a legal page nobody can read
 * is a trust cost rather than a trust signal. The clause shape is the same one
 * `/privacy` uses: a heading a person would search for, a mono line carrying
 * the single fact, and a paragraph explaining it.
 *
 * ⚠️ Draft, not legal advice, and not a substitute for review.
 *
 * `noindex` and excluded from the sitemap, for the reasons recorded on
 * `/privacy`. Not disallowed in `robots.txt`, for the same reason.
 */

/* 148 characters. It was 169, which a SERP truncates mid-clause. */
const DESCRIPTION =
  "Build guides here are provided as-is. The tools they use carry their own terms and prices. What you build is yours, and our figures are measurements.";

export const metadata: Metadata = pageMetadata({
  path: "/terms",
  title: "Terms: as-is, and yours",
  description: DESCRIPTION,
  /* Indexed as of 2026-08-09, alongside `/privacy`, for the reasons recorded
     in `sitemap.ts`. `/join` is the only route still carrying `noindex`. */
});

const CLAUSES: readonly ClauseItem[] = [
  {
    heading: "The guides are provided as-is",
    answer: "No warranty. Follow them at your own risk.",
    body: (
      <>
        <p>
          Every build write-up on this site documents something that worked when
          it was written, on the tools and versions named in it, on the date
          printed at the top. Software changes underneath a guide. A model gets
          retrained, a free tier tightens, an interface moves a button, and a
          step stops matching what you see.
        </p>
        <p>
          We correct what we find and we date every correction. We do not promise
          any guide is currently accurate, that following it produces a working
          result, or that a result it produces is fit for anything in particular.
        </p>
      </>
    ),
  },
  {
    heading: "Third-party tools are not ours",
    answer: "Their terms, their prices, their outages.",
    body: (
      <>
        <p>
          Lovable, Bolt, Replit, v0, Emergent, Supabase, Vercel, Google and every
          other service named on this site is operated by somebody else. Your use
          of them is governed by their terms, not by these. What they charge,
          what their free tier includes, and when they change either is entirely
          theirs to decide.
        </p>
        <p>
          This is exactly why no page here prints a price. A stale figure is
          checkable and wrong, and a figure we do not print cannot mislead you
          into a bill you did not expect.
        </p>
      </>
    ),
  },
  {
    heading: "What you build is yours",
    answer: "Entirely. We claim nothing in it.",
    body: (
      <p>
        Follow a guide, build the thing, ship it, sell it, put it on your resume,
        rewrite it beyond recognition. We take no ownership, no licence, no
        revenue share and no credit requirement in anything you make. There is
        nothing to sign, because there is nothing being asked for.
      </p>
    ),
  },
  {
    heading: "The write-ups and prompts on this site",
    answer: "Read them, use them, adapt them. Do not republish them wholesale.",
    body: (
      <>
        <p>
          The prompts printed on build pages exist to be copied and run. That is
          their entire purpose and using them in your own project needs no
          permission.
        </p>
        <p>
          The write-ups themselves, the screenshots, the failure transcripts and
          the page text are ours. Quote them with attribution and a link. Do not
          republish a page in full, and do not scrape the set of them into a
          competing index. The difference is between using the work and taking
          it.
        </p>
      </>
    ),
  },
  {
    heading: "Our figures are measurements, not promises",
    answer: "Method attached, confidence marked, no guarantee implied.",
    body: (
      <>
        <p>
          Numbers published on{" "}
          <Link
            href="/data"
            className="group inline-flex items-baseline gap-1.5 text-accent-ink underline decoration-line underline-offset-4 hover:decoration-accent-ink"
          >
            data
            <span aria-hidden="true" className="slash-glyph">
              \
            </span>
          </Link>{" "}
          are our own measurements, published with the method, the sample and the
          date. Figures sourced from elsewhere carry their publisher, the date
          they were checked at source, and a mark saying how far to trust them.
        </p>
        <p>
          A time or a cost printed on a build page describes that build. It is
          not a prediction about yours, and it is not a guarantee of any outcome.
        </p>
      </>
    ),
  },
  {
    heading: "No job promise, ever",
    answer: "We do not guarantee employment. Nobody honest does.",
    body: (
      <p>
        This is not a placement service and it never claims a hiring outcome. A
        guarantee here would be either a lie or a refund liability, and we are
        not interested in either. What a finished build gives you is a live URL
        with your name on it, and what that is worth is decided by people who do
        not work here.
      </p>
    ),
  },
  {
    heading: "Links to other sites",
    answer: "We link out. We do not vouch for what is there.",
    body: (
      <p>
        Pages here link to tool documentation, published research and the sources
        behind figures we print. Those sites are not under our control and their
        content can change after we linked to it. A link is a citation, not an
        endorsement of everything on the far side of it.
      </p>
    ),
  },
  {
    heading: "Changes to these terms",
    answer: "Dated at the top. Bumped only on substantive change.",
    body: (
      <p>
        The date is the date this content last actually changed, set by hand
        rather than by the build. Continuing to use the site after a change means
        the current version applies. There is no account to close and no
        subscription to cancel, so leaving is closing the tab.
      </p>
    ),
  },
];

export default function TermsPage() {
  const structuredData = [
    webPageNode({
      path: "/terms",
      name: `Terms: as-is, and yours | ${SITE.name}`,
      description: DESCRIPTION,
    }),
    breadcrumbNode("/terms", [{ name: "Terms", path: "/terms" }]),
  ];

  return (
    <div className="flex min-h-[100svh] flex-col">
      <JsonLd nodes={structuredData} />

      <LandingHeader />

      <main className="flex-1">
        <PageMasthead
          eyebrow="Terms"
          lines={[{ text: "As-is, and" }, { text: "yours", accentSuffix: "\\" }]}
          label="As-is, and yours"
          answer={
            <>
              Build guides here are provided as-is with no warranty. The tools
              they use belong to other companies and carry their own terms and
              their own prices. Anything you build is entirely yours and we claim
              nothing in it. Our published figures are measurements with a method
              attached, not guarantees of any outcome.
            </>
          }
        />

        <PageSection
          id="the-terms"
          title="In full"
          shards={2}
          lede={
            <>
              Eight positions in plain language. The mono line under each heading
              is the position; the paragraph is the reasoning.
            </>
          }
        >
          <div className="max-w-[74rem]">
            <Clauses items={CLAUSES} />
          </div>
        </PageSection>

        <PageSection id="the-caveat" title="One caveat" shards={0}>
          <div className="max-w-[62ch] space-y-4 text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
            <p>
              This page is written by the people who built the site rather than
              by a lawyer. It is an honest statement of position and it will be
              reviewed before anything is sold or before any real data is taken
              from anyone.
            </p>
            <p>
              {SITE.legalName}, a {SITE.parent} company, India. Governed by the
              laws of India.
            </p>
          </div>
        </PageSection>

        <div className="h-[clamp(2.5rem,7vw,4.5rem)]" />

        <NextDoors
          doors={[
            {
              href: "/privacy",
              label: "Privacy",
              detail:
                "What gets collected, which is nothing, and what changes when that changes.",
            },
            {
              href: "/data",
              label: "Data",
              detail:
                "The figures this refers to, with the method and the confidence mark on each.",
            },
            {
              href: "/builds",
              label: "Builds",
              detail: "The guides this page is about. Every one, start to finish.",
            },
          ]}
        />
        <SiteCta
          line={<>Whatever you build stays yours.</>}
          body={
            <>
              That one is a term we are bound by, not a mood. Everything else on
              this page is dated, because it describes a site as it stands
              today, and the date moves when the site does. What is on offer
              right now is being told when the next build ships.
            </>
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}
