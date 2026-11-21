import { NextRequest, NextResponse } from "next/server";
import { allow, clientIp, hasCtl } from "@/lib/rateLimit";

export const runtime = "nodejs";
const MAX_BODY = 2_000_000;
const fail = (error: string, status = 400) =>
  NextResponse.json({ error }, { status });
const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
/** Strict: null when not a string or over the cap (the cap is enforced, not silently cut). */
const strict = (value: unknown, max: number): string | null =>
  value == null ? "" : typeof value === "string" && value.trim().length <= max ? value.trim() : null;
// Per IP, best-effort and in-memory (see src/lib/rateLimit.ts). Trade applications are longer, so allow a few.
const RATE = { max: 8, windowMs: 10 * 60_000 };
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const sourceNames: Record<string, string> = {
  "framing-studio": "Framing studio",
  contact: "Website inquiry",
  capture: "In-person QR",
  "in-person-qr": "In-person QR",
  website: "Website inquiry",
  trade: "Trade application",
};

export async function POST(request: NextRequest) {
  try {
    // Gate before any parsing, Blob/Brevo call or email.
    if (!allow("inquiry", clientIp(request.headers), RATE.max, RATE.windowMs))
      return NextResponse.json(
        { error: "Too many requests from this connection. Please wait a few minutes or call (254) 613-6123." },
        { status: 429, headers: { "Retry-After": "600" } },
      );
    if (Number(request.headers.get("content-length") || 0) > MAX_BODY)
      return fail("Your images are too large. Please try smaller photos.", 413);
    // Bound streamed requests too; do not rely on a client-supplied Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return fail("Please send your contact details.");
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY) {
        await reader.cancel();
        return fail(
          "Your images are too large. Please try smaller photos.",
          413,
        );
      }
      chunks.push(value);
    }
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return fail("Please send a valid inquiry.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      return fail("Please send a valid inquiry.");
    if (body.website) return NextResponse.json({ success: true });
    const nameS = strict(body.name, 120),
      emailS = strict(body.email, 254),
      phone = strict(body.phone, 40),
      messageS = strict(body.message, 3000);
    if (nameS === null || emailS === null || phone === null || messageS === null)
      return fail("One of your answers is too long. Please shorten it and try again.");
    if (hasCtl(nameS) || hasCtl(emailS) || hasCtl(phone))
      return fail("Please remove line breaks from your name, email and phone.");
    const name = nameS,
      email = emailS.toLowerCase(),
      message = messageS.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (!name || !/^[^\s@<>",;:()\[\]\\]+@[^\s@<>",;:()\[\]\\]+\.[^\s@<>",;:()\[\]\\]+$/.test(email))
      return fail("Please enter your name and a valid email address.");
    const source = sourceNames[clean(body.source, 60)] || "Website inquiry";
    const project =
      body.project &&
      typeof body.project === "object" &&
      !Array.isArray(body.project)
        ? (body.project as Record<string, unknown>)
        : null;
    const rows: [string, string][] = [
      ["Name", name],
      ["Email", email],
      ["Phone", phone],
      ["Source", source],
      ["Message", message],
    ];
    if (project) {
      for (const [label, key] of [
        ["Frame direction", "frame"],
        ["Mat direction", "mat"],
        ["City", "city"],
      ] as const)
        rows.push([label, clean(project[key], 120)]);
      rows.push([
        "Fillet",
        project.fillet === true ? "Gold fillet requested" : "None selected",
      ]);
      const dimension = (value: unknown) =>
        value === "" || value == null ? "" : Number(value);
      const width = dimension(project.width),
        height = dimension(project.height);
      for (const value of [width, height])
        if (
          value !== "" &&
          (!Number.isFinite(value) || Number(value) < 1 || Number(value) > 300)
        )
          return fail(
            "Please enter approximate dimensions between 1 and 300 inches.",
          );
      rows.push([
        "Approximate art size",
        `${width || "Not supplied"} × ${height || "Not supplied"} inches`,
      ]);
    }
    const attachment: { name: string; content: string }[] = [];
    if (body.attachments !== undefined) {
      if (!Array.isArray(body.attachments) || body.attachments.length > 2)
        return fail("Please send up to two preview images.");
      let total = 0;
      for (const item of body.attachments) {
        if (
          !item ||
          typeof item.name !== "string" ||
          !/\.jpe?g$/i.test(item.name) ||
          typeof item.content !== "string" ||
          item.content.length > 750000 ||
          !/^[A-Za-z0-9+/]+={0,2}$/.test(item.content)
        )
          return fail("Please send a valid JPEG preview.");
        const data = Buffer.from(item.content, "base64");
        total += data.length;
        if (
          data.length < 4 ||
          data[0] !== 0xff ||
          data[1] !== 0xd8 ||
          data[2] !== 0xff ||
          total > 1_100_000
        )
          return fail("Please send valid JPEG previews within the size limit.");
        attachment.push({
          name:
            attachment.length === 0
              ? "framing-concept.jpg"
              : "artwork-reference.jpg",
          content: item.content,
        });
      }
    }
    // Test hook for local/preview curl tests: validate, send nothing. Never active in production.
    if (process.env.VERCEL_ENV !== "production" && process.env.SVF_DRY_RUN === "1")
      return NextResponse.json({ success: true, dryRun: true });
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey)
      return fail(
        "Online inquiries are temporarily unavailable. Please call (254) 613-6123.",
        503,
      );
    const headers = {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    };
    const attributes: Record<string, string> = {
      FIRSTNAME: name.split(" ")[0],
      LASTNAME: name.split(" ").slice(1).join(" "),
    };
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) attributes.SMS = "+1" + digits;
    else if (digits.length === 11 && digits.startsWith("1"))
      attributes.SMS = "+" + digits;
    const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(12000),
      body: JSON.stringify({
        sender: {
          name: "Village Framer Website",
          email: "cherie@solasgallery.com",
        },
        to: [
          {
            email: process.env.NOTIFICATION_EMAIL || "info@solasgallery.com",
            name: "Tim Flanagan",
          },
        ],
        replyTo: { email, name },
        subject: `${process.env.VERCEL_ENV === "production" ? "" : "[PREVIEW TEST] "}${source}: ${name.replace(/[\r\n]/g, " ")}`,
        htmlContent: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:32px;color:#202b2a"><h1 style="font-family:Georgia,serif">${source === sourceNames.trade ? "New trade application" : "A new framing conversation"}</h1><table style="width:100%;border-collapse:collapse">${rows
          .filter(([, v]) => v)
          .map(
            ([k, v]) =>
              `<tr><th style="text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #ddd">${escape(k)}</th><td style="padding:10px;border-bottom:1px solid #ddd;white-space:pre-wrap">${escape(v)}</td></tr>`,
          )
          .join(
            "",
          )}</table>${attachment.length ? "<p>The attached concept uses illustrative finishes. Confirm the actual moulding, matting, dimensions, and budget in the shop.</p>" : ""}<p style="font-size:12px">Submitted through saladovillageframer.com. Reply to this email to contact the visitor.</p></div>`,
        ...(attachment.length ? { attachment } : {}),
      }),
    });
    if (!emailRes.ok) {
      console.error("Brevo notification failed:", emailRes.status);
      return fail(
        "We could not confirm delivery. Please call (254) 613-6123 before resending.",
        502,
      );
    }
    // Keep the established Brevo list; clients cannot select another list.
    // The notification above is the lead; a list-add failure must never fail
    // the request, so it is logged and swallowed.
    try {
      if (process.env.VERCEL_ENV !== "production") return NextResponse.json({ success: true });
      const listId = Number(process.env.BREVO_LIST_ID);
      if (!listId) {
        console.error("Brevo list add skipped: BREVO_LIST_ID is not set");
        return NextResponse.json({ success: true });
      }
      const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers,
        signal: AbortSignal.timeout(12000),
        body: JSON.stringify({ email, attributes, listIds: [listId], updateEnabled: true }),
      });
      if (!contactRes.ok)
        console.error("Brevo contact request failed:", contactRes.status, await contactRes.text().catch(() => ""));
    } catch {
      console.error("Brevo contact request errored");
    }
    return NextResponse.json({ success: true });
  } catch {
    console.error("Inquiry processing failed");
    return fail(
      "We could not confirm delivery. Please call (254) 613-6123 or try again later.",
      502,
    );
  }
}
