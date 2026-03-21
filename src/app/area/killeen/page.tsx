import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Custom Framing Near Killeen TX — Picture Frames, Shadow Boxes & Mirrors',
  description:
    'Salado Village Framer — custom picture framing 21 minutes from Killeen, Texas. Military shadow boxes, flag cases, art framing, and mirrors. Serving Killeen, Fort Cavazos, Harker Heights, and Copperas Cove.',
}

export default function KilleenAreaPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-deep">
        <Image src="/images/home/hero.jpg" alt="Salado Village Framer" fill priority className="object-cover opacity-40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="font-display text-4xl md:text-5xl text-cream tracking-[0.08em] leading-tight">
            Custom Framing for Killeen
          </h1>
          <p className="font-body text-sm text-cream/50 mt-4">
            21 minutes east. The framer the military community trusts.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-20 bg-cream">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl text-charcoal mb-6">
            Killeen's custom framer since 1995
          </h2>
          <div className="space-y-4 font-body text-sm text-charcoal/60 leading-relaxed">
            <p>
              Killeen is home to Fort Cavazos and 164,000 people — many of them
              military families with medals, flags, unit patches, certificates,
              and memorabilia that deserve more than a frame off the shelf.
              Salado Village Framer has been building shadow boxes and display
              cases for military families for thirty years. We know what these
              pieces mean to you, and we frame them accordingly.
            </p>
            <p>
              Beyond military framing, Killeen homeowners bring us family
              portraits, children's art, mirrors, needlework, and oversized
              pieces that the chain stores cannot handle. We work with
              conservation-grade materials on everything, because the things
              worth framing are the things worth protecting.
            </p>
            <p>
              Harker Heights is 18 minutes. Copperas Cove, 28. Both well within
              reach, and the quality of the work makes the drive worthwhile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            <Link href="/services" className="border border-stone/30 p-6 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-lg text-charcoal mb-2">Military Shadow Boxes</h3>
              <p className="font-body text-xs text-charcoal/50">Medals, flags, patches, and service memorabilia.</p>
            </Link>
            <Link href="/services" className="border border-stone/30 p-6 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-lg text-charcoal mb-2">Custom Framing</h3>
              <p className="font-body text-xs text-charcoal/50">Art, photos, certificates, and more.</p>
            </Link>
            <Link href="/services" className="border border-stone/30 p-6 hover:border-stone/60 transition-colors">
              <h3 className="font-display text-lg text-charcoal mb-2">Mirrors & Décor</h3>
              <p className="font-body text-xs text-charcoal/50">Custom-framed mirrors in any size.</p>
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
            Salado Village Framer serves custom framing clients from Killeen, Fort Cavazos,
            Harker Heights, Copperas Cove, Nolanville, and the greater Killeen-Temple metro.
            Located on Main Street in Salado, Texas 76571. Walk-ins welcome. 21 minutes east
            of Killeen via US-190.
          </p>
        </div>
      </section>
    </>
  )
}
