import Image from "next/image";
import Link from "next/link";
import type { EditorialPage } from "@/lib/content";
export default function Editorial({
  page,
  image,
  kind = "journal",
}: {
  page: EditorialPage;
  image: string;
  kind?: "journal" | "area";
}) {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">
          {kind === "journal"
            ? "Notes from the frame shop"
            : "Central Texas · Our shop is in Salado"}
        </p>
        <h1>{page.title}</h1>
        <p className="lede">{page.intro}</p>
        {kind === "area" && (
          <div className="actions">
            <Link href="/studio" className="button button-ink">
              Start with your artwork ↗
            </Link>
            <Link href="/visit" className="text-link">
              Plan your visit ↗
            </Link>
          </div>
        )}
      </header>
      <div className="wrap">
        <div className="editorial-hero">
          <Image
            src={`/images/selected/${image}.webp`}
            alt={
              kind === "journal"
                ? "A look at our framing work in Salado"
                : "Inside our Salado frame shop and the work made here"
            }
            fill
            sizes="90vw"
          />
        </div>
      </div>
      <article className="wrap section prose" style={{ paddingTop: 0 }}>
        {page.sections.map((x) => (
          <section key={x.heading}>
            <h2>{x.heading}</h2>
            <p>{x.body}</p>
          </section>
        ))}
        <nav className="editorial-bottom" aria-label="Keep exploring">
          {page.relatedLinks.map((x) => (
            <Link key={x.href} href={x.href} className="text-link">
              {x.label} ↗
            </Link>
          ))}
          <Link
            href={kind === "journal" ? "/journal" : "/area"}
            className="text-link"
          >
            {kind === "journal" ? "All journal notes" : "Across Central Texas"}{" "}
            ↗
          </Link>
        </nav>
      </article>
    </>
  );
}
