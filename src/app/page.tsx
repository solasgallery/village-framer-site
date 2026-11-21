import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { business, pricing, START } from "@/lib/site";
import { meta } from "@/lib/seo";
import StartCta from "@/components/StartCta";
import Reviews from "@/components/Reviews";

export const metadata: Metadata = meta({
  title: "Custom Picture Framing in Salado, TX | Village Framer",
  description:
    "Custom framing in Salado, Texas for art, photographs, shadow boxes and oversized pieces. Upload a photo, preview frame styles and get a ballpark price.",
  path: "/",
});

const frame = [
  { title: "Art and photographs", image: "painting-framed", href: "/services/conservation-framing", text: "Paintings, prints, family photos and the pictures you keep coming back to." },
  { title: "Keepsakes and shadow boxes", image: "memorabilia-display", href: "/services/shadow-box-framing", text: "Jerseys, medals, textiles and the objects that carry a story." },
  { title: "Mirrors and big pieces", image: "large-framed-textile", href: "/services/mirror-framing", text: "Oversized art, statement mirrors and pieces too big for a store frame." },
];

const how = [
  { image: "design-table-collaboration", alt: "Three women working on a frame package at the shop's design table", n: "01", title: "Send a photo", text: "Upload it from your phone, add the size, and see it in sample mouldings and mats." },
  { image: "moulding-wall", alt: "A woman standing with framed pieces in front of the wall of moulding corner samples", n: "02", title: "Get a ballpark", text: "You see a ballpark before anyone calls you. The exact price comes after we see the piece." },
  { image: "careful-detail-work", alt: "A framer in gloves cleaning glass at the workbench", n: "03", title: "We frame it here", text: "Drop it off, ship it to us or talk it through first. The work never leaves the shop." },
];

