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
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        {site.analytics.ga4 && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${site.analytics.ga4}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${site.analytics.ga4}');`}
            </Script>
          </>
        )}
        <Analytics />
      </body>
    </html>
  );
}
