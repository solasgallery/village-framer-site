import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  return (
    <article className="wrap section prose">
      <p className="eyebrow">Your information</p>
      <h1>Privacy</h1>
      <p className="lede">
        We use the information you share to respond to your inquiry and help
        with your framing project.
      </p>
      <h2>Photos and framing previews</h2>
      <p>
        Photos selected in the framing studio are processed in your browser.
        When you choose “Send my concept to the shop,” a reduced-size artwork
        reference and your concept are sent with your contact details. If you
        included a room photo, it appears in the concept. Please share only
        images you have permission to share.
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
        Rock Creek Dr, Unit A, Salado, TX 76571.
      </p>
    </article>
  );
}
