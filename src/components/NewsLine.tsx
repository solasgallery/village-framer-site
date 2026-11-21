import Link from "next/link";

/** One quiet line pointing to the shop-news sign-up (/capture). Wording reuses the /capture page's own lede. */
export default function NewsLine() {
  return (
    <p className="news-line">
      For occasional shop news, framing ideas, and a closer look at what we’re making,{" "}
      <Link href="/capture">leave your details here</Link>.
    </p>
  );
}
