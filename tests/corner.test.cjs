/* Corner close-up zoom (Edna: "mostly black corner, art a sliver"). The band from the
   canvas edge to the art must cover ~35-45% of the canvas for every sample moulding,
   mat style/width and common size, at the main (1200x750) and thumbnail (300x188) sizes. */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { test } = require("node:test");
const ts = require("typescript");
// tiny loader: transpiles TS and resolves "@/..." imports to src/
const cache = new Map();
const load = (rel) => {
  const file = path.join(__dirname, "..", rel);
  if (cache.has(file)) return cache.get(file);
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, resolveJsonModule: true },
  }).outputText;
  const mod = { exports: {} };
  cache.set(file, mod.exports);
  const req = (id) => {
    if (!id.startsWith("@/") && !id.startsWith(".")) return require(id);
    const base = id.startsWith("@/") ? path.join("src", id.slice(2)) : path.join(path.dirname(rel), id);
    if (id.endsWith(".json")) return require(path.join(__dirname, "..", base));
    return load(fs.existsSync(path.join(__dirname, "..", base + ".ts")) ? base + ".ts" : base + ".tsx");
  };
  new Function("module", "exports", "require", js)(mod, mod.exports, req);
  cache.set(file, mod.exports);
  return mod.exports;
};
const { cornerPpi } = load("src/lib/design/frameRenderer.ts");
const { matWidthIn } = load("src/lib/design/pricing.ts");
const mouldings = require("../src/data/mouldings.json");
const sizes = [[8, 10], [11, 14], [16, 20], [20, 16], [24, 36], [36, 48], [48, 60], [5, 7], [60, 40]];

test("corner band covers 35-45% of the canvas and the art gets the rest", () => {
  let n = 0;
  for (const [W, H] of [[1200, 750], [300, 188]]) {
    const pad = H * 0.04;
    for (const m of mouldings)
      for (const style of ["classic", "none", "float"])
        for (const key of ["standard", "thin", "wide"])
          for (const [artW, artH] of sizes) {
            const f = { railIn: m.railWidthIn, matIn: matWidthIn(key, artW, artH, style), artW, artH };
            const ppi = cornerPpi(W, H, pad, f);
            const t = pad + (f.railIn + f.matIn) * ppi; // band thickness, px
            const frac = (W * t + H * t - t * t) / (W * H);
            const where = `${m.id} ${style}/${key} ${artW}x${artH} @${W}x${H}`;
            if (ppi < 420) {
              assert.ok(frac >= 0.35 && frac <= 0.45, `${where}: corner band ${(frac * 100).toFixed(1)}%`);
            } else assert.ok(frac <= 0.45, where);
            n++;
          }
  }
  assert.ok(n > 800);
});

test("Edna's case (16x20 artwork, black wide moulding, standard mat) is no longer a sliver", () => {
  const f = { railIn: 2.5, matIn: matWidthIn("standard", 16, 20, "classic"), artW: 16, artH: 20 };
  const ppi = cornerPpi(1200, 750, 30, f);
  const t = 30 + (f.railIn + f.matIn) * ppi;
  assert.ok(750 - t > 750 * 0.55, `art visible height ${Math.round(750 - t)}px of 750`);
  assert.ok(f.railIn * ppi < 750 * 0.2, `rail ${Math.round(f.railIn * ppi)}px is under 20% of the height`);
});
