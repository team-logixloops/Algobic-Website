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
import { InstagramTrapdoor } from "@/components/ui/instagram-trapdoor";
import { JsonLd } from "@/components/ui/json-ld";
import { breadcrumbNode, webPageNode } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-meta";
import { SITE } from "@/lib/site";

const DESCRIPTION =
  "The final price sheet: entry points, school cohorts, 8-week builder tracks, and institutional licences. Every rupee, gate, and AI access rule stated in the open.";

export const metadata: Metadata = pageMetadata({
  path: "/join",
  title: "The final price sheet: every term in plain rupee",
  description: DESCRIPTION,
  index: false,
});

/* ---------------------------------------------------------------------------
   TABLE 1: ENTRY — UNCHANGED, AND HERE IS WHY
--------------------------------------------------------------------------- */
const ENTRY_COLUMNS: readonly LedgerColumn[] = [
  { head: "Intake / Format", rowHeader: true, className: "w-[24%]" },
  { head: "List", className: "w-[12%]" },
  { head: "Founding", className: "w-[14%]" },
  { head: "Format", className: "w-[18%]" },
  { head: "Terms & Note", className: "w-[32%]" },
] as const;

const ENTRY_ROWS = [
  [
    <div key="discovery">
      <div className="font-display text-[clamp(0.9375rem,1.4vw,1.0625rem)] font-bold text-foreground">
        Discovery Call
      </div>
      <div className="font-mono text-micro text-accent-ink mt-0.5">
        1:1 Intake
      </div>
    </div>,
    <span key="list-disc" className="line-through text-muted/50 font-mono text-data">
      ₹498
    </span>,
    <div key="founding-disc" className="font-mono text-data font-bold text-accent-ink">
      ₹98
    </div>,
    <span key="format-disc" className="font-mono text-data text-foreground">
      25 min, 1:1
    </span>,
    <p key="note-disc" className="font-sans text-[0.875rem] leading-relaxed text-muted">
      Cannot take the ₹500. The list price exists so ₹98 reads as a concession
      rather than as your valuation.
    </p>,
  ],
  [
    <div key="trial">
      <div className="font-display text-[clamp(0.9375rem,1.4vw,1.0625rem)] font-bold text-foreground">
        Trial Build, school
      </div>
      <div className="font-mono text-micro text-accent-ink mt-0.5">
        Live Build Session
      </div>
    </div>,
    <span key="list-trial" className="line-through text-muted/50 font-mono text-data">
      ₹998
    </span>,
    <div key="founding-trial" className="font-mono text-data font-bold text-accent-ink">
      ₹498
    </div>,
    <span key="format-trial" className="font-mono text-data text-foreground">
      One 60 min session
    </span>,
    <p key="note-trial" className="font-sans text-[0.875rem] leading-relaxed text-muted">
      Cannot take the ₹500. Fully credited against any plan.
    </p>,
  ],
] as const;

/* ---------------------------------------------------------------------------
   TABLE 2: SCHOOL, CLASS 4 TO 10
--------------------------------------------------------------------------- */
const SCHOOL_COLUMNS: readonly LedgerColumn[] = [
  { head: "Tier", rowHeader: true, className: "w-[18%]" },
  { head: "Was", className: "w-[10%]" },
  { head: "Now (Monthly)", className: "w-[16%]" },
  { head: "Per Session", className: "w-[12%]" },
  { head: "URLs / Term", className: "w-[10%]" },
  { head: "What is covered & the AI access rule", className: "w-[34%]" },
] as const;

