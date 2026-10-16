/**
 * Funnel events for the /design visualizer. They go to the GTM dataLayer that
 * the site-wide GTM-TCJR9HV snippet (in app/layout.tsx) already creates — no
 * second tracking snippet. Never put names, emails, phone numbers or photos
 * in these payloads.
 */
export type FunnelEvent =
  | "visualizer_start"
  | "art_uploaded"
  | "frame_selected"
  | "quote_requested";

export function track(
  event: FunnelEvent,
  params: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}
