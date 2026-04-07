export default function Footer() {
  return (
    <footer className="bg-deep text-cream/60">
      <div className="max-w-7xl mx-auto section-pad">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-display text-xl tracking-[0.15em] uppercase text-cream mb-4">
              Salado Village Framer
            </h3>
            <p className="font-body text-sm leading-relaxed">
              Custom framing and décor on Main Street.
            </p>
            <p className="font-body text-sm mt-4">
              2 Rock Creek Dr Unit A<br />
              Salado, Texas 76571
              <br />
              <a href="tel:+12546136123" className="hover:text-cream transition-colors">(254) 613-6123</a>
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm tracking-[0.15em] uppercase text-stone mb-6">Navigate</h4>
            <div className="flex flex-col gap-3">
              <a href="/services" className="font-body text-sm hover:text-cream transition-colors">Services</a>
              <a href="/gallery" className="font-body text-sm hover:text-cream transition-colors">Gallery</a>
              <a href="/visit" className="font-body text-sm hover:text-cream transition-colors">Visit</a>
              <a href="/contact" className="font-body text-sm hover:text-cream transition-colors">Contact</a>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm tracking-[0.15em] uppercase text-stone mb-6">Sister Business</h4>
            <p className="font-body text-sm leading-relaxed">
              Fine art and portraits at{' '}
              <a href="https://solasgallery.com" className="text-stone hover:text-cream transition-colors">
                Solas Gallery &rarr;
              </a>
            </p>
          </div>
        </div>
        <div className="mt-14 pt-8 border-t border-cream/10 text-center">
          <p className="font-body text-xs text-cream/30">
            &copy; {new Date().getFullYear()} Salado Village Framer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
