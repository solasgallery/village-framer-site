import Link from "next/link";
import { business } from "@/lib/content";

/** The two standing calls to action: design it online, or call the shop. */
export default function CtaPair({
  onDark = false,
  className = "",
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div className={`actions cta-pair ${className}`.trim()}>
      <Link
        href="/design"
        className={`button ${onDark ? "button-gold" : "button-ink"}`}
      >
        Design your frame <span aria-hidden="true">↗</span>
      </Link>
      <a
        href={business.phoneHref}
        className={`button ${onDark ? "button-light" : "button-line"}`}
      >
        Call {business.phone}
      </a>
    </div>
  );
}
