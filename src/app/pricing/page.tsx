import type { Metadata } from "next";
import * as React from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/site/landing/landing-header";
import { NextDoors } from "@/components/site/next-doors";
import { PageMasthead } from "@/components/site/page-masthead";
import { PageSection } from "@/components/site/page-section";
import { SiteCta } from "@/components/site/site-cta";
import { SiteFooter } from "@/components/site/site-footer";
import { Clauses, type ClauseItem } from "@/components/site/clause";
import { Ledger, type LedgerColumn } from "@/components/site/ledger";
import { EntryBand, PlanDescent } from "@/components/site/pricing/plan-descent";
import { PlanSwitch, type PlanFolder } from "@/components/site/pricing/plan-switch";
import { InstagramTrapdoor } from "@/components/ui/instagram-trapdoor";
import { JsonLd } from "@/components/ui/json-ld";
import {
  breadcrumbNode,
  faqNode,
  offerCatalogNode,
  webPageNode,
} from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-meta";
import {
  AUDIENCES,
  type AudienceId,
  ENTRY_OFFERS,
  PLANS,
  billingLabel,
  plansFor,
  rupees,
  splitSaving,
} from "@/lib/plans";
import { SITE } from "@/lib/site";
import { BrandName } from "@/components/ui/brand-name";

const PATH = "/pricing";

const COLLEGE_FROM = plansFor("college")[0];
const SCHOOL_FROM = plansFor("school")[0];

const DESCRIPTION = `${SITE.name} pricing in rupees: college build cohorts from ${rupees(
  COLLEGE_FROM.price
)}, school batches from ${rupees(
  SCHOOL_FROM.price
)} a month, and programmes for coaches, teachers and faculty.`;

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: "Pricing: every plan in rupees",
  description: DESCRIPTION,
});

/* ---------------------------------------------------------------------------
   The questions a buyer asks before paying.

   Plain strings, not JSX, because the same text is emitted as `FAQPage` markup
   and `faqNode` requires the markup to say exactly what the page says. Every
   answer restates a term already set elsewhere on this page or in `PLANS`;
   none of them introduces a policy.
--------------------------------------------------------------------------- */

const STRANGERS = PLANS.find((plan) => plan.id === "college-strangers")!;
const DEEP_END = PLANS.find((plan) => plan.id === "college-deep-end")!;

const QUESTIONS: readonly { question: string; answer: string; body: string }[] = [
  {
    question: "Can I pay in two parts?",
    answer: "Yes, on every college plan except Cold Start.",
    body: `Each splits into two monthly payments. Paying once costs less: ${rupees(
      splitSaving(STRANGERS)
    )} less on Strangers and ${rupees(
      splitSaving(DEEP_END)
    )} less on Deep End. School plans are billed monthly anyway.`,
  },
  {
    question: "Can I pay for a deeper tier and skip the gate?",
    answer: "No. Gates are cleared by shipping, never by paying.",
    body: `Strangers needs ${STRANGERS.gate?.toLowerCase()} to enter, and Deep End needs ${DEEP_END.gate?.toLowerCase()}. That is what makes the tier you are in mean something.`,
  },
  {
    question: "What is the ₹2,998 deposit on Strangers?",
    answer: "It comes back when you prove five strangers or one payer.",
    body: "Software that only family has touched is unverified. The deposit is returned once your analytics show real, unprompted traffic from strangers, or a first paying user.",
  },
  {
    question: "Do you guarantee a job?",
    answer: "No, and we say so in writing.",
    body: "Guarantees are either marketing lies or refund liabilities. What you leave with is working code on your own domain, public repositories and the habit of shipping.",
  },
  {
    question: "Can I cancel a school plan?",
    answer: "Yes, after the first month. There is no prepaid year at any price.",
    body: "Every school plan bills monthly with a two-month maximum term. If your child finishes their builds and pauses, billing stops.",
  },
  {
    question: "Will my child get their own AI account?",
    answer: "Not in Class 4 to 8.",
    body: "Class 4 to 8 never handle an unmonitored AI account: the child dictates the logic and the coach operates the screen. In Class 9 to 10, a family account is set up only with written parent consent on file.",
  },
  {
    question: "Who shares a school batch?",
    answer: "Only children from the same class band, six at most.",
    body: "Class 4 to 6, 7 to 8 and 9 to 10 never share a batch, whatever the skill level. The class band sets the room and the tier sets the pace.",
  },
  {
    question: "Is the trial session credited?",
    answer: "Yes, in full.",
    body: `The ${rupees(ENTRY_OFFERS.trialBuild.price)} Trial Build is credited against any plan you join after it.`,
  },
  {
    question: "How do I claim a seat?",
    answer: `Send one message to @${SITE.instagramHandle} on Instagram.`,
    body: "Say which tier you are entering, your class band or campus, and the specific thing you want to exist. A builder reads it, not a sales team.",
  },
];

