import data from "./notes.json";

/**
 * FFLI notes registry (FFLI-NOTES-P1, Paul 2026-11-10 8:36 AM ET via Chief). One entry per note page under
 * src/pages/**.md with `layout: NoteLayout`. Every note needs a hero (Paul 9:05 AM ET: all posts need hero
 * images). scripts/check-heroes.mjs (run by `npm run build`, so CI and deploy) fails the build without one.
 * Hero convention: /workspace/seo/heroes/ffli/<slug>/ -> public/notes/<slug>-hero-1600x900.(webp|png) and
 * public/notes/<slug>-og-1200x630.jpg.
 */
export type NoteHero = {
  src: string;
  fallback: string;
  width: number;
  height: number;
  alt: string;
  og: { src: string; width: number; height: number };
};

export type Note = {
  id: string;
  slug: string;
  path: string;
  kicker: string;
  title: string;
  h1: string;
  description: string;
  schema: "NewsArticle" | "WebPage";
  dataset: boolean;
  datePublished: string;
  dateModified: string;
  dateLabel: string;
  hero: NoteHero;
  faqs: { q: string; a: string }[];
};

export const NOTES = data as Note[];

export function noteBySlug(slug: string): Note | undefined {
  return NOTES.find((n) => n.slug === slug);
}
