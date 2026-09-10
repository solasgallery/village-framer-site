import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { regionalHub, regionCities } from "@/lib/content";
export const metadata: Metadata = {
  title: "A framing destination for Central Texas",
  description:
    "Personal custom framing in Salado for Killeen, Temple, Georgetown, Round Rock, Cedar Park, Waco, and communities across Central Texas.",
  alternates: { canonical: "/area" },
};
export default function Region() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Salado roots. A regional welcome.</p>
        <h1>{regionalHub.title}</h1>
        <p className="lede">{regionalHub.intro}</p>
      </header>
      <section className="split-feature sage">
        <div className="feature-photo">
          <Image
            src="/images/selected/village-framer-entrance.webp"
            alt="The entrance to our Salado storefront"
            fill
            sizes="(max-width:800px) 100vw, 50vw"
          />
        </div>
        <div className="feature-copy">
          <h2>
            Start the conversation
            <br />
            before the drive.
          </h2>
          <p>{regionalHub.body}</p>
          <div className="actions">
            <Link href="/studio" className="button button-ink">
              Share your framing idea ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="wrap section">
        <p className="eyebrow">Come see us in Salado</p>
        <h2>Where are you coming from?</h2>
        <div className="region-links">
          {regionCities.map((city) => (
            <Link
              key={city}
              href={`/area/${city === "North Austin" ? "austin" : city.toLowerCase().replaceAll(" ", "-")}`}
            >
              {city} ↗
            </Link>
          ))}
        </div>
        <p className="lede">
          One storefront, in Salado. Monday–Saturday, 10am–5pm.
          <br />2 Rock Creek Dr, Unit A, Salado, TX 76571.
        </p>
        <div className="actions">
          <Link href="/visit" className="text-link">
            Get directions and plan your visit ↗
          </Link>
        </div>
      </section>
    </>
  );
}