const rifle = [
  { f: "umbrellas", alt: "Rifle Paper Co. floral umbrellas on display in the shop", w: 1400, h: 788 },
  { f: "wrapping-paper", alt: "Rolls of Rifle Paper Co. wrapping paper in a basket", w: 1400, h: 788 },
  { f: "shelf-notebooks", alt: "Rifle Paper Co. notebooks and planners on a shop shelf", w: 1400, h: 788 },
  { f: "gift-boxes", alt: "Stacked Rifle Paper Co. boxed stationery in the shop", w: 1400, h: 788 },
];

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Custom framing · Salado, Texas</p>
          <h1>
            What you love.
            <br />
            <em>
              Beautifully
              <br />
              framed.
            </em>
          </h1>
          <p className="lede">
            Upload a photo of the piece, see it in sample frames, and get a ballpark before you
            pick up the phone.
          </p>
          <StartCta className="hero-cta" secondary={{ href: "/visit", label: "Visit the shop" }} />
        </div>
        <div className="hero-image">
          <Image
            src="/images/selected/hero-hands-at-work.webp"
            alt="Two framers working together over artwork and matting at the workbench"
            fill
            priority
            sizes="(max-width:800px) 100vw, 54vw"
          />
        </div>
      </section>

      <section className="wrap section" id="what-we-frame">
        <div className="section-heading">
          <div>
            <p className="eyebrow">What we frame</p>
            <h2>Start with something you love.</h2>
          </div>
          <p>You don’t have to know the right frame. That’s the part we do together.</p>
        </div>
        <div className="cards-3">
          {frame.map((x) => (
            <Link href={x.href} className="picture-card" key={x.title}>
              <div className="photo">
                <Image src={`/images/selected/${x.image}.webp`} alt={x.title} fill sizes="(max-width:540px) 90vw, 30vw" />
              </div>
              <h3>
                {x.title}
                <span aria-hidden="true">→</span>
              </h3>
              <p>{x.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="large-piece ink" id="large-pieces">
        <div className="wrap section large-grid">
          <div className="large-copy">
            <p className="eyebrow">Our specialty</p>
            <h2>Big pieces are what we do best.</h2>
            <p className="lede">
              Oversized canvas, estate art, statement mirrors, the piece that has leaned against your wall for a year
              because nobody would touch it. Big work needs stronger joinery, safer glazing and a proper way to hang
              it, and we plan all three before a single cut is made.
            </p>
            <p className="lede">
              Cherie Flanagan, certified picture framer, has framed for thirty years. Your work never
              leaves the shop.
            </p>
            <StartCta onDark label="Start with your big piece" secondary={{ href: "/services/oversized-framing", label: "How we frame big pieces" }} />
          </div>
          <div className="large-photo">
            <Image
              src="/images/selected/cherie-large-frame.webp"
              alt="A large framed piece with a wide mat in the Salado shop"
              fill
              sizes="(max-width:800px) 100vw, 44vw"
            />
          </div>
        </div>
      </section>

      <section className="wrap section" id="how-it-works">
        <div className="section-heading">
          <div>
            <p className="eyebrow">How it works</p>
            <h2>
              From a photo
              <br />
              to a place on your wall.
            </h2>
          </div>
          <p>Three steps. Nothing is charged until you agree on the design and the price.</p>
        </div>
        <div className="process-grid">
          {how.map((x) => (
            <figure key={x.image}>
              <div className="process-photo reveal-photo">
                <Image src={`/images/selected/${x.image}.webp`} alt={x.alt} fill sizes="(max-width:540px) 90vw, 30vw" />
              </div>
              <figcaption>
                {x.n}
                <b>{x.title}</b>
                {x.text}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="split-feature ink" id="start">
        <div className="feature-copy">
          <p className="eyebrow">Try it on your phone</p>
          <h2>
            See your art
            <br />
            in the frame.
          </h2>
          <p className="lede">
            Upload a photo, enter the size, and watch it appear in sample mouldings and mats, shown on an
            illustrated wall. Then choose to drop it off, ship it to us or book a consult.
          </p>
          <StartCta onDark />
        </div>
        <div className="feature-photo">
          <Image
            src="/images/selected/gallery-wall.webp"
            alt="A grouping of framed pieces displayed together on a gallery wall"
            fill
            sizes="(max-width:800px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="wrap section" id="pricing">
        <div className="budget-panel">
          <div>
            <p className="eyebrow">What it costs</p>
            <h2>
              Two numbers to
              <br />
              start with.
            </h2>
          </div>
          <div>
            <p className="price-anchor">
              Most framing starts around <b>{pricing.startsAround}</b>. Large pieces often run <b>{pricing.largeFrom}</b> and up.
            </p>
            <p>
              Size, moulding, mat and glass all move the number. The{" "}
              <Link href={START} className="inline-link">
                Start framing preview
              </Link>{" "}
              gives you a ballpark for your piece, and our{" "}
              <Link href="/guides/how-much-does-custom-framing-cost" className="inline-link">
                framing cost guide
              </Link>{" "}
              explains where the money goes.
            </p>
          </div>
        </div>
      </section>

      <Reviews />

      <section className="rifle sage" id="rifle-paper-co">
        <div className="wrap section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Gifts in the shop</p>
              <h2>
                Rifle Paper Co.,
                <br />
                right here in Salado.
              </h2>
            </div>
            <p>
              We carry Rifle Paper Co. stationery, notebooks, wrapping paper and umbrellas. Stop in while your frame is
              in progress and pick out something for someone.
            </p>
          </div>
          <div className="rifle-grid">
            {rifle.map((r) => (
              <div className="rifle-photo" key={r.f}>
                <Image src={`/images/rifle/${r.f}.webp`} alt={r.alt} fill sizes="(max-width:540px) 90vw, (max-width:1000px) 45vw, 24vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap section visit" id="visit">
        <div className="visit-grid">
          <div>
            <p className="eyebrow">Visit</p>
            <h2>Come see the work.</h2>
            <p className="lede">
              Bring your piece, a photo of the wall and any questions. Call ahead if what you are bringing is large.
            </p>
            <address className="visit-line">
              <b>{business.name}</b>
              <br />
              {business.streetAddress}
              <br />
              {business.locality}, {business.region} {business.postalCode}
              <br />
              <a href={business.phoneHref}>{business.phone}</a>
              <br />
              {business.hours} · {business.hoursNote}
            </address>
            <div className="actions">
              <a className="text-link" href={business.mapsDirections} target="_blank" rel="noopener noreferrer">
                Get directions
              </a>
              <Link className="text-link" href="/service-area">
                Towns around Salado
              </Link>
            </div>
          </div>
          <div className="visit-photo">
            <Image src="/images/selected/shop-at-dusk.webp" alt="The Village Framer storefront and porch at dusk" fill sizes="(max-width:800px) 100vw, 50vw" />
          </div>
        </div>
      </section>
    </>
  );
}
