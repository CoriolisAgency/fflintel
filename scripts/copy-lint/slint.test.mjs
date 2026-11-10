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


test("Paul's SEO is dead opening and Gold Jerry payoff do not flag staccato-run", () => {
  const md = [
    "So WTF is SEO anyway? You think you know. But do you?",
    "SEO stands for search engine optimization. It is a critical component of any effective digital marketing plan.",
    "The most basic version of SEO is you creating a page or post on your website that targets a specific keyword or phrase and getting links to that content, using the same keywords, placed on high quality websites that already have a high authority on those keywords. That bit about high quality and authority is important. More on that later. These links are called backlinks, and they're gold.",
    "Gold Jerry, gold.",
    LONG[0], LONG[1], LONG[2], LONG[3], LONG[4], LONG[5], LONG[6], LONG[7],
  ].join("\n\n");
  const r = lintText(md, "gse", { raw: true });
  assert.ok(!ids(r).includes("staccato-run"), `staccato-run on Paul's opening: ${ids(r)}`);
  assert.ok(!ids(r).includes("rhythm"), `rhythm on Paul's opening: ${ids(r)}`);
});

test("DP-1 closer is exempt from question-cta; any other question CTA still flags", () => {
  const closer = "**Run a gun store? [List it on GunSearchEngine free.](/for-dealers/feed?utm_source=gse-blog&utm_medium=internal&utm_campaign=dealer-path&utm_content=dropship-items-without-confusing-walk-ins)** GSE Basic, feed sync included, is free for every FFL.";
  const ok = lintText(LONG.join(" ") + "\n\n" + closer, "gse", { raw: true });
  assert.ok(!ids(ok).includes("question-cta"), `locked closer flagged: ${ok.hits.filter((h) => h.id === "question-cta").map((h) => h.match)}`);
  const other = lintText(LONG.join(" ") + "\n\nOwn a range? Book a walkthrough this week.", "gse", { raw: true });
  assert.ok(ids(other).includes("question-cta"), "other question CTA must still flag");
  const mixed = lintText(LONG.join(" ") + "\n\nWant a demo?\n\n" + closer, "gse", { raw: true });
  const q = mixed.hits.filter((h) => h.id === "question-cta");
  assert.equal(q.length, 1, `expected one question-cta, got ${q.length}: ${q.map((h) => h.match)}`);
  assert.match(q[0].match, /Want a demo\?/);
});

test("D4 keyword in opening, one H2 and one FAQ is exempt from stamped-phrase", () => {
  const md = [
    "The honest way to show dropship items on a gun store site is to say so: put those dropship or catalog products in their own clearly marked area.",
    LONG[0],
    "### How to show dropship items on a gun store site",
    LONG[1] + " " + LONG[2],
    "### Quick answers",
    "**How do I show dropship items on a gun store website without confusing walk-in customers?** Put those items in their own clearly marked area.",
    LONG[3] + " " + LONG[4],
  ].join("\n\n");
  const raw = lintText(md, "gse", { raw: true });
  assert.equal(raw.keywordSource, "derived-title-h2-faq", raw.keywordSource);
  assert.match(raw.keyword, /show dropship items on a gun store/);
  assert.ok(!ids(raw).includes("stamped-phrase"), `exempt placement flagged: ${raw.hits.filter((h) => h.id === "stamped-phrase").map((h) => h.match)}`);

  const withQuery = [
    "- **Target query:** show dropship items on a gun store site",
    "",
    "## Body",
    "",
    md,
  ].join("\n");
  const fromQuery = lintText(withQuery, "gse");
  assert.equal(fromQuery.keywordSource, "target-query", fromQuery.keywordSource);
  assert.equal(fromQuery.keyword, "show dropship items on a gun store site");
  assert.ok(!ids(fromQuery).includes("stamped-phrase"), "target-query path should also be exempt");

  const extra = lintText(md + "\n\nStaff should also show dropship items on a gun store homepage the same way.", "gse", { raw: true });
  assert.ok(ids(extra).includes("stamped-phrase"), "a fourth body repeat must still flag");

  const otherGram = [
    "The caveat about stale listings on a product page is the same caveat about stale listings on a product page, and then the caveat about stale listings on a product page appears again.",
    LONG.join(" "),
  ].join("\n\n");
  const other = lintText(otherGram, "gse", { raw: true });
  assert.ok(ids(other).includes("stamped-phrase"), "a non-keyword 7-gram x3 must still flag");
});

if (failed) { console.error(`slint.test: ${failed} failed`); process.exitCode = 1; } else console.log("ok: slint.test");
