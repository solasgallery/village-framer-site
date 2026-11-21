import type { Metadata } from "next";
import DesignLoader from "@/components/design/DesignLoader";
import { meta } from "@/lib/seo";

export const metadata: Metadata = meta({
  title: "Start Framing: Upload Art, See It Framed | Village Framer",
  description:
    "Upload a photo of your art, enter the size, preview sample mouldings and mats on a wall, and see a ballpark price. Then drop off, ship or book a consult.",
  path: "/start-framing",
});
export default function Page() {
  return <DesignLoader />;
}
