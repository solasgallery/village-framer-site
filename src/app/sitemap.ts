import type { MetadataRoute } from "next";
import { cityPages, articles } from "@/lib/content";
import { moreCityPages } from "@/lib/more-cities";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/studio",
    "/services",
    "/gallery",
    "/visit",
    "/contact",
    "/area",
    "/journal",
    "/privacy",
    ...cityPages.concat(moreCityPages).map((x) => `/area/${x.slug}`),
    ...articles.map((x) => `/journal/${x.slug}`),
  ].map((path) => ({
    url: `https://saladovillageframer.com${path}`,
    lastModified: new Date("2026-09-10"),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path.startsWith("/area/") ? 0.6 : 0.8,
  }));
}
