import type { NextConfig } from "next";
import { site } from "./site.config";

/**
 * Next's dev server compiles modules through eval(), so a script-src without
 * 'unsafe-eval' stops React hydrating, silently. Every page still renders,
 * because the HTML is server-produced, but nothing is interactive: no button
 * has a handler, and the console says nothing. It looks like broken features
 * rather than a blocked policy.
 *
 * Production never uses eval, so the deployed policy stays strict. This is the
 * one difference between the two.
 */
const isDev = process.env.NODE_ENV === "development";

/*
 * Analytics hosts are added to the policy only for the tools that are
 * switched on in site.config.ts. Leave an ID blank and its hosts never enter
 * the header, so the policy is never looser than what is actually running.
 *
 * This is also the failure mode worth knowing about: a blocked analytics
 * script does not warn anybody. The tool simply reports no traffic, which
 * reads as "nobody visited" rather than "the browser refused to load it".
 */
const ga4 = Boolean(site.analytics.ga4);
const clarity = Boolean(site.analytics.clarity);

const analyticsScript = [
  ...(ga4
    ? [
        "https://www.googletagmanager.com",
        "https://*.googletagmanager.com",
        "https://*.google-analytics.com",
        "https://*.analytics.google.com",
      ]
    : []),
  ...(clarity ? ["https://www.clarity.ms", "https://*.clarity.ms"] : []),
];

const analyticsConnect = [
  ...(ga4
    ? [
        "https://*.google-analytics.com",
        "https://*.analytics.google.com",
        "https://*.googletagmanager.com",
      ]
    : []),
  // Clarity ingests through Bing's collector as well as its own host.
  ...(clarity ? ["https://*.clarity.ms", "https://c.bing.com"] : []),
];

const analyticsImg = [
  ...(ga4 ? ["https://*.google-analytics.com", "https://*.googletagmanager.com"] : []),
  ...(clarity ? ["https://*.clarity.ms", "https://c.bing.com"] : []),
];

const join = (base: string[], extra: string[]) => [...base, ...extra].join(" ");

const scriptSrc = join(
  ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])],
  analyticsScript
);

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self' https://api.web3forms.com",
      `connect-src ${join(
        ["'self'", "https://api.postcodes.io", "https://api.web3forms.com"],
        analyticsConnect
      )}`,
      "font-src 'self' data:",
      `img-src ${join(["'self'", "data:", "blob:"], analyticsImg)}`,
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline'",
      "object-src 'none'",
      /*
       * youtube-nocookie.com is the only third-party frame allowed, and only
       * because a video is embedded. It is YouTube's privacy-enhanced host, and
       * src/components/VideoEmbed.tsx does not create the iframe at all until
       * somebody presses play, so on a normal page view nothing is requested
       * from it. The poster is served from this origin, which is why img-src
       * stays locked to 'self'.
       */
      "frame-src 'self' https://www.youtube-nocookie.com",
      "manifest-src 'self'",
      "worker-src 'self' blob:",
    ].join("; "),
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
