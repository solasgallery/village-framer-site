import { NextRequest, NextResponse } from "next/server";
import { matColors, mouldings } from "@/lib/design/catalog";
import {
  MAT_WIDTH_LABEL,
  MAX_LONG_SIDE_IN,
  MIN_SIDE_IN,
  estimate,
  money,
} from "@/lib/design/pricing";
import type { MatStyle, MatWidthKey } from "@/lib/design/types";

/**
 * POST /api/quote — lead from the /design visualizer (no checkout, no payment).
 *  1. Re-prices the design server-side (never trusts the browser's number).
 *  2. Emails the lead to NOTIFICATION_EMAIL (default info@solasgallery.com).
 *  3. Adds/updates the contact on the established Brevo list.
 * Credentials: BREVO_API_KEY (+ optional BREVO_LIST_ID, NOTIFICATION_EMAIL).
 * Without BREVO_API_KEY, non-production deployments STUB steps 2–3 and log the
 * payload; production returns 503 instead so a lead is never silently dropped.
 */
export const runtime = "nodejs";
const MAX_BODY = 2_000_000;
const fail = (error: string, status = 400) =>
  NextResponse.json({ error }, { status });
const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const MAT_STYLES: MatStyle[] = ["classic", "none", "float"];
const MAT_WIDTHS: MatWidthKey[] = ["thin", "standard", "wide"];
const CALL = "(254) 613-6123";

