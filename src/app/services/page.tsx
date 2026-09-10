import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { business } from "@/lib/content";
export const metadata: Metadata = {
  title: "Custom framing, artwork, textiles & oversized pieces",
  description:
    "Explore personal custom framing for paintings, photographs, textiles, keepsakes, and larger pieces at Salado Village Framer.",
  alternates: { canonical: "/services" },
};
const services = [
  {
    title: "Art & photographs",
    image: "painting-framed",
    copy: "Original paintings, prints, photographs, and the pieces you have been meaning to put on the wall. We’ll look at the artwork first, then find the frame and matting that let it shine.",
  },
  {
    title: "Textiles & keepsakes",
    image: "woven-artwork",
    copy: "Jerseys, needlework, meaningful objects, and collections of memories. Bring the piece or send a photo so we can talk through its depth, materials, and presentation.",
  },
  {
    title: "Larger pieces",
    image: "large-framed-textile",
    copy: "A bigger canvas, an oversized print, a statement piece. Larger work is welcome. Send approximate dimensions and a photo before transporting anything particularly large or awkward.",
  },
];
export default function Services() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Custom framing, personally considered</p>
        <h1>
          If it matters to you,
          <br />
          let’s give it a place.
        </h1>
        <p className="lede">
          From a favorite photograph to a wonderfully unusual object, we help
          you find a presentation that feels right.
        </p>
      </header>
      {services.map((x, i) => (
        <section
          key={x.title}
          className={`split-feature ${i % 2 === 0 ? "sage" : ""}`}
        >
          <div className="feature-photo">
            <Image
              src={`/images/selected/${x.image}.webp`}
              alt={x.title + " framed at Village Framer"}
              fill
              sizes="(max-width:800px) 100vw, 50vw"
            />
          </div>
          <div className="feature-copy">
            <p className="eyebrow">0{i + 1} / What we frame</p>
            <h2>{x.title}</h2>
            <p>{x.copy}</p>
            <div className="actions">
              <Link href="/studio" className="text-link">
                Explore your piece ↗
              </Link>
            </div>
          </div>
        </section>
      ))}
      <section className="wrap section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The details make the difference</p>
            <h2>More than a short menu.</h2>
          </div>
          <p>
            Compare real samples from Roma Moulding, Larson-Juhl, and our wider
            selection in the shop.
          </p>
        </div>
        <div className="cards-3">
          {[
            {
              title: "Moulding with character",
              copy: "Quiet and clean, richly textured, traditional, or a little unexpected. We’ll explore profiles and finishes beside your artwork.",
            },
            {
              title: "Matting with purpose",
              copy: "Color and space change how a piece feels. Compare mat treatments in person, including layered details when they suit the work.",
            },
            {
              title: "A finishing touch",
              copy: "A fillet adds a narrow decorative detail inside a mat or frame. We can show you how this subtle element changes the design.",
            },
          ].map((x) => (
            <div key={x.title}>
              <h3>{x.title}</h3>
              <p className="lede">{x.copy}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="sage">
        <div className="wrap section budget-panel">
          <h2>Let’s start with your budget.</h2>
          <div>
            <p>{business.budget}</p>
            <div className="actions">
              <Link href="/visit" className="button button-ink">
                Visit the shop ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
