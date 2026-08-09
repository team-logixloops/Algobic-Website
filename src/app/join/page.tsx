import type { Metadata } from "next";
import * as React from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/site/landing/landing-header";
import { NextDoors } from "@/components/site/next-doors";
import { PageMasthead } from "@/components/site/page-masthead";
import { PageSection } from "@/components/site/page-section";
import { SiteCta } from "@/components/site/site-cta";
import { SiteFooter } from "@/components/site/site-footer";
import { InstagramTrapdoor } from "@/components/ui/instagram-trapdoor";
import { JsonLd } from "@/components/ui/json-ld";
import { Rise } from "@/components/ui/scroll-fx";
import { breadcrumbNode, webPageNode } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-meta";
import { SITE } from "@/lib/site";

/**
 * `/join`: intent capture, without a form.
 *
 * ⚠️ **There is no hosted form yet, and this page does not draw one.** A form
 * that posts nowhere is worse than no form: it takes a name and a phone number
 * from a student, drops them, and teaches that person that nothing here works.
 * `website.md` puts the form and the legal pages in the same commit, never one
 * before the other, and neither has shipped.
 *
 * What ships instead is the thing the form was for. The qualifying field was
 * always "what do you want to build", because that is the answer that makes
 * cost per qualified conversation computable and decides which build gets
 * written next. One message carrying that sentence does the same job, and it
 * arrives in a channel that already exists.
 *
 * `noindex`, and the reason is not crawl budget, which is irrelevant at this
 * scale. Two real reasons: this page owns no query, and it is the wrong entry
 * point. Somebody arriving from a search for the brand should land on `/`, read
 * the promise, then choose to come here, rather than landing cold on a page
 * asking them for something.
 *
 * The privacy link sits beside the action rather than only in the footer, which
 * is a rule from `website.md` section 3 and stays true even though today the
 * honest privacy answer is "nothing is collected".
 */

const DESCRIPTION =
  "How to tell ALGOBIC what you want to build. No form yet, no fee, no waitlist. One message with one specific thing in it.";

export const metadata: Metadata = pageMetadata({
  path: "/join",
  title: "Join: send one sentence",
  description: DESCRIPTION,
  index: false,
});

/** What a useful message contains. Three lines, and the third is the one that matters. */
const WHAT_TO_SEND = [
  {
    field: "The thing",
    detail:
      "One specific thing you want to exist. Not a category. “A bot that posts my section's timetable”, not “something with AI”.",
  },
  {
    field: "Who uses it",
    detail:
      "Name one person or one group who would open it this week. If you cannot, the idea is not ready and that is useful to know now.",
  },
  {
    field: "Where you are",
    detail:
      "Campus or city, so builds can be scoped to what people around you would actually use. Optional, and skipping it costs you nothing.",
  },
] as const;

const WHAT_HAPPENS = [
  "You get a reply from a person, not a sequence.",
  "If the thing fits the bar, it gets scoped as a build and you get told when.",
  "If it does not fit, you get told why, and which of the five first builds is closest.",
  "Nothing gets sold to you, because there is nothing for sale.",
] as const;

