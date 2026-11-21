import type { Metadata } from "next";
import { SITE_URL } from "./site";

/** Page metadata with build-time guards: title 50–60 chars, description 150–160 chars. */
export function meta(o: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noindex?: boolean;
}): Metadata {
  const t = o.title.length;
  const d = o.description.length;
  if (t < 50 || t > 60) throw new Error(`SEO: title ${t} chars (need 50-60) for ${o.path}: ${o.title}`);
  if (d < 150 || d > 160) throw new Error(`SEO: description ${d} chars (need 150-160) for ${o.path}`);
  const image = o.image || "/svf-og-default.jpg";
  const images = [{ url: image, width: 1200, height: 630, alt: o.imageAlt || "Salado Village Framer, custom framing in Salado, Texas" }];
  return {
    title: { absolute: o.title },
    description: o.description,
    alternates: { canonical: o.path },
    openGraph: { type: o.type || "website", locale: "en_US", url: SITE_URL + o.path, siteName: "Salado Village Framer", title: o.title, description: o.description, images },
    twitter: { card: "summary_large_image", title: o.title, description: o.description, images: [image] },
    ...(o.noindex && { robots: { index: false, follow: true } }),
  };
}
