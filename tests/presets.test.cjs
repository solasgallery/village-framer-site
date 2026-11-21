/* Size presets: every common-size button fills Width = first number, Height = second,
   and its label reads in that same order (Edna's 16x20 report). Run: node --test tests/ */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { test } = require("node:test");
const ts = require("typescript");
const read = (p) => fs.readFileSync(path.join(__dirname, "..", p), "utf8");
const js = ts.transpileModule(read("src/lib/design/presets.ts"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const mod = { exports: {} };
new Function("module", "exports", js)(mod, mod.exports);
const { COMMON_SIZES, presetSize, presetLabel } = mod.exports;

test("the preset list is the expected portrait W×H list", () => {
  assert.deepEqual(COMMON_SIZES.map((c) => [...c]), [[8, 10], [11, 14], [16, 20], [24, 36], [36, 48], [48, 60]]);
  for (const [a, b] of COMMON_SIZES) assert.ok(a < b, `${a}×${b} should be listed portrait`);
});

test("every preset fills Width = first number, Height = second", () => {
  for (const c of COMMON_SIZES) {
    const { w, h } = presetSize(c);
    assert.equal(w, c[0], `${c[0]}×${c[1]} width`);
    assert.equal(h, c[1], `${c[0]}×${c[1]} height`);
    assert.equal(presetLabel(c), `${w}×${h}`, "label reads width × height");
  }
  assert.deepEqual(presetSize([16, 20]), { w: 16, h: 20 });
});

test("SizeStep uses the shared presets and never re-orients them by the photo", () => {
  const s = read("src/components/design/SizeStep.tsx");
  assert.match(s, /const \{ w: pw, h: ph \} = presetSize\(c\);/);
  assert.match(s, /\{presetLabel\(c\)\}/);
  assert.match(s, /setW\(trim\(pw\)\);\s*setH\(trim\(ph\)\);/);
  assert.doesNotMatch(s, /Math\.max\(a, b\)|Math\.min\(a, b\)/);
  // labels above the two inputs, in this order
  assert.ok(s.indexOf("Width (inches)") < s.indexOf("Height (inches)"));
});
