/* /design checks: moulding catalog, pricing calibration, and the /api/quote route.
 * No network: fetch is intercepted. Run: node tests/design.test.cjs */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const ts = require("typescript");

const root = path.join(__dirname, "..");
const cache = new Map();
function load(file, ctx) {
  if (cache.has(file)) return cache.get(file).exports;
  const mod = { exports: {} };
  cache.set(file, mod);
  if (file.endsWith(".json")) {
    mod.exports = JSON.parse(fs.readFileSync(file, "utf8"));
    return mod.exports;
  }
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const resolve = (id) => {
    if (id === "next/server") return ctx.nextServer;
    if (id.startsWith("@/")) {
      const base = path.join(root, "src", id.slice(2));
      for (const ext of ["", ".ts", ".json"]) if (fs.existsSync(base + ext) && fs.statSync(base + ext).isFile()) return load(base + ext, ctx);
    }
    throw new Error("unresolved " + id);
  };
  vm.runInNewContext(code, { module: mod, exports: mod.exports, require: resolve, ...ctx.globals });
  return mod.exports;
}

const results = [];
const test = async (name, fn) => {
  try { await fn(); results.push(["ok", name]); } catch (e) { results.push(["FAIL", name, e.message]); }
};
const makeCtx = (env, calls, logs) => ({
  nextServer: {
    NextRequest: class {},
    NextResponse: { json: (body, init) => ({ body, status: init?.status || 200 }) },
  },
  globals: {
    Buffer, Uint8Array, AbortSignal, JSON, Number, Math, Array, Object, String, Promise, Error,
    console: { error() {}, warn() {}, log: (...a) => logs.push(a.join(" ")) },
    process: { env },
    fetch: async (url, init) => {
      calls.push({ url, init });
      return { ok: true, status: 201, json: async () => ({}) };
    },
  },
});
function req(body) {
  const text = JSON.stringify(body);
  const data = Buffer.from(text);
  return {
    headers: { get: () => String(data.length) },
    body: { getReader() { let done = false; return { read: async () => (done ? { done: true } : ((done = true), { done: false, value: new Uint8Array(data) })), cancel: async () => {} }; } },
  };
}
async function post(body, env = {}) {
  const calls = [], logs = [];
  const ctx = makeCtx(env, calls, logs);
  cache.clear();
  const route = load(path.join(root, "src/app/api/quote/route.ts"), ctx);
  const res = await route.POST(req(body));
  return { res, calls, logs };
}
const jpeg = Buffer.from([255, 216, 255, 224, 0, 4, 0, 0, 255, 217]).toString("base64");
const good = {
  name: "Test Person", email: "TEST@example.invalid", phone: "(254) 555-0101", notes: "n", website: "",
  design: { artW: 16, artH: 20, mouldingId: "roma-walnut-classic", matStyle: "classic", matWidth: "standard", matColorId: "warm-white", estimate: 445 },
  attachments: [{ name: "x.jpg", content: jpeg }],
};

