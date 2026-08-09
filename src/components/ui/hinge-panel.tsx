import * as React from "react";
import { Seam } from "@/components/ui/seam";

/**
 * One screen of the hinge stack.
 *
 * A Server Component with no JavaScript of its own. It renders the markup and
 * marks the two elements the stack needs to find: the panel, which gets pinned,
 * and the leaf inside it, which gets rotated. Everything animated is applied
 * from `HingeStack`, so the resting DOM this produces is already the finished
 * state and nothing here can fail into invisible content.
 *
 * The panel is transparent and the leaf carries the ground. That is what makes
 * the effect legible: the wedge the rotation opens shows the previous panel
 * through it rather than the page background.
 */

type Ground = "paper" | "surface" | "flip";

const GROUND: Record<Ground, string> = {
  paper: "bg-background",
  surface: "bg-surface",
  /* The opposite theme's palette, declared in globals.css as a pair of selector
     lists: a light reader gets the dark values verbatim and a dark reader gets
     the light ones. One inverted screen, no third palette, and not one colour
     pairing that has not already been measured. */
  flip: "ground-flip bg-background text-foreground",
};

export function HingePanel({
  children,
  title,
  hinge = 0,
  shards,
  ground = "paper",
  align = "center",
  backdrop,
  underHeader = false,
}: {
  children: React.ReactNode;
  /** Renders the section's h2. Omitted on the opening screen, which has an h1. */
  title?: React.ReactNode;
  /** Degrees of arrival. 0 means the panel slides in flat. */
  hinge?: number;
  /** Seam cluster on the leading edge. Omit the prop for no seam at all. */
  shards?: number;
  ground?: Ground;
  /** `between` gives the opening screen its top-and-bottom composition. */
  align?: "center" | "between";
  /** Full bleed, behind the content. The shatter field, on one panel. */
  backdrop?: React.ReactNode;
  /**
   * Subtract the sticky header. Only the opening panel needs this: every panel
   * after it is covered by the header rather than pushed down by it, so they
   * are a full screen each.
   *
   * 4.25rem is the bar's real height, a 40px control plus its padding.
   * Subtracting a round 4rem leaves the panel four pixels taller than the space
   * under the header, which is exactly enough to clip its last line.
   */
  underHeader?: boolean;
}) {
  return (
    /* `overflow-clip`, never `overflow-hidden`. Hidden creates a scroll
       container, and a scroll container freezes every `view()` timeline inside
       it: `.reveal` and `.draw-scroll` would sit at progress 0 forever, and for
       `.reveal` that means permanently invisible text. `clip` clips the rotated
       leaf without becoming a scroller. */
    <section
      data-hinge-panel
      data-hinge={hinge}
      className="relative isolate overflow-clip"
    >
      <div
        data-hinge-leaf
        className={`relative flex flex-col ${
          underHeader ? "min-h-[calc(100svh-4.25rem)]" : "min-h-[100svh]"
        } ${GROUND[ground]}`}
      >
        {backdrop ? (
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            {backdrop}
          </div>
        ) : null}

        {/* Full bleed rather than inside the measure. This is the panel's
            leading edge, and an edge that stops short of the edge is a rule. */}
        {shards === undefined ? null : (
          <div className="px-[max(1rem,4vw)]">
            <Seam shards={shards} />
          </div>
        )}

        <div className="mx-auto flex w-full max-w-[110rem] flex-1 flex-col px-[max(1rem,4vw)] pb-[clamp(1.5rem,4vw,3rem)]">
          {/* The eyebrow stays pinned under the seam it belongs to. Centring it
              with the content would float the section's own name into the
              middle of the screen, which reads as a stray line rather than as a
              label. */}
          {title ? (
            <h2 className="eyebrow text-eyebrow mb-[clamp(1rem,2.5vw,1.5rem)] shrink-0">
              {title}
            </h2>
          ) : null}

          {/* A section that wants the whole screen takes it by putting `flex-1`
              on its own root: this is a flex column, so it stretches and the
              centring below stops applying. Sections that are happy at their
              natural height stay centred in what is left. Panels are one screen
              each, so anything that does neither leaves a void under its own
              name, which is what the first pass of this page looked like. */}
          {/* `between` is a desktop composition and only a desktop one. A phone
              screen is tall and narrow, so the same content that fills a laptop
              corner to corner occupies about half a phone, and pushing its two
              halves to the extremes puts the whole difference in one gulf down
              the middle. Below `lg` every panel centres what it has and the
              leftover height becomes even air top and bottom. */}
          <div
            className={`flex flex-1 flex-col justify-center ${
              align === "between" ? "lg:justify-between" : ""
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
