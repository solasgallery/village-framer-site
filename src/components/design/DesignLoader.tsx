"use client";
import "./design.css";
import DesignApp from "./DesignApp";

// Server-rendered: step 1 paints with the HTML, and hydration keeps those nodes.
export default function DesignLoader() {
  return <DesignApp />;
}
