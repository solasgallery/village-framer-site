import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Custom Framing Near Georgetown TX — Picture Frames, Art & Mirrors',
  description:
    'Salado Village Framer — custom picture framing 24 minutes from Georgetown, Texas. Art framing, mirror framing, needlework, and restoration. Serving Georgetown, Jarrell, Florence, and Williamson County.',
}

export default function GeorgetownAreaPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-deep">
        <Image src="/images/home/hero.jpg" alt="Salado Village Framer" fill priority className="object-cover opacity-40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="font-display text-4xl md:text-5xl text-cream tracking-[0.08em] leading-tight">
            Custom Framing for Georgetown
          </h1>
          <p className="font-body text-sm text-cream/50 mt-4">
            24 minutes north. One square town framing for another.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-20 bg-cream">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl text-charcoal mb-6">
            Georgetown knows craft when it sees it
          </h2>
          <div className="space-y-4 font-body text-sm text-charcoal/60 leading-relaxed">
            <p>
              Georgetown has one of the most beautiful town squares in Texas,
              a population of 79,000 that appreciates quality, and Southwestern
              University graduates who need their diplomas framed properly.
              Salado Village Framer is 24 minutes north — a straight shot up I-35
              to another Main Street that takes craft seriously.
            </p>
            <p>
              Georgetown homeowners bring us original art, family photographs,
              oversized canvases, and pieces picked up at estate sales and
              antique shops on the square. Interior designers from the Sun City
              community are regulars. And Jarrell residents are practically next
              door — 10 minutes away.
            </p>
            <p>
              If you have something worth framing, it is worth the drive to a
              shop that does it right.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            <Link href="/services" className="border border-stone/30 p-6 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-lg text-charcoal mb-2">Art Framing</h3>
              <p className="font-body text-xs text-charcoal/50">Originals, prints, and canvases.</p>
            </Link>
            <Link href="/services" className="border border-stone/30 p-6 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-lg text-charcoal mb-2">Mirror Framing</h3>
              <p className="font-body text-xs text-charcoal/50">Custom-framed mirrors in any size and style.</p>
            </Link>
            <Link href="/services" className="border border-stone/30 p-6 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-lg text-charcoal mb-2">Restoration</h3>
              <p className="font-body text-xs text-charcoal/50">Damaged frames repaired, older pieces re-framed.</p>
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
            Salado Village Framer serves custom framing clients from Georgetown, Jarrell,
            Florence, Liberty Hill, and Williamson County. Located on Main Street in Salado,
            Texas 76571. Walk-ins welcome. 24 minutes north of Georgetown via I-35.
          </p>
        </div>
      </section>
    </>
  )
}
