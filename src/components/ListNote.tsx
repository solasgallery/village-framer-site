import { business } from "@/lib/site";

/** What the server did with a shop-news opt-in (see /api/inquiry and /api/start-framing). */
export type ListStatus = "none" | "preview" | "added" | "failed";

export const listStatus = (value: unknown): ListStatus =>
  value === "added" || value === "preview" || value === "none" ? value : "failed";

/** One honest line under a success message when the visitor ticked the shop-news box. */
export function ListNote({ status }: { status: ListStatus }) {
  if (status === "added") return <p>You’re signed up for occasional shop news. Unsubscribe any time.</p>;
  if (status === "preview")
    return <p className="form-note">Preview site: nothing was added to the shop news list.</p>;
  if (status === "failed")
    return (
      <p>
        We couldn’t add you to shop news just now. Call{" "}
        <a href={business.phoneHref}>{business.phone}</a> or email{" "}
        <a href={`mailto:${business.email}`}>{business.email}</a> and we’ll add you.
      </p>
    );
  return null;
}
