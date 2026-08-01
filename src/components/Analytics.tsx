import Script from "next/script";
import { site } from "@/lib/site";

/**
 * GA4 and Microsoft Clarity, loaded only when an ID is configured.
 *
 * Both are added by hand rather than through @next/third-parties, because
 * this project deliberately carries no runtime dependencies. These are a few
 * lines each; a package to hold them would be the only thing in node_modules
 * that ships to a browser.
 *
 * `afterInteractive` matters. These are measurement tools, not features, so
 * they must never sit in front of the page becoming usable — particularly on
 * the letter builder, which is the one thing the site exists to do.
 *
 * Note for whoever reads this next: the hosts these scripts talk to are
 * allowed in the Content-Security-Policy in next.config.ts, and that list is
 * built from the same config values. Enabling a tool here without its hosts
 * there produces a tool that silently reports zero traffic.
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
        </>
      )}

      {clarity && (
        /*
         * Clarity's stock snippet, unmodified.
         *
         * Two things are deliberately NOT here. There is no clarity("consent")
         * call: consent has not been asked for, so claiming it in code would be
         * untrue, and without the call Clarity runs without its advertising
         * cookie. And masking is not configured here, because Clarity has no
         * JS API for it — clarity("set", …) writes a custom tag, so a line like
         * clarity("set","mask","all") looks protective and does nothing.
         *
         * Real masking comes from two places: data-clarity-mask="true" on the
         * postcode, name and free-text inputs in LetterBuilder.tsx, and the
         * masking mode in the Clarity dashboard, which must be set to Strict.
         */
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,'clarity','script','${clarity}');`}
        </Script>
      )}
    </>
  );
}
