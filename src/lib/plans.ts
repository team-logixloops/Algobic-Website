/**
 * Every plan ALGOBIC sells, and every rupee in it.
 *
 * One table feeds three readers: the descent on `/pricing`, the flat ledger
 * under it, and the `OfferCatalog` an answer engine extracts. They used to be
 * three hand-built copies of the same numbers inside `/join`, which is how a
 * price changes in one place and not the other two. Edit a price here and
 * every surface moves with it.
 *
 * `listPrice` is the full price and renders struck through. `price` is what the
 * buyer pays today. Savings and percentages are derived, never typed, so the
 * badge cannot disagree with the two numbers it sits between.
 *
 * `chunk` is stored rather than computed. The per-session and per-teacher
 * figures came from the price sheet with its own rounding, and a buyer who
 * divides it out should land on the number printed, not one rupee off it.
 */

export type AudienceId = "college" | "school" | "institutions";

export type Billing =
  /** One payment for the whole plan. */
  | { kind: "once" }
  /** Billed every month. `price` is the monthly figure. */
  | { kind: "monthly" }
  /** One payment, or two monthly ones that cost a little more in total. */
  | { kind: "split"; monthly: number; months: number }
  /** A yearly licence. */
  | { kind: "yearly" };

export type Plan = {
  /** Stable forever: it is the URL fragment and the schema `@id`. */
  id: string;
  name: string;
  audience: AudienceId;
  /** Level or track, shown under the name. */
  level?: string;
  /** What you must already have shipped to enter. Absent means no gate. */
  gate?: string;
  /** One sentence on the gate, in the buyer's terms. */
  gateDetail?: string;
  listPrice: number;
  price: number;
  billing: Billing;
  /** The price broken into the unit the buyer thinks in. */
  chunk?: { amount: number; per: string };
  /** Duration and format, short. */
  length: string;
  /** Live URLs shipped across the plan. */
  urls?: number;
  /** The headline outcome. What exists at the end. */
  ships: string;
  includes: readonly string[];
  /** Paid tools that come with the plan. */
  perks?: readonly string[];
  /** The line that takes risk off the buyer. */
  assurance?: string;
  /** A rule or limit the buyer must know before paying. */
  note?: string;
  /** How many share the room. */
  seats?: string;
  recommended?: true;
  /**
   * Ground the tier sits on. 1 is paper, 2 is the surface step, 3 is the
   * inverted ground: by the deep end the page has turned over.
   */
  depth: 1 | 2 | 3;
  /** Sits at the same depth as the plan before it rather than one deeper. */
  sameDepth?: string;
};

export type Audience = {
  id: AudienceId;
  label: string;
  /** Who the panel is for, in one line. */
  forWhom: string;
  /** One or two sentences that frame every plan in the panel. */
  lede: string;
};

export const AUDIENCES: readonly Audience[] = [
  {
    id: "college",
    label: "College",
    forWhom: "College students, graduates and working professionals",
    lede: "Four to eight weeks, never longer, and every cohort is capped at 15 builders. Strangers and Deep End each have a gate you clear by shipping, not by paying.",
  },
  {
    id: "school",
    label: "School",
    forWhom: "Class 4 to 10",
    lede: "Batches of six, eight live sessions a month, billed monthly with a two-month maximum term. Class 4 to 6, 7 to 8 and 9 to 10 never share a batch, whatever the skill level.",
  },
  {
    id: "institutions",
    label: "Institutions",
    forWhom: "Trainers, schools and colleges",
    lede: "Certification for coaches, programmes for teachers and faculty, and a yearly licence for a whole campus. Coaches and faculty ship their own builds before they certify or complete.",
  },
] as const;

