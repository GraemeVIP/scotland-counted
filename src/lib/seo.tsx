import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Builds page metadata consistently: canonical URL, Open Graph,
 * Twitter card and title template all derive from one call.
 */
export function meta({
  title,
  description,
  path = "/",
  type = "article",
  published,
  modified,
  image,
  ownImage = false,
  keywords,
}: {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  published?: string;
  modified?: string;
  image?: string;
  /**
   * Set by routes that generate their own card through an adjacent
   * opengraph-image file (areas, constituencies). Those cards are served from a
   * hashed URL we cannot name here, so the only safe thing is to stay out of the
   * way and let the file convention fill the field.
   */
  ownImage?: boolean;
  keywords?: string[];
}): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  /**
   * Every page gets a share card. The opengraph-image file convention only
   * covers the segment it sits in — it does not reach nested routes whose own
   * metadata defines openGraph — which left most of the site sharing as a bare
   * link. Defaulting here covers every page from one place.
   */
  const resolved = image ?? (ownImage ? undefined : "/opengraph-image");
  const imageUrl = resolved
    ? resolved.startsWith("http")
      ? resolved
      : `${site.url}${resolved}`
    : undefined;
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      ...(imageUrl ? { images: [{ url: imageUrl, alt: title }] } : {}),
      ...(published ? { publishedTime: published } : {}),
      ...(modified ? { modifiedTime: modified } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

/** JSON-LD for the organisation and site, emitted once in the root layout. */
export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "en-GB",
        publisher: { "@id": `${site.url}/#org` },
      },
      {
        "@type": "Organization",
        "@id": `${site.url}/#org`,
        name: site.organisation.name,
        url: site.organisation.url,
        description:
          "Independent research and analysis. Scotland Counted is a personal public-interest project.",
      },
      {
        "@type": "Person",
        "@id": `${site.url}/#author`,
        name: site.author.name,
        affiliation: { "@id": `${site.url}/#org` },
        url: site.author.url,
      },
    ],
  };
}

/** JSON-LD for an analytical article page. */
export function articleJsonLd({
  headline,
  description,
  path,
  published = site.dataCheckedISO,
  modified = site.dataCheckedISO,
  image,
  section,
  keywords,
}: {
  headline: string;
  description: string;
  path: string;
  published?: string;
  modified?: string;
  image?: string;
  section?: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AnalysisNewsArticle",
    headline,
    description,
    datePublished: published,
    dateModified: modified,
    inLanguage: "en-GB",
    isAccessibleForFree: true,
    mainEntityOfPage: `${site.url}${path}`,
    ...(image ? { image: image.startsWith("http") ? image : `${site.url}${image}` } : {}),
    ...(section ? { articleSection: section } : {}),
    ...(keywords ? { keywords: keywords.join(", ") } : {}),
    author: { "@id": `${site.url}/#author`, "@type": "Person", name: site.author.name, url: site.author.url },
    publisher: {
      "@type": "Organization",
      name: site.organisation.name,
      url: site.organisation.url,
    },
  };
}

/** JSON-LD describing a dataset, so the figures are machine-discoverable. */
export function datasetJsonLd({
  name,
  description,
  path,
  keywords,
  temporalCoverage,
  spatialCoverage = "Scotland",
}: {
  name: string;
  description: string;
  path: string;
  keywords: string[];
  temporalCoverage: string;
  spatialCoverage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name,
    description,
    url: `${site.url}${path}`,
    keywords,
    temporalCoverage,
    spatialCoverage: { "@type": "Place", name: spatialCoverage },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: site.organisation.name,
      url: site.organisation.url,
    },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${site.url}${c.path}`,
    })),
  };
}

/** Renders a JSON-LD block. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
