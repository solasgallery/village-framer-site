import type { Metadata } from 'next'
import InquiryForm from '@/components/InquiryForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Salado Village Framer for custom framing quotes, questions, or to schedule a consultation.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact',
    description: 'Contact Salado Village Framer for custom framing quotes or to schedule a consultation.',
    url: 'https://saladovillageframer.com/contact',
    type: 'website',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Contact | Salado Village Framer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact',
    description: 'Contact Salado Village Framer for custom framing quotes or to schedule a consultation.',
    images: ['/og-default.jpg'],
  },
}

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-8 bg-cream">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-charcoal tracking-[0.1em]">
            Get in touch
          </h1>
          <p className="font-body text-sm text-charcoal/50 mt-4">
            Questions, quotes, or just want to talk about a project.
          </p>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Form */}
          <InquiryForm
            source="Village Framer Contact"
            headline=""
            messagePlaceholder="Tell us about your project."
          />

          {/* Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-display text-xl text-charcoal mb-4">Walk-ins welcome</h3>
              <p className="font-body text-sm text-charcoal/50 leading-relaxed">
                The best way to get a framing quote is to bring your piece in.
                We will look at it together, explore options, and give you a price
                on the spot. No pressure, no appointment needed.
              </p>
            </div>
            <div className="font-body text-sm text-charcoal/70 space-y-3">
              <div>
                <p className="text-xs text-stone tracking-[0.15em] uppercase mb-1">Hours</p>
                <p>Tuesday – Saturday, 10 am – 5 pm</p>
              </div>
              <div>
                <p className="text-xs text-stone tracking-[0.15em] uppercase mb-1">Phone</p>
                <p><a href="tel:+12546136123" className="hover:text-charcoal transition-colors">(254) 613-6123</a></p>
              </div>
              <div>
                <p className="text-xs text-stone tracking-[0.15em] uppercase mb-1">Email</p>
                <p><a href="mailto:info@solasgallery.com" className="hover:text-charcoal transition-colors">info@solasgallery.com</a></p>
              </div>
              <div>
                <p className="text-xs text-stone tracking-[0.15em] uppercase mb-1">Address</p>
                <p>2 Rock Creek Dr Unit A, Salado, Texas 76571</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
