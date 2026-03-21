import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Custom Framing Near Austin TX — Picture Frames, Art & Mirrors',
  description:
    'Salado Village Framer — custom picture framing 45 minutes from Austin, Texas. Museum-quality art framing, oversized pieces, mirrors, and conservation framing. Worth the drive from Austin, Cedar Park, and Lakeway.',
}

export default function AustinAreaPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-deep">
        <Image src="/images/home/hero.jpg" alt="Salado Village Framer" fill priority className="object-cover opacity-40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="font-display text-4xl md:text-5xl text-cream tracking-[0.08em] leading-tight">
            Custom Framing for Austin
          </h1>
          <p className="font-body text-sm text-cream/50 mt-4">
            45 minutes north. The custom framer Austin's art deserves.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-20 bg-cream">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl text-charcoal mb-6">
            Austin has plenty of framers. Here is why people drive to Salado.
          </h2>
          <div className="space-y-4 font-body text-sm text-charcoal/60 leading-relaxed">
            <p>
              Austin's custom framing options tend to fall into two camps:
              expensive boutique shops downtown, or big-box stores with limited
              materials and indifferent staff. Salado Village Framer is neither.
              We are a dedicated framing shop on Main Street in a town that takes
              craft seriously — with prices that reflect quality, not ZIP code.
            </p>
            <p>
              Austin collectors, interior designers, and homeowners make the
              45-minute drive for museum-quality framing at fair prices, personal
              service from people who care about the work, and the kind of
              expertise that only comes from decades of doing one thing well.
              Many combine the trip with a visit to Solas Gallery next door for
              fine art, or a walk through Salado's Main Street shops.
            </p>
            <p>
              Cedar Park and Lakeway residents are closer still — 38 and 50
              minutes respectively. And if you are in the northern suburbs
              (Round Rock, Pflugerville, Hutto), you are only 30 minutes out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            <Link href="/services" className="border border-stone/30 p-6 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-lg text-charcoal mb-2">Conservation Framing</h3>
              <p className="font-body text-xs text-charcoal/50">Museum-grade glass, archival mats, UV protection.</p>
            </Link>
            <Link href="/services" className="border border-stone/30 p-6 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-lg text-charcoal mb-2">Oversized & Specialty</h3>
              <p className="font-body text-xs text-charcoal/50">Large canvases, antiques, and unusual pieces.</p>
            </Link>
            <Link href="/gallery" className="border border-stone/30 p-6 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-lg text-charcoal mb-2">See Our Work</h3>
              <p className="font-body text-xs text-charcoal/50">Browse recent framing projects.</p>
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
            Salado Village Framer serves custom framing clients from Austin, Cedar Park,
            Lakeway, Bee Cave, Westlake Hills, Dripping Springs, and the greater Austin metro.
            Located on Main Street in Salado, Texas 76571. Walk-ins welcome.
            Approximately 45 minutes north of downtown Austin via I-35.
          </p>
        </div>
      </section>
    </>
  )
}
