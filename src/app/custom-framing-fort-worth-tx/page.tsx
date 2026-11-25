import AreaPage, { areaMetadata } from "@/components/AreaPage";

const slug = "custom-framing-fort-worth-tx";
export const metadata = areaMetadata(slug);
export default function Page() {
  return <AreaPage slug={slug} />;
}
