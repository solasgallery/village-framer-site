import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { guides } from "@/lib/articles";
import { meta } from "@/lib/seo";
import ArticlePage from "@/components/ArticlePage";

export const dynamicParams = false;
export const generateStaticParams = () => guides.map((s) => ({ slug: s.slug }));
const find = (slug: string) => guides.find((s) => s.slug === slug);
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = find(params.slug);
  if (!a) return {};
  return meta({ title: a.title, description: a.description, path: a.path, type: "article", image: `/images/selected/${a.image}.webp`, imageAlt: a.imageAlt });
}
export default function Page({ params }: { params: { slug: string } }) {
  const a = find(params.slug);
  if (!a) notFound();
  return <ArticlePage a={a} />;
}
