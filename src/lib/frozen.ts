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
    "Betsy Demand Intelligence measures anonymized shopper search intent across GunSearchEngine, GunSearchAgent embeds, and floor sensors — including unmet (zero-hit) demand. It is not a POS system and not a same-store unit-sales index. (Formerly Brand Intelligence.)",
  fflintel:
    "FFLIntel is the industry desk that keeps three numbers from becoming one: background checks (NICS), register sell-through (including the RetailBI Firearm Sales Index), and search intent (Betsy). Research by Betsy. Published by Coriolis, LLC. Not a newsroom. Not a product home. Not affiliated with Gearfire.",
  doctrine:
    "RetailBI’s intelligence is a byproduct of retail operations software. Betsy’s intelligence is a byproduct of product discovery.",
  gsa: "GunSearchAgent is the Google Analytics replacement for FFL and 2A websites: on-site demand intelligence (what shoppers asked for) plus optional inventory sync. Core is free forever. GunSearchAgent Pro is included with the Coriolis FFL Accelerator plan.",
  accelerator:
    "FFL Accelerator is Coriolis’s managed WooCommerce program for FFLs ($569/mo). It includes GunSearchAgent Pro (Betsy on the dealer site). The site is yours. Betsy on it is included. That feed is what OEMs buy as Demand Intelligence.",
  demandStore:
    "The Betsy Demand Store is a public shelf ranked from prior-24h network demand on GunSearchEngine. Cards link out to participating licensed dealers. It is not an FFL, not a cart, and not a warehouse.",
  showroom:
    "Betsy Showroom is the in-store TV surface for GunSearchAgent Pro: live demand and featured stock on a store display. It is not POS, 4473, or NICS software.",
  copilot:
    "Betsy Enterprise Co-Pilot is the MCP face of Demand Intelligence — welcome cards, demand briefs, and (on Platform, with a warehouse feed) inventory Q&A inside hosted AI tools. It is not a shopper chatbot.",
  alerts:
    "Betsy Alerts are shopper restock and search watches on GunSearchEngine (`/mybetsy`). They are not My Betsy. My Betsy is in-store hardware only.",
} as const;

/** Three numbers — entity-kit table, verbatim. */
export const THREE_NUMBERS = [
  {
    number: "NICS",
    is: "FBI background-check counts",
    isNot: "Gun sales",
  },
  {
    number: "RetailBI Index",
    is: "New guns sold last month at the same stores as last year",
    isNot: "What people asked for",
  },
  {
    number: "Betsy BI",
    is: "What people asked for — including searches that came back empty",
    isNot: "A sales report",
  },
] as const;

/**
 * Cited public Index prints. Use only when date and source are on the page.
 * Do not invent additional figures. Source: docs/wire-file.md.
 */
export const CITED_INDEX = {
  march2026: {
    label: "March 2026 Index",
    print: "−11.9% YoY; −8.2% YTD",
    source: "Outdoor Wire, 13 Apr 2026",
    sentence:
      "March 2026 Index: −11.9% YoY; −8.2% YTD — Outdoor Wire, 13 Apr 2026",
  },
  jan2026revised: {
    label: "January 2026 (revised)",
    print: "−5.7% (was −6.2%)",
    source: "Outdoor Wire, 10 Mar 2026 footnote",
    sentence:
      "January 2026 revised from −6.2% to −5.7% — Outdoor Wire, 10 Mar 2026",
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

/** Monthly Index series for the desk table. Last public monthly: March 2026. */
export const INDEX_SERIES = [
  {
    period: "Aug 2025",
    print: "−17%",
    note: "First monthly",
    source: "Outdoor Wire, 4 Sep 2025",
  },
  {
    period: "Sep 2025",
    print: "−10.2%",
    note: "YTD −11.2%",
    source: "Outdoor Wire, 6 Oct 2025",
  },
  {
    period: "Oct 2025",
    print: "−11.6%",
    note: "YTD −10.8%",
    source: "Outdoor Wire, 5 Nov 2025",
  },
  {
    period: "Nov 2025",
    print: "−22.2%",
    note: "YTD −11.9%",
    source: "Outdoor Wire, 4 Dec 2025",
  },
  {
    period: "Dec 2025",
    print: "−16.4%",
    note: "Full year −12.1% on this file",
    source: "Dealer Wire, 9 Jan 2026",
  },
  {
    period: "Jan 2026",
    print: "−5.7%",
    note: "Revised from −6.2%",
    source: "Outdoor Wire, 10 Mar 2026 footnote",
  },
  {
    period: "Feb 2026",
    print: "−6.5%",
    note: "YTD −6.1%",
    source: "Outdoor Wire, 10 Mar 2026",
  },
  {
    period: "Mar 2026",
    print: "−11.9%",
    note: "YTD −8.2%",
    source: "Outdoor Wire, 13 Apr 2026",
  },
] as const;
