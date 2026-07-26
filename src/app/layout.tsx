import type { Metadata, Viewport } from "next";
import { Inter, Orbitron } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// The wordmark is set in Orbitron 700 — kept for headings and UI accents.
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s — ${SITE.name}`,
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

// Applies the stored theme before first paint so there is no flash.
const themeScript = `(function(){try{var t=localStorage.getItem("algobic-theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(t==="dark"){document.documentElement.classList.add("dark")}document.documentElement.style.colorScheme=t}catch(e){}})()`;

// Emitted as separate blocks rather than one @graph — every validator reads a
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
      sameAs: [SITE.instagram],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.about,
      inLanguage: "en",
      publisher: { "@id": `${SITE.url}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${SITE.url}/#webpage`,
      url: SITE.url,
      name: SITE.title,
      description: SITE.about,
      isPartOf: { "@id": `${SITE.url}/#website` },
      about: { "@id": `${SITE.url}/#organization` },
      inLanguage: "en",
      dateModified: SITE.updated,
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE.url}/opengraph-image.png`,
      },
    },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${orbitron.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {structuredData.map((node) => (
          <script
            key={node["@id"]}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
          />
        ))}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
