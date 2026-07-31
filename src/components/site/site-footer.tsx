import * as React from "react";
import Link from "next/link";
import { BrandMask } from "@/components/ui/brand-mask";
import { InstagramTrapdoor } from "@/components/ui/instagram-trapdoor";
import { Seam } from "@/components/ui/seam";
import { FOOTER_NAV } from "@/lib/nav";
import { formatUpdated, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[110rem] px-[max(1rem,4vw)] pb-[max(1.5rem,4vh)]">
        <Seam />

        <div className="grid gap-[clamp(2rem,5vw,3.5rem)] sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="flex flex-col gap-4">
            <BrandMask
              mark="wordmark"
              label={SITE.name}
              className="w-[clamp(7rem,26vw,9.5rem)] text-foreground"
            />
            <p className="max-w-[26ch] text-sm text-muted">{SITE.tagline}</p>
            <InstagramTrapdoor />
          </div>

          {FOOTER_NAV.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="eyebrow text-eyebrow">{group.heading}</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-[clamp(2rem,5vw,3.5rem)] flex flex-col gap-2 border-t border-line pt-5 font-mono text-micro text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {SITE.legalName}, a {SITE.parent} company
          </p>
          {/* Visible freshness date. website.md: never publish an undated page. */}
          <p>
            Updated{" "}
            <time dateTime={SITE.updated}>{formatUpdated(SITE.updated)}</time>
          </p>
        </div>
      </div>
    </footer>
  );
}
