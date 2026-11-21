/* Static checks on the form components (G6-01, G6-02, G6-03). No network. */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { test } = require("node:test");
const read = (p) => fs.readFileSync(path.join(__dirname, "..", p), "utf8");

test("every <form> uses method=post so a pre-hydration submit never puts details in the URL", () => {
  const files = ["src/components/InquiryForm.tsx", "src/components/TradeForm.tsx", "src/components/design/DetailsStep.tsx"];
  for (const f of files) {
    const forms = read(f).match(/<form\b[^>]*>/g) || [];
    assert.ok(forms.length > 0, f);
    for (const tag of forms) assert.match(tag, /method="post"/, `${f}: ${tag}`);
  }
});

test("/capture: submitting is the opt-in; contact/trade keep the unticked box", () => {
  const inq = read("src/components/InquiryForm.tsx");
  assert.match(inq, /newsletter: compact \|\| data\.get\("news"\) === "on"/);
  assert.match(inq, /\{!compact && \(\s*<label className="check">/);
  assert.match(inq, /"Join the list"/);
  assert.doesNotMatch(inq, /defaultChecked|checked=\{true\}/);
  assert.match(read("src/app/capture/page.tsx"), /<InquiryForm source="in-person-qr" compact \/>/);
  const trade = read("src/components/TradeForm.tsx");
  assert.match(trade, /<input type="checkbox" name="news" \/>/);
  assert.match(trade, /newsletter: v\("news"\) === "on"/);
});

test("'You're on the list' is shown only for a server-confirmed add", () => {
  const inq = read("src/components/InquiryForm.tsx");
  assert.match(inq, /sent === "added"\s*\?\s*\["You’re on the list\."/);
  assert.match(inq, /setSent\(listStatus\(result\.list\)\)/);
  const note = read("src/components/ListNote.tsx");
  assert.match(note, /"failed"/); // unknown/missing status falls back to the honest failure line
});

test("top bar does not say the Rifle Paper Co. gifts are made in Salado", () => {
  const nav = read("src/components/Nav.tsx");
  assert.doesNotMatch(nav, /made and sold in Salado/);
  assert.match(nav, /Framed in our Salado shop · Rifle Paper Co\. gifts/);
});

test("G7-01: trade tiers are 10/15/20% at $2,500/$7,500/$15,000, rolling 12 months, framing only", () => {
  const trade = read("src/app/trade/page.tsx");
  const faq = read("src/app/trade/faq/page.tsx");
  assert.match(trade, /\["Associate", "10%", "\$2,500"\]/);
  assert.match(trade, /\["Preferred", "15%", "\$7,500"\]/);
  assert.match(trade, /\["Atelier", "20%", "\$15,000"\]/);
  assert.match(trade, /rolling 12 months/);
  assert.match(trade, /custom framing only, not retail gifts/);
  assert.match(faq, /10%, 15% and 20% off custom framing/);
  assert.match(faq, /\$2,500 for Associate \(10%\), \$7,500 for Preferred \(15%\) and \$15,000 for Atelier \(20%\)/);
  assert.match(faq, /rolling 12 months/);
  assert.match(faq, /Custom framing only\. Retail gifts are not included/);
  // Nothing anywhere in the app still offers the old 25% top tier or a no-spend tier.
  const walk = (dir) =>
    fs.readdirSync(path.join(__dirname, "..", dir), { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : /\.(tsx?|json)$/.test(e.name) ? [path.join(dir, e.name)] : [],
    );
  for (const f of walk("src")) {
    const s = read(f);
    assert.doesNotMatch(s, /25%|25 percent/, f);
    assert.doesNotMatch(s, /no (minimum )?spend|without (a )?minimum/i, f);
  }
});

test("FS6-02: a network failure never shows the browser's text and always gives phone + email", () => {
  const msgs = read("src/lib/formErrors.ts");
  assert.match(msgs, /business\.phone/);
  assert.match(msgs, /business\.email/);
  assert.match(msgs, /couldn’t confirm your \$\{what\} reached us/);
  assert.match(msgs, /wasn’t sent: this device looks offline/);
  for (const f of ["src/components/InquiryForm.tsx", "src/components/TradeForm.tsx", "src/components/design/DetailsStep.tsx"]) {
    const s = read(f);
    assert.doesNotMatch(s, /\b(e|err|error)\.message\b/, `${f} must not show a raw error message`);
    assert.match(s, /unconfirmedMessage\(/, f);
    assert.match(s, /if \(isOffline\(\)\)/, f);
    assert.match(s, /\} catch \{/, f);
  }
});

test("G7-02: a native (pre-hydration / no-JS) submit goes to the fallback route, never back to the page", () => {
  for (const f of ["src/components/InquiryForm.tsx", "src/components/TradeForm.tsx", "src/components/design/DetailsStep.tsx"]) {
    for (const tag of read(f).match(/<form\b[^>]*>/g) || []) assert.match(tag, /action="\/api\/form-fallback"/, `${f}: ${tag}`);
  }
  for (const f of ["src/components/InquiryForm.tsx", "src/components/TradeForm.tsx"]) assert.match(read(f), /<noscript>/, f);
  const page = read("src/app/form-not-sent/page.tsx");
  assert.match(page, /noindex: true/);
  assert.match(page, /business\.phone/);
  assert.match(page, /business\.email/);
  assert.doesNotMatch(read("src/app/sitemap.ts"), /form-not-sent/);
});

test("G7-02: /api/form-fallback discards the body and 303s to /form-not-sent with nothing in the URL", async () => {
  const ts = require("typescript");
  const code = ts.transpileModule(read("src/app/api/form-fallback/route.ts"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  new Function("module", "exports", "Response", code)(mod, mod.exports, Response);
  for (const fn of ["POST", "GET"]) {
    const res = await mod.exports[fn](new Request("http://x/api/form-fallback?name=a", { method: fn, body: fn === "POST" ? "name=Jane&email=j%40x.com" : undefined }));
    assert.equal(res.status, 303);
    assert.equal(res.headers.get("location"), "/form-not-sent");
  }
});

test("G7-03: Cherie's email writes the mat width with the same fractions as the page", () => {
  const route = read("src/app/api/start-framing/route.ts");
  assert.match(route, /MAT_WIDTH_LABEL\[matWidth\]\} \(\$\{formatInches\(est\.matIn\)\}″\)/);
  assert.doesNotMatch(route, /\$\{est\.matIn\}"/);
  const ts = require("typescript");
  const out = ts.transpileModule(read("src/lib/design/parseSize.ts"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  new Function("module", "exports", out)(mod, mod.exports);
  assert.equal(mod.exports.formatInches(2.5), "2 1/2");
});

test("customer-facing email shows only info@solasgallery.com; cherie@ is the lead recipient only", () => {
  const r = read("src/app/api/start-framing/route.ts");
  assert.match(r, /const PUBLIC_EMAIL = "info@solasgallery\.com";/);
  // the customer confirmation block: sent from and replying to the public address
  const conf = r.slice(r.indexOf("to: [{ email }]") - 200, r.indexOf("to: [{ email }]") + 200);
  assert.match(conf, /sender: PUBLIC_SENDER/);
  assert.match(conf, /replyTo: \{ email: PUBLIC_EMAIL/);
  assert.doesNotMatch(conf, /LEADS_TO|cherie@/);
  // no other address is printed anywhere a visitor can see it
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  const root = path.join(__dirname, "..", "src");
  for (const f of walk(root).filter((f) => /\.(tsx?|css)$/.test(f) && !f.includes(`${path.sep}api${path.sep}`))) {
    const emails = (fs.readFileSync(f, "utf8").match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || []).filter((e) => !e.endsWith("@example.com"));
    for (const e of emails) assert.equal(e, "info@solasgallery.com", `${path.relative(root, f)} shows ${e}`);
  }
});

test("NAP once per page: the footer block is skipped where the page body already has it", () => {
  const foot = read("src/components/Footer.tsx");
  assert.match(foot, /export const NAP_IN_PAGE = \["\/", "\/visit", "\/contact"\];/);
  assert.match(foot, /\{!napInPage && \(\s*<div className="footer-contact">/);
  const home = read("src/app/page.tsx");
  assert.equal((home.match(/business\.streetAddress/g) || []).length, 1, "homepage prints the street address once");
  assert.equal((home.match(/Cherie Flanagan/g) || []).length, 1, "homepage introduces Cherie once");
});
