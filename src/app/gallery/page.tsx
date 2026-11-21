import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { meta } from "@/lib/seo";
export const metadata: Metadata = meta({
  title: "Our Framing Work: Art, Textiles, Keepsakes | Village Framer",
  description:
    "Photographs of real framing projects from our Salado shop: paintings, textiles, documents, keepsakes and oversized pieces. See what we can do with yours.",
  path: "/gallery",
});
const work = [
  ["painting-framed", "A painting, beautifully presented."],
  ["woven-artwork", "Texture deserves a thoughtful frame."],
  ["memorabilia-display", "The things that hold a story."],
  ["papyrus-artwork", "An artwork with its own character."],
  ["large-framed-textile", "Room for something larger."],
  ["historic-photo-framed", "A photograph ready for the wall."],
  ["document-framing", "A piece of history, on display."],
  ["poster-frame-detail", "Color, detail, and a strong edge."],
  ["photo-arrangement", "A collection brought together."],
  ["textile-display", "A closer look at textile work."],
  ["graphic-artwork", "A bold piece, a considered finish."],
  ["small-artwork-consultation", "It begins with a conversation."],
  ["colorful-artwork", "Color that catches your eye."],
  ["red-artwork", "A little drama on the wall."],
  ["finished-piece-at-table", "The finishing touches."],
];
export default function Gallery() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">From our hands to your walls</p>
        <h1>Every piece has a story.</h1>
        <p className="lede">
          Here are a few that have passed through our shop. Paintings,
          photographs, textiles, and the unexpected—each with a design of its
          own.
        </p>
      </header>
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="gallery-grid">
          {work.map(([image, caption]) => (
            <figure key={image}>
              <div className="gallery-photo">
                <Image
                  src={`/images/selected/${image}.webp`}
                  alt={caption}
                  fill
                  sizes="(max-width:540px) 90vw, (max-width:800px) 45vw, 30vw"
                />
              </div>
              <figcaption>{caption}</figcaption>
            </figure>
          ))}
        </div>
        <div className="actions">
          <Link href="/start-framing" className="button button-ink">
            Start framing your piece →
          </Link>
        </div>
      </section>
    </>
  );
}
