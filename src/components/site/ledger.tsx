import * as React from "react";
import { Rise } from "@/components/ui/scroll-fx";

/**
 * A real table, because comparative content belongs in one.
 *
 * `website.md` section 5: *"Tables for anything comparative: they extract
 * cleanly."* That is the whole argument. A tool comparison rendered as three
 * cards side by side looks better in a screenshot and is unreadable to the
 * thing we most want reading it, and it is also unreadable to anyone using a
 * screen reader, who gets three unrelated blocks instead of a grid with row and
 * column headers.
 *
 * So: `<table>`, a real `<caption>`, `<th scope>` on both axes, and the mono
 * face throughout, since every cell in here is data.
 *
 * The horizontal scroll container is the one concession to phones. A five
 * column comparison does not fit 360px and the alternatives are worse: shrinking
 * the type past legibility, or collapsing to stacked definition lists, which
 * discards the alignment that made the table worth having. `tabindex={0}` on the
 * scroller is not decorative either. A region that scrolls must be reachable by
 * keyboard, or the far columns exist for pointer users only.
 */

export type LedgerColumn = {
  head: string;
  /** Marks the column that names each row. Exactly one, and it comes first. */
  rowHeader?: true;
};

export function Ledger({
  caption,
  columns,
  rows,
  className = "",
}: {
  /** Names the table. Visible: a caption nobody can see is a caption for robots. */
  caption: string;
  columns: readonly LedgerColumn[];
  rows: readonly (readonly React.ReactNode[])[];
  className?: string;
}) {
  return (
    <Rise y={30} className={className}>
      <div
        role="region"
        aria-label={caption}
        tabIndex={0}
        className="overflow-x-auto"
      >
        <table className="w-full min-w-[44rem] border-collapse text-left">
          <caption className="eyebrow text-eyebrow mb-[clamp(0.75rem,2vw,1.25rem)] text-left">
            {caption}
          </caption>

          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.head}
                  scope="col"
                  className="border-y border-line px-[clamp(0.5rem,1.2vw,1rem)] py-[clamp(0.625rem,1.4vw,0.875rem)] font-mono text-micro font-normal text-accent-ink uppercase first:pl-0 last:pr-0"
                >
                  {column.head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) =>
                  columns[ci]?.rowHeader ? (
                    <th
                      key={ci}
                      scope="row"
                      className="border-b border-line px-[clamp(0.5rem,1.2vw,1rem)] py-[clamp(0.75rem,1.8vw,1.125rem)] align-top font-display text-[clamp(0.875rem,1.3vw,1rem)] font-bold text-foreground first:pl-0 last:pr-0"
                    >
                      {cell}
                    </th>
                  ) : (
                    <td
                      key={ci}
                      className="border-b border-line px-[clamp(0.5rem,1.2vw,1rem)] py-[clamp(0.75rem,1.8vw,1.125rem)] align-top font-mono text-data tabular-nums text-muted first:pl-0 last:pr-0"
                    >
                      {cell}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Rise>
  );
}
