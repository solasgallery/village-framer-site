// Generates placeholder moulding swatches (public/mouldings/*.svg) and room
// scenes (public/rooms/*.svg) for the /design visualizer.
// Re-run:  node scripts/generate-design-placeholders.mjs
// Replace any output file with a real photo of the same id to go live
// (update the path in src/data/mouldings.json / src/data/rooms.json).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mouldings = JSON.parse(readFileSync(join(root, "src/data/mouldings.json"), "utf8"));

// Profile image convention: x = along the rail (tiles), y = across the rail,
// y=0 is the OUTER edge, y=H the inner (sight) edge. Size 256 x 96.
const palettes = {
  "roma-onyx": ["#3a3a3a", "#1b1b1b", "#0e0e0e", "#262626"],
  "lj-ebony-step": ["#444", "#161616", "#2a2a2a", "#0c0c0c"],
  "roma-midnight-wide": ["#383838", "#151515", "#202020", "#0a0a0a"],
  "roma-walnut-classic": ["#7a5438", "#4e301c", "#6a4529", "#35200f"],
  "lj-espresso-bevel": ["#5a3b27", "#2c1a0f", "#4a2e1b", "#1c0f07"],
  "roma-tobacco-slim": ["#8c6a47", "#5c3f27", "#7a5a3a", "#43291a"],
  "roma-honey-oak": ["#d2a468", "#a77a3f", "#c08f50", "#8a6130"],
  "lj-driftwood": ["#cfc3b0", "#a99a83", "#bdb09a", "#8c7e69"],
  "roma-birch-float": ["#ecd9b6", "#cdb68a", "#dcc79f", "#b79f74"],
  "lj-antique-gold": ["#e2c27a", "#a07a2b", "#c9a152", "#7a5a1b"],
  "roma-brushed-silver": ["#d9dcdd", "#9ba0a3", "#c3c7c9", "#7d8285"],
  "lj-champagne-fillet": ["#ecdcb4", "#b9a06a", "#d9c58f", "#917a49"],
  "roma-gallery-white": ["#fbfaf6", "#dedbd2", "#f0ede5", "#c8c4b9"],
  "lj-linen-cream": ["#f0e6cf", "#cfc2a2", "#e4d8bc", "#b3a582"],
  "roma-sage-matte": ["#8fa58a", "#5f7a5b", "#7b936f", "#46603f"],
  "lj-navy-lacquer": ["#2e4a7a", "#142342", "#223b66", "#0a1530"],
};
const W = 256, H = 96;
mkdirSync(join(root, "public/mouldings"), { recursive: true });
for (const m of mouldings) {
  const [hi, lo, mid, deep] = palettes[m.id] ?? ["#999", "#444", "#777", "#222"];
  const wood = /oak|birch|driftwood|walnut|espresso|tobacco/.test(m.id);
  // grain: deterministic thin horizontal streaks along the rail
  let grain = "";
  if (wood) {
    let s = [...m.id].reduce((a, c) => a + c.charCodeAt(0), 7);
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 26; i++) {
      const y = 4 + rnd() * (H - 8), x = rnd() * W, l = 40 + rnd() * 120;
      grain += `<path d="M${x.toFixed(1)} ${y.toFixed(1)}h${l.toFixed(1)}" stroke="${deep}" stroke-opacity="${(0.08 + rnd() * 0.14).toFixed(2)}" stroke-width="${(0.6 + rnd() * 1.2).toFixed(1)}"/>`;
    }
  }
  const metal = /gold|silver|champagne/.test(m.id);
  const sheen = metal
    ? `<rect width="${W}" height="${H}" fill="url(#sh)"/>`
    : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<linearGradient id="p" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${deep}"/><stop offset="0.04" stop-color="${hi}"/>
