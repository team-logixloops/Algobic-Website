/**
 * Every route the chrome links to, in one table.
 *
 * `website.md` caps primary navigation at five items: more than five reads as
 * a company with no opinion. Trust, low-traffic and legal surfaces live in the
 * footer instead.
 *
 * ⚠️ Most of these routes do not exist yet. The homepage ships at priority 6
 * in the build order, after `/builds` and `/work`, so by publication these
 * resolve. Until then they 404 in development, which is expected.
 */

export type NavItem = {
  href: string;
  label: string;
};

/** Primary navigation. Five, never six. */
export const PRIMARY_NAV: readonly NavItem[] = [
  { href: "/builds", label: "Builds" },
  { href: "/start", label: "Start" },
  { href: "/tools", label: "Tools" },
  { href: "/answers", label: "Answers" },
  { href: "/join", label: "Join" },
] as const;

/** Footer, grouped. Order is deliberate: work first, legal last. */
export const FOOTER_NAV: readonly { heading: string; items: readonly NavItem[] }[] =
  [
    {
      heading: "The work",
      items: [
        { href: "/builds", label: "Builds" },
        { href: "/work", label: "Case studies" },
        { href: "/data", label: "Data" },
      ],
    },
    {
      heading: "Start here",
      items: [
        { href: "/start", label: "What to build first" },
        { href: "/tools", label: "Which tool" },
        { href: "/answers", label: "Answers" },
      ],
    },
    {
      heading: "What this is",
      items: [
        { href: "/about", label: "About" },
        { href: "/manifesto", label: "Manifesto" },
        { href: "/join", label: "Join" },
      ],
    },
    {
      heading: "Legal",
      items: [
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
      ],
    },
  ] as const;
