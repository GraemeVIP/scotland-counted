import { useState } from "react";
import { catalogue, ratingLabels, useLabels, type Entry } from "@/lib/electricity/appliances";
import { dailyCost, estimate, money, number, periods, savingIdea, type Period, type Tariff } from "@/lib/electricity/engine";
import { entryRoom, groupCostsByRoom } from "@/lib/electricity/rooms";
import { ApplianceIcon } from "./Appliances";
import { Icon } from "./Icons";
import s from "./electricity.module.css";

function WhatIf({ entry, tariff }: { entry: Entry; tariff: Tariff }) {
  const a = catalogue[entry.id];
  const key = a.model === "litres" || a.model === "showers" ? "detail" : a.model === "annual" || a.model === "daily" ? "rating" : "use";
  const label = key === "detail" ? (a.model === "litres" ? "Litres per boil" : "Minutes per shower") : key === "rating" ? ratingLabels[a.model] : useLabels[a.model];
  const [value, setValue] = useState(String(entry[key]));
  const n = Number(value);
  const max = a.model === "hours" ? 24 : a.model === "minutes" ? 1440 : Infinity;
  const valid = value.trim() !== "" && Number.isFinite(n) && n >= 0 && n <= max;
  const diff = valid ? (dailyCost(entry, tariff) - dailyCost({ ...entry, [key]: n }, tariff)) * 365 : null;
  return (
    <>
      <label>
        {label} in your comparison
        <input
          type="number"
          min="0"
          max={max === Infinity ? undefined : max}
          step="any"
          inputMode="decimal"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </label>
      <p className={s.note}>
        Your current figure is {number(entry[key])}. {key === "rating" && "Try the figure from a different appliance’s energy label."}
      </p>
      <p className={s.scenario} aria-live="polite">
        {diff === null
          ? "Enter a valid amount to compare costs."
          : Math.abs(diff) < 0.005
            ? "Change the figure to see the difference."
            : (
              <>
                <strong>{money(Math.abs(diff))} {diff > 0 ? "less" : "more"} a year</strong> at your chosen rate.
              </>
            )}
      </p>
    </>
  );
}

