import * as React from "react";
import Link from "next/link";
import { BrandMask } from "@/components/ui/brand-mask";
import { MaskThemeToggle } from "@/components/ui/mask-view-transition-theme-toggle";
import { PRIMARY_NAV } from "@/lib/nav";
import { SITE } from "@/lib/site";

/**
 * The site's chrome.
 *
 * It shipped with no navigation at all, on the grounds that a header full of
 * links that 404 is a worse first impression than a header with none, and that
 * the nav arrives with the pages it points at. Those pages shipped on
 * 2026-08-09, so it arrives. Five items, exactly as `website.md` section 2
 * specifies: more than five reads as a company with no opinion, and `About`,
 * `Manifesto`, `Work` and `Data` stay in the footer, where they matter for
 * trust rather than for traffic.
 *
 * `PRIMARY_NAV` is still filtered on `live`. Nothing about that changes because
 * every row happens to carry the flag today: the next thing this table gains is
 * `/tools/[comparison]`, which will not have it for a while, and a header that
 * silently starts publishing links to a 404 is exactly what the flag exists to
 * prevent.
 *
 * No hamburger. Below `sm` the nav becomes a horizontally scrolling mono strip,
 * which is what `design.md` section 5's mobile wireframe draws. A drawer needs
 * client JavaScript, a focus trap and an open state for five links that already
 * fit on one line, and this header is a Server Component with none of that.
 * Focusing a link scrolls it into view, so the strip is not a keyboard trap.
 *
 * Two props, both defaulting to the safe answer, and both server-side. Reading
 * the pathname with `usePathname` would make this a Client Component on every
 * route, for two pieces of information the page already knows about itself.
 *
 * The toggle is cut on the slash rather than left a plain rounded square:
 * `.shard-toggle` in `globals.css` clips its top-right corner along the site's
 * one owned angle, so the single persistent control in this bar is shaped like
 * a piece of the mark rather than a generic icon button. Shape, not colour or
 * motion nobody asked to notice, is what makes the toggle read as considered.
 *
 * The rule under the bar draws in on load and then holds still: a hairline and
 * one accent jog, the same closing mark every `Seam` on the page ends in, so
 * the header rhymes with the sections below it without inventing a device of
 * its own.
 */
export function LandingHeader({
  /**
   * True on `/` only. The wordmark stops being a link there: linking home from
   * the top of home is a control that does nothing, and a dead control costs
   * more trust than a missing one.
   */
  home = false,
  /**
   * The current route, so one nav item can carry `aria-current="page"`. Omit it
   * and no item claims to be current, which is wrong but harmless. Claiming the
   * wrong one is neither.
   */
  current,
}: {
  home?: boolean;
  current?: string;
} = {}) {
  /* The bar is opaque, not translucent with a backdrop blur. Two reasons, both
   * real. A 65%-opaque bar over a live canvas re-reads and re-blurs its
   * backdrop on every scroll frame, which is exactly the cost a mid-range
   * Android cannot spare and exactly the device this audience is on. And
   * whatever scrolled underneath it showed through the theme toggle, dragging
   * the icon and its focus ring below the 3:1 floor at unpredictable moments.
   */
  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="mx-auto flex max-w-[110rem] flex-col gap-[clamp(0.375rem,1vw,0.625rem)] px-[max(1rem,4vw)] py-[clamp(0.625rem,1.5vw,0.875rem)] sm:flex-row sm:items-center sm:gap-[clamp(1.25rem,4vw,3rem)]">
        <div className="flex items-center justify-between gap-4 sm:shrink-0">
          {home ? (
            <BrandMask
              mark="wordmark"
              label={SITE.name}
              className="rise w-[clamp(6.5rem,22vw,9rem)] text-foreground"
            />
          ) : (
            /* `tap-44`: the wordmark is 11.5:1, so this anchor shrink-wraps to
               about 144x13, well under the 44px floor `design.md` section 8
               sets. The utility expands the hit area with an out-of-flow
               pseudo-element rather than with padding, which would grow the
               bar. */
            <Link
              href="/"
              aria-label={`${SITE.name} home`}
              className="tap-44 rise block transition-opacity hover:opacity-70"
            >
              <BrandMask
                mark="wordmark"
                className="w-[clamp(6.5rem,22vw,9rem)] text-foreground"
              />
            </Link>
          )}

          {/* On a phone the toggle stays on the first row with the wordmark. It
              is the one control people hunt for, and burying it at the end of a
              scrolling strip means hunting sideways for it. */}
          <MaskThemeToggle
            className="shard-toggle rise sm:hidden"
            style={{ "--d": "90ms" } as React.CSSProperties}
          />
        </div>

        <nav
          aria-label="Primary"
          /* The negative margin plus matching padding lets the strip's contents
             start flush with the page gutter and still scroll past it, so the
             first item is aligned to the wordmark rather than inset from it. */
          className="rise -mx-[max(1rem,4vw)] overflow-x-auto px-[max(1rem,4vw)] [scrollbar-width:none] sm:mx-0 sm:flex-1 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
          style={{ "--d": "140ms" } as React.CSSProperties}
        >
          <ul className="flex items-center gap-[clamp(1rem,2.5vw,2rem)]">
            {PRIMARY_NAV.filter((item) => item.live).map((item) => {
              const isCurrent = item.href === current;

              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`tap-44 group block py-1.5 font-mono text-micro uppercase transition-colors hover:text-foreground ${
                      isCurrent ? "text-foreground" : "text-muted"
                    }`}
                  >
                    {item.label}

                    {/* Two states, one element. The current page keeps the rule
                        drawn and unskewed, which reads as a position rather than
                        as a hover stuck on. Everything else gets the shared
                        `.nav-rule` treatment: skewed to the slash and scaled out
                        from the left by the `.group` hover rule in
                        `globals.css`. */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -bottom-px block h-[2px] ${
                        isCurrent ? "bg-accent-ink" : "nav-rule bg-accent"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <MaskThemeToggle
          className="shard-toggle rise hidden shrink-0 sm:flex"
          style={{ "--d": "90ms" } as React.CSSProperties}
        />
      </div>

      {/* Draws in on load, on the same beat the hero's own shard row starts
          on, then holds still. `aria-hidden`: the toggle already carries this
          header's one accessible control, and a rule with a mark on it adds
          no information a screen reader owes anyone. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px">
        <span
          className="draw absolute inset-0 bg-line"
          style={{ "--d": "140ms" } as React.CSSProperties}
        />

        <span
          className="absolute right-[max(1rem,4vw)] bottom-0 block h-[clamp(0.875rem,2vw,1.125rem)] w-[2px] bg-accent"
          style={{
            transform: "translateY(50%) skewX(calc(-1 * var(--slash-angle)))",
          }}
        />
      </div>
    </header>
  );
}
