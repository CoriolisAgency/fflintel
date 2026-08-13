# SEO content lattice (FFLIntel)

Source of truth for internal linking and cannibalization rules.

**This site owns commentary.** FFLIntel is the trade signal: notes and literacy that keep three numbers from becoming one (NICS / register sell-through / Betsy ask). Research by Betsy. It is not the product home for Brand Intelligence, GunSearchAgent, or the Betsy character. Not a newsroom.

Frozen strings: [GunSearchEngine entity kit](../../gunsearchengine/docs/entity-kit.md).

## Dual-site ownership (anti-cannibalization)

| Intent class | Ranking owner | FFLIntel role |
|--------------|---------------|---------------|
| What is RetailBI (definition) | **GSE** `https://www.gunsearchengine.com/betsy-vs-retailbi` | Short summary; **canonical → GSE fortress** |
| Firearm Sales Index (product literacy) | **GSE** `https://www.gunsearchengine.com/retailbi-firearm-sales-index` | Commentary how-to-read; self canonical; link GSE + fortress |
| NICS vs firearm sales (platform) | **GSE** `https://www.gunsearchengine.com/nics-vs-firearm-sales` | Desk essay `/nics-is-not-sales`; self canonical; link GSE |
| Sell-through vs search intent (doctrine) | Shared literacy | Desk essay; link fortress + Brand Intelligence |
| OEM Brand Intelligence | **GSE** `/betsy/enterprise` | Soft CTA only |
| Betsy Live | **GSE** `/betsy-live` | Link (labeled sample) |
| Dealer product / GA for FFLs | **GSA** | Footer family nav only |
| FFL Accelerator | **fflaccelerator.com** | Footer family nav only |
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
6. Soft CTAs only, as **two doors**: brand teams → fortress / Brand Intelligence / Co-Pilot; retailers → GSA. No hard sell. No character door.
7. `sameAs` mesh from the entity kit (Coriolis, LLC).
