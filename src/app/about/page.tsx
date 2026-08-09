import type { Metadata } from "next";
import * as React from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/site/landing/landing-header";
import { NextDoors } from "@/components/site/next-doors";
import { PageMasthead } from "@/components/site/page-masthead";
import { PageSection } from "@/components/site/page-section";
import { SiteCta } from "@/components/site/site-cta";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatThisIsNot } from "@/components/site/what-this-is-not";
import { JsonLd } from "@/components/ui/json-ld";
import { Rise } from "@/components/ui/scroll-fx";
import { WHY_NOW } from "@/lib/evidence";
import { articleNode, breadcrumbNode, webPageNode } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-meta";
import { SITE } from "@/lib/site";

/**
 * `/about`: what this is, why now, and what it refuses to be.
 *
 * A trust surface rather than a traffic surface, and it is written accordingly:
 * short paragraphs, every claim carrying a name, a date or a number, and the
 * market figures printed with their verification dates rather than asserted.
 * Those figures are what make "why now" concrete, and concrete is the only
 * thing that separates this page from every other about page.
 *
 * Contact lives here rather than on a `/contact` page. A standalone page with
 * an address on it is thin content; folded in, it strengthens a page that has
 * to exist anyway, and `contactPoint` on the Organization block in `layout.tsx`
 * means an engine can read it either way.
 *
 * `WhatThisIsNot` is reused verbatim from the landing page rather than
 * reworded. The five refusals are canonical text from `brand.md`, and a second
 * version of a canonical statement is how the two eventually disagree.
 *
 * The figures are printed compactly here and in full on `/data`, which owns
 * them. Same rule as everywhere else: one owner per claim, and everybody else
 * links.
 */

const DESCRIPTION =
  "ALGOBIC is the front door to building: no school, no courses, no placement promise. What it is, why 2026 and not 2024, and the five things it refuses to be.";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  /* "About | ALGOBIC" is fifteen characters and describes nothing. A title has
     roughly sixty before a SERP truncates it and spending fifteen of them is
     the cheapest miss available. */
  title: "About ALGOBIC and why now",
  description: DESCRIPTION,
});

export default function AboutPage() {
  const structuredData = [
    webPageNode({
      path: "/about",
      name: `About ALGOBIC and why now | ${SITE.name}`,
      description: DESCRIPTION,
      type: "AboutPage",
    }),
    articleNode({
      path: "/about",
      headline: "What ALGOBIC is, and why now",
      description: DESCRIPTION,
    }),
    breadcrumbNode("/about", [{ name: "About", path: "/about" }]),
  ];

  return (
    <div className="flex min-h-[100svh] flex-col">
      <JsonLd nodes={structuredData} />

      <LandingHeader />

      <main className="flex-1">
        <PageMasthead
          eyebrow="About"
          lines={[{ text: "The front" }, { text: "door", accentSuffix: "\\" }]}
          label="The front door"
          answer={
            <>
              You saw an app on your feed, felt the itch, and did not build it.
              Not because it was hard. Because nobody showed you the door.
              ALGOBIC is that door: no degree, no coding background, no course
              to buy. Every build published end to end with a live URL.
            </>
          }
        />

        <PageSection id="what-we-do" title="What we do" shards={3}>
          <div className="max-w-[64ch] space-y-[clamp(0.875rem,2vw,1.25rem)] text-[clamp(1rem,1.45vw,1.125rem)] leading-relaxed text-muted">
            <p className="text-foreground">
              We convert scrolling into shipping.
            </p>
            <p>
              Somebody watches thirty seconds of an AI app and thinks{" "}
              <em className="not-italic text-foreground">I could make that</em>.
              In 2026 they can, and they still do not. Not from lack of
              capability. From lack of a path, a deadline, and anyone noticing.
            </p>
            <p>
              So: you pick a thing you saw. The route from nothing to shipped is
              already written down, including the part where it breaks. At the
              end the thing is real and public with your name on it.
            </p>
            <p>
              We do not teach. No syllabus, no module list, no certificate. AI
              already teaches better than any instructor, free, at 3am. Selling
              instruction in 2026 is selling ice in winter.
            </p>
          </div>
        </PageSection>

        <PageSection
          id="why-now"
          title="Why now, and not two years ago"
          shards={2}
          lede={
            <>
              Because the requirement disappeared. The tools solved capability.
              Nobody solved activation, and that gap is the entire business.
            </>
          }
        >
          <Rise stagger={0.07} y={26} select="[data-figure]">
            <dl className="max-w-[74rem]">
              {WHY_NOW.map((figure) => (
                <div
                  key={figure.figure}
                  data-figure
                  className="flex flex-col gap-2 border-t border-line py-[clamp(0.875rem,2.2vw,1.5rem)] sm:flex-row sm:gap-[clamp(1.5rem,4vw,3rem)]"
                >
                  <dt className="shrink-0 font-display text-[clamp(1.25rem,2.6vw,2rem)] leading-none whitespace-nowrap tabular-nums text-foreground sm:w-[clamp(6rem,11vw,9rem)]">
                    {figure.figure}
                  </dt>
                  <dd>
                    <p className="max-w-[58ch] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
                      {figure.claim}
                    </p>
                    <p className="mt-1.5 font-mono text-micro text-muted">
                      {figure.source ? `${figure.source} · ` : null}checked{" "}
                      {figure.asOf}
                      {figure.confidence === "no-methodology"
                        ? " · no method published, trust it least"
                        : null}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </Rise>

          <p className="mt-[clamp(1.25rem,3vw,1.75rem)] max-w-[62ch] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
            Two figures were retracted from our own documents on 2026-07-30 for
            being unverifiable and neither appears here. The full list, with the
            confidence mark on every row, is on{" "}
            <Link
              href="/data"
              className="group inline-flex items-baseline gap-1.5 text-accent-ink underline decoration-line underline-offset-4 hover:decoration-accent-ink"
            >
              data
              <span aria-hidden="true" className="slash-glyph">
                \
              </span>
            </Link>
            .
          </p>
        </PageSection>

        <PageSection
          id="what-this-is-not"
          title="What this is not"
          shards={1}
          lede={
            <>
              Five refusals, and each one costs us something real. That is what
              makes them worth printing.
            </>
          }
        >
          <WhatThisIsNot />
        </PageSection>

        {/* The `Contact` section that used to sit here held the same Instagram
            trapdoor `SiteCta` now carries two screens further down, which put
            the identical control on one page twice. Its two real facts
            survived the merge: the entity line is in the footer colophon on
            every route, and the instruction about naming the specific thing is
            in the ask below, where somebody is actually about to write. */}

        <div className="h-[clamp(2.5rem,7vw,4.5rem)]" />

        <NextDoors
          doors={[
            {
              href: "/manifesto",
              label: "Manifesto",
              detail: "Six lines, written down so they can be held against us.",
            },
            {
              href: "/start",
              label: "What to build first",
              detail:
                "The practical version of this page. Five builds, ₹0 each, one evening.",
            },
            {
              href: "/join",
              label: "Join",
              detail:
                "No form, no fee. One message with one specific thing in it.",
            },
          ]}
        />
        <SiteCta
          line={<>You can watch this get built.</>}
          body={
            <>
              Nothing here is a course, and nothing on the site is for sale
              today. The work gets posted as it happens, including the parts
              that do not work, and Instagram is where it happens first. If you
              are writing about
              something you want to exist, name the specific thing: that is the
              sentence that gets an answer fastest.
            </>
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}
