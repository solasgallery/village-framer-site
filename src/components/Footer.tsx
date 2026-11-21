"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { business, START } from "@/lib/site";

export default function Footer() {
  const path = usePathname();
  const home = path === "/";
  return (
    <>
      <footer className="site-footer">
        <div className="footer-top wrap">
          <div>
            <p className="eyebrow">Your piece. Our personal attention.</p>
            <h2>
              Some things deserve
              <br />
              <em>a beautiful frame.</em>
            </h2>
            <Link href={START} className="button button-gold">
              Start framing <span aria-hidden="true">→</span>
            </Link>
          </div>
          {/* The homepage already carries the address once, in its Visit section. */}
          {!home && (
            <div className="footer-contact">
              <h3>Find us in Salado.</h3>
              <address>
                {business.name}
                <br />
                {business.streetAddress}
                <br />
                {business.locality}, {business.region} {business.postalCode}
              </address>
              <p>
                {business.hours}
                <br />
                {business.hoursNote}
              </p>
              <a href={business.phoneHref}>{business.phone}</a>
            </div>
          )}
        </div>
        <div className="footer-bottom wrap">
          <p>© {new Date().getFullYear()} Salado Village Framer</p>
          <div>
            <Link href="/services">What we frame</Link>
            <Link href="/guides">Guides</Link>
            <Link href="/service-area">Service area</Link>
            <Link href="/contact">Contact</Link>
            <a href={business.instagram}>Instagram</a>
            <a href={business.facebook}>Facebook</a>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
      {path !== START && (
        <div className="sticky-cta">
          <Link href={START} className="button button-ink">
            Start framing <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </>
  );
}
