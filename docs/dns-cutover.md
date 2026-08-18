# DNS cutover — fflintel.com

Origin is **Vercel**. GitHub Pages was the first host. Do not leave two production origins.

Cloudflare (if this zone is there) is **DNS-only** (grey cloud). Vercel security stays in front. Do **not** orange-cloud the apex.

## Path 301s (Vercel)

Old desk paths live in **`vercel.json`** (`permanent: true`):

| Hit | Land |
|-----|------|
| `/issues` | `/brief` |
| `/issues/2026-08-three-numbers` | `/brief/three-numbers` |

Astro `redirects` in `astro.config.mjs` stay as a second copy for local preview.

## Before DNS

1. Import `CoriolisAgency/fflintel` as a Vercel project. Framework: Astro. Build: `npm run build`. Output: `dist`.
2. Env (same pair as coriolisagency `/contact`):
   - `CORIOLIS_OS_URL` — Coriolis OS origin, no trailing slash
   - `FORM_INTAKE_SECRET` — same secret the OS `/api/forms/lead` already checks
3. Preview URL: submit the journal card. Expect `{ ok: true }` and a Lead + Company on the spine (`door=fflintel`).
4. Vercel → Settings → Domains: add `fflintel.com`. Do **not** add `www` as a second production host. Copy the CNAME Vercel shows (often `cname.vercel-dns.com`).

## Flip

Today (Pages, until this flip):

- Apex A: `185.199.108.153` … `185.199.111.153`
- `www` CNAME → `CoriolisAgency.github.io`

Flip:

1. Apex `fflintel.com`: CNAME to the Vercel target, **DNS-only** (grey cloud).
2. `www`: CNAME to `fflintel.com` (or the same Vercel target). Apex is canonical.
3. Wait for Vercel → Domains to show the cert as valid.

## Immediately after

Incognito:

| Hit | Land |
|-----|------|
| `https://www.fflintel.com/` | `https://fflintel.com/` |
| `https://fflintel.com/brief/new-register` | 200, hed untouched |
| `https://fflintel.com/issues` | `/brief` |
| Journal card | JSON, not HTML. Company on the spine. |

Then turn off `.github/workflows/deploy.yml` (Pages). Two origins will drift.

## Do not

- Keep GitHub Pages deploying `main` after the flip.
- Proxy the apex through Cloudflare (orange cloud).
- Invent a newsletter list.
- Touch hed/dek of “A New Register Still Can’t See Demand.”

## Rollback

Point apex back at the Pages A records. Path 301s in `vercel.json` only apply while the site is on Vercel.
