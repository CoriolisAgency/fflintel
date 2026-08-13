export type DeskIssue = {
  slug: string;
  path: string;
  title: string;
  kicker: string;
  dek: string;
  date: string;
  dateLabel: string;
};

export const ISSUES: DeskIssue[] = [
  {
    slug: "2026-08-three-numbers",
    path: "/issues/2026-08-three-numbers",
    title: "Three numbers",
    kicker: "Launch brief · Issue 01",
    dek: "NICS, the RetailBI Firearm Sales Index, and the Betsy ask — kept on separate lines.",
    date: "2026-08-13",
    dateLabel: "13 Aug 2026",
  },
];

export const ISSUE_01: DeskIssue = ISSUES[0]!;
