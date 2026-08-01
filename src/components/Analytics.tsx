"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";
import Script from "next/script";
import { site } from "@/lib/site";

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (
      site.analytics.ga4 &&
      typeof window !== "undefined" &&
      typeof window.gtag === "function"
    ) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      window.gtag("config", site.analytics.ga4, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * GA4 and Microsoft Clarity, loaded only when an ID is configured.
 *
 * Both are added by hand rather than through @next/third-parties, because
 * this project deliberately carries no runtime dependencies.
 *
 * RouteTracker uses Next.js navigation hooks to fire GA4 pageviews on
 * client-side SPA transitions, ensuring full pageview capture.
 */
export default function Analytics() {
  const { ga4, clarity } = site.analytics;

  if (!ga4 && !clarity) return null;

  return (
    <>
      {ga4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());
gtag('config','${ga4}');`}
          </Script>
          <Suspense fallback={null}>
            <RouteTracker />
          </Suspense>
        </>
      )}

      {clarity && (
        /*
         * clarity("consent") switches on the cookies Clarity otherwise holds
         * back, including the MUID it shares with Bing. It is here because full
         * tracking was asked for, knowing the site shows no banner and that
         * this therefore asserts a consent no visitor has given. Deleting this
         * one line is the quickest way to reduce the PECR exposure if that ever
         * needs reversing.
         *
         * Masking is deliberately NOT set here, and cannot be: Clarity has no
         * JS API for it. clarity("set", …) writes a custom tag, so a line like
         * clarity("set","mask","all") looks protective and does nothing at all.
         * Masking comes from data-clarity-mask="true" on the postcode, name and
         * free-text inputs in LetterBuilder.tsx, plus the dashboard setting.
         */
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
c[a]('consent');
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,'clarity','script','${clarity}');`}
        </Script>
      )}
    </>
  );
}
