import data from "@/data/reviews.json";
import { business } from "@/lib/site";

/** Verified Google reviews only, straight from src/data/reviews.json. Renders nothing when the file has none. */
export default function Reviews() {
  const list = data.reviews.filter((r) => r.name && r.text);
  if (!list.length) return null;
  const when = new Date(data.checkedOn + "T12:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "America/Chicago" });
  return (
    <section className="wrap section reviews" id="reviews">
      <div className="section-heading">
        <div>
          <p className="eyebrow">What customers say</p>
          <h2>In their words.</h2>
        </div>
        <p>
          {data.overall.rating} out of 5 on Google from {data.overall.count} reviews, as of {when}.
        </p>
      </div>
      <ul className="review-grid">
        {list.map((r) => (
          <li key={r.name}>
            <figure>
              <p className="stars" role="img" aria-label={`${r.rating} out of 5 stars`}>
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </p>
              <blockquote>{r.text}</blockquote>
              <figcaption>
                {r.name} · Google review
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <a className="text-link" href={business.mapsReviews} target="_blank" rel="noopener noreferrer">
        Read them on Google
      </a>
    </section>
  );
}
