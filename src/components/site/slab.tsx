import * as React from "react";
import Link from "next/link";
import { Rise } from "@/components/ui/scroll-fx";

/**
 * The row shape the interior pages share.
 *
 * Two text slots, and the order between them is the whole point. `body` is the
 * situation: a moment with somebody in it, set at reading size in the
 * foreground colour, because it is the thing that has to land first. `detail`
 * is what the thing actually does, set smaller and muted, because it only
 * becomes interesting once the situation has been recognised. Leading with the
 * description is the order a product catalogue uses and the reverse of the
 * order a person decides in.
 *
 * Linked and unlinked are one component, not two designs. Half of what this
 * site lists is real and half is not written yet, and the difference has to be
 * legible without a badge. The grammar the footer already owns does it: a
 * trailing `\` means this is an action, `--foreground` means it resolves, and
 * an item with neither is simply not offered. Nothing unshipped enters the tab
 * order and nothing unshipped is an anchor.
 *
 * No "not published yet" note. It was there and it was removed on 2026-08-09:
 * a list that annotates its own gaps is a list advertising how empty it is, and
 * the missing anchor already says everything true that the note said.
 *
 * The hover treatment lives in `globals.css` under "The slab" and every gesture
 * in it runs on the site's one angle.
 */

export type SlabItem = {
  /** Absent means the page does not exist yet. Renders unlinked and quiet. */
  href?: string;
  title: string;
  /** The situation. Two or three short sentences with somebody in them. */
  body?: string;
  /** What it does, once the situation has earned the sentence. */
  detail?: string;
  /** Mono facts. Time, cost, tools, counts. Separated by the slash jog. */
  meta?: readonly string[];
};

function Meta({ meta }: { meta: readonly string[] }) {
  return (
    <span className="slab__meta mt-[clamp(0.75rem,1.8vw,1.125rem)] flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-micro text-muted">
      {meta.map((fact, i) => (
        <React.Fragment key={fact}>
          {i > 0 ? (
            <span
              aria-hidden="true"
              className="block h-[0.7rem] w-px shrink-0 bg-line"
              style={{ transform: "skewX(calc(-1 * var(--slash-angle)))" }}
            />
          ) : null}
          <span>{fact}</span>
        </React.Fragment>
      ))}
    </span>
  );
}

function Inner({ item, linked }: { item: SlabItem; linked: boolean }) {
  return (
    <>
      {/* The accent lead, sitting on the block's own top border. `-top-px`
          rather than `top-0`: an absolutely positioned child resolves against
          the padding box, which starts below the 1px border, so `top-0` would
          leave the lead one pixel under the rule instead of on it. */}
      <span
        aria-hidden="true"
        className="slab__lead absolute -top-px left-0 block h-[3px] w-[clamp(3rem,9vw,6rem)] bg-accent"
      />

      {/* The leading edge. Grows from the floor of the row on the slash, so a
          hovered row is a panel arriving rather than a box lighting up. */}
      <span
        aria-hidden="true"
        className="slab__edge absolute top-0 bottom-0 left-0 block w-[3px] bg-accent-2"
      />

      <span className="slab__shift block">
        <span className="flex items-baseline justify-between gap-4">
          <span
            className={`text-balance font-display text-[clamp(1.0625rem,1.9vw,1.375rem)] leading-tight font-bold ${
              linked ? "text-foreground" : "text-muted"
            }`}
          >
            {item.title}
          </span>

          {linked ? (
            <span aria-hidden="true" className="slash-glyph shrink-0">
              \
            </span>
          ) : null}
        </span>

        {item.body ? (
          <span className="mt-[clamp(0.5rem,1.3vw,0.8125rem)] block max-w-[58ch] text-[clamp(0.9375rem,1.4vw,1.0625rem)] leading-relaxed text-foreground">
            {item.body}
          </span>
        ) : null}

        {item.detail ? (
          <span className="mt-[clamp(0.375rem,1vw,0.625rem)] block max-w-[58ch] text-[clamp(0.875rem,1.25vw,0.9375rem)] leading-relaxed text-muted">
            {item.detail}
          </span>
        ) : null}

        {item.meta?.length ? <Meta meta={item.meta} /> : null}
      </span>
    </>
  );
}

export function Slab({ item }: { item: SlabItem }) {
  const shared =
    "slab relative block overflow-hidden border-t border-line px-[clamp(0.875rem,2vw,1.5rem)] py-[clamp(1.125rem,2.75vw,1.75rem)]";

  if (!item.href) {
    /* No anchor, no tab stop, no hover. A quiet row is a roadmap; the same row
       as a control that breaks under the hand is a defect, and the whole
       difference is whether it is a link. */
    return (
      <div className={shared}>
        <Inner item={item} linked={false} />
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      /* `min-h-11` is the 44px tap target `design.md` section 8 requires on
         mobile. The padding already clears it at every width these render at,
         so it is a floor rather than the mechanism. */
      className={`${shared} wipe min-h-11`}
    >
      <Inner item={item} linked />
    </Link>
  );
}

/**
 * A column of rows that arrive in sequence as the block crosses the viewport.
 *
 * One column, never two. These lists run to five, six and twelve items, and a
 * two-up grid of an odd count is a hole in the corner plus a reader deciding
 * whether to read across or down. Full-width rows read in one direction.
 */
export function SlabList({
  items,
  className = "",
}: {
  items: readonly SlabItem[];
  className?: string;
}) {
  return (
    <Rise stagger={0.06} y={28} select="[data-slab]" className={className}>
      <ul>
        {items.map((item) => (
          <li key={item.href ?? item.title} data-slab>
            <Slab item={item} />
          </li>
        ))}
      </ul>
    </Rise>
  );
}
