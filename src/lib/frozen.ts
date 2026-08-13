/**
 * Frozen strings from gunsearchengine/docs/entity-kit.md.
 * Copy verbatim. Do not rewrite for voice.
 */

export const FROZEN = {
  retailbi:
    "RetailBI is Gearfire’s shooting-sports sell-through platform. It aggregates point-of-sale and ecommerce transactions from retailers on the Gearfire network and publishes the monthly RetailBI Firearm Sales Index (same-store adjusted new firearm unit sales). Coriolis is not affiliated with Gearfire or RetailBI; marks belong to their owners.",
  index:
    "The RetailBI Firearm Sales Index (Same-Store Adjusted) is Gearfire’s monthly percent-change in new firearm unit sales from a selected panel of reporting retailers. It is a register series, not a search series, and it is not NICS.",
  betsy:
    "Betsy Brand Intelligence measures anonymized shopper search intent across GunSearchEngine, GunSearchAgent embeds, and floor sensors — including unmet (zero-hit) demand. It is not a POS system and not a same-store unit-sales index.",
  fflintel:
    "FFLIntel is the industry desk that keeps three numbers from becoming one: background checks (NICS), register sell-through (including the RetailBI Firearm Sales Index), and search intent (Betsy). Published by Coriolis, LLC. Not affiliated with Gearfire.",
  doctrine:
    "RetailBI’s intelligence is a byproduct of retail operations software. Betsy’s intelligence is a byproduct of product discovery.",
  gsa: "GunSearchAgent is the Google Analytics replacement for FFL and 2A websites: on-site demand intelligence (what shoppers asked for) plus optional inventory sync. Core is free forever. GunSearchAgent Pro is included with the Coriolis FFL Accelerator plan.",
  accelerator:
    "FFL Accelerator is Coriolis’s managed WooCommerce program for FFLs ($569/mo). It includes GunSearchAgent Pro (Betsy on the dealer site). The site is yours. Betsy on it is included. That feed is what OEMs buy as Brand Intelligence.",
} as const;

/** Three numbers — entity-kit table, verbatim. */
export const THREE_NUMBERS = [
  {
    number: "NICS",
    is: "Public FBI background-check counts",
    isNot: "Sales",
  },
  {
    number: "RetailBI Index",
    is: "Same-store new firearm units at the register",
    isNot: "Search intent",
  },
  {
    number: "Betsy ask",
    is: "What shoppers tried to find, including zeros",
    isNot: "A sales index",
  },
] as const;

/**
 * Cited public Index prints. Use only when date and source are on the page.
 * Do not invent additional figures.
 */
export const CITED_INDEX = {
  march2026: {
    label: "March 2026 Index",
    print: "−11.9% YoY; −8.2% YTD",
    source: "Outdoor Wire, 13 Apr 2026",
    sentence:
      "March 2026 Index: −11.9% YoY; −8.2% YTD — Outdoor Wire, 13 Apr 2026",
  },
  y2025: {
    label: "2025 same-store new firearms",
    print: "~−13% vs 2024",
    source: "NSSF / Gearfire 2025 Annual Report, 23 Feb 2026",
    sentence:
      "2025 same-store new firearms ~−13% vs 2024 — NSSF / Gearfire 2025 Annual Report, 23 Feb 2026",
  },
  outlook2026: {
    label: "Gearfire 2026 outlook (theirs)",
    print: "−7% to −12%",
    source: "NSSF / Gearfire 2025 Annual Report, 23 Feb 2026",
    sentence:
      "Gearfire 2026 outlook (theirs): −7% to −12% — same NSSF note",
  },
} as const;
