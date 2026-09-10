import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";
export const metadata: Metadata = {
  title: "Stay inspired",
  alternates: { canonical: "/capture" },
  robots: { index: false, follow: true },
};
export default function Capture() {
  return (
    <section className="wrap section capture-page">
      <p className="eyebrow">Welcome to Village Framer</p>
      <h1>A little inspiration. From our shop to you.</h1>
      <p className="lede">
        Leave your details for occasional shop news, framing ideas, and a closer
        look at what we’re making.
      </p>
      <InquiryForm source="in-person-qr" compact />
    </section>
  );
}
