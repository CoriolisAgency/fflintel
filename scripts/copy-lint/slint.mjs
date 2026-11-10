#!/usr/bin/env node
/**
 * slint: Coriolis slop linter (SLOP-LINT-P1; decision WRITING-FIX, Paul 2026-11-10 10:02 AM ET).
 * Port of the section 5 prototype in /workspace/copy-desk/brandy-quality-proposal-2026-11-10.md
 * (slop_lint.py), with Paul's WRITING-FIX changes (10:02 AM ET lock, via Chief 10:03 and 10:07 AM ET).
 * FFLI notes may carry exactly one agency link, and only in the final paragraph of the note.
 *
 * One file, no dependencies, Node 18+. The same file lives in:
 *   gunsearchengine  scripts/copy-lint/slint.mjs   (CI: scripts/test-slop-lint.ts, quality job)
 *   fflintel         scripts/copy-lint/slint.mjs   (CI: npm run build, next to the hero gate)
 *   box              /workspace/copy-desk/slint/slint.mjs  (Brandy and SERP, before handoff)
 * Tests: slint.test.mjs next to this file (node slint.test.mjs); CI runs it before linting.
 *
 * Usage: node slint.mjs [--kind gse|ffli|news] <file-or-dir>...
 *   Directories are walked for .md/.mdx/.markdown files; *.pre-neo.md files and dot-folders are skipped.
 *
 * What is read: the text between <!-- BODY START --> and <!-- BODY END --> when present; else the
 * "## Body" section of a draft when present; else the whole file minus YAML front matter. Any
 * "Sources" section is dropped. Tables are skipped, and list blocks and headings are skipped for rhythm.
 *
 * Enforcement switch: SLINT_MODE below. "warn" prints findings and always exits 0. "block" exits 1
 * when any BLOCK-level finding fires. Only Chief's word flips it to "block".
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/** The one enforcement switch: "warn" | "block". Set to "warn" (Chief, 2026-11-10 10:03 AM ET). */
export const SLINT_MODE = "warn";

export const BLOCK = "BLOCK";
export const WARN = "WARN";

// [id, level, regex source, regex flags, message]. Rule list owner: SERP (changes go through Chief).
export const RULES = [
  ["neg-parallel-bare-aux", BLOCK, String.raw`\b(?:doesn't|does not|isn't|is not|can't|won't|don't)\b[^.!?]{0,120}[.!?]\s+[^.!?]{0,80}\b(?:does|do|is|will|can|did)\.(?=\s|$)`, "",
    "'X doesn't ... Y does.' contrast. State what Y does, with the specific."],
  ["not-x-its-y", BLOCK, String.raw`\b(?:it|this|that)(?:'s| is) not (?:just |only |about )?[^.;:!?]{1,60}[,;:.]\s*(?:it|this|that)(?:'s| is)\b`, "",
    "'It's not X, it's Y.' Say what it is."],
  ["not-only-but", WARN, String.raw`\bnot (?:just|only|merely)\b[^.]{1,80}\bbut\b`, "", "'Not only/just ... but' parallel."],
  ["more-than-just", BLOCK, String.raw`\bmore than (?:just )?an? \w+\b`, "", "'More than just a ...' framing."],
  ["heres-setup", BLOCK, String.raw`\bHere(?:'s| is) (?:what|how|why|the thing|the deal|the catch|where)\b`, "", "'Here's what/how' setup line. Just say it."],
  ["colon-reveal-q", WARN, String.raw`\b(?:The (?:result|catch|fix|answer|kicker|truth|bottom line|upshot))[?:]`, "", "Reveal-style setup ('The catch:')."],
  ["no-no-no", BLOCK, String.raw`(?:\b(?:No|Not)\b[^.]{1,40}\.\s+){2}(?:\b(?:No|Not|Just)\b[^.]{1,40}\.)`, "", "'No X. No Y. Just Z.' fragment run."],
  ["aphorism", WARN, String.raw`(?:^|(?<=[.!?]\s))(?:A|An|Every) [a-z][\w' -]{1,40} is (?:a|an|the) [\w' -]{2,30}\.`, "", "Slogan aphorism ('A listing is a promise.'). Cut or give the fact."],
  ["filler-phrases", BLOCK, String.raw`\b(?:straight from the|written for you|make no mistake|let's be clear|here's the thing|bottom line|plain and simple|full stop|the hard part is|the real question|at the end of the day|in today's|game[- ]chang\w*|level up|dive in|let's dive|unlock\w*|leverag\w*|seamless\w*|robust|empower\w*|elevat\w*|supercharg\w*|best-in-class|cutting-edge|world-class|delve|tapestry|landscape of|navigate the|it's important to note|it is important to note|in conclusion|in summary)\b`, "i",
    "Stock phrase on the house ban list."],
  ["copula-dodge", WARN, String.raw`\b(?:serves as|stands as|acts as|boasts|functions as)\b`, "i", "Write 'is' or 'has'."],
  ["fake-depth", WARN, String.raw`,\s+(?:highlighting|underscoring|showcasing|reflecting|ensuring|signaling|demonstrating)\b`, "", "Trailing -ing 'analysis' clause."],
  ["source-hedge-body", WARN, String.raw`\b(?:wasn't|was not|weren't) reachable|from our desk|we haven't opened|could not be (?:retrieved|opened)|returned (?:an )?(?:error|403)\b`, "i",
    "Source-availability hedge in body. Say it once, near the number, or put it in Sources."],
  ["question-cta", WARN, String.raw`(?:^|\n)\**(?:Run|Own|Have|Need|Want) a [^?]{1,40}\?`, "", "Question-led CTA. Fine once per post (DP-1), flagged so it is not repeated."],
];

