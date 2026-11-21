/* Parser test. Run: node tests/parse-size.test.cjs */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const ts = require("typescript");
const src = fs.readFileSync(path.join(__dirname, "../src/lib/design/parseSize.ts"), "utf8");
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const mod = { exports: {} };
new Function("module", "exports", js)(mod, mod.exports);
const { parseInches, formatInches } = mod.exports;

const good = [
  ["16", 16], ["16.25", 16.25], ["16 1/4", 16.25], ["16-1/4", 16.25], ["16 - 1/4", 16.25],
  ["16¼", 16.25], ["16 ¼", 16.25], ["20 1/2", 20.5], ["20½", 20.5], ["20 3/4", 20.75], ["1/4", 0.25],
  ["16 1/4\"", 16.25], ["16 1/4 in", 16.25], ["16 1/4″", 16.25], [".5", 0.5], ["16.", 16],
  ["  8  ", 8], ["16 2/4", 16.5], ["16 4/8", 16.5],
  // 1/8-inch precision: nearest eighth, not nearest quarter
  ["16 1/8", 16.125], ["15 1/8", 15.125], ["20 3/8", 20.375], ["16 5/8", 16.625], ["16 7/8", 16.875], ["16⅛", 16.125],
  ["16.3", 16.25], ["16.1", 16.125], ["16.2", 16.25], ["16.4", 16.375],
  // feet
  ["3'", 36], ["3 ft", 36], ["3ft", 36], ["3 feet", 36], ["3′", 36], ["3' 6\"", 42], ["3'6\"", 42], ["3 ft 6 in", 42],
  ["3' 6 1/2\"", 42.5], ["6'", 72], ["10 ft", 120], ["2.5'", 30],
];
const bad = ["abc", "16 1/", "16 /4", "1/0", "16..2", "16 1/4 1/4", "sixteen", "16x20", "16,5", "1/2/3", "16 5/4", "3' x", "ft", "7 1/812", "7 1/8 12", "1/812", "16 1/3", "16 1/64", "7 1/81"];
// zero and negatives get their own reasons so the UI can say so
const reasons = [["0", "zero"], ["0.0", "zero"], ["0 1/4", null], ["0'", "zero"], ["0 in", "zero"], ["-5", "negative"], ["-0.5", "negative"], ["-16 1/4", "negative"], ["", "empty"], ["   ", "empty"]];
let out = [];
for (const [i, want] of good) {
  const r = parseInches(i);
  assert.ok(r.ok, `should parse: ${JSON.stringify(i)}`);
  assert.equal(r.value, want, `${JSON.stringify(i)} -> ${r.value}, wanted ${want}`);
  out.push(`PASS  ${JSON.stringify(i).padEnd(14)} -> ${r.value}  (${formatInches(r.value)}")`);
}
for (const i of bad) {
  const r = parseInches(i);
  assert.equal(r.ok, false, `should reject: ${JSON.stringify(i)}`);
  out.push(`PASS  ${JSON.stringify(i).padEnd(14)} -> rejected (${r.reason})`);
}
for (const [i, why] of reasons) {
  const r = parseInches(i);
  if (why === null) { assert.ok(r.ok && r.value === 0.25, `0 1/4 is a quarter inch`); out.push(`PASS  ${JSON.stringify(i).padEnd(14)} -> 0.25`); continue; }
  assert.equal(r.ok, false, `should reject: ${JSON.stringify(i)}`);
  assert.equal(r.reason, why, `${JSON.stringify(i)} reason ${r.reason}, wanted ${why}`);
  out.push(`PASS  ${JSON.stringify(i).padEnd(14)} -> rejected (${r.reason})`);
}
assert.equal(formatInches(16.25), "16 1/4");
assert.equal(formatInches(20.375), "20 3/8");
assert.equal(formatInches(16.125), "16 1/8");
assert.equal(formatInches(42), "42");
assert.equal(formatInches(20), "20");
assert.equal(formatInches(0.5), "1/2");
console.log(out.join("\n"));
console.log(`\n${good.length} parse cases + ${bad.length + reasons.length} rejection cases + formatter: all passed`);
