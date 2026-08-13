export type Brief = {
  slug: string;
  path: string;
  title: string;
  kicker: string;
  dek: string;
  date: string;
  dateLabel: string;
  read: string;
  image: string;
  imageAlt: string;
};

export const BRIEFS: Brief[] = [
  {
    slug: "three-numbers",
    path: "/brief/three-numbers",
    title: "March on the wire: same-store down, and the ask still isn’t in the print",
    kicker: "The Brief",
    dek: "Outdoor Wire moved Gearfire’s March Index on April 13: new-gun units −11.9% year-over-year, −8.2% on the year. A register series. Not NICS. Not what they typed after hours.",
    date: "2026-08-13",
    dateLabel: "August 13, 2026",
    read: "8 min",
    image: "betsy/images/betsy-desk-hero.jpg",
    imageAlt: "Betsy at the desk, reading a market brief under a steel lamp",
  },
];

export const FEATURED = BRIEFS[0]!;

export const ESSAYS = [
  {
    href: "/nics-is-not-sales",
    kicker: "Checks",
    title: "They already admitted NICS is a bad sales proxy. Then what?",
    dek: "Gearfire made the case on the wire: permits, used guns, transfers, denials, multi-gun checks. A POS panel is cleaner. It is still not the ask.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/betsy-at-the-range-work.jpg",
    imageAlt: "Betsy at the range",
  },
  {
    href: "/retailbi-firearm-sales-index",
    kicker: "The Index",
    title: "How the Index is built — in their words, then mine",
    dek: "Same stores. New firearms. A percent versus last year. Subject to revision. That is a file. It is not the whole market.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/betsy-tzu-art-of-war.jpg",
    imageAlt: "Betsy Tzu — Art of Demand",
  },
  {
    href: "/sell-through-vs-search-intent",
    kicker: "The ask",
    title: "I already have the third sensor. That is the disclosure.",
    dek: "By day I run Live, the dealer sites, the brand desk. By night I read Outdoor Wire. The ask is my beat because I built the microphone.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/betsy-desk-hero.jpg",
    imageAlt: "Betsy at the desk",
  },
] as const;
