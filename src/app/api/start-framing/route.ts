import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomBytes } from "node:crypto";
import { matColors, mouldings } from "@/lib/design/catalog";
import { formatInches } from "@/lib/design/parseSize";
import { ESTIMATE_NOTE, MAT_WIDTH_LABEL, BIG_PIECE_IN, MAX_LONG_SIDE_IN, MIN_SIDE_IN, ballpark, layout } from "@/lib/design/pricing";
import type { MatStyle, MatWidthKey } from "@/lib/design/types";
import { LINK_TTL_MS, signPath } from "@/lib/leadLink";
import { allow, clientIp, hasCtl } from "@/lib/rateLimit";
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
/** Trimmed string, or null when it is not a string or is longer than `max` (caps are enforced, not silently cut). */
const str = (v: unknown, max: number): string | null =>
  v == null ? "" : typeof v === "string" && v.trim().length <= max ? v.trim() : null;
/** Free text: keep line breaks and tabs, drop other control characters. */
const freeText = (s: string) => s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
const MAX_REQUEST = 3_200_000;
const RATE = { max: 5, windowMs: 10 * 60_000 }; // per IP; best-effort, in-memory (see src/lib/rateLimit.ts)
const EMAIL_RATE = { max: 2, windowMs: 10 * 60_000 }; // per submitted address, so the confirmation can't be used as a relay
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
    // Cheap gates first: nothing below here (Blob write, email) runs for a throttled or oversized request.
    const ip = clientIp(request.headers);
    if (!allow("start-framing", ip, RATE.max, RATE.windowMs))
      return NextResponse.json(
        { error: `Too many requests from this connection. Please wait a few minutes or call ${business.phone}.` },
        { status: 429, headers: { "Retry-After": "600" } },
      );
    if (Number(request.headers.get("content-length") || 0) > MAX_REQUEST) return fail("That request is too large.", 413);
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

    const nameRaw = str(body.name, 80);
    const emailRaw = str(body.email, 254);
    const phone = str(body.phone, 30);
    const notesRaw = str(body.notes, 2000);
    if (nameRaw === null || emailRaw === null || phone === null || notesRaw === null)
      return fail("One of your answers is too long. Please shorten it and try again.");
    // CR/LF and other control characters never belong in a name, email or phone (header-injection guard).
    if (hasCtl(nameRaw) || hasCtl(emailRaw) || hasCtl(phone)) return fail("Please remove line breaks from your name, email and phone.");
    const name = nameRaw;
    const email = emailRaw.toLowerCase();
    const notes = freeText(notesRaw);
    if (!name) return fail("Please enter your name.");
    if (!/^[^\s@<>",;:()\[\]\\]+@[^\s@<>",;:()\[\]\\]+\.[^\s@<>",;:()\[\]\\]+$/.test(email)) return fail("Please enter a valid email address.");
    const digits = phone.replace(/\D/g, "");
    if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith("1"))))
      return fail("Please enter a 10-digit phone number.");
    const delivery = String(str(body.delivery, 20) ?? "") as keyof typeof DELIVERY;
    if (!Object.prototype.hasOwnProperty.call(DELIVERY, delivery)) return fail("Please choose drop off, ship, or consult.");
    const measuredIn = String(str(body.measured, 20) ?? "");
    const measuredLabel = Object.prototype.hasOwnProperty.call(MEASURED, measuredIn)
      ? MEASURED[measuredIn as keyof typeof MEASURED]
      : "Not answered";

    const d = body.design as Record<string, unknown> | undefined;
    if (!d || typeof d !== "object") return fail("Please include your design.");
    const artW = Math.round(Number(d.artW) * 8) / 8;
    const artH = Math.round(Number(d.artH) * 8) / 8;
    const rawW = freeText(str(d.rawW, 60) ?? "").replace(/[\r\n]/g, " ");
    const rawH = freeText(str(d.rawH, 60) ?? "").replace(/[\r\n]/g, " ");
    if (!Number.isFinite(artW) || !Number.isFinite(artH) || Math.min(artW, artH) < MIN_SIDE_IN || Math.max(artW, artH) > MAX_LONG_SIDE_IN)
      return fail(`Please enter art sizes between ${MIN_SIDE_IN}″ and ${MAX_LONG_SIDE_IN}″.`);
    const moulding = mouldings.find((m) => m.id === d.mouldingId);
    const matColor = matColors.find((m) => m.id === d.matColorId);
    const matStyle = MAT_STYLES.find((s) => s === d.matStyle);
    const matWidth = MAT_WIDTHS.find((s) => s === d.matWidth);
    if (!moulding || !matColor || !matStyle || !matWidth) return fail("Please choose a frame and mat for your design.");
    const est = layout({ artW, artH, moulding, matStyle, matWidth, matColor });
    const band = ballpark();

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

    const testMode = process.env.VERCEL_ENV !== "production";
    // Per-address throttle, after validation and before any storage or email.
    if (!allow("start-framing-email", email, EMAIL_RATE.max, EMAIL_RATE.windowMs))
      return NextResponse.json({ error: `We already have a request from that address. Please wait a few minutes or call ${business.phone}.` }, { status: 429, headers: { "Retry-After": "600" } });
    // Test hook for local/preview curl tests: validate everything, send and store nothing. Never active in production.
    if (testMode && process.env.SVF_DRY_RUN === "1") return NextResponse.json({ success: true, ref: "SVF-DRYRUN", testMode, dryRun: true, confirmationSent: false });

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey || !process.env.BLOB_READ_WRITE_TOKEN)
      return fail(`Online requests are temporarily unavailable. Please call ${business.phone}.`, 503);

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
      ["Size the customer typed", `width "${rawW || "(not recorded)"}" × height "${rawH || "(not recorded)"}"`],
      ["Size we read (nearest 1/8 inch)", `${formatInches(artW)} × ${formatInches(artH)} inches (${artW} × ${artH})`],
      ["What they measured", measuredLabel],
      ...(Math.max(artW, artH) > BIG_PIECE_IN
        ? ([["Big piece", `Over ${BIG_PIECE_IN} inches on the long side. Cherie will want to see it; a consult may be the right start.`]] as [string, string][])
        : []),
      ["Frame idea", `Sample swatch: ${moulding.name} (about ${moulding.railWidthIn}" wide). Not a specific product; Cherie shows the actual mouldings in the shop.`],
      [
        "Mat idea",
        matStyle === "none" ? "No mat" : `${matStyle === "float" ? "Float" : "Classic"}, ${matColor.name}, ${MAT_WIDTH_LABEL[matWidth]} — ${est.matIn}"`,
      ],
      ["Ballpark shown to customer", `${band.headline} ${ESTIMATE_NOTE}`],
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
      replyTo: { email, name: name.replace(/["<>]/g, "") },
      subject: `${prefix}New framing request: ${name} (${DELIVERY[delivery]})`,
      htmlContent: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:32px;color:#202b2a"><h1 style="font-family:Georgia,serif">${testMode ? "[PREVIEW TEST] " : ""}A new framing request</h1><p style="word-break:break-all;font-size:13px">Customer’s photo (private link):<br>${photoLink}${conceptLink ? `<br><br>Design concept:<br>${conceptLink}` : ""}<br><small>Both images are also attached. The links stay private to this email and stop working after 30 days.</small></p><table style="width:100%;border-collapse:collapse">${table}</table><p style="font-size:12px">Sent from saladovillageframer.com/start-framing. Reply to this email to reach the customer.</p></div>`,
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
            ? "Please wait for our reply before you ship anything."
            : "We will reply to set a time for your design consult.";
      const r = await send({
        sender: SENDER,
        to: [{ email }],
        replyTo: { email: LEADS_TO, name: "Cherie Flanagan" },
        subject: `${prefix}We received your framing request (${ref})`,
        htmlContent: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#202b2a"><h1 style="font-family:Georgia,serif">Thank you.</h1><p>We have your photo and details (reference ${ref}). Cherie will reply by email, usually within one business day.</p><p>${esc(nextLine)}</p><p>Your size: ${esc(formatInches(artW))} × ${esc(formatInches(artH))} inches. Ballpark we showed: ${esc(band.headline)} ${esc(ESTIMATE_NOTE)} Cherie will confirm the details with you before any work starts. The frame and mat you picked are samples; Cherie will show you the actual mouldings in the shop.</p><p style="color:#59625d;font-size:13px">${esc(business.nap)}<br>Reply to this email or call ${esc(business.phone)}.</p></div>`,
      });
      if (r.ok) confirmationSent = true;
      else console.error("start-framing confirmation failed:", r.status);
    } catch {
      console.error("start-framing confirmation errored");
    }

    // ---- 4) marketing list: opt-in only, production only
    if (!testMode && body.newsletter === true) {
      try {
        const listId = Number(process.env.BREVO_LIST_ID);
        if (!listId) {
          console.error("start-framing list add skipped: BREVO_LIST_ID is not set");
        } else {
          const lr = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers,
            signal: AbortSignal.timeout(12000),
            body: JSON.stringify({
              email,
              attributes: { FIRSTNAME: name.split(" ")[0], LASTNAME: name.split(" ").slice(1).join(" ") },
              listIds: [listId],
              updateEnabled: true,
            }),
          });
          if (!lr.ok) console.error("start-framing list add failed:", lr.status, await lr.text().catch(() => ""));
        }
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
