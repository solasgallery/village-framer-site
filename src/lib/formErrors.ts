import { business } from "@/lib/site";

/**
 * Plain-language copy for when the browser can't get an answer from our API (FS6-02).
 * Never show the browser's own text ("Failed to fetch", "Load failed", JSON parse errors).
 */
const reach = `call ${business.phone} or email ${business.email}`;

/** The device reports it is offline, so we did not send anything. */
export const offlineMessage = (what: string) =>
  `Your ${what} wasn’t sent: this device looks offline. Check your connection and try again, or ${reach}.`;

/**
 * The request left the browser (or may have) but no clear answer came back: a dropped connection,
 * a timeout, or a reply we couldn't read. It may have reached us, so don't say "not sent".
 */
export const unconfirmedMessage = (what: string) =>
  `We couldn’t confirm your ${what} reached us. Please ${reach} before you send it again.`;

export const isOffline = () => typeof navigator !== "undefined" && navigator.onLine === false;
