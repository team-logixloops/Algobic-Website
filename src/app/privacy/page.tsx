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
 * `/privacy`: what this site collects, which today is nothing.
 *
 * Not decoration and not boilerplate. `website.md` section 3 makes this page
 * load-bearing the moment `/join` collects a name and a phone number from a
 * student in India, and it requires six things stated plainly: what is
 * collected, why, who processes it by name, how long it is kept, how to ask for
 * deletion, and a real way to reach us.
 *
 * The unusual part is that every one of those answers is currently trivial,
 * because the site is a static build with no forms, no accounts, no analytics
 * and no cookies. Writing that down precisely is more useful than a generic
 * policy copied from a template, and it is checkable: anyone can open the
 * network tab and confirm it.
 *
 * ⚠️ **This is a draft, not legal advice, and it is not a substitute for
 * review before real data is taken from real students.** It is accurate about a
 * site that collects nothing. It changes in the same commit as the join form,
 * never after it.
 *
 * `noindex`: boilerplate with zero search intent. That is a preference rather
 * than a rule and indexing it would be equally defensible as visible proof it
 * exists. It is excluded from the sitemap to match, because a sitemap entry for
 * a page you have told engines to ignore is a contradictory signal, and it is
 * **not** disallowed in `robots.txt`, because a blocked crawl cannot read the
 * `noindex` and the URL can still surface with no description.
 */

const DESCRIPTION =
  "No accounts, no forms, no cookies. One cookieless analytics script counts page views and cannot identify you. What is stored, what is not, and how to stop it.";

export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy: counted, not tracked",
  description: DESCRIPTION,
  /* Indexed as of 2026-08-09. `website.md` section 2 always recorded the
     `noindex` here as a preference rather than a rule, and reversible. This
     page now carries specific, checkable claims rather than boilerplate, and a
     privacy page that can be found is worth more as visible proof than a
     private one is as saved crawl budget. */
});

