import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Gallery — Recent Framing Work',
  description: 'Custom framing examples from Salado Village Framer. Art framing, shadow boxes, mirrors, and more.',
  alternates: {
    canonical: '/gallery',
  },
  openGraph: {
    title: 'Gallery — Recent Framing Work',
    description: 'Custom framing examples from Salado Village Framer — art, shadow boxes, mirrors, and more.',
    url: 'https://saladovillageframer.com/gallery',
    type: 'website',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Gallery — Recent Framing Work | Salado Village Framer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gallery — Recent Framing Work',
    description: 'Custom framing examples from Salado Village Framer — art, shadow boxes, mirrors, and more.',
    images: ['/og-default.jpg'],
  },
}

export default function GalleryPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[350px] w-full overflow-hidden bg-deep">
        <Image
          src="/images/gallery/hero.jpg"
          alt="Framed pieces on display"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="font-display text-4xl md:text-5xl text-cream tracking-[0.1em]">Gallery</h1>
          <p className="font-body text-sm text-cream/50 tracking-[0.15em] uppercase mt-4">
            Recent custom framing work
          </p>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8,9,11,12,13,14,15,16].map((n) => (
            <div key={n} className="relative aspect-square overflow-hidden group">
              <Image
                src={`/images/gallery/frame-${String(n).padStart(2, '0')}.jpg`}
                alt={`Custom framing example ${n}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
