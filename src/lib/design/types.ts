export type PriceTier = "economy" | "mid" | "premium" | "signature";
export type MatStyle = "classic" | "none" | "float";
export type MatWidthKey = "thin" | "standard" | "wide";

export type Moulding = {
  id: string;
  name: string;
  descriptor: string;
  maker: "Roma" | "Larson-Juhl";
  colorFamily: string;
  railWidthIn: number;
  priceTier: PriceTier;
  profileImage: string;
};

export type Room = {
  id: string;
  name: string;
  image: string;
  width: number;
  height: number;
  /** pixels per real-world inch in the room image (sets the art's scale) */
  pxPerInch: number;
  /** where the centre of the framed piece hangs, in image pixels */
  anchor: { x: number; y: number };
  alt: string;
};

export type MatColor = {
  id: string;
  name: string;
  hex: string;
  group: "Neutrals" | "Colors" | "Premium";
};

export type DesignSelection = {
  artW: number;
  artH: number;
  moulding: Moulding;
  matStyle: MatStyle;
  matWidth: MatWidthKey;
  matColor: MatColor;
};