const SCHOOL_ROWS = [
  [
    <div key="s-cold">
      <div className="font-display text-[clamp(0.9375rem,1.4vw,1.0625rem)] font-bold text-accent-ink">
        Cold Start
      </div>
      <div className="font-mono text-micro text-accent-ink/80 mt-0.5">
        Basic
      </div>
    </div>,
    <span key="s-cold-was" className="line-through text-muted/50 font-mono text-data">
      ₹2,498
    </span>,
    <div key="s-cold-now">
      <div className="font-mono text-data font-bold text-foreground">
        ₹1,998
      </div>
      <div className="font-mono text-micro text-muted">per month</div>
    </div>,
    <span key="s-cold-per" className="font-mono text-data text-foreground">
      ₹250
    </span>,
    <span key="s-cold-urls" className="font-mono text-data font-bold text-foreground">
      2
    </span>,
    <div key="s-cold-rule" className="font-sans text-[0.875rem] leading-relaxed space-y-1">
      <p className="text-foreground">
        An AI story maker, a talking quiz, a small game. Logic and sequencing,
        design and voice, publishing, digital safety.
      </p>
      <p className="font-mono text-micro text-accent-ink">
        Coach&apos;s shared screen only, no personal AI account at any age in this tier.
      </p>
    </div>,
  ],
  [
    <div key="s-strangers">
      <div className="font-display text-[clamp(0.9375rem,1.4vw,1.0625rem)] font-bold text-foreground">
        Strangers
      </div>
      <div className="font-mono text-micro text-muted mt-0.5">
        Intermediate
      </div>
    </div>,
    <span key="s-strangers-was" className="line-through text-muted/50 font-mono text-data">
      ₹2,998
    </span>,
    <div key="s-strangers-now">
      <div className="font-mono text-data font-bold text-foreground">
        ₹2,498
      </div>
      <div className="font-mono text-micro text-muted">per month</div>
    </div>,
    <span key="s-strangers-per" className="font-mono text-data text-foreground">
      ₹312
    </span>,
    <span key="s-strangers-urls" className="font-mono text-data font-bold text-foreground">
      3
    </span>,
    <div key="s-strangers-rule" className="font-sans text-[0.875rem] leading-relaxed space-y-1">
      <p className="text-foreground">
        A real website, a class helper, a tool their friends use. Adds data that
        survives a refresh and first real users who are not family.
      </p>
      <p className="font-mono text-micro text-muted">
        <strong className="text-foreground">Still coach&apos;s screen.</strong> The child dictates, the coach types.
      </p>
    </div>,
  ],
  [
    <div key="s-deepend">
      <div className="font-display text-[clamp(0.9375rem,1.4vw,1.0625rem)] font-bold text-foreground">
        Deep End
      </div>
      <div className="font-mono text-micro text-muted mt-0.5">
        Advanced
      </div>
    </div>,
    <span key="s-deepend-was" className="line-through text-muted/50 font-mono text-data">
      ₹3,498
    </span>,
    <div key="s-deepend-now">
      <div className="font-mono text-data font-bold text-foreground">
        ₹2,998
      </div>
      <div className="font-mono text-micro text-muted">per month</div>
    </div>,
    <span key="s-deepend-per" className="font-mono text-data text-foreground">
      ₹375
    </span>,
    <span key="s-deepend-urls" className="font-mono text-data font-bold text-foreground">
      3
    </span>,
    <div key="s-deepend-rule" className="font-sans text-[0.875rem] leading-relaxed space-y-1">
      <p className="text-foreground">
        A real app with accounts plus one awkward part. Adds consent and data
        ethics, the cost line written by the child, a domain they keep, a
        Verified Build Record.
      </p>
      <p className="font-mono text-micro text-muted">
        <strong className="text-foreground">Class 9 to 10 only:</strong> family account, written parent consent on file.
      </p>
    </div>,
  ],
  [
    <div key="s-onetoone">
      <div className="font-display text-[clamp(0.9375rem,1.4vw,1.0625rem)] font-bold text-foreground">
        One to One
      </div>
      <div className="font-mono text-micro text-amber-500/90 mt-0.5">
        Gated
      </div>
    </div>,
    <span key="s-onetoone-was" className="line-through text-muted/50 font-mono text-data">
      ₹4,998
    </span>,
    <div key="s-onetoone-now">
      <div className="font-mono text-data font-bold text-foreground">
        ₹4,498
      </div>
      <div className="font-mono text-micro text-muted">per month</div>
    </div>,
    <span key="s-onetoone-per" className="font-mono text-data text-foreground">
      ₹1,124
    </span>,
    <span key="s-onetoone-urls" className="font-mono text-data font-bold text-foreground">
      2
    </span>,
    <div key="s-onetoone-rule" className="font-sans text-[0.875rem] leading-relaxed space-y-1">
      <p className="text-foreground">
        Four sessions, dedicated coach, recording or a second adult on every session.
      </p>
      <p className="font-mono text-micro text-muted">
        Maximum four active slots, existing batch families only,{" "}
        <strong className="text-foreground">never advertised</strong>.
      </p>
    </div>,
  ],
] as const;

