const shapes = {
  // UI icons
  bolt: <path d="M13.5 2 4.7 13.2h6.1l-.4 8.8 8.9-12h-6.1z" />,
  house: <><path d="M2 11 12 3l10 8M5 10v10h14V10M10 20v-6h4v6"/></>,
  meter: <><rect x="4" y="2.5" width="16" height="19" rx="3"/><path d="M8 12a4 4 0 0 1 8 0m-4 0 2-3M8 17h8"/></>,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
  check: <path d="m4 12 5 5 11-11"/>,
  plus: <path d="M5 12h14M12 5v14"/>,
  search: <><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></>,
  leaf: <><path d="M20 3C8 3 3 6 4 14c1 6 9 8 13 1 2-3 3-8 3-12zM4 21l10-11"/></>,
  sliders: <><path d="M3 7h7m4 0h7M3 17h11m4 0h3"/><circle cx="12" cy="7" r="2"/><circle cx="16" cy="17" r="2"/></>,

  // Kitchen appliances
  kettle: <><path d="M6 9h10l1 9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM6 9l-2.5-2.5H7m9 3.5h2a2.5 2.5 0 0 1 0 5h-1M8 6h6M11 4v2" /></>,
  fridge: <><rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M5 13h14M8.5 7v3M8.5 16v2.5"/></>,
  freezer: <><rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M12 7v10M8.5 9.5l7 5M15.5 9.5l-7 5"/></>,
  oven: <><rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M3.5 8.5h17M7.5 6h.01M12 6h.01M16.5 6h.01"/><rect x="7" y="11.5" width="10" height="6" rx="1"/></>,
  hob: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="2.2"/><circle cx="15.5" cy="9" r="2.2"/><circle cx="8.5" cy="15" r="2.2"/><circle cx="15.5" cy="15" r="2.2"/></>,
  microwave: <><rect x="2.5" y="5.5" width="19" height="13" rx="2"/><rect x="5.5" y="8.5" width="9.5" height="7" rx="1"/><path d="M18 9h.01M18 12h.01M18 15h.01"/></>,
  dishwasher: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 8h16M7.5 5.5h3M16.5 5.5h.01M8 17v-4m4 4v-5m4 5v-4M7 17h10"/></>,
  airfryer: <><path d="M6 6.5A2.5 2.5 0 0 1 8.5 4h7A2.5 2.5 0 0 1 18 6.5V18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M6 12h12M10 15h4M10.5 7.5h3"/></>,
  toaster: <><path d="M4 11a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 7V5a2 2 0 0 1 4 0v2m0-2a2 2 0 0 1 4 0v2M20 12h1.5M7 19v1.5M17 19v1.5"/></>,
  coffee: <><path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM16 10h2a2.5 2.5 0 0 1 0 5h-2M8 5.5c0-1 .8-1.5.8-2.5M12 5.5c0-1 .8-1.5.8-2.5"/></>,
  pot: <><path d="M5 10h14v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM3 10h18M7 10a5 5 0 0 1 10 0M11 4.5h2"/></>,
  hood: <><path d="M9 3h6v5l6 6v3H3v-3l6-6zM8 20v-1M12 21v-2M16 20v-1"/></>,

  // Laundry appliances
  washer: <><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13.5" r="4"/><path d="M7 6h3m6 0h1"/></>,
  dryer: <><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13.5" r="4.2"/><path d="M10.5 13.5c.5-1.2 1.2-1.2 1.5 0s1 1.2 1.5 0M7 6h3m6 0h1"/></>,
  iron: <><path d="M3 17h18l-1.5-5.5A4.5 4.5 0 0 0 15.1 8H8l-5 6zM8 8V6a2 2 0 0 1 2-2h4M7 20h1M11 20h1M15 20h1"/></>,
  airer: <><path d="M5 20 8 7h8l3 13M6.8 11h10.4M6 15h12M9 4c0 1 .7 1.3.7 2M15 4c0 1 .7 1.3.7 2"/></>,

  // Lighting
  bulb: <><path d="M9 17h6M10 20h4M9.2 14.6C8.6 12.7 6 11.4 6 8.6a6 6 0 1 1 12 0c0 2.8-2.6 4.1-3.2 6z"/></>,

  // TV and tech
  tv: <><rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/></>,
  console: <><rect x="3" y="8" width="18" height="9" rx="4.5"/><path d="M7 12.5h3M8.5 11v3M15.5 11.5h.01M17.5 13.5h.01"/></>,
  laptop: <><rect x="4" y="4.5" width="16" height="11" rx="1.5"/><path d="M2 18.5h20"/></>,
  desktop: <><rect x="2.5" y="4.5" width="12.5" height="9.5" rx="1.5"/><path d="M6.5 18h4.5m-2.25-4v4"/><rect x="17" y="4.5" width="4.5" height="13.5" rx="1"/><path d="M19.25 14.5h.01"/></>,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M9 20h6m-3-4v4"/></>,
  router: <><rect x="3" y="13.5" width="18" height="6" rx="1.5"/><path d="M7 16.5h.01M10.5 16.5h.01M17 13.5V9M9 9.5a5 5 0 0 1 6 0M6.5 7a8.5 8.5 0 0 1 11 0"/></>,
  settop: <><rect x="2.5" y="9" width="19" height="7" rx="2"/><path d="M6.5 12.5h4M15.5 12.5h.01M18 12.5h.01"/></>,
  phone: <><rect x="6.5" y="2.5" width="11" height="19" rx="2.2"/><path d="M10.5 18h3M12.5 7.5 10 11h2.5l-.5 3 2.5-3.5H12z"/></>,
  standby: <><path d="M12 3.5v7M7.5 6.5a7.5 7.5 0 1 0 9 0"/></>,

  // Heat and hot water
  shower: <><path d="M4 20V8a4 4 0 0 1 4-4h3a3 3 0 0 1 3 3v1"/><path d="M10 8h8a1 1 0 0 1 .9 1.4L18 11H10l-.9-1.6A1 1 0 0 1 10 8z"/><path d="M11 14v1.5M14 14v2M17 14v1.5M12.5 18v1.5M15.5 18v1.5"/></>,
  heater: <><rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="M7 10v4M10.5 10v4M14 10v4M17 10v4M6 18v2M18 18v2M9 3.5c0 .8.6 1.2.6 2M15 3.5c0 .8.6 1.2.6 2"/></>,
  radiator: <><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M7.5 6v13M12 6v13M16.5 6v13M5 4h14"/></>,
  watertank: <><rect x="6" y="4" width="12" height="16" rx="5"/><path d="M12 9c1.8 2.1 2.7 3.3 2.7 4.4a2.7 2.7 0 0 1-5.4 0C9.3 12.3 10.2 11.1 12 9z"/></>,
  heatpump: <><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="10" cy="12" r="4.2"/><path d="M10 9.2v5.6M7.2 12h5.6M16.5 9h2M16.5 12h2M16.5 15h2"/></>,
  blanket: <><path d="M3 14.5h18v4.5H3zM5 14.5v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M8 6.5c0-1 .8-1.3.8-2.3M12 6.5c0-1 .8-1.3.8-2.3M16 6.5c0-1 .8-1.3.8-2.3"/></>,
  towel: <><path d="M6 3v18M18 3v18M6 7h12M6 11h12M6 15h12M6 19h12"/></>,

  // Other
  droplet: <><path d="M12 3c3.5 4.4 6 7.5 6 10.5a6 6 0 1 1-12 0C6 10.5 8.5 7.4 12 3z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/></>,
  ev: <><path d="M4 13l1.5-4.5A2 2 0 0 1 7.4 7h9.2a2 2 0 0 1 1.9 1.5L20 13v5h-2v-1.5H6V18H4z"/><circle cx="7.5" cy="13.5" r="1"/><circle cx="16.5" cy="13.5" r="1"/><path d="M12.5 8.5 10.8 11h1.7l-.4 2 1.8-2.5h-1.6z"/></>,
  vacuum: <><circle cx="7.5" cy="17.5" r="3"/><path d="M10.5 17.5H15v-5a3.5 3.5 0 0 0-7 0v2M15 11.5l3-6.5h2.5M18 19.5h3.5l-1-3h-2.5"/></>,
  hairdryer: <><path d="M5 10a4 4 0 0 1 4-4h6l3 2v4l-3 2H9a4 4 0 0 1-4-4zM10 14l-1.5 6h2.8l1.2-6M20 8.5h1.5M20 11.5h2"/></>,
  fan: <><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="1.5"/><path d="M12 10.5c0-3 2-5 3.5-3.8M13.3 12.8c2.6 1.5 3.3 4.2 1.5 5M10.7 12.8c-2.6 1.5-5.3.7-5-1.3"/></>,
  snowflake: <><path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M9.5 4.8 12 7l2.5-2.2M9.5 19.2 12 17l2.5 2.2"/></>,
  waves: <><path d="M3 9c1.8-1.5 3.6-1.5 5.4 0s3.6 1.5 5.4 0 3.6-1.5 5.4 0M3 15c1.8-1.5 3.6-1.5 5.4 0s3.6 1.5 5.4 0 3.6-1.5 5.4 0"/></>,
  plug: <><path d="M8 3v5m8-5v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/></>,
};

export type SymbolName = keyof typeof shapes;

export function Icon({ name, size = 22 }: { name: SymbolName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shapes[name]}
    </svg>
  );
}
