import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { business, SITE_URL } from "@/lib/site";
import { meta } from "@/lib/seo";
import StartCta from "@/components/StartCta";
import NewsLine from "@/components/NewsLine";
import { townCopy } from "@/data/areas-copy";
import { areaMeta } from "@/data/areas-meta";

const find = (slug: string) => {
  const c = townCopy.find((t) => t.slug === slug);
  const m = areaMeta[slug];
  if (!c || !m) throw new Error(`Regional page: no copy or meta for ${slug}`);
  return { c, m };
};

/** Title pattern fixed by the brief: "Custom Framing in [Town], TX · Salado Village Framer". */
export function areaMetadata(slug: string): Metadata {
  const { c, m } = find(slug);
  return meta({
    title: `Custom Framing in ${c.town}, TX · Salado Village Framer`,
    description: m.description,
    path: c.path,
    titleMax: 61,
  });
}

export const shopAddress = {
  "@type": "PostalAddress",
  streetAddress: business.streetAddress,
  addressLocality: business.locality,
  addressRegion: business.region,
  postalCode: business.postalCode,
  addressCountry: "US",
};

export function AreaPhoto({ photo, alt, wide }: { photo: string; alt: string; wide?: boolean }) {
  return (
    <figure className={`area-photo${wide ? "" : " area-photo-tall"}`}>
      <Image
        src={`/images/selected/${photo}.webp`}
        alt={alt}
        width={wide ? 1800 : 1350}
        height={wide ? 1350 : 1800}
        sizes={wide ? "(max-width: 760px) 100vw, 680px" : "(max-width: 760px) 100vw, 440px"}
      />
    </figure>
  );
}

export default function AreaPage({ slug }: { slug: string }) {
  const { c, m } = find(slug);
  const ld = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#shop`,
    name: business.name,
    url: SITE_URL,
    image: `${SITE_URL}/images/selected/shop-at-dusk.webp`,
    telephone: business.phoneE164,
    address: shopAddress,
    areaServed: {
      "@type": "City",
      name: c.town,
      containedInPlace: { "@type": "State", name: "Texas" },
    },
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Areas we serve", item: `${SITE_URL}/areas` },
      { "@type": "ListItem", position: 3, name: `${c.town}, TX`, item: SITE_URL + c.path },
    ],
  };
  const [first, second, ...rest] = c.body;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <header className="page-intro area-intro">
        <p className="eyebrow">Areas we serve · {c.town}, TX</p>
        <h1>{c.headline}</h1>
        <StartCta />
      </header>
      <article className="wrap section prose area-copy" style={{ paddingTop: 0 }}>
        <p>{first}</p>
        <p>{second}</p>
        <AreaPhoto photo={m.photo} alt={m.alt} wide={m.wide} />
        {rest.map((t) => (
          <p key={t}>{t}</p>
        ))}
        <NewsLine />
        <p>
          <Link href="/areas" className="text-link">
            All the towns we serve
          </Link>
        </p>
      </article>
    </>
  );
}