const CLAUSES: readonly ClauseItem[] = [
  {
    heading: "What this site collects about you",
    answer: "A page view. Nothing attached to you.",
    body: (
      <>
        <p>
          Every page here is prerendered and served as static files. There is no
          account system, no form, no comment box, no search, no chat widget and
          no newsletter. There is nothing to log in to and nothing to fill in.
        </p>
        <p>
          One thing is recorded: that a page was opened. It is counted by the
          analytics script named below, which sets no cookie, stores no
          identifier, and has no way to connect this visit to your last one or
          to anything you do anywhere else.
        </p>
      </>
    ),
  },
  {
    heading: "Cookies and tracking",
    answer: "No cookies. No cross-site tracking. No advertising pixels.",
    body: (
      <>
        <p>
          This site sets no cookies at all, which is why there is no consent
          banner. It runs no session recording, no advertising pixel, no
          retargeting tag and no social embed.
        </p>
        <p>
          One thing is stored on your device: your light or dark theme choice,
          saved by your browser under the key{" "}
          <code className="font-mono text-[0.95em] text-foreground">
            algobic-theme
          </code>
          . It never leaves the device, it is not readable by us, and clearing
          your browser storage removes it.
        </p>
      </>
    ),
  },
  {
    heading: "The analytics script, named",
    answer: "Plausible. Cookieless, no personal data, EU-hosted.",
    body: (
      <>
        <p>
          Page views are counted by{" "}
          <a
            href="https://plausible.io/privacy-focused-web-analytics"
            className="group inline-flex items-baseline gap-1.5 text-accent-ink underline decoration-line underline-offset-4 hover:decoration-accent-ink"
          >
            Plausible
            <span aria-hidden="true" className="slash-glyph">
              \
            </span>
          </a>
          , loaded from{" "}
          <code className="font-mono text-[0.95em] text-foreground">
            plausible.io
          </code>
          . It records the page address, the site you arrived from, and a coarse
          browser, operating system, device type and country. It sets no cookie,
          stores no IP address, builds no profile, and does not follow you to
          any other website.
        </p>
        <p>
          It answers one question: which pages people actually reach. That
          decides which build gets written next, and it is the only reason a
          third-party script is worth loading here at all.
        </p>
        <p>
          If you would rather not be counted, any content blocker stops it. So
          does your browser&apos;s Do Not Track setting. Nothing on this site
          breaks when it is blocked, because nothing here depends on it.
        </p>
      </>
    ),
  },
  {
    heading: "Fonts and assets",
    answer: "Self-hosted. One external origin on the whole site.",
    body: (
      <p>
        Typefaces are self-hosted rather than fetched from a font CDN, so
        loading a page does not tell a font provider that you visited. The
        content security policy on every response pins images, fonts and styles
        to this origin and permits exactly one external origin,{" "}
        <code className="font-mono text-[0.95em] text-foreground">
          plausible.io
        </code>
        , for the script above. All of it is checkable in your browser&apos;s
        network tab in about ten seconds.
      </p>
    ),
  },
  {
    heading: "If you message us on Instagram",
    answer: "Meta processes it, under Meta's policy, not this one.",
    body: (
      <>
        <p>
          The only way to reach us today is the Instagram account linked from
          this site. A message you send there is handled by Meta on their
          infrastructure and under their terms, exactly as any other Instagram
          message is. We read it. We do not export it, copy it into a database,
          or add you to anything.
        </p>
        <p>
          If you would rather we did not keep a message, say so in the thread and
          it gets deleted from our side. Meta&apos;s own retention is theirs, not
          ours, and we cannot speak for it.
        </p>
      </>
    ),
  },
  {
    heading: "What changes when the join form ships",
    answer: "This page changes first, in the same commit.",
    body: (
      <>
        <p>
          The planned form asks for a name, what you want to build, a campus and
          a phone number, and it will be hosted by a third-party form provider
          rather than by us. When that ships, this page will name that provider,
          state how long submissions are kept, and give a direct way to ask for
          deletion, before the first submission is possible.
        </p>
        <p>
          India&apos;s Digital Personal Data Protection Act, 2023 governs personal
          data of people in India and applies to us from the moment any is
          collected. The position on submissions from anyone under 18 will be
          stated here before the field exists, rather than after somebody has
          filled it in.
        </p>
      </>
    ),
  },
  {
    heading: "How to ask a question or ask for deletion",
    answer: "Message the Instagram account. A person reads it.",
    body: (
      <p>
        There is no ticket queue and no support address, because a support
        address nobody staffs is worse than an honest single channel. Until a
        form exists there is nothing of yours to delete, and once one does, the
        request goes to the same place and gets a reply.
      </p>
    ),
  },
  {
    heading: "Changes to this page",
    answer: "Dated at the top. Never edited quietly.",
    body: (
      <p>
        The date at the top of this page is the date its content last actually
        changed, bumped by hand rather than by the build, which is the only way
        the date means anything. Substantive changes are made in the same commit
        as whatever caused them.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  const structuredData = [
    webPageNode({
      path: "/privacy",
      name: `Privacy: we collect nothing | ${SITE.name}`,
      description: DESCRIPTION,
    }),
    breadcrumbNode("/privacy", [{ name: "Privacy", path: "/privacy" }]),
  ];

  return (
    <div className="flex min-h-[100svh] flex-col">
      <JsonLd nodes={structuredData} />

      <LandingHeader />

      <main className="flex-1">
        <PageMasthead
          eyebrow="Privacy"
          lines={[{ text: "Counted," }, { text: "not tracked", accentSuffix: "\\" }]}
          label="Counted, not tracked"
          answer={
            <>
              No accounts, no forms, no cookies. One cookieless analytics script
              counts page views and cannot identify you or follow you to another
              site. Your light or dark theme choice is stored on your own device
              and never sent anywhere. This page changes in the same commit as
              the join form.
            </>
          }
        />

        <PageSection
          id="the-policy"
          title="In full"
          shards={2}
          lede={
            <>
              Eight answers in plain language. The mono line under each heading
              is the answer; the paragraph is why. A policy nobody can read is a
              trust cost, not a trust signal.
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
              This page is written by the people who built the site, not by a
              lawyer, and it describes a site that currently collects nothing. It
              is accurate about that. It is not legal advice, and it will be
              reviewed before any real data is taken from anyone.
            </p>
            <p>
              {SITE.legalName}, a {SITE.parent} company, India. Reachable through
              the{" "}
              <Link
                href="/join"
                className="group inline-flex items-baseline gap-1.5 text-accent-ink underline decoration-line underline-offset-4 hover:decoration-accent-ink"
              >
                join page
                <span aria-hidden="true" className="slash-glyph">
                  \
                </span>
              </Link>
              .
            </p>
          </div>
        </PageSection>

        <div className="h-[clamp(2.5rem,7vw,4.5rem)]" />

        <NextDoors
          doors={[
            {
              href: "/terms",
              label: "Terms",
              detail:
                "What the build guides promise, what they do not, and who owns what you build.",
            },
            {
              href: "/join",
              label: "Join",
              detail: "The one channel, and exactly what to put in a message.",
            },
            {
              href: "/about",
              label: "About",
              detail: "Who is behind this and what it refuses to be.",
            },
          ]}
        />
        <SiteCta
          line={<>Today there is nothing here to sign up for.</>}
          body={
            <>
              No account, no list, no pixel following you out, and this page
              changes in the same commit as the day any of that does. Until
              then the only way to hear about a build is to choose to, and that
              choice is reversible in one tap.
            </>
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}
