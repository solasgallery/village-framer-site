import type { MetadataRoute } from "next";
import { all } from "@/lib/articles";
import { contentReviewedOn, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/start-framing", "/services", "/guides", "/gallery", "/visit", "/contact", "/service-area", "/privacy", "/trade", "/trade/apply", "/trade/faq", ...all.map((a) => a.path)];
  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(contentReviewedOn),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/start-framing" ? 0.9 : 0.7,
  }));
}
