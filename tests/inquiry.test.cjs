/* Isolated route tests. All fetch calls intercepted in a VM; no network access. */
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const ts = require("typescript");
const input = fs.readFileSync(
  require("node:path").join(__dirname, "../src/app/api/inquiry/route.ts"),
  "utf8",
);
const code = ts.transpileModule(input, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const rlCode = ts.transpileModule(
  fs.readFileSync(require("node:path").join(__dirname, "../src/lib/rateLimit.ts"), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } },
).outputText;
const good = {
  name: "Test Visitor",
  email: "TEST@example.invalid",
  phone: "(254) 555-0101",
  source: "capture",
  website: "",
  message: "A family photograph",
  newsletter: true,
};
const jpeg = Buffer.from([255, 216, 255, 224, 0, 4, 0, 0, 255, 217]).toString(
  "base64",
);
async function run(body, options = {}) {
  const calls = [];
  const exports = {};
  const context = {
    exports,
    Buffer,
    Uint8Array,
    AbortSignal,
    console: { error() {} },
    process: { env: { BREVO_API_KEY: "mock-only", VERCEL_ENV: "production", BREVO_LIST_ID: "38", ...options.env } },
    require(id) {
      if (id === "@/lib/rateLimit") {
        const rl = { exports: {} };
        vm.runInNewContext(rlCode, { module: rl, exports: rl.exports, Map, Date, Headers }, { filename: "rateLimit.js" });
        return rl.exports;
      }
      assert.equal(id, "next/server");
      return {
        NextResponse: {
          json(data, init) {
            return Response.json(data, init);
          },
        },
      };
    },
    fetch: async (url, init) => {
      calls.push({ url, init, body: JSON.parse(init.body) });
      if (options.throwAt === calls.length) throw new Error("mock timeout");
      const status = (options.statuses || [201, 201])[calls.length - 1] || 201;
      return { ok: status >= 200 && status < 300, status };
    },
  };
  vm.runInNewContext(code, context, { filename: "inquiry-route.js" });
  const request = new Request("http://localhost/api/inquiry", {
    method: "POST",
    headers: { "content-type": "application/json", ...options.headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  const response = await context.exports.POST(request);
  return { status: response.status, data: await response.json(), calls };
}
const smtp = (r) => r.calls.find((c) => c.url === "https://api.brevo.com/v3/smtp/email");
let pass = 0,
  fail = 0;
async function test(name, fn) {
  try {
    await fn();
    pass++;
    console.log("PASS " + name);
  } catch (e) {
    fail++;
    console.error("FAIL " + name + ": " + e.stack);
  }
}
async function invalid(name, body, status = 400, options) {
  await test(name, async () => {
    const r = await run(body, options);
    assert.equal(r.status, status);
    assert.notEqual(r.data.success, true);
    assert.equal(r.calls.length, 0);
  });
}
(async () => {
  await test("capture adds to the server list FIRST, then sends the notification that reports it (G8-02)", async () => {
    const r = await run({ ...good, listId: 999 });
    assert.equal(r.status, 200);
    assert.equal(r.data.success, true);
    assert.equal(r.calls.length, 2);
    assert.equal(r.calls[0].url, "https://api.brevo.com/v3/contacts");
    assert.equal(r.calls[1].url, "https://api.brevo.com/v3/smtp/email");
    assert.deepEqual(r.calls[0].body.listIds, [5]); // list 5 VF, never the legacy BREVO_LIST_ID (38)
    assert.equal(r.calls[0].body.email, "test@example.invalid");
    assert.equal(r.calls[0].body.attributes.SMS, "+12545550101");
    assert.equal(r.calls[1].body.to[0].email, "info@solasgallery.com");
    assert.equal(r.calls[1].body.replyTo.email, "test@example.invalid");
    assert.match(r.calls[1].body.subject, /In-person QR/);
  });
  await test("studio attachments and project directions passed to notification", async () => {
    const r = await run({
      ...good,
      source: "framing-studio",
      project: {
        frame: "Walnut",
        mat: "Ivory",
        width: "24",
        height: "36",
        fillet: true,
        city: "Temple",
      },
      attachments: [
        { name: "a.jpg", content: jpeg },
        { name: "b.jpeg", content: jpeg },
      ],
    });
    assert.equal(r.status, 200);
    assert.equal(smtp(r).body.attachment.length, 2);
    assert.equal(smtp(r).body.attachment[0].content, jpeg);
    assert.equal(smtp(r).body.attachment[0].name, "framing-concept.jpg");
    assert.match(smtp(r).body.htmlContent, /24 × 36 inches/);
    assert.match(smtp(r).body.htmlContent, /Gold fillet requested/);
  });
  await test("visitor strings HTML escaped and subject newlines removed", async () => {
    const r = await run({
      ...good,
      name: "Test <img src=x> Bcc:evil",
      message: '<script>alert("x")</script> & it\'s',
      project: { frame: "<b>gold</b>", city: "<img src=x>" },
    });
    assert.equal(r.status, 200);
    const e = smtp(r).body;
    assert(!e.htmlContent.includes("<script>"));
    assert(!e.htmlContent.includes("<img src=x>"));
    assert(e.htmlContent.includes("&lt;script&gt;"));
    assert(e.htmlContent.includes("&amp;"));
    assert(!/[\r\n]/.test(e.subject));
  });
  await test("CR/LF and control characters in name, email or phone are rejected (header injection)", async () => {
    for (const bad of [{ name: "A\r\nBcc: evil@x.com" }, { name: "A\nB" }, { email: "a@b.com\r\nBcc: x@y.com" }, { phone: "254\n555" }, { name: "A\u2028B" }]) {
      const r = await run({ ...good, ...bad });
      assert.equal(r.status, 400, JSON.stringify(bad));
      assert.equal(r.calls.length, 0);
    }
  });
  await test("over-long name/message rejected, not silently cut", async () => {
    assert.equal((await run({ ...good, name: "x".repeat(121) })).status, 400);
    assert.equal((await run({ ...good, message: "x".repeat(3001) })).status, 400);
    assert.equal((await run({ ...good, message: "x".repeat(3000) })).status, 200);
  });
  await test("per-IP rate limit: 9th request in the window gets 429 and sends nothing", async () => {
    const rlmod = { exports: {} };
    vm.runInNewContext(rlCode, { module: rlmod, exports: rlmod.exports, Map, Date, Headers }, { filename: "rl.js" });
    const { allow } = rlmod.exports;
    const res = [];
    for (let i = 0; i < 10; i++) res.push(allow("inquiry", "1.2.3.4", 8, 600000, 1000 + i));
    assert.deepEqual(res, [true, true, true, true, true, true, true, true, false, false]);
    assert.equal(allow("inquiry", "1.2.3.4", 8, 600000, 1000 + 600001), true);
    assert.equal(allow("inquiry", "5.6.7.8", 8, 600000, 1010), true);
  });
  await test("server list override respected; client list ignored", async () => {
    const r = await run(
      { ...good, listId: 99 },
      { env: { BREVO_VF_LIST_ID: "7" } },
    );
    assert.deepEqual(r.calls[0].body.listIds, [7]);
  });
  await test("list-add failure (400, bad list id) is NON-FATAL: notification still sent, request succeeds", async () => {
    const r = await run(good, { statuses: [400, 201] });
    assert.equal(r.status, 200);
    assert.equal(r.data.success, true);
    assert.equal(r.calls.length, 2);
    assert.equal(r.calls[1].url, "https://api.brevo.com/v3/smtp/email");
  });
  await test("no opt-in: submitter is NOT added to the marketing list", async () => {
    const r = await run({ ...good, newsletter: false });
    assert.equal(r.status, 200);
    assert.equal(r.calls.length, 1);
    const r2 = await run({ ...good, newsletter: undefined });
    assert.equal(r2.calls.length, 1);
    const r3 = await run({ ...good, newsletter: "true" });
    assert.equal(r3.calls.length, 1);
  });
  await test("list-add network error is NON-FATAL", async () => {
    const r = await run(good, { throwAt: 1 });
    assert.equal(r.status, 200);
    assert.equal(r.data.success, true);
  });
  await test("notification failure never reports success", async () => {
    const r = await run(good, { statuses: [201, 503] });
    assert.equal(r.status, 502);
    assert.notEqual(r.data.success, true);
    assert.equal(r.calls.length, 2);
    const n = await run({ ...good, newsletter: false }, { statuses: [503] });
    assert.equal(n.status, 502);
    assert.equal(n.calls.length, 1);
  });
  await test("upstream network error returns failure", async () => {
    const r = await run(good, { throwAt: 2 });
    assert.equal(r.status, 502);
    assert.notEqual(r.data.success, true);
  });
  await test("contact update 204 accepted", async () => {
    const r = await run(good, { statuses: [204, 201] });
    assert.equal(r.data.success, true);
  });
  await invalid("missing API key", good, 503, { env: { BREVO_API_KEY: "" } });
  for (const body of ["{bad", "null", "[]", '"hello"'])
    await invalid("malformed or invalid top-level " + body, body);
  for (const [key, value] of [
    ["name", ""],
    ["name", {}],
    ["name", "  "],
    ["email", ""],
    ["email", "no-at-sign"],
    ["email", "<a>@x.com"],
  ])
    await invalid("invalid " + key + " " + JSON.stringify(value), {
      ...good,
      [key]: value,
    });
  await test("honeypot succeeds with incomplete fields and no API key/upstream", async () => {
    const r = await run({ website: "bot" }, { env: { BREVO_API_KEY: "" } });
    assert.equal(r.status, 200);
    assert.equal(r.data.success, true);
    assert.equal(r.calls.length, 0);
  });
  for (const [label, attachments] of [
    ["more than two", Array(3).fill({ name: "a.jpg", content: jpeg })],
    ["wrong container", {}],
    ["null entry", [null]],
    ["bad base64", [{ name: "a.jpg", content: "%%%%" }]],
    [
      "data URL",
      [{ name: "a.jpg", content: "data:image/jpeg;base64," + jpeg }],
    ],
    [
      "wrong signature",
      [{ name: "a.jpg", content: Buffer.from("not jpeg").toString("base64") }],
    ],
    ["wrong extension", [{ name: "a.html", content: jpeg }]],
    [
      "oversized individual",
      [{ name: "a.jpg", content: jpeg + "A".repeat(750001) }],
    ],
  ])
    await invalid("reject attachment " + label, { ...good, attachments });
  const largeJpeg = Buffer.concat([
    Buffer.from([255, 216, 255]),
    Buffer.alloc(550100),
  ]).toString("base64");
  await invalid("aggregate JPEG byte limit", {
    ...good,
    attachments: [
      { name: "a.jpg", content: largeJpeg },
      { name: "b.jpg", content: largeJpeg },
    ],
  });
  for (const width of ["0", "301", "NaN", "Infinity", {}])
    await invalid("reject dimension " + JSON.stringify(width), {
      ...good,
      project: { width },
    });
  await invalid("declared body too large", good, 413, {
    headers: { "content-length": "2000001" },
  });
  await invalid(
    "streamed body too large without content-length",
    { ...good, message: "X".repeat(2000001) },
    413,
  );
  // G6-01: the response must say what happened to the list add, so /capture never
  // claims "You're on the list" for an add that did not happen.
  await test("list status: production opt-in reports added only when Brevo accepts", async () => {
    assert.equal((await run(good)).data.list, "added");
    assert.equal((await run(good, { statuses: [204, 201] })).data.list, "added");
    const bad = await run(good, { statuses: [400, 201] });
    assert.equal(bad.data.success, true);
    assert.equal(bad.data.list, "failed");
    assert.equal((await run(good, { throwAt: 1 })).data.list, "failed");
    const noLegacy = await run(good, { env: { BREVO_LIST_ID: "" } });
    assert.equal(noLegacy.data.list, "added");
    assert.deepEqual(noLegacy.calls[0].body.listIds, [5]);
  });
  await test("list status: preview never adds and says preview; no opt-in says none", async () => {
    const r = await run(good, { env: { VERCEL_ENV: "preview" } });
    assert.equal(r.status, 200);
    assert.equal(r.calls.length, 1);
    assert.equal(r.calls[0].url, "https://api.brevo.com/v3/smtp/email");
    assert.match(r.calls[0].body.subject, /^\[PREVIEW TEST\] /);
    assert.equal(r.data.list, "preview");
    const none = await run({ ...good, newsletter: false });
    assert.equal(none.data.list, "none");
    const noneP = await run({ ...good, newsletter: false }, { env: { VERCEL_ENV: "preview" } });
    assert.equal(noneP.data.list, "none");
  });
  await test("project text bounded and source cannot inject", async () => {
    const r = await run({
      ...good,
      source: "<img src=x>",
      project: { frame: "W".repeat(1000), city: "T".repeat(1000) },
    });
    assert.equal(r.status, 200);
    assert(!smtp(r).body.htmlContent.includes("W".repeat(121)));
    assert(!smtp(r).body.htmlContent.includes("T".repeat(121)));
    assert.match(smtp(r).body.subject, /Website inquiry/);
  });
  // G8-02: the /capture notification has its own heading, and the newsletter line
  // says what really happened to the list add (never "added" on the preview or after a failed add).
  const row = (html) => (html.match(/<th[^>]*>Newsletter<\/th><td[^>]*>([^<]*)<\/td>/) || [])[1];
  await test("G8-02: QR sign-up heading; contact and trade keep theirs", async () => {
    assert.match(smtp(await run(good)).body.htmlContent, /<h1[^>]*>New sign-up from the in-shop QR page<\/h1>/);
    assert.match(smtp(await run({ ...good, source: "in-person-qr" })).body.htmlContent, /New sign-up from the in-shop QR page/);
    assert.match(smtp(await run({ ...good, source: "contact" })).body.htmlContent, /<h1[^>]*>A new framing conversation<\/h1>/);
    assert.match(smtp(await run({ ...good, source: "trade" })).body.htmlContent, /<h1[^>]*>New trade application<\/h1>/);
  });
  await test("G8-02: newsletter line is honest in every state", async () => {
    assert.equal(row(smtp(await run(good)).body.htmlContent), "added to list");
    assert.equal(row(smtp(await run(good, { statuses: [204, 201] })).body.htmlContent), "added to list");
    assert.match(row(smtp(await run(good, { statuses: [400, 201] })).body.htmlContent), /list add failed \(not added/);
    assert.match(row(smtp(await run(good, { throwAt: 1 })).body.htmlContent), /list add failed/);
    const p = await run(good, { env: { VERCEL_ENV: "preview" } });
    assert.equal(row(smtp(p).body.htmlContent), "would be added in production (preview: not added)");
    assert.doesNotMatch(smtp(p).body.htmlContent, /added to list/);
    assert.equal(row(smtp(await run({ ...good, newsletter: false })).body.htmlContent), "not requested (not added)");
  });
  console.log(
    `\n${pass} passed; ${fail} failed. All upstream traffic mocked; zero external requests.`,
  );
  process.exitCode = fail ? 1 : 0;
})();
