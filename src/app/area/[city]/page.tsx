import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cityPages } from "@/lib/content";
import { moreCityPages } from "@/lib/more-cities";
import Editorial from "@/components/Editorial";
const pages = [...cityPages, ...moreCityPages];
export const dynamicParams = false;
export function generateStaticParams() {
  return pages.map((x) => ({ city: x.slug }));
}
export function generateMetadata({
  params,
}: {
  params: { city: string };
}): Metadata {
  const p = pages.find((x) => x.slug === params.city);
  return {
    title: p?.title,
    description: p?.description,
    alternates: { canonical: `/area/${params.city}` },
    openGraph: {
      title: p?.title,
      description: p?.description,
      url: `/area/${params.city}`,
    },
  };
}
export default function City({ params }: { params: { city: string } }) {
  const p = pages.find((x) => x.slug === params.city);
  if (!p) notFound();
  const images = [
    "design-table-collaboration",
    "inside-the-workshop",
    "moulding-wall",
    "gallery-wall",
    "careful-detail-work",
  ];
  return (
    <Editorial
      page={p}
      image={images[pages.indexOf(p) % images.length]}
      kind="area"
    />
  );
}
