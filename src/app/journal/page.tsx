import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/content";
export const metadata: Metadata = {
  title: "Framing ideas & notes from the workshop",
  description:
    "Practical framing inspiration from Salado Village Framer: explore frame and mat choices, plan for oversized art, and prepare for your visit.",
  alternates: { canonical: "/journal" },
};
export default function Journal() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Notes from the frame shop</p>
        <h1>Look a little closer.</h1>
        <p className="lede">
          Ideas, details, and practical advice for the pieces you love.
        </p>
      </header>
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="cards-3">
          {articles.map((p, i) => (
            <Link
              href={`/journal/${p.slug}`}
              className="picture-card journal-card"
              key={p.slug}
            >
              <div className="photo">
                <Image
                  src={`/images/selected/${i === 0 ? "cherie-large-frame" : "moulding-wall"}.webp`}
                  alt={
                    i === 0
                      ? "Working with a large frame"
                      : "Moulding samples at our shop"
                  }
                  fill
                  sizes="(max-width:540px) 90vw, 30vw"
                />
              </div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