const FAQ: readonly ClauseItem[] = QUESTIONS.map((item) => ({
  heading: item.question,
  answer: item.answer,
  body: <p>{item.body}</p>,
}));

/* ---------------------------------------------------------------------------
   Every plan as one flat table.

   The descent is for a person deciding. This is for anyone comparing, and for
   the engine that will quote it: one row per plan, both prices, no tabs to
   open. It repeats the descent on purpose, the same way `/tools` keeps its
   comparison as a real table beside the prose.
--------------------------------------------------------------------------- */

const TABLE_COLUMNS: readonly LedgerColumn[] = [
  { head: "Plan", rowHeader: true },
  { head: "For" },
  { head: "Price" },
  { head: "Full price" },
  { head: "Length" },
] as const;

const AUDIENCE_LABEL = Object.fromEntries(
  AUDIENCES.map((audience) => [audience.id, audience.forWhom])
);

const TABLE_ROWS = [
  ...PLANS.map((plan) => [
    <a
      key={`${plan.id}-name`}
      href={`#${plan.id}`}
      className="font-display font-bold text-foreground underline decoration-line underline-offset-4 hover:decoration-accent-ink"
    >
      {plan.name}
    </a>,
    <span key={`${plan.id}-for`} className="text-[0.875rem] text-muted">
      {AUDIENCE_LABEL[plan.audience]}
    </span>,
    <span key={`${plan.id}-price`} className="font-mono text-data font-bold text-foreground">
      {rupees(plan.price)} {billingLabel(plan.billing)}
    </span>,
    <s key={`${plan.id}-list`} className="font-mono text-data text-muted">
      {rupees(plan.listPrice)}
    </s>,
    <span key={`${plan.id}-length`} className="font-mono text-data text-foreground">
      {plan.length}
    </span>,
  ]),
  ...[ENTRY_OFFERS.discoveryCall, ENTRY_OFFERS.trialBuild].map((offer) => [
    <a
      key={`${offer.id}-name`}
      href={`#${offer.id}`}
      className="font-display font-bold text-foreground underline decoration-line underline-offset-4 hover:decoration-accent-ink"
    >
      {offer.name}
    </a>,
    <span key={`${offer.id}-for`} className="text-[0.875rem] text-muted">
      {offer.id === "discovery-call" ? "Anyone choosing a tier" : "Class 4 to 10"}
    </span>,
    <span key={`${offer.id}-price`} className="font-mono text-data font-bold text-foreground">
      {rupees(offer.price)} one payment
    </span>,
    <s key={`${offer.id}-list`} className="font-mono text-data text-muted">
      {rupees(offer.listPrice)}
    </s>,
    <span key={`${offer.id}-length`} className="font-mono text-data text-foreground">
      {offer.length}
    </span>,
  ]),
];

/* ---------------------------------------------------------------------------
   The three folders.

   Each folder holds one group's plans as files, the cheapest at the back and
   the deepest nearest the glass, with the price on every file. The
   recommended plan is the one file printed as a picture rather than a sheet,
   so it is the one the eye finds in the fan.

   The artwork is generated from the brand's own colours, never fetched:
   orange ink for college, paper and orange for school, the violet for
   institutions. Each recipe runs from the darkest value in the palette to the
   lightest so the liquid shading has the whole range to work in.
--------------------------------------------------------------------------- */

