import type { Metadata } from "next";
import { BuildIndex } from "@/components/site/build-index";
import { LandingHeader } from "@/components/site/landing/landing-header";
import { NextDoors } from "@/components/site/next-doors";
import { PageSection } from "@/components/site/page-section";
import { SiteCta } from "@/components/site/site-cta";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroParallax, type ParallaxTile } from "@/components/ui/hero-parallax";
import { Rise } from "@/components/ui/scroll-fx";
import { BUILDS, formatCost, formatDuration, latestBuilds } from "@/lib/builds";
import { embedJsonLd } from "@/lib/json-ld";
import { SITE } from "@/lib/site";

/**
 * `/builds`: the index the whole site points at.
 *
 * Five nav items, four footer links and every future build page resolve here,
 * so it ships before it has anything in it. What it must not do is pretend
 * otherwise. `design.md` section 5: *"No placeholder cards, no skeleton rows,
 * no invented titles."*
 *
 * The wall solves that by being the argument rather than dodging it. Fifteen
 * slots, drawn in the mark's own geometry, and the page states in text how many
 * are filled. At zero it reads as a commitment; at three it reads as an index
 * that is filling; at fifteen the generated art is gone entirely, replaced by
 * real builds with real durations and real links. The same component carries
 * every one of those states with no edit.
 *
 * Indexed, deliberately, despite being thin today. This is the section root
 * five internal links already name, and a `noindex` on it would orphan every
 * build page that lands under it. The counterweight is that it carries real
 * information now: what a build record contains, and the honest count.
 */

export const metadata: Metadata = {
  /* Was "Builds", which renders as a sixteen-character title describing
     nothing. The H1 says the same thing and this now matches it. */
  title: "Every build, start to finish",
  description:
    "Every ALGOBIC build, documented end to end: the exact prompts, where the model got it wrong, what it cost in ₹, and a live URL you can open.",
  /* Overridden, not inherited. The root layout canonicalises to `/`, and an
     inherited canonical would point this page at the homepage. */
  alternates: { canonical: "/builds" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `Every build, start to finish | ${SITE.name}`,
    description:
      "Every ALGOBIC build, documented end to end: prompts, failures, cost in ₹, and a live URL.",
    url: `${SITE.url}/builds`,
    locale: SITE.locale,
    /* Restated, not inherited. Declaring `openGraph` at all replaces the
       parent's resolved block wholesale, and the root's image came from the
       `opengraph-image.png` file convention rather than from an explicit
       field, so omitting this shipped the page with no `og:image` at all.
       Confirmed by diffing the two prerendered heads. */
    images: ["/opengraph-image.png"],
  },
  /* Same trap, opposite direction: leaving `twitter` off does not fall back to
     anything sensible, it inherits the homepage's title and description
     verbatim, so a shared build link previewed as the landing page. */
  twitter: {
    card: "summary_large_image",
    title: `Every build, start to finish | ${SITE.name}`,
    description:
      "Every ALGOBIC build, documented end to end: prompts, failures, cost in ₹, and a live URL.",
  },
};

/** Three rows of five. The wall is always this wide; only its contents change. */
const SLOTS = 15;

/**
 * The admission bar, verbatim from `website.md` section 3. All four, no
 * exceptions. Printed on the page rather than kept internal, because a standard
 * nobody can read is a standard nobody can hold you to.
 */
const ADMISSION_BAR = [
  {
    head: "A non-coder finishes it",
    body: "One person with no coding background can follow the write-up start to finish and end up with a working thing. Not a demo of one, and not a partial one that needs somebody technical for the last step.",
  },
  {
    head: "₹0 to build, ₹0 to keep",
    body: "Free to make and free to run, permanently, not for a trial window. A build that starts costing money in month two is a build somebody takes offline in month three.",
  },
  {
    head: "A live URL that stays up",
    body: "No idle sleep, no inactivity pause, no expiry. The URL is a promise: if it dies, the page gets converted to a case study or pulled the same week rather than left as a broken result.",
  },
  {
    head: "Real prompts, one real failure",
    body: "The exact prompts, verbatim, and the point where the model got it wrong along with the tell that gave it away. A write-up where nothing went wrong is a write-up nobody learns from.",
  },
] as const;

function buildWall(): ParallaxTile[] {
  const filled: ParallaxTile[] = latestBuilds(SLOTS).map((build) => ({
    title: build.title,
    meta: `${build.tools.join(" + ")} · ${formatDuration(build.minutes)} · ${formatCost(build.cost)}`,
    link: `/builds/${build.slug}`,
  }));

  /* Slots are numbered from where the real builds stop, so slot 04 becomes a
     build and the wall never renumbers under a returning reader. */
  const unclaimed: ParallaxTile[] = Array.from(
    { length: Math.max(0, SLOTS - filled.length) },
    (_, i) => ({
      title: `Slot ${String(filled.length + i + 1).padStart(2, "0")}`,
      meta: "unclaimed",
      empty: true,
    })
  );

  return [...filled, ...unclaimed];
}

