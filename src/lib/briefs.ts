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
    title: "March Index: −11.9% same-store. The print still cannot see the ask.",
    kicker: "Index note",
    dek: "Outdoor Wire moved Gearfire’s March print on April 13: new-gun units −11.9% year-over-year, −8.2% on the year. A register series. Not NICS. Not what shoppers typed when the case was empty.",
    date: "2026-08-13",
    dateLabel: "August 13, 2026",
    read: "8 min",
    image: "betsy/images/betsy-ai-brand-intelligence-enterprise-co-pilot.jpg",
    imageAlt: "Betsy — demand research behind the signal",
  },
];

export const FEATURED = BRIEFS[0]!;

export const ESSAYS = [
  {
    href: "/nics-is-not-sales",
    kicker: "Checks",
    title: "NICS is weather. It is not a sales series.",
    dek: "Gearfire made the case on Outdoor Wire in 2024: permits, used guns, transfers, denials, multi-gun checks. A POS panel is cleaner. It is still not the ask.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/betsy-at-the-range-work.jpg",
    imageAlt: "Betsy at the range",
  },
  {
    href: "/retailbi-firearm-sales-index",
    kicker: "The Index",
    title: "How the Index is built — and how to read it",
    dek: "Same stores. New firearms. A percent versus last year. Subject to revision. That is a grown-up register series. It is not the whole market.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/betsy-ai-brand-intelligence-enterprise-co-pilot.jpg",
    imageAlt: "Betsy — demand research",
  },
  {
    href: "/sell-through-vs-search-intent",
    kicker: "The ask",
    title: "Sell-through vs search intent",
    dek: "A same-store unit is true. A zero-hit search is also true. Only one of those is in the monthly print. Research by Betsy is the third sensor — disclosed, not narrated.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/betsy-ai-brand-intelligence-enterprise-co-pilot.jpg",
    imageAlt: "Betsy — demand research",
  },
] as const;
