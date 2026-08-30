"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MotionConfig,
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useMediaQuery } from "@/components/ui/motion-provider";
import { ShardTile } from "@/components/ui/shard-tile";

/**
 * The build wall: three rows of tiles counter-scrolling under a tilted plane.
 *
 * Adapted from Aceternity's `HeroParallax`. Four deliberate departures from the
 * original, each forced by something already true in this repo:
 *
 * 1. **`motion/react`, not `framer-motion`.** They are the same library; the
 *    package was renamed at v11. `motion@12` is already a dependency, and
 *    installing `framer-motion` alongside it ships two copies of the same
 *    React runtime.
 * 2. **The resting state is handled in CSS, not in JavaScript.** The rest of
 *    the site guarantees that the state sitting in the DOM is the finished
 *    one, so a disabled or failed animation can never hide content. A JS
 *    branch cannot deliver that: the server has no media query to read and no
 *    way to know whether its own bundle will arrive, so the first paint would
 *    carry `rotateX(15deg)` and `opacity: 0.2` regardless. The `.wall__*`
 *    classes in `globals.css` collapse the shell for reduced-motion readers
 *    and for unscripted ones, during parse, before hydration exists.
 * 3. **Tiles draw themselves.** `thumbnail` stays in the type for the day real
 *    build screenshots exist, but it must be a local path: the CSP in
 *    `next.config.ts` pins `img-src` to `'self' data: blob:`, so a remote
 *    thumbnail is blocked at runtime and `next/image` would need a
 *    `remotePatterns` entry on top of that. Tiles with no thumbnail render
 *    `ShardTile`, which is the mark's own geometry rather than a placeholder.
 * 4. **`link` is optional.** `landing-header.tsx` already establishes the rule:
 *    a control that 404s costs more trust than a missing one. An unfilled slot
 *    links nowhere and is hidden from assistive technology; the page states the
 *    count in text instead.
 *
 * The scroll maths, the spring config and the row layout are the original's,
 * unchanged, except that the horizontal travel scales down on a phone: 1000px
 * of drift is most of a desktop viewport and roughly three of a 360px one.
 */

export type ParallaxTile = {
  /** Shown on the card. For an unfilled slot this is the slot's own label. */
  title: string;
  /** Mono line under the title. Facts only, never a claim. */
  meta?: string;
  /** Omitted when there is nothing to point at yet. */
  link?: string;
  /** Local path only. See note 3 above. */
  thumbnail?: string;
  /** An unfilled slot: decorative, unlinked, and hidden from screen readers. */
  empty?: boolean;
};

/**
 * `skipInitialAnimation` is not tuning, it is a correctness flag.
 *
 * Browsers restore scroll position on reload. Without it, every spring here
 * starts at the value its source had on the first frame and then *animates* to
 * the value the restored scroll actually implies, so reloading halfway down
 * the page throws the wall a thousand pixels across the screen before it
 * settles. With it, the first source change is a jump and every scroll update
 * after that springs exactly as before.
 */
const SPRING = {
  stiffness: 300,
  damping: 30,
  bounce: 100,
  skipInitialAnimation: true,
} as const;


