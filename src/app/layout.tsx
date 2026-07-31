import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/Chrome";
import { JsonLd, orgJsonLd } from "@/lib/seo";
import { site } from "../../site.config";

/**
 * Archivo — a grotesque drawn for newspapers and highway signage. Used
 * heavy and tight for display, so headlines and figures read as statements.
 */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

/** Newsreader — an editorial serif for long-form argument. */
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-text",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

/** IBM Plex Mono — institutional, for labels, sources and data. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — poverty in Glasgow, every figure sourced`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author.name, url: site.author.url }],
  creator: site.author.name,
  publisher: site.organisation.name,
  keywords: [
    "Glasgow poverty",
    "child poverty Glasgow",
    "Glasgow child poverty statistics",
    "poverty in Scotland",
    "Scottish child poverty targets",
    "Glasgow deprivation",
    "SIMD Glasgow",
    "Glasgow life expectancy",
    "cost of living Glasgow",
  ],
  alternates: { canonical: site.url },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: `${site.name} — poverty in Glasgow, every figure sourced`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
  width: "device-width",
  initialScale: 1,
};

const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`${archivo.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="grain" aria-hidden="true" />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLd data={orgJsonLd()} />
      </body>
    </html>
  );
}
