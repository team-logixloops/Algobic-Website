import * as React from "react";
import {
  billingLabel,
  plansFor,
  rupees,
  saving,
  splitSaving,
  type Audience,
  type EntryOffer,
  type Plan,
} from "@/lib/plans";
import { SITE } from "@/lib/site";

/**
 * The plans as a descent.
 *
 * The tier names were already a dive: Cold Start, Strangers, Deep End. So the
 * page goes down with them. Each tier sits on its own full-bleed ground and
 * the grounds darken in step, in both themes, so the deep end is always the
 * darkest ground on the page. Between tiers that
 * have one, a gate draws across the width as you scroll over it: the thing you
 * have to have shipped before you can enter what is below.
 *
 * That is the argument of the pricing, made by the layout rather than by a
 * sentence. Every tier has a price, and the deeper ones also have a gate, and
 * no price buys you past a gate.
 *
 * Institutions are not a descent. Their plans are four separate products, so
 * they sit on one ground with hairlines between them and no depth numbers.
 *
 * The one piece of motion is the scroll-drawn rule, the same `.draw-scroll`
 * and `.draw-scroll-y` the rest of the site already uses. Nothing fades in.
 */

/* Grounds live in `globals.css` under "The descent's grounds": the dark theme
   needs its own ramp, and that is two selectors, not a Tailwind variant per
   tier. */
const GROUND: Record<Plan["depth"], string> = {
  1: "depth-1 text-foreground",
  2: "depth-2 text-foreground",
  3: "depth-3 text-foreground",
};

const FRAME = "mx-auto w-full max-w-[110rem] px-[max(1rem,4vw)]";

function depthLabel(depth: number): string {
  return String(depth).padStart(2, "0");
}

/** The list price, cut on the slash, then the price paid. */
function PriceTag({ item, plan }: { item: { listPrice: number; price: number }; plan?: Plan }) {
  const off = saving(item);
  const once = plan ? splitSaving(plan) : 0;

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="sr-only">Full price </span>
        <s className="price-cut font-display text-[clamp(1rem,1.6vw,1.25rem)] font-bold text-muted">
          {rupees(item.listPrice)}
        </s>
        <span className="font-mono text-micro text-accent-ink">
          Save {rupees(off.amount)}
          {off.percent >= 5 ? ` (${off.percent}% off)` : ""}
        </span>
      </p>

      <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2.5">
        <span className="sr-only">Now </span>
        <span className="font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-bold tracking-[-0.03em]">
          {rupees(item.price)}
        </span>
        <span className="text-[0.9375rem] text-muted">
          {plan ? billingLabel(plan.billing) : "one payment"}
        </span>
      </p>

      {plan?.chunk ? (
        <p className="mt-2.5 font-mono text-data">
          That is {rupees(plan.chunk.amount)} {plan.chunk.per}
        </p>
      ) : null}

      {plan?.billing.kind === "split" ? (
        <p className="mt-1.5 font-mono text-micro text-muted">
          Or {plan.billing.months} payments of {rupees(plan.billing.monthly)} a
          month. Paying once saves {rupees(once)}.
        </p>
      ) : null}
    </div>
  );
}

/** Every claim opens a DM. Says so in its accessible name. */
function ClaimLink({
  label,
  name,
  strong = false,
}: {
  label: string;
  name: string;
  strong?: boolean;
}) {
  return (
    <a
      href={SITE.instagramDm}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`${label}: ${name}. Opens an Instagram message to @${SITE.instagramHandle} in a new tab`}
      className={`wipe group inline-flex min-h-11 items-center justify-center gap-2 border px-5 py-3 text-[0.9375rem] font-semibold ${
        strong
          ? "border-foreground bg-foreground text-background"
          : "border-foreground text-foreground"
      }`}
    >
      {label}
      <span aria-hidden="true" className="slash-glyph">
        \
      </span>
    </a>
  );
}

