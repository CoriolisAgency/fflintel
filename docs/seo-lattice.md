# SEO content lattice (FFLIntel)

> Governed by `CoriolisAgency/coriolis` `docs/seo/` (ARCHITECTURE.md, PAGE-MAP.md, LINK-PLAN.md). When this file and `docs/seo/` disagree, `docs/seo/` wins. Rewritten for FFLI-OVERHAUL-P1 (Paul, 2026-11-10 8:13 AM ET; link rules from Chief, 8:09 AM ET).

## Role and audience
FFLIntel is the industry data desk: FFL news, data and intel that people read and cite. Readers: FFL owners and managers, brand and OEM staff, trade press, analysts, and AI answer engines. It stands on its own. It is not a product home, not a sales page and not a character site. The "three numbers" thesis (checks are not sales; sales are not searches) stays the lens.

## Intent → primary URL (this site)
| Intent | Primary URL | Notes |
|---|---|---|
| Desk front page | `/` | Latest notes and trackers. Own H1; never copies a note's H1 |
| About and publisher | `/about/` | Publisher: Coriolis, LLC. The footer brand link to `https://www.coriolisagency.com/` stays on every page (D-N3) |
| How we cite | `/methodology/` | Date and source on every number; revisions stay on the page |
| Notes archive | `/brief/` | `/issues/` 301s here |
| NICS explained (evergreen) | `/nics-is-not-sales/` | Hub for the monthly NICS tracker |
| NICS and NSSF-adjusted NICS, monthly | `/brief/nics-{month}-{year}/` | One URL per month |
| NICS by state | `/brief/nics-by-state/` | Refreshed monthly |
| RetailBI print log | `/retailbi-firearm-sales-index/` | Every public print with date and source. `/what-is-retailbi/` 301s here |
| FFL licensee counts | `/brief/how-many-ffls/` | From ATF's published licensee files |
| Excise collections | `/brief/firearm-ammo-excise-tax/` | From TTB quarterly collections |
| ATF manufacturing report | `/brief/atf-manufacturing-report/` | Annual |
| Sell-through vs search intent | `/sell-through-vs-search-intent/` | Doctrine |
| Email confirmation | `/confirmed/` | `noindex`, not in sitemap |

## Shared topics with GSE
| Topic | FFLIntel | GSE |
|---|---|---|
| NICS | Owns the dated industry numbers and the evergreen explainer | `/blog/fbi-background-check-numbers-explained` keeps the shopper explainer; `/nics-vs-firearm-sales` stays until Paul rules on a merge (**open**) |
| RetailBI Firearm Sales Index | Owns the dated print log | `/retailbi-firearm-sales-index` keeps the "how it is counted" explainer; titles must not collide |
| What is RetailBI | 301 to the print log | `/betsy-vs-retailbi` is `noindex`; FFLIntel does not canonical or link to it |

## Link rules
1. The footer brand link to `https://www.coriolisagency.com/` and the footer Demand Intelligence link stay (D-N3, Paul 2026-11-10 8:36 AM ET (via Chief)). Every other agency link is in note bodies; none in header, rails or other sitewide components.
2. At most one coriolisagency.com link per note, as one soft line at the end of the note (Paul 2026-11-10 10:02 AM ET; never in the body), to a page that answers the reader's next question: `/ecommerce`, `/firearms-dropshipping`, `/demand-intelligence`. Never `/gun-store-pos` (Chief 2026-11-10 10:07 AM ET: that link is GSE dealer post D2 only). Descriptive anchors; never the agency's head term. UTM `utm_source=fflintel&utm_medium=referral&utm_campaign=fflintel-{note-slug}`.
3. GSE links: indexable data pages and dealer pages (`/nics-vs-firearm-sales`, `/retailbi-firearm-sales-index`, `/oem-firearms-demand-analytics`, `/for-dealers/feed`) and money hubs in `sitemap-hubs.xml`. Never to `noindex` pages (`/betsy-vs-retailbi`, `/betsy-live`, `/betsy/*`). At most 2 links per note to the same GSE page.
4. Never: fflaccelerator.com, the retired sister domain, client gun sites, `/ffl-messenger-enterprise`, `/betsy-ai`. No agency `sameAs` to FFLIntel.
5. Outside links matter most; earned citations from press and analysts are the goal.

## Content rules
1. Never invent a number. Date and source on the page, or omit the print. "We will not invent one" when a series does not exist.
2. Never claim 4473, ATF, POS or NICS-system capability. Never hint at a Coriolis POS.
3. No transfer, transfer-ticket or remote-identity topics, and none of the embargoed names in the Coriolis baseline (check before every note; a hit means stop and flag Chief).
4. RetailBI and Gearfire may be named (Paul 2026-11-10 8:36 AM ET (via Chief)); factual and sourced, no sales framing. Never H1 "RetailBI alternative".
5. No em dashes.
