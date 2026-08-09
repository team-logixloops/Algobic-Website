/**
 * Every route the chrome links to, in one table.
 *
 * `website.md` caps primary navigation at five items: more than five reads as
 * a company with no opinion. Trust, low-traffic and legal surfaces live in the
 * footer instead.
 */

export type NavItem = {
  href: string;
  label: string;
  /**
   * Whether the route resolves today.
   *
   * The footer renders every item in this table, but only links the ones that
   * exist: an unshipped route arrives as dimmed text with no anchor, no slash
   * glyph and no place in the tab order. So the footer's shape is final from the
   * first deploy and each route lights up by adding one word here, rather than
   * by anyone remembering to add a link later.
   *
   * Deliberately opt-in rather than opt-out. A missing flag can only ever
   * under-promise, and a route that ships without being marked is a dim label
   * next to a live page, which is visible. The inverse default would silently
   * publish links to a 404.
   *
   * Every item carries it as of 2026-08-09: the ten remaining routes shipped
   * together. The flag stays because the next thing this table gains is
   * `/builds/[slug]` facets and `/tools/[comparison]`, which will not.
   */
  live?: true;
};

/** Primary navigation. Five, never six. */
export const PRIMARY_NAV: readonly NavItem[] = [
  { href: "/builds", label: "Builds", live: true },
  { href: "/start", label: "Start", live: true },
  { href: "/tools", label: "Tools", live: true },
  { href: "/answers", label: "Answers", live: true },
  { href: "/join", label: "Join", live: true },
] as const;

/**
 * Footer, grouped. Order is deliberate: work first, legal last.
 */
export const FOOTER_NAV: readonly { heading: string; items: readonly NavItem[] }[] =
  [
    {
      heading: "The work",
      items: [
        { href: "/builds", label: "Builds", live: true },
        { href: "/work", label: "Case studies", live: true },
        { href: "/data", label: "Data", live: true },
      ],
    },
    {
      heading: "Start here",
      items: [
        { href: "/start", label: "What to build first", live: true },
        { href: "/tools", label: "Which tool", live: true },
        { href: "/answers", label: "Answers", live: true },
      ],
    },
    {
      heading: "What this is",
      items: [
        { href: "/about", label: "About", live: true },
        { href: "/manifesto", label: "Manifesto", live: true },
        { href: "/join", label: "Join", live: true },
      ],
    },
    {
      heading: "Legal",
      items: [
        { href: "/privacy", label: "Privacy", live: true },
        { href: "/terms", label: "Terms", live: true },
      ],
    },
  ] as const;
