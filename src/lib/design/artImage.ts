/** Turn an uploaded file (JPG, PNG, HEIC, TIFF) into a working canvas. */
export const ACCEPT =
  ".jpg,.jpeg,.png,.heic,.heif,.tif,.tiff,image/jpeg,image/png,image/heic,image/heif,image/tiff";
const MAX_BYTES = 40 * 1024 * 1024;
const MAX_DIM = 2000;

export class ArtError extends Error {}

function kind(file: File): "jpg" | "png" | "heic" | "tiff" | null {
  const n = file.name.toLowerCase();
  const t = file.type.toLowerCase();
  if (t === "image/jpeg" || /\.jpe?g$/.test(n)) return "jpg";
  if (t === "image/png" || /\.png$/.test(n)) return "png";
  if (t === "image/heic" || t === "image/heif" || /\.hei[cf]$/.test(n))
    return "heic";
  if (t === "image/tiff" || /\.tiff?$/.test(n)) return "tiff";
  return null;
}

function decodeNative(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode"));
    };
    img.src = url;
  });
}

function toCanvas(src: CanvasImageSource, w: number, h: number) {
  const s = Math.min(1, MAX_DIM / Math.max(w, h));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w * s));
  c.height = Math.max(1, Math.round(h * s));
  const ctx = c.getContext("2d");
  if (!ctx) throw new ArtError("Your browser could not prepare the preview.");
  ctx.fillStyle = "#fff"; // flatten transparency
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, 0, 0, c.width, c.height);
  return c;
}

export async function readArt(
  file: File,
): Promise<{ canvas: HTMLCanvasElement; type: string }> {
  const k = kind(file);
  if (!k)
    throw new ArtError("Please choose a JPG, PNG, HEIC, or TIFF photo.");
  if (file.size > MAX_BYTES)
    throw new ArtError("That file is over 40 MB. Please try a smaller photo.");

  try {
    if (k === "tiff") {
      // Safari decodes TIFF natively; everywhere else we decode it ourselves.
      try {
        const img = await decodeNative(file);
        return { canvas: toCanvas(img, img.naturalWidth, img.naturalHeight), type: k };
      } catch {
        const UTIF = await import("utif");
        const buf = await file.arrayBuffer();
        const ifd = UTIF.decode(buf)[0];
        UTIF.decodeImage(buf, ifd);
        const rgba = UTIF.toRGBA8(ifd);
        const raw = document.createElement("canvas");
        raw.width = ifd.width;
        raw.height = ifd.height;
        raw
          .getContext("2d")!
          .putImageData(
            new ImageData(new Uint8ClampedArray(rgba), ifd.width, ifd.height),
            0,
            0,
          );
        return { canvas: toCanvas(raw, raw.width, raw.height), type: k };
      }
    }
    if (k === "heic") {
      try {
        const img = await decodeNative(file); // Safari / iOS
        return { canvas: toCanvas(img, img.naturalWidth, img.naturalHeight), type: k };
      } catch {
        const { default: heic2any } = await import("heic2any");
        const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
        const blob = Array.isArray(out) ? out[0] : out;
        const img = await decodeNative(blob);
        return { canvas: toCanvas(img, img.naturalWidth, img.naturalHeight), type: k };
      }
    }
    const img = await decodeNative(file);
    return { canvas: toCanvas(img, img.naturalWidth, img.naturalHeight), type: k };
  } catch (e) {
    if (e instanceof ArtError) throw e;
    throw new ArtError(
      "We couldn't open that photo. Try another file, or take a fresh picture of your piece.",
    );
  }
}

export function rotate90(src: HTMLCanvasElement, dir: 1 | -1) {
  const c = document.createElement("canvas");
  c.width = src.height;
  c.height = src.width;
  const ctx = c.getContext("2d")!;
  ctx.translate(c.width / 2, c.height / 2);
  ctx.rotate((dir * Math.PI) / 2);
  ctx.drawImage(src, -src.width / 2, -src.height / 2);
  return c;
}

export function cropCanvas(
  src: HTMLCanvasElement,
  r: { x: number; y: number; w: number; h: number },
) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(r.w));
  c.height = Math.max(1, Math.round(r.h));
  c.getContext("2d")!.drawImage(src, r.x, r.y, r.w, r.h, 0, 0, c.width, c.height);
  return c;
}

/** JPEG (base64, no prefix) small enough to email as an attachment. */
export function jpegForEmail(src: HTMLCanvasElement, maxDim: number): string {
  const s = Math.min(1, maxDim / Math.max(src.width, src.height));
  const c = document.createElement("canvas");
  c.width = Math.round(src.width * s);
  c.height = Math.round(src.height * s);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(src, 0, 0, c.width, c.height);
  let out = c.toDataURL("image/jpeg", 0.8);
  for (const q of [0.68, 0.55, 0.4, 0.3]) {
    if (out.length < 560_000) break;
    out = c.toDataURL("image/jpeg", q);
  }
  return out.split(",")[1];
}
