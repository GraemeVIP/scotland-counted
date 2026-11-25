import { useEffect, useRef, useState, type ReactNode } from "react";
import { appliances, catalogue, makeEntry, ratingLabels, useLabels, type Entry } from "@/lib/electricity/appliances";
import {
  buildRooms,
  entryRoom,
  extraSpaceOptions,
  layoutSummary,
  propertyOptions,
  roomSuggestions,
  type ExtraSpace,
  type HomeLayout,
  type PropertyType,
  type Room,
} from "@/lib/electricity/rooms";
import { dailyCost, money, number, type Tariff } from "@/lib/electricity/engine";
import { ApplianceIcon } from "./Appliances";
import { Icon } from "./Icons";
import s from "./electricity.module.css";

const presets = appliances.filter(a => a.id !== "custom");
const alphabetical = [...presets].sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
const bedroomChoices = [1, 2, 3, 4] as const;

function Dialog({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => { dialog?.close(); };
  }, []);
  return <dialog ref={ref} className={s.editorDialog} aria-labelledby="appliance-dialog-title"
    onClick={event => { if (event.target === ref.current) close(); }}
    onCancel={event => { event.preventDefault(); close(); }}>
    <h3 id="appliance-dialog-title">{title}</h3>
    {children}
  </dialog>;
}