export function Results({ entries, tariff, rateLabel, edit }: { entries: Entry[]; tariff: Tariff; rateLabel: string; edit: () => void }) {
  const [period, setPeriod] = useState<Period>("Week");
  const [view, setView] = useState<"rooms" | "top">(entries.length > 6 ? "rooms" : "top");
  const [showAllItems, setShowAllItems] = useState(false);
  const [showAllIdeas, setShowAllIdeas] = useState(false);
  const [chosen, setChosen] = useState<string[]>([]);
  const [compare, setCompare] = useState(entries[0].key);
  const [billUse, setBillUse] = useState("");

  const result = estimate(entries, tariff, period);
  const annual = estimate(entries, tariff, "Year");
  const byRoom = groupCostsByRoom(result.rows).sort((a, b) => b.cost - a.cost);
  const topThree = result.rows.slice(0, 3);
  const visibleRows = showAllItems ? result.rows : result.rows.slice(0, 5);

  const ideas = entries.map(e => savingIdea(e, tariff)).filter(i => i !== null).sort((a, b) => b.annual - a.annual);
  const visibleIdeas = showAllIdeas ? ideas : ideas.slice(0, 5);
  const saved = ideas.reduce((sum, i) => sum + (chosen.includes(i.key) ? i.annual : 0), 0);

  const target = entries.find(e => e.key === compare) ?? entries[0];
  const yearUse = Number(billUse);
  const billGap = yearUse - annual.kwh;
  const maxItemCost = result.rows[0]?.cost || 0;
  const maxRoomCost = byRoom[0]?.cost || 0;

  return (
    <div className={s.results}>
      <div className={s.periods} aria-label="Show costs per">
        {(Object.keys(periods) as Period[]).map(p => (
          <button type="button" key={p} aria-pressed={period === p} onClick={() => setPeriod(p)}>
            {p}
          </button>
        ))}
      </div>

      <div className={s.resultsHero} aria-live="polite">
        <div className={s.totalMain}>
          <span>Estimated cost per {period.toLowerCase()}</span>
          <strong>{money(result.total)}</strong>
          <div className={s.totalStats}>
            <span>Appliances <b>{money(result.energy)}</b></span>
            <span>Standing charge <b>{money(result.standing)}</b></span>
            <span>Power used <b>{number(result.kwh)} kWh</b></span>
          </div>
        </div>

        <div className={s.topThree}>
          <span className={s.topThreeTitle}>Biggest costs per {period.toLowerCase()}</span>
          <ul>
            {topThree.map(({ entry, cost }) => (
              <li key={entry.key}>
                <span>
                  <strong>{entry.name}</strong>
                  <small>{entryRoom(entry)}</small>
                </span>
                <b>{money(cost)}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className={s.note}>
        {rateLabel}. Includes the appliances you added and one standing charge.
      </p>

      <section className={s.breakdownSection}>
        <div className={s.breakdownHead}>
          <div>
            <h3>Where your electricity goes</h3>
            <p className={s.note}>
              {result.rows.length} {result.rows.length === 1 ? "appliance" : "appliances"} across {byRoom.length} {byRoom.length === 1 ? "room" : "rooms"} ({number(result.kwh)} kWh per {period.toLowerCase()}).
            </p>
          </div>
          <div className={s.viewToggle} role="group" aria-label="Breakdown view">
            <button type="button" aria-pressed={view === "rooms"} onClick={() => setView("rooms")}>
              By room
            </button>
            <button type="button" aria-pressed={view === "top"} onClick={() => setView("top")}>
              Top items
            </button>
          </div>
        </div>

        {view === "rooms" ? (
          <div className={s.roomCards}>
            {byRoom.map((room, idx) => {
              const share = result.energy ? (room.cost / result.energy) * 100 : 0;
              return (
                <details className={s.roomCard} key={room.name} open={idx === 0 && byRoom.length <= 4 ? true : undefined}>
                  <summary>
                    <div className={s.roomCardTop}>
                      <div>
                        <strong>{room.name}</strong>
                        <small>
                          {room.rows.length} {room.rows.length === 1 ? "item" : "items"} · {number(share, 0)}% of appliance cost
                        </small>
                      </div>
                      <div className={s.roomCardCost}>
                        <b>{money(room.cost)}</b>
                        <span className={s.chevron} aria-hidden="true">⌄</span>
                      </div>
                    </div>
                    <div className={s.bar}>
                      <i style={{ width: (maxRoomCost ? (room.cost / maxRoomCost) * 100 : 0) + "%" }} />
                    </div>
                  </summary>
                  <ul className={s.roomCardList}>
                    {room.rows.map(({ entry, cost }) => (
                      <li key={entry.key}>
                        <ApplianceIcon id={entry.id} />
                        <div className={s.roomCardItem}>
                          <strong>{entry.name}</strong>
                          <small>
                            {entry.quantity > 1 ? `Qty ${entry.quantity} · ` : ""}
                            {number(result.energy ? (cost / result.energy) * 100 : 0, 1)}% of total
                          </small>
                        </div>
                        <b>{money(cost)}</b>
                      </li>
                    ))}
                  </ul>
                </details>
              );
            })}
          </div>
        ) : (
          <>
            <ol className={s.ranking}>
              {visibleRows.map(({ entry, cost, kwh }) => (
                <li key={entry.key}>
                  <ApplianceIcon id={entry.id} />
                  <div>
                    <div className={s.rankName}>
                      <strong>{entry.name}</strong>
                      <b>{money(cost)}</b>
                    </div>
                    <div className={s.bar}>
                      <i style={{ width: (maxItemCost ? (cost / maxItemCost) * 100 : 0) + "%" }} />
                    </div>
                    <small>
                      {entryRoom(entry)} · Qty {entry.quantity} · {number(kwh)} kWh · {number(result.energy ? (cost / result.energy) * 100 : 0, 1)}% of appliance costs
                    </small>
                  </div>
                </li>
              ))}
            </ol>
            {result.rows.length > 5 && (
              <button
                type="button"
                className={s.expandBtn}
                onClick={() => setShowAllItems(v => !v)}
              >
                {showAllItems ? "Show top 5 only" : `Show all ${result.rows.length} appliances`}
              </button>
            )}
          </>
        )}
      </section>

      <div className={s.resultsTools}>
        {ideas.length > 0 && (
          <section className={s.savings}>
            <div className={s.sectionIcon}>
              <Icon name="leaf" />
              <h3>Changes worth trying</h3>
            </div>
            <p>Tick the changes that would work for you. Each figure uses your own routine and rate.</p>
            {visibleIdeas.map(i => (
              <label className={s.idea} key={i.key}>
                <input
                  type="checkbox"
                  checked={chosen.includes(i.key)}
                  onChange={() => setChosen(chosen.includes(i.key) ? chosen.filter(k => k !== i.key) : [...chosen, i.key])}
                />
                <span>
                  <small>{i.name} · {i.room}</small>
                  <strong>{i.label}</strong>
                </span>
                <b>
                  {money(i.annual)}
                  <small>per year</small>
                </b>
              </label>
            ))}
            {ideas.length > 5 && (
              <button
                type="button"
                className={s.linkBtn}
                onClick={() => setShowAllIdeas(v => !v)}
              >
                {showAllIdeas ? "Show top 5 ideas" : `Show all ${ideas.length} saving ideas`}
              </button>
            )}
            <div className={s.savingTotal} aria-live="polite">
              <span>Potential yearly saving</span>
              <strong>{money(saved)}</strong>
            </div>
            {saved > 0 && (
              <p className={s.note}>
                That would take your yearly estimate from {money(annual.total)} to {money(annual.total - saved)}. Your standing charge stays the same.
              </p>
            )}
          </section>
        )}

        <div className={s.toolsStack}>
          <section className={s.compare}>
            <div className={s.sectionIcon}>
              <Icon name="sliders" />
              <h3>Try your own change</h3>
            </div>
            <p>See what happens if you change one habit or try a different appliance. Your original estimate stays above.</p>
            <label>
              Which appliance?
              <select value={target.key} onChange={e => setCompare(e.target.value)}>
                {entries.map((e, i) => (
                  <option key={e.key} value={e.key}>
                    {entryRoom(e)} · {e.name}{entries.filter(x => x.name === e.name && entryRoom(x) === entryRoom(e)).length > 1 ? " (group " + (i + 1) + ")" : ""}
                  </option>
                ))}
              </select>
            </label>
            <WhatIf key={target.key} entry={target} tariff={tariff} />
          </section>

          <section className={s.billCheck}>
            <details>
              <summary>Compare with your annual electricity bill</summary>
              <p className={s.note}>
                Look for estimated annual electricity usage in kWh on your bill. Compare this if your list covers a typical year and you buy all this electricity from the grid.
              </p>
              <label>
                Annual electricity use on your bill (kWh)
                <input type="number" min="1" step="any" value={billUse} onChange={e => setBillUse(e.target.value)} />
              </label>
              {Number.isFinite(yearUse) && yearUse > 0 && (
                <p className={s.note} aria-live="polite">
                  Your list accounts for {number(annual.kwh, 0)} of {number(yearUse, 0)} kWh.{" "}
                  {billGap >= 0
                    ? number(billGap, 0) + " kWh is still to account for."
                    : "Your estimate is " + number(-billGap, 0) + " kWh above your bill. Check your hours, appliance ratings and weeks of use."}
                </p>
              )}
            </details>
          </section>
        </div>
      </div>

      <div className={s.actions}>
        <button type="button" className={s.primary} onClick={edit}>
          Adjust my routine <Icon name="arrow" size={18} />
        </button>
        <button type="button" className={s.linkBtn} onClick={() => window.print()}>
          Print my results
        </button>
      </div>
    </div>
  );
}
