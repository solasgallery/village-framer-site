import Link from "next/link";
import { START } from "@/lib/site";

/** The one primary call to action. Same words, same place, every page. */
export default function StartCta({
  onDark = false,
  className = "",
  label = "Start framing",
  secondary,
}: {
  onDark?: boolean;
  className?: string;
  label?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <div className={`actions ${className}`.trim()}>
      <Link href={START} className={`button ${onDark ? "button-gold" : "button-ink"}`}>
        {label} <span aria-hidden="true">→</span>
      </Link>
      {secondary && (
        <Link href={secondary.href} className="text-link">
          {secondary.label}
        </Link>
      )}
    </div>
  );
}
