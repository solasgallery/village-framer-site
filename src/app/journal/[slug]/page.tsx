import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles } from "@/lib/content";
import Editorial from "@/components/Editorial";
export const dynamicParams = false;
export function generateStaticParams() {
  return articles.map((x) => ({ slug: x.slug }));
}
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const p = articles.find((x) => x.slug === params.slug);
  return {
    title: p?.title,
    description: p?.description,
    alternates: { canonical: `/journal/${params.slug}` },
    openGraph: {
      type: "article",
      title: p?.title,
      description: p?.description,
      url: `/journal/${params.slug}`,
    },
  };
}
export default function Article({ params }: { params: { slug: string } }) {
  const p = articles.find((x) => x.slug === params.slug);
  if (!p) notFound();
  return (
    <Editorial
      page={p}
      image={
        p.slug === "framing-oversized-art"
          ? "cherie-large-frame"
          : "moulding-wall"
      }
    />
  );
}
