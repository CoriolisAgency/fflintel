#!/usr/bin/env node
/**
 * slint self-tests (SLOP-LINT-P1). Run: node slint.test.mjs. Exits 1 on any failure.
 * Same file in gunsearchengine and fflintel (scripts/copy-lint/) and on the box (/workspace/copy-desk/slint/).
 */
import assert from "node:assert/strict";
import { BLOCK, isHeadingLine, lintText, proseForStats } from "./slint.mjs";

let failed = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.error(`  FAIL ${name}\n${e.message}`); }
}
const ids = (r) => r.hits.map((h) => h.id);
const LONG = [
  "The ATF listing for July 2026 counts every federal firearms license on the public file, by type and by state.",
  "Search engines still send a large share of buyers to gun store sites, even as AI answers take some of the clicks.",
  "A dealer who keeps the feed current sees fewer stale listings and fewer calls asking about guns that already sold.",
  "Most of the change shows up in mobile traffic, where answer boxes and chat tools now sit above the regular results.",
  "The useful question for a shop is which pages still bring in buyers, and that answer comes from its own analytics.",
  "Ranking reports from outside tools are estimates, so the shop's own Search Console data is the better place to start.",
  "Content that answers a specific local question tends to hold its traffic better than broad posts about the industry.",
  "None of this means writing stops mattering; it means the writing has to carry facts a shopper can't get elsewhere.",
];

// Chief 2026-11-10 10:17 AM ET: headings are not sentences ("SEO is dead" false positive).
test("headings are left out of sentence stats (markdown, HTML, standalone title-case)", () => {
  const md = [
    "# SEO Is Dead",
    LONG[0] + " " + LONG[1],
    "## Why It Looks That Way",
    LONG[2] + " " + LONG[3],
    "<h2>What Still Works</h2>",
    LONG[4] + " " + LONG[5],
    "<h3 class=\"x\">The Local Angle</h3>",
    "What To Do Next",
    LONG[6] + " " + LONG[7],
    "### Short Answers",
    "Is SEO Dead",
    "Why Do You Care?",
  ].join("\n\n");
  const r = lintText(md, "gse", { raw: true });
  assert.equal(r.sentenceLengths.length, 8, `8 real sentences, got ${r.sentenceLengths.length}`);
  assert.ok(r.sentenceLengths.every((n) => n > 12), "no heading counted as a short sentence");
  assert.ok(!ids(r).includes("staccato-run"), "no staccato-run from headings");
  assert.ok(!ids(r).includes("rhythm"), "no rhythm from headings");
  assert.doesNotMatch(proseForStats(md), /SEO Is Dead|Why It Looks|What Still Works|Local Angle|What To Do Next|Short Answers|Is SEO Dead/);
});

test("the same headings counted as sentences would have tripped rhythm (control)", () => {
  const md = ["SEO is dead.", LONG[0], "Why it looks that way.", LONG[1], "What still works.", "The local angle.", "What to do next.", LONG[2], "Short answers.", "Is it dead."].join("\n\n");
  const r = lintText(md, "gse", { raw: true });
  assert.ok(ids(r).includes("rhythm") || ids(r).includes("staccato-run"), "short punctuated lines still count");
});

test("choppy fragments in prose still flag", () => {
  const md = "It is fast. It is cheap. It is local. It works. " + LONG.join(" ");
  const r = lintText(md, "gse", { raw: true });
  assert.ok(r.hits.some((h) => h.id === "staccato-run" && h.level === BLOCK));
});

test("isHeadingLine: short and unpunctuated only", () => {
  assert.equal(isHeadingLine("What Still Works"), true);
  assert.equal(isHeadingLine("**The Official 2024 Numbers**"), true);
  assert.equal(isHeadingLine("It works."), false);
  assert.equal(isHeadingLine("Is it dead?"), false);
  assert.equal(isHeadingLine("Why Do You Care?"), true);
  assert.equal(isHeadingLine("Gold Jerry, gold."), false);
  assert.equal(isHeadingLine("lowercase start no punctuation"), false);
  assert.equal(isHeadingLine("This line runs on well past twelve words and has no ending punctuation at all here"), false);
});

test("pattern rules still read headings", () => {
  const r = lintText("## Here's what changed\n\n" + LONG.join(" "), "gse", { raw: true });
  assert.ok(ids(r).includes("heres-setup"));
});

test("ffli: one agency link in the final paragraph passes; earlier or a second one flags", () => {
  const link = "[gun store websites](https://www.coriolisagency.com/ecommerce)";
  const ok = lintText(LONG.slice(0, 4).join(" ") + "\n\n" + LONG.slice(4).join(" ") + "\n\nCoriolis builds " + link + " for dealers who want their real inventory online.", "ffli", { raw: true });
  assert.ok(!ids(ok).some((i) => i.startsWith("pitch") || i.startsWith("agency")), ids(ok).join(","));
  const early = lintText("Coriolis builds " + link + " for dealers.\n\n" + LONG.join(" "), "ffli", { raw: true });
  assert.ok(ids(early).includes("pitch-pivot"));
  const two = lintText(LONG.join(" ") + "\n\nCoriolis builds " + link + " and " + link + ".", "ffli", { raw: true });
  assert.ok(ids(two).includes("agency-link-count"));
});

if (failed) { console.error(`slint.test: ${failed} failed`); process.exitCode = 1; } else console.log("ok: slint.test");
