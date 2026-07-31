import * as React from "react";
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
    <section className="mx-auto max-w-[110rem] px-[max(1rem,4vw)]">
      <h2 className="eyebrow text-eyebrow">Why now</h2>

      <p className="reveal mt-[clamp(1.25rem,3vw,2rem)] max-w-[18ch] font-display text-display-l text-balance text-foreground">
        The requirement disappeared.
      </p>

      <dl className="mt-[clamp(2rem,5vw,3.5rem)] border-b border-line">
        {WHY_NOW.map((row, i) => {
          const uncertain = row.confidence !== "verified";

          return (
            <div
              key={row.figure}
              className="reveal grid gap-x-[clamp(1rem,3vw,2.5rem)] gap-y-3 border-t border-line py-[clamp(1.25rem,3vw,2rem)] sm:grid-cols-[minmax(6.5rem,9rem)_minmax(0,1fr)] lg:grid-cols-[10rem_minmax(0,1fr)_16rem]"
              style={{ "--r": `${2 + i * 2}%` } as React.CSSProperties}
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
              <dd className="font-mono text-micro text-muted sm:col-start-2 lg:col-start-3 lg:text-right">
                {row.source ? (
                  <>
                    {row.source} <span aria-hidden="true">·</span> verified{" "}
                    {row.asOf}
                  </>
                ) : (
                  <>
                    Verified at source <span aria-hidden="true">·</span>{" "}
                    {row.asOf}
                  </>
                )}
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="reveal mt-[clamp(1.5rem,4vw,2.5rem)] max-w-[42ch] font-display text-[clamp(1.0625rem,2vw,1.5rem)] leading-snug font-bold text-balance text-foreground">
        The tools solved capability. Nobody solved activation.
      </p>
    </section>
  );
}
