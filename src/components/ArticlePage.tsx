import Image from "next/image";
import Link from "next/link";
import { all, type Article } from "@/lib/articles";
import { author, business, contentReviewedOn, SITE_URL } from "@/lib/site";
import StartCta from "./StartCta";

export default function ArticlePage({ a }: { a: Article }) {
  const rel = a.related.map((p) => all.find((x) => x.path === p)).filter(Boolean) as Article[];
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.h1,
    description: a.description,
    image: `${SITE_URL}/images/selected/${a.image}.webp`,
    datePublished: a.published,
    dateModified: contentReviewedOn,
    mainEntityOfPage: SITE_URL + a.path,
    author: { "@type": "Person", name: author.name, jobTitle: author.title },
    publisher: { "@type": "LocalBusiness", "@id": `${SITE_URL}/#shop`, name: business.name },
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: a.kind === "service" ? "What we frame" : "Guides", item: SITE_URL + (a.kind === "service" ? "/services" : "/guides") },
      { "@type": "ListItem", position: 3, name: a.h1, item: SITE_URL + a.path },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <header className="page-intro">
        <p className="eyebrow">{a.kind === "service" ? "What we frame" : "Framing guide"}</p>
        <h1>{a.h1}</h1>
        <p className="lede">{a.intro}</p>
        <StartCta />
      </header>
      <div className="wrap">
        <div className="editorial-hero">
          <Image src={`/images/selected/${a.image}.webp`} alt={a.imageAlt} fill priority sizes="90vw" />
        </div>
      </div>
      <article className="wrap section prose" style={{ paddingTop: 0 }}>
        <p className="byline">{author.line}</p>
        {a.blocks.map((b) => (
          <section key={b.h}>
            <h2>{b.h}</h2>
            {b.p.map((t) => (
              <p key={t}>{t}</p>
            ))}
            {b.list && (
              <ul>
                {b.list.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <aside className="article-cta">
          <h2>See it framed.</h2>
          <p>Upload a photo of your piece, see it in sample frames, and get a ballpark range.</p>
          <StartCta />
        </aside>
        <nav className="editorial-bottom" aria-label="Keep reading">
          {rel.map((x) => (
            <Link key={x.path} href={x.path} className="text-link">
              {x.h1.replace(/\.$/, "").replace(/\?$/, "")}
            </Link>
          ))}
        </nav>
      </article>
    </>
  );
}
