import * as React from "react";
import Link from "next/link";
import { BrandMask } from "@/components/ui/brand-mask";
import { MaskThemeToggle } from "@/components/ui/mask-view-transition-theme-toggle";
import { PRIMARY_NAV } from "@/lib/nav";

/**
 * Sticky chrome. Wordmark, five links, theme toggle.
 *
 * No hamburger: on a phone the nav becomes a horizontally scrolling mono strip.
 * A drawer would need client JS, a focus trap and an open/closed state for five
 * links that already fit on one line. The strip costs none of that and keeps
 * every link keyboard-reachable, since focusing a link scrolls it into view.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur-sm supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-[110rem] flex-col gap-2 px-[max(1rem,4vw)] py-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center justify-between gap-4 sm:flex-1">
          <Link
            href="/"
            aria-label="ALGOBIC home"
            className="group shrink-0 transition-opacity hover:opacity-75"
          >
            <BrandMask
              mark="wordmark"
              className="w-[clamp(6.5rem,22vw,8.5rem)] text-foreground"
            />
          </Link>

          {/* Toggle stays on the first row at every width. It is the one
              control people hunt for. */}
          <MaskThemeToggle className="sm:hidden" />
        </div>

        <nav
          aria-label="Primary"
          className="-mx-[max(1rem,4vw)] overflow-x-auto px-[max(1rem,4vw)] [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex items-center gap-[clamp(0.875rem,2.5vw,1.75rem)]">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  className="group relative block py-1 font-mono text-micro text-muted uppercase transition-colors hover:text-foreground"
                >
                  {item.label}
                  {/* Hover rule arrives on the slash. */}
                  <span
                    aria-hidden="true"
                    className="nav-rule absolute -bottom-px left-0 block h-[2px] w-full bg-accent"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <MaskThemeToggle className="hidden shrink-0 sm:flex" />
      </div>
    </header>
  );
}
