import { useState } from "react";
import { catalogue, ratingLabels, useLabels, type Entry, type Group } from "@/lib/electricity/appliances";
import { dailyCost, money, number, type Tariff } from "@/lib/electricity/engine";
import { entryRoom } from "@/lib/electricity/rooms";
import { Icon, type SymbolName } from "./Icons";
import s from "./electricity.module.css";

const applianceIcons: Record<string, SymbolName> = {
  kettle: "kettle",
  fridgefreezer: "fridge",
  fridge: "fridge",
  freezer: "freezer",
  oven: "oven",
  hob: "hob",
  induction: "hob",
  microwave: "microwave",
  dishwasher: "dishwasher",
  airfryer: "airfryer",
  toaster: "toaster",
  coffee: "coffee",
  slow: "pot",
  rice: "pot",
  extractor: "hood",
  washer: "washer",
  washerdryer: "washer",
  dryer: "dryer",
  pumpdryer: "dryer",
  iron: "iron",
  airer: "airer",
  led: "bulb",
  halogen: "bulb",
  oldbulb: "bulb",
  cfl: "bulb",
  tv: "tv",
  console: "console",
  laptop: "laptop",
  desktop: "desktop",
  gaming: "desktop",
  monitor: "monitor",
  router: "router",
  box: "settop",
  phone: "phone",
  standby: "standby",
  shower: "shower",
  heater: "heater",
  storage: "radiator",
  radiator: "radiator",
  immersion: "watertank",
  heatpump: "heatpump",
  blanket: "blanket",
  towel: "towel",
  dehumidifier: "droplet",
  ev: "ev",
  vacuum: "vacuum",
  hair: "hairdryer",
  fan: "fan",
  ac: "snowflake",
  pond: "waves",
  custom: "plug",
};

const groupFallbackIcons: Record<Group, SymbolName> = {
  Kitchen: "kettle",
  Laundry: "washer",
  Lighting: "bulb",
  "TV and tech": "tv",
  "Heat and hot water": "heater",
  Other: "plug",
};

export function ApplianceIcon({ id }: { id: string }) {
  const icon = applianceIcons[id] ?? groupFallbackIcons[catalogue[id].group];
  return <span className={s.iconTile}><Icon name={icon}/></span>;
}
function NumberField({ label, value, onChange, max, min = 0, integer = false }: { label: string; value: number; onChange: (n: number) => void; max?: number; min?: number; integer?: boolean }) {
  const [draft, setDraft] = useState<string | null>(null);
  return <label>{label}<input type="number" inputMode={integer ? "numeric" : "decimal"} min={min} max={max} step={integer ? "1" : "any"} required value={draft ?? Number(value.toFixed(5))} onChange={event => {
    const input = event.currentTarget;
    setDraft(input.value);
    if (input.validity.valid) onChange(input.valueAsNumber);
  }} onBlur={event => { if (event.currentTarget.validity.valid) setDraft(null); }}/></label>;
}

const familiarSettings: Record<string, { question: string; field: "rating" | "detail"; options: [string, number][] }> = {
  kettle: { question: "Roughly how full is the kettle?", field: "detail", options: [["One mug", 0.25], ["Two mugs", 0.5], ["One litre", 1], ["Full 1.7 litre kettle", 1.7]] },
  tv: { question: "Roughly how big is the screen?", field: "rating", options: [["Small, around 32 inches", 35], ["Medium, around 50 inches", 85], ["Large, around 65 inches", 125]] },
  led: { question: "How bright are the bulbs?", field: "rating", options: [["Small lamps, around 450 lumens", 5], ["Ordinary bulbs, around 800 lumens", 8], ["Brighter bulbs, around 1,500 lumens", 14]] },
};

