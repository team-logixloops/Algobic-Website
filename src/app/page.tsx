import { LandingFooter } from "@/components/site/landing/landing-footer";
import { LandingHeader } from "@/components/site/landing/landing-header";
import { LandingHero } from "@/components/site/landing/landing-hero";
import { Resolution } from "@/components/site/landing/resolution";
import { TheCount } from "@/components/site/landing/the-count";
import { WhyNow } from "@/components/site/landing/why-now";
import { HowItWorks } from "@/components/site/how-it-works";
import { TheGap } from "@/components/site/the-gap";
import { WhatThisIsNot } from "@/components/site/what-this-is-not";
import { Seam } from "@/components/ui/seam";
import { ShardCursor } from "@/components/ui/shard-cursor";

/**
 * The landing page.
 *
 * Read top to bottom it is one movement from dispersed to resolved, which is
 * the mark read backwards: horizontal shards gathering into an animal. The hero
 * runs the shatter field live and sits off-axis; the closing section is the
 * only centred block, the only change of ground, and the only place the mark
 * appears whole.
 *
 * Between them the register changes every section on purpose, so no two screens
 * look like the same template: prose, then a mono data table, then a hairline
 * grid, then a dense definition list.
 *
 * No `select-none`. People copy figures, and this page is asking to be checked.
 *
 * Everything here is a Server Component except the shatter field, the theme
 * toggle and the Instagram trapdoor, which are the only three things that need
 * a browser. The page reads completely with JavaScript disabled.
 */
export default function Home() {
  return (
    <div className="flex min-h-[100svh] flex-col">
      <ShardCursor />
      <LandingHeader />

      <main className="flex-1">
        <LandingHero />

        {/* Seams carry no label: every section opens with an eyebrow h2 naming
            itself, so a label here repeats it, and at 240px the 0.42em tracking
            pushes the rule past the viewport.

            The shard count runs down. The first divider still carries the full
            cluster; by the last there is one mark left on a clean line. That is
            the same dissolve the cat performs at the foot of the page, spread
            across the whole document, in the one element with no content to
            compete with. Nothing announces it and nothing depends on noticing
            it. */}
        <Seam shards={3} />
        <TheCount />

        <Seam shards={3} />
        <TheGap />

        <Seam shards={3} />
        <WhyNow />

        <Seam shards={2} />
        <HowItWorks />

        <Seam shards={1} />
        <WhatThisIsNot />

        <div className="h-[clamp(3rem,8vw,5.5rem)]" />

        {/* No seam before this one. The change of ground is the divider, and
            two dividers in a row would undo the arrival. */}
        <Resolution />
      </main>

      <LandingFooter />
    </div>
  );
}
