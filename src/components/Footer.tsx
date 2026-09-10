import Link from "next/link";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top wrap">
        <div>
          <p className="eyebrow">Your piece. Our personal attention.</p>
          <h2>
            Some things deserve
            <br />
            <em>a beautiful frame.</em>
          </h2>
          <Link href="/studio" className="button button-gold">
            Explore your framing idea <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="footer-contact">
          <h3>Find us in Salado.</h3>
          <p>
            2 Rock Creek Dr, Unit A<br />
            Salado, Texas 76571
          </p>
          <p>
            Monday–Saturday, 10 am–5 pm
            <br />
            Sunday closed
          </p>
          <a href="tel:+12546136123">(254) 613-6123</a>
          <a href="mailto:info@solasgallery.com">info@solasgallery.com</a>
        </div>
      </div>
      <div className="footer-bottom wrap">
        <p>© {new Date().getFullYear()} Salado Village Framer</p>
        <div>
          <Link href="/area">Central Texas</Link>
          <a href="https://www.instagram.com/saladovillageframer/">Instagram</a>
          <a href="https://www.facebook.com/103998722673775">Facebook</a>
          <Link href="/privacy">Privacy</Link>
          <a href="https://solasgallery.com">Solas Gallery ↗</a>
        </div>
      </div>
    </footer>
  );
}
