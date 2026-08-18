# FFLIntel.com

Three numbers (NICS checks, RetailBI what-sold Index, Betsy BI what people searched for, including empty searches).  
Numbers by Betsy. Published by **Coriolis, LLC**. Not affiliated with Gearfire.

Issue 01: [Three numbers](https://fflintel.com/issues/2026-08-three-numbers).

## Stack

- [Astro](https://astro.build) 7 (static) + Tailwind CSS v4  
- Host: **GitHub Pages**  
- Custom domain: `public/CNAME` = `fflintel.com`

## Local

```bash
npm install
npm run dev
npm run build
```

Requires Node >= 22.12.

## Deploy (GitHub Pages)

1. Create GitHub repo (e.g. `CoriolisAgency/fflintel`), push `main`
2. Settings → Pages → Source: **GitHub Actions**
3. DNS for `fflintel.com`:
   - Apex: GitHub Pages A records (or Cloudflare)
   - `www` CNAME → `<org>.github.io`
4. Repo `public/CNAME` is already `fflintel.com`
5. Workflow sets `ASTRO_SITE=https://fflintel.com` and `ASTRO_BASE=/`

## Docs

- [SEO lattice](docs/seo-lattice.md)
- Frozen strings: `../gunsearchengine/docs/entity-kit.md`

## Lattice

Definition of RetailBI ranks on GunSearchEngine (`/betsy-vs-retailbi`).  
This host ranks commentary, issues, and “three numbers” literacy.
