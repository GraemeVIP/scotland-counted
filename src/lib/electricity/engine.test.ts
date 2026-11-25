import { addPreset, buildRooms, groupCostsByRoom } from "./rooms.ts";
import test from "node:test";
import assert from "node:assert/strict";
import { appliances, makeEntry } from "./appliances.ts";
import { dailyKwh, dailyCost, estimate, savingIdea } from "./engine.ts";
import { activeOctopusRate, capSnapshot, parseCap, quarter, supplierCard } from "./rates.ts";

const tariff = { unit: 25, standing: 60 };
const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-8, a + " differs from " + b);
test("catalogue has unique IDs and every default gives a finite annual estimate", () => {
  assert.equal(new Set(appliances.map(a => a.id)).size, appliances.length);
  for (const a of appliances) assert.ok(dailyKwh(makeEntry(a.id, a.id)) > 0);
});
test("LED and kettle examples cost pennies and scale with quantity, time and water", () => {
  const lamp = { ...makeEntry("led", "1"), quantity: 1 };
  close(dailyCost(lamp, tariff), 0.008);
  close(dailyCost({ ...lamp, quantity: 10 }, tariff), 0.08);
  const kettle = { ...makeEntry("kettle", "2"), use: 1, detail: 0.25 };
  close(dailyKwh(kettle), 0.0275);
  close(dailyCost({ ...makeEntry("custom", "3"), rating: 3000, use: 3 / 60 }, tariff), 0.0375);
});
test("label energy, sessions, continuous loads and seasonal use honour their units", () => {
  close(dailyKwh(makeEntry("washer", "1")) * 7, 4 * 0.65);
  close(dailyKwh(makeEntry("fridgefreezer", "2")) * 365, 250);
  close(dailyKwh(makeEntry("shower", "3")), 8.5 * 16 / 60);
  close(dailyKwh(makeEntry("microwave", "4")), 1.25 / 10);
  close(dailyKwh(makeEntry("oven", "4b")), 0.75);
  close(dailyKwh(makeEntry("ev", "5")) * 7, 32);
  close(dailyKwh({ ...makeEntry("heatpump", "6"), weeks: 26 }), 4);
});
test("split prices apply per item and the standing charge is counted once", () => {
  const entries = [makeEntry("fridge", "a"), { ...makeEntry("router", "b"), night: 75 }];
  const rates = { unit: 30, night: 10, standing: 55 };
  const w = estimate(entries, rates, "Week");
  close(w.energy, 7 * (130 / 365 * 0.3 + 0.24 * 0.15));
  close(w.standing, 3.85);
  close(w.total, w.energy + w.standing);
  close(estimate(entries, rates, "Month").total * 12, estimate(entries, rates, "Year").total);
  close(dailyCost(entries[1], tariff), 0.06);
});
test("savings are attainable against the selected baseline and exclude fixed charges", () => {
  const dryer = makeEntry("dryer", "d");
  close(savingIdea(dryer, tariff)!.annual, 3.8 * 365 / 7 * 0.25);
  assert.equal(savingIdea({ ...dryer, use: 0 }, tariff), null);
  assert.equal(savingIdea(makeEntry("fridge", "f"), tariff), null);
  assert.equal(savingIdea({ ...makeEntry("kettle", "k"), detail: 0.25 }, tariff), null);
  close(savingIdea({ ...makeEntry("ev", "ev"), night: 50 }, { ...tariff, night: 5 })!.annual, 32 / 7 * 365 * .10);
});
test("prices change on the UK quarter boundary and expired supplier cards are never reused", () => {
  assert.equal(quarter(new Date("2026-09-30T23:00:00Z")), "October to December 2026");
  assert.equal(quarter(new Date("2026-12-31T23:59:59Z")), "October to December 2026");
  assert.equal(capSnapshot("north", "debit", quarter(new Date("2027-01-01T00:00:00Z")))?.unit, 32.40);
  assert.equal(capSnapshot("south", "debit", "April to June 2027"), null);
  assert.equal(supplierCard("EDF", "north", "debit", "January to March 2027"), null);
  assert.equal(supplierCard("Sainsbury’s Energy", "south", "prepay", "October to December 2026"), null);
});
test("regional table parser selects matching quarterly electricity and payment columns", () => {
  const chart = { options: { title: { text: "Electricity paid by Direct Debit single rate" } }, data: { value: [
    ["Region", "Unit rate  October to December 2026", "Daily standing charge October to December 2026", "Unit rate January to March 2027"],
    ["Southern Scotland", "26.11 pence per kWh", "61.41 pence per day", "32.57 pence per kWh"],
  ] } };
  const script = "var options = " + JSON.stringify(chart) + ";";
  assert.equal(parseCap(script, "south", "debit", "October to December 2026")?.standing, 61.41);
  assert.equal(parseCap(script, "south", "credit", "October to December 2026"), null);
  assert.equal(parseCap(script, "north", "debit", "October to December 2026"), null);
  assert.equal(parseCap(script, "south", "debit", "January to March 2027"), null);
});
test("Octopus filters by payment method and active interval, never a future rate", () => {
  const now = new Date("2026-11-25T12:00Z");
  const row = { value_inc_vat: 26, valid_from: "2026-10-01", valid_to: null, payment_method: "DIRECT_DEBIT" };
  const rows = [{ ...row, valid_from: "2027-01-01", value_inc_vat: 33 }, { ...row, valid_to: now.toISOString(), value_inc_vat: 25 }, row, { ...row, value_inc_vat: 28, payment_method: "NON_DIRECT_DEBIT" }];
  assert.equal(activeOctopusRate(rows, "debit", now)?.value_inc_vat, 26);
  assert.equal(activeOctopusRate(rows, "credit", now)?.value_inc_vat, 28);
  assert.equal(activeOctopusRate(rows, "prepay", now), null);
});

test("room quantities stay separate from named appliances using the same preset", () => {
  const kitchen = { ...makeEntry("led", "k"), room: "Kitchen" };
  const bedroom = { ...makeEntry("led", "b"), room: "Bedroom" };
  const lamp = { ...bedroom, key: "reading", name: "Reading lamp", quantity: 1, isCustom: true };
  let entries = addPreset([lamp], kitchen);
  entries = addPreset(entries, bedroom);
  entries = addPreset(entries, { ...bedroom, key: "second bulb" });
  assert.deepEqual(entries.map(e => [e.key, e.quantity]), [["reading", 1], ["k", 1], ["b", 2]]);
  const totals = estimate(entries, tariff, "Week");
  const rooms = groupCostsByRoom(totals.rows);
  close(rooms.reduce((sum, room) => sum + room.cost, 0), totals.energy);
  close(rooms.find(r => r.name === "Bedroom")!.cost, rooms.find(r => r.name === "Kitchen")!.cost * 3);
});

test("property type builds only the rooms that match the home", () => {
  const flat = buildRooms({ property: "flat", bedrooms: 1, extras: [] }).map(r => r.name);
  assert.deepEqual(flat, ["Kitchen", "Living room", "Bedroom", "Bathroom", "Hall", "Whole home"]);
  const detached = buildRooms({ property: "detached", bedrooms: 3, extras: ["utility", "office", "garage"] }).map(r => r.name);
  assert.deepEqual(detached, [
    "Kitchen", "Living room", "Main bedroom", "Bedroom 2", "Bedroom 3", "Bathroom",
    "Utility room", "Home office", "Garage or garden", "Hall and landing", "Whole home",
  ]);
});
