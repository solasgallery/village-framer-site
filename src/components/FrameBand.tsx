/**
 * A thin band of real frame moulding across the top or bottom of a hero (never the sides).
 * Source: Rhonda Feinman Custom Frames, Italian collection #08, profile IT-2A (gold leaf) —
 * one straight leg from the supplier's photo, paired with its mirror so it repeats without a seam.
 * The bottom band is the same strip turned 180°, as the bottom leg of a real frame would be.
 * Decorative only: hidden from assistive tech.
 */
export default function FrameBand({ edge, profile = "it-2a" }: { edge: "top" | "bottom"; profile?: string }) {
  return (
    <div
      className={`frame-band frame-band-${edge}`}
      style={{ backgroundImage: `url(/images/frame-band/${profile}-${edge}.webp)` }}
      aria-hidden="true"
    />
  );
}
