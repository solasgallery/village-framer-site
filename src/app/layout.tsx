import type { Metadata } from "next";
import Script from "next/script";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import "./globals.css";
import "./site2.css";
import { business, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/brand/village-framer-mini.svg" },
  verification: {
    google: "AT_R1LQkNEO23NS0uQTrc2F8UYTRxVybtN1HlyykDy4",
  },
  ...(process.env.VERCEL_ENV === "preview" && {
    robots: { index: false, follow: false },
  }),
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#faf7f0" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": `${SITE_URL}/#shop`,
              name: business.name,
              url: SITE_URL,
              image: `${SITE_URL}/images/selected/shop-at-dusk.webp`,
              logo: `${SITE_URL}/brand/village-framer-logo.svg`,
              telephone: business.phoneE164,
              description:
                "Custom picture framing in Salado, Texas, plus Rifle Paper Co. gifts. Every piece is framed in the shop.",
              address: {
                "@type": "PostalAddress",
                streetAddress: business.streetAddress,
                addressLocality: business.locality,
                addressRegion: business.region,
                postalCode: business.postalCode,
                addressCountry: "US",
              },
              geo: { "@type": "GeoCoordinates", latitude: 30.9481788, longitude: -97.5363989 },
              hasMap: business.mapsReviews,
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "10:00",
                  closes: "17:00",
                },
              ],
              sameAs: [business.instagram, business.facebook],
            }),
          }}
        />
        <Analytics />
        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
