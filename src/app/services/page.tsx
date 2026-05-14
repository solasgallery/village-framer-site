import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Custom Framing Services',
  description: 'Custom picture framing, art framing, mirror framing, shadow boxes, and restoration at Salado Village Framer in Salado, Texas.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Custom Framing Services',
    description: 'Custom picture framing, art framing, mirror framing, shadow boxes, and restoration.',
    url: 'https://saladovillageframer.com/services',
    type: 'website',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Custom Framing Services | Salado Village Framer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Framing Services',
    description: 'Custom picture framing, art framing, mirror framing, shadow boxes, and restoration.',
    images: ['/og-default.jpg'],
  },
}

const services = [
  {
    title: 'Custom Picture Framing',
    desc: 'Hundreds of moulding options from classic wood to contemporary metal. Conservation-grade glass and archival matting available on every order. We frame art, photographs, prints, posters, and anything you want on a wall.',
  },
  {
    title: 'Mirror Framing',
    desc: 'Custom-framed mirrors in any size and style. Bring us your mirror or choose from our selection — we build the frame to fit.',
  },
  {
    title: 'Shadow Boxes & Display Cases',
    desc: 'Jerseys, medals, memorabilia, keepsakes, and three-dimensional pieces preserved and displayed behind museum-quality glass.',
  },
  {
    title: 'Needlework & Textile Framing',
    desc: 'Cross-stitch, embroidery, quilts, and textiles mounted and framed with archival methods that protect the fabric.',
  },
  {
    title: 'Diplomas & Credentials',
    desc: 'The degree took years. The frame should last longer. Acid-free materials, conservation glass, and mouldings that do justice to what it represents.',
  },
  {
    title: 'Restoration & Repair',
    desc: 'Damaged frames repaired or rebuilt. Faded mats replaced. Older pieces re-framed with modern conservation materials.',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden bg-deep">
        <Image
          src="/images/services/hero.jpg"
          alt="Custom framing workspace"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="font-display text-4xl md:text-5xl text-cream tracking-[0.1em]">
            What We Frame
          </h1>
          <p className="font-body text-sm text-cream/50 tracking-[0.15em] uppercase mt-4">
            Built by hand &middot; Finished in Salado
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-pad bg-cream">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s) => (
            <div key={s.title} className="border border-stone/30 p-8 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-xl text-charcoal mb-3">{s.title}</h3>
              <p className="font-body text-sm text-charcoal/50 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="section-pad bg-deep text-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl text-cream mb-14">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Bring it in', desc: 'Walk in with your piece. No appointment needed. We will look at it together and talk through options.' },
              { step: '02', title: 'Choose materials', desc: 'We guide you through mouldings, mats, and glass. You see real samples on your actual piece before you commit.' },
              { step: '03', title: 'Pick it up', desc: 'Most orders ready in two weeks. We call when it is done. You take home something worth hanging.' },
            ].map((s) => (
              <div key={s.step}>
                <p className="font-body text-xs text-stone tracking-[0.2em] uppercase mb-3">{s.step}</p>
                <h3 className="font-display text-xl text-cream mb-2">{s.title}</h3>
                <p className="font-body text-xs text-cream/50 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sister business nod */}
      <section className="section-pad bg-cream text-center">
        <p className="font-body text-sm text-charcoal/50">
          Looking for fine art or portraits to frame? Visit{' '}
          <a href="https://solasgallery.com" className="text-stone hover:text-charcoal transition-colors border-b border-stone/40 hover:border-charcoal pb-px">
            Solas Gallery
          </a>{' '}
          next door.
        </p>
      </section>
    </>
  )
}