export async function POST(request: NextRequest) {
  try {
    if (Number(request.headers.get("content-length") || 0) > MAX_BODY)
      return fail("Your images are too large. Please try a smaller photo.", 413);
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
        return fail("Your images are too large. Please try a smaller photo.", 413);
      }
      chunks.push(value);
    }
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return fail("Please send a valid quote request.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      return fail("Please send a valid quote request.");
    if (body.website) return NextResponse.json({ success: true }); // honeypot

    const name = clean(body.name, 120);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 40);
    const notes = clean(body.notes, 2000);
    if (!name) return fail("Please enter your name.");
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))
      return fail("Please enter a valid email address.");
    const digits = phone.replace(/\D/g, "");
    if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith("1"))))
      return fail("Please enter a 10-digit phone number.");

    // ---- design -> server-side estimate
    const d = body.design;
    if (!d || typeof d !== "object" || Array.isArray(d))
      return fail("Please include your design.");
    const design = d as Record<string, unknown>;
    const artW = Number(design.artW);
    const artH = Number(design.artH);
    if (
      !Number.isFinite(artW) ||
      !Number.isFinite(artH) ||
      Math.min(artW, artH) < MIN_SIDE_IN ||
      Math.max(artW, artH) > MAX_LONG_SIDE_IN
    )
      return fail(
        `Please enter art sizes between ${MIN_SIDE_IN}″ and ${MAX_LONG_SIDE_IN}″.`,
      );
    const moulding = mouldings.find((m) => m.id === design.mouldingId);
    const matColor = matColors.find((m) => m.id === design.matColorId);
    const matStyle = MAT_STYLES.find((s) => s === design.matStyle);
    const matWidth = MAT_WIDTHS.find((s) => s === design.matWidth);
    if (!moulding || !matColor || !matStyle || !matWidth)
      return fail("Please choose a frame and mat for your design.");
    const est = estimate({ artW, artH, moulding, matStyle, matWidth, matColor });

    // ---- attachments (up to two reduced JPEGs)
    const attachment: { name: string; content: string }[] = [];
    if (body.attachments !== undefined) {
      if (!Array.isArray(body.attachments) || body.attachments.length > 2)
        return fail("Please send up to two preview images.");
      let total = 0;
      for (const item of body.attachments) {
        if (
          !item ||
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
          name: attachment.length === 0 ? "framing-concept.jpg" : "artwork-reference.jpg",
          content: item.content,
        });
      }
    }

    const rows: [string, string][] = [
      ["Name", name],
      ["Email", email],
      ["Phone", phone],
      ["Source", "Frame designer (/design) — quote request"],
      ["Art size", `${artW} × ${artH} inches`],
      ["Frame", `${moulding.name} — ${moulding.maker} (${moulding.colorFamily}, ${moulding.railWidthIn}" rail, ${moulding.priceTier} tier)`],
      [
        "Mat",
        matStyle === "none"
          ? "No mat"
          : `${matStyle === "float" ? "Float" : "Classic"}, ${matColor.name} (${matColor.group}), ${MAT_WIDTH_LABEL[matWidth]} — ${est.matIn}"`,
      ],
      ["Website estimate", `Estimated from ${money(est.from)} (calculated ${money(est.total)}) — final quote to be confirmed in the shop`],
      ["Notes", notes],
    ];

    const clientEstimate = Number(design.estimate);
    if (Number.isFinite(clientEstimate) && Math.abs(clientEstimate - est.total) > 5)
      console.warn("Quote estimate mismatch:", clientEstimate, "vs", est.total);

    const to = process.env.NOTIFICATION_EMAIL || "info@solasgallery.com";
    const apiKey = process.env.BREVO_API_KEY;
    const first = name.split(" ")[0];
    const last = name.split(" ").slice(1).join(" ");
    const sms =
      digits.length === 10 ? "+1" + digits : "+" + digits;
    const subject = `Frame quote request: ${name.replace(/[\r\n]/g, " ")} — est. ${money(est.from)}+`;

    if (!apiKey) {
      if (process.env.VERCEL_ENV === "production")
        return fail(
          `Online quotes are temporarily unavailable. Please call ${CALL}.`,
          503,
        );
      // STUB: no credentials in this environment. Log what WOULD be sent.
      console.log(
        "[quote:stub] BREVO_API_KEY not set — email + Brevo contact NOT sent.",
        JSON.stringify(
          {
            email: { to, replyTo: email, subject, rows, attachments: attachment.map((a) => ({ name: a.name, base64Chars: a.content.length })) },
            brevoContact: { email, attributes: { FIRSTNAME: first, LASTNAME: last, SMS: sms }, listIds: [Number(process.env.BREVO_LIST_ID) || 2], updateEnabled: true },
          },
          null,
          2,
        ),
      );
      return NextResponse.json({ success: true, stubbed: true });
    }

    const headers = {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    };
    // 1) the shop notification is the lead — send it first
    const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(12000),
      body: JSON.stringify({
        sender: { name: "Village Framer Website", email: "cherie@solasgallery.com" },
        to: [{ email: to, name: "Tim Flanagan" }],
        replyTo: { email, name },
        subject,
        htmlContent: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:32px;color:#202b2a"><h1 style="font-family:Georgia,serif">A new frame quote request</h1><table style="width:100%;border-collapse:collapse">${rows
          .filter(([, v]) => v)
          .map(
            ([k, v]) =>
              `<tr><th style="text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #ddd">${escape(k)}</th><td style="padding:10px;border-bottom:1px solid #ddd;white-space:pre-wrap">${escape(v)}</td></tr>`,
          )
          .join("")}</table>${attachment.length ? "<p>Attached: the designer concept (illustrative finishes) and the customer's artwork photo. Confirm moulding, matting, dimensions, and price in the shop.</p>" : ""}<p style="font-size:12px">Submitted through saladovillageframer.com/design. Reply to this email to contact the customer.</p></div>`,
        ...(attachment.length ? { attachment } : {}),
      }),
    });
    if (!emailRes.ok) {
      console.error("Brevo quote notification failed:", emailRes.status);
      return fail(
        `We could not confirm delivery. Please call ${CALL} before resending.`,
        502,
      );
    }
    // 2) add to the established Brevo list; the lead is already safe by email
    try {
      const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers,
        signal: AbortSignal.timeout(12000),
        body: JSON.stringify({
          email,
          attributes: { FIRSTNAME: first, LASTNAME: last, SMS: sms },
          listIds: [Number(process.env.BREVO_LIST_ID) || 2],
          updateEnabled: true,
        }),
      });
      if (!contactRes.ok)
        console.error("Brevo quote contact add failed:", contactRes.status);
    } catch {
      console.error("Brevo quote contact add errored");
    }
    return NextResponse.json({ success: true });
  } catch {
    console.error("Quote processing failed");
    return fail(
      `We could not confirm delivery. Please call ${CALL} or try again later.`,
      502,
    );
  }
}
