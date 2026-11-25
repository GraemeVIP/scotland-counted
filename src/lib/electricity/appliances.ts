// Representative starting points. Cycle and annual figures include idle parts of the cycle.
// References and label conventions are shown beside the calculator.
export const groups = ["Kitchen", "Laundry", "Lighting", "TV and tech", "Heat and hot water", "Other"] as const;
export type Group = (typeof groups)[number];
export type Model = "hours" | "minutes" | "cycles" | "annual" | "litres" | "showers" | "miles" | "daily";
export type Appliance = {
  id: string; name: string; group: Group; model: Model; rating: number; use: number;
  detail?: number; quantity?: number; hint?: string;
};

function item(id: string, name: string, group: Group, model: Model, rating: number, use: number, extra: Partial<Appliance> = {}): Appliance {
  return { id, name, group, model, rating, use, ...extra };
}

export const appliances: Appliance[] = [
  item("kettle", "Kettle", "Kitchen", "litres", 0.11, 4, { detail: 1, hint: "Count each time you boil it, including a second boil for the same cup." }),
  item("washer", "Washing machine", "Laundry", "cycles", 0.65, 4),
  item("tv", "Television", "TV and tech", "hours", 85, 4),
  item("led", "LED bulbs", "Lighting", "hours", 8, 4, { quantity: 4 }),
  item("fridgefreezer", "Fridge freezer", "Kitchen", "annual", 250, 1),
  item("dryer", "Tumble dryer (vented or condenser)", "Laundry", "cycles", 3.8, 3),
  item("shower", "Electric shower", "Heat and hot water", "showers", 8500, 2, { detail: 8, hint: "For a shower that heats its own water. Count everyone’s showers together." }),
  item("dishwasher", "Dishwasher", "Kitchen", "cycles", 0.85, 5),
  item("oven", "Electric oven", "Kitchen", "minutes", 1000, 45, { hint: "Average minutes a day the oven is on. We allow for the thermostat switching on and off." }),
  item("hob", "Electric hob", "Kitchen", "minutes", 1400, 30, { hint: "Estimate time with a ring in use. Count each ring separately if you use several." }),
  item("induction", "Induction hob", "Kitchen", "minutes", 1200, 30),
  item("airfryer", "Air fryer", "Kitchen", "minutes", 1300, 20),
  item("microwave", "Microwave", "Kitchen", "minutes", 1250, 6, { hint: "Use the electrical input on the label if you have it. The cooking power on the front is lower." }),
  item("toaster", "Toaster", "Kitchen", "minutes", 1000, 4),
  item("coffee", "Coffee machine", "Kitchen", "minutes", 1200, 5),
  item("slow", "Slow cooker", "Kitchen", "hours", 150, 2),
  item("rice", "Rice cooker", "Kitchen", "minutes", 500, 20),
  item("extractor", "Cooker hood", "Kitchen", "minutes", 90, 30),
  item("fridge", "Separate fridge", "Kitchen", "annual", 130, 1),
  item("freezer", "Separate freezer", "Kitchen", "annual", 210, 1),
  item("pumpdryer", "Heat pump tumble dryer", "Laundry", "cycles", 1.5, 3),
  item("washerdryer", "Washer dryer (wash and dry)", "Laundry", "cycles", 3.2, 3, { hint: "Count complete wash and dry loads here. Add wash only loads under Washing machine." }),
  item("iron", "Iron", "Laundry", "minutes", 1100, 10),
  item("airer", "Heated clothes airer", "Laundry", "hours", 230, 4),
  item("halogen", "Halogen bulbs", "Lighting", "hours", 42, 4, { quantity: 4 }),
  item("oldbulb", "Old filament bulbs", "Lighting", "hours", 60, 4, { quantity: 4 }),
  item("cfl", "Energy saving spiral bulbs (CFL)", "Lighting", "hours", 14, 4, { quantity: 4 }),
  item("console", "Games console", "TV and tech", "hours", 150, 2),
  item("laptop", "Laptop", "TV and tech", "hours", 45, 5),
  item("desktop", "Desktop computer", "TV and tech", "hours", 150, 4),
  item("gaming", "Gaming PC", "TV and tech", "hours", 350, 3),
  item("monitor", "Computer monitor", "TV and tech", "hours", 25, 6),
  item("router", "Broadband router", "TV and tech", "hours", 10, 24),
  item("box", "TV box or recorder", "TV and tech", "hours", 12, 16),
  item("phone", "Phone charger", "TV and tech", "hours", 10, 2),
  item("standby", "Standby devices", "TV and tech", "hours", 2, 20),
  item("heater", "Plug in electric heater", "Heat and hot water", "hours", 2000, 2),
  item("storage", "Storage heater", "Heat and hot water", "hours", 2500, 5),
  item("radiator", "Electric radiator", "Heat and hot water", "hours", 1500, 3),
  item("immersion", "Immersion water heater", "Heat and hot water", "hours", 3000, 1),
  item("heatpump", "Home heating or heat pump", "Heat and hot water", "daily", 8, 1, { hint: "Use electricity input from your controller or meter. Heating demand varies widely by home and season." }),
  item("blanket", "Electric blanket", "Heat and hot water", "hours", 75, 2),
  item("towel", "Electric towel rail", "Heat and hot water", "hours", 150, 4),
  item("dehumidifier", "Dehumidifier", "Other", "hours", 220, 5),
  item("ev", "Electric car charging", "Other", "miles", 0.32, 100, { hint: "Count miles covered by charging at home. The starting figure allows for charging losses." }),
  item("vacuum", "Vacuum cleaner", "Other", "minutes", 750, 10),
  item("hair", "Hairdryer", "Other", "minutes", 1800, 8),
  item("fan", "Fan", "Other", "hours", 40, 4),
  item("ac", "Portable air conditioner", "Other", "hours", 1000, 3),
  item("pond", "Pond or aquarium pump", "Other", "hours", 35, 24),
  item("custom", "Something else", "Other", "hours", 100, 1, { hint: "Give it a name and enter the watts on its label, or choose a similar appliance from the list." }),
];
export const catalogue = Object.fromEntries(appliances.map(a => [a.id, a])) as Record<string, Appliance>;
export const ratingLabels: Record<Model, string> = {
  hours: "Power in watts", minutes: "Power in watts", showers: "Power in watts",
  cycles: "kWh per cycle", annual: "kWh per year", litres: "kWh per litre boiled",
  miles: "kWh per mile at the socket", daily: "kWh per active day",
};
export const useLabels: Record<Model, string> = {
  hours: "Hours per day", minutes: "Minutes per day", cycles: "Loads per week", annual: "",
  litres: "Boils per day", showers: "Showers per day", miles: "Miles per week", daily: "",
};

export type Entry = { key: string; id: string; name: string; room?: string; isCustom?: boolean; quantity: number; use: number; detail: number; rating: number; weeks: number; night: number };
export function makeEntry(id: string, key: string): Entry {
  const a = catalogue[id];
  return { key, id, name: a.name, quantity: a.quantity ?? 1, use: a.use, detail: a.detail ?? 1, rating: a.rating, weeks: 52, night: 0 };
}
