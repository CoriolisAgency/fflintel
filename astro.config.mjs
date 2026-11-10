// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { readFileSync } from "node:fs";

// Sitemap lastmod from content dates (FFLI-NOTES-P1): each note's dateModified, plus pages edited in that PR.
const NOTES = JSON.parse(readFileSync(new URL("./src/lib/notes.json", import.meta.url), "utf8"));
const LASTMOD = new Map(NOTES.map((n) => [n.path, n.dateModified]));
LASTMOD.set("/methodology/", "2026-11-10");
LASTMOD.set("/brief/", "2026-11-10");

/**
 * Custom domain (default): https://fflintel.com  â†’ base /
 * GitHub project path only: ASTRO_BASE=/fflintel/ ASTRO_SITE=https://coriolisagency.github.io
 */
const base = process.env.ASTRO_BASE || "/";
const site = process.env.ASTRO_SITE || "https://fflintel.com";

// @ts-check
export default defineConfig({
  site,
  base,
  // GitHub Pages serves /page/ and 301s /page, so emit the slash form.
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [
    sitemap({
      serialize(item) {
        const d = LASTMOD.get(new URL(item.url).pathname);
        if (d) item.lastmod = `${d}T12:00:00-05:00`; // noon ET on the content date
        return item;
      },
    }),
  ],
  redirects: {
    "/issues": "/brief",
    "/issues/2026-08-three-numbers": "/brief/three-numbers",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
