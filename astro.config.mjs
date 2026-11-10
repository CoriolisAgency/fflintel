// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

/**
 * Custom domain (default): https://fflintel.com  → base /
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
  // Sitemap lists only indexable, self-canonical pages (FFLI-OVERHAUL-P1 A6).
  integrations: [
    sitemap({
      filter: (page) => !/\/confirmed\/?$/.test(new URL(page).pathname),
    }),
  ],
  // Slash-form targets so Pages serves them with no extra hop.
  redirects: {
    "/issues": "/brief/",
    "/issues/2026-08-three-numbers": "/brief/three-numbers/",
    "/what-is-retailbi": "/retailbi-firearm-sales-index/",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
