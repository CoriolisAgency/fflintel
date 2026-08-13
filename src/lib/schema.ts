import { LINKS, SAME_AS } from "./links";
import { SITE } from "./site";

export type FaqItem = { q: string; a: string };
export type Crumb = { name: string; path: string };

export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": `${LINKS.home}/#organization`,
    name: SITE.legalName,
    legalName: SITE.legalName,
    alternateName: ["Coriolis Agency", "Coriolis"],
    url: LINKS.coriolis,
    sameAs: [...SAME_AS],
    description:
      "Coriolis, LLC publishes FFLIntel and builds Betsy AI — demand intelligence for lawful 2A commerce.",
  };
}

export function webSiteNode() {
  return {
    "@type": "WebSite",
    "@id": `${LINKS.home}/#website`,
    url: LINKS.home,
    name: SITE.name,
    alternateName: ["FFLIntel", "FFL Intel"],
    description: SITE.description,
    publisher: { "@id": `${LINKS.home}/#organization` },
  };
}

export function webPageNode(opts: {
  url: string;
  name: string;
  description: string;
}) {
  return {
    "@type": "WebPage",
    "@id": `${opts.url}#webpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": `${LINKS.home}/#website` },
    publisher: { "@id": `${LINKS.home}/#organization` },
  };
}

export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.path.startsWith("http")
        ? it.path
        : `${LINKS.home}${it.path === "/" ? "" : it.path}`,
    })),
  };
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export function newsArticleNode(opts: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    "@type": "NewsArticle",
    "@id": `${opts.url}#article`,
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    mainEntityOfPage: { "@id": `${opts.url}#webpage` },
    author: {
      "@type": "Organization",
      name: SITE.name,
      url: LINKS.home,
      parentOrganization: { "@id": `${LINKS.home}/#organization` },
    },
    contributor: {
      "@type": "Person",
      name: "Betsy",
      url: LINKS.betsy,
      sameAs: [LINKS.betsy, LINKS.x, LINKS.youtube],
      jobTitle: "Demand research",
      worksFor: { "@id": `${LINKS.home}/#organization` },
    },
    publisher: { "@id": `${LINKS.home}/#organization` },
    ...(opts.image ? { image: [opts.image] } : {}),
  };
}

export function pageGraph(extra: Record<string, unknown>[] = []) {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(), webSiteNode(), ...extra],
  };
}
