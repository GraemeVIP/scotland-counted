import type { NextConfig } from "next";

/**
 * Next's dev server compiles modules through eval(), so a script-src without
 * 'unsafe-eval' stops React hydrating — silently. Every page still renders,
 * because the HTML is server-produced, but nothing is interactive: no button
 * has a handler, and the console says nothing. It looks like broken features
 * rather than a blocked policy.
 *
 * Production never uses eval, so the deployed policy stays strict. This is the
 * one difference between the two.
 */
const isDev = process.env.NODE_ENV === "development";

const scriptSrc = ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])].join(" ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self' https://api.web3forms.com",
      "connect-src 'self' https://api.postcodes.io https://api.web3forms.com",
      "font-src 'self' data:",
      "img-src 'self' data: blob:",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline'",
      "object-src 'none'",
      /*
       * youtube-nocookie.com is the only third-party frame allowed, and only
       * because a video is embedded. It is YouTube's privacy-enhanced host, and
       * src/components/VideoEmbed.tsx does not create the iframe at all until
       * somebody presses play — so on a normal page view nothing is requested
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