/* ---------------------------------------------------------------------------
   TABLE 3: COLLEGE, GRADUATES AND WORKING PROFESSIONALS
--------------------------------------------------------------------------- */
const ADULT_COLUMNS: readonly LedgerColumn[] = [
  { head: "Tier & Gate", rowHeader: true, className: "w-[20%]" },
  { head: "Was", className: "w-[10%]" },
  { head: "Now", className: "w-[18%]" },
  { head: "Length", className: "w-[10%]" },
  { head: "URLs", className: "w-[8%]" },
  { head: "What is included & tools unlocked", className: "w-[34%]" },
] as const;

const ADULT_ROWS = [
  [
    <div key="a-cold">
      <div className="font-display text-[clamp(0.9375rem,1.4vw,1.0625rem)] font-bold text-foreground">
        Cold Start
      </div>
      <div className="font-mono text-micro text-muted mt-0.5">No gate</div>
    </div>,
    <span key="a-cold-was" className="line-through text-muted/50 font-mono text-data">
      ₹8,998
    </span>,
    <div key="a-cold-now">
      <div className="font-mono text-data font-bold text-foreground">
        ₹8,498
      </div>
      <div className="font-mono text-micro text-muted">one payment</div>
      <div className="font-mono text-micro text-muted/60">list ₹14,498</div>
    </div>,
    <span key="a-cold-len" className="font-mono text-data text-foreground">
      4 weeks
    </span>,
    <span key="a-cold-urls" className="font-mono text-data font-bold text-foreground">
      1
    </span>,
    <div key="a-cold-inc" className="font-sans text-[0.875rem] leading-relaxed space-y-1">
      <p className="text-foreground">
        A clone of something they scrolled past. Six-item dependency list,
        never a roadmap. Two written reviews inside 24 hrs, one instruction
        each. Four demo days, cohort capped at 15.
      </p>
      <p className="font-mono text-micro text-accent-ink">
        <strong className="text-foreground">One month of Claude Pro</strong> unlocks on day ten. Claude Code not mentioned at this tier.
      </p>
    </div>,
  ],
  [
    <div key="a-strangers">
      <div className="font-display text-[clamp(0.9375rem,1.4vw,1.0625rem)] font-bold text-accent-ink">
        Strangers
      </div>
      <div className="font-mono text-micro text-accent-ink/80 mt-0.5">
        Gate: one live URL
      </div>
    </div>,
    <span key="a-strangers-was" className="line-through text-muted/50 font-mono text-data">
      ₹9,998
    </span>,
    <div key="a-strangers-now">
      <div className="font-mono text-data font-bold text-foreground">
        ₹9,498 <span className="font-normal text-muted">/ mo × 2</span>
      </div>
      <div className="font-mono text-micro text-muted">or ₹18,498 once</div>
      <div className="font-mono text-micro text-muted/60">list ₹29,498</div>
    </div>,
    <span key="a-strangers-len" className="font-mono text-data text-foreground">
      8 weeks
    </span>,
    <span key="a-strangers-urls" className="font-mono text-data font-bold text-foreground">
      2
    </span>,
    <div key="a-strangers-inc" className="font-sans text-[0.875rem] leading-relaxed space-y-1">
      <p className="text-foreground">
        Two builds, the second needing five strangers or one payer proven with
        analytics. Claude Code in the desktop app, no terminal. Supabase. Six
        written reviews, four live 1:1. Their own domain, theirs to keep.
      </p>
      <p className="font-mono text-micro text-accent-ink">
        ₹2,998 deposit returned. <strong className="text-foreground">Two months of Claude Pro</strong> unlock on day ten.
      </p>
    </div>,
  ],
  [
    <div key="a-deepend">
      <div className="font-display text-[clamp(0.9375rem,1.4vw,1.0625rem)] font-bold text-foreground">
        Deep End
      </div>
      <div className="font-mono text-micro text-muted mt-0.5">
        Gate: real traffic
      </div>
    </div>,
    <span key="a-deepend-was" className="line-through text-muted/50 font-mono text-data">
      ₹16,998
    </span>,
    <div key="a-deepend-now">
      <div className="font-mono text-data font-bold text-foreground">
        ₹16,498 <span className="font-normal text-muted">/ mo × 2</span>
      </div>
      <div className="font-mono text-micro text-muted">or ₹31,498 once</div>
      <div className="font-mono text-micro text-muted/60">list ₹49,498</div>
    </div>,
    <span key="a-deepend-len" className="font-mono text-data text-foreground">
      8 weeks
    </span>,
    <span key="a-deepend-urls" className="font-mono text-data font-bold text-foreground">
      3
    </span>,
    <div key="a-deepend-inc" className="font-sans text-[0.875rem] leading-relaxed space-y-1">
      <p className="text-foreground">
        Three builds, the third with one genuinely hard part from the closed
        list. Claude Code in the terminal, real repo. Cursor Start. Eight written
        reviews, six live 1:1. Four defence drills against their own build. Profile
        and GitHub rebuild. Post mortem with the real monthly rupee cost.
      </p>
      <p className="font-mono text-micro font-bold text-foreground">
        No job guarantee, in writing.
      </p>
    </div>,
  ],
  [
    <div key="a-weekends">
      <div className="font-display text-[clamp(0.9375rem,1.4vw,1.0625rem)] font-bold text-foreground">
        Deep End, Weekends
      </div>
      <div className="font-mono text-micro text-muted mt-0.5">
        Graduates, professionals
      </div>
    </div>,
    <span key="a-weekends-was" className="line-through text-muted/50 font-mono text-data">
      ₹19,998
    </span>,
    <div key="a-weekends-now">
      <div className="font-mono text-data font-bold text-foreground">
        ₹19,498 <span className="font-normal text-muted">/ mo × 2</span>
      </div>
      <div className="font-mono text-micro text-muted">or ₹37,498 once</div>
      <div className="font-mono text-micro text-muted/60">list ₹59,498</div>
    </div>,
    <span key="a-weekends-len" className="font-mono text-data text-foreground">
      8 weeks
    </span>,
    <span key="a-weekends-urls" className="font-mono text-data font-bold text-foreground">
      2
    </span>,
    <div key="a-weekends-inc" className="font-sans text-[0.875rem] leading-relaxed space-y-1">
      <p className="text-foreground">
        Saturdays and Sundays only. Two builds, the second aimed at a paying
        user. Monetisation module ending with the first invoice they actually
        send. Claude Code, Cursor Start, Canva Pro, a domain.
      </p>
      <p className="font-mono text-micro text-muted">
        Never mixed with student cohorts.
      </p>
    </div>,
  ],
] as const;

