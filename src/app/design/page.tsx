import type { Metadata } from "next";
import DesignLoader from "@/components/design/DesignLoader";

export const metadata: Metadata = {
  title: "Design your frame",
  description:
    "Upload a photo of your art, see it live in real mouldings and mats, get a price estimate, and request a quote from our Salado shop.",
  alternates: { canonical: "/design" },
};

export default function DesignPage() {
  return <DesignLoader />;
}
