import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Salado Village Framer for custom framing quotes, questions, or to schedule a consultation.',
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
          <div>
            <form
              action="https://formspree.io/f/YOUR_FORM_ID"
              method="POST"
              className="space-y-6"
            >
              <div>
                <label className="font-body text-xs text-charcoal/40 tracking-[0.1em] uppercase block mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-transparent border-b border-stone/30 focus:border-stone outline-none py-3 font-body text-sm text-charcoal transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-xs text-charcoal/40 tracking-[0.1em] uppercase block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-transparent border-b border-stone/30 focus:border-stone outline-none py-3 font-body text-sm text-charcoal transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-xs text-charcoal/40 tracking-[0.1em] uppercase block mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full bg-transparent border-b border-stone/30 focus:border-stone outline-none py-3 font-body text-sm text-charcoal transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-xs text-charcoal/40 tracking-[0.1em] uppercase block mb-2">
                  Tell us about your project
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full bg-transparent border-b border-stone/30 focus:border-stone outline-none py-3 font-body text-sm text-charcoal transition-colors resize-none"
                />
              </div>
              <div className="pt-4">
                <button type="submit" className="btn-quiet">Send message &rarr;</button>
              </div>
            </form>
          </div>

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
                <p><a href="tel:+12549476700" className="hover:text-charcoal transition-colors">(254) 947-6700</a></p>
              </div>
              <div>
                <p className="text-xs text-stone tracking-[0.15em] uppercase mb-1">Email</p>
                <p><a href="mailto:solasgallery@gmail.com" className="hover:text-charcoal transition-colors">solasgallery@gmail.com</a></p>
              </div>
              <div>
                <p className="text-xs text-stone tracking-[0.15em] uppercase mb-1">Address</p>
                <p>Main Street, Salado, Texas 76571</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
