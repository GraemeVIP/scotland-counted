import Script from "next/script";
import { site } from "@/lib/site";

/**
 * GA4 and Microsoft Clarity, loaded only when an ID is configured.
 *
 * Both are added by hand rather than through @next/third-parties, because
 * this project deliberately carries no runtime dependencies.
 *
 * `afterInteractive` loads the scripts asynchronously after the page hydrates.
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
