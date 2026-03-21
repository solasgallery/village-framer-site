'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const links = [
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/visit', label: 'Visit' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream/95 backdrop-blur-sm shadow-[0_1px_0_rgba(196,174,138,0.3)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        <Link href="/" className="flex flex-col items-start">
          <span
            className={`font-display text-lg md:text-xl tracking-[0.18em] uppercase transition-colors duration-500 ${
              scrolled ? 'text-charcoal' : 'text-cream'
            }`}
          >
            Salado Village Framer
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${
                scrolled ? 'text-charcoal/70 hover:text-charcoal' : 'text-cream/80 hover:text-cream'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden transition-colors duration-500 ${scrolled ? 'text-charcoal' : 'text-cream'}`}
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-cream/98 backdrop-blur-sm border-t border-stone/20">
          <div className="flex flex-col items-center py-8 gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="nav-link text-charcoal/70 hover:text-charcoal"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