function Gate({ plan }: { plan: Plan }) {
  return (
    <div className={`${FRAME} pt-[clamp(1.5rem,4vw,2.75rem)]`}>
      <p className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1.5">
        <span className="gate-tag bg-accent-ink px-3 py-1 font-mono text-micro font-medium text-background">
          Gate
        </span>
        <span className="font-display text-[clamp(1rem,1.7vw,1.25rem)] font-bold">
          {plan.gate}
        </span>
        <span className="text-[0.9375rem] text-muted">{plan.gateDetail}</span>
      </p>
      <span
        aria-hidden="true"
        className="draw-scroll mt-[clamp(0.75rem,2vw,1.125rem)] block h-[2px] w-full bg-accent-ink"
      />
    </div>
  );
}

function SameDepth({ text }: { text: string }) {
  return (
    <div className={`${FRAME} pt-[clamp(1.5rem,4vw,2.5rem)]`}>
      <p className="flex items-center gap-3 font-mono text-micro text-muted">
        <span aria-hidden="true" className="h-px w-[clamp(1rem,6vw,5rem)] bg-line" />
        {text}
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </p>
    </div>
  );
}

function Stratum({
  plan,
  descent,
  claimLabel,
}: {
  plan: Plan;
  descent: boolean;
  claimLabel: string;
}) {
  /* A gated tier already has its gate drawn directly above it, so the tag line
     would only repeat it. It names the gate only where no band is drawn. */
  const tag = plan.gate && !descent ? `Gate: ${plan.gate}` : plan.level;
  const facts = [
    plan.length,
    plan.urls ? `${plan.urls} live URL${plan.urls === 1 ? "" : "s"}` : null,
    plan.seats ?? null,
  ].filter((fact): fact is string => Boolean(fact));

  return (
    <article
      id={plan.id}
      aria-labelledby={`${plan.id}-name`}
      className={`scroll-mt-[clamp(5.25rem,10vw,7rem)] ${descent ? GROUND[plan.depth] : "bg-background text-foreground"}`}
    >
      {descent && plan.gate ? <Gate plan={plan} /> : null}
      {descent && plan.sameDepth ? <SameDepth text={plan.sameDepth} /> : null}

      <div
        className={`${FRAME} grid gap-y-[clamp(1.25rem,3vw,1.75rem)] py-[clamp(2rem,5.5vw,4.25rem)] ${
          descent
            ? "lg:grid-cols-[minmax(0,5.5rem)_minmax(0,1fr)_minmax(0,22rem)]"
            : "border-t border-line lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]"
        } lg:gap-x-[clamp(2rem,4.5vw,4.5rem)]`}
      >
        {descent ? (
          /* The depth gauge. Laptop only: stacked, the number moves into the
             tag line instead, and a rule beside one column of text is noise. */
          <div aria-hidden="true" className="relative hidden lg:block">
            <span className="font-display text-display-l leading-none text-muted">
              {depthLabel(plan.depth)}
            </span>
            <span className="draw-scroll-y absolute top-[4.25rem] bottom-0 left-[0.6rem] w-px bg-line" />
          </div>
        ) : null}

        <div className="min-w-0">
          <p className="font-mono text-micro text-accent-ink">
            {descent ? (
              <span aria-hidden="true" className="lg:hidden">
                {depthLabel(plan.depth)}{" "}
              </span>
            ) : null}
            {tag}
          </p>

          <h3
            id={`${plan.id}-name`}
            className="mt-2 font-display text-display-l text-balance"
          >
            {plan.name}
          </h3>

          <p className="mt-[clamp(0.75rem,2vw,1.125rem)] max-w-[52ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-snug">
            {plan.ships}
          </p>

          <ul className="mt-[clamp(1rem,2.5vw,1.5rem)] grid max-w-[64rem] gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {plan.includes.map((item) => (
              <li
                key={item}
                className="flex items-baseline gap-2.5 text-[0.9375rem] leading-relaxed text-muted"
              >
                <span
                  aria-hidden="true"
                  className="block h-[0.75rem] w-[1.5px] shrink-0 translate-y-[0.1rem] bg-accent-ink"
                  style={{ transform: "skewX(calc(-1 * var(--slash-angle)))" }}
                />
                {item}
              </li>
            ))}
          </ul>

          {plan.perks ? (
            <ul className="mt-[clamp(1rem,2.5vw,1.375rem)] flex flex-wrap gap-2">
              {plan.perks.map((perk) => (
                <li
                  key={perk}
                  className="border border-line px-2.5 py-1 font-mono text-micro"
                >
                  Included: {perk}
                </li>
              ))}
            </ul>
          ) : null}

          {plan.note ? (
            <p className="mt-[clamp(1rem,2.5vw,1.375rem)] max-w-[60ch] font-mono text-data font-semibold">
              {plan.note}
            </p>
          ) : null}

          <ul className="mt-[clamp(1rem,2.5vw,1.375rem)] flex flex-wrap gap-x-5 gap-y-1 font-mono text-micro text-muted">
            {facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>

        <div
          className={`self-start border-t border-line pt-[clamp(1.25rem,3vw,1.5rem)] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-[clamp(1.25rem,2.5vw,2rem)] ${
            plan.recommended ? "corner-cut" : ""
          }`}
        >
          {plan.recommended ? (
            <p className="mb-3 font-mono text-micro font-medium text-accent-ink">
              Recommended
            </p>
          ) : null}

          <PriceTag item={plan} plan={plan} />

          <div className="mt-[clamp(1.25rem,3vw,1.75rem)]">
            <ClaimLink label={claimLabel} name={plan.name} strong={plan.recommended} />
          </div>

          {plan.assurance ? (
            <p className="mt-4 max-w-[34ch] text-[0.875rem] leading-relaxed text-muted">
              {plan.assurance}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/** A cheaper first step, set as a band so it never competes with a tier. */
export function EntryBand({
  offer,
  heading,
  forWhom,
}: {
  offer: EntryOffer;
  heading: string;
  forWhom: string;
}) {
  return (
    <aside
      id={offer.id}
      aria-labelledby={`${offer.id}-heading`}
      className={`${FRAME} scroll-mt-[clamp(5.25rem,10vw,7rem)]`}
    >
      <div className="grid gap-[clamp(1rem,3vw,2rem)] border border-line p-[clamp(1.25rem,3.5vw,2.25rem)] md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className="font-mono text-micro text-accent-ink">{forWhom}</p>
          <h3
            id={`${offer.id}-heading`}
            className="mt-2 font-display text-[clamp(1.25rem,2.4vw,1.75rem)] leading-tight font-bold"
          >
            {heading}
          </h3>
          <p className="mt-2 max-w-[54ch] text-[0.9375rem] leading-relaxed text-muted">
            {offer.name}: {offer.ships} {offer.length}.
            {"assurance" in offer ? ` ${offer.assurance}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
          <PriceTag item={offer} />
          <ClaimLink label="Book it" name={offer.name} />
        </div>
      </div>
    </aside>
  );
}

export function PlanDescent({
  audience,
  before,
}: {
  audience: Audience;
  /** Anything that belongs above the first tier, like a trial offer. */
  before?: React.ReactNode;
}) {
  const plans = plansFor(audience.id);
  const descent = audience.id !== "institutions";
  const claimLabel = descent ? "Claim a seat" : "Message us about this";

  return (
    <section aria-labelledby={`${audience.id}-plans`}>
      <div className={`${FRAME} pt-[clamp(2rem,5vw,3.5rem)] pb-[clamp(1.25rem,3vw,2rem)]`}>
        <h2 id={`${audience.id}-plans`} className="eyebrow text-eyebrow">
          {audience.label} plans
        </h2>
        <p className="mt-3 font-display text-[clamp(1.125rem,2vw,1.5rem)] leading-tight font-bold">
          {audience.forWhom}
        </p>
        <p className="mt-3 max-w-[64ch] text-[clamp(1rem,1.4vw,1.125rem)] leading-relaxed text-muted">
          {audience.lede}
        </p>
      </div>

      {before ? <div className="pb-[clamp(1.5rem,4vw,2.5rem)]">{before}</div> : null}

      {plans.map((plan) => (
        <Stratum key={plan.id} plan={plan} descent={descent} claimLabel={claimLabel} />
      ))}
    </section>
  );
}
