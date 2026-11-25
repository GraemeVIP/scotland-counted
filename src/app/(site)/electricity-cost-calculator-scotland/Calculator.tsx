"use client";

import { useRef, useState } from "react";
import { type Entry } from "@/lib/electricity/appliances";
import { number, smallCost, type Tariff } from "@/lib/electricity/engine";
import { initialRate, RateStep, usePrice } from "./RateStep";
import { Routines } from "./Appliances";
import { RoomPicker } from "./RoomPicker";
import { Inventory } from "./Inventory";
import { addPreset, buildRooms, type HomeLayout, type Room } from "@/lib/electricity/rooms";
import { Results } from "./Results";
import { Icon } from "./Icons";
import s from "./electricity.module.css";

const steps = ["Your rate", "Appliances", "Your routine", "Results"];
const titles = ["What do you pay for electricity?", "What’s in your home?", "What does a usual week look like?", "Your electricity costs"];
const intros = ["Pick a rate for your part of Scotland. Or type in the rates from your bill.", "Choose your home type first so we only show the rooms you have.", "Start with our figures and change what you know. Open each item to set how often you use it.", "See your biggest costs. Then tick a few small changes to see what you could save."];

function Snapshot({ tariff }: { tariff: Tariff | null }) {
  const rate = tariff?.unit ?? 25;
  return <aside className={s.aside}>
    <div className={s.insight}><span className={s.asideLabel}><Icon name="bulb"/> In perspective</span><h3>A light on all night. Or one kettle boil?</h3>
      <div className={s.example}><Icon name="bulb"/><span>One 8 W LED bulb<small>On for four hours</small></span><b>{smallCost(0.032 * rate / 100)}</b></div>
      <div className={s.example}><Icon name="kettle"/><span>One 3 kW kettle<small>Boiling for three minutes</small></span><b>{smallCost(0.15 * rate / 100)}</b></div>
      <p>A kettle uses a lot of power for a few minutes. One LED bulb uses very little, even all night.</p><small>At {tariff ? "your " : "an example "}rate of {number(rate, 4)}p per kWh{tariff?.night !== undefined ? " in the daytime" : ""}.</small>
    </div>
  </aside>;
}

export default function Calculator() {
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [form, setForm] = useState(initialRate);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [lastAddition, setLastAddition] = useState<Entry | null>(null);
  const [layout, setLayoutState] = useState<HomeLayout | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const rooms = layout ? buildRooms(layout) : [];
  function applyLayout(next: HomeLayout) {
    const nextRooms = buildRooms(next);
    setLayoutState(next);
    setRoom(current => (current && nextRooms.find(r => r.name === current.name)) ?? nextRooms[0]);
  }
  const header = useRef<HTMLHeadingElement>(null);
  const fields = useRef<HTMLFormElement>(null);
  const nextKey = useRef(1);
  const price = usePrice(form);
  const { tariff } = price;
  const allowed = (n: number) => n === 0 || (Boolean(tariff) && (n === 1 || entries.length > 0));
  function go(to: number) {
    if (!allowed(to) || (to > step && fields.current && !fields.current.reportValidity())) return;
    setStep(to);
    setReached(Math.max(reached, to));
    requestAnimationFrame(() => { header.current?.focus({ preventScroll: true }); header.current?.scrollIntoView({ block: "start" }); });
  }
  function addItem(item: Entry) {
    const entry = { ...item, key: String(nextKey.current++) };
    setLastAddition(entry);
    setEntries(rows => entry.isCustom ? [...rows, entry] : addPreset(rows, entry));
  }
  function removeItem(key: string) {
    setEntries(rows => rows.filter(e => e.key !== key));
  }
  function changeItem(key: string, values: Partial<Entry>) {
    setEntries(rows => rows.map(e => e.key === key ? { ...e, ...values } : e));
  }
  const editingList = (step === 1 || step === 2) && tariff;
  const fullWidth = step === 3;
  const rateLabel = form.mode === "manual" ? "Prices from your bill" : price.quote?.title ?? "";
  return <section className={s.workspace} id="calculator" aria-label="Electricity cost calculator">
    <nav className={s.progress} aria-label="Calculator steps">{steps.map((label, i) => <button type="button" key={label} aria-current={step === i ? "step" : undefined} disabled={i > reached || !allowed(i)} onClick={() => go(i)}><span>{i < step ? <Icon name="check" size={17}/> : i + 1}</span>{label}</button>)}</nav>
    <div className={s.columns} data-inventory={Boolean(editingList)} data-full={fullWidth}>
      {editingList && <Inventory entries={entries} tariff={tariff} lastAddition={lastAddition} changeQuantity={(key, quantity) => changeItem(key, { quantity })} remove={removeItem}/>}
      <div className={s.panel}>
      <span className={s.stepLabel}>Step {step + 1} of 4</span>
      <h2 ref={header} tabIndex={-1}>{titles[step]}</h2><p className={s.intro}>{intros[step]}</p>
      {step === 3 && tariff && entries.length > 0 ? <Results entries={entries} tariff={tariff} rateLabel={rateLabel + " · " + number(tariff.unit, 4) + "p per kWh" + (tariff.night !== undefined ? " by day, " + number(tariff.night, 4) + "p by night" : "") + " · " + number(tariff.standing, 4) + "p per day"} edit={() => go(2)}/> :
      step === 1 && tariff ? <RoomPicker entries={entries} tariff={tariff} layout={layout} rooms={rooms} room={room}
        setLayout={applyLayout} chooseRoom={setRoom} add={addItem}
        back={() => go(0)} next={() => go(2)}/> :
      <form ref={fields} onSubmit={e => { e.preventDefault(); go(step + 1); }}>
        {step === 0 && <RateStep form={form} change={v => setForm(f => ({ ...f, ...v }))} price={price}/>}
        {step === 2 && tariff && <Routines entries={entries} tariff={tariff} change={changeItem} duplicate={e => setEntries([...entries, { ...e, key: String(nextKey.current++), name: e.name + " (extra)" }])} remove={removeItem}/>}
        <div className={s.actions}>{step > 0 && <button type="button" className={s.back} onClick={() => go(step - 1)}>Back</button>}
          <button type="submit" className={s.primary} disabled={!allowed(step + 1)}>{["Choose my appliances", "Set my routine", "See my results"][step]}<Icon name="arrow" size={18}/></button></div>
      </form>}
    </div>{step === 0 && <Snapshot tariff={tariff}/>}</div>
  </section>;
}
