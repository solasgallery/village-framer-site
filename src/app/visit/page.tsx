import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Visit Us',
  description: 'Visit Salado Village Framer on Main Street in Salado, Texas. Hours, directions, and contact information.',
}

export default function VisitPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[350px] w-full overflow-hidden bg-deep">
        <Image
          src="/images/visit/storefront.jpg"
          alt="Salado Village Framer storefront"
          fill
          priority
          className="object-cover opacity-50"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="font-display text-4xl md:text-5xl text-cream tracking-[0.1em]">Visit</h1>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <h2 className="font-display text-3xl text-charcoal mb-8">Find us</h2>
            <div className="space-y-6 font-body text-sm text-charcoal/70 leading-relaxed">
              <div>
                <p className="text-xs text-stone tracking-[0.15em] uppercase mb-2">Hours</p>
                <p>Tuesday – Saturday, 10 am – 5 pm</p>
                <p className="text-charcoal/40 mt-1">Walk-ins welcome. No appointment needed.</p>
              </div>
              <div>
                <p className="text-xs text-stone tracking-[0.15em] uppercase mb-2">Address</p>
                <p>Main Street</p>
                <p>Salado, Texas 76571</p>
              </div>
              <div>
                <p className="text-xs text-stone tracking-[0.15em] uppercase mb-2">Contact</p>
                <p><a href="tel:+12549476700" className="hover:text-charcoal transition-colors">(254) 947-6700</a></p>
                <p><a href="mailto:solasgallery@gmail.com" className="hover:text-charcoal transition-colors">solasgallery@gmail.com</a></p>
              </div>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-auto overflow-hidden min-h-[300px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3425.5!2d-97.54!3d30.94!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSalado%20Village%20Framer!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              className="absolute inset-0"
            />
          </div>
        </div>
      </section>
    </>
  )
}
