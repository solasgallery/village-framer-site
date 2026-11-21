/**
 * Single source of truth for NAP, hours, price anchors and every dated value.
 * Dates are ISO strings; anything shown to visitors is derived from here.
 */
export const SITE_URL = "https://saladovillageframer.com";

export const business = {
  name: "Salado Village Framer",
  streetAddress: "2 Rock Creek Dr Unit A",
  locality: "Salado",
  region: "TX",
  postalCode: "76571",
  phone: "(254) 613-6123",
  phoneHref: "tel:+12546136123",
  phoneE164: "+1-254-613-6123",
  email: "info@solasgallery.com",
  hours: "Monday–Saturday, 10am–5pm",
  hoursNote: "Sunday closed",
  nap: "Salado Village Framer · 2 Rock Creek Dr Unit A · Salado, TX 76571 · (254) 613-6123",
  mapsDirections:
    "https://www.google.com/maps/dir/?api=1&destination=Salado+Village+Framer+2+Rock+Creek+Dr+Unit+A+Salado+TX+76571",
  mapsReviews:
    "https://www.google.com/maps/place/Salado+Village+Framer/@30.9481788,-97.5363989,17z/",
  instagram: "https://www.instagram.com/saladovillageframer/",
  facebook: "https://www.facebook.com/103998722673775",
};

export const pricing = {
  startsAround: "$350",
  largeFrom: "$1,000",
  /** minimum shown by the estimator so it never undercuts the stated anchor */
  floor: 350,
  reviewedOn: "2026-11-21",
  reviewBy: "2027-05-21",
};

export const author = {
  name: "Cherie Flanagan",
  title: "Certified picture framer",
  line: "Written by Cherie Flanagan, certified picture framer. Thirty years at the bench; every piece is framed in our Salado shop.",
};

/** Bumped when page content is reviewed; feeds sitemap lastmod. */
export const contentReviewedOn = "2026-11-21";

export const START = "/start-framing";
export const phoneDisplay = business.phone;
