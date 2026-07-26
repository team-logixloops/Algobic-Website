/**
 * Single source of truth for the canonical URL and the copy that search
 * engines, AI answer engines and social cards all read.
 *
 * Set NEXT_PUBLIC_SITE_URL in the deploy environment if the domain differs.
 */
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://algobic.in").replace(
    /\/$/,
    ""
  ),
  name: "ALGOBIC",
  legalName: "Algobic",
  parent: "LogixLoops",
  tagline: "Build Before They Do",
  title: "ALGOBIC — Build Before They Do",
  /** Meta description — kept under 160 characters. */
  description:
    "The job market changed. Education didn't. ALGOBIC turns students into builders who ship, because companies hire what you've built, not what you've studied.",
  /** Long form, for structured data and answer engines. */
  about:
    "The job market changed. Education didn't. ALGOBIC exists to close that gap. Most students graduate; very few builders do. The internet doesn't care about your CGPA and companies don't hire notes — what matters is what you've shipped. ALGOBIC turns students into builders who ship real, public work.",
  shortDescription:
    "Closing the gap between education and the job market. Students graduate; builders ship. ALGOBIC turns students into builders.",
  manifesto: [
    "The job market changed. Education didn't.",
    "Most students graduate. Very few builders do.",
    "The internet doesn't care about your CGPA.",
    "Companies don't hire notes.",
    "Ideas don't matter. Certificates don't matter.",
    "What matters is what you've shipped.",
  ],
  instagram: "https://www.instagram.com/algobic.in?igsh=cWlsZXNtZDJmOW1v",
  instagramHandle: "algobic.in",
  locale: "en_IN",
} as const;
