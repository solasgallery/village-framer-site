"use client";
import dynamic from "next/dynamic";
import "./design.css";

// The visualizer (canvas engine, crop tool, catalog) is only loaded on /start-framing.
const DesignApp = dynamic(() => import("./DesignApp"), {
  ssr: false,
  loading: () => (
    <div className="design-loading" role="status">
      <h1>Start framing</h1>
      <p>Setting up your design table…</p>
      <noscript>
        <p>This tool needs JavaScript. You can also call (254) 613-6123 or visit the shop in Salado.</p>
      </noscript>
    </div>
  ),
});
export default function DesignLoader() {
  return <DesignApp />;
}
