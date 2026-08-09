import * as React from "react";
import { Rise } from "@/components/ui/scroll-fx";
import { WHY_NOW } from "@/lib/evidence";

/**
 * The only tabular block on the page, and the only one set in the data face.
 *
 * Every other section is Orbitron and Inter. This one is Plex Mono at display
 * size, which gives it a texture nothing else here has and marks it as
 * measured rather than argued.
 *
 * The last row is the design decision worth defending. `63-84%` is the most
 * persuasive figure this brand owns and neither of its two published sources
 * states a method, so it is rendered in muted with the gap named out loud. A
 * page whose entire product is verified work does not get to quote a number it
 * cannot stand behind and hope nobody checks.
 */
export function WhyNow() {
  return (
    /* Statement beside the evidence rather than above it, once there is room
       for two columns.

       Stacked, this section came out about 250px taller than the screen it now
       owns, and a panel taller than its screen gets its last row eaten by the
       next panel closing over it. The last row here is the one that admits its
       own source has no method, which is the single row that most has to be
       read. Sideways it fits, and a display line anchored against a column of
       data reads as evidence being presented rather than as a heading with a
       table under it. */
    <div className="grid gap-x-[clamp(2rem,5vw,4rem)] gap-y-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
      {/* Not `text-display-l`. At 48px the word "disappeared." is 340px wide on
          its own, which overran the column and collided with the figures beside
          it, and it was competing with 38px mono numerals for the same
          attention. This line supports the evidence rather than heading it: the
          panel's own name is the eyebrow above. */}
      <p className="max-w-[18ch] font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.08] font-bold tracking-[-0.01em] text-balance text-foreground">
        The requirement disappeared.
      </p>

      {/* One trigger for the whole table: the rows land in sequence as the
          block arrives rather than each waiting for its own turn, so it reads
          as a table being printed rather than as five separate reveals. */}
      <Rise
        stagger={0.09}
        y={34}
        select="[data-row]"
        className="min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2"
      >
        <dl className="border-b border-line">
        {WHY_NOW.map((row) => {
          const uncertain = row.confidence !== "verified";

          return (
            <div
              key={row.figure}
              data-row
              className="grid gap-x-[clamp(1rem,2.5vw,2rem)] gap-y-2 border-t border-line py-[clamp(0.75rem,1.6vw,1.125rem)] sm:grid-cols-[minmax(6.5rem,9rem)_minmax(0,1fr)] lg:grid-cols-[9.5rem_minmax(0,1fr)_13.5rem]"
            >
              {/* Mono at display size, tabular so the column holds a straight
                  left edge whatever the digits are. Muted on the row that has
                  not earned full weight. */}
              <dt
                className={`font-mono text-[clamp(1.5rem,3.4vw,2.375rem)] leading-none font-medium tabular-nums ${
                  uncertain ? "text-muted" : "text-foreground"
                }`}
              >
                {row.figure}
              </dt>

              <dd className="min-w-0">
                <p
                  className={`max-w-[46ch] text-[clamp(0.9375rem,1.35vw,1.0625rem)] leading-relaxed ${
                    uncertain ? "text-muted" : "text-foreground"
                  }`}
                >
                  {row.claim}
                </p>

                {row.caveat ? (
                  <p className="mt-[clamp(0.625rem,1.5vw,0.875rem)] max-w-[52ch] font-mono text-micro leading-relaxed text-muted">
                    {/* The only accent in the table, spent on the admission
                        rather than on the claim. */}
                    <span className="text-accent-ink">No published method.</span>{" "}
                    {row.caveat}
                  </p>
                ) : null}
              </dd>

              {/* Provenance gets the third column once there is room for one:
                  it is the reason to believe the row, so it sits at the same
                  level as the row rather than tucked inside it. Below that it
                  is pinned to column two, under the claim it belongs to.
                  Without the explicit `col-start-2` it auto-places into the
                  figure column and wraps to three lines in a 9rem gutter. */}
              {/* Broken onto two lines on purpose rather than left to wrap.
                  Set as one run it came to 232px in this face at this tracking,
                  overran a 13.5rem column and broke between "30 Jul" and
                  "2026", which reads as a layout accident. Who, then when. */}
              <dd className="font-mono text-micro text-muted sm:col-start-2 lg:col-start-3 lg:text-right">
                <span className="lg:block">{row.source ?? "At source"}</span>{" "}
                <span className="lg:block">verified {row.asOf}</span>
              </dd>
            </div>
          );
        })}
        </dl>
      </Rise>

      {/* Placed under the statement it concludes rather than under the table,
          so the left column reads top to bottom as claim then verdict and the
          right column is nothing but the evidence in between. */}
      <p className="max-w-[26ch] font-display text-[clamp(1.0625rem,1.8vw,1.375rem)] leading-snug font-bold text-balance text-foreground lg:col-start-1 lg:row-start-2 lg:self-end">
        The tools solved capability. Nobody solved activation.
      </p>
    </div>
  );
}
