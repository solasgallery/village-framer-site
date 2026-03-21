import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Custom Framing Near Round Rock TX — Picture Frames, Art & Mirrors',
  description:
    'Salado Village Framer — custom picture framing 31 minutes from Round Rock, Texas. Art framing, corporate art installations, mirror framing, and oversized pieces. Serving Round Rock, Pflugerville, and Hutto.',
}

export default function RoundRockAreaPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-deep">
        <Image src="/images/home/hero.jpg" alt="Salado Village Framer" fill priority className="object-cover opacity-40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="font-display text-4xl md:text-5xl text-cream tracking-[0.08em] leading-tight">
            Custom Framing for Round Rock
          </h1>
          <p className="font-body text-sm text-cream/50 mt-4">
            31 minutes north. Where Round Rock comes for framing done right.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-20 bg-cream">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl text-charcoal mb-6">
            Round Rock has grown. Your framing options just got better.
          </h2>
          <div className="space-y-4 font-body text-sm text-charcoal/60 leading-relaxed">
            <p>
              Round Rock's population has exploded past 132,000 — new homes,
              new offices, new walls that need something on them. The big-box
              stores can print a canvas, but they cannot build a custom frame
              that turns your art into something worth looking at every day.
              That is what Salado Village Framer does.
            </p>
            <p>
              Tech professionals from Dell and the Round Rock corridor bring us
              corporate art for their offices. New homeowners bring oversized
              pieces, family photographs, and art collected during travels.
              Interior designers bring projects that need a framer who can
              handle scale, quality, and tight timelines.
            </p>
            <p>
              Pflugerville and Hutto are also within easy reach — 35 and 25
              minutes respectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            <Link href="/services" className="border border-stone/30 p-6 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-lg text-charcoal mb-2">Custom Framing</h3>
              <p className="font-body text-xs text-charcoal/50">Hundreds of mouldings, real samples on your piece.</p>
            </Link>
            <Link href="/services" className="border border-stone/30 p-6 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-lg text-charcoal mb-2">Large Format</h3>
              <p className="font-body text-xs text-charcoal/50">Oversized art, canvases, and statement pieces.</p>
            </Link>
            <Link href="/gallery" className="border border-stone/30 p-6 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-lg text-charcoal mb-2">See Our Work</h3>
              <p className="font-body text-xs text-charcoal/50">Browse recent custom framing examples.</p>
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
            Salado Village Framer serves custom framing clients from Round Rock, Pflugerville,
            Hutto, Taylor, and the northern Austin metro. Located on Main Street in Salado,
            Texas 76571. Walk-ins welcome. 31 minutes north of Round Rock via I-35.
          </p>
        </div>
      </section>
    </>
  )
}
