# SEO content lattice (FFLIntel)

> **Governed by `CoriolisAgency/coriolis` `docs/seo/`** (ARCHITECTURE.md, PAGE-MAP.md, LINK-PLAN.md). This file is FFLIntel's own page table. When this file and `docs/seo/` disagree, `docs/seo/` wins. Pointer header added Wed Oct 21, 2026 (Sprint 0, DC-5). Doc only. Three rows corrected to match LINK-PLAN §3 and D-N16 (FFL Accelerator and GSA: no link; Demand Intelligence moved to the agency). The link rules below are quoted from LINK-PLAN §3 on coriolis `main` at `e101d52` (D-N3, Paul 4:47 PM ET; locked by Karp in `docs/decisions/2026-10-21-ffl-intel-content-links.md`).
>
> **Link rules (D-N3), quoted from `docs/seo/LINK-PLAN.md`:**
> - Locked rule 2: "FFLIntel is now an exception (D-N3, Paul 4:47 PM ET; locked by Karp in `2026-10-21-ffl-intel-content-links`): its content may link to CoriolisAgency.com and GSE, under the rules in §3. It still never links to FFLAccelerator.com, to the retired sister domain (gunsearchagent.com), or to client sites that sell guns."
> - FFLIntel data notes → GSE data pages (`/nics-vs-firearm-sales`, `/retailbi-firearm-sales-index`, `/betsy-live`, `/oem-firearms-demand-analytics`, `/betsy-vs-retailbi`). "**`/demand-intelligence` moves to the agency (D-N16),** so FFLIntel's 3 links to it point at `https://www.coriolisagency.com/demand-intelligence` with `utm_source=fflintel`." Rule: "Keep the links that are live today. Use descriptive anchors that name the topic, such as "NICS checks vs firearm sales" or "the live demand map". At most 2 links per note to the same GSE page."
> - FFLIntel notes that mention a caliber or product type → the matching GSE money hub (`/ammo/{cal}`, `/guns/{type}/{cal}`): "Plain anchor naming the hub, such as "9mm ammo in stock". Only to URLs that return 200 and are listed in GSE `sitemap-hubs.xml` (blog guardrail G6)."
> - FFLIntel notes about how dealers sell or get found → CoriolisAgency.com owner pages (`/ffl-analytics` for site-search and demand, `/ffl-seo` once it ships in SEO-U32, `/ecommerce` for selling online): "Descriptive anchors, one agency link per note, using the PAGE-MAP owner term (for example "FFL SEO", "FFL website")." UTM `utm_source=fflintel&utm_medium=referral&utm_campaign=fflintel-{note-slug}`.
> - FFLIntel footer (sitewide) → agency `/`: "Brand anchor "A Coriolis publication" (or "Coriolis"), **one** sitewide link, to `https://www.coriolisagency.com/`, not the bare domain, which 308s."
> - FFLIntel → the retired sister domain: "**Remove them**, or point them straight at GSE `/for-dealers/feed`, where that domain already 301s" (fix in SEO-U15).
> - FFLIntel → FFLAccelerator.com: "**None**". Not allowed.
> - Satellite guardrails (D-N3 and D-N3b): plain links, no nofollow; never link from FFLIntel to `/ecommerce` pricing with a sales anchor; never link to noindex, 404 or redirected URLs; no sameAs from the agency to FFLIntel.

Source of truth for internal linking and cannibalization rules.

**This site owns commentary.** FFLIntel keeps three numbers from becoming one: NICS (background checks), RetailBI Index (what sold), Betsy BI (what people asked for). Numbers by Betsy. Not a product home. Not a character site.

Frozen strings: [GunSearchEngine entity kit](../../gunsearchengine/docs/entity-kit.md).

## Dual-site ownership (anti-cannibalization)

| Intent class | Ranking owner | FFLIntel role |
|--------------|---------------|---------------|
| What is RetailBI (definition) | **GSE** `https://www.gunsearchengine.com/betsy-vs-retailbi` | Short summary; **canonical → GSE fortress** |
| Firearm Sales Index (product literacy) | **GSE** `https://www.gunsearchengine.com/retailbi-firearm-sales-index` | Commentary how-to-read; self canonical; link GSE + fortress |
| NICS vs firearm sales (platform) | **GSE** `https://www.gunsearchengine.com/nics-vs-firearm-sales` | Desk essay `/nics-is-not-sales`; self canonical; link GSE |
| Sell-through vs search intent (doctrine) | Shared literacy | Desk essay; link fortress + Demand Intelligence |
| OEM Demand Intelligence | **CoriolisAgency.com** `https://www.coriolisagency.com/demand-intelligence` (moved to the agency, D-N16) | Soft CTA only |
| Betsy Live | **GSE** `/betsy-live` | Link (labeled sample) |
| Dealer product / GA for FFLs | **None** (GunSearchAgent is retired) | **No link.** Never link to the retired sister domain (gunsearchagent.com); remove the 3 home-page links to it, or point them straight at GSE `/for-dealers/feed`, where that domain already 301s (LINK-PLAN §3; fix in SEO-U15) |
| FFL Accelerator | **fflaccelerator.com** | **No link** (LINK-PLAN §3: FFLIntel → FFLAccelerator.com is not allowed; keeps FFLA's link profile ad-safe) |
| Betsy character / media | **2aBetsy** | Header headshot only |
| Desk issues / three-numbers commentary | **FFLIntel** | Primary |

## Intent → primary URL (this site)

| Intent class | Primary URL | Notes |
|--------------|-------------|-------|
| Signal home / three numbers | `/` | Thesis + two doors |
| About the desk | `/about` | Research by Betsy. Publisher: Coriolis, LLC |
| How we treat the numbers | `/methodology` | Cited public Index only |
| What is RetailBI (spoke) | `/what-is-retailbi` | **canonicalUrl** → GSE fortress |
| How to read the Index | `/retailbi-firearm-sales-index` | Self canonical |
| NICS is not sales | `/nics-is-not-sales` | Self canonical |
| Sell-through vs search intent | `/sell-through-vs-search-intent` | Frozen doctrine |
| Issue archive | `/issues` | Lists issue 01 |
| Launch brief | `/issues/2026-08-three-numbers` | NewsArticle |

## Rules

1. Definition of RetailBI canonicals to the **GSE fortress** (`/betsy-vs-retailbi`). Do not try to rank this host for “what is RetailBI.”
2. This host ranks commentary, issues, and “three numbers” literacy — not OEM product SERPs.
3. Never invent Index numbers. Cite date + source on the page, or omit the print.
4. Never claim 4473 / ATF / POS / NICS-system capability.
5. Never H1 “RetailBI alternative.”
6. Soft CTAs only, as **two doors**: if you make the guns → fortress / Demand Intelligence / Co-Pilot; if you sell them → GSA. No hard sell. No headshot chip.
7. `sameAs` mesh from the entity kit (Coriolis, LLC).