const AGENCY = /coriolisagency\.com|fflaccelerator\.com/gi;

const HEADING = /^(#{1,6})\s+(.*)$/;

/** Pick the lintable body out of a Markdown file (see header). Returns raw Markdown, links intact. */
export function extractBody(text) {
  let t = text.replace(/\r\n?/g, "\n");
  const m = t.match(/<!-- BODY START -->([\s\S]*?)<!-- BODY END -->/);
  if (m) t = m[1];
  else {
    t = t.replace(/^---\n[\s\S]*?\n---\n/, "");
    const lines = t.split("\n");
    const bi = lines.findIndex((l) => /^#{1,6}\s+Body\s*$/i.test(l));
    if (bi >= 0) {
      const lvl = lines[bi].match(HEADING)[1].length;
      let end = lines.length;
      for (let i = bi + 1; i < lines.length; i++) {
        const h = lines[i].match(HEADING);
        if (h && h[1].length <= lvl) { end = i; break; }
      }
      t = lines.slice(bi + 1, end).join("\n");
    }
  }
  // Drop any Sources section, up to the next heading of the same or higher level.
  const lines = t.split("\n");
  const out = [];
  let skip = 0;
  for (const l of lines) {
    const h = l.match(HEADING);
    if (skip && h && h[1].length <= skip) skip = 0;
    if (!skip && h && /^sources\b/i.test(h[2].trim())) { skip = h[1].length; continue; }
    if (!skip) out.push(l);
  }
  return out.join("\n").replace(/<!--[\s\S]*?-->/g, "").replace(/^```[\s\S]*?^```/gm, "");
}

function plain(t) {
  return t
    .replace(/^\s*\|.*\|\s*$/gm, "") // tables
    .replace(/\]\([^)]*\)/g, "]") // md links -> text
    .replace(/[\[\]*_`>#]/g, "");
}

function sentences(t) {
  const out = [];
  for (let para of t.split(/\n\s*\n/)) {
    para = para.trim();
    if (!para || /^[-\d]/.test(para)) continue; // skip list blocks
    para = para.replace(/\s+/g, " ");
    out.push(...para.split(/(?<=[.!?])\s+(?=[A-Z"'])/).filter(Boolean));
  }
  return out;
}

const MD_HEADING_LINE = /^\s*#{1,6}\s/;
const HTML_HEADING = /<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/gi;
/** Longest standalone line (in words) still treated as a heading when it has no terminal punctuation. */
export const HEADING_MAX_WORDS = 12;

const MINOR_WORDS = new Set("a an and as at but by for from in into nor of on or per the to vs via with".split(" "));

/** Title Case: two or more words, and every word that is not a minor word starts with a capital or digit. */
export function isTitleCase(p) {
  const words = p.replace(/[?!]+["')\]]*$/, "").split(/\s+/).filter(Boolean);
  if (words.length < 2) return false;
  return words.every((w, i) => /^[^A-Za-z]*[A-Z0-9]/.test(w) || (i > 0 && MINOR_WORDS.has(w.toLowerCase())));
}

/**
 * True for a standalone line that reads as a heading: at most HEADING_MAX_WORDS words, starts with a capital,
 * and either has no terminal punctuation or is in Title Case ending in ? or ! ("Why Do You Care?").
 */
export function isHeadingLine(line) {
  const p = plain(line).trim();
  if (!p || !/^[A-Z0-9"'(]/.test(p)) return false;
  if (p.split(/\s+/).length > HEADING_MAX_WORDS) return false;
  if (!/[.!?:;,]["')\]]*$/.test(p)) return true;
  return /[?!]["')\]]*$/.test(p) && isTitleCase(p);
}

/**
 * The prose used for sentence-length stats (staccato-run, rhythm). Headings are not sentences
 * (Chief 2026-11-10 10:17 AM ET): Markdown # lines, HTML <h1>-<h6>, and standalone heading-like lines
 * (short, no terminal punctuation) are left out. Pattern rules still read the full body.
 */
export function proseForStats(md) {
  const paras = [];
  for (const para of md.replace(HTML_HEADING, "\n\n").split(/\n\s*\n/)) {
    const lines = para.split("\n").filter((l) => l.trim() && !MD_HEADING_LINE.test(l));
    if (!lines.length) continue;
    if (lines.length === 1 && isHeadingLine(lines[0])) continue;
    paras.push(lines.join("\n"));
  }
  return plain(paras.join("\n\n"));
}

const clip = (s) => s.slice(0, 110).replace(/\n/g, " ");

/**
 * Lint Markdown text. `kind`: "gse" | "ffli" | "news". `opts.raw`: pass true when `text` is already
 * the body (no extraction). Returns { hits: [{level, id, match, message}], sentenceLengths }.
 */
export function lintText(text, kind = "gse", opts = {}) {
  const md = opts.raw ? text.replace(/\r\n?/g, "\n") : extractBody(text);
  const t = plain(md);
  const hits = [];
  for (const [id, level, src, flags, message] of RULES) {
    for (const m of t.matchAll(new RegExp(src, flags + "g"))) hits.push({ level, id, match: clip(m[0]), message });
  }
  const L = sentences(proseForStats(md)).map((s) => s.trim().split(/\s+/).length);
  let run = 0, best = 0;
  for (const n of L) { run = n <= 9 ? run + 1 : 0; best = Math.max(best, run); }
  if (best >= 3) hits.push({ level: BLOCK, id: "staccato-run", match: `${best} sentences in a row of 9 words or fewer`, message: "Join them into full sentences with the specific first." });
  if (L.length >= 8) {
    const mean = L.reduce((a, b) => a + b, 0) / L.length;
    const sd = Math.sqrt(L.reduce((a, b) => a + (b - mean) ** 2, 0) / L.length);
    const short = L.filter((n) => n <= 8).length / L.length;
    if (mean < 13 || short > 0.35) hits.push({ level: BLOCK, id: "rhythm", match: `mean ${mean.toFixed(1)} words, sd ${sd.toFixed(1)}, ${Math.round(short * 100)}% of sentences 8 words or fewer`, message: "Monotone short rhythm. Target mean 14-22, short share under 35%." });
  }
  // Repeated 7-word strings (stamped caveats).
  const w = t.toLowerCase().match(/[a-z0-9']+/g) || [];
  const grams = new Map();
  for (let i = 0; i + 7 <= w.length; i++) { const g = w.slice(i, i + 7).join(" "); grams.set(g, (grams.get(g) || 0) + 1); }
  for (const [g, c] of grams) if (c >= 3) hits.push({ level: BLOCK, id: "stamped-phrase", match: `x${c}: ${g}`, message: "Same phrase 3+ times. Say the caveat once." });
  // FFLI reference notes (Paul 10:02 AM ET lock, Chief 10:07 AM ET): one soft agency line is allowed, and only
  // as the final paragraph of the note body (Sources excluded). An agency link anywhere earlier, including
  // elsewhere in the closing paragraphs, flags, and so does a second agency link.
  if (kind === "ffli") {
    const paras = md.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !/^#{1,6}\s/.test(p));
    let total = 0;
    paras.forEach((p, i) => {
      const n = (p.match(AGENCY) || []).length;
      total += n;
      if (n && i < paras.length - 1) hits.push({ level: BLOCK, id: "pitch-pivot", match: clip(p), message: "Agency link before the final paragraph. The one allowed agency line is the last paragraph of the note, or drop it." });
    });
    if (total > 1) hits.push({ level: BLOCK, id: "agency-link-count", match: `${total} agency links`, message: "One agency link per note, in the final paragraph. Cut the others." });
  }
  return { hits, sentenceLengths: L };
}

export function lintFile(file, kind = "gse") {
  return lintText(readFileSync(file, "utf8"), kind);
}

const LINTABLE = /\.(md|mdx|markdown)$/i;
export function collectFiles(target) {
  const st = statSync(target);
  if (!st.isDirectory()) return [target];
  const out = [];
  for (const name of readdirSync(target).sort()) {
    const p = path.join(target, name);
    if (statSync(p).isDirectory()) { if (!name.startsWith(".")) out.push(...collectFiles(p)); }
    else if (LINTABLE.test(name) && !/\.pre-neo\.md$/i.test(name)) out.push(p);
  }
  return out;
}

/** Print one file's findings in the prototype's format. Returns the BLOCK count. */
export function report(label, { hits, sentenceLengths }) {
  const b = hits.filter((h) => h.level === BLOCK).length;
  console.log(`== ${label}: ${b} block, ${hits.length - b} warn, ${sentenceLengths.length} sentences`);
  for (const h of hits) console.log(`  ${h.level.padEnd(5)} ${h.id.padEnd(22)} ${JSON.stringify(h.match)}`);
  if (b && process.env.GITHUB_ACTIONS === "true") {
    console.log(`::warning title=slint (${SLINT_MODE})::${label}: ${b} block-level, ${hits.length - b} warn-level findings`);
  }
  return b;
}

/** Summary line plus the exit code SLINT_MODE dictates. */
export function finish(files, failing) {
  const verdict = SLINT_MODE === "block"
    ? (failing ? "FAIL" : "PASS")
    : `warn-only, exit 0${failing ? ` (${failing} would fail in block mode)` : ""}`;
  console.log(`slint: ${files} file(s), ${failing} with BLOCK findings. SLINT_MODE=${SLINT_MODE}: ${verdict}`);
  return SLINT_MODE === "block" && failing > 0 ? 1 : 0;
}

function main(argv) {
  let kind = "gse";
  const targets = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--kind") kind = argv[++i];
    else if (argv[i].startsWith("--kind=")) kind = argv[i].slice(7);
    else if (argv[i] === "-h" || argv[i] === "--help") { console.log("Usage: node slint.mjs [--kind gse|ffli|news] <file-or-dir>..."); return 0; }
    else targets.push(argv[i]);
  }
  if (!["gse", "ffli", "news"].includes(kind)) { console.error(`slint: unknown --kind ${kind}`); return 2; }
  if (!targets.length) { console.error("Usage: node slint.mjs [--kind gse|ffli|news] <file-or-dir>..."); return 2; }
  const files = targets.flatMap(collectFiles);
  let failing = 0;
  for (const f of files) if (report(f, lintFile(f, kind))) failing++;
  return finish(files.length, failing);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = main(process.argv.slice(2));
}
