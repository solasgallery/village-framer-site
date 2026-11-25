import type { MetadataRoute } from "next";
import { all } from "@/lib/articles";
import { townCopy } from "@/data/areas-copy";
import { contentReviewedOn, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/start-framing", "/services", "/guides", "/gallery", "/visit", "/contact", "/privacy", "/trade", "/trade/apply", "/trade/faq", "/areas", ...townCopy.map((t) => t.path), ...all.map((a) => a.path)];
  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(contentReviewedOn),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/start-framing" ? 0.9 : 0.7,
  }));
}
