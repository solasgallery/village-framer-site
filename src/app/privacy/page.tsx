import type { Metadata } from "next";
import { meta } from "@/lib/seo";
export const metadata: Metadata = meta({
  title: "Privacy Policy | Salado Village Framer, Salado, Texas",
  description:
    "How Salado Village Framer handles the photos, contact details and framing requests you send us, including private photo storage and shop news sign-ups.",
  path: "/privacy",
});
export default function Privacy() {
  return (
    <article className="wrap section prose">
      <p className="eyebrow">Your information</p>
      <h1>Privacy</h1>
      <p className="lede">
        We use the information you share to respond to your inquiry and help
        with your framing project.
      </p>
      <h2>Photos and framing requests</h2>
      <p>
        When you send a request through Start framing, your photo, a preview image, the size and your contact
        details are stored in a private store and emailed to the shop. Photos are not public. We use them only to
        answer your request. Please share only images you have permission to share. Ask us to delete your photo at
        any time.
      </p>
      <h2>Contact details</h2>
      <p>
        Our website uses Brevo to store inquiry contacts and deliver
        notifications to our shop. If you sign up for shop news, you can
        unsubscribe from marketing emails using the link in those emails.
        Contact us to ask about or request deletion of information you have
        shared.
      </p>
      <h2>Website services</h2>
      <p>
        The site is hosted on Vercel. We use Google Tag Manager and Brevo
        website tracking to help understand website visits and campaign
        response. These services may use cookies and device information.
      </p>
      <h2>Questions?</h2>
      <p>
        Email <a href="mailto:info@solasgallery.com">info@solasgallery.com</a>{" "}
        or call <a href="tel:+12546136123">(254) 613-6123</a>. Our shop is at 2
        Rock Creek Dr Unit A, Salado, TX 76571.
      </p>
    </article>
  );
}
