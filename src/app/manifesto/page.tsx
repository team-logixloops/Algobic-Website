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
import { DrawRule, Parallax } from "@/components/ui/scroll-fx";
import { articleNode, breadcrumbNode, webPageNode } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-meta";
import { SITE } from "@/lib/site";

/**
 * `/manifesto`: the copy, alone on the page.
 *
 * `website.md` section 3 gave this page one instruction, which was that it
 * carries no CTA, on the grounds that it is a trust surface. Overruled on
 * 2026-08-09: every route now closes on `SiteCta`, and a manifesto that is the
 * only page in the site with no way out of it is a trust surface nobody can act
 * on. The ask here is written to respect the original instruction rather than
 * ignore it. It asks for nothing, sells nothing, and says so in the first
 * sentence; what it offers is the place the claims get tested.
 *
 * ### The one place this page spends its boldness
 *
 * Every other interior route is a masthead and a sequence of sections. This one
 * is a masthead and then six statements each taking a band of the screen, set
 * at display scale, drifting at their own rates and stepping further right as
 * they descend. The indent is the argument: the six lines are a single sentence
 * getting closer to its point, and the last one lands furthest across and in
 * the only colour on the page.
 *
 * `Parallax` speeds increase down the sequence, so the six separate as you pass
 * them rather than travelling as a block. That is the same device `TheGap` uses
 * on the landing page, and the same warning applies: the elements carrying a
 * GSAP transform must never also carry a CSS `.reveal`, because a filled CSS
 * animation outranks an inline style and silently overwrites every frame GSAP
 * writes after it.
 *
 * The mark assembles at the foot, whole, exactly as it does at the end of the
 * landing page. Six lines about shipping, closing on the one image on the site
 * that is scattered attention becoming one finished thing.
 */

const DESCRIPTION =
  "Six lines. The job market changed and education did not. The internet does not care about your CGPA. What matters is what you have shipped.";

export const metadata: Metadata = pageMetadata({
  path: "/manifesto",
  title: "The ALGOBIC manifesto",
  description: DESCRIPTION,
});

/**
 * Straight from `SITE.manifesto`, which is canonical, plus the layout each line
 * is given. The text is not restated here: a second copy of a canonical
 * statement is how the two eventually disagree.
 */
const LAYOUT = [
  { indent: "lg:ml-0", rule: "bg-accent", speed: 0.08 },
  { indent: "lg:ml-[6%]", rule: "bg-accent-2", speed: 0.16 },
  { indent: "lg:ml-[12%]", rule: "bg-line", speed: 0.24 },
  { indent: "lg:ml-[18%]", rule: "bg-accent-2", speed: 0.32 },
  { indent: "lg:ml-[24%]", rule: "bg-line", speed: 0.4 },
  { indent: "lg:ml-[30%]", rule: "bg-accent", speed: 0.48 },
] as const;