export const PLANS: readonly Plan[] = [
  /* ------------------------------------------------------------- college */
  {
    id: "college-cold-start",
    name: "Cold Start",
    audience: "college",
    level: "No gate",
    listPrice: 14498,
    price: 8498,
    billing: { kind: "once" },
    chunk: { amount: 2125, per: "a week" },
    length: "4 weeks",
    urls: 1,
    ships: "A clone of something you scrolled past, live at a URL.",
    includes: [
      "A six-item dependency list, never a roadmap",
      "Two written reviews inside 24 hours, one instruction each",
      "Four demo days",
    ],
    perks: ["Claude Pro for one month, from day ten"],
    seats: "Cohort capped at 15",
    depth: 1,
  },
  {
    id: "college-strangers",
    name: "Strangers",
    audience: "college",
    gate: "One live URL",
    gateDetail: "You enter Strangers with one thing already live that anyone can open.",
    listPrice: 29498,
    price: 18498,
    billing: { kind: "split", monthly: 9498, months: 2 },
    chunk: { amount: 2312, per: "a week" },
    length: "8 weeks",
    urls: 2,
    ships:
      "Two builds. The second has to reach five strangers or one paying user, proven with analytics.",
    includes: [
      "Claude Code in the desktop app, no terminal",
      "Supabase",
      "Six written reviews and four live one to ones",
      "Your own domain, yours to keep",
    ],
    perks: ["Claude Pro for two months, from day ten"],
    assurance: "₹2,998 deposit, returned when you prove the five strangers or the payer.",
    seats: "Cohort capped at 15",
    recommended: true,
    depth: 2,
  },
  {
    id: "college-deep-end",
    name: "Deep End",
    audience: "college",
    gate: "Real traffic",
    gateDetail: "You enter Deep End with something real people already use.",
    listPrice: 49498,
    price: 31498,
    billing: { kind: "split", monthly: 16498, months: 2 },
    chunk: { amount: 3937, per: "a week" },
    length: "8 weeks",
    urls: 3,
    ships: "Three builds. The third has one genuinely hard part from the closed list.",
    includes: [
      "Claude Code in the terminal, on a real repo",
      "Cursor Start",
      "Eight written reviews and six live one to ones",
      "Four defence drills against your own build",
      "Profile and GitHub rebuild",
      "A post mortem with the real monthly rupee cost",
    ],
    note: "No job guarantee, in writing.",
    seats: "Cohort capped at 15",
    depth: 3,
  },
  {
    id: "college-deep-end-weekends",
    name: "Deep End, Weekends",
    audience: "college",
    level: "Graduates and working professionals",
    sameDepth: "Same depth, Saturdays and Sundays only",
    listPrice: 59498,
    price: 37498,
    billing: { kind: "split", monthly: 19498, months: 2 },
    chunk: { amount: 4687, per: "a weekend" },
    length: "8 weeks",
    urls: 2,
    ships: "Two builds. The second is aimed at a paying user.",
    includes: [
      "A monetisation module that ends with the first invoice you actually send",
      "Claude Code, Cursor Start, Canva Pro and a domain",
    ],
    note: "Never mixed with student cohorts.",
    depth: 3,
  },

  /* -------------------------------------------------------------- school */
  {
    id: "school-cold-start",
    name: "Cold Start",
    audience: "school",
    level: "Basic",
    listPrice: 2498,
    price: 1998,
    billing: { kind: "monthly" },
    chunk: { amount: 250, per: "a session" },
    length: "8 live sessions a month",
    urls: 2,
    ships: "An AI story maker, a talking quiz and a small game.",
    includes: ["Logic and sequencing", "Design and voice", "Publishing", "Digital safety"],
    note: "Coach's shared screen only. No personal AI account at any age in this tier.",
    seats: "Batch of six",
    depth: 1,
  },
  {
    id: "school-strangers",
    name: "Strangers",
    audience: "school",
    level: "Intermediate",
    listPrice: 2998,
    price: 2498,
    billing: { kind: "monthly" },
    chunk: { amount: 312, per: "a session" },
    length: "8 live sessions a month",
    urls: 3,
    ships: "A real website, a class helper and a tool their friends use.",
    includes: ["Data that survives a refresh", "First real users who are not family"],
    note: "Still the coach's screen. Your child dictates, the coach types.",
    seats: "Batch of six",
    recommended: true,
    depth: 2,
  },
  {
    id: "school-deep-end",
    name: "Deep End",
    audience: "school",
    level: "Advanced",
    listPrice: 3498,
    price: 2998,
    billing: { kind: "monthly" },
    chunk: { amount: 375, per: "a session" },
    length: "8 live sessions a month",
    urls: 3,
    ships: "A real app with accounts, plus one awkward part.",
    includes: [
      "Consent and data ethics",
      "The cost line, written by your child",
      "A domain they keep",
      "A Verified Build Record",
    ],
    note: "Class 9 to 10 only: family account, written parent consent on file.",
    seats: "Batch of six",
    depth: 3,
  },
  {
    id: "school-one-to-one",
    name: "One to One",
    audience: "school",
    level: "Families already in a batch",
    sameDepth: "Same depth, one coach to one child",
    listPrice: 4998,
    price: 4498,
    billing: { kind: "monthly" },
    chunk: { amount: 1124, per: "a session" },
    length: "4 sessions a month",
    urls: 2,
    ships: "Four sessions a month with a dedicated coach.",
    includes: ["A recording or a second adult on every session"],
    note: "Maximum four active slots, open only to families already in a batch.",
    depth: 3,
  },

  /* -------------------------------------------------------- institutions */
  {
    id: "institutions-build-coach",
    name: "Build Coach Certification",
    audience: "institutions",
    level: "Mentor track",
    listPrice: 39498,
    price: 24498,
    billing: { kind: "once" },
    length: "6 weeks, batch of 10",
    ships: "Ship three builds yourself, then get assessed on a recorded coaching session.",
    includes: [
      "Fifteen playbooks with prompts, break points and rupee costs",
      "A licence to run Ship Sprints, revocable",
    ],
    assurance: "You keep 65 percent of every Ship Sprint you run.",
    depth: 1,
  },
  {
    id: "institutions-teacher-programme",
    name: "Teacher Programme",
    audience: "institutions",
    level: "School educators",
    listPrice: 148498,
    price: 98498,
    billing: { kind: "once" },
    chunk: { amount: 4925, per: "a teacher" },
    length: "3 days, up to 20 teachers",
    ships: "A Class 4 to 10 curriculum your teachers can run without us.",
    includes: [
      "A written safeguarding protocol",
      "Parent communication scripts",
      "Process praise drilling",
      "One school Ship Sprint, run by us",
    ],
    depth: 1,
  },
  {
    id: "institutions-faculty-development",
    name: "Faculty Development",
    audience: "institutions",
    level: "Higher education FDP",
    listPrice: 298498,
    price: 198498,
    billing: { kind: "once" },
    chunk: { amount: 7940, per: "a faculty member" },
    length: "5 days, up to 25 faculty",
    ships: "Faculty ship three builds each, or they do not complete.",
    includes: ["One campus Ship Sprint"],
    assurance: "Priced inside standard FDP budget norms, so it can be paid from an existing FDP budget.",
    depth: 1,
  },
  {
    id: "institutions-campus-licence",
    name: "Campus Partner Licence",
    audience: "institutions",
    level: "Institutional agreement",
    listPrice: 298998,
    price: 298498,
    billing: { kind: "yearly" },
    chunk: { amount: 1492, per: "a student" },
    length: "One year, up to 200 students",
    ships: "Up to 200 students a year, building on your campus.",
    includes: [
      "Coach training",
      "A co-branded student build page",
      "Two Ship Sprints a year, on site",
    ],
    depth: 1,
  },
] as const;

