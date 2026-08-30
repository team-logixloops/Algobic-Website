import type { MetadataRoute } from "next";
import { BUILDS } from "@/lib/builds";
import { SITE } from "@/lib/site";

/** Indexable static routes. */
const ROUTES = [
  "",
  "/builds",
  "/start",
  "/tools",
  "/answers",
  "/work",
  "/data",
  "/about",
  "/manifesto",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: SITE.updated,
  }));

  const buildRoutes: MetadataRoute.Sitemap = BUILDS.map((build) => ({
    url: `${SITE.url}/builds/${build.slug}`,
    lastModified: build.updated,
  }));

  return [...staticRoutes, ...buildRoutes];
}
