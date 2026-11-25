import type { Entry } from "./appliances.ts";

export const roomSuggestions = {
  "Kitchen": ["kettle", "fridgefreezer", "oven", "hob", "microwave", "dishwasher", "washer", "airfryer", "led", "toaster", "coffee", "induction"],
  "Living room": ["tv", "led", "console", "box", "router", "heater", "laptop", "standby", "halogen"],
  "Bedroom": ["led", "phone", "tv", "blanket", "laptop", "fan", "hair", "heater"],
  "Bathroom": ["shower", "towel", "led", "hair", "heater"],
  "Utility room": ["washer", "dryer", "pumpdryer", "washerdryer", "airer", "iron", "freezer", "dehumidifier", "led"],
  "Home office": ["laptop", "monitor", "desktop", "gaming", "router", "phone", "led", "heater"],
  "Hall and landing": ["led", "halogen", "oldbulb", "router", "radiator", "storage"],
  "Garage and garden": ["ev", "freezer", "pond", "led", "heater", "dehumidifier"],
  "Whole home": ["heatpump", "immersion", "storage", "radiator", "vacuum", "ac", "standby"],
};
export type RoomType = keyof typeof roomSuggestions;
export type Room = { name: string; type: RoomType };
export const startingRooms: Room[] = (Object.keys(roomSuggestions) as RoomType[]).map(type => ({ name: type, type }));

export type PropertyType = "flat" | "semi" | "detached" | "bungalow";
export type ExtraSpace = "utility" | "office" | "garage";
export type HomeLayout = { property: PropertyType; bedrooms: 1 | 2 | 3 | 4; extras: ExtraSpace[] };

export const propertyOptions: {
  id: PropertyType;
  label: string;
  hint: string;
  defaultBedrooms: 1 | 2 | 3 | 4;
  defaultExtras: ExtraSpace[];
}[] = [
  { id: "flat", label: "Flat", hint: "Tenement, modern flat or studio", defaultBedrooms: 1, defaultExtras: [] },
  { id: "semi", label: "Terraced or semi", hint: "Two floors, joined to a neighbour", defaultBedrooms: 3, defaultExtras: [] },
  { id: "detached", label: "Detached house", hint: "Standalone house with outdoor space", defaultBedrooms: 4, defaultExtras: ["utility", "garage"] },
  { id: "bungalow", label: "Bungalow", hint: "Single-storey house", defaultBedrooms: 2, defaultExtras: ["garage"] },
];

export const extraSpaceOptions: { id: ExtraSpace; label: string; type: RoomType }[] = [
  { id: "utility", label: "Utility room", type: "Utility room" },
  { id: "office", label: "Home office", type: "Home office" },
  { id: "garage", label: "Garage or garden", type: "Garage and garden" },
];

export function buildRooms(layout: HomeLayout): Room[] {
  const bedrooms: Room[] = layout.bedrooms === 1
    ? [{ name: "Bedroom", type: "Bedroom" }]
    : Array.from({ length: layout.bedrooms }, (_, i) => ({
        name: i === 0 ? "Main bedroom" : `Bedroom ${i + 1}`,
        type: "Bedroom" as const,
      }));

  const hallName = layout.property === "flat" || layout.property === "bungalow" ? "Hall" : "Hall and landing";
  const rooms: Room[] = [
    { name: "Kitchen", type: "Kitchen" },
    { name: "Living room", type: "Living room" },
    ...bedrooms,
    { name: "Bathroom", type: "Bathroom" },
  ];

  for (const extra of extraSpaceOptions) {
    if (layout.extras.includes(extra.id)) {
      rooms.push({ name: extra.label, type: extra.type });
    }
  }

  rooms.push({ name: hallName, type: "Hall and landing" });
  rooms.push({ name: "Whole home", type: "Whole home" });
  return rooms;
}

export function layoutSummary(layout: HomeLayout) {
  const prop = propertyOptions.find(p => p.id === layout.property)?.label ?? "Home";
  const bed = layout.bedrooms === 4 ? "4+ bed" : `${layout.bedrooms} bed`;
  return `${bed} ${prop.toLowerCase()}`;
}

export function entryRoom(entry: Entry) {
  return entry.room || "Whole home";
}

// A second press adds one more in this room. Separately named items and other
// rooms retain their own routine even when they use the same appliance model.
export function addPreset(entries: Entry[], item: Entry) {
  const existing = entries.find(e => e.id === item.id && !e.isCustom && entryRoom(e) === entryRoom(item));
  if (!existing) return [...entries, { ...item, quantity: 1 }];
  return entries.map(e => e.key === existing.key ? { ...e, quantity: Math.min(1000, e.quantity + 1) } : e);
}

export function groupCostsByRoom(rows: { entry: Entry; cost: number }[]) {
  const result = new Map<string, { name: string; cost: number; rows: typeof rows }>();
  for (const row of rows) {
    const name = entryRoom(row.entry);
    const room = result.get(name) ?? { name, cost: 0, rows: [] };
    room.rows.push(row);
    room.cost += row.cost;
    result.set(name, room);
  }
  return [...result.values()];
}
