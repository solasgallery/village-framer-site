import { createHmac, timingSafeEqual } from "node:crypto";

/** Signed, unguessable link for the private photo store. Key derives from the Blob token. */
const key = () => process.env.BLOB_READ_WRITE_TOKEN || "";
export const signPath = (pathname: string) =>
  createHmac("sha256", key()).update(pathname).digest("hex");
export const verifyPath = (pathname: string, sig: string) => {
  if (!key() || !/^[0-9a-f]{64}$/.test(sig)) return false;
  const a = Buffer.from(signPath(pathname), "hex");
  const b = Buffer.from(sig, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
};
