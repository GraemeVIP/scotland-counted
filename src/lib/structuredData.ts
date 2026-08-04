/*
 * Relative, with the extension spelled out. The @/ alias and extensionless
 * relative imports both resolve under Turbopack and neither resolves under
 * `node --test`, and this module only earns its keep if a test can load it.
 */
import { site } from "../../site.config.ts";

/*
 * Every JSON-LD builder on the site.
 *
 * Split out of seo.tsx for one blunt reason: seo.tsx exports a React
 * component, so it has to be .tsx, and Node's test runner strips types from
 * .ts but cannot transform JSX. None of this was reachable from a test while
 * it shared that file, which is how the publisher identity was wrong on every
 * page for as long as it was. seo.tsx re-exports all of it, so nothing that
 * imports from "@/lib/seo" needs to change.
 */

/** The three identities the site publishes under, as stable node ids. */
export const ENTITY = {
  website: `${site.url}/#website`,
  /** Scotland Counted, the publisher. */
  org: `${site.url}/#org`,
  /** The person who writes it. */
  author: `${site.url}/#author`,
  /** That person's consultancy. Linked from the person, never from content. */
  consultancy: `${site.url}/#consultancy`,
} as const;

/**
 * The publisher, by reference.
 *
 * Everything the site publishes points here instead of carrying its own copy
 * of the organisation. One @id across several hundred pages reads as one
 * publisher with a body of work behind it; several hundred inline copies read
 * as several hundred unrelated publishers that happen to share a name.
 *
 * The type and name ride along so the block still says something on its own
 * to a parser that does not merge nodes across script tags.
 */
function publisherRef() {
  return {
    "@id": ENTITY.org,
    "@type": "Organization" as const,
    name: site.name,
    url: site.url,
  };
}

/**
 * JSON-LD for the site, its publisher and its author. Emitted once in the root
 * layout, so it is on every page and every @id below resolves everywhere.
 *
 * Three entities, kept apart on purpose:
 *
 *   #org          Scotland Counted. Publishes the site.
 *   #author       the person who writes it, named so the work is accountable.
 *   #consultancy  that person's employer, which publishes none of this.
 *
 * The previous version collapsed the first and third into one node, which
 * told every search engine that a consultancy published the site's findings
 * about councils. Nothing here asserts a legal form, a qualification, an award
 * or a reviewer. It is a personal project and this says that and no more.
 */
export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": ENTITY.website,
        url: site.url,
        name: site.name,
        description: site.publisher.description,
        inLanguage: "en-GB",
        publisher: { "@id": ENTITY.org },
      },
      {
        "@type": "Organization",
        "@id": ENTITY.org,
        name: site.name,
        url: site.url,
        description: site.publisher.description,
        logo: {
          "@type": "ImageObject",
          url: `${site.url}${site.publisher.logo}`,
          width: site.publisher.logoWidth,
          height: site.publisher.logoHeight,
        },
        founder: { "@id": ENTITY.author },
        /* Both are real pages. A test fails if either stops being one. */
        publishingPrinciples: `${site.url}${site.publisher.publishingPrinciples}`,
        correctionsPolicy: `${site.url}${site.publisher.correctionsPolicy}`,
        ...(site.social.x ? { sameAs: [`https://x.com/${site.social.x}`] } : {}),
      },
      {
        "@type": "Person",
        "@id": ENTITY.author,
        name: site.author.name,
        url: site.author.url,
        jobTitle: site.author.role,
        worksFor: { "@id": ENTITY.consultancy },
      },
      {
        "@type": "Organization",
        "@id": ENTITY.consultancy,
        name: site.organisation.name,
        url: site.organisation.url,
      },
    ],
  };
}

/** JSON-LD for an editorial page, or a blog article when the path calls for it. */
export function articleJsonLd({
  headline,
  description,
  path,
  published,
  modified,
  image,
  section,
  keywords,
  schemaType,
}: {
  headline: string;
  description: string;
  path: string;
  published?: string;
  modified?: string;
  image?: string;
  section?: string;
  keywords?: string[];
  /** Blog posts are the only pages that should be article-like structured data. */
  schemaType?: "WebPage" | "Article" | "NewsArticle" | "BlogPosting";
}) {
  const type = schemaType ?? (path.startsWith("/blog/") ? "BlogPosting" : "WebPage");
  const isArticle = type === "Article" || type === "NewsArticle" || type === "BlogPosting";
  const url = `${site.url}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": type,
    ...(isArticle ? { headline } : { name: headline }),
    description,
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    inLanguage: "en-GB",
    isAccessibleForFree: true,
    url,
    mainEntityOfPage: url,
    ...(image ? { image: image.startsWith("http") ? image : `${site.url}${image}` } : {}),
    ...(isArticle && section ? { articleSection: section } : {}),
    ...(keywords ? { keywords: keywords.join(", ") } : {}),
    author: { "@id": ENTITY.author, "@type": "Person", name: site.author.name, url: site.author.url },
    publisher: publisherRef(),
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
  license,
  dateModified = site.dataCheckedISO,
}: {
  name: string;
  description: string;
  path: string;
  keywords: string[];
  temporalCoverage: string;
  spatialCoverage?: string;
  /** Only include this when every item in the dataset has that licence. */
  license?: string;
  dateModified?: string;
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
    ...(license ? { license } : {}),
    ...(dateModified ? { dateModified } : {}),
    isAccessibleForFree: true,
    /*
     * publisher, not creator. The site publishes these datasets; it did not
     * create the underlying data. ONS, DWP and the Scottish Government did,
     * and a site whose whole method is naming the original publisher of every
     * figure should not claim authorship of their numbers in the one place a
     * reader never looks.
     */
    publisher: publisherRef(),
  };
}

/**
 * JSON-LD for an embedded video.
 *
 * Google needs name, description, thumbnailUrl and uploadDate before a video
 * can show as a rich result, so all four are required here rather than
 * optional, a VideoObject missing one of them is just weight on the page.
 * The thumbnail is a path on this site, not YouTube's, because the poster is
 * self-hosted.
 */
export function videoJsonLd({
  name,
  description,
  thumbnail,
  uploadDate,
  youtubeId,
  /** ISO 8601, e.g. "PT6M7S". */
  duration,
}: {
  name: string;
  description: string;
  thumbnail: string;
  uploadDate: string;
  youtubeId: string;
  duration?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: thumbnail.startsWith("http") ? thumbnail : `${site.url}${thumbnail}`,
    uploadDate,
    ...(duration ? { duration } : {}),
    embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    publisher: publisherRef(),
  };
}

/**
 * JSON-LD for a standalone graphic, so it can surface in image search on its
 * own terms. `alt` doubles as the caption because it already describes the
 * whole thing in words, an image that needs two different descriptions is
 * usually one where the alt text is not doing its job.
 */
export function imageJsonLd({
  src,
  alt,
  title,
  width,
  height,
  license,
  copyrightNotice,
}: {
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  /** Include only when the image's rights are known and uniform. */
  license?: string;
  copyrightNotice?: string;
}) {
  const licenseUrl = license
    ? license.startsWith("http")
      ? license
      : `${site.url}${license}`
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: `${site.url}${src}`,
    name: title,
    caption: alt,
    width,
    height,
    ...(licenseUrl
      ? {
          license: licenseUrl,
          acquireLicensePage: licenseUrl,
        }
      : {}),
    ...(copyrightNotice ? { copyrightNotice } : {}),
    creditText: site.name,
    /* These graphics are made here, so creator is the honest property. */
    creator: publisherRef(),
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