const FOLDER_LOOK: Record<
  AudienceId,
  Pick<PlanFolder, "tone" | "art" | "seed">
> = {
  college: {
    tone: "dark",
    seed: 7,
    art: {
      style: "marble",
      colors: ["#0b0a0c", "#2a1406", "#9c3d06", "#ff7712", "#ffb37a", "#1a1210", "#f7f5f2"],
      scale: 0.66,
      warp: 3.2,
      angle: -0.5,
      gloss: 0.5,
      veins: 0.45,
    },
  },
  school: {
    tone: "light",
    seed: 4,
    art: {
      style: "streak",
      colors: ["#f7f5f2", "#efebe4", "#ffd2ad", "#ff9a4d", "#ff7712", "#e7dcff", "#f2eef7"],
      scale: 0.7,
      warp: 1.5,
      angle: -0.62,
      gloss: 0.2,
      veins: 0,
    },
  },
  institutions: {
    tone: "dark",
    seed: 12,
    art: {
      style: "marble",
      colors: ["#08070c", "#1c1430", "#4d2a8a", "#8847e4", "#a97cf0", "#211c2a", "#f2eef7"],
      scale: 0.72,
      warp: 3.4,
      angle: 0.8,
      gloss: 0.5,
      veins: 0.5,
    },
  },
};

function shortPrice(price: number, monthly: boolean): string {
  return `${rupees(price)}${monthly ? "/mo" : ""}`;
}

const FOLDERS: readonly PlanFolder[] = AUDIENCES.map((audience) => {
  const plans = plansFor(audience.id);
  const cheapest = plans.reduce((low, plan) => (plan.price < low.price ? plan : low));
  return {
    id: audience.id,
    label: audience.label,
    meta: `${plans.length} plans, from ${shortPrice(
      cheapest.price,
      cheapest.billing.kind === "monthly"
    )}`,
    ...FOLDER_LOOK[audience.id],
    files: plans.map((plan) => ({
      name: plan.name,
      meta: shortPrice(plan.price, plan.billing.kind === "monthly"),
      href: `#${plan.id}`,
      /* School's own art is pale, and a file's name is set in white over its
         picture, so the school pick borrows college's darker ink to stay
         readable. */
      ...(plan.recommended
        ? { art: FOLDER_LOOK[audience.id === "school" ? "college" : audience.id].art }
        : {}),
    })),
  };
});

