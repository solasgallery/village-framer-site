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
const work: [string, string, string][] = [
  ["painting-framed", "A painting, beautifully presented.", "A framed painting of a blue barn in a field of red flowers, held up on the shop cutting table"],
  ["woven-artwork", "Texture deserves a thoughtful frame.", "A tall papyrus artwork with a teal mat in a dark wood frame"],
  ["memorabilia-display", "The things that hold a story.", "A woman standing beside three framed keepsake displays in front of a wall of moulding samples"],
  ["papyrus-artwork", "An artwork with its own character.", "Papyrus with a royal cartouche, framed with a deep purple mat and gold edge"],
  ["large-framed-textile", "Room for something larger.", "Two women holding a large framed dark-blue textile in the shop"],
  ["historic-photo-framed", "A photograph ready for the wall.", "An old portrait of a woman in a field, in a dark wood frame with an arched top"],
  ["document-framing", "A piece of history, on display.", "Two women holding a framed document in a black frame at the workbench"],
  ["poster-frame-detail", "Color, detail, and a strong edge.", "Corner of a framed concert poster with a black mat and thin gold liner"],
  ["photo-arrangement", "A collection brought together.", "Black-and-white portrait photographs arranged together on a light surface"],
  ["textile-display", "A closer look at textile work.", "A framed papyrus with an ankh symbol standing on a counter in the shop"],
  ["graphic-artwork", "A bold piece, a considered finish.", "A black-and-white woodcut-style print of figures in a black frame, hung on a wall"],
  ["small-artwork-consultation", "It begins with a conversation.", "Two women at the workbench holding a small framed pen drawing"],
  ["colorful-artwork", "Color that catches your eye.", "A square framed blue artwork with a pattern of colored dots, on a wall"],
  ["red-artwork", "A little drama on the wall.", "A framed painting of a red room with two white dog figures, in a gold frame"],
  ["finished-piece-at-table", "The finishing touches.", "Two women setting a framed blue patterned piece down on the long shop table"],
];
export default function Gallery() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Our work</p>
        <h1>Framing from our shop</h1>
        <p className="lede">
          A few pieces that have come through the shop: paintings, photographs,
          textiles and keepsakes.
        </p>
      </header>
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="gallery-grid">
          {work.map(([image, caption, alt]) => (
            <figure key={image}>
              <div className="gallery-photo">
                <Image
                  src={`/images/selected/${image}.webp`}
                  alt={alt}
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
