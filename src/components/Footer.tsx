"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { business, START } from "@/lib/site";

export const NAP_IN_PAGE = ["/", "/visit", "/contact"];

export default function Footer() {
  const path = usePathname();
  // Pages whose own body already carries the full address, phone and hours.
  // The footer adds its "Find us in Salado." block everywhere else, so NAP shows once per page.
  const napInPage = NAP_IN_PAGE.includes(path);
  return (
    <>
      <footer className="site-footer">
        <div className="footer-top wrap">
          <div>
            <p className="eyebrow">Custom framing in Salado</p>
            <h2>
              Ready to frame
              <br />
              <em>something?</em>
            </h2>
            <Link href={START} className="button button-gold">
              Start framing <span aria-hidden="true">→</span>
            </Link>
          </div>
          {!napInPage && (
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
            <Link href="/areas">Areas we serve</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/trade">Trade</Link>
            <a href={business.instagram}>Instagram</a>
            <a href={business.facebook}>Facebook</a>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
      {/* No Start framing bar on /capture: it is the in-shop QR sign-up page (G9-01). */}
      {path !== START && path !== "/capture" && (
        <div className="sticky-cta">
          <Link href={START} className="button button-ink">
            Start framing <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </>
  );
}
