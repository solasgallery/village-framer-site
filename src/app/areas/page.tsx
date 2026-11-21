import Link from "next/link";
import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import { business, SITE_URL } from "@/lib/site";
import StartCta from "@/components/StartCta";
import NewsLine from "@/components/NewsLine";
import { AreaPhoto, shopAddress } from "@/components/AreaPage";
import { hubCopy, townCopy } from "@/data/areas-copy";
import { hubMeta } from "@/data/areas-meta";

export const metadata: Metadata = meta({
  title: "The Towns We Serve, Central Texas | Salado Village Framer",
  description: hubMeta.description,
  path: "/areas",
});

export default function Areas() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#shop`,
    name: business.name,
    url: SITE_URL,
    telephone: business.phoneE164,
    address: shopAddress,
    areaServed: townCopy.map((t) => ({ "@type": "City", name: t.town, containedInPlace: { "@type": "State", name: "Texas" } })),
  };
  const [first, second] = hubCopy.body;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="page-intro">
        <p className="eyebrow">Areas we serve</p>
        <h1>{hubCopy.headline}</h1>
        <StartCta />
      </header>
      <section className="wrap section prose area-copy" style={{ paddingTop: 0 }}>
        <p>{first}</p>
        <ul className="area-links">
          {townCopy.map((t) => (
            <li key={t.slug}>
              <Link href={t.path}>{t.town}</Link>
            </li>
          ))}
        </ul>
        <p>{second}</p>
        <AreaPhoto photo={hubMeta.photo} alt={hubMeta.alt} wide={hubMeta.wide} />
        <NewsLine />
      </section>
    </>
  );
}
