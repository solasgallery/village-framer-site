import Link from "next/link";
import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import { business } from "@/lib/site";
import StartCta from "@/components/StartCta";

export const metadata: Metadata = meta({
  title: "Custom Framing for Central Texas | Salado Village Framer",
  description:
    "One shop in Salado, Texas, just off Interstate 35, serving customers from Temple, Belton, Killeen, Georgetown, Round Rock and Waco. Start framing from home.",
  path: "/service-area",
});
const towns = ["Belton", "Temple", "Killeen", "Harker Heights", "Copperas Cove", "Georgetown", "Round Rock", "Cedar Park", "Leander", "Pflugerville", "Hutto", "Taylor", "Waco", "Austin"];
export default function ServiceArea() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Service area</p>
        <h1>One shop in Salado. Customers from across Central Texas.</h1>
        <p className="lede">
          We have a single storefront, in Salado just off Interstate 35. Customers come from the towns around us, and
          you can start your project from home before you make the trip.
        </p>
        <StartCta />
      </header>
      <section className="wrap section prose" style={{ paddingTop: 0 }}>
        <h2>Towns we hear from most</h2>
        <p>
          These are communities customers have told us they are coming from. They are not separate locations; the
          shop is in {business.locality}.
        </p>
        <ul className="town-list">
          {towns.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <h2>Three ways to work with us from a distance</h2>
        <ul>
          <li>Upload a photo and the size in <Link href="/start-framing">Start framing</Link>, preview it in real frames and get a ballpark.</li>
          <li>Drop the piece off when you are in Salado. Call first for anything large.</li>
          <li>Choose to ship it to us. We reply with how to pack it before you send anything.</li>
        </ul>
        <h2>Before you come</h2>
        <p>
          Bring the piece, a photo of the wall, and a budget you are comfortable with. Most projects start around $350
          and large pieces run $1,000 and up. Read the <Link href="/guides/how-to-measure-for-framing">measuring guide</Link>{" "}
          if you would like to send us a size first.
        </p>
        <p>
          <Link href="/visit" className="text-link">
            Hours and directions
          </Link>
        </p>
      </section>
    </>
  );
}
