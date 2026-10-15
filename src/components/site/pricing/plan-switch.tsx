"use client";

import * as React from "react";

export type SwitchTab = {
  /** Panel id and URL fragment: `/pricing#school` opens the school panel. */
  id: string;
  label: string;
  /** The cheapest way in, so the switch itself carries a price. */
  detail: string;
};

/**
 * Three buyers, one page, one panel showing at a time.
 *
 * Every panel is rendered on the server and stays in the document. The inactive
 * ones carry `hidden`, which removes them from view and from the accessibility
 * tree but not from the HTML, so a crawler or an answer engine reading the page
 * source gets every plan whichever tab a person happens to be on. That is the
 * whole reason this is tabs over separate routes: the user wanted every plan on
 * one page, and one page is also the strongest single document to cite.
 *
 * College is first and open by default. A fragment can open any other panel,
 * and a fragment naming a plan (`#school-deep-end`) opens the panel that holds
 * it and scrolls to the plan, so a link to one tier from anywhere works.
 *
 * Keyboard follows the WAI-ARIA tabs pattern with automatic activation: arrows
 * move and select, Home and End jump, and only the selected tab is in the tab
 * order.
 */
export function PlanSwitch({
  tabs,
  children,
}: {
  tabs: readonly SwitchTab[];
  /** One panel per tab, in the same order. */
  children: readonly React.ReactNode[];
}) {
  const [active, setActive] = React.useState(0);
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    function openFromHash() {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!hash) return;

      const direct = tabs.findIndex((tab) => tab.id === hash);
      if (direct >= 0) {
        setActive(direct);
        return;
      }

      const target = document.getElementById(hash);
      const panel = target?.closest<HTMLElement>("[data-plan-panel]");
      if (!target || !panel) return;

      setActive(Number(panel.dataset.planPanel));
      /* The panel is still `hidden` in this frame, and a hidden target has no
         box to scroll to. One frame later it does. */
      requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    }

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [tabs]);

  function select(index: number, focus = false) {
    setActive(index);
    /* `replaceState`, not `location.hash`: assigning the hash would jump the
       page to the panel and add a history entry per click. */
    window.history.replaceState(null, "", `#${tabs[index].id}`);
    if (focus) tabRefs.current[index]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;

    if (next === null) return;
    event.preventDefault();
    select(next, true);
  }

  return (
    <div>
      <div className="mx-auto w-full max-w-[110rem] px-[max(1rem,4vw)]">
        <div
          role="tablist"
          aria-label="Show plans for"
          className="grid grid-cols-3 border-y border-line"
        >
          {tabs.map((tab, i) => {
            const selected = i === active;
            return (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[i] = node;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={tab.id}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(event) => onKeyDown(event, i)}
                className={`wipe group relative flex min-h-11 flex-col items-start gap-1 px-[clamp(0.5rem,2vw,1.5rem)] py-[clamp(0.875rem,2.2vw,1.375rem)] text-left not-first:border-l not-first:border-line ${
                  selected ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                <span className="font-display text-[clamp(0.9375rem,2vw,1.375rem)] leading-tight font-bold">
                  {tab.label}
                </span>
                <span className="font-mono text-micro text-pretty">{tab.detail}</span>

                {/* The nav's own hover rule, held drawn while selected. */}
                <span
                  aria-hidden="true"
                  className="nav-rule absolute inset-x-[clamp(0.5rem,2vw,1.5rem)] bottom-0 h-[3px] bg-accent-ink"
                />
              </button>
            );
          })}
        </div>
      </div>

      {children.map((panel, i) => (
        <div
          key={tabs[i].id}
          id={tabs[i].id}
          role="tabpanel"
          aria-labelledby={`tab-${tabs[i].id}`}
          data-plan-panel={i}
          hidden={i !== active}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
