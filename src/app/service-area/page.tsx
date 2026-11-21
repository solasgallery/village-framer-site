import Link from "next/link";
import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import { business } from "@/lib/site";
import StartCta from "@/components/StartCta";

export const metadata: Metadata = meta({
  title: "Custom Framing Near Salado, TX | Salado Village Framer",
  description:
    "One framing shop in Salado, Texas, just off Interstate 35. See the towns around Salado and start your framing project from home with a photo and a size.",
  path: "/service-area",
});
const towns = ["Belton", "Temple", "Killeen", "Harker Heights", "Copperas Cove", "Georgetown", "Round Rock", "Cedar Park", "Leander", "Pflugerville", "Hutto", "Taylor", "Waco", "Austin"];
export default function ServiceArea() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Service area</p>
        <h1>One shop in Salado, and the towns around it.</h1>
        <p className="lede">
          We have a single storefront, in Salado just off Interstate 35. You can start your project from home before you
          make the trip.
        </p>
        <StartCta />
      </header>
      <section className="wrap section prose" style={{ paddingTop: 0 }}>
        <h2>Towns around Salado</h2>
        <p>
          These are towns near the shop. They are not separate locations; the
          shop is in {business.locality}.
        </p>
        <ul className="town-list">
          {towns.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <h2>Three ways to work with us from a distance</h2>
        <ul>
          <li>Upload a photo and the size in <Link href="/start-framing">Start framing</Link>, preview frame styles and get a ballpark.</li>
          <li>Drop the piece off when you are in Salado. Call first for anything large.</li>
          <li>Choose to ship it to us. Cherie replies before you send anything.</li>
        </ul>
        <h2>Before you come</h2>
        <p>
          Bring the piece, a photo of the wall, and a budget you are comfortable with. Most framing starts around $350.
          Large pieces often run $1,000 and up. Read the <Link href="/guides/how-to-measure-for-framing">measuring guide</Link>{" "}
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
