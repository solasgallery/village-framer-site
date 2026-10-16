declare module "utif" {
  export function decode(buffer: ArrayBuffer): { width: number; height: number }[];
  export function decodeImage(
    buffer: ArrayBuffer,
    ifd: { width: number; height: number },
  ): void;
  export function toRGBA8(ifd: { width: number; height: number }): Uint8Array;
}
