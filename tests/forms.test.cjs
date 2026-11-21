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
