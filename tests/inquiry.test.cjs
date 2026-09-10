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
const good = {
  name: "Test Visitor",
  email: "TEST@example.invalid",
  phone: "(254) 555-0101",
  source: "capture",
  website: "",
  message: "A family photograph",
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
    process: { env: { BREVO_API_KEY: "mock-only", ...options.env } },
    require(id) {
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
  await test("capture creates server-list contact and styled notification", async () => {
    const r = await run({ ...good, listId: 999 });
    assert.equal(r.status, 200);
    assert.equal(r.data.success, true);
    assert.equal(r.calls.length, 2);
    assert.equal(r.calls[0].url, "https://api.brevo.com/v3/contacts");
    assert.deepEqual(r.calls[0].body.listIds, [2]);
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
    assert.equal(r.calls[1].body.attachment.length, 2);
    assert.equal(r.calls[1].body.attachment[0].content, jpeg);
    assert.equal(r.calls[1].body.attachment[0].name, "framing-concept.jpg");
    assert.match(r.calls[1].body.htmlContent, /24 × 36 inches/);
    assert.match(r.calls[1].body.htmlContent, /Gold fillet requested/);
  });
  await test("visitor strings HTML escaped and subject newlines removed", async () => {
    const r = await run({
      ...good,
      name: "Test <img src=x>\r\nBcc:evil",
      message: '<script>alert("x")</script> & it\'s',
      project: { frame: "<b>gold</b>", city: "<img src=x>" },
    });
    assert.equal(r.status, 200);
    const e = r.calls[1].body;
    assert(!e.htmlContent.includes("<script>"));
    assert(!e.htmlContent.includes("<img src=x>"));
    assert(e.htmlContent.includes("&lt;script&gt;"));
    assert(e.htmlContent.includes("&amp;"));
    assert(!/[\r\n]/.test(e.subject));
  });
  await test("server list override respected; client list ignored", async () => {
    const r = await run(
      { ...good, listId: 99 },
      { env: { BREVO_LIST_ID: "7" } },
    );
    assert.deepEqual(r.calls[0].body.listIds, [7]);
  });
  await test("contact failure never reports success or sends notification", async () => {
    const r = await run(good, { statuses: [400] });
    assert.equal(r.status, 502);
    assert.notEqual(r.data.success, true);
    assert.equal(r.calls.length, 1);
  });
  await test("notification failure never reports success", async () => {
    const r = await run(good, { statuses: [201, 503] });
    assert.equal(r.status, 502);
    assert.notEqual(r.data.success, true);
    assert.equal(r.calls.length, 2);
  });
  await test("upstream network error returns failure", async () => {
    const r = await run(good, { throwAt: 1 });
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
  await test("project text bounded and source cannot inject", async () => {
    const r = await run({
      ...good,
      source: "<img src=x>",
      project: { frame: "W".repeat(1000), city: "T".repeat(1000) },
    });
    assert.equal(r.status, 200);
    assert(!r.calls[1].body.htmlContent.includes("W".repeat(121)));
    assert(!r.calls[1].body.htmlContent.includes("T".repeat(121)));
    assert.match(r.calls[1].body.subject, /Website inquiry/);
  });
  console.log(
    `\n${pass} passed; ${fail} failed. All upstream traffic mocked; zero external requests.`,
  );
  process.exitCode = fail ? 1 : 0;
})();
