import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Orbitron } from "next/font/google";
import { MotionProvider } from "@/components/ui/motion-provider";
import { Preloader } from "@/components/ui/preloader";
import { embedJsonLd } from "@/lib/json-ld";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// The wordmark is set in Orbitron 700, kept for headings and UI accents.
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

/**
 * Data face: hours, ₹, dates, tool names, and the verbatim prompts a build
 * page quotes. Prompts set in a sans read as paraphrase, which defeats the
 * point of quoting them.
 *
 * Plex over the reflexive JetBrains Mono for two reasons: it has a Devanagari
 * sibling if Hinglish content ever ships, and it is narrower, so data rows
 * survive a 360px phone. Not a variable font: weights are explicit.
 */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "ALGOBIC",
    "Algobic",
    "LogixLoops",
    "learn by building",
    "student builders",
    "ship real projects",
    "portfolio over certificates",
    "job ready skills",
    "build in public",
    "skills gap",
    "employability for students",
    "practical tech education",
    "developer portfolio projects",
  ],
  authors: [{ name: SITE.parent }],
  creator: SITE.parent,
  publisher: SITE.parent,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#08070c" },
  ],
  colorScheme: "light dark",
};

/**
 * Applies the stored theme before first paint so there is no flash, marks the
 * document as scripted, and decides whether the preloader runs.
 *
 * The `js` class is the second job and it is not decorative. `/builds` reserves
 * three screens of scroll for a plane that only JavaScript can rotate into
 * place, so without this class the page has no way to know it should collapse
 * that shell to its resting state. It is set here rather than anywhere else for
 * the same reason the theme is: it has to be true during parse, before the
 * first frame, or the correction is itself a flash. See the `html:not(.js)`
 * block in `globals.css`.
 *
 * `data-preload` is the third job and it is here for that same reason. The
 * preloader is a full-screen overlay that runs every time the home page is
 * loaded, and only on the home page. Deciding that in React means rendering the
 * overlay on `/builds` too, painting it, and then removing it from an effect,
 * which is a flash of a cover on a page that never wanted one. Read during
 * parse, it is simply an attribute that is either there or not before anything
 * is painted.
 *
 * No `try` around it: nothing here touches storage, so there is nothing to
 * throw. It was gated on `sessionStorage` at first, to show once per session.
 * That is not what the site wants. Arriving at the home page is the event this
 * marks, and a return to it is the same arrival.
 *
 * Returning to `/` without a document load is the case this cannot see, since
 * the script runs once per document. `preloader.tsx` watches the pathname and
 * re-stamps the attribute for that.
 *
 * A bare `<script>`, deliberately, and it must stay one.
 *
 * React 19 warns about script tags rendered inside components, on the grounds
 * that they are never executed on a client render. That is true and it is
 * exactly why this one is fine: it does not need to run on a client render, it
 * needs to run while the browser is parsing the HTML, which is the one moment
 * React has no say over. The warning is a development advisory whose premise
 * does not apply here.
 *
 * `next/script` at `beforeInteractive` was tried and reverted. Next serialises
 * inline `beforeInteractive` scripts into a `self.__next_s` queue that its own
 * runtime drains, so the code cannot run until the framework chunks have
 * loaded. Measured by holding those chunks for 1.5s: the document was still
 * light at DOMContentLoaded, 42ms in, and only flipped once the chunks landed.
 * That is a guaranteed flash of the wrong theme for every returning visitor
 * who has chosen one. The bare tag applies it during parse, before anything
 * paints.
 *
 * The JSON-LD blocks below are also native `<script>` tags, on Next's own
 * guidance: structured data is not executable code, so a native tag is right
 * and `next/script` is the wrong tool for it.
 */
const themeScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("algobic-theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(t==="dark"){d.classList.add("dark")}d.style.colorScheme=t}catch(e){}var p=location.pathname.replace(/\\/+$/,"");if(p===""){d.setAttribute("data-preload","")}})()`;

// Emitted as separate blocks rather than one @graph: every validator reads a
// top-level @type, and some skip graph-wrapped nodes entirely.
const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      legalName: SITE.legalName,
      alternateName: `${SITE.name} by ${SITE.parent}`,
      url: SITE.url,
      slogan: SITE.tagline,
      description: SITE.about,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/icon-512.png`,
        width: 512,
        height: 512,
      },
      parentOrganization: { "@type": "Organization", name: SITE.parent },
      /* One entry, and it stays one until a second profile genuinely exists.
         A thin entity graph is a real cost: answer engines decide whether an
         organization is real by corroborating it across sources. A dead link
         in `sameAs` is worse than an absent one, so GitHub, LinkedIn and the
         rest arrive when the accounts do. */
      sameAs: [SITE.instagram],
      /* `website.md` section 8 folds contact into `/about` rather than giving
         it a thin page of its own, and adds this so an engine can read it
         either way. Instagram is the only channel that exists, so it is the
         only one declared: a support email nobody staffs is a worse answer
         than one honest handle. */
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: SITE.instagram,
        areaServed: "IN",
        availableLanguage: ["en"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.about,
      inLanguage: SITE.lang,
      publisher: { "@id": `${SITE.url}/#organization` },
    },
];

/* The `WebPage` node used to live here and was moved to `app/page.tsx` on
   2026-08-09, when nine more routes shipped.
 *
 * Emitted from the layout it appeared on every document, and what it said was
 * always "this page is the homepage": `@id` of `/#webpage`, `url` of the site
 * root. On `/` that is correct. On the other eleven routes it is a second page
 * node describing a different URL, sitting next to the real one, and an engine
 * reconciling two `WebPage` nodes in one document has to guess which describes
 * what it is reading.
 *
 * `Organization` and `WebSite` stay, because both are statements about the site
 * rather than about the document, they carry stable `@id` values that every
 * page's own node references, and repeating them is how the entity graph gets
 * corroborated rather than a conflict to resolve. */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={SITE.lang}
      suppressHydrationWarning
      className={`${inter.variable} ${orbitron.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        {/* Analytics, and the shortest disclosure this file can carry: it is
            one script, it sets no cookie, it stores no identifier, and it
            cannot follow anyone to another site. `/privacy` names it, says
            what it records, and says how to stop it. Those two must stay in
            sync: shipping this tag without that page is the change that turns
            an honest privacy policy into a false one.

            A plain `<script defer>` rather than `next/script`. Deferred is
            already non-blocking, and `next/script` at `afterInteractive`
            serialises the tag into a runtime queue, which means it is absent
            from the prerendered HTML that crawlers and auditors read.

            No `async`. `defer` guarantees execution after parse and preserves
            order; `async` would let it race the theme script for main-thread
            time during the one moment this page cannot spare any. */}
        <script
          defer
          data-domain={SITE.analyticsDomain}
          src="https://plausible.io/js/script.js"
        />
        {structuredData.map((node) => (
          <script
            key={node["@id"]}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: embedJsonLd(node) }}
          />
        ))}
      </head>
      {/* Extensions (ColorZilla, Grammarly, password managers) stamp attributes
          on <body> before React hydrates, which reads as a mismatch. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* First child on purpose. WebKit holds a streamed response until 1024
            bytes have arrived, so the overlay's markup belongs in the earliest
            bytes of the body rather than after a page's worth of sections. Its
            own stacking is absolute, so document order buys nothing else. */}
        <Preloader />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
