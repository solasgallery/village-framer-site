import Image from 'next/image'
import Link from 'next/link'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  additionalType: 'http://www.productontology.org/id/Picture_frame',
  name: 'Salado Village Framer',
  description: 'Custom picture framing and décor on Main Street in Salado, Texas.',
  url: 'https://saladovillageframer.com',
  telephone: '+1-254-613-6123',
  email: 'info@solasgallery.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2 Rock Creek Dr Unit A',
    addressLocality: 'Salado',
    addressRegion: 'TX',
    postalCode: '76571',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 30.9468,
    longitude: -97.5395,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '17:00',
    },
  ],
  image: 'https://saladovillageframer.com/images/home/hero.jpg',
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden bg-deep">
        <Image
          src="/images/home/hero.jpg"
          alt="Salado Village Framer storefront"
          fill
          priority
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-deep/30" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="font-display text-4xl md:text-6xl text-cream tracking-[0.15em] uppercase leading-tight">
            Salado Village Framer
          </h1>
          <p className="font-body text-sm text-cream/50 tracking-[0.2em] uppercase mt-4">
            Custom Framing & Décor &middot; Main Street, Salado
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="section-pad bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6">
            The right frame changes everything.
          </h2>
          <p className="font-body text-sm text-charcoal/60 leading-relaxed">
            Salado Village Framer is a custom framing shop on Main Street in Salado,
            Texas. We frame art, photographs, memorabilia, mirrors, and anything
            worth preserving — with the same care and craftsmanship that has defined
            our work since we opened our doors.
          </p>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-pad bg-cream border-t border-stone/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Custom Framing',
              desc: 'Museum-quality materials, hundreds of moulding options, and expert guidance for every piece.',
              image: '/images/home/service-framing.jpg',
            },
            {
              title: 'Art & Mirrors',
              desc: 'Curated wall décor, mirrors, and ready-to-hang pieces for any room in your home.',
              image: '/images/home/service-decor.jpg',
            },
            {
              title: 'Restoration & Specialty',
              desc: 'Shadow boxes, needlework, jerseys, diplomas, and heirloom restoration.',
              image: '/images/home/service-specialty.jpg',
            },
          ].map((s) => (
            <Link key={s.title} href="/services" className="group">
              <div className="relative aspect-[4/3] overflow-hidden mb-4">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="font-display text-xl text-charcoal">{s.title}</h3>
              <p className="font-body text-xs text-charcoal/50 mt-1 leading-relaxed">{s.desc}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-14">
          <Link href="/services" className="btn-quiet">All services &rarr;</Link>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="section-pad bg-deep text-cream">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-display text-3xl text-cream mb-14">Recent work</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative aspect-square overflow-hidden">
                <Image
                  src={`/images/gallery/work-${i}.jpg`}
                  alt={`Framed work ${i}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link href="/gallery" className="btn-quiet text-cream border-cream/40 hover:border-cream">
              See more &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-cream text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl text-charcoal mb-4">
            Bring it in. We will take care of it.
          </h2>
          <p className="font-body text-sm text-charcoal/50 mb-8">
            Walk-ins welcome. Consultations always free.
          </p>
          <Link href="/contact" className="btn-quiet">Get in touch &rarr;</Link>
        </div>
      </section>
    </>
  )
}
