import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Visit',
  description:
    'Visit Salado Village Framer. Hours, address, and phone — 2 Rock Creek Dr Unit A, Salado, TX 76571.',
  alternates: {
    canonical: '/visit',
  },
  openGraph: {
    title: 'Visit',
    description:
      'Visit Salado Village Framer. Hours, address, and phone — 2 Rock Creek Dr Unit A, Salado, TX 76571.',
    url: 'https://saladovillageframer.com/visit',
    type: 'website',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Visit | Salado Village Framer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visit',
    description:
      'Visit Salado Village Framer. Hours, address, and phone — 2 Rock Creek Dr Unit A, Salado, TX 76571.',
    images: ['/og-default.jpg'],
  },
}

export default function VisitPage() {
  return (
    <>
      <section className="bg-deep pt-32 pb-12 px-6">
        <div className="max-w-md mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl text-cream tracking-[0.1em]">
            Visit
          </h1>
          <p className="font-body text-sm text-cream/60 mt-4">
            Salado Village Framer
          </p>
        </div>
      </section>

      <section className="bg-cream px-6 py-14 md:py-20">
        <div className="max-w-md mx-auto space-y-10 font-body text-base text-charcoal/80 leading-relaxed">
          <div>
            <p className="text-xs text-stone tracking-[0.15em] uppercase mb-3">Hours</p>
            <p>Sunday: closed</p>
            <p>Monday: sometimes</p>
            <p>Tuesday–Saturday: 10am – 5 pm</p>
          </div>

          <div>
            <p className="text-xs text-stone tracking-[0.15em] uppercase mb-3">Address</p>
            <p>
              <a
                href="https://maps.google.com/?q=2+Rock+Creek+Dr+Unit+A,+Salado,+TX+76571"
                className="hover:text-charcoal transition-colors"
              >
                2 Rock Creek Dr Unit A, Salado, TX 76571
              </a>
            </p>
          </div>

          <div>
            <p className="text-xs text-stone tracking-[0.15em] uppercase mb-3">Phone</p>
            <p>
              <a
                href="tel:+12546136123"
                className="inline-block py-1 hover:text-charcoal transition-colors"
              >
                (254) 613-6123
              </a>
            </p>
          </div>

          <div className="pt-2">
            <Link href="/contact" className="btn-quiet">
              Start a framing project &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
