"use client";

import * as React from "react";
import GlassFolder, {
  type ArtRecipe,
  type FolderFile,
} from "@/components/ui/glass-folder-cards";

export type PlanFolder = {
  /** Panel id and URL fragment: `/pricing#school` shows the school plans. */
  id: string;
  label: string;
  /** The folder's second line: how many plans, and the cheapest way in. */
  meta: string;
  tone: "light" | "dark";
  art: ArtRecipe;
  seed: number;
  /** One file per plan. `href` is the plan's fragment. */
  files: FolderFile[];
};

/** Fixed rather than fluid: the folder draws at a set size and scales inside. */
const FOLDER_WIDTH = 300;

/**
 * Three buyers, one page: each group of plans is a folder.
 *
 * The folder is the overview and the panel under it is the detail. Opening a
 * folder fans its plans out with their prices on them and switches the panel
 * below to that group. Choosing a plan from the fan jumps to its full terms.
 * The text control under each folder does the same switch without the fan,
 * and carries the state: `aria-pressed` and the drawn rule mark the group the
 * panel is showing, because a folder closes when you click away from it and
 * the selection must not close with it.
 *
 * Every panel is rendered on the server and stays in the document. The
 * inactive ones carry `hidden`, which removes them from view but not from the
 * HTML, so a crawler or an answer engine gets every plan whichever folder a
 * person opened. A fragment can open any panel, and a fragment naming a plan
 * (`#school-deep-end`) opens the panel that holds it and scrolls to the plan.
 *
 * Phones get the folders as a row that scrolls sideways, one folder and the
 * edge of the next on screen, rather than three stacked folders pushing every
 * price below the fold.
 */
export function PlanSwitch({
  folders,
  children,
}: {
  folders: readonly PlanFolder[];
  /** One panel per folder, in the same order. */
  children: readonly React.ReactNode[];
}) {
  const [active, setActive] = React.useState(0);
  const [open, setOpen] = React.useState<number | null>(null);

  const select = React.useCallback(
    (index: number) => {
      setActive(index);
      /* `replaceState`, not `location.hash`: assigning the hash would jump
         the page and add a history entry per click. */
      window.history.replaceState(null, "", `#${folders[index].id}`);
    },
    [folders]
  );

  /** Show the panel that holds `targetId`, then scroll to it once it has a box. */
  const reveal = React.useCallback(
    (targetId: string) => {
      const direct = folders.findIndex((folder) => folder.id === targetId);
      const target = document.getElementById(targetId);
      const panel = target?.closest<HTMLElement>("[data-plan-panel]");
      const index = direct >= 0 ? direct : panel ? Number(panel.dataset.planPanel) : -1;
      if (index < 0 || !target) return;

      setActive(index);
      /* A hidden panel has no box to scroll to in this frame. One frame later
         it does. */
      requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    },
    [folders]
  );

  React.useEffect(() => {
    function fromHash() {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (hash) reveal(hash);
    }

    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [reveal]);

  return (
    <div>
      <div className="mx-auto w-full max-w-[110rem] px-[max(1rem,4vw)]">
        <ul
          aria-label="Plans, by who they are for"
          /* The top padding is the room an open folder's files rise into. A
             row that scrolls sideways clips vertically as well, so without it
             the fan would be cut off at the top on phones. */
          className="-mx-[max(1rem,4vw)] flex snap-x snap-mandatory gap-x-[clamp(1.25rem,4vw,3.5rem)] overflow-x-auto px-[max(1rem,4vw)] pt-[clamp(3.5rem,7vw,4.5rem)] pb-4 lg:mx-0 lg:justify-center lg:overflow-visible lg:px-0"
        >
          {folders.map((folder, i) => {
            const selected = i === active;
            return (
              <li
                key={folder.id}
                className="flex shrink-0 snap-center flex-col items-start gap-[clamp(0.75rem,2vw,1.125rem)]"
              >
                <GlassFolder
                  label={folder.label}
                  meta={folder.meta}
                  tone={folder.tone}
                  art={folder.art}
                  seed={folder.seed}
                  files={folder.files}
                  action="none"
                  width={FOLDER_WIDTH}
                  appearDelay={i * 140}
                  open={open === i}
                  onOpenChange={(next) => {
                    setOpen((current) => (next ? i : current === i ? null : current));
                    if (next) select(i);
                  }}
                  onFileSelect={(file) => {
                    if (file.href?.startsWith("#")) reveal(file.href.slice(1));
                  }}
                />

                <button
                  type="button"
                  aria-pressed={selected}
                  aria-controls={folder.id}
                  onClick={() => {
                    select(i);
                    requestAnimationFrame(() =>
                      document.getElementById(folder.id)?.scrollIntoView({ block: "start" })
                    );
                  }}
                  className={`group relative ml-[clamp(0.25rem,1vw,0.75rem)] inline-flex min-h-11 items-center gap-2 font-mono text-data ${
                    selected ? "text-foreground" : "text-muted hover:text-foreground"
                  }`}
                >
                  {selected ? "Showing" : "Show"} {folder.label.toLowerCase()} plans
                  <span aria-hidden="true" className="slash-glyph">
                    \
                  </span>
                  <span
                    aria-hidden="true"
                    className="nav-rule absolute inset-x-0 bottom-1.5 h-[2px] bg-accent-ink"
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <p aria-live="polite" className="sr-only">
          Showing {folders[active].label.toLowerCase()} plans
        </p>
      </div>

      {children.map((panel, i) => (
        <div
          key={folders[i].id}
          id={folders[i].id}
          data-plan-panel={i}
          className="scroll-mt-[clamp(5.25rem,10vw,7rem)]"
          hidden={i !== active}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
