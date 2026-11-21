/**
 * No-JS / pre-hydration target for every inquiry form (G7-02).
 * When the page's script is running, the form's onSubmit sends JSON to /api/inquiry or
 * /api/start-framing and this route is never hit. If the browser submits natively instead
 * (JavaScript off, or a tap before the page finished loading), the details land here.
 * We do NOT process them: the body is discarded unread, and the visitor is sent with a 303
 * to a page that says plainly nothing was sent and gives the phone and email.
 * Nothing from the form goes into the redirect URL.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const toNotice = () =>
  new Response(null, { status: 303, headers: { Location: "/form-not-sent", "Cache-Control": "no-store" } });

export async function POST() {
  return toNotice();
}

export async function GET() {
  return toNotice();
}
