#!/usr/bin/env node
/**
 * Contrast check for the design tokens.
 *
 * Reads the light and dark token blocks out of globals.css and checks every
 * text and background pairing the components actually use against WCAG AA:
 * 4.5:1 for body text and 3:1 for large text and graphics. Run it after any
 * colour change: npm run check:contrast
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const css = readFileSync(fileURLToPath(new URL("../src/app/globals.css", import.meta.url)), "utf8");

function block(selector) {
  const start = css.indexOf(selector);
  if (start < 0) throw new Error(`Missing ${selector}`);
  const open = css.indexOf("{", start);
  let depth = 1;
  let i = open + 1;
  while (depth && i < css.length) {
    if (css[i] === "{") depth += 1;
    if (css[i] === "}") depth -= 1;
    i += 1;
  }
  const tokens = {};
  for (const m of css.slice(open + 1, i - 1).matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)) tokens[m[1]] = m[2];
  return tokens;
}

function luminance(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const l = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
}

export function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const light = block(":root {");
const dark = { ...light, ...block(':root[data-theme="dark"] {') };

/* [foreground, background, minimum] using token names, or literal hex. */
const PAIRS = [
  ["ink", "paper", 4.5], ["ink", "surface", 4.5], ["ink-2", "paper", 4.5], ["ink-2", "surface", 4.5],
  ["ink-3", "paper", 4.5], ["muted", "paper", 4.5], ["muted", "surface", 4.5], ["muted", "paper-2", 4.5], ["muted", "surface-2", 4.5],
  ["brand", "paper", 4.5], ["brand", "surface", 4.5], ["action-text", "surface", 4.5], ["action-text", "paper", 4.5],
  ["action-ink", "action", 4.5], ["action-ink", "action-hover", 4.5], ["ink", "action-tint", 4.5],
  ["deep-ink", "deep", 4.5], ["deep-ink", "deep-2", 4.5], ["deep-muted", "deep", 4.5], ["deep-muted", "deep-2", 4.5],
  ["hero-ink", "hero-1", 4.5], ["hero-ink", "hero-2", 4.5], ["hero-muted", "hero-1", 4.5], ["hero-muted", "hero-2", 4.5], ["hero-muted", "hero-3", 4.5],
  ["good-text", "surface", 4.5], ["warn-text", "surface", 4.5], ["bad-text", "surface", 4.5],
  ["action-text", "action-tint", 4.5], ["hero-muted", "#073a8a", 4.5], ["hero-muted", "#1259c8", 4.5], ["hero-ink", "#1259c8", 4.5], ["deep-muted", "#0a2a6e", 4.5],
  ["glasgow", "surface", 3], ["scotland", "surface", 3], ["rule-strong", "surface", 1.3],
  ["hub-money", "surface", 4.5], ["hub-benefits", "surface", 4.5], ["hub-tax", "surface", 4.5], ["hub-area", "surface", 4.5], ["hub-reps", "surface", 4.5], ["hub-schools", "surface", 4.5],
  ["hub-money", "paper", 4.5], ["hub-benefits", "paper", 4.5], ["hub-tax", "paper", 4.5], ["hub-area", "paper", 4.5], ["hub-reps", "paper", 4.5], ["hub-schools", "paper", 4.5],
  ["hub-money-bar", "deep", 4.5], ["hub-benefits-bar", "deep", 4.5], ["hub-tax-bar", "deep", 4.5], ["hub-area-bar", "deep", 4.5], ["hub-reps-bar", "deep", 4.5], ["hub-schools-bar", "deep", 4.5],
];

let failures = 0;
for (const [name, tokens] of [["light", light], ["dark", dark]]) {
  for (const [fg, bg, min] of PAIRS) {
    const a = tokens[fg] ?? (fg.startsWith("#") ? fg : null);
    const b = tokens[bg] ?? (bg.startsWith("#") ? bg : null);
    if (!a || !b) { console.log(`skip  ${name} ${fg} on ${bg} (token missing)`); continue; }
    const r = ratio(a, b);
    const ok = r >= min;
    if (!ok) failures += 1;
    if (!ok || process.argv.includes("--all")) console.log(`${ok ? "ok  " : "FAIL"}  ${name.padEnd(5)} ${fg} ${a} on ${bg} ${b}: ${r.toFixed(2)} (needs ${min})`);
  }
}
console.log(failures ? `\n${failures} pairing(s) below the minimum.` : "\nEvery pairing meets its minimum.");
process.exitCode = failures ? 1 : 0;
