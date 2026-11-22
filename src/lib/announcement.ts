/*
 * Shared by the top announcement strip (a client component) and the site
 * layout (a server component), so it lives outside the "use client" file.
 * Bump the key when the message changes so people who closed the old one
 * see the new one.
 */
export const BAR_STORAGE_KEY = "sc-bar-mp-expenses-yu-2026-11";

/** Runs before the strip is drawn: hides it if this browser closed it. */
export const BAR_HIDE_SCRIPT = `try{if(localStorage.getItem(${JSON.stringify(
  BAR_STORAGE_KEY,
)})==="closed")document.documentElement.setAttribute("data-bar-closed","")}catch(e){}`;
