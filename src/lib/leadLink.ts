import { createHmac, timingSafeEqual } from "node:crypto";

/** Signed, unguessable, expiring link for the private photo store. Key derives from the Blob token. */
const key = () => process.env.BLOB_READ_WRITE_TOKEN || "";
export const LINK_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const mac = (pathname: string, exp: number) =>
  createHmac("sha256", key()).update(`${pathname}|${exp}`).digest("hex");
export const signPath = (pathname: string, exp: number) => mac(pathname, exp);
export const verifyPath = (pathname: string, exp: number, sig: string) => {
  if (!key() || !Number.isFinite(exp) || exp < Date.now() || !/^[0-9a-f]{64}$/.test(sig)) return false;
  const a = Buffer.from(mac(pathname, exp), "hex");
  const b = Buffer.from(sig, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
};