function Routine({ entry: e, tariff, change, duplicate, remove, first }: {
  entry: Entry; tariff: Tariff; change: (v: Partial<Entry>) => void; duplicate: () => void; remove: () => void; first: boolean;
}) {
  const a = catalogue[e.id];
  const [open, setOpen] = useState(first || a.id === "custom");
  const [weekly, setWeekly] = useState(a.model === "cycles" || a.model === "miles");
  const [perHundred, setPerHundred] = useState(a.model === "cycles");
  const baseWeekly = a.model === "cycles" || a.model === "miles";
  const scale = weekly === baseWeekly ? 1 : weekly ? 7 : 1 / 7;
  const routineLabel = useLabels[a.model].replace(/per (day|week)/, weekly ? "per week" : "per day");
  const energyLabel = a.model === "cycles" && perHundred ? "kWh per 100 cycles" : ratingLabels[a.model];
  const displayUse = (n: number) => change({ use: n / scale });
  const familiar = familiarSettings[e.id];
  return <details className={s.routine} open={open} onToggle={event => setOpen(event.currentTarget.open)}>
    <summary><ApplianceIcon id={e.id}/><span><strong>{e.name || a.name}</strong><small>{entryRoom(e)} · {e.quantity} {e.id === "led" || a.group === "Lighting" ? (e.quantity === 1 ? "bulb" : "bulbs") : (e.quantity === 1 ? "item" : "items")} · {money(dailyCost(e, tariff) * 7)} per week</small></span><span className={s.chevron} aria-hidden="true">⌄</span></summary>
    <div className={s.routineBody}>
      {a.hint && <p className={s.note}>{a.hint}</p>}
      {e.id === "custom" && <label>Appliance name<input type="text" required maxLength={70} value={e.name} onChange={event => change({ name: event.target.value })}/></label>}
      {familiar && <div className={s.familiar}>
        <strong>{familiar.question}</strong>
        <div className={s.chips}>{familiar.options.map(([label, v]) => <button type="button" key={label} aria-pressed={e[familiar.field] === v} onClick={() => change({ [familiar.field]: v })}>{label}</button>)}</div>
      </div>}
      <div className={s.fieldGrid}>
        <NumberField label={a.group === "Lighting" ? "How many bulbs?" : "How many of these?"} value={e.quantity} min={1} max={1000} integer onChange={quantity => change({ quantity })}/>
        {routineLabel && <NumberField key={routineLabel} label={routineLabel + (e.quantity > 1 ? " per item" : "")} value={e.use * scale} max={a.model === "hours" ? 24 * (weekly ? 7 : 1) : a.model === "minutes" ? 1440 * (weekly ? 7 : 1) : undefined} onChange={displayUse}/>}
        {a.model === "litres" && <NumberField label="Litres in each boil" value={e.detail} min={0.05} onChange={detail => change({ detail })}/>}
        {a.model === "showers" && <NumberField label="Minutes per shower" value={e.detail} onChange={detail => change({ detail })}/>}
        {tariff.night !== undefined && <NumberField label="Use at night rate (%)" value={e.night} max={100} onChange={night => change({ night })}/>}
      </div>
      {routineLabel && <button type="button" className={s.linkBtn} onClick={() => setWeekly(!weekly)}>Enter use per {weekly ? "day" : "week"} instead</button>}
      {a.model === "litres" && <p className={s.note}>An ordinary mug holds about 0.25 litres. Keep to the minimum fill line on your kettle.</p>}
      {["heater", "radiator", "storage", "immersion", "ac"].includes(e.id) && <p className={s.note}>Count the time it draws full power. A thermostat will switch it on and off. Set the weeks of use below for seasonal heating.</p>}
      {a.model === "annual" && <p className={s.note}>We’ve allowed {number(e.rating)} kWh a year for each one, including the time the motor is off.</p>}
      <details className={s.help} open={e.id === "custom" || undefined}><summary>Power, energy label and weeks of use</summary>
        <div className={s.fieldGrid}>
          <NumberField key={energyLabel} label={energyLabel} value={e.rating * (perHundred ? 100 : 1)} onChange={v => change({ rating: v / (perHundred ? 100 : 1) })}/>
          <NumberField label="Weeks used each year" value={e.weeks} max={52} onChange={weeks => change({ weeks })}/>
        </div>
        {a.model === "cycles" && <button type="button" className={s.linkBtn} onClick={() => setPerHundred(!perHundred)}>Use kWh per {perHundred ? "cycle" : "100 cycles"} instead</button>}
        {a.model === "hours" && e.id === "tv" && <p className={s.note}>A TV label showing 85 kWh per 1,000 hours means an average of 85 watts.</p>}
        {e.id !== "custom" && <label>Name for this group<input type="text" required maxLength={70} value={e.name} onChange={event => change({ name: event.target.value })}/></label>}
        <p className={s.note}>Start with our estimate or use your own measurement. Use 52 weeks for a full year.</p>
      </details>
      <div className={s.rowTools}><button type="button" onClick={duplicate}>Add another with different use</button><button type="button" onClick={remove}>Remove</button></div>
    </div>
  </details>;
}
export function Routines({ entries, tariff, change, duplicate, remove }: { entries: Entry[]; tariff: Tariff; change: (key: string, v: Partial<Entry>) => void; duplicate: (e: Entry) => void; remove: (key: string) => void }) {
  return <>{entries.map((e, i) => <Routine key={e.key} entry={e} first={i === 0} tariff={tariff} change={v => change(e.key, v)} duplicate={() => duplicate(e)} remove={() => remove(e.key)}/>)}
    {!entries.length && <p>Go back to Appliances to add something to your estimate.</p>}</>;
}