function CustomAppliance({ room, tariff, save, close }: { room: string; tariff: Tariff; save: (e: Entry) => void; close: () => void }) {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [watts, setWatts] = useState("");
  const [usage, setUsage] = useState("");
  const [detail, setDetail] = useState("");
  const a = catalogue[model];
  const manual = model === "custom";
  const draft = a ? { ...makeEntry(model, ""), name: name.trim(), room, quantity: 1, isCustom: true,
    rating: manual ? Number(watts) : a.rating, use: Number(usage), detail: Number(detail) } : null;
  const showUse = a && Boolean(useLabels[a.model]);
  const ready = draft && (!manual || (watts !== "" && Number(watts) > 0)) && (!showUse || usage !== "") && detail !== "";
  return <Dialog title="Add your own appliance" close={close}>
    <form onSubmit={event => { event.preventDefault(); if (ready && draft.name) save(draft); }}>
      <p className={s.note}>Adding to <strong>{room}</strong>. Give it a name, then pick a similar appliance or use the watts on its label.</p>
      <label>Appliance name<input autoFocus required maxLength={70} pattern={".*\\S.*"} placeholder="e.g. Fish tank light" value={name} onChange={e => setName(e.target.value)}/></label>
      <label>What can we use to estimate its cost?
        <select required value={model} onChange={e => {
          const id = e.target.value;
          setModel(id);
          setUsage(id ? String(catalogue[id].use) : "");
          setDetail(id ? String(catalogue[id].detail ?? 1) : "");
        }}>
          <option value="">Choose an option</option>
          <option value="custom">I know the watts</option>
          <optgroup label="Use a similar appliance">{alphabetical.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</optgroup>
        </select>
      </label>
      {model && <div className={s.fieldGrid}>
        {manual && <label>Power in watts<input required type="number" min="0.01" step="any" value={watts} onChange={e => setWatts(e.target.value)}/></label>}
        {showUse && <label>{useLabels[a.model]}<input required type="number" min="0" max={a.model === "hours" ? 24 : a.model === "minutes" ? 1440 : undefined} step="any" value={usage} onChange={e => setUsage(e.target.value)}/></label>}
        {(a.model === "litres" || a.model === "showers") && <label>{a.model === "litres" ? "Litres in each boil" : "Minutes per shower"}<input required type="number" min="0.01" step="any" value={detail} onChange={e => setDetail(e.target.value)}/></label>}
      </div>}
      {a && !manual && <p className={s.note}>Based on {a.name.toLowerCase()} ({ratingLabels[a.model].toLowerCase()}, {number(a.rating)}).</p>}
      {ready && <p className={s.customEstimate}>Estimated weekly cost <strong>{money(dailyCost(draft, tariff) * 7)}</strong></p>}
      <div className={s.actions}><button className={s.primary} type="submit">Add to {room}<Icon name="plus" size={17}/></button><button type="button" className={s.linkBtn} onClick={close}>Cancel</button></div>
    </form>
  </Dialog>;
}

function HomeSetup({
  initial,
  confirm,
  back,
  cancel,
}: {
  initial: HomeLayout | null;
  confirm: (layout: HomeLayout) => void;
  back: () => void;
  cancel?: () => void;
}) {
  const [property, setProperty] = useState<PropertyType | null>(initial?.property ?? null);
  const [bedrooms, setBedrooms] = useState<1 | 2 | 3 | 4>(initial?.bedrooms ?? 2);
  const [extras, setExtras] = useState<ExtraSpace[]>(initial?.extras ?? []);

  function pickProperty(id: PropertyType) {
    const preset = propertyOptions.find(p => p.id === id)!;
    setProperty(id);
    if (!initial || id !== initial.property) {
      setBedrooms(preset.defaultBedrooms);
      setExtras(preset.defaultExtras);
    }
  }

  function toggleExtra(id: ExtraSpace) {
    setExtras(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  }

  const previewLayout: HomeLayout | null = property ? { property, bedrooms, extras } : null;
  const previewRooms = previewLayout ? buildRooms(previewLayout) : [];

  return <>
    <div className={s.homeSection}>
      <span className={s.subHeading}>What type of home do you live in?</span>
      <div className={s.homeGrid}>
        {propertyOptions.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={s.homeCard}
            aria-pressed={property === opt.id}
            onClick={() => pickProperty(opt.id)}
          >
            <strong>{opt.label}</strong>
            <small>{opt.hint}</small>
          </button>
        ))}
      </div>
    </div>

    {previewLayout && (
      <>
        <div className={s.homeSection}>
          <span className={s.subHeading}>How many bedrooms?</span>
          <div className={s.chips}>
            {bedroomChoices.map(n => (
              <button
                key={n}
                type="button"
                aria-pressed={bedrooms === n}
                onClick={() => setBedrooms(n)}
              >
                {n === 4 ? "4+" : n}
              </button>
            ))}
          </div>
        </div>

        <div className={s.homeSection}>
          <span className={s.subHeading}>Any extra spaces?</span>
          <div className={s.chips}>
            {extraSpaceOptions.map(opt => (
              <button
                key={opt.id}
                type="button"
                aria-pressed={extras.includes(opt.id)}
                onClick={() => toggleExtra(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className={s.layoutPreview}>
          <strong>Rooms we’ll show you ({previewRooms.length})</strong>
          <p>{previewRooms.map(r => r.name).join(", ")}</p>
        </div>
      </>
    )}

    <div className={s.actions}>
      {cancel ? (
        <button type="button" className={s.back} onClick={cancel}>Cancel</button>
      ) : (
        <button type="button" className={s.back} onClick={back}>Back</button>
      )}
      <button
        type="button"
        className={s.primary}
        disabled={!previewLayout}
        onClick={() => previewLayout && confirm(previewLayout)}
      >
        Show my rooms <Icon name="arrow" size={18}/>
      </button>
    </div>
  </>;
}

type PickerProps = {
  layout: HomeLayout | null;
  rooms: Room[];
  room: Room | null;
  entries: Entry[];
  tariff: Tariff;
  setLayout: (layout: HomeLayout) => void;
  chooseRoom: (room: Room) => void;
  add: (item: Entry) => void;
  back: () => void;
  next: () => void;
};

export function RoomPicker({ layout, rooms, room, entries, tariff, setLayout, chooseRoom, add, back, next }: PickerProps) {
  const [changingHome, setChangingHome] = useState(false);
  const [search, setSearch] = useState("");
  const [all, setAll] = useState(false);
  const [addingCustom, setAddingCustom] = useState(false);
  const [message, setMessage] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);

  if (!layout || !room || changingHome) {
    return (
      <HomeSetup
        initial={layout}
        back={back}
        cancel={layout ? () => setChangingHome(false) : undefined}
        confirm={chosen => {
          setLayout(chosen);
          setChangingHome(false);
          setSearch("");
          setAll(false);
          setMessage("");
        }}
      />
    );
  }

  const query = search.trim().toLowerCase();
  const visible = query
    ? presets.filter(a => [a.id, a.name, a.group].join(" ").toLowerCase().includes(query))
    : all ? alphabetical : roomSuggestions[room.type].map(id => catalogue[id]);
  const inRoom = entries.filter(e => entryRoom(e) === room.name);
  const nextRoom = rooms[rooms.findIndex(r => r.name === room.name) + 1];

  function selectRoom(target: Room) {
    chooseRoom(target);
    setSearch("");
    setAll(false);
    setMessage("");
    requestAnimationFrame(() => heading.current?.focus());
  }

  function addItem(item: Entry) {
    add({ ...item, room: room!.name });
    setMessage("Added " + item.name + " to " + room!.name + ".");
  }

  return <>
    <div className={s.homeBar}>
      <span><Icon name="house" size={18}/> <strong>{layoutSummary(layout)}</strong></span>
      <button type="button" className={s.linkBtn} onClick={() => setChangingHome(true)}>Change home</button>
    </div>

    <div className={s.roomTabs} role="group" aria-label="Rooms in your home">
      {rooms.map(r => {
        const count = entries
          .filter(e => entryRoom(e) === r.name)
          .reduce((sum, e) => sum + e.quantity, 0);
        return (
          <button
            key={r.name}
            type="button"
            className={s.roomTab}
            aria-pressed={r.name === room.name}
            onClick={() => selectRoom(r)}
          >
            {r.name}
            {count > 0 && <span className={s.roomCount}>{count}</span>}
          </button>
        );
      })}
    </div>

    <h3 className={s.roomHeading} ref={heading} tabIndex={-1}><Icon name="house"/> {room.name}</h3>
    <label className={s.search}><Icon name="search"/><input type="search" aria-label="Search all appliances" placeholder="Search all appliances" value={search} onChange={e => setSearch(e.target.value)}/></label>
    <div className={s.pickerTools}>
      <button type="button" className={s.linkBtn} onClick={() => { setSearch(""); setAll(!all); }}>{all ? "Show room suggestions" : "Browse all appliances"}</button>
      <button type="button" className={s.linkBtn} onClick={() => setAddingCustom(true)}>+ Add your own appliance</button>
    </div>
    <p role="status" className={s.addedMessage}>{message}</p>
    <div className={s.pickGrid}>{visible.map(a => {
      const standard = inRoom.filter(e => e.id === a.id && !e.isCustom);
      const count = standard.reduce((total, e) => total + e.quantity, 0);
      return <button type="button" key={a.id} className={s.pick} data-added={count > 0}
        aria-label={"Add " + a.name + " to " + room.name} disabled={standard[0]?.quantity >= 1000}
        onClick={() => addItem(makeEntry(a.id, ""))}>
        <ApplianceIcon id={a.id}/><span>{a.name}{count > 0 && <small>{count} in this room</small>}</span><Icon name="plus" size={18}/>
      </button>;
    })}</div>
    {!visible.length && <p>No match for “{search}”. Use “Add your own appliance” to give it a name and estimate its cost.</p>}
    <div className={s.roomActions}>
      {nextRoom && <button type="button" className={s.roomNext} onClick={() => selectRoom(nextRoom)}>Next: {nextRoom.name}<Icon name="arrow" size={17}/></button>}
      <button type="button" className={s.primary} disabled={!entries.length} onClick={next}>Set my routine <Icon name="arrow" size={18}/></button>
      <button type="button" className={s.back} onClick={back}>Back</button>
    </div>
    {addingCustom && <CustomAppliance room={room.name} tariff={tariff} close={() => setAddingCustom(false)} save={e => { setAddingCustom(false); addItem(e); }}/>}
  </>;
}
