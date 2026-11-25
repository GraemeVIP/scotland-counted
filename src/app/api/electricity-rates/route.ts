import { activeOctopusRate, capSnapshot, ofgemUrl, parseCap, payments, quarter, regions, supplierCard, suppliers, type Payment, type Quote, type Region } from "@/lib/electricity/rates";

async function upstream(url: string) {
  const res = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(4500) });
  if (!res.ok) throw new Error("Rate source unavailable");
  return res;
}

async function octopus(region: Region, payment: Payment, now: Date): Promise<Quote | null> {
  const code = "VAR-22-11-01";
  const base = "https://api.octopus.energy/v1/products/" + code + "/electricity-tariffs/E-1R-" + code + "-" + (region === "north" ? "P" : "N") + "/";
  const day = now.toISOString().slice(0, 10);
  const query = "?period_from=" + day + "T00:00Z&period_to=" + day + "T23:59Z";
  const [unit, standing] = await Promise.all(["standard-unit-rates", "standing-charges"].map(async path => {
    const response = await upstream(base + path + "/" + query);
    return activeOctopusRate((await response.json()).results, payment, now);
  }));
  if (!unit || !standing) return null;
  const asOf = now.toLocaleDateString("en-GB", { dateStyle: "medium", timeZone: "Europe/London" });
  return { unit: unit.value_inc_vat, standing: standing.value_inc_vat, title: "Flexible Octopus", period: "Current on " + asOf, source: base + "standard-unit-rates/", benchmark: false };
}

export async function GET(request: Request) {
  const p = new URL(request.url).searchParams;
  const region = p.get("region") as Region;
  const payment = p.get("payment") as Payment;
  const supplier = p.get("supplier") ?? "";
  if (!Object.hasOwn(regions, region) || !Object.hasOwn(payments, payment) || (supplier && !suppliers.some(s => s === supplier))) {
    return Response.json({ error: "Choose a Scottish region and payment method." }, { status: 400 });
  }
  const now = new Date();
  const period = quarter(now);
  let quote = supplierCard(supplier, region, payment, period);
  if (!quote && supplier === "Octopus Energy" && payment !== "prepay") {
    quote = await octopus(region, payment, now).catch(() => null);
  }
  if (!quote) {
    // Ofgem embeds one single rate electricity table per payment method.
    // Only accept the published column for the current UK quarter.
    const table = { debit: "YS_arnkBg", credit: "BaxoQZl5b", prepay: "rtmtZo3eD" }[payment];
    const latest = await upstream("https://app.everviz.com/inject/" + table + "/").then(r => r.text()).catch(() => "");
    quote = parseCap(latest, region, payment, period) ?? capSnapshot(region, payment, period);
  }
  return quote ? Response.json(quote, { headers: { "Cache-Control": "no-store" } })
    : Response.json({ error: "A current rate is unavailable. Enter the prices from your bill.", source: ofgemUrl }, { status: 503 });
}
