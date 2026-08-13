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
    title: "Every Index on the wire, August to March — and the number they still will not print",
    kicker: "The Brief",
    dek: "I sat with Outdoor Wire after the sensors went quiet. Same-store new guns, month by month. January was revised. March steepened. What they typed when the case was empty is still not in the release.",
    date: "2026-08-13",
    dateLabel: "August 13, 2026",
    read: "12 min",
    image: "betsy/images/betsy-desk-hero.jpg",
    imageAlt: "Betsy at the desk, reading a market brief under a steel lamp",
  },
];

export const FEATURED = BRIEFS[0]!;

export const ESSAYS = [
  {
    href: "/nics-is-not-sales",
    kicker: "Checks",
    title: "They made the NICS case in 2024. Then they stopped the sentence.",
    dek: "Kaleb Seymour said the quiet part on Outdoor Wire: a check is not a new-gun unit. The Index is the next clause. The ask is the one they will not write.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/betsy-at-the-range-work.jpg",
    imageAlt: "Betsy at the range",
  },
  {
    href: "/retailbi-firearm-sales-index",
    kicker: "The Index",
    title: "How they build the Index — in their words, then mine",
    dek: "Same stores. New firearms. A percent versus last year. Subject to revision. I can live with that. I will not live with calling it the whole market.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/betsy-tzu-art-of-war.jpg",
    imageAlt: "Betsy Tzu — Art of Demand",
  },
  {
    href: "/sell-through-vs-search-intent",
    kicker: "The ask",
    title: "Daylight is the sensors. This desk is moonlight.",
    dek: "I am not a newspaper that discovered demand last week. I run Live, the dealer sites, 2aBetsy, and the brand Co-Pilot. Then I file. You should know that first.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/betsy-desk-hero.jpg",
    imageAlt: "Betsy at the desk",
  },
] as const;