/* ---------------------------------------------------------------------------
   TABLE 4: TRAINERS AND INSTITUTIONS
--------------------------------------------------------------------------- */
const INSTITUTION_COLUMNS: readonly LedgerColumn[] = [
  { head: "Track", rowHeader: true, className: "w-[24%]" },
  { head: "Was", className: "w-[12%]" },
  { head: "Now", className: "w-[18%]" },
  { head: "Format", className: "w-[16%]" },
  { head: "What is included & licence terms", className: "w-[30%]" },
] as const;

const INSTITUTION_ROWS = [
  [
    <div key="i-coach">
      <div className="font-display text-[clamp(0.9375rem,1.4vw,1.0625rem)] font-bold text-foreground">
        Build Coach Certification
      </div>
      <div className="font-mono text-micro text-muted mt-0.5">
        Mentor Track
      </div>
    </div>,
    <span key="i-coach-was" className="line-through text-muted/50 font-mono text-data">
      ₹24,998
    </span>,
    <div key="i-coach-now">
      <div className="font-mono text-data font-bold text-foreground">
        ₹24,498
      </div>
      <div className="font-mono text-micro text-muted/60">list ₹39,498</div>
    </div>,
    <span key="i-coach-fmt" className="font-mono text-data text-foreground">
      6 weeks, batch of 10
    </span>,
    <div key="i-coach-inc" className="font-sans text-[0.875rem] leading-relaxed space-y-1">
      <p className="text-foreground">
        Must personally ship three builds to certify. Assessed on a recorded
        coaching session. Fifteen playbooks with prompts, break points and rupee
        costs. Licence to run Ship Sprints, revocable. Coach keeps 65 percent.
      </p>
      <p className="font-mono text-micro font-bold text-accent-ink">
        ₹20,415 per mentor hour, best in the book.
      </p>
    </div>,
  ],
  [
    <div key="i-teacher">
      <div className="font-display text-[clamp(0.9375rem,1.4vw,1.0625rem)] font-bold text-foreground">
        Teacher Programme
      </div>
      <div className="font-mono text-micro text-muted mt-0.5">
        School Educators
      </div>
    </div>,
    <span key="i-teacher-was" className="line-through text-muted/50 font-mono text-data">
      ₹98,998
    </span>,
    <div key="i-teacher-now">
      <div className="font-mono text-data font-bold text-foreground">
        ₹98,498
      </div>
      <div className="font-mono text-micro text-accent-ink">₹4,925 / teacher</div>
      <div className="font-mono text-micro text-muted/60">list ₹1,48,498</div>
    </div>,
    <span key="i-teacher-fmt" className="font-mono text-data text-foreground">
      3 days, up to 20
    </span>,
    <div key="i-teacher-inc" className="font-sans text-[0.875rem] leading-relaxed space-y-1">
      <p className="text-foreground">
        Class 4 to 10 curriculum they can run without us. Written safeguarding
        protocol. Parent communication scripts. Process praise drilling.
      </p>
      <p className="font-mono text-micro text-muted">
        One school Ship Sprint run by us.
      </p>
    </div>,
  ],
  [
    <div key="i-fdp">
      <div className="font-display text-[clamp(0.9375rem,1.4vw,1.0625rem)] font-bold text-foreground">
        Faculty Development
      </div>
      <div className="font-mono text-micro text-muted mt-0.5">
        Higher Education FDP
      </div>
    </div>,
    <span key="i-fdp-was" className="line-through text-muted/50 font-mono text-data">
      ₹1,98,998
    </span>,
    <div key="i-fdp-now">
      <div className="font-mono text-data font-bold text-foreground">
        ₹1,98,498
      </div>
      <div className="font-mono text-micro text-accent-ink">₹7,940 / faculty</div>
      <div className="font-mono text-micro text-muted/60">list ₹2,98,498</div>
    </div>,
    <span key="i-fdp-fmt" className="font-mono text-data text-foreground">
      5 days, up to 25
    </span>,
    <div key="i-fdp-inc" className="font-sans text-[0.875rem] leading-relaxed space-y-1">
      <p className="text-foreground">
        Sits inside standard FDP budget norms, so you compete for allocated
        money rather than new money. Faculty ship three builds each or they do
        not complete.
      </p>
      <p className="font-mono text-micro text-muted">
        One campus Ship Sprint included.
      </p>
    </div>,
  ],
  [
    <div key="i-campus">
      <div className="font-display text-[clamp(0.9375rem,1.4vw,1.0625rem)] font-bold text-foreground">
        Campus Partner Licence
      </div>
      <div className="font-mono text-micro text-muted mt-0.5">
        Institutional Agreement
      </div>
    </div>,
    <span key="i-campus-was" className="line-through text-muted/50 font-mono text-data">
      ₹2,98,998
    </span>,
    <div key="i-campus-now">
      <div className="font-mono text-data font-bold text-foreground">
        ₹2,98,498
      </div>
      <div className="font-mono text-micro text-muted">per campus / year</div>
    </div>,
    <span key="i-campus-fmt" className="font-mono text-data text-foreground">
      Per campus / year
    </span>,
    <div key="i-campus-inc" className="font-sans text-[0.875rem] leading-relaxed space-y-1">
      <p className="text-foreground">
        Up to 200 students. Coach training included. Co-branded student build page.
      </p>
      <p className="font-mono text-micro text-accent-ink">
        Two Ship Sprints a year on site.
      </p>
    </div>,
  ],
] as const;

