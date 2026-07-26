import { AlgobicLockup } from "@/components/ui/algobic-lockup";
import { GlitchField } from "@/components/ui/glitch-field";
import { InstagramTrapdoor } from "@/components/ui/instagram-trapdoor";
import { MaskThemeToggle } from "@/components/ui/mask-view-transition-theme-toggle";
import { SITE } from "@/lib/site";

export default function Home() {
  return (
    <main className="relative isolate grid min-h-[100svh] w-full grid-rows-[auto_1fr_auto] gap-4 overflow-hidden px-[max(1rem,4vw)] py-[max(0.75rem,2.5vh)] select-none">
      <GlitchField className="-z-10" />

      <header className="flex items-start justify-end">
        <MaskThemeToggle />
      </header>

      <div className="flex flex-col items-center justify-center text-center">
        {/* The heading is carried visually by the lockup, so the text version
            is here for screen readers and crawlers. */}
        <h1 className="sr-only">{SITE.title}</h1>
        <p className="sr-only">{SITE.description}</p>

        {/* Bounded by the short edge as well, so it survives landscape phones
            and 600px-tall hub displays. */}
        <AlgobicLockup className="w-[min(94vw,820px,86svh)] text-foreground" />

        <p className="mt-[clamp(1.75rem,6vh,3.5rem)] pl-[0.42em] font-display text-[clamp(0.65rem,2vw,0.95rem)] font-bold tracking-[0.42em] text-accent">
          COMING SOON
        </p>
      </div>

      <footer className="flex justify-center pb-[max(0.5rem,1.5vh)]">
        <InstagramTrapdoor />
      </footer>
    </main>
  );
}
