"use client";
import dynamic from "next/dynamic";
import "./design.css";

// The visualizer (canvas engine, crop tool, catalog) is only loaded on /design.
const DesignApp = dynamic(() => import("./DesignApp"), {
  ssr: false,
  loading: () => (
    <div className="design-loading" role="status">
      Setting up your design table…
    </div>
  ),
});
export default function DesignLoader() {
  return <DesignApp />;
}
