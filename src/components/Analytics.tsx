import Script from "next/script";
import { site } from "@/lib/site";
import AnalyticsPreferences from "./AnalyticsPreferences";
import { CONSENT_KEY, CONSENT_MAX_AGE, CONSENT_EVENT } from "@/lib/analyticsConsent";
import { ANALYTICS_BOT_PATTERN } from "@/lib/analyticsBot";

/** Optional analytics run only on the public host after an explicit choice. */
export default function Analytics() {
  const { ga4, clarity } = site.analytics;

  if (!ga4 && !clarity) return null;

  const bootstrap = `(function(){
var nav=window.navigator;
if(window.location.hostname!==${JSON.stringify(new URL(site.url).hostname)})return;
if(window.location.pathname.indexOf('/review-moderation')===0||window.location.pathname.indexOf('/embed')===0)return;
var ua=nav.userAgent||'';
var automated=new RegExp(${JSON.stringify(ANALYTICS_BOT_PATTERN.source)},${JSON.stringify(ANALYTICS_BOT_PATTERN.flags)});
if(nav.webdriver===true||automated.test(ua))return;

var ga4=${JSON.stringify(ga4 || "")};
var clarityId=${JSON.stringify(clarity || "")};
var started=false;
var timer;
var consentKey=${JSON.stringify(CONSENT_KEY)};
function allowed(){
 try{var c=JSON.parse(localStorage.getItem(consentKey));return c&&c.choice==='accepted'&&typeof c.at==='number'&&c.at<=Date.now()&&Date.now()-c.at<${CONSENT_MAX_AGE};}catch(e){return false;}
}
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
  if(started||!allowed()||document.visibilityState!=='visible')return;
  started=true;
  cleanup();

  if(ga4){
    window.dataLayer=window.dataLayer||[];
    window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
    window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    window.gtag('js',new Date());
    window.gtag('config',ga4,{allow_google_signals:false,allow_ad_personalization_signals:false,page_location:location.origin+location.pathname});
    addScript('https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(ga4));
  }

  if(clarityId){
    window.clarity=window.clarity||function(){
      (window.clarity.q=window.clarity.q||[]).push(arguments);
    };
    window.clarity('consentv2',{ad_Storage:'denied',analytics_Storage:'granted'});
    addScript('https://www.clarity.ms/tag/'+encodeURIComponent(clarityId));
  }
}

function schedule(){
  if(!started&&allowed()&&document.visibilityState==='visible'){
    if(timer)window.clearTimeout(timer);
    timer=window.setTimeout(start,10000);
  }
}

signals.forEach(function(name){
  window.addEventListener(name,start,{passive:true});
});
document.addEventListener('visibilitychange',schedule);
window.addEventListener(${JSON.stringify(CONSENT_EVENT)},function(){
 if(!allowed()){window['ga-disable-'+ga4]=true;if(window.clarity)window.clarity('consentv2',{ad_Storage:'denied',analytics_Storage:'denied'});return;}
 window['ga-disable-'+ga4]=false;start();
});
window.addEventListener('storage',function(event){if(event.key===consentKey){if(!allowed())window.location.reload();else start();}});
schedule();
})();`;

  return (
    <>
    <AnalyticsPreferences />
    <Script id="analytics-human-loader" strategy="afterInteractive">
      {bootstrap}
    </Script>
    </>
  );
}
