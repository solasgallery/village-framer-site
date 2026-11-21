import { defaultMat, matColors, mouldings } from "@/lib/design/catalog";
import { ballpark, layout } from "@/lib/design/pricing";
import { formatInches } from "@/lib/design/parseSize";
import type {
  DesignSelection,
  MatColor,
  MatStyle,
  MatWidthKey,
  Moulding,
} from "@/lib/design/types";

export type Step = 1 | 2 | 3 | 4 | 5 | 6;
export const STEPS = ["Photo", "Size", "Frame", "Preview", "Delivery", "Details"] as const;
export type Delivery = "dropoff" | "ship" | "consult";
export type Measured = "art" | "frame" | "unsure";

export type Design = {
  art: HTMLCanvasElement | null;
  artW: number;
  artH: number;
  mouldingId: string | null;
  matStyle: MatStyle;
  matWidth: MatWidthKey;
  matColorId: string;
  measured: Measured;
  delivery: Delivery | null;
};

export const initialDesign: Design = {
  art: null,
  artW: 0,
  artH: 0,
  mouldingId: null,
  matStyle: "classic",
  matWidth: "standard",
  matColorId: defaultMat.id,
  measured: "art",
  delivery: null,
};

export const findMoulding = (id: string | null): Moulding | undefined =>
  mouldings.find((m) => m.id === id);
export const findMat = (id: string): MatColor =>
  matColors.find((m) => m.id === id) ?? defaultMat;

export function selectionOf(d: Design): DesignSelection | null {
  const moulding = findMoulding(d.mouldingId);
  if (!moulding || !d.artW || !d.artH) return null;
  return {
    artW: d.artW,
    artH: d.artH,
    moulding,
    matStyle: d.matStyle,
    matWidth: d.matWidth,
    matColor: findMat(d.matColorId),
  };
}

export function derived(sel: DesignSelection) {
  return { ...layout(sel), band: ballpark() };
}

export const fmtIn = (n: number) => `${formatInches(n)}″`;
