import * as React from "react";
import Link from "next/link";
import { BrandMask } from "@/components/ui/brand-mask";
import { Seam } from "@/components/ui/seam";
import { FOOTER_NAV } from "@/lib/nav";
import { formatUpdated, SITE } from "@/lib/site";

/**
 * The site's floor.
 *
 * Not a section that follows the page: a surface the page was sitting on the
 * whole time, uncovered as the document slides off it. The mechanism is the two
 * CSS rules under "The curtain" in `globals.css` and there is no JavaScript in
 * it, so this stays a Server Component, renders identically with scripting off,
 * and cannot fail into invisible content. On a phone, under reduced motion, and
 * in any viewport too short to hold it, the curtain does not apply and this is
 * an ordinary block at the end of the document.
 *
 * It carries no action. `brand.md` allows one decision per screen and the site
 * spends its only one immediately above this: the Instagram trapdoor, in
 * `Resolution` on `/` and in `SiteCta` on every other route. Repeating it here
 * would make the ending read as two asks, which is the reasoning the two-line
 * colophon this replaces was written with. So the footer is a destination and a
 * record, and nothing else.
 *
 * Ground is `--background` where `Resolution` runs `--surface`, so the floor is
 * visibly a different material from the last panel rather than a continuation of
 * it. The seam on top is the eighth in a sequence that has been counting its
 * shatter down 3, 3, 2, 2, 1, 0 all the way here, and it arrives already spent.
 */
export function SiteFooter() {
  return (
    <footer className="curtain">
      {/* The panel's top padding, which clears the sticky header, lives in
          `globals.css` beside the rule that fixes it: it is a property of being
          fixed, and in flow the same inch is dead space. */}
      <div className="curtain__panel flex flex-col bg-background">
        <div className="flex flex-1 flex-col">
          {/* Full bleed, matching every other seam on the site: an edge that
              stops short of the edge is a rule. */}
          <div className="px-[max(1rem,4vw)]">
            <Seam shards={0} draw={false} />
          </div>

          <div className="mx-auto flex w-full max-w-[110rem] flex-1 flex-col px-[max(1rem,4vw)]">
            <FooterNav />
            <Colophon />
          </div>
        </div>

        <GiantWordmark />
      </div>
    </footer>
  );
}

/**
 * The map, including the parts that are not built.
 *
 * `LandingHeader` ships no navigation at all, on the grounds that a header full
 * of links that 404 is a worse first impression than a header with none. This
 * diverges from that deliberately. A dead link at the top of a page is a control
 * that breaks under the hand; a dimmed label at the foot of one is a statement
 * of intent that promises nothing it cannot deliver. One is a defect, the other
 * is a roadmap, and the whole difference is whether it is an anchor.
 *
 * Live and unshipped are told apart with grammar the site already owns rather
 * than with a badge. The trailing `\` means "this is an action" everywhere else
 * here, so a label without one is not an action, and `--muted` against
 * `--foreground` says the same thing again in colour. No "coming soon", no
 * strikethrough, no `aria-disabled` on an element that was never interactive,
 * and nothing unshipped in the tab order.
 *
 * One `nav` landmark rather than four. Each list names itself with
 * `aria-labelledby` against a plain paragraph, so the grouping survives for a
 * screen reader without adding four `h2`s to a document whose heading outline is
 * already spoken for by the seven panels above.
 */
function FooterNav() {
  return (
    <nav
      aria-label="Footer"
      className="grid grid-cols-2 gap-x-[max(1rem,4vw)] gap-y-[clamp(2rem,4vw,2.75rem)] sm:grid-cols-4"
    >
      {FOOTER_NAV.map((group) => {
        const id = `footer-${group.heading.toLowerCase().replace(/\s+/g, "-")}`;

        return (
          <div key={group.heading}>
            <p id={id} className="eyebrow text-eyebrow">
              {group.heading}
            </p>

            <ul
              aria-labelledby={id}
              className="mt-[clamp(0.75rem,2vw,1.25rem)] font-mono text-data"
            >
              {group.items.map((item) => (
                <li key={item.href}>
                  {item.live ? (
                    <Link
                      href={item.href}
                      /* `min-h-11` is the 44px tap target design.md section 8
                         requires on mobile, dropped at `sm` where the pointer is
                         precise and 44px of leading between three links reads as
                         a list that lost its rhythm. */
                      className="group relative inline-flex min-h-11 items-center gap-1.5 text-foreground sm:min-h-0 sm:py-1"
                    >
                      {item.label}
                      <span aria-hidden="true" className="slash-glyph">
                        \
                      </span>
                      {/* Skewed to the slash and scaled out from the left by the
                          shared `.group` hover rule in `globals.css`. */}
                      <span
                        aria-hidden="true"
                        className="nav-rule absolute inset-x-0 bottom-0 h-px bg-accent-ink"
                      />
                    </Link>
                  ) : (
                    <span className="flex min-h-11 items-center text-muted sm:min-h-0 sm:py-1">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

/**
 * The two facts a published page owes a reader, carried across verbatim from the
 * colophon this replaces.
 *
 * The date is one of them. `website.md`: never publish an undated page.
 */
function Colophon() {
  return (
    <div className="mt-auto flex flex-col gap-2 border-t border-line pt-[clamp(1rem,2.5vw,1.5rem)] pb-[clamp(1.25rem,3vw,2rem)] font-mono text-micro text-muted sm:flex-row sm:items-center sm:justify-between">
      <p>
        {SITE.legalName}, a {SITE.parent} company
      </p>
      <p>
        Updated{" "}
        <time dateTime={SITE.updated}>{formatUpdated(SITE.updated)}</time>
      </p>
    </div>
  );
}

/**
 * The signature, at the size a signature goes at the foot of a document.
 *
 * `--line` rather than `--foreground`: this is texture, not a second headline,
 * and it sits under real content that has to stay the thing being read. The
 * backslash keeps `--accent`, so the one coloured mark on the mark survives;
 * that is the only reason 2.44:1 is acceptable here, and it is acceptable
 * because the element is `aria-hidden`, carries no meaning, and the header
 * already holds the accessible name.
 *
 * Wider than the viewport and pushed down past its own box, so the bottom of the
 * letterforms is cropped and the mark reads as continuing past the page rather
 * than as a logo parked near the bottom. The crop is done by a wrapper holding
 * nothing focusable, never by `overflow` on an ancestor of the links.
 *
 * `max-h-[20svh]` is the reason the panel cannot overflow. The mark is sized off
 * the viewport's width and the panel is one viewport tall, so on a wide short
 * window the two disagree: 88% of an ultrawide is a band ~260px deep, which is
 * enough to push the seam off the top of a 700px screen and clip it, silently,
 * with no scrollbar to say so. Capping the wrapper crops the mark harder there
 * instead, which is the effect this element already exists to produce.
 */
function GiantWordmark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none max-h-[20svh] overflow-hidden"
    >
      <BrandMask
        mark="wordmark"
        className="w-[88%] max-w-none mx-auto translate-y-[10%] text-line"
      />
    </div>
  );
}
