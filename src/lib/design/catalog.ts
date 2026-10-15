import mouldingsData from "@/data/mouldings.json";
import roomsData from "@/data/rooms.json";
import type { MatColor, Moulding, Room } from "./types";

// Adding a moulding = appending an entry to src/data/mouldings.json (+ its
// swatch image in /public/mouldings). Nothing in code needs to change.
export const mouldings = mouldingsData as Moulding[];
export const rooms = roomsData as Room[];
export const colorFamilies = [
  "All",
  ...Array.from(new Set(mouldings.map((m) => m.colorFamily))),
];

export const matColors: MatColor[] = [
  { id: "bright-white", name: "Bright white", hex: "#fbfaf7", group: "Neutrals" },
  { id: "warm-white", name: "Warm white", hex: "#f4efe3", group: "Neutrals" },
  { id: "ivory", name: "Ivory", hex: "#e9dfc7", group: "Neutrals" },
  { id: "oatmeal", name: "Oatmeal", hex: "#d6c8ab", group: "Neutrals" },
  { id: "stone", name: "Stone", hex: "#b9b3a6", group: "Neutrals" },
  { id: "charcoal", name: "Charcoal", hex: "#3a3b3a", group: "Neutrals" },
  { id: "sage", name: "Sage", hex: "#a9b79c", group: "Colors" },
  { id: "dusty-blue", name: "Dusty blue", hex: "#8fa3b4", group: "Colors" },
  { id: "terracotta", name: "Terracotta", hex: "#c47a5a", group: "Colors" },
  { id: "mustard", name: "Mustard", hex: "#d1a73f", group: "Colors" },
  { id: "navy", name: "Navy", hex: "#26385a", group: "Colors" },
  { id: "plum", name: "Plum", hex: "#6c3f56", group: "Colors" },
  { id: "suede-camel", name: "Suede camel", hex: "#b98b5d", group: "Premium" },
  { id: "silk-champagne", name: "Silk champagne", hex: "#e4d2a8", group: "Premium" },
  { id: "linen-grey", name: "Linen grey", hex: "#a9aaa4", group: "Premium" },
  { id: "velvet-black", name: "Velvet black", hex: "#141414", group: "Premium" },
];
export const defaultMat = matColors[1];
