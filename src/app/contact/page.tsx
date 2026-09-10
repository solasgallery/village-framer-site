import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";
export const metadata: Metadata = {
  title: "Tell us about your framing project",
  description:
    "Start a conversation with Salado Village Framer. Share your artwork, size, and ideas before visiting our Salado shop.",
  alternates: { canonical: "/contact" },
};
export default function Contact() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Start a conversation</p>
        <h1>Tell us what you have in mind.</h1>
        <p className="lede">
          A little detail is all we need to begin. For an unusually large piece,
          send dimensions before making the trip.
        </p>
      </header>
      <section className="wrap section contact-layout">
        <div>
          <h2>We’re listening.</h2>
          <p className="lede">
            Call{" "}
            <a href="tel:+12546136123" className="text-link">
              (254) 613-6123
            </a>
            <br />
            or email{" "}
            <a href="mailto:info@solasgallery.com" className="text-link">
              info@solasgallery.com
            </a>
          </p>
          <p className="lede">
            Monday–Saturday, 10am–5pm.
            <br />2 Rock Creek Dr, Unit A<br />
            Salado, Texas 76571
          </p>
          <a href="/studio" className="text-link" style={{ marginTop: 24 }}>
            Want to send a visual idea? Try the studio ↗
          </a>
        </div>
        <InquiryForm />
      </section>
    </>
  );
}
