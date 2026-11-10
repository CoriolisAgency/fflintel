#!/usr/bin/env node
/**
 * Link gate (FFLI-OVERHAUL-P1 F6, F7, F8, F9). Runs after `astro build` on dist/.
 * - F7: no page links to a GSE URL that is noindex (/betsy-vs-retailbi, /betsy-live, /betsy/enterprise-copilot).
 * - F8: the sitemap leaves out /confirmed/ and /what-is-retailbi/.
 * - F6 + F9: each note (src/lib/notes.json) has at most one agency link outside <footer>, and it carries
 *   utm_source=fflintel&utm_medium=referral&utm_campaign=fflintel-{note-slug}. Chrome doors and pillar links
 *   carry no agency link, so the note body line is the only one.
 * Prints the non-footer agency link count per page for the post-deploy crawl.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const DIST = path.join(ROOT, "dist");
const errors = [];
const fail = (m) => errors.push(m);

if (!existsSync(DIST)) {
  console.error("check-links: dist/ missing; run astro build first");
  process.exit(1);
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

const NOINDEX_GSE = /https?:\/\/(?:www\.)?gunsearchengine\.com\/(?:betsy-vs-retailbi|betsy-live|betsy\/enterprise-copilot)(?=[/"'?#]|$)/;
const hrefs = (html) => [...html.matchAll(/href\s*=\s*"([^"]*)"/g)].map((m) => m[1].replace(/&amp;/g, "&"));
const isAgency = (h) => /^https?:\/\/(?:www\.)?coriolisagency\.com(?:[/?#]|$)/.test(h);

const notes = JSON.parse(readFileSync(path.join(ROOT, "src/lib/notes.json"), "utf8"));
const notePath = new Map(notes.map((n) => [n.path, n.slug]));

const report = [];
for (const file of walk(DIST)) {
  const rel = "/" + path.relative(DIST, file).split(path.sep).join("/").replace(/index\.html$/, "");
  const html = readFileSync(file, "utf8");
  for (const h of hrefs(html)) if (NOINDEX_GSE.test(h)) fail(`${rel}: links to noindex GSE page ${h}`);
  const cut = html.search(/<footer[\s>]/);
  const body = cut === -1 ? html : html.slice(0, cut);
  const agency = hrefs(body).filter(isAgency);
  report.push(`${agency.length}\t${rel}`);
  const slug = notePath.get(rel);
  if (slug) {
    if (agency.length > 1) fail(`${rel}: ${agency.length} agency links outside <footer> (max 1)`);
    for (const h of agency) {
      const u = new URL(h);
      const want = { utm_source: "fflintel", utm_medium: "referral", utm_campaign: `fflintel-${slug}` };
      for (const [k, v] of Object.entries(want)) {
        if (u.searchParams.get(k) !== v) fail(`${rel}: agency link ${h} needs ${k}=${v}`);
      }
    }
  }
}

for (const sm of readdirSync(DIST).filter((n) => /^sitemap.*\.xml$/.test(n))) {
  const xml = readFileSync(path.join(DIST, sm), "utf8");
  for (const bad of ["/confirmed/", "/what-is-retailbi/"]) {
    if (xml.includes(`fflintel.com${bad}<`) || xml.includes(`${bad}</loc>`)) fail(`${sm}: lists ${bad}`);
  }
}

console.log("check-links: agency links outside <footer> per page");
console.log(report.sort().join("\n"));
if (errors.length) {
  console.error(`check-links: ${errors.length} problem(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`check-links: OK (${report.length} pages, ${notes.length} notes)`);
