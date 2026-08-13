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
    title: "The print said minus twelve. Tuesday night said something else.",
    kicker: "The Brief",
    dek: "Outdoor Wire put a same-store drop on the wire in April. Useful. Incomplete. Here is how three different numbers keep getting folded into one headline.",
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
    title: "NICS is weather. It is not the register.",
    dek: "Background-check counts mix permits, used guns, and denials. Treating that volume like unit sales is how a forecast goes sideways.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/betsy-at-the-range-work.jpg",
    imageAlt: "Betsy at the range",
  },
  {
    href: "/retailbi-firearm-sales-index",
    kicker: "The Index",
    title: "How to read a same-store print without getting hypnotized",
    dek: "Gearfire’s monthly Index is a register series. That is a real thing. It is still last month.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/betsy-tzu-art-of-war.jpg",
    imageAlt: "Betsy Tzu — Art of Demand",
  },
  {
    href: "/sell-through-vs-search-intent",
    kicker: "The ask",
    title: "What sold is not what they asked for",
    dek: "A zero-hit search never becomes a unit. It still happened. That is the number a closed period cannot see.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/betsy-desk-hero.jpg",
    imageAlt: "Betsy at the desk",
  },
] as const;
