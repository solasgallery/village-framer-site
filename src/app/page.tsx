import Image from "next/image";
import Link from "next/link";
import { business, regionCities } from "@/lib/content";
import CtaPair from "@/components/CtaPair";
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
          <CtaPair className="hero-cta" />
          <p className="lede">
            The art you found. The moment you kept. The piece that deserves a
            little more. Bring it to people who see what you see.
          </p>
          <div className="actions">
            <Link href="/visit" className="text-link">
              Visit our shop ↗
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <Image
            src="/images/selected/hero-hands-at-work.webp"
            alt="Two framers working together over artwork and matting at the Village Framer workbench"
            fill
            priority
            sizes="(max-width:800px) 100vw, 54vw"
          />
          <div className="hero-caption">
            <span>Real hands. A personal eye. Right here.</span>
            <span>SALADO, TX</span>
          </div>
        </div>
      </section>
      <p className="services-strip">
        Custom framing · Conservation framing · Restoration · Archival printing
        · Delivery &amp; installation · Rifle Paper Co. gifts &amp; goods
      </p>
      <div className="trust-strip">
        <span>30 years of experience</span>
        <span>Your artwork stays here</span>
        <span>Big pieces welcome</span>
        <span>Personal design guidance</span>
      </div>
      <section className="wrap section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Start with something you love</p>
            <h2>What are we framing?</h2>
          </div>
          <p>
            You don’t have to know the right frame.
            <br />
            That’s the part we do together.
          </p>
        </div>
        <div className="cards-3">
          {[
            {
              title: "Art & photographs",
              image: "painting-framed",
              text: "Original paintings, prints, family photos, and the pictures you keep coming back to.",
            },
            {
              title: "Objects & memories",
              image: "woven-artwork",
              text: "Textiles, jerseys, keepsakes, and wonderfully hard-to-frame things.",
            },
            {
              title: "Something bigger",
              image: "large-framed-textile",
              text: "Oversized artwork, mirrors, and pieces that make a room feel like yours.",
            },
          ].map((x) => (
            <Link href="/services" className="picture-card" key={x.title}>
              <div className="photo">
                <Image
                  src={`/images/selected/${x.image}.webp`}
                  alt={x.title}
                  fill
                  sizes="(max-width:540px) 90vw, 30vw"
                />
              </div>
              <h3>
                {x.title}
                <span aria-hidden="true">↗</span>
              </h3>
              <p>{x.text}</p>
            </Link>
          ))}
        </div>
        <CtaPair />
      </section>
      <section className="large-piece ink" id="large-pieces">
        <div className="wrap section large-grid">
          <div className="large-copy">
            <p className="eyebrow">Our specialty</p>
            <h2>Big pieces are our specialty.</h2>
            <p className="lede">
              Oversized art is where the big-box framers tap out — and where we
              do our best work. Large canvas, estate pieces, mirrors, the thing
              that&apos;s been leaning against your wall for a year because
              nobody would touch it. Bring it in. If it fits through our door,
              we can frame it.
            </p>
            <div className="actions">
              <Link href="/design" className="button button-gold">
                Start with your piece <span aria-hidden="true">↗</span>
              </Link>
              <a href={business.phoneHref} className="button button-light">
                Call {business.phone}
              </a>
            </div>
          </div>
          {/* PLACEHOLDER before/after — asset #5-6 in docs/ASSET-CHECKLIST.md */}
          <div className="before-after">
            <figure>
              <div className="ba-before" role="img" aria-label="Placeholder: a large artwork leaning unframed against a wall">
                <span>Unframed</span>
              </div>
              <figcaption>Before</figcaption>
            </figure>
            <figure>
              <div className="ba-photo">
                <Image
                  src="/images/selected/cherie-large-frame.webp"
                  alt="Cherie holding a large framed piece with a wide mat in the shop"
                  fill
                  sizes="(max-width:800px) 45vw, 22vw"
                />
              </div>
              <figcaption>After — framed &amp; ready to hang</figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className="split-feature sage">
        <div className="feature-photo">
          <Image
            src="/images/selected/design-table-collaboration.webp"
            alt="Comparing artwork and framing materials together at the design table"
            fill
            sizes="(max-width:800px) 100vw, 50vw"
          />
        </div>
        <div className="feature-copy">
          <p className="eyebrow">A frame is only the beginning</p>
          <h2>
            Your eye.
            <br />
            Our experience.
            <br />
            <em>A better fit.</em>
          </h2>
          <p>
            There’s a difference between choosing a frame and finding the right
            one. We’ll look at the piece, the room, and the details that matter
            to you—with real samples and a personal artistic eye.
          </p>
          <p>
            Thirty years of experience. Moulding from Roma and Larson-Juhl. And
            the reassurance of knowing your work stays right here in our Salado
            shop.
          </p>
          <div className="actions">
            <Link className="text-link" href="/visit">
              Meet us at the design table ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="wrap section cherie-block" id="meet-cherie">
        <div className="cherie-photo">
          {/* PLACEHOLDER portrait — asset #1 in docs/ASSET-CHECKLIST.md */}
          <Image
            src="/images/selected/cherie-portrait.webp"
            alt="Portrait of Cherie Flanagan, certified picture framer"
            fill
            sizes="(max-width:800px) 90vw, 44vw"
          />
        </div>
        <div className="cherie-copy">
          <p className="eyebrow">Meet your framer</p>
          <h2>Framed by Cherie.</h2>
          <p className="lede">
            Cherie Flanagan has been framing for 30 years. She&apos;s a
            certified picture framer, which means your piece is designed by
            someone trained in conservation — not handed to a Saturday crew.
            Every frame is built right here in our Salado shop, by people
            you&apos;ll meet when you walk in.
          </p>
          <div className="actions">
            <a href="#visit" className="text-link">
              Meet us in the shop ↗
            </a>
          </div>
          <CtaPair />
        </div>
      </section>
      <section className="wrap section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Made here, with care</p>
            <h2>
              From possibility
              <br />
              to a place on your wall.
            </h2>
          </div>
          <p>A closer look at one piece coming together in our workshop.</p>
        </div>
        <div className="process-grid">
          {[
            {
              image: "portrait-process-01",
              title: "Start with your piece.",
              text: "Bring the artwork and the story behind it.",
            },
            {
              image: "portrait-process-02",
              title: "Find its frame.",
              text: "Explore color, texture, matting, and those finishing details.",
            },
            {
              image: "portrait-process-03",
              title: "See it come together.",
              text: "Framed in our shop, by the people you meet.",
            },
          ].map((x, i) => (
            <figure key={x.image}>
              <div className="process-photo reveal-photo">
                <Image
                  src={`/images/selected/${x.image}.webp`}
                  alt={x.title + " " + x.text}
                  fill
                  sizes="(max-width:540px) 90vw, 30vw"
                />
              </div>
              <figcaption>
                0{i + 1}
                <b>{x.title}</b>
                {x.text}
              </figcaption>
            </figure>
          ))}
        </div>
        <CtaPair />
      </section>
      <section className="split-feature ink">
        <div className="feature-copy">
          <p className="eyebrow">A little imagination goes a long way</p>
          <h2>
            Try your art.
            <br />
            Find a direction.
          </h2>
          <p className="lede">
            Upload a photo. See it live in real mouldings and mats, hung on a
            wall to scale, with an estimate along the way.
          </p>
          <p>
            Save what speaks to you, or send it to us. We’ll take it from an
            idea to the real thing together.
          </p>
          <CtaPair onDark />
        </div>
        <div className="feature-photo">
          <Image
            src="/images/selected/gallery-wall.webp"
            alt="A grouping of framed pieces displayed together in the gallery"
            fill
            sizes="(max-width:800px) 100vw, 50vw"
          />
        </div>
      </section>
      <section className="wrap section trust-block">
        <p className="promise">
          Our promise: every piece is inspected before it leaves the shop. If
          it&apos;s not right, we make it right.
        </p>
        {/* TODO(Tim): replace "#" with the shop's Google Business reviews URL */}
        <a href="#" className="text-link">
          Read Google reviews ↗
        </a>
        <CtaPair />
      </section>
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="budget-panel">
          <div>
            <p className="eyebrow">A starting point for your budget</p>
            <h2>
              Beautifully considered.
              <br />
              Clearly discussed.
            </h2>
          </div>
          <div>
            <p>{business.budget}</p>
            <div className="actions">
              <Link href="/contact" className="text-link">
                Tell us about your piece ↗
              </Link>
            </div>
            <CtaPair className="budget-cta" />
          </div>
        </div>
      </section>
      <section className="wrap section centered" id="visit" style={{ paddingTop: 0 }}>
        <p className="eyebrow">Salado roots. A Central Texas welcome.</p>
        <h2>Your artwork deserves the trip.</h2>
        <p className="lede">
          From Temple and Killeen to Georgetown, North Austin, and Waco, come
          for a personal framing experience—and spend a little time in Salado.
        </p>
        <div className="region-links" style={{ justifyContent: "center" }}>
          {regionCities.map((city) => (
            <Link
              key={city}
              href={`/area/${city === "North Austin" ? "austin" : city.toLowerCase().replaceAll(" ", "-")}`}
            >
              {city}
            </Link>
          ))}
        </div>
        <address className="visit-line">
          {business.address}
          <br />
          {business.hours} · <a href={business.phoneHref}>{business.phone}</a>
        </address>
        <div className="actions" style={{ justifyContent: "center" }}>
          <Link className="text-link" href="/visit">
            Plan your visit ↗
          </Link>
        </div>
        <CtaPair className="centered-cta" />
      </section>
      <section className="sage">
        <div className="wrap section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Notes from the frame shop</p>
              <h2>A little inspiration.</h2>
            </div>
            <Link href="/journal" className="text-link">
              Visit the journal ↗
            </Link>
          </div>
          <div className="cards-3">
            <Link
              href="/journal/choosing-a-frame-and-mat"
              className="picture-card journal-card"
            >
              <div className="photo">
                <Image
                  src="/images/selected/moulding-wall.webp"
                  alt="Rows of moulding samples in the shop"
                  fill
                  sizes="(max-width:540px) 90vw, 30vw"
                />
              </div>
              <h3>Find a frame direction before you visit.</h3>
              <p>
                A few things to notice about your artwork and the room it
                belongs in.
              </p>
            </Link>
            <Link
              href="/journal/framing-oversized-art"
              className="picture-card journal-card"
            >
              <div className="photo">
                <Image
                  src="/images/selected/cherie-large-frame.webp"
                  alt="Cherie working with a large framed piece"
                  fill
                  sizes="(max-width:540px) 90vw, 30vw"
                />
              </div>
              <h3>A little planning for a much larger piece.</h3>
              <p>
                What to gather before bringing oversized artwork to the shop.
              </p>
            </Link>
            <Link href="/gallery" className="picture-card journal-card">
              <div className="photo">
                <Image
                  src="/images/selected/textile-frame-detail.webp"
                  alt="Detail of a framed textile"
                  fill
                  sizes="(max-width:540px) 90vw, 30vw"
                />
              </div>
              <h3>Not everything starts on paper.</h3>
              <p>
                See the textures, objects, and meaningful pieces that pass
                through our hands.
              </p>
            </Link>
          </div>
          <CtaPair />
        </div>
      </section>
    </>
  );
}
