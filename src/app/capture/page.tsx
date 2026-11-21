import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import InquiryForm from "@/components/InquiryForm";
export const metadata: Metadata = meta({
  title: "Stay Inspired | Salado Village Framer Shop News and Ideas",
  description:
    "Leave your name and email to get occasional news and framing ideas from Salado Village Framer, the custom frame shop on Rock Creek Drive in Salado, Texas.",
  path: "/capture",
  noindex: true,
});
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
