"use client";
import { useEffect } from "react";
export default function Analytics() {
  useEffect(() => {
    const push = (event: string, details: Record<string, string> = {}) => {
      const w = window as Window & { dataLayer?: Record<string, unknown>[] };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event, ...details });
    };
    const success = (e: Event) =>
      push("svf_inquiry_success", {
        inquiry_source: (e as CustomEvent).detail?.source || "contact",
      });
    const click = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.("a");
      const href = a?.getAttribute("href") || "";
      if (href.startsWith("tel:")) push("svf_phone_click");
      else if (href.includes("google.com/maps/dir"))
        push("svf_directions_click");
      else if (href === "/studio") push("svf_studio_open");
    };
    window.addEventListener("svf-inquiry-success", success);
    document.addEventListener("click", click);
    return () => {
      window.removeEventListener("svf-inquiry-success", success);
      document.removeEventListener("click", click);
    };
  }, []);
  return null;
}
