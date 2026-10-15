import { defaultMat, matColors, mouldings } from "@/lib/design/catalog";
import { estimate, matWidthIn } from "@/lib/design/pricing";
import type {
  DesignSelection,
  MatColor,
  MatStyle,
  MatWidthKey,
  Moulding,
} from "@/lib/design/types";

export type Step = 1 | 2 | 3 | 4 | 5;
export const STEPS = ["Upload", "Size", "Frame", "Review", "Quote"] as const;

export type Design = {
  art: HTMLCanvasElement | null;
  artW: number;
  artH: number;
  mouldingId: string | null;
  matStyle: MatStyle;
  matWidth: MatWidthKey;
  matColorId: string;
};

export const initialDesign: Design = {
  art: null,
  artW: 0,
  artH: 0,
  mouldingId: null,
  matStyle: "classic",
  matWidth: "standard",
  matColorId: defaultMat.id,
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
  return {
    ...estimate(sel),
    matIn: matWidthIn(sel.matWidth, sel.artW, sel.artH, sel.matStyle),
  };
}

export const fmtIn = (n: number) =>
  `${Number.isInteger(n) ? n : Number(n.toFixed(2))}″`;
