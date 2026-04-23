import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Custom Framing Near Temple TX — Picture Frames, Art & Mirrors',
  description:
    'Salado Village Framer — custom picture framing 17 minutes from Temple, Texas. Art framing, shadow boxes, mirror framing, diploma framing, and restoration. Serving Temple, Belton, and Bell County.',
  alternates: {
    canonical: '/area/temple',
  },
  openGraph: {
    title: 'Custom Framing Near Temple TX',
    description: 'Salado Village Framer — custom picture framing 17 minutes from Temple.',
    url: 'https://saladovillageframer.com/area/temple',
    type: 'website',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Custom Framing Near Temple TX | Salado Village Framer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Framing Near Temple TX',
    description: 'Salado Village Framer — custom picture framing 17 minutes from Temple.',
    images: ['/og-default.jpg'],
  },
}

export default function TempleAreaPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-deep">
        <Image src="/images/home/hero.jpg" alt="Salado Village Framer" fill priority className="object-cover opacity-40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="font-display text-4xl md:text-5xl text-cream tracking-[0.08em] leading-tight">
            Custom Framing for Temple
          </h1>
          <p className="font-body text-sm text-cream/50 mt-4">
            17 minutes south on I-35. Worth the drive for work done right.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-20 bg-cream">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl text-charcoal mb-6">
            Temple's custom framer is in Salado
          </h2>
          <div className="space-y-4 font-body text-sm text-charcoal/60 leading-relaxed">
            <p>
              Temple has big-box frame shops and one-hour services. What it does
              not have is a dedicated custom framing shop where someone with decades
              of experience looks at your piece, talks through options with real
              samples on your actual work, and builds a frame that does it justice.
              That shop is Salado Village Framer, 17 minutes south.
            </p>
            <p>
              Baylor Scott & White physicians frame diplomas and certifications.
              Temple families frame heirloom photographs and children's art.
              Interior designers bring in mirrors, canvases, and oversized pieces
              that the chain stores cannot handle. Everyone leaves with something
              worth hanging.
            </p>
            <p>
              Belton is even closer — 10 minutes. UMHB graduates have been framing
              their diplomas with us for years.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            <Link href="/services" className="border border-stone/30 p-6 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-lg text-charcoal mb-2">Custom Framing</h3>
              <p className="font-body text-xs text-charcoal/50">Hundreds of mouldings, conservation materials.</p>
            </Link>
            <Link href="/services" className="border border-stone/30 p-6 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-lg text-charcoal mb-2">Shadow Boxes</h3>
              <p className="font-body text-xs text-charcoal/50">Military medals, jerseys, memorabilia.</p>
            </Link>
            <Link href="/services" className="border border-stone/30 p-6 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-lg text-charcoal mb-2">Diploma Framing</h3>
              <p className="font-body text-xs text-charcoal/50">Professional presentation for your credentials.</p>
            </Link>
          </div>

          <div className="mt-14 text-center">
            <Link href="/contact" className="inline-block font-display text-sm tracking-[0.12em] uppercase border-b border-stone pb-1 text-charcoal hover:border-charcoal transition-colors">
              Get a quote &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-14 bg-cream border-t border-stone/20">
        <div className="max-w-3xl mx-auto">
          <p className="font-body text-xs text-charcoal/30 leading-relaxed text-center">
            Salado Village Framer serves custom framing clients from Temple, Belton, Troy,
            Rogers, and Bell County. Located on Main Street in Salado, Texas 76571.
            Walk-ins welcome. No appointment needed. 17 minutes south of Temple via I-35.
          </p>
        </div>
      </section>
    </>
  )
}
