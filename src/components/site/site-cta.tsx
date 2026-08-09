import * as React from "react";
import { AssemblingMark } from "@/components/ui/assembling-mark";
import { InstagramTrapdoor } from "@/components/ui/instagram-trapdoor";
import { Rise } from "@/components/ui/scroll-fx";
import { Seam } from "@/components/ui/seam";

/**
 * The close, and the last thing above the floor.
 *
 * `/` has always ended this way: the cat assembling out of its own shards, one
 * line, one action. Interior pages ended on `NextDoors` instead, which is a
 * continuation rather than an ending, so nine of eleven routes finished by
 * offering three more links and stopping. Worse, the mark whole appeared on
 * exactly one route, which made the site's single strongest image a thing you
 * only saw if you scrolled the homepage to the bottom.
 *
 * So the cat comes here too, and it is the reason this section exists rather
 * than a decoration on top of a button. Every other page can be paraphrased;
 * this cannot. The bands scrub home as you arrive, so the last thing a reader
 * does on any page is watch scattered pieces become one finished thing, which
 * is the entire argument the company is making, made without a sentence.
 *
 * ### The rule on the copy
 *
 * **Present tense only. Nothing here promises the future.** The first draft of
 * this section said things like "no invoice is coming" and "there never will be
 * anything to buy", which are pleasant to read and impossible to keep: this
 * company intends to sell something eventually, and a closing line that has to
 * be quietly deleted the week that happens is a lie with a delay on it.
 * `the-bar.md` treats a claim that cannot be checked as fabrication, and a
 * claim about next year cannot be checked by anyone.
 *
 * What survives that rule is anything true right now and anything permanent by
 * construction. "Nothing on this site is for sale today" is checkable. "Whatever
 * you build is yours" is a term we are bound by. "We will never charge" is
 * neither, so it is not written.
 *
 * ### One ask, or none
 *
 * `brand.md` allows one decision per screen and the site's single destination is
 * Instagram, so that is the one control. `action={false}` drops it for pages
 * that already carry the same control higher up, where the alternative is the
 * identical trapdoor twice on one page. Those pages still get the mark and the
 * line, because the close is the point, not the button.
 *
 * Ground is `--surface` against the footer's `--background`, so the close and
 * the floor read as two materials rather than one long tail. The seam on top is
 * spent, `shards={0}`, the count every page has been descending toward.
 */
export function SiteCta({
  /** The one line. Short enough to hold at display scale, specific to the page. */
  line,
  /** What follows. One or two sentences, present tense, checkable today. */
  body,
  /**
   * Whether to offer the Instagram trapdoor. Off only where the page already
   * carries it above this point.
   */
  action = true,
}: {
  line: React.ReactNode;
  body: React.ReactNode;
  action?: boolean;
}) {
  return (
    <section aria-labelledby="site-cta" className="bg-surface">
      <div className="mx-auto w-full max-w-[110rem] px-[max(1rem,4vw)] pb-[clamp(3.5rem,9vw,6rem)]">
        <Seam shards={0} />

        <div className="flex flex-col items-center text-center">
          {/* Smaller than the homepage's, which runs to 32rem. That one is the
              end of a seven-panel argument and is allowed to be the whole
              screen; this one closes a page whose job was answering a question,
              and at that size it would upstage the answer it follows. */}
          <AssemblingMark className="w-[clamp(9rem,26vw,18rem)] text-foreground" />

          <Rise
            stagger={0.1}
            y={28}
            start="top 88%"
            className="flex flex-col items-center"
          >
            <h2
              id="site-cta"
              className="mt-[clamp(1.25rem,3vw,2rem)] max-w-[20ch] font-display text-display-l text-balance text-foreground"
            >
              {line}
            </h2>

            <p className="mt-[clamp(0.875rem,2.25vw,1.375rem)] max-w-[54ch] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed text-balance text-muted">
              {body}
            </p>

            {action ? (
              <div className="mt-[clamp(1.25rem,3vw,2rem)] flex justify-center">
                <InstagramTrapdoor />
              </div>
            ) : null}
          </Rise>
        </div>
      </div>
    </section>
  );
}
