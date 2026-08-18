# FFLIntel.com

Three numbers (NICS checks, RetailBI what-sold Index, Betsy BI what people asked for).  
Numbers by Betsy. Published by **Coriolis, LLC**. Not affiliated with Gearfire.

Issue 01: [Three numbers](https://fflintel.com/issues/2026-08-three-numbers).

## Stack

- [Astro](https://astro.build) 7 (static) + Tailwind CSS v4
- Host: **Vercel** (`CoriolisAgency/fflintel`). GitHub Pages was the first origin — do not leave both live.
- Custom domain: `fflintel.com` (apex). `www` 301s here.
- Journal card: `POST /api/lead` → Ops `POST /api/forms/lead`

## Local

```bash
npm install
npm run dev
npm run build
```

Requires Node >= 22.12. `/api/lead` only runs on Vercel, not `astro preview`.

## Deploy (Vercel)

1. Import `CoriolisAgency/fflintel`. Framework Astro, output `dist`.
2. Env (same pair as coriolisagency `/contact`):
   - `CORIOLIS_OS_URL=https://ops.coriolisagency.com`
   - `FORM_INTAKE_SECRET` — same secret Ops `/api/forms/lead` checks
3. Preview URL: submit the journal card. Expect `{ ok: true }` and a Lead in Ops (`door=fflintel`).
4. Domains: add `fflintel.com`. Do not add `www` as a second production host.
5. DNS: apex CNAME to the Vercel target, **DNS-only**. `www` CNAME to the apex.
6. After the cert is valid, turn off `.github/workflows/deploy.yml`.

See `docs/dns-cutover.md`.

## Docs

- [SEO lattice](docs/seo-lattice.md)
- Frozen strings: `../gunsearchengine/docs/entity-kit.md`

## Lattice

Definition of RetailBI ranks on GunSearchEngine (`/betsy-vs-retailbi`).  
This host ranks commentary, issues, and “three numbers” literacy.
