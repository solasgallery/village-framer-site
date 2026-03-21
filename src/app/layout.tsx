import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Salado Village Framer — Custom Framing & Décor | Salado, Texas',
    template: '%s | Salado Village Framer',
  },
  description:
    'Custom picture framing, art framing, and décor on Main Street in Salado, Texas. Sister business to Solas Gallery.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://saladovillageframer.com',
    siteName: 'Salado Village Framer',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
