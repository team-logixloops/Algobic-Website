import type { Metadata } from "next";
import Link from "next/link";
import { AlgobicLockup } from "@/components/ui/algobic-lockup";
import { GlitchField } from "@/components/ui/glitch-field";
import { MaskThemeToggle } from "@/components/ui/mask-view-transition-theme-toggle";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "404 — Not shipped",
  description: "That page doesn't exist on ALGOBIC.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="relative isolate grid min-h-[100svh] w-full grid-rows-[auto_1fr_auto] gap-4 overflow-hidden px-[max(1rem,4vw)] py-[max(0.75rem,2.5vh)] select-none">
      <GlitchField className="-z-10" />

      <header className="flex items-start justify-end">
        <MaskThemeToggle />
      </header>

      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="font-display text-[clamp(3.5rem,16vw,9rem)] leading-none font-bold tracking-[0.08em] text-foreground">
          404
        </h1>

        <p className="mt-[clamp(1rem,3vh,1.75rem)] max-w-[32ch] text-[clamp(0.8rem,2.6vw,1rem)] text-muted">
          This page hasn&apos;t been shipped.
        </p>

        <Link
          href="/"
          className="group mt-[clamp(1.5rem,5vh,2.75rem)] flex flex-col items-center gap-[clamp(0.75rem,2.5vh,1.25rem)]"
        >
          <AlgobicLockup className="w-[min(58vw,260px)] text-foreground transition-opacity group-hover:opacity-80" />
          <span className="pl-[0.42em] font-display text-[clamp(0.55rem,1.7vw,0.72rem)] font-bold tracking-[0.42em] text-accent">
            BACK TO START
          </span>
        </Link>
      </div>

      <footer className="flex justify-center pb-[max(0.5rem,1.5vh)] text-center text-[0.7rem] tracking-[0.2em] text-muted uppercase">
        {SITE.tagline}
      </footer>
    </main>
  );
}
