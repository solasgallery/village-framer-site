"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { START } from "@/lib/site";
const links = [
  { href: "/services", label: "What we frame" },
  { href: "/guides", label: "Guides" },
  { href: "/gallery", label: "Our work" },
  { href: "/visit", label: "Visit" },
];
export default function Nav() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="announcement">
        Custom framing and Rifle Paper Co. gifts, made and sold in Salado.{" "}
        <Link href="/visit">Open Monday–Saturday, 10–5</Link>
      </div>
      <header className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/" className="wordmark" onClick={() => setOpen(false)} aria-label="Salado Village Framer home">
            <img src="/brand/village-framer-logo.svg" alt="Salado Village Framer" width="178" height="76" />
          </Link>
          <div className="desktop-links">
            {links.map((l) => (
              <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </div>
          <Link href={START} className="button button-ink nav-cta" onClick={() => setOpen(false)}>
            Start framing <span aria-hidden="true">→</span>
          </Link>
          <button className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
            {open ? "Close" : "Menu"} <span aria-hidden="true">{open ? "×" : "☰"}</span>
          </button>
        </nav>
        {open && (
          <nav id="mobile-nav" className="mobile-links" aria-label="Mobile navigation">
            {[{ href: START, label: "Start framing" }, ...links, { href: "/contact", label: "Contact us" }].map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
