/**
 * Outbound lattice + desk paths.
 * Definition of RetailBI ranks on GSE fortress; this host owns commentary.
 */
export const LINKS = {
  home: "https://fflintel.com",
  gse: "https://www.gunsearchengine.com",
  fortress: "https://www.gunsearchengine.com/betsy-vs-retailbi",
  gseIndex: "https://www.gunsearchengine.com/retailbi-firearm-sales-index",
  gseNics: "https://www.gunsearchengine.com/nics-vs-firearm-sales",
  oemDemand: "https://www.gunsearchengine.com/oem-firearms-demand-analytics",
  brandIntel: "https://www.gunsearchengine.com/betsy/enterprise",
  copilot: "https://www.gunsearchengine.com/betsy/enterprise-copilot",
  betsyLive: "https://www.gunsearchengine.com/betsy-live",
  gseBetsy: "https://www.gunsearchengine.com/betsy",
  gsa: "https://gunsearchagent.com",
  gsaRetailbi: "https://gunsearchagent.com/retailbi-and-your-gun-store",
  gsaGa: "https://gunsearchagent.com/google-analytics-alternative-for-ffls",
  accelerator: "https://fflaccelerator.com",
  acceleratorAxis: "https://fflaccelerator.com/retailbi-and-axis",
  checkout: "https://coriolisagency.com/plans",
  coriolis: "https://coriolisagency.com",
  betsy: "https://2abetsy.com",
  artOfDemand: "https://2abetsy.com/art-of-demand-retailbi",
  x: "https://x.com/2ABetsy",
  youtube: "https://www.youtube.com/@BetsyAI",
} as const;

export const SAME_AS = [
  LINKS.coriolis,
  LINKS.gse,
  LINKS.gsa,
  LINKS.betsy,
  LINKS.home,
  LINKS.accelerator,
  LINKS.x,
  LINKS.youtube,
] as const;

/** Shared sky link class for inline body copy */
export const linkClass =
  "font-medium text-sky-700 hover:underline underline-offset-2";

/** Paths relative to site root (no leading slash). Use with withBase(). */
export const CANON_PATHS = {
  headshot: "betsy/images/betsy-headshot-work.png",
  copilot: "betsy/images/betsy-ai-brand-intelligence-enterprise-co-pilot.jpg",
  hero: "betsy/images/hero-daylight.jpg",
  register: "betsy/images/shop-register.jpg",
  search: "betsy/images/empty-search.jpg",
  range: "betsy/images/range-lane.jpg",
  desk: "betsy/images/betsy-desk-hero.jpg",
} as const;

export const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
