#!/usr/bin/env node
/**
 * IndexNow submit for fflintel.com (FFLI-NOTES-P1). Run after a deploy is live:
 *   node scripts/indexnow-submit.mjs https://fflintel.com/some-page/ ...
 * The key is the public/<32 hex>.txt file (public by IndexNow design). It is never printed.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const urls = process.argv.slice(2).filter((u) => /^https:\/\/fflintel\.com\//.test(u));
if (!urls.length) {
  console.error("usage: node scripts/indexnow-submit.mjs https://fflintel.com/<path>/ ...");
  process.exit(2);
}
const keyFile = readdirSync(path.join(ROOT, "public")).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
const key = process.env.INDEXNOW_KEY || (keyFile ? readFileSync(path.join(ROOT, "public", keyFile), "utf8").trim() : "");
if (!key) {
  console.error("no IndexNow key file in public/");
  process.exit(2);
}
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: "fflintel.com", key, keyLocation: `https://fflintel.com/${key}.txt`, urlList: urls }),
});
console.log(JSON.stringify({ endpoint: "https://api.indexnow.org/indexnow", status: res.status, accepted: res.status === 200 || res.status === 202, submitted: urls.length, urls }));
if (res.status !== 200 && res.status !== 202) process.exit(1);
