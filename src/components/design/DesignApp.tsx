"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { track } from "@/lib/design/track";
import { findMoulding, initialDesign, STEPS, type Design, type Step } from "./state";
import UploadStep from "./UploadStep";
import SizeStep from "./SizeStep";
import FrameStep from "./FrameStep";
import ReviewStep from "./ReviewStep";
import DeliveryStep from "./DeliveryStep";
import DetailsStep, { Confirmation, type SentInfo } from "./DetailsStep";

export default function DesignApp() {
  const [step, setStep] = useState<Step>(1);
  const [reached, setReached] = useState<Step>(1);
  const [design, setDesign] = useState<Design>(initialDesign);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState<SentInfo | null>(null);
  const router = useRouter();
  const pathname = usePathname();
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
    // Each step is a hash entry pushed through Next's own router (e.g. /start-framing#step-3). A hash-only
    // navigation never remounts the page, so the photo and choices stay in memory, and Next owns the history
    // entries so its popstate handler never reloads the page.
    if (push) router.push(`${pathname}#step-${s}`, { scroll: false });
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => top.current?.focus({ preventScroll: true }));
  }, [router, pathname]);

  useEffect(() => {
    // A reload or shared link carries a stale #step-n but no photo: start clean at step 1.
    if (window.location.hash) router.replace(pathname, { scroll: false });
    const pop = () => {
      const m = /^#step-([1-6])$/.exec(window.location.hash);
      setStep(m ? (Number(m[1]) as Step) : 1);
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {!done && (
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
        )}
      </header>

      <div ref={top} tabIndex={-1} className="design-main">
        {done && <Confirmation info={done} />}
        {!done && safe === 1 && (
          <UploadStep
            art={design.art}
            onArt={(art) => {
              setDesign((d) => {
                const same =
                  d.art && art && Math.abs(d.art.width / d.art.height - art.width / art.height) < 0.02;
                return { ...d, art, ...(same ? {} : { artW: 0, artH: 0, rawW: "", rawH: "", noteW: "", noteH: "" }) };
              });
            }}
            onNext={() => go(2)}
          />
        )}
        {!done && safe === 2 && design.art && (
          <SizeStep
            art={design.art}
            artW={design.artW}
            artH={design.artH}
            rawW={design.rawW}
            rawH={design.rawH}
            measured={design.measured}
            onMeasured={(measured) => update({ measured })}
            noteW={design.noteW}
            noteH={design.noteH}
            onSize={(artW, artH, rawW, rawH, noteW, noteH) => update({ artW, artH, rawW, rawH, noteW, noteH })}
            onNext={() => go(3)}
          />
        )}
        {!done && safe === 3 && design.art && (
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
              });
              go(4);
            }}
          />
        )}
        {!done && safe === 4 && (
          <ReviewStep design={design} update={update} goto={(s) => go(s)} onNext={() => go(5)} />
        )}
        {!done && safe === 5 && (
          <DeliveryStep
            design={design}
            onPick={(delivery) => update({ delivery })}
            onNext={() => go(6)}
          />
        )}
        {!done && safe === 6 && <DetailsStep design={design} onDone={(info) => setDone(info)} />}
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
