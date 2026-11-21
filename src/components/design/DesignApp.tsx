"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/design/track";
import { findMoulding, initialDesign, STEPS, type Design, type Step } from "./state";
import UploadStep from "./UploadStep";
import SizeStep from "./SizeStep";
import FrameStep from "./FrameStep";
import ReviewStep from "./ReviewStep";
import DeliveryStep from "./DeliveryStep";
import DetailsStep from "./DetailsStep";

export default function DesignApp() {
  const [step, setStep] = useState<Step>(1);
  const [reached, setReached] = useState<Step>(1);
  const [design, setDesign] = useState<Design>(initialDesign);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    track("visualizer_start");
  }, []);

  const update = useCallback(
    (patch: Partial<Design>) => setDesign((d) => ({ ...d, ...patch })),
    [],
  );

  const go = useCallback((s: Step, push = true) => {
    setStep(s);
    setReached((r) => (s > r ? s : r));
    if (push) window.history.pushState({ designStep: s }, "");
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => top.current?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    window.history.replaceState({ designStep: 1 }, "");
    const pop = (e: PopStateEvent) => {
      const s = e.state?.designStep;
      if (s >= 1 && s <= 6) setStep(s);
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);

  const hasSize = !!(design.artW && design.artH);
  const hasFrame = !!findMoulding(design.mouldingId);
  const can = (s: Step) =>
    s === 1 || (s === 2 && !!design.art) || (s === 3 && !!design.art && hasSize) ||
    ((s === 4 || s === 5) && !!design.art && hasSize && hasFrame) ||
    (s === 6 && !!design.art && hasSize && hasFrame && !!design.delivery);

  // Never render a step whose inputs are missing (e.g. a stale history entry).
  const safe: Step = can(step) ? step : 1;

  return (
    <div className="design-app">
      <header className="design-head">
        <div className="design-head-row">
          {safe > 1 && !done ? (
            <button type="button" className="design-back" onClick={() => window.history.back()}>
              <span aria-hidden="true">←</span> Back
            </button>
          ) : (
            <span />
          )}
          <button type="button" className="design-exit" aria-label="Exit" onClick={() => (design.art && !done ? setLeaving(true) : (window.location.href = "/"))}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Design steps">
          <ol className="crumbs">
            {STEPS.map((label, i) => {
              const n = (i + 1) as Step;
              const ok = n <= reached && can(n) && n !== safe;
              return (
                <li key={label} aria-current={safe === n ? "step" : undefined} className={safe === n ? "on" : n < safe ? "done" : ""}>
                  {ok ? (
                    <button type="button" onClick={() => go(n)}>{label}</button>
                  ) : (
                    <span>{label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </header>

      <div ref={top} tabIndex={-1} className="design-main">
        {safe === 1 && (
          <UploadStep
            art={design.art}
            onArt={(art) => {
              setDesign((d) => {
                const same =
                  d.art && art && Math.abs(d.art.width / d.art.height - art.width / art.height) < 0.02;
                return { ...d, art, ...(same ? {} : { artW: 0, artH: 0 }) };
              });
            }}
            onNext={() => go(2)}
          />
        )}
        {safe === 2 && design.art && (
          <SizeStep
            art={design.art}
            artW={design.artW}
            artH={design.artH}
            measured={design.measured}
            onMeasured={(measured) => update({ measured })}
            onSize={(artW, artH) => update({ artW, artH })}
            onNext={() => go(3)}
          />
        )}
        {safe === 3 && design.art && (
          <FrameStep
            art={design.art}
            artW={design.artW}
            artH={design.artH}
            onPick={(id) => {
              const m = findMoulding(id)!;
              update({ mouldingId: id });
              track("frame_selected", {
                frame_id: m.id,
                frame_name: m.name,
                maker: m.maker,
                price_tier: m.priceTier,
              });
              go(4);
            }}
          />
        )}
        {safe === 4 && (
          <ReviewStep design={design} update={update} goto={(s) => go(s)} onNext={() => go(5)} />
        )}
        {safe === 5 && (
          <DeliveryStep
            design={design}
            onPick={(delivery) => update({ delivery })}
            onNext={() => go(6)}
          />
        )}
        {safe === 6 && <DetailsStep design={design} onDone={() => setDone(true)} />}
      </div>

      {leaving && (
        <div className="design-modal" role="dialog" aria-modal="true" aria-labelledby="leave-title">
          <div>
            <h2 id="leave-title">Leave without sending?</h2>
            <p>Your photo and choices aren’t saved, so you’ll start fresh next time.</p>
            <div className="actions">
              <Link href="/" className="button button-ink">Leave</Link>
              <button type="button" className="button button-line" onClick={() => setLeaving(false)}>Keep going</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
