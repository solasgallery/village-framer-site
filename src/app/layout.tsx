import type { Metadata } from 'next'
import Script from 'next/script'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://saladovillageframer.com'),
  title: {
    default: 'Salado Village Framer — Custom Framing & Décor | Salado, TX',
    template: '%s | Salado Village Framer \u2014 Salado, TX',
  },
  description:
    'Custom picture framing, art framing, and décor on Main Street in Salado, Texas. Sister business to Solas Gallery.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://saladovillageframer.com',
    siteName: 'Salado Village Framer',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Salado Village Framer — Custom Framing & Décor, Salado, Texas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salado Village Framer — Custom Framing & Décor | Salado, TX',
    description:
      'Custom picture framing, art framing, and décor on Main Street in Salado, Texas.',
    images: ['/og-default.jpg'],
  },
  // TODO: replace placeholder with token from search.google.com/search-console
  verification: {
    google: 'REPLACE_WITH_GSC_TOKEN',
  },
  ...(process.env.VERCEL_ENV === 'preview' && {
    robots: { index: false, follow: false },
  }),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
          Google Tag Manager
          Container: GTM-TCJR9HV
          IMPORTANT: this snippet only loads the container.
          GA4, Meta Pixel, and Brevo are configured INSIDE GTM as tags.
          If tracking isn't firing, the container is likely unpublished —
          open tagmanager.google.com > the container > Submit > Publish.
        */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TCJR9HV');`}
        </Script>

        {/*
          Brevo page-view tracker — required for 30th anniversary
          reconnect campaign attribution (shared Solas/Framer contact list).
        */}
        <Script
          id="brevo-sdk"
          src="https://cdn.brevo.com/js/sdk-loader.js"
          strategy="afterInteractive"
          async
        />
        <Script id="brevo-init" strategy="afterInteractive">
          {`window.Brevo = window.Brevo || [];
          Brevo.push(["init", { client_key: "9u1hsxe9gvu5e6i2ar4j28q2" }]);`}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TCJR9HV"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
