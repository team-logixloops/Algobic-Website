import { LandingHeader } from "@/components/site/landing/landing-header";
import { LandingHero } from "@/components/site/landing/landing-hero";
import { Resolution } from "@/components/site/landing/resolution";
import { TheCount } from "@/components/site/landing/the-count";
import { WhyNow } from "@/components/site/landing/why-now";
import { HowItWorks } from "@/components/site/how-it-works";
import { TheGap } from "@/components/site/the-gap";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatThisIsNot } from "@/components/site/what-this-is-not";
import { HingePanel } from "@/components/ui/hinge-panel";
import { HingeStack } from "@/components/ui/hinge-stack";
import { JsonLd } from "@/components/ui/json-ld";
import { ShatterGL } from "@/components/ui/shatter-gl";
import { webPageNode } from "@/lib/json-ld";
import { SITE } from "@/lib/site";

/**
 * The landing page.
 *
 * Seven screens, each a panel that closes over the one before it on the mark's
 * own diagonal. Read top to bottom it is one movement from dispersed to
 * resolved, which is the mark read backwards: horizontal shards gathering into
 * an animal. The opening screen runs the shatter field live and sits off-axis;
 * the closing screen is the only centred one, the only one that arrives flat,
 * and the only place the mark appears whole.
 *
 * Two things count down the page and they are the same argument twice. The
 * hinge angle goes 16, 13, 10, 7, 4, 0, so the stack comes to rest exactly at
 * the resolution. The shard cluster on each panel's leading edge goes 3, 3, 2,
 * 2, 1, 0, so the seam loses its shatter over the same distance and the last
 * one is a clean line. Neither is announced and nothing depends on noticing
 * either.
 *
 * The register changes every panel on purpose, so no two screens look like the
 * same template: prose over a shader, then a single enormous digit on inverted
 * ground, then three drifting statements, then a mono data table, then a
 * hairline path, then a dense definition list, then one centred mark.
 *
 * "The count" is the one inverted screen. It is also the only screen whose
 * content is drawn by the panel's own arrival rather than revealed by it.
 *
 * The footer is not the eighth screen. It sits underneath, fixed, and the stack
 * slides off it: after seven panels of things closing over each other, scroll
 * position has stopped meaning progress, and being uncovered rather than
 * arriving is the one gesture that reads as "nothing further will close over
 * this". Pure CSS, so it costs the timeline graph nothing.
 *
 * No `select-none`. People copy figures, and this page is asking to be checked.
 *
 * Everything here is a Server Component except the stack, the shatter field,
 * the count, the theme toggle and the Instagram trapdoor. The page reads
 * completely with JavaScript disabled: without the stack the panels are a
 * plain sequence of full-height sections in document order.
 */
export default function Home() {
  return (
    <div className="flex min-h-[100svh] flex-col">
      {/* The homepage's own `WebPage` node, which used to be emitted from the
          layout onto every document. It describes this URL and only this one,
          which is what a page node is for. The reasoning is recorded in
          `layout.tsx` where it used to sit. */}
      <JsonLd
        nodes={[
          webPageNode({
            path: "/",
            name: SITE.title,
            description: SITE.about,
          }),
        ]}
      />

      {/* `home`: the wordmark is not a link here. Linking home from the top of
          home is a control that does nothing. */}
      <LandingHeader home />

      <main className="flex-1">
        <HingeStack>
          <HingePanel align="between" underHeader backdrop={<ShatterGL />}>
            <LandingHero />
          </HingePanel>

          <HingePanel
            title={
              <>
                <span className="sr-only">Zero </span>builds published
              </>
            }
            hinge={16}
            shards={3}
            ground="flip"
          >
            <TheCount />
          </HingePanel>

          <HingePanel title="The gap" hinge={13} shards={3} ground="surface">
            <TheGap />
          </HingePanel>

          <HingePanel title="Why now" hinge={10} shards={2}>
            <WhyNow />
          </HingePanel>

          <HingePanel
            title="How it works"
            hinge={7}
            shards={2}
            ground="surface"
          >
            <HowItWorks />
          </HingePanel>

          <HingePanel title="What this is not" hinge={4} shards={1}>
            <WhatThisIsNot />
          </HingePanel>

          <HingePanel
            title="Where this goes"
            hinge={0}
            shards={0}
            ground="surface"
          >
            <Resolution />
          </HingePanel>
        </HingeStack>
      </main>

      <SiteFooter />
    </div>
  );
}
