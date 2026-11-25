import Image from "next/image";
import Link from "@/components/IntentLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ExplainText } from "@/components/ExplainServer";
import { meta } from "@/lib/seo";
import { ofgemUrl } from "@/lib/electricity/rates";
import Calculator from "./Calculator";
import { Icon } from "./Icons";
import s from "./electricity.module.css";

const path = "/electricity-cost-calculator-scotland";
const art = "/images/tools/electricity-house-scotland.webp";
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Your money", path: "/money" },
  { name: "Electricity cost calculator", path },
];

export const metadata = meta({
  title: "Electricity Cost Calculator Scotland | What Appliances Cost",
  description:
    "Work out what it costs to run the appliances in your home. Use Scottish electricity rates or your own bill, then see which changes could save you money.",
  path,
  image: art,
  imageAlt: "Cutaway of a Scottish home with its lights and appliances",
  imageWidth: 1080,
  imageHeight: 720,
  imageType: "image/webp",
});

export default function ElectricityPage() {
  return (
    <div className={s.page}>
      <Breadcrumbs crumbs={crumbs} />
      <div className={s.wrap}>
        <header className={s.hero}>
          <div className={s.heroCopy}>
            <span className={s.kicker}>
              <Icon name="bolt" size={16} /> Household energy
            </span>
            <h1>
              Electricity cost <em>calculator</em>
            </h1>
            <p>
              Which costs more: your lights, your wash or your kettle? Pick what you use and see
              the cost in pounds and pence.
            </p>
            <a href="#calculator" className={s.start}>
              Work out my costs <Icon name="arrow" size={18} />
            </a>
          </div>
          <div className={s.heroArt}>
            <Image
              src={art}
              width={1080}
              height={720}
              alt="A cutaway Scottish home showing the lights, television, kettle and washing machine in different rooms."
              sizes="(max-width: 650px) 94vw, (max-width: 1100px) 50vw, 600px"
              preload
            />
          </div>
        </header>

        <Calculator />

        <section className={s.method}>
          <h2>About the figures</h2>
          <ExplainText>
            <details>
              <summary>Where do the home item figures come from?</summary>
              <p>
                We use typical UK figures for each item. Age, size and settings can change what
                yours uses. A plug meter gives the best figure for your own home.
              </p>
              <p>
                A fridge label shows one full year of power. That already counts the time the motor
                is off. For a washing machine, divide the label for 100 washes by 100 to get one
                wash. Or enter the label straight into the tool.
              </p>
              <p>
                A kettle starts at 0.11 kWh per litre of water. That allows for cold tap water and
                some heat loss. Colder water or a second boil costs more.
              </p>
              <p>
                <a href="https://www.nea.org.uk/get-help/leaflets/how-much-do-your-electrical-items-cost-to-run/">
                  National Energy Action guide
                </a>{" "}
                ·{" "}
                <a href="https://energysavingtrust.org.uk/advice/home-appliances/">
                  Energy Saving Trust home guide
                </a>{" "}
                ·{" "}
                <a href="https://www.citizensadvice.org.uk/scotland/consumer/energy/energy-supply/save-energy-at-home/buying-a-more-energy-efficient-appliance/">
                  Citizens Advice energy labels
                </a>
              </p>
            </details>

            <details>
              <summary>How do you work out the cost?</summary>
              <p>
                One kilowatt hour (kWh) is the power a 1,000 watt item uses in one hour. We
                multiply your kWh by your unit rate in pence. Then we divide by 100 to get pounds.
              </p>
              <p>
                We add the daily standing charge once for your whole home. One month is one twelfth
                of a 365 day year.
              </p>
              <p>
                On a day and night tariff? Set what share of each item runs in the cheap hours. For
                winter items, set how many weeks a year you use them. We spread that cost across the
                full year.
              </p>
            </details>

            <details>
              <summary>Will this match my bill?</summary>
              <p>
                You get the closest match when you use your own bill rates and add all your items.
                This tool assumes you buy all your power from the grid.
              </p>
              <p>
                Solar panels, a home battery or half hour rates will change your real bill. Gas,
                discounts and debt repayments are not in this total.
              </p>
              <p>
                <a href={ofgemUrl}>Ofgem regional rates</a> ·{" "}
                <Link href="/energy-price-cap-scotland">Scotland’s energy price cap explained</Link>
              </p>
            </details>
          </ExplainText>
        </section>
      </div>
    </div>
  );
}
