import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { guides } from "@/lib/articles";
import { meta } from "@/lib/seo";
import { author } from "@/lib/site";

export const metadata: Metadata = meta({
  title: "Framing Guides: Cost, Measuring and Mats | Village Framer",
  description:
    "Plain-spoken framing guides from a certified picture framer in Salado, Texas: what framing costs, how to measure your art, and float mount versus mat.",
  path: "/guides",
});
export default function Guides() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Framing guides</p>
        <h1>Framing, explained.</h1>
        <p className="lede">{author.line}</p>
      </header>
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="cards-3">
          {guides.map((g) => (
            <Link href={g.path} className="picture-card" key={g.path}>
              <div className="photo">
                <Image src={`/images/selected/${g.image}.webp`} alt={g.imageAlt} fill sizes="(max-width:540px) 90vw, 30vw" />
              </div>
              <h3>
                {g.h1}
                <span aria-hidden="true">→</span>
              </h3>
              <p>{g.intro}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
