import type { Metadata } from "next";
import { AnswersTeaser } from "@/components/site/answers-teaser";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { StartCta } from "@/components/site/start-cta";
import { TheGap } from "@/components/site/the-gap";
import { ToolsTeaser } from "@/components/site/tools-teaser";
import { WhatThisIsNot } from "@/components/site/what-this-is-not";
import { WorkTeaser } from "@/components/site/work-teaser";
import { Seam } from "@/components/ui/seam";
import { WORK } from "@/lib/work";

/**
 * The real homepage, staged.
 *
 * `/` still serves the coming-soon splash. The homepage ships at priority 6 in
 * the build order (after `/builds` and `/work` exist) because a homepage with
 * no builds behind it is a brochure. This route exists so the design can be
 * reviewed before then.
 *
 * To go live: move this file's body into `app/page.tsx` and delete this route.
 */
export const metadata: Metadata = {
  title: "Homepage preview",
  description: "Staged homepage. Not published.",
  robots: { index: false, follow: false },
  /* Self-canonical, added 2026-08-09.
   *
   * Without it this route inherits the root layout's `alternates.canonical: "/"`
   * and declares the homepage as its canonical while also carrying `noindex`.
   * That pair is contradictory in the one direction that can actually hurt: a
   * `noindex` page pointing its canonical at a page you very much want indexed
   * invites an engine to consolidate the two and carry the directive across.
   * Unlikely, cheap to rule out, and this route is scheduled for deletion
   * anyway. */
  alternates: { canonical: "/preview" },
};

export default function HomepagePreview() {
  /* The seam labels a section, so it has to disappear with the section it
     labels. Otherwise an empty `/work` leaves a heading pointing at nothing. */
  const hasWork = WORK.length > 0;

  return (
    <div className="flex min-h-[100svh] flex-col">
      <SiteHeader />

      <main className="flex-1">
        <Hero />

        {/* Seams carry no label: every section already opens with an eyebrow
            h2 naming itself, so a label here repeated it, and at 240px the
            label's 0.42em tracking pushed the rule past the viewport. */}
        <Seam />
        <TheGap />

        <Seam />
        <HowItWorks />

        <Seam />
        <ToolsTeaser />

        <Seam />
        <AnswersTeaser />

        {hasWork ? (
          <>
            <Seam />
            <WorkTeaser />
          </>
        ) : null}

        <Seam />
        <WhatThisIsNot />

        <Seam />
        <StartCta />

        <div className="h-[clamp(3rem,8vw,6rem)]" />
      </main>

      <SiteFooter />
    </div>
  );
}
