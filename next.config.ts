import type { NextConfig } from "next";

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
      "script-src 'self' 'unsafe-inline'",
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
