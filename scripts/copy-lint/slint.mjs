#!/usr/bin/env node
/**
 * slint: Coriolis slop linter (SLOP-LINT-P1; decision WRITING-FIX, Paul 2026-11-10 10:02 AM ET).
 * Port of the section 5 prototype in /workspace/copy-desk/brandy-quality-proposal-2026-11-10.md
 * (slop_lint.py), with Paul's WRITING-FIX changes (10:02 AM ET lock, via Chief 10:03 and 10:07 AM ET).
 * FFLI notes may carry exactly one agency link, and only in the final paragraph of the note.
 *
 * Calibration (SLOP-LINT-CALIBRATE, Chief 2026-11-10 10:44 AM ET): staccato-run and rhythm
 * thresholds follow Paul's own writing, so the "SEO is dead" opening and his punch-line
 * short sentences do not BLOCK. Exemptions (Chief 10:49 AM ET): the locked GSE DP-1 closer
 * is exempt from question-cta (exact-line match, same idea as the FFLI final-paragraph
 * agency-line exemption); a post's target keyword may appear in the opening paragraph,
 * one H2 and one FAQ question without tripping stamped-phrase. Every other hit still flags.
 *
 * Trim (SLOP-LINT-TRIM, Chief 2026-11-10 11:04 and 11:06 AM ET; Brandy's list):
 * filler-phrases is the 17-phrase keep list (Paul's own words removed), still BLOCK;
 * apostrophes match both ' and ’; more-than-just is WARN; stamped-phrase is BLOCK but
 * also exempts repeats of the post's own title or H1 anywhere in the body; cut-list is a
 * new WARN-only rule for seamless/leverage/empower/best-in-class/game-changing word forms
 * (Oct 4 lock, pending Paul).
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

/**
 * Staccato-run and rhythm thresholds (SLOP-LINT-CALIBRATE, Chief 2026-11-10 10:44 AM ET).
 * Was: 3+ sentences of 9 words or fewer; rhythm mean < 13 or short-share > 0.35.
 * Paul's "SEO is dead" opening ("So WTF is SEO anyway? You think you know. But do you?")
 * and the "Gold Jerry, gold." payoff are short on purpose and must not BLOCK.
 * A run of 3+ very short punch lines (4 words or fewer) still BLOCKs. Rhythm only
 * BLOCKs when the mean is under 10 or more than half the sentences are 8 words or fewer.
 */
export const STACCATO_MAX_WORDS = 4;
export const STACCATO_RUN = 3;
export const RHYTHM_MIN_SENTENCES = 8;
export const RHYTHM_MIN_MEAN = 10;
export const RHYTHM_MAX_SHORT = 0.50;
export const RHYTHM_SHORT_WORDS = 8;

/**
 * Locked GSE DP-1 closer, as plain text (Chief 2026-11-10 10:49 AM ET).
 * Source: /workspace/copy-desk/locks/DP-1-dealer-path-line.md and the Nov 10 GSE sprint drafts.
 * After markdown links and emphasis are stripped, every draft closer reduces to this exact line.
 * question-cta ignores a line that equals this; any other question-led CTA still flags.
 */
export const DP1_CLOSER_PLAIN =
  "Run a gun store? List it on GunSearchEngine free. GSE Basic, feed sync included, is free for every FFL.";

const QUESTION_CTA_SRC = String.raw`(?:^|\n)\**(?:Run|Own|Have|Need|Want) a [^?]{1,40}\?`;
const QUESTION_CTA_MSG = "Question-led CTA. Fine once per post (DP-1), flagged so it is not repeated.";

