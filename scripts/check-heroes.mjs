#!/usr/bin/env node
/**
 * Hero gate (FFLI-NOTES-P1; Paul 2026-11-10 9:05 AM ET via Chief: "all posts need hero images").
 * Runs before `astro build` (npm run build), so the PR CI workflow and the Pages deploy both fail without a hero.
 * Every note in src/lib/notes.json needs a hero WebP + PNG fallback and a PNG/JPEG og crop under public/, with
 * real pixel sizes equal to the declared width/height, width >= 1200, og >= 1200x630, and descriptive alt text.
 * Every src/pages/**.md that uses NoteLayout must have a registry entry, and every legacy BRIEFS/ESSAYS card
 * image in src/lib/briefs.ts must exist with alt text.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const PUB = path.join(ROOT, "public");
const errors = [];
const fail = (m) => errors.push(m);

export function imageSize(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), type: "png" };
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7), type: "jpeg" };
      if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
      i += 2 + buf.readUInt16BE(i + 2);
    }
    return null;
  }
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const c = buf.toString("ascii", 12, 16);
    if (c === "VP8X") return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3), type: "webp" };
    if (c === "VP8 ") return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff, type: "webp" };
    if (c === "VP8L") { const b = buf.readUInt32LE(21); return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1, type: "webp" }; }
  }
  return null;
}

function checkImage(at, rel, w, h, types, minW, minH) {
  if (!rel) return fail(`${at}: missing image path`);
  const f = path.join(PUB, rel);
  if (!existsSync(f)) return fail(`${at}: missing file public/${rel}`);
  const s = imageSize(readFileSync(f));
  if (!s) return fail(`${at}: public/${rel} is not a PNG, JPEG or WebP`);
  if (!types.includes(s.type)) fail(`${at}: public/${rel} is ${s.type}, expected ${types.join("/")}`);
  if (s.w !== w || s.h !== h) fail(`${at}: public/${rel} is ${s.w}x${s.h}, declared ${w}x${h}`);
  if (s.w < minW || s.h < minH) fail(`${at}: public/${rel} is ${s.w}x${s.h}, needs at least ${minW}x${minH}`);
  if (statSync(f).size > 600_000) fail(`${at}: public/${rel} is over 600 KB`);
}

const notes = JSON.parse(readFileSync(path.join(ROOT, "src/lib/notes.json"), "utf8"));
const slugs = new Set();
for (const n of notes) {
  const at = `[${n.slug}]`;
  slugs.add(n.slug);
  const h = n.hero;
  if (!h) { fail(`${at}: no hero (all posts need hero images)`); continue; }
  if (!h.alt || h.alt.trim().length < 20) fail(`${at}: hero alt missing or under 20 chars`);
  if (/^Card:/i.test(h.alt || "")) fail(`${at}: hero alt still has the "Card:" label`);
  if (h.src !== `notes/${n.slug}-hero-1600x900.webp`) fail(`${at}: hero src should be notes/${n.slug}-hero-1600x900.webp`);
  checkImage(`${at} hero`, h.src, h.width, h.height, ["webp"], 1200, 0);
  checkImage(`${at} hero fallback`, h.fallback, h.width, h.height, ["png", "jpeg"], 1200, 0);
  if (!h.og) fail(`${at}: no og image`);
  else checkImage(`${at} og`, h.og.src, h.og.width, h.og.height, ["png", "jpeg"], 1200, 630);
  const page = path.join(ROOT, "src/pages", `${n.path.replace(/^\/|\/$/g, "")}.md`);
  if (!existsSync(page)) fail(`${at}: no page ${path.relative(ROOT, page)}`);
  else if (!new RegExp(`^slug: ${n.slug}$`, "m").test(readFileSync(page, "utf8"))) fail(`${at}: page frontmatter slug mismatch`);
  if (!n.title || !n.h1 || !n.description) fail(`${at}: title, h1 and description are required`);
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}
for (const f of walk(path.join(ROOT, "src/pages")).filter((f) => f.endsWith(".md"))) {
  const src = readFileSync(f, "utf8");
  if (!/^layout: .*NoteLayout\.astro$/m.test(src)) continue;
  const m = src.match(/^slug: (.+)$/m);
  if (!m || !slugs.has(m[1].trim())) fail(`${path.relative(ROOT, f)}: NoteLayout page with no notes.json entry (needs a hero)`);
}

const briefs = readFileSync(path.join(ROOT, "src/lib/briefs.ts"), "utf8");
for (const m of briefs.matchAll(/image: "([^"]+)",\s*imageAlt: "([^"]*)"/g)) {
  if (!existsSync(path.join(PUB, m[1]))) fail(`briefs.ts: card image public/${m[1]} missing`);
  if (m[2].trim().length < 10) fail(`briefs.ts: card image ${m[1]} has no alt text`);
}

if (errors.length) {
  console.error(`check-heroes: ${errors.length} problem(s)\n - ${errors.join("\n - ")}`);
  process.exit(1);
}
console.log(`check-heroes: ok (${notes.length} notes with heroes)`);
