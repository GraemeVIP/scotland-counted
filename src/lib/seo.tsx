import type { Metadata } from "next";
import { site } from "@/lib/site";
import { serialiseJsonLd } from "@/lib/structuredData";

/** What the root layout appends, and roughly what Google will display. */
const BRAND_SUFFIX = ` | ${site.name}`;
const TITLE_BUDGET = 60;
const RSS_FEED_URL = `${site.url}/feed.xml`;

const DATA_OG_PREFIXES = [
  "/representatives/",
  "/councils/",
  "/msp-reviews/",
  "/indicators/",
  "/blog/",
  "/mp-expenses-scotland",
  "/glasgow-vs-edinburgh",
  "/compare-areas",
];

function defaultOgImage(path: string, title: string, description: string): string {
  if (path === "/") return "/opengraph-image";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const isDataRoute =
    DATA_OG_PREFIXES.some((prefix) => cleanPath === prefix || cleanPath.startsWith(prefix)) ||
    cleanPath.endsWith("-council-tax-bands") ||
    cleanPath.endsWith("-after-tax-scotland") ||
    cleanPath.startsWith("/council-tax-band-");

  const params = new URLSearchParams({ path: cleanPath });
  if (!isDataRoute) {
    params.set("t", title.slice(0, 120));
    params.set("d", description.slice(0, 180));
  }
  return `/og?${params.toString()}`;
}

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
  // Written as \u2014, not the character itself. A repository-wide sweep
  // that removed em dashes from prose rewrote this guard into a comma check,
  // which silently turned it into a rule against commas in titles.
  if (title.includes("\u2014") || description.includes("\u2014")) {
    throw new Error(
      "Metadata titles and descriptions must not contain em dashes. Use a pipe in titles and normal sentence punctuation in descriptions.",
    );
  }

  const url = `${site.url}${path === "/" ? "" : path}`;
  /**
   * Every page gets its own unique 1200x630 share card via /og?path=... unless
   * it specifies an explicit image, uses an adjacent opengraph-image file
   * (ownImage: true), or is the homepage (/).
   */
  const resolved = image ?? (ownImage ? undefined : defaultOgImage(path, title, description));
  const isGeneratedCard = Boolean(
    resolved && (resolved.startsWith("/og?") || resolved === "/opengraph-image"),
  );
  const resolvedWidth = imageWidth ?? (isGeneratedCard ? 1200 : undefined);
  const resolvedHeight = imageHeight ?? (isGeneratedCard ? 630 : undefined);
  const resolvedType = imageType ?? (isGeneratedCard ? "image/png" : undefined);
  const imageUrl = resolved
    ? resolved.startsWith("http")
      ? resolved
      : `${site.url}${resolved}`
    : undefined;
  const openGraphImage = imageUrl
    ? {
        url: imageUrl,
        alt: imageAlt ?? title,
        ...(resolvedWidth ? { width: resolvedWidth } : {}),
        ...(resolvedHeight ? { height: resolvedHeight } : {}),
        ...(resolvedType ? { type: resolvedType } : {}),
      }
    : undefined;
  const twitterImage = imageUrl
    ? {
        url: imageUrl,
        alt: imageAlt ?? title,
        ...(resolvedWidth ? { width: resolvedWidth } : {}),
        ...(resolvedHeight ? { height: resolvedHeight } : {}),
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
       * back to the account. A post can travel and leave nobody able to find
       * who published it. Both are omitted entirely when no handle is set,
       * rather than emitted empty.
       */
      ...(site.social.x ? { site: `@${site.social.x}`, creator: `@${site.social.x}` } : {}),
      ...(twitterImage ? { images: [twitterImage] } : {}),
    },
  };
}

/*
 * The JSON-LD builders live in structuredData.ts so the test runner can load
 * them without a JSX transform. Re-exported here because the whole site
 * imports them from "@/lib/seo".
 */
export {
  ENTITY,
  orgJsonLd,
  articleJsonLd,
  datasetJsonLd,
  videoJsonLd,
  imageJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  mspReviewsJsonLd,
  serialiseJsonLd,
} from "@/lib/structuredData";

/** Renders a JSON-LD block. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialiseJsonLd(data) }}
    />
  );
}