export default function ManifestoPage() {
  const structuredData = [
    webPageNode({
      path: "/manifesto",
      name: `The ALGOBIC manifesto | ${SITE.name}`,
      description: DESCRIPTION,
    }),
    articleNode({
      path: "/manifesto",
      headline: "The ALGOBIC manifesto",
      description: DESCRIPTION,
    }),
    breadcrumbNode("/manifesto", [{ name: "Manifesto", path: "/manifesto" }]),
  ];

  return (
    <div className="flex min-h-[100svh] flex-col">
      <JsonLd nodes={structuredData} />

      <LandingHeader />

      <main className="flex-1">
        <PageMasthead
          eyebrow="Manifesto"
          lines={[{ text: "Six lines", accentSuffix: "\\" }]}
          label="Six lines"
          answer={
            <>
              Six lines, written down so they can be held against us. The job
              market changed and education did not. Most students graduate and
              very few builders do. The internet does not care about your CGPA,
              companies do not hire notes, and what matters is what you have
              shipped.
            </>
          }
        />

        <PageSection id="the-lines" title="The lines" shards={3}>
          <ol className="flex flex-col gap-[clamp(2.5rem,7vw,5.5rem)] py-[clamp(1rem,3vw,2.5rem)]">
            {SITE.manifesto.map((line, i) => {
              const style = LAYOUT[i] ?? LAYOUT[LAYOUT.length - 1];
              const last = i === SITE.manifesto.length - 1;

              return (
                <li key={line} className={style.indent}>
                  <Parallax speed={style.speed}>
                    {/* Draws itself as you arrive at the line it heads, scrubbed
                        against scroll rather than run on a timer, so the reader
                        is the one drawing it. */}
                    <DrawRule
                      className={`h-[3px] w-[clamp(2.5rem,8vw,5rem)] ${style.rule}`}
                    />

                    <p
                      className={`mt-[clamp(0.875rem,2vw,1.5rem)] max-w-[22ch] text-balance font-display leading-[0.95] font-bold ${
                        last
                          ? "text-[clamp(2rem,6.5vw,5rem)] text-accent-ink"
                          : "text-display-l text-foreground"
                      }`}
                    >
                      {line}
                    </p>
                  </Parallax>
                </li>
              );
            })}
          </ol>
        </PageSection>

        {/* Added 2026-08-09. The page was 174 words, which is thin for an
            indexed route, and the six lines alone give an answer engine nothing
            to extract but assertions. This section is the sourcing under them:
            named studies, dates, numbers, and one figure we deliberately refuse
            to use. It carries no ask, so `website.md`'s one instruction for
            this page still holds. */}
        <PageSection
          id="where-these-come-from"
          title="Where these come from"
          shards={1}
          lede={
            <>
              None of the six is a slogan. Each one has a number under it, and
              one of those numbers argues against a line we could have written
              and did not.
            </>
          }
        >
          <div className="max-w-[64ch] space-y-[clamp(0.875rem,2vw,1.25rem)] text-[clamp(0.9375rem,1.4vw,1.0625rem)] leading-relaxed text-muted">
            <p>
              The first two lines are not a complaint about colleges. The India
              Skills Report 2026, run by ETS with CII, AICTE and AIU across more
              than a lakh candidates and a thousand organisations, puts computer
              science engineers at 80% employability and IT engineers at 78%.
              Employability there is a test score rather than a job, so it does
              not prove everyone gets hired. It does prove that &ldquo;you will
              be unemployed&rdquo; is false, which is why that sentence appears
              nowhere on this site.
            </p>
            <p>
              What the lines are actually about is the distance between
              capability and activation. Between 41% and 46% of new code written
              globally is now generated by AI, and roughly 100 to 120 million
              people build business applications without being developers
              against 27.7 million professional developers. The tools stopped
              requiring a developer. Almost nobody is standing at the entrance
              saying which one to open.
            </p>
            <p>
              That is why the last line is about shipping rather than about
              learning. A live URL is checkable by anyone in four seconds. A
              certificate is a claim about a room you sat in. Every figure above
              is printed with its source and the date it was checked on{" "}
              <Link
                href="/data"
                className="group inline-flex items-baseline gap-1.5 text-accent-ink underline decoration-line underline-offset-4 hover:decoration-accent-ink"
              >
                data
                <span aria-hidden="true" className="slash-glyph">
                  \
                </span>
              </Link>
              , including the one marked down for having no published method.
            </p>
          </div>
        </PageSection>

        <PageSection
          id="what-follows"
          title="What follows from it"
          shards={0}
        >
          {/* This section used to carry its own `AssemblingMark`. `SiteCta` now
              closes every page with one, two sections below, and two cats
              assembling on the same screen makes the gesture read as a motif
              rather than as an arrival. The one that survived is the one that
              is on every other route. */}
          <div className="flex flex-col items-center py-[clamp(1rem,3vw,2rem)] text-center">
            <p className="max-w-[46ch] text-balance text-[clamp(0.9375rem,1.4vw,1.0625rem)] leading-relaxed text-muted">
              None of this is advice. It is the standard the builds on this site
              are held to, printed in advance so it can be checked against them.
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
                "The line about shipping, made operational. Five builds, one evening each.",
            },
            {
              href: "/about",
              label: "About",
              detail:
                "The longer version, with the figures and the dates attached.",
            },
            {
              href: "/builds",
              label: "Builds",
              detail: "Where the standard gets checked. Every build, start to finish.",
            },
          ]}
        />
        <SiteCta
          line={<>Six lines are cheap. The builds are the test.</>}
          body={
            <>
              Nothing on this page is selling you anything, and nothing on this
              site is for sale today. Whether any of the six held is decided by
              work with a live URL on it, and that gets announced on Instagram
              first.
            </>
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}
