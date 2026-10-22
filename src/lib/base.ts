/**
 * Prefix site-relative paths for GitHub project Pages or custom domain.
 * Always join with a single slash (BASE_URL may or may not end with `/`).
 */
export function withBase(path = ""): string {
  let base = import.meta.env.BASE_URL || "/";
  if (!base.startsWith("/")) base = `/${base}`;
  if (!base.endsWith("/")) base = `${base}/`;

  if (!path || path === "/") {
    // Root href stays bare; canonical/sitemap add the slash elsewhere
    return base === "/" ? "/" : base.slice(0, -1);
  }

  const clean = path.replace(/^\/+/, "");
  return `${base}${clean}`;
}

/**
 * Internal page link in slash form, to match trailingSlash: "always".
 * Files (last segment has an extension), bare #anchors and ?queries keep their shape.
 */
export function pageHref(path = ""): string {
  const [, route = "", tail = ""] = path.match(/^([^?#]*)(.*)$/) ?? [];
  if (!route) return path;
  const href = withBase(route);
  const last = href.split("/").pop() ?? "";
  if (href.endsWith("/") || last.includes(".")) return `${href}${tail}`;
  return `${href}/${tail}`;
}
