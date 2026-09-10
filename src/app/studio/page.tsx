import type { Metadata } from "next";
import FramingStudio from "@/components/studio/FramingStudio";
export const metadata: Metadata = {
  title: "Preview your artwork in a frame",
  description:
    "Upload your artwork, try frame and mat ideas, and see it on your wall. Send your concept to our Salado shop for personal framing guidance.",
  alternates: { canonical: "/studio" },
};
export default function StudioPage() {
  return <FramingStudio />;
}
