/*
 * Shared by the top announcement strip (a client component) and the site
 * layout (a server component), so it lives outside the "use client" file.
 * Bump the key when the message changes so people who closed the old one
 * see the new one.
 */
export const BAR_STORAGE_KEY = "sc-bar-public-data-2026-11-25";

/*
 * The strip runs an A/B test: each visitor is given one of these at random
 * on their first visit and keeps it, so the clicks for each can be compared.
 * Results show in Clarity and GA4 as banner_view_<id>, banner_click_<id> and
 * banner_close_<id>. Change BAR_VARIANT_KEY to start a fresh test.
 */
export const BAR_VARIANTS = ["lessons", "postcode", "councils", "charities"] as const;
export type BarVariant = (typeof BAR_VARIANTS)[number];
export const BAR_VARIANT_KEY = "sc-bar-variant-public-2026-11-25";

/**
 * Runs before the strip is drawn: hides it if this browser closed it, and
 * picks (or recalls) this visitor's test version, so the right wording is
 * there from the first paint with no flicker.
 */
export const BAR_HIDE_SCRIPT = `(function(){var d=document.documentElement,a=${JSON.stringify(
  BAR_VARIANTS,
)},v;try{if(localStorage.getItem(${JSON.stringify(
  BAR_STORAGE_KEY,
)})==="closed")d.setAttribute("data-bar-closed","");v=localStorage.getItem(${JSON.stringify(
  BAR_VARIANT_KEY,
)});if(a.indexOf(v)<0){v=a[Math.floor(Math.random()*a.length)];localStorage.setItem(${JSON.stringify(
  BAR_VARIANT_KEY,
)},v)}}catch(e){if(a.indexOf(v)<0)v=a[Math.floor(Math.random()*a.length)]}d.setAttribute("data-bar-variant",v)})()`;
