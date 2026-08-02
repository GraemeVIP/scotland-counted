import type { Metadata } from "next";
import { site } from "@/lib/site";

/** What the root layout appends, and roughly what Google will display. */
const BRAND_SUFFIX = ` | ${site.name}`;
const TITLE_BUDGET = 60;
const RSS_FEED_URL = `${site.url}/feed.xml`;

/**
 * Builds page metadata consistently: canonical URL, Open Graph,
 * Twitter card and title template all derive from one call.
 */
export function meta({
  title,
  description,
  path = "/",
  type = "website",
  published,
  modified,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  imageType,
  ownImage = false,
}: {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  published?: string;
  modified?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageType?: string;
  /**
   * Set by routes that generate their own card through an adjacent
   * opengraph-image file (areas, constituencies). Those cards are served from a
   * hashed URL we cannot name here, so the only safe thing is to stay out of the
   * way and let the file convention fill the field.
   */
  ownImage?: boolean;
}): Metadata {
  if (title.includes("—") || description.includes("—")) {
    throw new Error(
      "Metadata titles and descriptions must not contain em dashes. Use a pipe in titles and normal sentence punctuation in descriptions.",
    );
  }

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
  const openGraphImage = imageUrl
    ? {
        url: imageUrl,
        alt: imageAlt ?? title,
        ...(imageWidth ? { width: imageWidth } : {}),
        ...(imageHeight ? { height: imageHeight } : {}),
        ...(imageType ? { type: imageType } : {}),
      }
    : undefined;
  const twitterImage = imageUrl
    ? {
        url: imageUrl,
        alt: imageAlt ?? title,
        ...(imageWidth ? { width: imageWidth } : {}),
        ...(imageHeight ? { height: imageHeight } : {}),
      }
    : undefined;
  return {
    /**
     * The root layout appends " | Scotland Counted" to every title. That is 19
     * of the ~60 characters Google will show, and on a site nobody has heard of
     * yet the brand earns nothing while the words that describe the page earn
     * everything. So the suffix is kept where it fits and dropped where it
     * would push the useful part off the end of the result.
     */
    title: title.length + BRAND_SUFFIX.length <= TITLE_BUDGET ? title : { absolute: title },
    description,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": RSS_FEED_URL },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      ...(openGraphImage ? { images: [openGraphImage] } : {}),
      ...(published ? { publishedTime: published } : {}),
      ...(modified ? { modifiedTime: modified } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      /*
       * Without these a shared link renders a card with no byline and no way
       * back to the account — a post can travel and leave nobody able to find
       * who published it. Both are omitted entirely when no handle is set,
       * rather than emitted empty.
       */
      ...(site.social.x ? { site: `@${site.social.x}`, creator: `@${site.social.x}` } : {}),
      ...(twitterImage ? { images: [twitterImage] } : {}),
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
          "Independent research and analysis. Scotland Counted is an independent record of poverty, work and living costs in Scotland.",
        ...(site.social.x ? { sameAs: [`https://x.com/${site.social.x}`] } : {}),
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
    creator: {
      "@type": "Organization",
      name: site.organisation.name,
      url: site.organisation.url,
    },
  };
}

/**
 * JSON-LD for an embedded video.
 *
 * Google needs name, description, thumbnailUrl and uploadDate before a video
 * can show as a rich result, so all four are required here rather than
 * optional — a VideoObject missing one of them is just weight on the page.
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
    publisher: {
      "@type": "Organization",
      name: site.organisation.name,
      url: site.organisation.url,
    },
  };
}

/**
 * JSON-LD for a standalone graphic, so it can surface in image search on its
 * own terms. `alt` doubles as the caption because it already describes the
 * whole thing in words — an image that needs two different descriptions is
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
    creator: { "@type": "Organization", name: site.organisation.name, url: site.organisation.url },
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
