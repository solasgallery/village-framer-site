import Image from "next/image";
import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import StartCta from "@/components/StartCta";
import FrameBand from "@/components/FrameBand";

export const metadata: Metadata = meta({
  title: "Recent Work from the Bench · Salado Village Framer",
  description:
    "Finished framing from our Salado shop on Rock Creek Drive: paintings, prints, papyrus, old photographs, clippings and a signed poster, all framed by hand.",
  path: "/gallery",
});

/**
 * Real shop photography only (public/images/selected). Captions describe only what is visible:
 * no client names, no stories, no prices, no superlatives. Finished pieces first, bench shots last.
 */
type Work = { file: string; w: number; h: number; caption: string; alt: string };
const work: Work[] = [
  { file: "painting-framed", w: 1350, h: 1800, caption: "A painting of a white barn above red flowers, in a dark wood frame with a cream mat.", alt: "A framed painting of a white barn above a field of red flowers, in a dark wood frame with a cream mat, held upright on the cutting table" },
  { file: "red-artwork", w: 1350, h: 1800, caption: "A painting of a red room with two white dogs, in a gold frame.", alt: "A framed painting of a red room with two white dog figures and a striped floor, in a gold frame on a grey wall" },
  { file: "colorful-artwork", w: 1350, h: 1800, caption: "A blue piece with rows of colored dots, in a black frame with a gold inner edge.", alt: "A square blue artwork with rows of colored dots and green hills, in a black frame with a thin gold inner edge" },
  { file: "graphic-artwork", w: 1350, h: 1800, caption: "A black-and-white print of two figures, with a white mat in a black frame.", alt: "A black-and-white print of two figures with touches of color, matted in white and framed in black on a wall" },
  { file: "papyrus-artwork", w: 1350, h: 1800, caption: "A papyrus with figures and cartouches, over a dark mat with a gold edge.", alt: "A painted papyrus with Egyptian figures and two cartouches, framed over a dark mat with a gold edge, on an easel" },
  { file: "woven-artwork", w: 1350, h: 1800, caption: "A long papyrus with its edges showing, on a teal mat in a patterned dark frame.", alt: "A tall painted papyrus with its rough edges showing, mounted on a teal mat in a dark frame with a key pattern" },
  { file: "textile-frame-detail", w: 1350, h: 1800, caption: "Close up: the papyrus edge against the teal mat and the patterned frame.", alt: "Close-up of the rough edge of a papyrus against a teal mat, beside a dark frame with a gold key pattern" },
  { file: "textile-display", w: 1350, h: 1800, caption: "A papyrus with an ankh, in a black frame.", alt: "A framed papyrus showing a large decorated ankh, in a black frame, standing on the floor of the shop" },
  { file: "historic-photo-framed", w: 1350, h: 1800, caption: "An old photograph of a woman in a field, in an arched dark wood frame.", alt: "An old tinted photograph of a woman standing in a field, behind glass in an arched dark wood-grain frame" },
  { file: "document-framing", w: 1800, h: 1350, caption: "An architectural print with a gold inner mat, in a black frame.", alt: "Two framers at the workbench holding a framed architectural print with a gold inner mat and a black frame" },
  { file: "memorabilia-display", w: 1800, h: 1350, caption: "Three framed sets of newspaper clippings, photographs and patches.", alt: "A framer standing with three framed displays of newspaper clippings, photographs and cloth patches, in front of the wall of moulding samples" },
  { file: "large-framed-textile", w: 1350, h: 1800, caption: "A large blue and gold artwork in a light frame.", alt: "Two framers holding up a large blue and gold artwork in a light frame in the middle of the shop" },
  { file: "cherie-large-frame", w: 1800, h: 1350, caption: "A fingerprint drawn in lines of writing, with a grey mat and gold edge in a silver frame.", alt: "A framer holding a large piece showing a fingerprint drawn in lines of handwriting, with a grey mat, a gold inner edge and a silver frame" },
  { file: "poster-frame-detail", w: 1350, h: 1800, caption: "A signed concert poster with a red inner border, in a light wood frame.", alt: "A signed concert poster with four portraits and a red inner border, in a light wood frame on the cutting mat" },
  { file: "gallery-wall", w: 1800, h: 1350, caption: "Six small prints of plants and animals, matted in white and hung as a grid.", alt: "Six small framed prints of plants and animals with white mats and dark frames, hung in two rows of three" },
  { file: "portrait-process-03", w: 1800, h: 1350, caption: "A large graphic portrait with a white mat in a black frame.", alt: "Two framers at the worktable with a large graphic portrait of a man, matted in white and framed in black" },
  { file: "small-artwork-consultation", w: 1800, h: 1350, caption: "A pen drawing with a light mat, in a light wood frame.", alt: "Two framers holding a small framed pen drawing with a light mat and a light wood frame at the worktable" },
  { file: "historic-photo-fitting", w: 1350, h: 1800, caption: "At the bench: fitting an old photograph into an arched frame.", alt: "A framer at the bench fitting an old photograph into an arched dark wood-grain frame" },
  { file: "hero-hands-at-work", w: 2200, h: 1650, caption: "At the bench: two framers working on a piece and its mat.", alt: "Two framers working together at the workbench over artwork and a cut mat" },
  { file: "careful-detail-work", w: 1350, h: 1800, caption: "At the bench: working at the light table in cotton gloves.", alt: "A framer in white cotton gloves working on a piece at the light table" },
];

export default function Gallery() {
  return (
    <>
      <FrameBand edge="top" />
      <header className="page-intro">
        <p className="eyebrow">Our work</p>
        <h1>Recent work from the bench.</h1>
        <p className="lede">
          Everything on this page was framed in our shop on Rock Creek Drive. Bring us the thing you cannot replace — we
          will help you choose the frame, and the rest is done by hand.
        </p>
        <StartCta />
      </header>
      <FrameBand edge="bottom" />
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="work-grid">
          {work.map((p, i) => (
            <figure key={p.file}>
              {i === 0 ? (
                // Lead photo is pre-sized (public/images/work) so the first paint skips the on-demand image resizer.
                <img
                  src={`/images/work/${p.file}-828.webp`}
                  srcSet={[640, 828, 1080].map((w) => `/images/work/${p.file}-${w}.webp ${w}w`).join(", ")}
                  sizes="(max-width: 640px) 92vw, (max-width: 1000px) 45vw, 30vw"
                  alt={p.alt}
                  width={p.w}
                  height={p.h}
                  fetchPriority="high"
                  decoding="async"
                />
              ) : (
                <Image
                  src={`/images/selected/${p.file}.webp`}
                  alt={p.alt}
                  width={p.w}
                  height={p.h}
                  sizes="(max-width: 640px) 92vw, (max-width: 1000px) 45vw, 30vw"
                />
              )}
              <figcaption>{p.caption}</figcaption>
            </figure>
          ))}
        </div>
        <StartCta className="work-cta" />
      </section>
    </>
  );
}
