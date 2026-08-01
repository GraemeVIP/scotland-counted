"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Script from "next/script";
import { site } from "@/lib/site";

/**
 * One page view per page, on the first render and on every client-side move.
 *
 * Three things here are load-bearing.
 *
 * It sends an event rather than calling config again. Repeated config re-runs
 * tag initialisation, and page_path is a Universal Analytics field that GA4
 * does not read — GA4 takes the address from page_location.
 *
 * It does NOT skip the first render. The snippet in <head> sets
 * send_page_view: false, so nothing else reports the landing page; skipping
 * here would lose it entirely.
 *
 * And it reads location and title at send time, after React has committed, so
 * a client-side move reports the page the reader actually arrived on rather
 * than the title of the one they just left.
 *
 * The matching dashboard setting is "Page changes based on browser history
 * events" under Enhanced Measurement, which must be OFF. Next's App Router
 * navigates by pushState, so GA4 would otherwise count each move a second
 * time on its own.
 */
function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!site.analytics.ga4) return;
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;

    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

/**
 * Clarity's tag, and GA4's page views.
 *
 * Both tools are wired by hand rather than through @next/third-parties,
 * because this project deliberately carries no runtime dependencies.
 *
 * GA4 is split across two files, which is worth knowing before moving either
 * half. The gtag snippet lives in <head> in the root layout so that it is in
 * the served HTML where a crawler can see it; this file only reports page
 * views on top of it. Clarity has no such requirement and stays here.
 */
export default function Analytics() {
  const { ga4, clarity } = site.analytics;

  if (!ga4 && !clarity) return null;

  return (
    <>
      {/*
        gtag itself is loaded in <head> by the root layout, not here — a
        crawler has to be able to see it in the static HTML, which next/script
        does not provide. This component only reports the page views.
      */}
      {ga4 && (
        <Suspense fallback={null}>
          <RouteTracker />
        </Suspense>
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
