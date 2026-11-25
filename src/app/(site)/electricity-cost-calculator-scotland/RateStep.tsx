import { useEffect, useState } from "react";
import { payments, regions, suppliers, type Payment, type Quote, type Region } from "@/lib/electricity/rates";
import type { Tariff } from "@/lib/electricity/engine";
import { number } from "@/lib/electricity/engine";
import { Icon } from "./Icons";
import s from "./electricity.module.css";

export type RateForm = { mode: "lookup" | "manual"; supplier: string; region: Region | ""; payment: Payment; unit: string; standing: string; night: string; dual: boolean };
export const initialRate: RateForm = { mode: "lookup", supplier: "", region: "", payment: "debit", unit: "", standing: "", night: "", dual: false };
export function usePrice(form: RateForm) {
  const [lookup, setLookup] = useState<{ query: string; quote: Quote | null } | null>(null);
  const query = form.mode === "lookup" && form.region ? new URLSearchParams({ region: form.region, payment: form.payment, supplier: form.supplier }).toString() : "";
  useEffect(() => {
    if (!query) return;
    const abort = new AbortController();
    fetch("/api/electricity-rates?" + query, { signal: abort.signal }).then(async r => {
      if (!r.ok) throw Error();
      const quote: Quote = await r.json();
      if (!abort.signal.aborted) setLookup({ query, quote });
    }).catch(() => { if (!abort.signal.aborted) setLookup({ query, quote: null }); });
    return () => abort.abort();
  }, [query]);
  const current = lookup?.query === query ? lookup : null;
  const manual = [form.unit, form.standing, ...(form.dual ? [form.night] : [])];
  const valid = manual.every(v => v.trim() !== "" && Number.isFinite(Number(v)) && Number(v) >= 0);
  let tariff: Tariff | null = current?.quote ?? null;
  if (form.mode === "manual") tariff = valid ? { unit: Number(form.unit), standing: Number(form.standing), night: form.dual ? Number(form.night) : undefined } : null;
  return { tariff, quote: current?.quote, pending: Boolean(query && !current), failed: Boolean(current && !current.quote) };
}
type Price = ReturnType<typeof usePrice>;
export function RateStep({ form, change, price }: { form: RateForm; change: (v: Partial<RateForm>) => void; price: Price }) {
  const { quote } = price;
  return <>
    <div className={s.choices} aria-label="How to set your rate">
      {(["lookup", "manual"] as const).map((mode, i) => <button key={mode} type="button" className={s.choice} aria-pressed={form.mode === mode} onClick={() => change({ mode })}><Icon name={i ? "sliders" : "meter"}/>{i ? "Use my bill" : "Find a rate"}</button>)}
    </div>
    {form.mode === "lookup" ? <>
      <div className={s.rateFields}>
        <label>Electricity supplier<select value={form.supplier} onChange={e => change({ supplier: e.target.value })}><option value="">I’m not sure</option>{suppliers.map(p => <option key={p}>{p}</option>)}</select></label>
        <label>Electricity region<select value={form.region} required onChange={e => change({ region: e.target.value as Region })}><option value="">Choose region</option>{Object.entries(regions).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label>Payment method<select value={form.payment} onChange={e => change({ payment: e.target.value as Payment })}>{Object.entries(payments).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      </div>
      <details className={s.help}><summary>Which region am I in?</summary><p>Glasgow and Edinburgh are in South Scotland. Aberdeen, Dundee and the Highlands are in North Scotland. Check the supply number on your bill. Look at the first two digits on the bottom row. 17 means north and 18 means south. <a href="https://www.energynetworks.org/customers/find-my-network-operator">Check your postcode</a>.</p></details>
      <div aria-live="polite">{price.pending && <p className={s.notice}>Looking up the published rate…</p>}{price.failed && <p className={s.notice}>We couldn’t get a current price. Choose “Use my bill” to carry on.</p>}
      {quote && <div className={s.quote}><strong>{quote.title}</strong><span>{quote.period} · {regions[form.region as Region]}</span><div className={s.rateFigures}><b>{number(quote.unit, 4)}p <small>/ kWh</small></b><b>{number(quote.standing, 4)}p <small>/ day</small></b></div>
        <p>{quote.benchmark ? (form.supplier ? "We’re using Ofgem’s regional figure. Your supplier and tariff may charge a different price." : "This is Ofgem’s regional figure for a standard variable tariff.") : "Use this if the tariff name matches your bill."} <a href={quote.source}>Published prices</a>.</p></div>}</div>
      <p className={s.note}>These rates are for a single tariff. On a fixed deal or night rate? Use the prices on your bill.</p>
    </> : <>
      <p className={s.note}>Look under “Your electricity tariff” on your bill. Enter the prices in pence, including any VAT. For example, £0.26 is 26p.</p>
      <label className={s.tick}><input type="checkbox" checked={form.dual} onChange={e => change({ dual: e.target.checked })}/>I pay a different rate overnight</label>
      <div className={s.fieldGrid}>{([["unit", form.dual ? "Day rate (p per kWh)" : "Unit rate (p per kWh)"], ...(form.dual ? [["night", "Night rate (p per kWh)"]] : []), ["standing", "Standing charge (p per day)"]] as [keyof Pick<RateForm, "unit" | "standing" | "night">, string][]).map(([key, label]) => <label key={key}>{label}<input type="number" inputMode="decimal" step="any" required min="0" value={form[key]} onChange={e => change({ [key]: e.target.value })} /></label>)}</div>
      <p className={s.note}>Enter 0 if you have no standing charge. To look just at appliance costs, you can also enter 0 here.</p>
    </>}
  </>;
}