(async () => {
  const mouldings = JSON.parse(fs.readFileSync(path.join(root, "src/data/mouldings.json"), "utf8"));
  await test("mouldings.json has 16 entries with every required field and an image on disk", () => {
    assert.equal(mouldings.length, 16);
    for (const m of mouldings) {
      for (const k of ["id", "name", "descriptor", "maker", "colorFamily", "railWidthIn", "priceTier", "profileImage"]) assert.ok(m[k] !== undefined && m[k] !== "", `${m.id} missing ${k}`);
      assert.ok(["Roma", "Larson-Juhl"].includes(m.maker));
      assert.ok(["economy", "mid", "premium", "signature"].includes(m.priceTier));
      assert.ok(fs.existsSync(path.join(root, "public", m.profileImage)), m.profileImage);
    }
    assert.equal(new Set(mouldings.map((m) => m.id)).size, 16, "ids unique");
  });

  await test("pricing: 16x20 mid-tier ~ $350-450; 36x48 mid-tier >= $1,000", () => {
    const ctx = makeCtx({}, [], []); cache.clear();
    const { estimate } = load(path.join(root, "src/lib/design/pricing.ts"), ctx);
    const { matColors } = load(path.join(root, "src/lib/design/catalog.ts"), ctx);
    const mid = mouldings.find((m) => m.priceTier === "mid");
    const mat = matColors.find((c) => c.id === "warm-white");
    const a = estimate({ artW: 16, artH: 20, moulding: mid, matStyle: "classic", matWidth: "standard", matColor: mat }).total;
    const b = estimate({ artW: 36, artH: 48, moulding: mid, matStyle: "classic", matWidth: "standard", matColor: mat }).total;
    assert.ok(a >= 350 && a <= 450, "16x20 => " + a);
    assert.ok(b >= 1000, "36x48 => " + b);
    const float = estimate({ artW: 16, artH: 20, moulding: mid, matStyle: "float", matWidth: "standard", matColor: mat }).total;
    assert.ok(float > a, "float costs more");
  });

  await test("a 17th moulding is data-only (catalog + pricing accept it unchanged)", () => {
    const ctx = makeCtx({}, [], []); cache.clear();
    const { estimate } = load(path.join(root, "src/lib/design/pricing.ts"), ctx);
    const { matColors } = load(path.join(root, "src/lib/design/catalog.ts"), ctx);
    const extra = { id: "x-17", name: "Seventeen", descriptor: "d", maker: "Roma", colorFamily: "Black", railWidthIn: 1, priceTier: "mid", profileImage: "/mouldings/roma-onyx.svg" };
    assert.ok(estimate({ artW: 8, artH: 10, moulding: extra, matStyle: "none", matWidth: "standard", matColor: matColors[0] }).total > 0);
  });

  await test("quote: valid request -> 200, email + Brevo contact sent, attachment passed", async () => {
    const { res, calls } = await post(good, { BREVO_API_KEY: "mock-only" });
    assert.equal(res.status, 200); assert.equal(res.body.success, true);
    assert.equal(calls.length, 2);
    assert.ok(calls[0].url.endsWith("/smtp/email")); assert.ok(calls[1].url.endsWith("/contacts"));
    const mail = JSON.parse(calls[0].init.body);
    assert.equal(mail.to[0].email, "info@solasgallery.com");
    assert.equal(mail.attachment.length, 1);
    assert.match(mail.htmlContent, /Walnut Classic/);
    assert.match(mail.htmlContent, /Estimated from/);
    const contact = JSON.parse(calls[1].init.body);
    assert.equal(contact.email, "test@example.invalid"); assert.deepEqual(contact.listIds, [2]); assert.equal(contact.attributes.SMS, "+12545550101");
  });
  await test("quote: server re-prices, ignoring a tampered client estimate", async () => {
    const { calls } = await post({ ...good, design: { ...good.design, estimate: 1 } }, { BREVO_API_KEY: "mock-only" });
    assert.match(JSON.parse(calls[0].init.body).htmlContent, /\$4\d\d/);
  });
  await test("quote: rejects bad email, bad phone, missing name, oversize art, unknown moulding", async () => {
    for (const patch of [{ email: "nope" }, { phone: "123" }, { name: "" }, { design: { ...good.design, artW: 80 } }, { design: { ...good.design, mouldingId: "nope" } }]) {
      const { res, calls } = await post({ ...good, ...patch }, { BREVO_API_KEY: "mock-only" });
      assert.equal(res.status, 400, JSON.stringify(patch)); assert.equal(calls.length, 0);
    }
  });
  await test("quote: honeypot is silently accepted without sending", async () => {
    const { res, calls } = await post({ ...good, website: "spam" }, { BREVO_API_KEY: "mock-only" });
    assert.equal(res.status, 200); assert.equal(calls.length, 0);
  });
  await test("quote: HTML in name/notes is escaped in the email", async () => {
    const { calls } = await post({ ...good, name: "<b>X</b>", notes: "<script>1</script>" }, { BREVO_API_KEY: "mock-only" });
    const html = JSON.parse(calls[0].init.body).htmlContent;
    assert.ok(!html.includes("<script>1") && !html.includes("<b>X</b>"));
  });
  await test("quote: no key outside production -> stub (logged payload, nothing sent)", async () => {
    const { res, calls, logs } = await post(good, {});
    assert.equal(res.status, 200); assert.equal(res.body.stubbed, true); assert.equal(calls.length, 0);
    assert.match(logs.join(""), /quote:stub/);
  });
  await test("quote: no key in production -> 503, never silently drops the lead", async () => {
    const { res } = await post(good, { VERCEL_ENV: "production" });
    assert.equal(res.status, 503);
  });
  await test("quote: email failure -> 502; contact failure alone still succeeds", async () => {
    const calls = [], logs = [];
    const ctx = makeCtx({ BREVO_API_KEY: "k" }, calls, logs);
    let n = 0;
    ctx.globals.fetch = async (url) => ({ ok: !(n++ === 0), status: 500, json: async () => ({}) });
    cache.clear();
    const route = load(path.join(root, "src/app/api/quote/route.ts"), ctx);
    assert.equal((await route.POST(req(good))).status, 502);
    const ctx2 = makeCtx({ BREVO_API_KEY: "k" }, [], []);
    let m = 0; ctx2.globals.fetch = async () => ({ ok: m++ === 0, status: 400, json: async () => ({}) });
    cache.clear();
    const route2 = load(path.join(root, "src/app/api/quote/route.ts"), ctx2);
    assert.equal((await route2.POST(req(good))).status, 200);
  });

  let failed = 0;
  for (const [s, n, m] of results) { console.log(`${s === "ok" ? "✓" : "✗"} ${n}${m ? "\n    " + m : ""}`); if (s !== "ok") failed++; }
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
})();
