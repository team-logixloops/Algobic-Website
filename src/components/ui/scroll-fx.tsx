"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/components/ui/motion-provider";

/**
 * The scroll vocabulary, in four pieces.
 *
 * Every one of these is a thin wrapper that animates its own children and does
 * nothing else, so a section reads as markup rather than as a timeline. They
 * all share the same contract: under reduced motion the effect never
 * initialises and the children render exactly as authored, so the resting state
 * in the DOM is always the finished state. Nothing here can leave content
 * invisible if it fails.
 */

function useGsap(
  fn: (root: HTMLElement) => void,
  ref: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList = []
) {
  React.useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => fn(root), root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Children rise into place as the block crosses the viewport.
 *
 * `stagger` is per direct child, so a section hands this its own rows and gets
 * a sequence without knowing anything about how it is produced.
 */
export function Rise({
  children,
  stagger = 0.08,
  y = 44,
  start = "top 82%",
  select,
  className = "",
}: {
  children: React.ReactNode;
  stagger?: number;
  y?: number;
  start?: string;
  /**
   * Selector for what should stagger. Defaults to direct children, which is
   * wrong whenever the thing that needs to stagger is a level down: a list
   * inside a wrapper would otherwise animate as one block.
   */
  select?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGsap((root) => {
    const found = select ? Array.from(root.querySelectorAll(select)) : [];
    const targets = found.length
      ? found
      : root.children.length
        ? Array.from(root.children)
        : [root];
    gsap.from(targets, {
      y,
      opacity: 0,
      duration: 1.1,
      ease: "expo.out",
      stagger,
      scrollTrigger: { trigger: root, start, once: true },
    });
  }, ref);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Depth. The element drifts against the scroll while its section is on screen.
 *
 * `speed` is a fraction of the travel: 0.2 means it moves a fifth as far as the
 * page does, so it lags. Negative leads instead.
 */
export function Parallax({
  children,
  speed = 0.2,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGsap((root) => {
    gsap.fromTo(
      root,
      { yPercent: -speed * 50 },
      {
        yPercent: speed * 50,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }, ref, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * A rule that draws itself along the scroll rather than on a timer.
 *
 * Scrubbed on purpose: the seam is the site's signature and the reader should
 * feel that they are the one drawing it.
 */
export function DrawRule({ className = "" }: { className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);

  useGsap((root) => {
    gsap.fromTo(
      root,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 95%",
          end: "top 55%",
          scrub: true,
        },
      }
    );
  }, ref);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`block origin-left ${className}`}
    />
  );
}

/**
 * Pin a section and scrub a 0-to-1 progress value through it.
 *
 * The child is a function of that progress, applied by the caller to whatever
 * it wants: a scale, a clip, a band offset. Kept generic because the two places
 * this page pins are doing completely different things with the same mechanism.
 *
 * `distance` is how many viewport heights of scroll the pin consumes.
 */
export function PinScrub({
  children,
  distance = 1,
  onProgress,
  className = "",
}: {
  children: React.ReactNode;
  distance?: number;
  onProgress: (root: HTMLElement, progress: number) => void;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  /* The trigger is created once, so it has to read the current callback
     indirectly. Assigning the ref in an effect rather than during render keeps
     render pure; the trigger cannot fire before effects have run, so it never
     sees the initial value. */
  const cb = React.useRef(onProgress);
  React.useEffect(() => {
    cb.current = onProgress;
  }, [onProgress]);

  useGsap((root) => {
    ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: `+=${distance * 100}%`,
      pin: true,
      pinSpacing: true,
      scrub: true,
      onUpdate: (self) => cb.current(root, self.progress),
      onRefresh: (self) => cb.current(root, self.progress),
    });
  }, ref, [distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