export default function PricingPage() {
  const structuredData = [
    webPageNode({
      path: PATH,
      name: `Pricing | ${SITE.name}`,
      description: DESCRIPTION,
    }),
    breadcrumbNode(PATH, [{ name: "Pricing", path: PATH }]),
    offerCatalogNode({
      path: PATH,
      name: `${SITE.name} plans`,
      offers: [
        ...PLANS.map((plan) => ({
          id: plan.id,
          name: `${plan.name} (${AUDIENCE_LABEL[plan.audience]})`,
          description: `${plan.ships} ${plan.length}.`,
          category: AUDIENCE_LABEL[plan.audience],
          price: plan.price,
          listPrice: plan.listPrice,
          unitCode:
            plan.billing.kind === "monthly"
              ? ("MON" as const)
              : plan.billing.kind === "yearly"
                ? ("ANN" as const)
                : undefined,
        })),
        ...[ENTRY_OFFERS.discoveryCall, ENTRY_OFFERS.trialBuild].map((offer) => ({
          id: offer.id,
          name: offer.name,
          description: `${offer.ships} ${offer.length}.`,
          category: "Entry",
          price: offer.price,
          listPrice: offer.listPrice,
        })),
      ],
    }),
    faqNode(
      PATH,
      QUESTIONS.map((item) => ({
        question: item.question,
        answer: `${item.answer} ${item.body}`,
      }))
    ),
  ];

  return (
    <div className="flex min-h-[100svh] flex-col">
      <JsonLd nodes={structuredData} />

      <LandingHeader current={PATH} />

      <main className="flex-1">
        <PageMasthead
          eyebrow="Pricing"
          lines={[{ text: "Pay to enter." }, { text: "Ship to go deeper", accentSuffix: "\\" }]}
          label="Pay to enter. Ship to go deeper."
          answer={
            <>
              Every <BrandName /> plan, priced in rupees on one page. College
              cohorts run four to eight weeks from {rupees(COLLEGE_FROM.price)}.
              School batches start at {rupees(SCHOOL_FROM.price)} a month.
              Institutions can certify coaches and train teachers and faculty.
              Strangers and Deep End have gates you clear by shipping, so no one
              buys their way deeper, and no plan promises a job.
            </>
          }
        />

        <p className="mx-auto w-full max-w-[110rem] px-[max(1rem,4vw)] pb-[clamp(1rem,2.5vw,1.5rem)] font-mono text-micro text-muted">
          Every claim button opens a message to @{SITE.instagramHandle} on
          Instagram. Nothing is charged on this site.
        </p>

        <PlanSwitch folders={FOLDERS}>
          {AUDIENCES.map((audience) => (
            <PlanDescent
              key={audience.id}
              audience={audience}
              before={
                audience.id === "school" ? (
                  <EntryBand
                    offer={ENTRY_OFFERS.trialBuild}
                    heading="Try one session before you commit."
                    forWhom="Class 4 to 10"
                  />
                ) : undefined
              }
            />
          ))}
        </PlanSwitch>

        <div className="py-[clamp(2.5rem,7vw,4.5rem)]">
          <EntryBand
            offer={ENTRY_OFFERS.discoveryCall}
            heading="Not sure which tier you belong in?"
            forWhom="Anyone, any plan"
          />
        </div>

        <PageSection
          id="all-plans"
          title="Every plan"
          shards={3}
          lede={
            <>
              Every plan and both of its prices in one table, for comparing
              side by side. Select a name to jump to its full terms.
            </>
          }
        >
          <div className="max-w-[76rem]">
            <Ledger
              caption={`${SITE.signature} pricing, in rupees`}
              columns={TABLE_COLUMNS}
              rows={TABLE_ROWS}
              minWidth="min-w-[48rem]"
            />
          </div>
        </PageSection>

        <PageSection
          id="questions"
          title="Before you pay"
          shards={2}
          lede={<>The questions people ask before they claim a seat, answered straight.</>}
        >
          <div className="max-w-[64rem]">
            <Clauses items={FAQ} />
          </div>
        </PageSection>

        <PageSection
          id="claim"
          title="Claim a seat"
          shards={1}
          lede={
            <>
              One message. Send the tier you are entering, your class band or
              campus, and the specific thing you want to exist.
            </>
          }
        >
          <div className="flex flex-col gap-[clamp(1.25rem,3vw,2rem)]">
            <InstagramTrapdoor />

            <div className="max-w-[60ch] space-y-2">
              <p className="font-mono text-micro text-muted">
                Nothing you send is stored on this site. You talk directly with
                a builder on Instagram, not a sales team or an automated drip.
              </p>
              <p className="font-mono text-micro text-muted">
                <Link
                  href="/privacy"
                  className="group inline-flex items-baseline gap-1 text-accent-ink underline decoration-line underline-offset-4 hover:decoration-accent-ink"
                >
                  Privacy policy
                  <span aria-hidden="true" className="slash-glyph">
                    \
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </PageSection>

        <div className="h-[clamp(2.5rem,7vw,4.5rem)]" />

        <NextDoors
          doors={[
            {
              href: "/builds",
              label: "The Wall",
              detail: "What shipping looks like here: every build, with its prompts and its rupee cost.",
            },
            {
              href: "/start",
              label: "What to build first",
              detail: "Five first builds you can open and run tonight, before paying for anything.",
            },
            {
              href: "/answers",
              label: "Answers",
              detail: "Straight answers about building AI software in India.",
            },
          ]}
        />

        <SiteCta
          action={false}
          line={<>Pick a depth. Ship your way down.</>}
          body={
            <>
              No sales deck and no surprise pricing in a DM. Every rupee you pay
              is on this page.
            </>
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}
