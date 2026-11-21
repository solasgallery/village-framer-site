import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomBytes } from "node:crypto";
import { matColors, mouldings } from "@/lib/design/catalog";
import { ESTIMATE_NOTE, MAT_WIDTH_LABEL, MAX_LONG_SIDE_IN, MIN_SIDE_IN, ballpark, layout } from "@/lib/design/pricing";
import type { MatStyle, MatWidthKey } from "@/lib/design/types";
import { LINK_TTL_MS, signPath } from "@/lib/leadLink";
import { business } from "@/lib/site";

/**
 * POST /api/start-framing — the "Start framing" flow.
 *  1. Validates the design server-side and works out the same ballpark band the page showed (no per-frame prices).
 *  2. Stores the customer photo and the concept image in a PRIVATE Vercel Blob store.
 *  3. Emails Cherie (LEADS_TO) with signed photo links + the attached images.
 *  4. Emails the customer a confirmation.
 *  5. Adds to the Brevo marketing list ONLY if the visitor ticked the box AND this is production.
 * Anything that is not production (preview / local) prefixes subjects with [PREVIEW TEST] and never touches lists.
 */
export const runtime = "nodejs";
export const maxDuration = 30;

const LEADS_TO = "cherie@solasgallery.com";
const SENDER = { name: "Salado Village Framer", email: "cherie@solasgallery.com" };
const MAX_PHOTO = 2_000_000;
const MAX_CONCEPT = 600_000;
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const isJpeg = (b: Buffer) => b.length > 4 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
const DELIVERY = {
  dropoff: "Drop off at the shop",
  ship: "Ship to us",
  consult: "Book a design consult",
} as const;
const MEASURED = { art: "The art itself", frame: "Outside of its current frame", unsure: "Not sure" } as const;
const MAT_STYLES: MatStyle[] = ["classic", "none", "float"];
const MAT_WIDTHS: MatWidthKey[] = ["thin", "standard", "wide"];

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData().catch(() => null);
    if (!form) return fail("Please send a valid request.");
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(String(form.get("data") || ""));
    } catch {
      return fail("Please send a valid request.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) return fail("Please send a valid request.");
    if (body.website) return NextResponse.json({ success: true, ref: "SVF-0000" }); // honeypot

    const name = clean(body.name, 120);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 40);
    const notes = clean(body.notes, 2000);
    if (!name) return fail("Please enter your name.");
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return fail("Please enter a valid email address.");
    const digits = phone.replace(/\D/g, "");
    if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith("1"))))
      return fail("Please enter a 10-digit phone number.");
    const delivery = clean(body.delivery, 20) as keyof typeof DELIVERY;
    if (!(delivery in DELIVERY)) return fail("Please choose drop off, ship, or consult.");
    const measured = (clean(body.measured, 20) as keyof typeof MEASURED) in MEASURED ? (clean(body.measured, 20) as keyof typeof MEASURED) : "unsure";

    const d = body.design as Record<string, unknown> | undefined;
    if (!d || typeof d !== "object") return fail("Please include your design.");
    const artW = Number(d.artW);
    const artH = Number(d.artH);
    if (!Number.isFinite(artW) || !Number.isFinite(artH) || Math.min(artW, artH) < MIN_SIDE_IN || Math.max(artW, artH) > MAX_LONG_SIDE_IN)
      return fail(`Please enter art sizes between ${MIN_SIDE_IN}″ and ${MAX_LONG_SIDE_IN}″.`);
    const moulding = mouldings.find((m) => m.id === d.mouldingId);
    const matColor = matColors.find((m) => m.id === d.matColorId);
    const matStyle = MAT_STYLES.find((s) => s === d.matStyle);
    const matWidth = MAT_WIDTHS.find((s) => s === d.matWidth);
    if (!moulding || !matColor || !matStyle || !matWidth) return fail("Please choose a frame and mat for your design.");
    const est = layout({ artW, artH, moulding, matStyle, matWidth, matColor });
    const band = ballpark(artW, artH);

    const photoFile = form.get("photo");
    const conceptFile = form.get("concept");
    if (!(photoFile instanceof File) || photoFile.size === 0) return fail("Please add a photo of your piece.");
    if (photoFile.size > MAX_PHOTO) return fail("That photo is too large. Please try a smaller one.", 413);
    const photo = Buffer.from(await photoFile.arrayBuffer());
    if (!isJpeg(photo)) return fail("Please send a JPEG photo.");
    let concept: Buffer | null = null;
    if (conceptFile instanceof File && conceptFile.size > 0) {
      if (conceptFile.size > MAX_CONCEPT) return fail("The preview image is too large.", 413);
      concept = Buffer.from(await conceptFile.arrayBuffer());
      if (!isJpeg(concept)) concept = null;
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey || !process.env.BLOB_READ_WRITE_TOKEN)
      return fail(`Online requests are temporarily unavailable. Please call ${business.phone}.`, 503);

    const testMode = process.env.VERCEL_ENV !== "production";
    const prefix = testMode ? "[PREVIEW TEST] " : "";
    const day = new Date().toISOString().slice(0, 10);
    const ref = "SVF-" + randomBytes(3).toString("hex").toUpperCase();

    // ---- 1) storage (private store; links are signed)
    const base = `framing-leads/${day}/${ref}-${randomBytes(6).toString("hex")}`;
    const photoBlob = await put(`${base}-photo.jpg`, photo, { access: "private", contentType: "image/jpeg", addRandomSuffix: false });
    const conceptBlob = concept
      ? await put(`${base}-concept.jpg`, concept, { access: "private", contentType: "image/jpeg", addRandomSuffix: false })
      : null;
    const origin = request.nextUrl.origin;
    const exp = Date.now() + LINK_TTL_MS;
    const link = (pathname: string) =>
      `${origin}/api/lead-photo?p=${encodeURIComponent(pathname)}&e=${exp}&s=${signPath(pathname, exp)}`;
    const photoLink = link(photoBlob.pathname);
    const conceptLink = conceptBlob ? link(conceptBlob.pathname) : "";

    // ---- 2) notification to Cherie
    const rows: [string, string][] = [
      ["Reference", ref],
      ["Name", name],
      ["Email", email],
      ["Phone", phone],
      ["How they want to start", DELIVERY[delivery]],
      ["Art size", `${artW} × ${artH} inches (measured: ${MEASURED[measured]})`],
      ["Frame idea", `Sample swatch: ${moulding.name} (about ${moulding.railWidthIn}" wide). Not a specific product; Cherie shows the actual mouldings in the shop.`],
      [
        "Mat idea",
        matStyle === "none" ? "No mat" : `${matStyle === "float" ? "Float" : "Classic"}, ${matColor.name}, ${MAT_WIDTH_LABEL[matWidth]} — ${est.matIn}"`,
      ],
      ["Ballpark shown to customer", `${band.headline}. ${ESTIMATE_NOTE}`],
      ["Notes", notes],
      ["Newsletter opt-in", body.newsletter === true ? "Yes" : "No"],
    ];
    const table = rows
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><th style="text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #ddd">${esc(k)}</th><td style="padding:10px;border-bottom:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`)
      .join("");
    const attachment = [
      { name: "customer-photo.jpg", content: photo.toString("base64") },
      ...(concept ? [{ name: "framing-concept.jpg", content: concept.toString("base64") }] : []),
    ];
    const headers = { accept: "application/json", "content-type": "application/json", "api-key": apiKey };
    const send = (payload: Record<string, unknown>) =>
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers,
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify(payload),
      });

    const notifyRes = await send({
      sender: SENDER,
      to: [{ email: LEADS_TO, name: "Cherie Flanagan" }],
      replyTo: { email, name },
      subject: `${prefix}New framing request: ${name.replace(/[\r\n]/g, " ")} (${DELIVERY[delivery]})`,
      htmlContent: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:32px;color:#202b2a"><h1 style="font-family:Georgia,serif">${testMode ? "[PREVIEW TEST] " : ""}A new framing request</h1><p><a href="${photoLink}">Open the customer’s photo</a>${conceptLink ? ` · <a href="${conceptLink}">Open the design concept</a>` : ""}<br><small>Both images are also attached. The links stay private to this email and stop working after 30 days.</small></p><table style="width:100%;border-collapse:collapse">${table}</table><p style="font-size:12px">Sent from saladovillageframer.com/start-framing. Reply to this email to reach the customer.</p></div>`,
      attachment,
    });
    if (!notifyRes.ok) {
      console.error("start-framing notification failed:", notifyRes.status, await notifyRes.text().catch(() => ""));
      return fail(`We could not confirm delivery. Please call ${business.phone} before resending.`, 502);
    }

    let confirmationSent = false;
    // ---- 3) customer confirmation (failure never fails the request: the lead is already safe)
    try {
      const nextLine =
        delivery === "dropoff"
          ? "Bring the piece to the shop whenever you are ready, Monday to Saturday, 10am to 5pm. Call first if it is large."
          : delivery === "ship"
            ? "Please wait for our reply before you ship anything. We will send packing and shipping instructions."
            : "We will reply to set a time for your design consult.";
      const r = await send({
        sender: SENDER,
        to: [{ email, name }],
        replyTo: { email: LEADS_TO, name: "Cherie Flanagan" },
        subject: `${prefix}We received your framing request (${ref})`,
        htmlContent: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#202b2a"><h1 style="font-family:Georgia,serif">Thank you, ${esc(name.split(" ")[0])}.</h1><p>We have your photo and details (reference ${ref}). Cherie will reply by email, usually within one business day.</p><p>${esc(nextLine)}</p><p>Your size: ${artW} × ${artH} inches. Ballpark we showed: ${esc(band.headline.toLowerCase())}. ${esc(ESTIMATE_NOTE)} We confirm your exact price with you before any work begins. The frame and mat you picked are samples; Cherie will show you the actual mouldings in the shop.</p><p style="color:#59625d;font-size:13px">${esc(business.nap)}<br>Reply to this email or call ${esc(business.phone)}.</p></div>`,
      });
      if (r.ok) confirmationSent = true;
      else console.error("start-framing confirmation failed:", r.status);
    } catch {
      console.error("start-framing confirmation errored");
    }

    // ---- 4) marketing list: opt-in only, production only
    if (!testMode && body.newsletter === true) {
      try {
        await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers,
          signal: AbortSignal.timeout(12000),
          body: JSON.stringify({
            email,
            attributes: { FIRSTNAME: name.split(" ")[0], LASTNAME: name.split(" ").slice(1).join(" ") },
            listIds: [Number(process.env.BREVO_LIST_ID) || 2],
            updateEnabled: true,
          }),
        });
      } catch {
        console.error("start-framing list add errored");
      }
    }
    return NextResponse.json({ success: true, ref, testMode, confirmationSent });
  } catch (e) {
    console.error("start-framing failed", e instanceof Error ? e.message : "");
    return fail(`We could not confirm delivery. Please call ${business.phone} or try again later.`, 502);
  }
}