/** The two ways in that cost less than a plan. */
export const ENTRY_OFFERS = {
  discoveryCall: {
    id: "discovery-call",
    name: "Discovery Call",
    listPrice: 498,
    price: 98,
    length: "25 minutes, one to one",
    ships: "A one to one intake before you choose a tier.",
  },
  trialBuild: {
    id: "school-trial-build",
    name: "Trial Build",
    listPrice: 998,
    price: 498,
    length: "One 60 minute session",
    ships: "A live build session with a coach.",
    assurance: "Fully credited against any plan.",
  },
} as const;

export type EntryOffer = (typeof ENTRY_OFFERS)[keyof typeof ENTRY_OFFERS];

/** Indian digit grouping: ₹1,48,498, not ₹148,498. */
const INR = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function rupees(amount: number): string {
  return `₹${INR.format(amount)}`;
}

export function saving(item: { listPrice: number; price: number }) {
  const amount = item.listPrice - item.price;
  const percent = Math.round((amount / item.listPrice) * 100);
  return { amount, percent };
}

/** What paying once saves over the split, for plans that offer both. */
export function splitSaving(plan: Plan): number {
  return plan.billing.kind === "split"
    ? plan.billing.monthly * plan.billing.months - plan.price
    : 0;
}

export function billingLabel(billing: Billing): string {
  switch (billing.kind) {
    case "once":
    case "split":
      return "one payment";
    case "monthly":
      return "a month";
    case "yearly":
      return "a year";
  }
}

export function plansFor(audience: AudienceId): readonly Plan[] {
  return PLANS.filter((plan) => plan.audience === audience);
}

/** The cheapest way into an audience's plans, for the switch. */
export function fromPrice(audience: AudienceId): string {
  const plans = plansFor(audience);
  const cheapest = plans.reduce((low, plan) => (plan.price < low.price ? plan : low));
  const unit = cheapest.billing.kind === "monthly" ? " a month" : "";
  return `from ${rupees(cheapest.price)}${unit}`;
}
