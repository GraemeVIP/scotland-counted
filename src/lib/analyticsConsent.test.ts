import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { CONSENT_KEY, CONSENT_MAX_AGE, CONSENT_EVENT, parseAnalyticsConsent, analyticsAllowed } from "./analyticsConsent.ts";
import { ANALYTICS_BOT_PATTERN } from "./analyticsBot.ts";

test("consent expires and malformed or future choices do not enable analytics", () => {
  const now = Date.now();
  assert.equal(parseAnalyticsConsent(JSON.stringify({ choice: "accepted", at: now }), now), "accepted");
  for (const raw of [null, "bad", '{}', JSON.stringify({choice:"accepted",at:now+1}), JSON.stringify({choice:"accepted",at:now-CONSENT_MAX_AGE})]) assert.equal(parseAnalyticsConsent(raw, now), "unset");
  assert.equal(analyticsAllowed("preview.vercel.app", "scotlandcounted.org.uk", "accepted"), false);
});

test("actual browser loader never requests analytics without consent or on previews", () => {
  const source = readFileSync(new URL("../components/Analytics.tsx", import.meta.url), "utf8");
  const begin = source.indexOf('const bootstrap = `') + 'const bootstrap = '.length;
  const template = source.slice(begin, source.indexOf('`;\n',begin)+1);
  const script = new Function("site", "ga4", "clarity", "ANALYTICS_BOT_PATTERN", "CONSENT_KEY", "CONSENT_MAX_AGE", "CONSENT_EVENT", `return ${template}`)(
    {url:"https://scotlandcounted.org.uk"},"G-test","test",ANALYTICS_BOT_PATTERN,CONSENT_KEY,CONSENT_MAX_AGE,CONSENT_EVENT,
  );
  for (const [hostname, choice, expected] of [["scotlandcounted.org.uk","unset",0],["scotlandcounted.org.uk","rejected",0],["localhost","accepted",0],["preview.vercel.app","accepted",0],["scotlandcounted.org.uk","accepted",2]] as const) {
    const scripts: unknown[] = [];
    const listeners: Record<string, () => void> = {};
    const location = {hostname,pathname:"/",origin:`https://${hostname}`};
    const window = {navigator:{userAgent:"Mozilla/5.0"},location,addEventListener:(name:string,fn:()=>void)=>{listeners[name]=fn;},removeEventListener:()=>{},setTimeout:()=>1,clearTimeout:()=>{}};
    const document = {visibilityState:"visible",createElement:()=>({}),head:{appendChild:(s:unknown)=>scripts.push(s)},addEventListener:()=>{},removeEventListener:()=>{}};
    vm.runInNewContext(script,{window,document,location,localStorage:{getItem:()=>JSON.stringify({choice,at:Date.now()})},Date});
    listeners.pointerdown?.();
    assert.equal(scripts.length,expected,`${hostname}/${choice}`);
  }
});
