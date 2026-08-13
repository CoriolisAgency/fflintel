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
    title: "Last month’s sales report does not predict the future.",
    kicker: "March sales",
    dek: "March: the same stores sold 11.9% fewer new guns than a year ago (Outdoor Wire, April 13). That number is real. It is also looking backward. It cannot tell you what people will want next.",
    date: "2026-08-13",
    dateLabel: "August 13, 2026",
    read: "8 min",
    image: "betsy/images/betsy-ai-brand-intelligence-enterprise-co-pilot.jpg",
    imageAlt: "Betsy in the background — she runs the demand numbers",
  },
];

export const FEATURED = BRIEFS[0]!;

export const ESSAYS = [
  {
    href: "/nics-is-not-sales",
    kicker: "Checks",
    title: "A background check is not a gun sale.",
    dek: "Gearfire already said this. Counting what rang is better than counting FBI checks. It still will not tell you what people wanted and could not find.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/betsy-at-the-range-work.jpg",
    imageAlt: "Betsy at the range",
  },
  {
    href: "/retailbi-firearm-sales-index",
    kicker: "The Index",
    title: "How they count what sold — and what they leave out",
    dek: "Same stores. New guns only. Compared to last year. They revise it when more shops finish sending data. Useful. It is still last month, and it is still only what sold.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/betsy-ai-brand-intelligence-enterprise-co-pilot.jpg",
    imageAlt: "Betsy — demand research",
  },
  {
    href: "/sell-through-vs-search-intent",
    kicker: "The ask",
    title: "What sold is not what people asked for",
    dek: "A gun that rang is real. A search that came back empty is also real. Only one of those shows up in the monthly Index. Betsy BI is the other number.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/betsy-ai-brand-intelligence-enterprise-co-pilot.jpg",
    imageAlt: "Betsy — demand research",
  },
] as const;
