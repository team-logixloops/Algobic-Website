import * as React from "react";
import { MARKS, MaskLayer } from "@/components/ui/brand-mask";

/**
 * The mark, assembling.
 *
 * `ALGOBIC` is drawn as a cat coming apart into horizontal bars, leftward. Read
 * the other way it is bars gathering into an animal, which is the company in
 * one gesture: scattered attention becoming one finished thing.
 *
 * So the artwork is sliced into horizontal bands and each band starts displaced
 * along its own row. The first frame of the scroll is the logo as drawn. The
 * last frame is the animal whole. It happens once, at the bottom of the page,
 * and nothing else on the site moves like this.
 *
 * Each band is a clipping window holding a full-size copy of the mark offset to
 * show only that band's row. The window never moves; the copy inside it does,
 * on `translate3d` alone, so the whole sequence is compositor work with no
 * layout and no repaint.
 *
 * Cat only, deliberately. The wordmark was tried and cut: at 11.5:1 its bands
 * come out around two pixels tall, and shearing those sideways destroys the
 * letterforms rather than dissolving them. The gesture needs a shape with
 * height, so there is exactly one place on the site it can live.
 *
 * When `animation-timeline` is unsupported, or the reader has asked for reduced
 * motion, the `.assemble` rule never applies and every band sits at its natural
 * position: the mark is simply whole. A failure here can only ever leave the
 * artwork finished, never broken.
 */

/**
 * Horizontal displacement per band, as a percentage of the mark's width, from
 * the top of the artwork down.
 *
 * Negative because the mark's own shards stream left. Hand-set rather than
 * generated: the pattern has to read as the drawn dissolve, which is uneven
 * (long trails off the ears and tail, almost none across the body), and random
 * values give an even scatter that reads as a glitch instead.
 *
 * Fourteen bands over the cat's 1.6:1 box puts each one on a comfortable few
 * pixels at every size the mark is used.
 */
const BANDS = [
  "-46%",
  "-18%",
  "-72%",
  "-9%",
  "-38%",
  "-61%",
  "-14%",
  "-29%",
  "-55%",
  "-7%",
  "-43%",
  "-24%",
  "-67%",
  "-12%",
] as const;

export function AssemblingMark({ className = "" }: { className?: string }) {
  const { ink, accent, aspect } = MARKS.cat;
  const band = 100 / BANDS.length;

  return (
    <div
      aria-hidden="true"
      className={`assemble-root relative ${className}`}
      style={{ aspectRatio: String(aspect) }}
    >
      {BANDS.map((from, i) => (
        <div
          key={from + i}
          className="absolute left-0 w-full overflow-hidden"
          style={{ top: `${i * band}%`, height: `${band}%` }}
        >
          {/* Sized to the whole mark and pulled up by i bands, so this window
              shows row i and nothing else. Percentages resolve against the
              band, hence the 100 x band-count height. */}
          <div
            className="assemble absolute left-0 w-full"
            style={
              {
                height: `${BANDS.length * 100}%`,
                top: `${i * -100}%`,
                "--from": from,
              } as React.CSSProperties
            }
          >
            <MaskLayer src={ink} color="currentColor" />
            <MaskLayer src={accent} color="var(--accent)" />
          </div>
        </div>
      ))}
    </div>
  );
}
