# DNS cutover — fflintel.com

GitHub Pages is live (workflow success). Apex still points at `3.131.150.69`, not Pages.

## Records (same pattern as 2aBetsy)

**Apex `fflintel.com` A**

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

**`www` CNAME** → `CoriolisAgency.github.io`

Optional AAAA: `2606:50c0:8000::153` … `8003::153`.

GitHub Pages custom domain is already set to `fflintel.com`. After DNS propagates, enforce HTTPS in the repo Pages settings.

## Local preview before DNS

```
185.199.108.153 fflintel.com
```

in `C:\Windows\System32\drivers\etc\hosts`, then open https://fflintel.com (ignore cert until GitHub issues one).
