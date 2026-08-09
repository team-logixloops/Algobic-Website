import * as React from "react";
import { embedJsonLd } from "@/lib/json-ld";

/**
 * Structured data, emitted as separate top-level blocks.
 *
 * Not one `@graph`. Every validator reads a top-level `@type` and some skip
 * graph-wrapped nodes entirely, so a graph is a bet that every consumer is the
 * sophisticated kind. `layout.tsx` already made this decision for the site-wide
 * nodes; this component is the same decision for per-page ones.
 *
 * Native `<script>` tags rather than `next/script`, on Next's own guidance:
 * structured data is not executable code, so a native tag is right and
 * `next/script` is the wrong tool for it.
 *
 * Keyed on `@id`, which is also why every node builder in `json-ld.ts` requires
 * one. Two nodes sharing an `@id` on one page is a real bug (an engine has to
 * pick one) and React surfaces it as a duplicate key warning for free.
 */
export function JsonLd({ nodes }: { nodes: readonly { "@id": string }[] }) {
  return (
    <>
      {nodes.map((node) => (
        <script
          key={node["@id"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: embedJsonLd(node) }}
        />
      ))}
    </>
  );
}
