# Asset checklist — saladovillageframer.com rebuild

For Tim. Everything on the site works with placeholders today; swap each item in
whenever it's ready. Nothing blocks launch.

| # | Asset | Spec | Used in | Placeholder today | How to swap |
|---|-------|------|---------|-------------------|-------------|
| 1 | Cherie portrait | Photo, warm natural light, landscape 4:3 | "Framed by Cherie." block (homepage) | Existing portrait `public/images/selected/cherie-portrait.webp`, cropped to 4:3 | Replace the file, or change `src` in `src/app/page.tsx` (`#meet-cherie`) |
| 2–4 | Shop in process | Workbench, design table, hands at work | Homepage / process strip | Existing shop photos in `public/images/selected/` (`portrait-process-01..03.webp`, etc.) | Replace files of the same name |
| 5–6 | Large piece before / after | Same piece unframed → framed & hung | Large-piece section (`#large-pieces`) | "Before" is a drawn placeholder panel; "After" is `cherie-large-frame.webp` | Put both photos in `public/images/selected/` and edit the `.before-after` block in `src/app/page.tsx` |
| 7–9 | Finished pieces | 3 hung/installed shots, varied rooms | Social proof strip | **Not built yet** — homepage still uses the existing gallery/journal photos. No strip was added in this pass. | n/a until the strip is requested |
| 10–12 | Room scenes | Living room, hallway, office walls (no art) | `/design` wall-scene view | Generated illustrations `public/rooms/{living-room,hallway,office}.svg` | Add photo (landscape, wall visible), then edit `src/data/rooms.json`: set `image`, `width`/`height` (px), `pxPerInch` (pixels per real inch at that photo's wall — measure a known object, e.g. a door ≈ 80 in), and `anchor` (the pixel where the art's centre should hang). |
| 13–28 | Moulding profiles | Straight-on profile shots, 16 to start | `/design` frame grid, review, corner close-up | Generated swatches `public/mouldings/*.svg` | See "Moulding profile image format" below |
| 29 | Short process video (optional) | 30–60 s, phone footage fine | Homepage embed | None — no video slot was built | n/a until supplied |

## Moulding profile image format

Each entry in `src/data/mouldings.json` points to a profile image. The renderer
tiles it along the four rails and mitres the corners.

- **Orientation:** the image runs *along* the rail horizontally (it repeats left→right) and *across* the rail vertically. The **top edge of the image is the OUTER edge** of the frame; the bottom edge is the inner (sight) edge.
- **Content:** a straight-on, evenly lit close-up of a piece of moulding laid horizontally, cropped so the face of the moulding fills the image top to bottom. Shoot a piece ~6–12 in long so the grain repeats naturally.
- **Size:** about 512 × 192 px (ratio 8:3; the placeholders are 256 × 96). PNG, JPG, WebP or SVG all work. Keep each under ~60 KB.
- **Name it** after the moulding `id` (e.g. `roma-walnut-classic.jpg`) and put it in `public/mouldings/`, then update that entry's `profileImage` path.

## Adding a 17th moulding (data-only change)

Append an object to `src/data/mouldings.json` and drop its image in `public/mouldings/`:

```json
{ "id": "roma-new-one", "name": "New One", "descriptor": "One-line descriptor",
  "maker": "Roma", "colorFamily": "Walnut", "railWidthIn": 1.5,
  "priceTier": "mid", "profileImage": "/mouldings/roma-new-one.jpg" }
```

- `maker`: `Roma` or `Larson-Juhl`
- `priceTier`: `economy` | `mid` | `premium` | `signature` (rates live in `src/lib/design/pricing.ts`)
- `colorFamily`: any text; a new value automatically becomes a filter chip.

## Still needed from the shop (not images)

- Google reviews link → `href="#"` in the trust block, `src/app/page.tsx` (marked `TODO(Tim)`).
- Pricing: the estimate rates in `src/lib/design/pricing.ts` are calibrated to the brief (16×20 mid-tier ≈ $445, 36×48 ≈ $1,135), not to the shop's real price list. Cherie should sanity-check them.
- Wording on the new Services list (`src/app/services/page.tsx`) is a neutral placeholder for Cherie to approve.
