/**
 * Best-effort per-IP rate limit. In-memory only: each serverless instance keeps its own
 * counters, so this slows scripted abuse and accidental double-posting but is NOT a hard
 * guarantee across instances. For a hard limit, add Vercel Firewall rate-limit rules or a KV store.
 */
type Bucket = { hits: number[] };
const stores = new Map<string, Map<string, Bucket>>();

export function clientIp(headers: Headers): string {
  const xf = headers.get("x-forwarded-for");
  return (xf?.split(",")[0] || headers.get("x-real-ip") || "unknown").trim().slice(0, 64);
}

/** Returns true when the request is allowed, false when the IP is over the limit. */
export function allow(scope: string, ip: string, max: number, windowMs: number, now = Date.now()): boolean {
  let store = stores.get(scope);
  if (!store) stores.set(scope, (store = new Map()));
  const b = store.get(ip) || { hits: [] };
  b.hits = b.hits.filter((t) => now - t < windowMs);
  if (b.hits.length >= max) {
    store.set(ip, b);
    return false;
  }
  b.hits.push(now);
  store.set(ip, b);
  if (store.size > 5000) {
    store.forEach((v, k) => {
      if (!v.hits.some((t) => now - t < windowMs)) store.delete(k);
    });
  }
  return true;
}

/** Control characters (incl. CR/LF) anywhere in a header-ish field. */
export const hasCtl = (s: string) => /[\u0000-\u001f\u007f\u2028\u2029]/.test(s);
