import Script from "next/script";
import { site } from "@/lib/site";
import { ANALYTICS_BOT_PATTERN } from "@/lib/analyticsBot";
import { COOKIE_CONSENT_EVENT, COOKIE_STORAGE_KEY } from "@/lib/consent";

/**
 * GA4 and Microsoft Clarity, loaded only for a visible, human-like session.
 *
 * Search crawlers can still read and index the public site, but obvious bots,
 * browser automation and quick probes do not start either analytics library.
 * A real visitor starts Clarity on their first interaction (or after ten
 * visible seconds) in cookieless mode until they accept cookies, at which point
 * Clarity switches to cookie storage via consentv2 and GA4 starts cleanly.
 */
export default function Analytics() {
  const { ga4, clarity } = site.analytics;

  if (!ga4 && !clarity) return null;

  const bootstrap = `(function(){
var nav=window.navigator;
var path=window.location.pathname;
if(path.indexOf('/review-moderation/')===0||path==='/classroom'||path.indexOf('/classroom/')===0)return;
// Local copies and Vercel previews are testing, not visitors: never count them.
var host=window.location.hostname;
if(host==='localhost'||host==='127.0.0.1'||host==='[::1]'||host==='0.0.0.0'||/[.](local|localhost|test)$/.test(host)||/[.]vercel[.]app$/.test(host))return;
var ua=nav.userAgent||'';
var automated=new RegExp(${JSON.stringify(ANALYTICS_BOT_PATTERN.source)},${JSON.stringify(ANALYTICS_BOT_PATTERN.flags)});
if(nav.webdriver===true||automated.test(ua))return;

var ga4=${JSON.stringify(ga4 || "")};
var clarityId=${JSON.stringify(clarity || "")};
var storageKey=${JSON.stringify(COOKIE_STORAGE_KEY)};
var consentEvent=${JSON.stringify(COOKIE_CONSENT_EVENT)};
var started=false;
var clarityStarted=false;
var ga4Started=false;
var timer;
var signals=['pointerdown','touchstart','keydown','scroll'];

function readChoice(){
  try{
    var v=window.localStorage.getItem(storageKey);
    return v==='accepted'||v==='rejected'||v==='clarity-only'||v==='ga4-only'?v:null;
  }catch(e){
    return null;
  }
}

function clarityAllowed(choice){
  return choice==='accepted'||choice==='clarity-only';
}

function ga4Allowed(choice){
  return choice==='accepted'||choice==='ga4-only';
}

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

function setClarityConsent(granted){
  if(!clarityId)return;
  window.clarity=window.clarity||function(){
    (window.clarity.q=window.clarity.q||[]).push(arguments);
  };
  window.clarity('consentv2',{
    ad_Storage:'denied',
    analytics_Storage:granted?'granted':'denied'
  });
}

function startClarity(granted){
  if(!clarityId)return;
  setClarityConsent(granted);
  if(clarityStarted)return;
  clarityStarted=true;
  addScript('https://www.clarity.ms/tag/'+encodeURIComponent(clarityId));
}

function startGa4(){
  if(!ga4)return;
  if(ga4Started){
    if(typeof window.gtag==='function'){
      window.gtag('consent','update',{analytics_storage:'granted'});
    }
    return;
  }
  ga4Started=true;
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',{
    ad_storage:'denied',
    ad_user_data:'denied',
    ad_personalization:'denied',
    analytics_storage:'granted'
  });
  window.gtag('js',new Date());
  window.gtag('config',ga4);
  addScript('https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(ga4));
}

function start(){
  if(started||document.visibilityState!=='visible')return;
  started=true;
  cleanup();

  var choice=readChoice();
  startClarity(clarityAllowed(choice));
  if(ga4Allowed(choice))startGa4();
}

function schedule(){
  if(!started&&document.visibilityState==='visible'){
    if(timer)window.clearTimeout(timer);
    timer=window.setTimeout(start,10000);
  }
}

window.addEventListener(consentEvent,function(ev){
  var choice=ev&&ev.detail&&ev.detail.choice;
  if(!choice)return;
  if(clarityAllowed(choice)||ga4Allowed(choice)){
    started=true;
    cleanup();
  }
  if(clarityAllowed(choice)){
    startClarity(true);
  }else if(clarityStarted){
    setClarityConsent(false);
  }
  if(ga4Allowed(choice)){
    startGa4();
  }else if(ga4Started&&typeof window.gtag==='function'){
    window.gtag('consent','update',{analytics_storage:'denied'});
  }
});

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
