import * as React from "react";
import Link from "next/link";
import {
  type Build,
  formatCost,
  formatDuration,
  latestBuilds,
} from "@/lib/builds";

/** What every build page carries. Real promise about real structure. */
const WHAT_EVERY_BUILD_SHOWS = [
  { label: "The path", detail: "every step, and the exact prompts, verbatim" },
  { label: "Where it broke", detail: "what the model got wrong, and the tell" },
  { label: "What it cost", detail: "₹0, and the free-tier limits that keep it there" },
] as const;

function BuildRow({ build }: { build: Build }) {
  return (
    <li>
      <Link
        href={`/builds/${build.slug}`}
        className="wipe corner-cut block border-b border-line px-4 py-4 sm:px-5 sm:py-5"
      >
        <span className="flex items-baseline justify-between gap-4">
          <span className="text-balance font-display text-[clamp(0.95rem,1.6vw,1.15rem)] leading-tight font-bold text-foreground">
            {build.title}
          </span>
          <span className="shrink-0 font-mono text-data text-accent-ink tabular-nums">
            {formatDuration(build.minutes)}
          </span>
        </span>

        <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-micro text-muted">
          <span>{build.tools.join(" + ")}</span>
          <span aria-hidden="true">·</span>
          <span>{formatCost(build.cost)}</span>
          {!build.codeWritten ? (
            <>
              <span aria-hidden="true">·</span>
              <span>no code written</span>
            </>
          ) : null}
        </span>
      </Link>
    </li>
  );
}

/**
 * Zero state.
 *
 * Not a skeleton and not placeholder rows: it states what a build page will
 * contain, which is true information the reader can act on. When the first
 * build ships this is replaced by rows, not edited.
 */
function NoBuildsYet() {
  return (
    <div className="border border-line bg-surface p-[clamp(1.25rem,3vw,2rem)]">
      <p className="font-display text-[clamp(1rem,1.8vw,1.25rem)] leading-snug font-bold text-foreground">
        First builds land this month.
      </p>
      <p className="mt-2 max-w-[38ch] text-sm text-muted">
        Nothing here is a mockup. A build appears once it is shipped, reachable
        and free to run.
      </p>

      <dl className="mt-[clamp(1.25rem,3vw,1.75rem)] flex flex-col gap-3">
        {WHAT_EVERY_BUILD_SHOWS.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-1 border-t border-line pt-3 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <dt className="eyebrow text-eyebrow shrink-0 sm:w-[9.5rem]">
              {item.label}
            </dt>
            <dd className="font-mono text-micro text-muted">{item.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function BuildIndex({ count = 3 }: { count?: number }) {
  const builds = latestBuilds(count);

  if (builds.length === 0) return <NoBuildsYet />;

  return (
    <div>
      <ul className="border-t border-line">
        {builds.map((build) => (
          <BuildRow key={build.slug} build={build} />
        ))}
      </ul>

      <Link
        href="/builds"
        className="group mt-5 inline-flex items-baseline gap-2 font-mono text-data text-accent-ink uppercase"
      >
        All builds
        <span aria-hidden="true" className="slash-glyph">
          \
        </span>
      </Link>
    </div>
  );
}
