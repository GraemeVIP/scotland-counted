import Script from "next/script";
import { site } from "@/lib/site";

/**
 * Microsoft Clarity's tag.
 *
 * GA4 is not here. Its snippet lives in <head> in the root layout, because it
 * has to be in the served HTML where a crawler can see it — Search Console's
 * Google Analytics verification reads the static page, and next/script emits
 * only a preload hint server-side. Clarity has no such requirement, so it
 * stays where it costs the least.
 *
 * There is deliberately no route listener for GA4 page views. App Router
 * navigates by pushState, and GA4's Enhanced Measurement already counts that
 * as a page view through "page changes based on browser history events", which
 * is on by default. Sending our own as well reported every navigation twice.
 *
 * The consequence to know about: page views on client-side moves are timed by
 * GA4, which fires on the address changing. That can land a moment before
 * React sets the new document title, so an occasional report may show the
 * previous page's title. Accepted knowingly, in exchange for needing no
 * dashboard configuration at all.
 *
 * Both tools are wired by hand rather than through @next/third-parties,
 * because this project deliberately carries no runtime dependencies.
 */
export default function Analytics() {
  const { clarity } = site.analytics;

  if (!clarity) return null;

  return (
    /*
     * clarity("consent") switches on the cookies Clarity otherwise holds back,
     * including the MUID it shares with Bing. It is here because full tracking
     * was asked for, knowing the site shows no banner and that this therefore
     * asserts a consent no visitor has given. Deleting this one line is the
     * quickest way to reduce the PECR exposure if that ever needs reversing.
     *
     * Masking is deliberately NOT set here, and cannot be: Clarity has no JS
     * API for it. clarity("set", …) writes a custom tag, so a line like
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
  );
}