// [id, level, regex source, regex flags, message]. Rule list owner: SERP (changes go through Chief).
// question-cta is applied in lintText so the DP-1 closer can be exempted by exact line.
export const RULES = [
  ["neg-parallel-bare-aux", BLOCK, String.raw`\b(?:doesn't|does not|isn't|is not|can't|won't|don't)\b[^.!?]{0,120}[.!?]\s+[^.!?]{0,80}\b(?:does|do|is|will|can|did)\.(?=\s|$)`, "",
    "'X doesn't ... Y does.' contrast. State what Y does, with the specific."],
  ["not-x-its-y", BLOCK, String.raw`\b(?:it|this|that)(?:'s| is) not (?:just |only |about )?[^.;:!?]{1,60}[,;:.]\s*(?:it|this|that)(?:'s| is)\b`, "",
    "'It's not X, it's Y.' Say what it is."],
  ["not-only-but", WARN, String.raw`\bnot (?:just|only|merely)\b[^.]{1,80}\bbut\b`, "", "'Not only/just ... but' parallel."],
  ["more-than-just", WARN, String.raw`\bmore than (?:just )?an? \w+\b`, "", "'More than just a ...' framing."],
  ["heres-setup", BLOCK, String.raw`\bHere(?:'s| is) (?:what|how|why|the thing|the deal|the catch|where)\b`, "", "'Here's what/how' setup line. Just say it."],
  ["colon-reveal-q", WARN, String.raw`\b(?:The (?:result|catch|fix|answer|kicker|truth|bottom line|upshot))[?:]`, "", "Reveal-style setup ('The catch:')."],
  ["no-no-no", BLOCK, String.raw`(?:\b(?:No|Not)\b[^.]{1,40}\.\s+){2}(?:\b(?:No|Not|Just)\b[^.]{1,40}\.)`, "", "'No X. No Y. Just Z.' fragment run."],
  ["aphorism", WARN, String.raw`(?:^|(?<=[.!?]\s))(?:A|An|Every) [a-z][\w' -]{1,40} is (?:a|an|the) [\w' -]{2,30}\.`, "", "Slogan aphorism ('A listing is a promise.'). Cut or give the fact."],
  ["filler-phrases", BLOCK, String.raw`\b(?:straight from the|written for you|make no mistake|let['’]s be clear|here['’]s the thing|plain and simple|the hard part is|at the end of the day|level up|dive in|world-class|delve|tapestry|navigate the|it['’]s important to note|it is important to note|in conclusion)\b`, "i",
    "Stock phrase on the house ban list (trimmed 2026-11-10; Paul's own words removed)."],
  ["cut-list", WARN, String.raw`\b(?:seamless\w*|leverag\w*|empower\w*|best-in-class|game[- ]chang\w*)\b`, "i",
    "Word on Paul's Oct 4 cut-on-sight list. Warn only until Paul rules (Chief 2026-11-10 11:06 AM ET)."],
  ["copula-dodge", WARN, String.raw`\b(?:serves as|stands as|acts as|boasts|functions as)\b`, "i", "Write 'is' or 'has'."],
  ["fake-depth", WARN, String.raw`,\s+(?:highlighting|underscoring|showcasing|reflecting|ensuring|signaling|demonstrating)\b`, "", "Trailing -ing 'analysis' clause."],
  ["source-hedge-body", WARN, String.raw`\b(?:wasn't|was not|weren't) reachable|from our desk|we haven't opened|could not be (?:retrieved|opened)|returned (?:an )?(?:error|403)\b`, "i",
    "Source-availability hedge in body. Say it once, near the number, or put it in Sources."],
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

function wordsOf(t) {
  return (plain(t).toLowerCase().match(/[a-z0-9']+/g) || []);
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

function normalizePhrase(s) {
  return wordsOf(s);
}

function yamlValue(fm, keys) {
  for (const key of keys) {
    const re = new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, "im");
    const m = fm.match(re);
    if (m) return m[1].trim();
  }
  return "";
}

const FAQ_HEADING = /^(quick answers|faq|frequently asked|questions)\b/i;

/** A leading markdown-bold question, with or without an answer on the same line. */
function faqQuestionFromLine(line) {
  const m = line.trim().match(/^\*\*(.+?\?)\*\*/);
  return m ? plain(m[1]).trim() : "";
}

/** Pull title, H2 texts and FAQ question lines out of markdown (and an optional title option). */
export function headingParts(md, opts = {}) {
  const titles = [];
  if (opts.title) titles.push(String(opts.title));
  const h2s = [];
  const faqs = [];
  let inFaq = false;
  let faqLevel = 0;
  for (const raw of md.replace(HTML_HEADING, (m) => `\n\n${m}\n\n`).split(/\n\s*\n/)) {
    const block = raw.trim();
    if (!block) continue;
    const hm = block.match(/^(#{1,6})\s+(.*)$/);
    const html = block.match(/^<h([1-6])\b[^>]*>([\s\S]*?)<\/h[1-6]>$/i);
    if (hm || html) {
      const level = hm ? hm[1].length : Number(html[1]);
      const text = plain(hm ? hm[2] : html[2]).trim();
      if (inFaq && level <= faqLevel) inFaq = false;
      if (FAQ_HEADING.test(text)) { inFaq = true; faqLevel = level; continue; }
      if (level === 1 && text) titles.push(text);
      if (level >= 2 && text) h2s.push(text);
      if (text.endsWith("?")) faqs.push(text);
      continue;
    }
    if (block.split("\n").length === 1 && isHeadingLine(block)) {
      const text = plain(block).trim();
      if (FAQ_HEADING.test(text)) { inFaq = true; faqLevel = 2; continue; }
      h2s.push(text);
      if (text.endsWith("?")) faqs.push(text);
      continue;
    }
    // Bold question line, typical of the GSE "Quick answers" FAQ (answer may follow on the same line).
    for (const line of block.split("\n")) {
      const q = faqQuestionFromLine(line);
      if (q && (inFaq || q)) faqs.push(q);
    }
  }
  return { titles, h2s, faqs };
}

/**
 * Longest word sequence (at least 4 words) shared by the title (if any), an H2, and an FAQ question.
 * If there is no title, or the title is a rewrite that does not share a 4-word phrase with
 * the H2 and FAQ (live GSE D4: title "Selling Dropship Items..." vs target query in the H2/FAQ),
 * the longest phrase shared by an H2 and an FAQ question is used (same as the MD path).
 */
export function deriveKeywordFromHeadings(md, opts = {}) {
  const { titles, h2s, faqs } = headingParts(md, opts);
  if (!h2s.length || !faqs.length) return [];
  const h2Pool = h2s.map(normalizePhrase);
  const faqPool = faqs.map(normalizePhrase);
  const titlePool = titles.map(normalizePhrase).filter((w) => w.length);
  const shared = (pools) => {
    let best = [];
    const first = pools[0];
    for (const words of first) {
      for (let n = words.length; n >= 4; n--) {
        if (n <= best.length) break;
        for (let i = 0; i + n <= words.length; i++) {
          const gram = words.slice(i, i + n);
          const ok = pools.every((pool) => pool.some((w) => containsGram(w, gram)));
          if (ok) { best = gram; break; }
        }
      }
    }
    return best;
  };
  if (titlePool.length) {
    const withTitle = shared([titlePool, h2Pool, faqPool]);
    if (withTitle.length) return withTitle;
  }
  return shared([h2Pool, faqPool]);
}

function containsGram(words, gram) {
  if (gram.length > words.length) return false;
  for (let i = 0; i + gram.length <= words.length; i++) {
    if (gram.every((g, j) => words[i + j] === g)) return true;
  }
  return false;
}

/**
 * Target keyword for the stamped-phrase exemption (Chief 2026-11-10 10:49 AM ET).
 * Preference: opts.keyword, then a YAML keyword/target_query field, then a draft
 * "- Target query:" bullet, then a phrase derived from title, H2s and FAQ questions.
 * Returns { words, source } where source is "opts" | "yaml" | "target-query" | "derived-title-h2-faq" | "".
 */
export function extractTargetKeyword(fullText, opts = {}) {
  if (opts.keyword) return { words: normalizePhrase(opts.keyword), source: "opts" };
  const text = String(fullText || "").replace(/\r\n?/g, "\n");
  const yaml = text.match(/^---\n([\s\S]*?)\n---/);
  if (yaml) {
    const v = yamlValue(yaml[1], ["keyword", "keywords", "target_query", "targetQuery", "target-query"]);
    if (v) return { words: normalizePhrase(v), source: "yaml" };
  }
  const bullet = text.match(/^\s*[-*]\s+\*{0,2}Target query:?\*{0,2}\s+(.+)$/im);
  if (bullet) return { words: normalizePhrase(bullet[1]), source: "target-query" };
  const md = opts.raw ? text : extractBody(text);
  const words = deriveKeywordFromHeadings(md, opts);
  return { words, source: words.length ? "derived-title-h2-faq" : "" };
}

function isKeywordGram(keywordWords, gram) {
  return keywordWords.length && containsGram(keywordWords, gram);
}

/**
 * Title and H1 word lists for the stamped-phrase exemption (SLOP-LINT-TRIM, Chief 2026-11-10 11:04 AM ET).
 * A 7-gram that is a contiguous subspan of the post title or H1 is exempt anywhere in the body.
 * Sources: opts.title, a TITLE: archive header, draft Title tag / H1 bullets, and markdown/HTML H1s
 * in the original file (the title often sits outside the extracted body).
 */
export function extractTitlePhrases(fullText, opts = {}) {
  const titles = [];
  if (opts.title) titles.push(String(opts.title));
  const text = String(fullText || "").replace(/\r\n?/g, "\n");
  const header = text.match(/^TITLE:\s*(.+)$/m);
  if (header) titles.push(header[1]);
  const h1b = text.match(/^\s*[-*]\s+\*{0,2}H1:?\*{0,2}\s+(.+)$/im);
  if (h1b) titles.push(h1b[1]);
  const ttb = text.match(/^\s*[-*]\s+\*{0,2}Title tag:?\*{0,2}\s+(.+)$/im);
  if (ttb) titles.push(ttb[1].replace(/\s*\|\s*GunSearchEngine\.com\s*$/i, ""));
  const { titles: fromHeadings } = headingParts(text, {});
  titles.push(...fromHeadings);
  const out = [];
  const seen = new Set();
  for (const s of titles) {
    const words = normalizePhrase(s);
    if (!words.length) continue;
    const key = words.join(" ");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(words);
  }
  return out;
}

function compactWords(words) {
  return words.join("");
}

function isTitleOrH1Gram(titlePhrases, gram) {
  if (titlePhrases.some((words) => containsGram(words, gram))) return true;
  // Title typography: "Coriolis Agency" in the title vs "CoriolisAgency.com" in the body
  // (the leftover archive 7-gram Chief called out on 11:04 AM ET). A trailing "com"
  // token from a .com domain does not break the title match, and spaces inside a
  // brand name are ignored once the 7-gram is at least this long.
  const g = compactWords(gram);
  const gNoCom = g.endsWith("com") ? g.slice(0, -3) : g;
  return titlePhrases.some((words) => {
    const title = compactWords(words);
    if (title.includes(g)) return true;
    return gNoCom !== g && gNoCom.length >= 24 && title.includes(gNoCom);
  });
}

/**
 * Walk the body into labeled blocks so a target-keyword 7-gram can be checked for
 * the allowed placement: opening paragraph, one H2, one FAQ question.
 */
export function locatePhrase(md, gram) {
  const locs = [];
  let inFaq = false;
  let faqLevel = 0;
  let seenProse = false;
  const chunks = md.replace(HTML_HEADING, (m) => `\n\n${m}\n\n`).split(/\n\s*\n/);
  for (const raw of chunks) {
    const block = raw.trim();
    if (!block) continue;
    const hm = block.match(/^(#{1,6})\s+(.*)$/);
    const html = block.match(/^<h([1-6])\b[^>]*>([\s\S]*?)<\/h[1-6]>$/i);
    if (hm || html) {
      const level = hm ? hm[1].length : Number(html[1]);
      const text = hm ? hm[2] : html[2];
      const label = plain(text).trim();
      if (inFaq && level <= faqLevel) inFaq = false;
      if (FAQ_HEADING.test(label)) { inFaq = true; faqLevel = level; continue; }
      const kind = label.endsWith("?") ? "faq-q" : "h2";
      if (containsGram(wordsOf(text), gram)) locs.push({ kind, text: label });
      continue;
    }
    if (block.split("\n").length === 1 && isHeadingLine(block)) {
      const label = plain(block).trim();
      if (FAQ_HEADING.test(label)) { inFaq = true; faqLevel = 2; continue; }
      const kind = label.endsWith("?") ? "faq-q" : "h2";
      if (containsGram(wordsOf(block), gram)) locs.push({ kind, text: label });
      continue;
    }
    // Line-level FAQ questions inside a section (GSE Quick answers).
    let flagged = false;
    for (const line of block.split("\n")) {
      const q = faqQuestionFromLine(line);
      if (q && containsGram(wordsOf(q), gram)) {
        locs.push({ kind: "faq-q", text: q });
        flagged = true;
      }
    }
    if (flagged) continue;
    if (/^[-\d]/.test(block)) continue; // list block
    if (containsGram(wordsOf(block), gram)) {
      const kind = seenProse ? "other" : "opening";
      locs.push({ kind, text: clip(plain(block).trim()) });
    }
    if (!/^>/.test(block)) seenProse = true;
  }
  return locs;
}

function keywordPlacementOk(locs) {
  if (!locs.length) return false;
  const h2 = new Set();
  const faq = new Set();
  let opening = 0;
  for (const l of locs) {
    if (l.kind === "opening") opening++;
    else if (l.kind === "h2") h2.add(l.text);
    else if (l.kind === "faq-q") faq.add(l.text);
    else return false;
  }
  return opening <= 1 && h2.size <= 1 && faq.size <= 1;
}

function isDp1CloserLine(line) {
  return plain(line).replace(/\s+/g, " ").trim() === DP1_CLOSER_PLAIN;
}

/**
 * Lint Markdown text. `kind`: "gse" | "ffli" | "news". `opts.raw`: pass true when `text` is already
 * the body (no extraction). `opts.keyword` / `opts.title` feed the stamped-phrase exemption.
 * Returns { hits, sentenceLengths, keyword, keywordSource }.
 */
export function lintText(text, kind = "gse", opts = {}) {
  const original = text.replace(/\r\n?/g, "\n");
  const md = opts.raw ? original : extractBody(original);
  const t = plain(md);
  const kw = extractTargetKeyword(opts.raw ? original : original, { ...opts, raw: !!opts.raw });
  // When raw, extractTargetKeyword already used the body; still try opts/title derivation.
  const hits = [];
  for (const [id, level, src, flags, message] of RULES) {
    for (const m of t.matchAll(new RegExp(src, flags + "g"))) hits.push({ level, id, match: clip(m[0]), message });
  }
  // question-cta, with the locked DP-1 closer exempted by exact line (Chief 10:49 AM ET).
  const lines = t.split("\n");
  for (const line of lines) {
    const m = line.match(new RegExp(QUESTION_CTA_SRC));
    if (m && !isDp1CloserLine(line)) {
      hits.push({ level: WARN, id: "question-cta", match: clip(m[0]), message: QUESTION_CTA_MSG });
    }
  }
  const L = sentences(proseForStats(md)).map((s) => s.trim().split(/\s+/).length);
  let run = 0, best = 0;
  for (const n of L) { run = n <= STACCATO_MAX_WORDS ? run + 1 : 0; best = Math.max(best, run); }
  if (best >= STACCATO_RUN) {
    hits.push({
      level: BLOCK,
      id: "staccato-run",
      match: `${best} sentences in a row of ${STACCATO_MAX_WORDS} words or fewer`,
      message: "Join them into full sentences with the specific first.",
    });
  }
  if (L.length >= RHYTHM_MIN_SENTENCES) {
    const mean = L.reduce((a, b) => a + b, 0) / L.length;
    const sd = Math.sqrt(L.reduce((a, b) => a + (b - mean) ** 2, 0) / L.length);
    const short = L.filter((n) => n <= RHYTHM_SHORT_WORDS).length / L.length;
    if (mean < RHYTHM_MIN_MEAN || short > RHYTHM_MAX_SHORT) {
      hits.push({
        level: BLOCK,
        id: "rhythm",
        match: `mean ${mean.toFixed(1)} words, sd ${sd.toFixed(1)}, ${Math.round(short * 100)}% of sentences ${RHYTHM_SHORT_WORDS} words or fewer`,
        message: `Monotone short rhythm. Block when mean is under ${RHYTHM_MIN_MEAN} or more than ${Math.round(RHYTHM_MAX_SHORT * 100)}% of sentences are ${RHYTHM_SHORT_WORDS} words or fewer.`,
      });
    }
  }
  // Repeated 7-word strings (stamped caveats). A post's target keyword is allowed when it
  // appears only in the opening paragraph, one H2 and one FAQ question (Chief 10:49 AM ET).
  // Repeats of the post's own title or H1 are exempt anywhere in the body (Chief 11:04 AM ET).
  const titlePhrases = extractTitlePhrases(original, opts);
  const w = t.toLowerCase().match(/[a-z0-9']+/g) || [];
  const grams = new Map();
  for (let i = 0; i + 7 <= w.length; i++) { const g = w.slice(i, i + 7).join(" "); grams.set(g, (grams.get(g) || 0) + 1); }
  for (const [g, c] of grams) {
    if (c < 3) continue;
    const gram = g.split(" ");
    if (isTitleOrH1Gram(titlePhrases, gram)) continue;
    if (isKeywordGram(kw.words, gram)) {
      const locs = locatePhrase(md, gram);
      if (keywordPlacementOk(locs)) continue;
    }
    hits.push({ level: BLOCK, id: "stamped-phrase", match: `x${c}: ${g}`, message: "Same phrase 3+ times. Say the caveat once." });
  }
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
  return { hits, sentenceLengths: L, keyword: kw.words.join(" "), keywordSource: kw.source };
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
