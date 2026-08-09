import type { Metadata } from "next";
import Link from "next/link";
import { AlgobicLockup } from "@/components/ui/algobic-lockup";
import { MaskThemeToggle } from "@/components/ui/mask-view-transition-theme-toggle";
import { PixelPong } from "@/components/ui/pixel-pong";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "404: Not shipped",
  description: "That page doesn't exist on ALGOBIC.",
  robots: { index: false, follow: true },
};

/**
 * A dead end that hands you something to do.
 *
 * The 404 is a pong board: the heading is traced into bricks, the ball takes
 * them apart, and the line under it changes once the board is clear. Everything
 * that carries meaning is DOM, not canvas, so a reader who cannot play it loses
 * nothing.
 */
export default function NotFound() {
  return (
    <main className="relative isolate grid min-h-[100svh] w-full grid-rows-[auto_1fr_auto] gap-4 overflow-hidden px-[max(1rem,4vw)] py-[max(0.75rem,2.5vh)]">
      <header className="flex items-start justify-end">
        <MaskThemeToggle />
      </header>

      <PixelPong />

      <footer className="flex flex-col items-center gap-[clamp(1rem,3.5vh,2rem)] pb-[max(0.5rem,1.5vh)]">
        <Link
          href="/"
          className="group flex flex-col items-center gap-[clamp(0.6rem,2vh,1rem)]"
        >
          <AlgobicLockup className="w-[min(50vw,220px)] text-foreground transition-opacity group-hover:opacity-80" />
          {/* accent-ink, not accent: at this size --accent is 2.44:1 on paper. */}
          <span className="pl-[0.42em] font-display text-[clamp(0.55rem,1.7vw,0.72rem)] font-bold tracking-[0.42em] text-accent-ink">
            BACK TO START
          </span>
        </Link>

        <p className="text-center text-[0.7rem] tracking-[0.2em] text-muted uppercase">
          {SITE.tagline}
        </p>
      </footer>
    </main>
  );
}