export function HeroParallax({
  tiles,
  header,
}: {
  /** Fifteen fills the three rows of five. Fewer simply leaves a row short. */
  tiles: readonly ParallaxTile[];
  /** The page's own h1 and answer block. Rendered outside the tilted plane. */
  header?: React.ReactNode;
}) {
  const firstRow = tiles.slice(0, 5);
  const secondRow = tiles.slice(5, 10);
  const thirdRow = tiles.slice(10, 15);

  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* The server snapshot is `false`, so both sides render the desktop range.
     That is safe here in a way it is not for the reduced-motion branch: every
     one of these transforms evaluates identically at `scrollYProgress === 0`
     whatever the range says, so the hydrated markup matches regardless. */
  const narrow = useMediaQuery("(width < 48rem)");
  const drift = narrow ? 260 : 1000;
  const initialTranslateY = narrow ? 40 : -700;

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, drift]),
    SPRING
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -drift]),
    SPRING
  );

  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), SPRING);
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    SPRING
  );
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), SPRING);

  /* Rests at 0, not at the original's +500. */
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [initialTranslateY, 0]),
    SPRING
  );

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={ref}
        className="wall__shell relative flex flex-col self-auto overflow-x-clip overflow-y-visible py-[clamp(1.5rem,5vw,10rem)] antialiased"
      >
        <div className="relative z-10 bg-linear-to-b from-background from-45% via-background/95 to-transparent pb-6 md:pb-0">
          {header}
        </div>

        <motion.div
          className="wall__plane mt-4 pb-0 md:mt-0 md:pb-[clamp(6rem,14vw,16rem)]"
          style={{ rotateX, rotateZ, translateY, opacity }}
        >
          <ParallaxRow tiles={firstRow} translate={translateX} reverse />
          <ParallaxRow tiles={secondRow} translate={translateXReverse} />
          <ParallaxRow tiles={thirdRow} translate={translateX} reverse last />
        </motion.div>
      </div>
    </MotionConfig>
  );
}

/**
 * One row. Reversed rows read right to left, which is what makes two rows
 * sharing a single `translateX` look like they are moving against each other.
 *
 * `gap` rather than the original's `space-x-reverse` pairing: it produces the
 * same spacing in both directions without a second class to keep in sync.
 */
function ParallaxRow({
  tiles,
  translate,
  reverse = false,
  last = false,
}: {
  tiles: readonly ParallaxTile[];
  translate: MotionValue<number>;
  reverse?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`wall__row flex gap-[clamp(0.75rem,2.5vw,5rem)] ${
        reverse ? "flex-row-reverse" : "flex-row"
      } ${last ? "" : "mb-[clamp(0.75rem,2.5vw,5rem)]"}`}
    >
      {tiles.map((tile) => (
        <TileCard key={tile.title} tile={tile} translate={translate} />
      ))}
    </div>
  );
}

export function TileCard({
  tile,
  translate,
}: {
  tile: ParallaxTile;
  translate: MotionValue<number>;
}) {
  const art = tile.thumbnail ? (
    <Image
      src={tile.thumbnail}
      width={600}
      height={480}
      className="absolute inset-0 h-full w-full object-cover object-left-top"
      alt={tile.title}
    />
  ) : (
    <ShardTile seed={tile.title} className="absolute inset-0 h-full w-full" />
  );

  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      /* Unfilled slots are pure atmosphere. Announcing fifteen of them would
         bury the one sentence on this page that carries the real count. */
      aria-hidden={tile.empty ? "true" : undefined}
      className="wall__tile group/tile relative h-[clamp(9rem,26vw,24rem)] w-[clamp(13.5rem,38vw,30rem)] shrink-0 border border-line"
    >
      {tile.link ? (
        <Link href={tile.link} className="block h-full w-full">
          {art}
        </Link>
      ) : (
        art
      )}

      {/* The label sits over the art rather than inside the link so an unfilled
          slot can carry one without becoming a control. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-linear-to-t from-background/95 via-background/80 to-transparent px-3 pt-6 pb-2.5 sm:gap-1 sm:px-4 sm:pt-10 sm:pb-4">
        <span
          className={`font-display text-[clamp(0.75rem,2.5vw,1rem)] leading-tight font-bold line-clamp-2 ${
            tile.empty ? "text-muted" : "text-foreground"
          }`}
        >
          {tile.title}
        </span>
        {tile.meta ? (
          <span className="font-mono text-[clamp(0.6rem,1.8vw,0.75rem)] text-muted line-clamp-1">
            {tile.meta}
          </span>
        ) : null}
      </div>

      {/* Filled tiles get the accent corner. An empty slot does not: the corner
          is the mark claiming a finished thing. */}
      {tile.empty ? null : (
        <span aria-hidden="true" className="corner-cut absolute inset-0" />
      )}
    </motion.div>
  );
}
