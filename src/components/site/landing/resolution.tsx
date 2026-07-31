import * as React from "react";
import { AssemblingMark } from "@/components/ui/assembling-mark";
import { InstagramTrapdoor } from "@/components/ui/instagram-trapdoor";
import { Rise } from "@/components/ui/scroll-fx";

/**
 * Resolution.
 *
 * The page opens dispersed, with the shatter field live behind a headline set
 * off-axis, and it closes here: the only centred block, the only full-bleed
 * change of ground, and the mark whole for the first and last time. Scrolling
 * the page is the act of putting it back together.
 *
 * One action, and it is the only action anywhere on the site. `brand.md`: one
 * decision per screen, never two CTAs. Instagram is the single destination that
 * exists today, so it is the single destination offered. The copy carries the
 * instruction in words; the glyph only confirms it.
 */
export function Resolution() {
  return (
    <section className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-[110rem] flex-col items-center px-[max(1rem,4vw)] py-[clamp(3rem,9vw,6.5rem)] text-center">
        <h2 className="eyebrow text-eyebrow">Where this goes</h2>

        {/* Big enough to be the thing you are looking at rather than a mark
            signing off a block. This is the only place the animal appears
            whole and it is the last thing on the page; at 17rem it read as a
            footer logo, which is the opposite of an arrival. */}
        <AssemblingMark className="mt-[clamp(1.75rem,4.5vw,3.5rem)] w-[clamp(13rem,42vw,32rem)] text-foreground" />

        <Rise stagger={0.12} y={30} start="top 88%" className="flex flex-col items-center">
        <p className="mt-[clamp(1.75rem,4.5vw,3rem)] max-w-[19ch] font-display text-display-l text-balance text-foreground">
          The thing you scrolled past is still buildable.
        </p>

        <p
          className="mt-[clamp(1rem,2.5vw,1.5rem)] max-w-[52ch] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-balance text-muted"
        >
          Every build gets published the day it ships, with the exact prompts,
          where it broke, what it cost and a live URL. Instagram is where it
          gets announced first.
        </p>

        <div className="mt-[clamp(1.25rem,3vw,2rem)] flex justify-center">
          <InstagramTrapdoor />
        </div>
        </Rise>
      </div>
    </section>
  );
}
