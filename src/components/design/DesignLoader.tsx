"use client";
import dynamic from "next/dynamic";
import "./design.css";
import { STEPS } from "./state";

/**
 * The flow itself (canvas engine, crop tool, catalog) loads on demand. This
 * server-rendered shell matches step 1 exactly, so the page paints at once and
 * nothing shifts when the app takes over.
 */
function Shell() {
  return (
    <div className="design-app">
      <header className="design-head">
        <div className="design-head-row">
          <span />
          <a className="design-exit" aria-label="Exit" href="/">
            <span aria-hidden="true">×</span>
          </a>
        </div>
        <nav aria-label="Steps">
          <ol className="crumbs">
            {STEPS.map((label, i) => (
              <li key={label} className={i === 0 ? "on" : ""} aria-current={i === 0 ? "step" : undefined}>
                <span>{label}</span>
              </li>
            ))}
          </ol>
        </nav>
      </header>
      <div className="design-main">
        <div className="step-body narrow">
          <h1 className="step-title">Show us your art.</h1>
          <p className="step-sub">
            Upload a photo of the piece. It doesn’t have to be perfect — it’s just for designing.
          </p>
          <button type="button" className="button button-ink wide" disabled>
            Upload photo
          </button>
          <noscript>
            <p>This tool needs JavaScript. You can also call (254) 613-6123 or visit the shop in Salado.</p>
          </noscript>
        </div>
      </div>
    </div>
  );
}

const DesignApp = dynamic(() => import("./DesignApp"), { ssr: false, loading: () => <Shell /> });
export default function DesignLoader() {
  return <DesignApp />;
}
