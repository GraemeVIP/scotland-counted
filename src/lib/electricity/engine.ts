import { catalogue, type Entry } from "./appliances.ts";

import { entryRoom } from "./rooms.ts";

export type Tariff = { unit: number; standing: number; night?: number };
export const periods = { Day: 1, Week: 7, Month: 365 / 12, Year: 365 };
export type Period = keyof typeof periods;

export function dailyKwh(e: Entry) {
  let kwh: number;
  switch (catalogue[e.id].model) {
    case "hours": kwh = e.rating * e.use / 1000; break;
    case "minutes": kwh = e.rating * e.use / 60_000; break;
    case "showers": kwh = e.rating * e.use * e.detail / 60_000; break;
    case "litres": kwh = e.rating * e.use * e.detail; break;
    case "miles":
    case "cycles": kwh = e.rating * e.use / 7; break;
    case "annual": kwh = e.rating / 365; break;
    case "daily": kwh = e.rating; break;
  }
  return kwh * e.quantity * e.weeks / 52;
}

export function dailyCost(e: Entry, tariff: Tariff) {
  const nightFraction = tariff.night === undefined ? 0 : e.night / 100;
  const rate = tariff.unit * (1 - nightFraction) + (tariff.night ?? tariff.unit) * nightFraction;
  return dailyKwh(e) * rate / 100;
}

export function estimate(entries: Entry[], tariff: Tariff, period: Period) {
  const days = periods[period];
  const rows = entries.map(entry => ({ entry, kwh: dailyKwh(entry) * days, cost: dailyCost(entry, tariff) * days }))
    .sort((a, b) => b.cost - a.cost);
  const energy = rows.reduce((sum, row) => sum + row.cost, 0);
  const kwh = rows.reduce((sum, row) => sum + row.kwh, 0);
  const standing = tariff.standing * days / 100;
  return { rows, energy, kwh, standing, total: energy + standing };
}

export function savingIdea(e: Entry, tariff: Tariff) {
  let change: Partial<Entry>;
  let label: string;
  if (["dryer", "pumpdryer"].includes(e.id) && e.use >= 1) {
    change = { use: e.use - 1 }; label = "Air dry one load each week";
  } else if (["washer", "dishwasher"].includes(e.id) && e.use >= 2) {
    change = { use: e.use - 1 }; label = "Combine smaller loads into one fewer cycle a week";
  } else if (e.id === "shower" && e.detail > 1) {
    change = { detail: e.detail - 1 }; label = "Take one minute off each electric shower";
  } else if (e.id === "kettle" && e.detail >= 0.5) {
    change = { detail: e.detail - 0.25 }; label = "Boil one mug less each time if you usually overfill";
  } else if (["halogen", "oldbulb", "cfl"].includes(e.id) && e.rating > 8) {
    change = { rating: 8 }; label = "Switch these bulbs to 8 W LEDs of similar brightness";
  } else if (["tv", "console", "gaming", "monitor", "desktop", "box", "standby", "led"].includes(e.id) && e.use >= 1) {
    change = { use: e.use - 1 }; label = "Switch off one hour earlier each day";
  } else if (e.id === "ev" && tariff.night !== undefined && tariff.night < tariff.unit && e.night < 100) {
    change = { night: 100 }; label = "Do all your home charging in the cheaper hours";
  } else {
    return null;
  }
  const annual = (dailyCost(e, tariff) - dailyCost({ ...e, ...change }, tariff)) * 365;
  return annual > 0 ? { key: e.key, name: e.name, room: entryRoom(e), label, annual } : null;
}

export const money = (pounds: number) => pounds.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
export const number = (n: number, precision = 2) => n.toLocaleString("en-GB", { maximumFractionDigits: precision });
export const smallCost = (pounds: number) => pounds >= 1 ? money(pounds) : number(pounds * 100, 2) + "p";
