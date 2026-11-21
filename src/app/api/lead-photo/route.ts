import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { verifyPath } from "@/lib/leadLink";

export const runtime = "nodejs";

/** Serves a customer photo from the private store to anyone holding the signed link (Cherie's email) until it expires (30 days). */
export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams.get("p") || "";
  const s = request.nextUrl.searchParams.get("s") || "";
  const e = Number(request.nextUrl.searchParams.get("e"));
  if (!p.startsWith("framing-leads/") || !verifyPath(p, e, s))
    return new NextResponse("Not found", { status: 404 });
  const r = await get(p, { access: "private" }).catch(() => null);
  if (!r || r.statusCode !== 200 || !r.stream)
    return new NextResponse("Not found", { status: 404 });
  return new NextResponse(r.stream, {
    headers: {
      "content-type": r.blob.contentType || "image/jpeg",
      "cache-control": "private, max-age=300",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
