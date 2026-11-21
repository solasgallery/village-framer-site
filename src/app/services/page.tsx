import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { services } from "@/lib/articles";
import { meta } from "@/lib/seo";
import { pricing } from "@/lib/site";
import StartCta from "@/components/StartCta";

export const metadata: Metadata = meta({
  title: "What We Frame: Art, Shadow Boxes, Mirrors | Village Framer",
  description:
    "Custom framing in Salado, Texas for art, photographs, shadow boxes, oversized pieces, mirrors and memorials. See what we frame and start with a photo.",
  path: "/services",
});
export default function Services() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">What we frame</p>
        <h1>
          If it matters to you,
          <br />
          let’s give it a place.
        </h1>
        <p className="lede">
          Custom framing is what we do, and every piece is framed in our Salado shop. Most projects start around{" "}
          {pricing.startsAround}; large pieces run {pricing.largeFrom} and up.
        </p>
        <StartCta />
      </header>
      {services.map((x, i) => (
        <section key={x.path} className={`split-feature ${i % 2 === 0 ? "sage" : ""}`}>
          <div className="feature-photo">
            <Image src={`/images/selected/${x.image}.webp`} alt={x.imageAlt} fill sizes="(max-width:800px) 100vw, 50vw" />
          </div>
          <div className="feature-copy">
            <p className="eyebrow">0{i + 1}</p>
            <h2>{x.h1.replace(/\.$/, "")}</h2>
            <p>{x.intro}</p>
            <div className="actions">
              <Link href={x.path} className="text-link">
                Read more
              </Link>
            </div>
          </div>
        </section>
      ))}
      <section className="wrap section">
        <p className="lede">
          We also carry Rifle Paper Co. gifts in the shop, and can talk about restoring or printing a piece when it
          comes with a framing project.
        </p>
      </section>
    </>
  );
}
