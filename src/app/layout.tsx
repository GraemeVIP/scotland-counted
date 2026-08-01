import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import Analytics from "@/components/Analytics";

/**
 * Root layout: document shell, fonts and theme only. Site chrome
 * (header, footer, grain) lives in the (site) route group so that
 * embed routes can render bare inside other people's pages.
 */

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-text",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — poverty in Scotland, explained clearly`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author.name, url: site.author.url }],
  creator: site.author.name,
  publisher: site.organisation.name,
  keywords: [
    "poverty in Scotland",
    "Scottish poverty statistics",
    "child poverty Scotland",
    "poverty by council area",
    "unemployment Scotland",
    "pay by council area Scotland",
    "Scottish child poverty targets",
    "contact my MP Scotland",
    "contact my MSP",
    "Glasgow poverty",
    "Glasgow child poverty statistics",
    "Glasgow deprivation",
    "SIMD Glasgow",
    "Glasgow life expectancy",
  ],
  alternates: {
    canonical: site.url,
    types: { "application/rss+xml": `${site.url}/feed.xml` },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: `${site.name} — poverty in Scotland, explained clearly`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false },
  /*
   * Search Console verification. Next only emits the meta tag when the value
   * is non-empty, so an unconfigured site ships no empty tag.
   */
  ...(site.analytics.googleSiteVerification
    ? { verification: { google: site.analytics.googleSiteVerification } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint: restores the chosen theme, and arms the
 * entrance animation only when it can actually play. The class is
 * removed once the sequence would have finished, so a suspended
 * animation can never leave content stuck invisible.
 */
const BOOT_SCRIPT = `
try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}
try{
  var ok = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        && document.visibilityState === 'visible';
  if(ok){
    document.documentElement.classList.add('anim');
    setTimeout(function(){document.documentElement.classList.remove('anim')}, 2600);
  }
}catch(e){}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`${archivo.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        {/*
          Google's stock gtag snippet, written straight into <head> rather than
          loaded through next/script.

          next/script's afterInteractive strategy emits only a
          <link rel="preload"> server-side and injects the real <script> tag
          after hydration. A browser ends up running it either way, so tracking
          worked — but anything reading the static HTML sees no tracking code
          at all. That is why Search Console's Google Analytics verification
          failed while Realtime showed live visits: both were true at once.
          That method also requires the snippet to be in <head>, which it was
          not, since <Analytics /> renders at the end of <body>.

          Page views are left entirely to GA4. This config call reports the
          landing page, and Enhanced Measurement's "page changes based on
          browser history events" reports each client-side move after it —
          App Router navigates by pushState, which is exactly what that setting
          watches for. It is on by default, so nothing needs configuring.

          That option is therefore load-bearing here, which is not obvious from
          the dashboard. Switch it off and every navigation after the landing
          page stops being counted. There is no code path that would notice or
          make up the difference.
        */}
        {site.analytics.ga4 && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${site.analytics.ga4}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());
gtag('config','${site.analytics.ga4}');`,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