export default function JoinPage() {
  const structuredData = [
    webPageNode({
      path: "/join",
      name: `Join: send one sentence | ${SITE.name}`,
      description: DESCRIPTION,
      type: "ContactPage",
    }),
    breadcrumbNode("/join", [{ name: "Join", path: "/join" }]),
  ];

  return (
    <div className="flex min-h-[100svh] flex-col">
      <JsonLd nodes={structuredData} />

      <LandingHeader current="/join" />

      <main className="flex-1">
        <PageMasthead
          eyebrow="Join"
          lines={[{ text: "Send one" }, { text: "sentence", accentSuffix: "\\" }]}
          label="Send one sentence"
          answer={
            <>
              No form, no fee, no waitlist. Send one message with the specific
              thing you want to exist. Not a category, an actual thing somebody
              would open. That one sentence is the whole qualification, and it
              is what decides which build gets written next.
            </>
          }
        />

        <PageSection
          id="how-to-join"
          title="How to join"
          shards={3}
          lede={
            <>
              One channel. A message there reaches a person rather than a queue,
              and builds get announced there before they appear here.
            </>
          }
        >
          <div className="flex flex-col gap-[clamp(1.25rem,3vw,2rem)]">
            {/* The one action on this page. `brand.md` allows one decision per
                screen, and a second button beside this one would make the
                ending read as two asks. */}
            <InstagramTrapdoor />

            {/* Beside the action, not only in the footer. Required by
                `website.md` section 3, and it stays required even while the
                honest answer is that nothing is collected. */}
            <p className="font-mono text-micro text-muted">
              Nothing you send is stored on this site.{" "}
              <Link
                href="/privacy"
                className="group inline-flex items-baseline gap-1.5 text-accent-ink underline decoration-line underline-offset-4 hover:decoration-accent-ink"
              >
                What happens to it
                <span aria-hidden="true" className="slash-glyph">
                  \
                </span>
              </Link>
            </p>
          </div>
        </PageSection>

        <PageSection
          id="what-to-send"
          title="What to put in it"
          shards={2}
          lede={
            <>
              Three lines is enough. The second one is the real test, and most
              people find out something useful about their own idea while
              writing it.
            </>
          }
        >
          <Rise stagger={0.07} y={26} select="[data-field]">
            <dl className="max-w-[72rem]">
              {WHAT_TO_SEND.map((item, i) => (
                <div
                  key={item.field}
                  data-field
                  className="flex flex-col gap-1.5 border-t border-line py-[clamp(1rem,2.5vw,1.625rem)] sm:flex-row sm:gap-[clamp(1.5rem,4vw,3rem)]"
                >
                  <dt className="flex shrink-0 items-baseline gap-2.5 sm:w-[clamp(9rem,17vw,13rem)]">
                    <span className="font-mono text-data tabular-nums text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[clamp(0.9375rem,1.5vw,1.0625rem)] leading-tight font-bold text-foreground">
                      {item.field}
                    </span>
                  </dt>
                  <dd className="max-w-[60ch] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </Rise>
        </PageSection>

        <PageSection id="what-happens" title="What happens next" shards={1}>
          <Rise stagger={0.06} y={22} select="[data-step]">
            <ul className="max-w-[64rem]">
              {WHAT_HAPPENS.map((step) => (
                <li
                  key={step}
                  data-step
                  className="flex items-baseline gap-3 border-t border-line py-[clamp(0.75rem,1.8vw,1.125rem)] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted"
                >
                  <span
                    aria-hidden="true"
                    className="block h-[0.8rem] w-[1.5px] shrink-0 bg-accent"
                    style={{ transform: "skewX(calc(-1 * var(--slash-angle)))" }}
                  />
                  {step}
                </li>
              ))}
            </ul>
          </Rise>
        </PageSection>

        <PageSection id="when-the-form-ships" title="When the form ships" shards={0}>
          <div className="max-w-[62ch] space-y-4 text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-muted">
            <p>
              A hosted form will replace this page&apos;s instructions. When it does,
              it will ask for a name, what you want to build, your campus and a
              phone number, and it will be processed by a third party we will
              name here before the first submission.
            </p>
            <p>
              India&apos;s Digital Personal Data Protection Act applies the moment any
              of that is collected. The privacy page changes in the same commit
              as the form, never after it, and the position on under-18
              submissions gets stated there before the field exists rather than
              once somebody has already filled it in.
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
                "If you do not have a thing yet, this is where to get one. Five, ₹0 each.",
            },
            {
              href: "/about",
              label: "About",
              detail: "Who is on the other end of that message, and what this is.",
            },
            {
              href: "/privacy",
              label: "Privacy",
              detail:
                "What gets collected today, which is nothing, and what changes when it does.",
            },
          ]}
        />
        {/* `action={false}`: this page carries the trapdoor in `How to join`,
            three sections up, which is where somebody reading a page called
            join expects it. A second identical control here would be the
            duplicate that was just removed from `/about`. The mark and the
            line still close the page, because the close is the point. */}
        <SiteCta
          action={false}
          line={<>One sentence. That is the whole qualification.</>}
          body={
            <>
              Not a category, an actual thing somebody would open. Most people
              find out something useful about their own idea while writing that
              sentence, which is most of why it is the only thing asked for.
            </>
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}