export default function BuildsPage() {
  const tiles = buildWall();
  const count = BUILDS.length;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${SITE.url}/builds#webpage`,
      url: `${SITE.url}/builds`,
      name: `Every build, start to finish | ${SITE.name}`,
      description: metadata.description,
      isPartOf: { "@id": `${SITE.url}/#website` },
      about: { "@id": `${SITE.url}/#organization` },
      inLanguage: SITE.lang,
      dateModified: SITE.updated,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${SITE.url}/builds#itemlist`,
      name: "ALGOBIC builds",
      /* Honest at zero. An ItemList claiming entries it cannot enumerate is the
         structured-data version of a placeholder card. */
      numberOfItems: count,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      itemListElement: latestBuilds(SLOTS).map((build, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE.url}/builds/${build.slug}`,
        name: build.title,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${SITE.url}/builds#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
        {
          "@type": "ListItem",
          position: 2,
          name: "Builds",
          item: `${SITE.url}/builds`,
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-[100svh] flex-col">
      {structuredData.map((node) => (
        <script
          key={node["@id"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: embedJsonLd(node) }}
        />
      ))}

      <LandingHeader current="/builds" />

      <main className="flex-1">
        <HeroParallax
          tiles={tiles}
          header={
            /* No `transform-flat` here. It was added to keep the h1 out of the
               shell's 3D context, but the shell's `overflow: hidden` already
               forces `transform-style` to `flat` for everything inside it, so
               the class was answering a problem that cannot occur. What keeps
               the headline crisp is that it carries no transform at all: the
               scrim band in `hero-parallax.tsx` is what separates it from the
               plane. */
            <div className="relative mx-auto w-full max-w-[110rem] px-[max(1rem,4vw)] py-[clamp(2rem,6vw,5rem)]">
              <p className="eyebrow text-eyebrow">Builds</p>

              <h1 className="mt-[clamp(0.75rem,2vw,1.25rem)] max-w-[16ch] text-balance font-display text-display-xl text-foreground">
                Every build, start to finish
                <span aria-hidden="true" className="text-accent">
                  \
                </span>
              </h1>

              {/* The answer block, inside the first 100 words, per
                  `website.md` section 4. Written to be extractable verbatim by
                  an answer engine, which means it has to survive being quoted
                  without the page around it. */}
              <p className="mt-[clamp(1.25rem,3vw,2rem)] max-w-[52ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-relaxed text-foreground">
                A build is one thing somebody saw online and then made, written
                down completely: the exact prompts, verbatim, the point where the
                model got it wrong and the tell that gave it away, what it cost
                in ₹, and a live URL anyone can open. No coding background. No
                course to buy.
              </p>

              {/* Reads forward, not backward. It printed "00 of 15 slots
                  filled" and that is a true sentence whose only content is how
                  little exists; the wall behind it already carries the count
                  visually for anyone who wants it. Once builds exist the
                  filled count becomes worth printing and comes back. */}
              <p className="mt-[clamp(1rem,2.5vw,1.5rem)] font-mono text-data text-muted tabular-nums">
                {count > 0 ? (
                  <>
                    <span className="text-accent-ink">
                      {String(count).padStart(2, "0")}
                    </span>{" "}
                    of {SLOTS} slots filled
                  </>
                ) : (
                  <>
                    <span className="text-accent-ink">{SLOTS}</span> slots. Each
                    one becomes a live URL you can open.
                  </>
                )}
              </p>
            </div>
          }
        />

        {/* `PageSection` rather than a hand-rolled seam plus heading, so this
            route reads with the same spine as the nine that shipped on
            2026-08-09: heading in a sticky left rail, shards counting down to a
            clean line at the foot. */}
        <PageSection id="the-index" title="The index" shards={3}>
          <div className="max-w-[64rem]">
            {/* Zero state, real rows, same component. `showAllLink` is off:
                this page is where that link goes. */}
            <BuildIndex count={SLOTS} showAllLink={false} />
          </div>
        </PageSection>

        {/* Added 2026-08-09. The page carried 163 words, which is thin for the
            section root five internal links point at, and the honest reason it
            was thin is that it had nothing to list. It still has nothing to
            list. What it does have is a standard, and printing the standard is
            more useful to a reader than either a placeholder card or silence. */}
        <PageSection
          id="the-bar"
          title="What a build has to clear"
          shards={0}
          lede={
            <>
              Four rules, no exceptions, checked before anything is written up.
              A project failing any one of them is a case study instead, and the
              difference is a promise rather than a label.
            </>
          }
        >
          <Rise stagger={0.07} y={26} select="[data-rule]">
            <dl className="max-w-[72rem]">
              {ADMISSION_BAR.map((rule, i) => (
                <div
                  key={rule.head}
                  data-rule
                  className="flex flex-col gap-1.5 border-t border-line py-[clamp(1rem,2.5vw,1.625rem)] sm:flex-row sm:gap-[clamp(1.5rem,4vw,3rem)]"
                >
                  <dt className="flex shrink-0 items-baseline gap-2.5 sm:w-[clamp(13rem,22vw,18rem)]">
                    <span className="font-mono text-data tabular-nums text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[clamp(0.9375rem,1.5vw,1.0625rem)] leading-tight font-bold text-foreground">
                      {rule.head}
                    </span>
                  </dt>
                  <dd className="max-w-[62ch] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
                    {rule.body}
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
                "Lovable, Bolt, Replit, v0, Emergent. What each is best at and where each stops.",
            },
            {
              href: "/work",
              label: "Case studies",
              detail:
                "The other page type: real, founder-built, and not replicable by a beginner.",
            },
          ]}
        />
        <SiteCta
          line={<>The next one gets announced before it lands here.</>}
          body={
            <>
              Prompts, the point it broke, the real rupee cost and a live URL,
              every time. Instagram gets each build the day it ships, and this
              index catches up after.
            </>
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}