/* ---------------------------------------------------------------------------
   GROUND RULES
--------------------------------------------------------------------------- */
const GROUND_RULES: readonly ClauseItem[] = [
  {
    heading: "Class band sets the room, tier sets the pace",
    answer: "Class 4–6, 7–8 and 9–10 never share a batch regardless of skill parity.",
    body: (
      <>
        A prodigy in Class 5 does not sit in a room with a tenth grader. Developmental
        stage governs the room; personal speed governs the tier. All school cohorts
        are hard-capped at six students per batch.
      </>
    ),
  },
  {
    heading: "Monthly billing, cancel after month one",
    answer: "No prepaid year at any price.",
    body: (
      <>
        A commitment that demands a 12-month lock-in is an ed-tech trap. Every
        school plan bills monthly with a two-month maximum term. If a student
        completes their builds and pauses, billing stops immediately without friction.
      </>
    ),
  },
  {
    heading: "Real strangers, or the deposit is held",
    answer: "Five strangers or one payer proven with analytics.",
    body: (
      <>
        At the Strangers tier, software that only family members have touched is
        unverified. The ₹2,998 deposit is refunded only upon demonstrating real,
        unprompted traffic from strangers or a first rupee invoice.
      </>
    ),
  },
  {
    heading: "The AI access rule",
    answer: "Coach's screen for juniors; verified parent consent for high school.",
    body: (
      <>
        Class 4 to 8 never handle unmonitored AI accounts. The child dictates
        logic and architecture; the coach operates the screen. Class 9 to 10
        requires written parent consent on file before personal family accounts
        are provisioned.
      </>
    ),
  },
  {
    heading: "No job guarantee, in writing",
    answer: "Guarantees are either marketing lies or refund liabilities.",
    body: (
      <>
        We teach how to ship software that solves immediate human problems. What
        you leave with is working code on your own domain, public repositories, and
        the muscle to build again. We will never sell an HR placement illusion.
      </>
    ),
  },
];

