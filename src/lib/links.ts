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
  betsyLive: "https://www.gunsearchengine.com/betsy-live",
  gseBetsy: "https://www.gunsearchengine.com/betsy",
  gsa: "https://gunsearchagent.com",
  gsaRetailbi: "https://gunsearchagent.com/retailbi-and-your-gun-store",
  accelerator: "https://fflaccelerator.com",
  acceleratorAxis: "https://fflaccelerator.com/retailbi-and-axis",
  checkout: "https://coriolisagency.com/plans",
  coriolis: "https://coriolisagency.com",
  betsy: "https://2abetsy.com",
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
  "font-medium text-sky-400 hover:underline underline-offset-2";

/** Paths relative to site root (no leading slash). Use with withBase(). */
export const CANON_PATHS = {
  headshot: "betsy/images/betsy-headshot-work.png",
  tzu: "betsy/images/betsy-tzu-art-of-war.jpg",
  desk: "betsy/images/betsy-desk-hero.jpg",
  range: "betsy/images/betsy-at-the-range-work.jpg",
} as const;

export const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
