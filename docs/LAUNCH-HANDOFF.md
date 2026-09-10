# Village Framer launch — September 10, 2026

## Architecture preserved
Next.js 14 App Router, React 18, TypeScript and Tailwind. Existing package.json and package-lock.json retained. GitHub solasgallery/village-framer-site deploys through the existing Vercel village-framer-site project. Production domain is saladovillageframer.com. No new database, CMS, paid service or hosting platform was added. LifeSaver is outside this project.

## Business facts
2 Rock Creek Dr, Unit A, Salado, TX 76571. Monday–Saturday 10am–5pm; Sunday closed. (254) 613-6123. 30 years of experience, not an inferred founding year. Framing work stays in the Salado shop. In-store sales; no checkout. Budget guidance starts around $350, larger work can exceed $1,000.

## Pages and assets
Original visual system uses supplied brand SVGs and genuine shop/project photos. Optimized selected WebP assets are in public/images/selected. Original exports were not changed. Home, services, gallery, visit, contact, capture, privacy, studio, journal (two articles), regional hub and sixteen destination pages. Existing five area URLs remain valid through a shared dynamic route with static generation. There are no claimed storefronts outside Salado. Existing trade rewrites and alias-domain redirects remain intact.

Editorial copy is in src/lib/content.ts and more-cities.ts. Shared destination/article rendering is in components/Editorial.tsx. Site styles are in app/globals.css. The studio has its own scoped stylesheet. No Framebridge code, images or copy were reused.

## Framing studio
Client-side JPEG/PNG/WebP upload, max25MB; photos are downscaled in the browser. Four illustrative finish directions and four mats, three mat widths, optional gold fillet. Optional room photo with placement/size sliders. Dimensions are notes for the shop, not a measured rendering. Download JPEG or send concept and artwork reference. No catalog stock, SKU, exact price or manufacturing claims. Supplier imagery can later replace the illustrative finish data after the real catalog assets arrive.

## Inquiry contract
POST /api/inquiry retains Brevo contact create/update, server-owned list2, then a transactional shop notification. BREVO_API_KEY remains in Vercel. Optional NOTIFICATION_EMAIL defaults info@solasgallery.com; BREVO_LIST_ID defaults2. Sender remains cherie@solasgallery.com. Client cannot override listId. Server validates required fields, bounds body/attachments, escapes email HTML, normalizes ordinary US phone numbers, checks honeypot, includes project fields and up to two reduced JPEG attachments. Success requires both contact and notification requests to succeed. Errors have a call-the-shop fallback. Raw images are not stored on this server; submitted images persist in email/Brevo services. Room photos appear in submitted concepts when used.

/capture remains the in-person QR signup. /contact is project inquiry. /studio submits the concept. No credentials are in source control. There is no durable rate limiter or public file store; honeypot and request-size limits are included.

## Discovery and measurement
Page canonicals, sitemap, robots and Store JSON-LD use the actual Salado storefront and corrected hours. Existing Google verification, GTM-TCJR9HV, and Brevo tracking are preserved. Events: svf_inquiry_success (only confirmed success), svf_phone_click, svf_directions_click, svf_studio_open. No names, emails or photos are included in those events. GTM/Ads conversion setup is a separate task; merely emitting an event does not configure an Ads conversion.

## Follow-on work
Import actual Roma/Larson-Juhl data and licensed images. Add documented project stories and customer hometowns only when supplied. Prepare Search Ads separately; no campaign or spend was started. SocialBee drafts need review before scheduling. GBP remains a brick-and-mortar profile; no service areas added. SolasGallery.com and HUBSalado.com are separate projects.

## Validation
Production build, TypeScript, mocked Brevo route tests, local HTTP route checks, and browser visual checks. See validation results recorded with launch completion. Roll back with Vercel Instant Rollback to the previous production deployment if needed; source baseline edc4d8a2105c0e5f184b4b72713ddfd6fe4c2cae.

## Confirmed launch result
Production launched through PR #4 (https://github.com/solasgallery/village-framer-site/pull/4), merge be07fe6299503836554d538ed006c25135849eef. Follow-up commit 9157d1a adds three coordinated JPEG files under public/social. Live 27-page HTTP/canonical checks and 35 image checks passed; 37 mocked inquiry tests passed. Mobile upload, frame/mat/fillet selection and room placement were exercised. A clearly labeled live test submitted from /studio succeeded after Brevo accepted contact and notification requests with concept/artwork attachments. Inbox receipt was not independently inspected. The browser download event could not be independently verified.

SocialBee Content Approval contains three new, unapproved, unscheduled text drafts for the SVF Facebook and Google profiles: “The frame starts with a conversation.”, “Some pieces need a little more room.” and “Curious how your artwork might look in a new frame?” Existing Copilot posts were untouched. Image attachment was blocked by Chrome extension file-URL permission; Instagram drafts therefore remain to be added. Matching JPEGs are available at /social/workshop.jpg, /social/large-framing.jpg and /social/moulding-samples.jpg. No social post was published and no recurring posting schedule was enabled. Review at https://app.socialbee.com/content/approval.