export default function JoinPage() {
  const structuredData = [
    webPageNode({
      path: "/join",
      name: `Final price sheet | ${SITE.name}`,
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
          eyebrow="Final price sheet"
          lines={[
            { text: "Every number," },
            { text: "in plain rupee", accentSuffix: "\\" },
          ]}
          label="Every number, in plain rupee"
          answer={
            <>
              No hidden tiers, no annual lock-ins, and no corporate sales calls.
              Class band sets the room, tier sets the pace. Every rupee, gate,
              cohort length, and AI access rule stated in the open before you
              send a single message.
            </>
          }
        />

        {/* -----------------------------------------------------------------
            SECTION 1: ENTRY
        ----------------------------------------------------------------- */}
        <PageSection
          id="entry"
          title="Entry"
          shards={4}
          lede={
            <>
              Two low-friction entry points before committing to a multi-week
              cohort. The list price exists so the founding fee reads as a
              concession rather than as your valuation. Fully credited against any plan.
            </>
          }
        >
          <div className="max-w-[76rem]">
            <Ledger
              caption="Entry — unchanged, and here is why"
              columns={ENTRY_COLUMNS}
              rows={ENTRY_ROWS}
              minWidth="min-w-[50rem]"
            />
          </div>
        </PageSection>

        {/* -----------------------------------------------------------------
            SECTION 2: SCHOOL
        ----------------------------------------------------------------- */}
        <PageSection
          id="school"
          title="School: Class 4 to 10"
          shards={3}
          lede={
            <>
              Monthly cohorts, batch of six, eight live sessions, two-month
              maximum term. Class band sets the room, tier sets the pace. Class
              4 to 6, 7 to 8 and 9 to 10 never share a batch regardless of
              skill parity. Monthly billing, cancel after month one, no prepaid
              year at any price.
            </>
          }
        >
          <div className="max-w-[76rem]">
            <Ledger
              caption="School, class 4 to 10 · monthly · batch of six · eight live sessions"
              columns={SCHOOL_COLUMNS}
              rows={SCHOOL_ROWS}
              minWidth="min-w-[58rem]"
              highlightRows={[0]}
            />
          </div>
        </PageSection>

        {/* -----------------------------------------------------------------
            SECTION 3: COLLEGE & WORKING PROFESSIONALS
        ----------------------------------------------------------------- */}
        <PageSection
          id="adults"
          title="College, graduates & professionals"
          shards={2}
          lede={
            <>
              Nothing runs longer than eight weeks. Real repositories, live
              domains, genuine traffic, and no job guarantees in writing. Every
              cohort capped at 15 builders.
            </>
          }
        >
          <div className="max-w-[76rem]">
            <Ledger
              caption="College, graduates and working professionals · 4 to 8 weeks · cohort capped at 15"
              columns={ADULT_COLUMNS}
              rows={ADULT_ROWS}
              minWidth="min-w-[58rem]"
              highlightRows={[1]}
            />
          </div>
        </PageSection>

        {/* -----------------------------------------------------------------
            SECTION 4: TRAINERS AND INSTITUTIONS
        ----------------------------------------------------------------- */}
        <PageSection
          id="institutions"
          title="Trainers & institutions"
          shards={1}
          lede={
            <>
              Licences to ship at campus scale, build coach certifications, and
              faculty development that sits inside standard institutional budget norms.
            </>
          }
        >
          <div className="max-w-[76rem]">
            <Ledger
              caption="Trainers and institutions · certifications · school licences · campus partnerships"
              columns={INSTITUTION_COLUMNS}
              rows={INSTITUTION_ROWS}
              minWidth="min-w-[54rem]"
            />
          </div>
        </PageSection>

        {/* -----------------------------------------------------------------
            SECTION 5: GROUND RULES
        ----------------------------------------------------------------- */}
        <PageSection
          id="ground-rules"
          title="Ground rules"
          shards={1}
          lede={
            <>
              Five non-negotiable positions that govern every cohort, school
              batch, and mentor slot.
            </>
          }
        >
          <div className="max-w-[64rem]">
            <Clauses items={GROUND_RULES} />
          </div>
        </PageSection>

        {/* -----------------------------------------------------------------
            SECTION 6: HOW TO CLAIM A SLOT
        ----------------------------------------------------------------- */}
        <PageSection
          id="claim-slot"
          title="How to claim a slot"
          shards={0}
          lede={
            <>
              One message. Send the tier you are entering, your age band or
              campus, and the specific thing you want to exist.
            </>
          }
        >
          <div className="flex flex-col gap-[clamp(1.25rem,3vw,2rem)]">
            <InstagramTrapdoor />

            <div className="max-w-[60ch] space-y-2">
              <p className="font-mono text-micro text-muted">
                Nothing you send is stored on this site. You talk directly with
                a builder on Instagram, not a sales representative or CRM drip sequence.
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
              detail:
                "Browse 15 builds shipped end to end, with prompts and zero rupee stacks.",
            },
            {
              href: "/start",
              label: "What to build first",
              detail:
                "Five foundational builder patterns you can open and run today.",
            },
            {
              href: "/answers",
              label: "Answers",
              detail:
                "Twelve straight answers about building AI software in India.",
            },
          ]}
        />

        <SiteCta
          action={false}
          line={<>Every number in the open. Now pick your build.</>}
          body={
            <>
              No sales deck, no surprise pricing in a DM, and no 45-minute pitch
              call with a closer. If you have the thing you want to make, tell us
              which track you are entering.
            </>
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}
