import { useEffect, useRef, useState } from "react";
import { catalogue, type Entry } from "@/lib/electricity/appliances";
import { entryRoom, groupCostsByRoom } from "@/lib/electricity/rooms";
import { dailyCost, money, type Tariff } from "@/lib/electricity/engine";
import { Icon } from "./Icons";
import s from "./electricity.module.css";

type Props = { entries: Entry[]; tariff: Tariff; lastAddition: Entry | null; changeQuantity: (key: string, quantity: number) => void; remove: (key: string) => void };

export function Inventory({ entries, tariff, lastAddition, changeQuantity, remove }: Props) {
  const [expanded, setExpanded] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const newest = useRef<HTMLLIElement>(null);
  const added = lastAddition && entries.find(e => lastAddition.isCustom
    ? e.key === lastAddition.key
    : !e.isCustom && e.id === lastAddition.id && entryRoom(e) === lastAddition.room);
  useEffect(() => {
    const container = list.current;
    if (!container || !newest.current || !container.clientHeight) return;
    const bounds = container.getBoundingClientRect();
    const item = newest.current.getBoundingClientRect();
    if (item.bottom > bounds.bottom) container.scrollTop += item.bottom - bounds.bottom;
    else if (item.top < bounds.top) container.scrollTop -= bounds.top - item.top;
  }, [lastAddition, expanded]);
  const rooms = groupCostsByRoom(entries.map(entry => ({ entry, cost: dailyCost(entry, tariff) * 7 })));
  const total = rooms.reduce((sum, r) => sum + r.cost, 0);
  const count = entries.reduce((sum, e) => sum + e.quantity, 0);
  return <aside className={s.inventory} aria-label="Your appliance list">
    <div className={s.inventoryHead}>
      <div><h3><Icon name="house"/> Your appliance list</h3><span>{count} {count === 1 ? "item" : "items"} · {money(total)} per week</span></div>
      <button type="button" className={s.inventoryToggle} aria-controls="selected-appliances" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? "Hide list" : "View list"}</button>
    </div>
    <div id="selected-appliances" className={s.inventoryBody} data-expanded={expanded}>
      <div className={s.inventoryRooms} ref={list}>{rooms.length ? rooms.map(room => <section key={room.name} aria-label={room.name + " appliance list"}>
        <h4>{room.name}<span>{money(room.cost)}</span></h4>
        <ul>{room.rows.map(({ entry: e, cost }) => {
          const name = e.name || catalogue[e.id].name;
          const which = name + " in " + room.name;
          return <li key={e.key} ref={e.key === added?.key ? newest : undefined}>
            <div className={s.itemLine}><strong>{name}</strong><span>{money(cost)}</span></div>
            <div className={s.itemTools}>
              <div className={s.quantity}>
                <button type="button" aria-label={"Decrease quantity of " + which} disabled={e.quantity <= 1} onClick={() => changeQuantity(e.key, e.quantity - 1)}>−</button>
                <span aria-label={"Quantity " + e.quantity}>{e.quantity}</span>
                <button type="button" aria-label={"Increase quantity of " + which} disabled={e.quantity >= 1000} onClick={() => changeQuantity(e.key, e.quantity + 1)}>+</button>
              </div>
              <button type="button" className={s.deleteItem} aria-label={"Remove " + which} onClick={() => remove(e.key)}>Remove</button>
            </div>
          </li>;
        })}</ul>
      </section>) : <p className={s.emptyList}>Add your first appliance to see its name, room and weekly cost here.</p>}</div>
      <div className={s.inventoryFoot}><span>Appliances <b>{money(total)}</b></span><span>Standing charge <b>{money(tariff.standing * 7 / 100)}</b></span><strong>Weekly total <b>{money(total + tariff.standing * 7 / 100)}</b></strong></div>
    </div>
  </aside>;
}
