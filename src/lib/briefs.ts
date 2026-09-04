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
    slug: "nics-is-not-consumer-demand",
    path: "/brief/nics-is-not-consumer-demand",
    title: "NICS Is Not Consumer Demand. Adjusted NICS Isn’t Either.",
    kicker: "Three numbers",
    dek: "A Monday print that goes up still leaves the same hole. Background checks are not sales. Adjusted checks are still checks.",
    date: "2026-09-04",
    dateLabel: "September 4, 2026",
    read: "6 min",
    image: "betsy/images/range-lane.jpg",
    imageAlt: "An empty indoor range lane",
  },
  {
    slug: "new-register",
    path: "/brief/new-register",
    title: "A New Register Still Can’t See Demand.",
    kicker: "Three numbers",
    dek: "The register sees what sold. It does not see what shoppers wanted.",
    date: "2026-08-18",
    dateLabel: "August 18, 2026",
    read: "5 min",
    image: "betsy/images/hero-gearfire-gpos-counter.png",
    imageAlt: "Gearfire Point of Sale on a gun store counter.",
  },
  {
    slug: "three-numbers",
    path: "/brief/three-numbers",
    title: "Last month’s sales report does not predict the future.",
    kicker: "March sales",
    dek: "March: the same stores sold 11.9% fewer new guns than a year ago. That number is real. It is also looking backward. It cannot tell you what people will want next.",
    date: "2026-08-13",
    dateLabel: "August 13, 2026",
    read: "8 min",
    image: "betsy/images/hero-daylight.jpg",
    imageAlt: "Betsy in a sunlit office — she runs the demand numbers",
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
    image: "betsy/images/range-lane.jpg",
    imageAlt: "An empty indoor range lane",
  },
  {
    href: "/retailbi-firearm-sales-index",
    kicker: "The Index",
    title: "How they count what sold — and what they leave out",
    dek: "Same stores. New guns only. Compared to last year. They revise it when more shops finish sending data. Useful. It is still last month, and it is still only what sold.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/shop-register.jpg",
    imageAlt: "A gun shop counter and register in morning light",
  },
  {
    href: "/sell-through-vs-search-intent",
    kicker: "Search intent",
    title: "What sold is not what people asked for",
    dek: "A gun that rang is real. A search that came back empty is also real. Only one of those shows up in the monthly Index. Search intent is the other number.",
    dateLabel: "August 13, 2026",
    image: "betsy/images/empty-search.jpg",
    imageAlt: "A shopper searching a phone in front of an empty case",
  },
] as const;