<stop offset="0.20" stop-color="${mid}"/><stop offset="0.42" stop-color="${hi}"/>
<stop offset="0.58" stop-color="${mid}"/><stop offset="0.80" stop-color="${lo}"/>
<stop offset="0.94" stop-color="${deep}"/><stop offset="1" stop-color="${lo}"/>
</linearGradient>
<linearGradient id="sh" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.25" stop-color="#fff" stop-opacity=".28"/>
<stop offset="0.5" stop-color="#fff" stop-opacity="0"/><stop offset="0.75" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
</linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#p)"/>${grain}${sheen}
</svg>`;
  writeFileSync(join(root, "public/mouldings", `${m.id}.svg`), svg);
}

// Room scenes: 1600 x 1000 px at exactly 10 px per inch. Floor line y=860.
mkdirSync(join(root, "public/rooms"), { recursive: true });
const room = (wall, wall2, floor, furniture, accent) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
<defs>
<linearGradient id="w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${wall}"/><stop offset="1" stop-color="${wall2}"/></linearGradient>
<linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${floor[0]}"/><stop offset="1" stop-color="${floor[1]}"/></linearGradient>
<linearGradient id="v" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".12"/><stop offset=".25" stop-color="#000" stop-opacity="0"/><stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>
</defs>
<rect width="1600" height="860" fill="url(#w)"/>
<rect y="860" width="1600" height="140" fill="url(#f)"/>
<rect y="808" width="1600" height="52" fill="#fff" fill-opacity=".55"/>
<rect y="858" width="1600" height="4" fill="#000" fill-opacity=".12"/>
${[...Array(8)].map((_, i) => `<path d="M0 ${880 + i * 17}H1600" stroke="#000" stroke-opacity=".07"/>`).join("")}
${furniture}
<rect width="1600" height="1000" fill="url(#v)"/>
</svg>`;
const sofa = (c, x) => `<g><rect x="${x}" y="640" width="840" height="130" rx="40" fill="${c}"/><rect x="${x - 40}" y="690" width="90" height="170" rx="30" fill="${c}"/><rect x="${x + 790}" y="690" width="90" height="170" rx="30" fill="${c}"/><rect x="${x + 40}" y="730" width="760" height="130" rx="22" fill="${c}"/><rect x="${x + 40}" y="730" width="760" height="130" rx="22" fill="#000" fill-opacity=".10"/><path d="M${x + 420} 735v125" stroke="#000" stroke-opacity=".18" stroke-width="3"/><rect x="${x + 80}" y="858" width="14" height="14" fill="#2a1d12"/><rect x="${x + 746}" y="858" width="14" height="14" fill="#2a1d12"/></g>`;
const plant = (x) => `<g><rect x="${x}" y="760" width="80" height="100" rx="12" fill="#b4764a"/><path d="M${x + 40} 760C${x - 40} 600 ${x - 30} 560 ${x + 10} 520M${x + 40} 760C${x + 120} 620 ${x + 130} 580 ${x + 90} 540M${x + 40} 760C${x + 40} 620 ${x + 40} 560 ${x + 40} 500" stroke="#5a7a4a" stroke-width="10" fill="none" stroke-linecap="round"/></g>`;
const console_ = (x) => `<g><rect x="${x}" y="700" width="600" height="30" fill="#6b4a30"/><rect x="${x + 20}" y="730" width="18" height="130" fill="#5a3d27"/><rect x="${x + 562}" y="730" width="18" height="130" fill="#5a3d27"/><rect x="${x + 70}" y="640" width="70" height="60" rx="8" fill="#d8cfc0"/><rect x="${x + 450}" y="660" width="40" height="40" fill="#8aa08a"/></g>`;
const desk = (x) => `<g><rect x="${x}" y="660" width="760" height="34" fill="#7a5a3a"/><rect x="${x + 30}" y="694" width="20" height="166" fill="#5a3d27"/><rect x="${x + 710}" y="694" width="20" height="166" fill="#5a3d27"/><rect x="${x + 280}" y="560" width="200" height="100" rx="6" fill="#222"/><rect x="${x + 370}" y="640" width="20" height="20" fill="#333"/><rect x="${x + 100}" y="760" width="190" height="100" rx="18" fill="#3a3a3a"/></g>`;
writeFileSync(join(root, "public/rooms/living-room.svg"), room("#e9e1d3", "#d9cfbd", ["#b69470", "#8d6c49"], sofa("#7d8a86", 380) + plant(1330)));
writeFileSync(join(root, "public/rooms/hallway.svg"), room("#eae6dc", "#d6d0c2", ["#9d8164", "#7a6049"], console_(500) + plant(130)));
writeFileSync(join(root, "public/rooms/office.svg"), room("#cfd8d3", "#b9c5bf", ["#a88a68", "#80654a"], desk(420) + plant(1330)));
console.log("generated", mouldings.length, "mouldings + 3 rooms");
