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
  ["16 1/4\"", 16.25], ["16 1/4 in", 16.25], ["16 1/4″", 16.25], ["16.3", 16.25], ["16.1", 16], ["16 1/8", 16.25], [".5", 0.5],
  ["  8  ", 8], ["16 2/4", 16.5], ["16 4/8", 16.5],
];
const bad = ["", "abc", "16 1/", "16 /4", "1/0", "16..2", "16 1/4 1/4", "sixteen", "16x20", "-5", "16,5", "1/2/3"];
let out = [];
for (const [i, want] of good) {
  const r = parseInches(i);
  assert.ok(r.ok, `should parse: ${JSON.stringify(i)}`);
  assert.equal(r.value, want, `${JSON.stringify(i)} -> ${r.value}, wanted ${want}`);
  out.push(`PASS  ${JSON.stringify(i).padEnd(14)} -> ${r.value}  (${formatInches(r.value)}")`);
}
for (const i of bad) {
  const r = parseInches(i);
  if (i === "") { assert.equal(r.ok, false); out.push(`PASS  ${JSON.stringify(i).padEnd(14)} -> empty (no value, Next stays disabled)`); continue; }
  assert.equal(r.ok, false, `should reject: ${JSON.stringify(i)}`);
  out.push(`PASS  ${JSON.stringify(i).padEnd(14)} -> rejected (${r.reason})`);
}
assert.equal(formatInches(16.25), "16 1/4");
assert.equal(formatInches(20), "20");
assert.equal(formatInches(0.5), "1/2");
console.log(out.join("\n"));
console.log(`\n${good.length} parse cases + ${bad.length} rejection cases + formatter: all passed`);
