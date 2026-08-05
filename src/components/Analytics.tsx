import Script from "next/script";
import { site } from "@/lib/site";
import { ANALYTICS_BOT_PATTERN } from "@/lib/analyticsBot";

/**
 * GA4 and Microsoft Clarity, loaded only for a visible, human-like session.
 *
 * Search crawlers can still read and index the public site, but obvious bots,
 * browser automation and quick probes do not start either analytics library.
 * A real visitor starts analytics on their first interaction, or after ten
 * seconds on a visible page so passive readers are still counted.
 */
export default function Analytics() {
  const { ga4, clarity } = site.analytics;

  if (!ga4 && !clarity) return null;

  const bootstrap = `(function(){
var nav=window.navigator;
var ua=nav.userAgent||'';
var automated=new RegExp(${JSON.stringify(ANALYTICS_BOT_PATTERN.source)},${JSON.stringify(ANALYTICS_BOT_PATTERN.flags)});
if(nav.webdriver===true||automated.test(ua))return;

var ga4=${JSON.stringify(ga4 || "")};
var clarityId=${JSON.stringify(clarity || "")};
var started=false;
var timer;
var signals=['pointerdown','touchstart','keydown','scroll'];

function addScript(src){
  var script=document.createElement('script');
  script.async=true;
  script.src=src;
  document.head.appendChild(script);
}

function cleanup(){
  if(timer)window.clearTimeout(timer);
  signals.forEach(function(name){window.removeEventListener(name,start);});
  document.removeEventListener('visibilitychange',schedule);
}

function start(){
  if(started||document.visibilityState!=='visible')return;
  started=true;
  cleanup();

  if(ga4){
    window.dataLayer=window.dataLayer||[];
    window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
    window.gtag('js',new Date());
    window.gtag('config',ga4);
    addScript('https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(ga4));
  }

  if(clarityId){
    window.clarity=window.clarity||function(){
      (window.clarity.q=window.clarity.q||[]).push(arguments);
    };
    addScript('https://www.clarity.ms/tag/'+encodeURIComponent(clarityId));
  }
}

function schedule(){
  if(!started&&document.visibilityState==='visible'){
    if(timer)window.clearTimeout(timer);
    timer=window.setTimeout(start,10000);
  }
}

signals.forEach(function(name){
  window.addEventListener(name,start,{passive:true});
});
document.addEventListener('visibilitychange',schedule);
schedule();
})();`;

  return (
    <Script id="analytics-human-loader" strategy="afterInteractive">
      {bootstrap}
    </Script>
  );
}
