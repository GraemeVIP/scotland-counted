import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense figure comes
 * directly from IPSA's published individual business costs CSV files for
 * 2022/23 to 2026/27 (checked 22 November 2026 across all 650 UK seats, over
 * 350,000 claim lines). Quoted descriptions are IPSA's exact wording.
 * "91 repayments out of 20,879 claims" counts every Scottish MP claim line in
 * public/data/scottish-mp-receipts.json with an amount repaid above zero.
 * Gifts: Register of Members' Financial Interests (Nov 2025 and Apr 2026 entries).
 */

import {
  type PartyKey,
  PARTY,
  gbp,
  Who,
  QuickTake,
  Finding as KitFinding,
  ChartFrame,
  Bar,
  RankList,
  Receipt,
  Tiles,
  PointList,
  Expand,
  Spotlight,
} from "@/components/ExpenseKit";

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const JARDINE = {
  name: "Christine Jardine",
  href: mp("edinburgh-west"),
  p: "Lib Dem" as PartyKey,
  place: "Edinburgh West",
};

const FINDINGS = 4;

function Finding({ n, id, children }: { n: number; id: string; children: ReactNode }) {
  return (
    <KitFinding n={n} of={FINDINGS} id={id}>
      {children}
    </KitFinding>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/** Her December hospitality bills, year by year. */
const DECEMBERS: { what: string; value: number; label: string; hot?: boolean }[] = [
  { what: "8 December 2023 · two bills, payee names blanked by IPSA", value: 190.3, label: "£190" },
  { what: "13 December 2024 · one bill to “DINE”", value: 227, label: "£227" },
  {
    what: "19 December 2025 · Christmas lunch plus team building event",
    value: 510.11,
    label: "£510",
    hot: true,
  },
];

/** Staff Christmas meals in IPSA's files for all 650 seats, 2022 to 2027. */
const UK_FESTIVE: {
  name: string;
  seat: string;
  href?: string;
  p?: PartyKey;
  date: string;
  detail: string;
  value: number;
}[] = [
  {
    name: "Christine Jardine",
    seat: "Edinburgh West",
    href: mp("edinburgh-west"),
    p: "Lib Dem",
    date: "19 Dec 2025",
    detail: "“lunch staff team training Christmas” £250.80, plus “team building event” £259.31 the same day",
    value: 510.11,
  },
  {
    name: "Craig Whittaker",
    seat: "Calder Valley",
    date: "16 Feb 2024",
    detail: "“Full Team belated Festive meal. Friday 16th Feb.”",
    value: 300,
  },
  { name: "Craig Whittaker", seat: "Calder Valley", date: "23 Jan 2023", detail: "“Festive Meal for staff”", value: 210 },
  {
    name: "Ruth Cadbury",
    seat: "Brentford and Isleworth",
    date: "12 Dec 2024",
    detail: "“Thank you Xmas meal for staff team”",
    value: 188.41,
  },
  {
    name: "Sarah Gibson",
    seat: "Chippenham",
    date: "4 Dec 2024",
    detail: "“Team Christmas dinner”, with alcohol and service charge taken off",
    value: 154.05,
  },
  {
    name: "Douglas Chapman",
    seat: "Dunfermline and West Fife (former MP)",
    date: "15 Dec 2023",
    detail: "“Christmas Breakfast team meeting & Thank you for 2023”",
    value: 80.6,
  },
  {
    name: "Scott Benton",
    seat: "Blackpool South",
    date: "4 Mar 2024",
    detail: "“Staff festive meal”, moved from December",
    value: 58.06,
  },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function ChristineJardineMpChristmasLunchExpenses() {
  const decMax = Math.max(...DECEMBERS.map((d) => d.value));

  return (
    <Prose>
      <QuickTake
        items={[
          <>
            Six days before Christmas 2025, Edinburgh West MP{" "}
            <Link href={JARDINE.href}>Christine Jardine</Link> billed you <strong>£510</strong> for
            her office do.
          </>,
          <>
            <strong>£250.80</strong> went down as{" "}
            <strong>&ldquo;lunch staff team training Christmas&rdquo;</strong>. A &ldquo;team
            building event&rdquo; the same day cost <strong>£259.31</strong>.
          </>,
          <>
            One year prior, IPSA told another MP a festive meal was &ldquo;Not claimable&rdquo;.
            Hers was paid in full.
          </>,
          <>
            She also put a <strong>TV licence on expenses five years in a row</strong> (£842). She
            paid back <strong>£0</strong> across 605 claims.
          </>,
        ]}
      />

      <Spotlight
        person={JARDINE}
        kicker="19 December 2025 · six days before Christmas"
        amount="£510"
        headline="Her office Christmas lunch and team day, paid by you."
        lines={[
          { meta: "Office Costs · Hospitality", what: "lunch staff team training Christmas", amount: "£250.80" },
          { meta: "Office Costs · Hospitality", what: "team building event", amount: "£259.31" },
        ]}
      >
        <p>
          Most people pay for their own work Christmas lunch. Stick the word &ldquo;training&rdquo;
          on it at Westminster and the public picks up the bill.
        </p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="christmas-lunch">
        A Christmas lunch, dressed up as training
      </Finding>
      <P>
        At a normal job, you pay for your own Christmas lunch or the boss pays out of firm cash.
        Not in Edinburgh West.
      </P>
      <P>
        On <strong>19 December 2025</strong>, IPSA paid two food and drink bills for Lib Dem MP{" "}
        <Link href={JARDINE.href}>Christine Jardine</Link>&apos;s local office. One was £250.80 for
        &ldquo;lunch staff team training Christmas&rdquo;. The next was £259.31 for a &ldquo;team
        building event&rdquo;.
      </P>
      <P>
        It was not a one off. Her December food and drink bill went up three years in a row.
      </P>

      <ChartFrame
        kicker="Christine Jardine · IPSA hospitality bills"
        title="Her December food and drink bills, three years running"
        caption="Source: IPSA claim files 2023/24 to 2025/26. The 2023 payee names are blanked out in IPSA's file."
      >
        <div className="space-y-4">
          {DECEMBERS.map((d) => (
            <div key={d.label}>
              <p
                className={`ui mb-1 text-[14.5px] leading-[1.45] ${d.hot ? "font-[680] text-[var(--ink)]" : "text-[var(--ink-2)]"}`}
              >
                {d.what}
              </p>
              <Bar
                value={d.value}
                max={decMax}
                colour={d.hot ? "var(--bad)" : "var(--rule-strong)"}
                label={d.label}
              />
            </div>
          ))}
        </div>
      </ChartFrame>

      <P>
        Over 2025/26, her food and drink bills hit <strong>£697.75</strong>. That was top in
        Scotland, and top ten of all 650 UK MPs.
      </P>

      <Expand summary="See the proof: her December lines, word for word">
        <Receipt
          person={JARDINE}
          heading="IPSA records · Office Costs · Hospitality"
          lines={[
            { meta: "8 Dec 2023", what: "[***] [***]", amount: "£168.30" },
            { meta: "8 Dec 2023", what: "[***] [***]", amount: "£22.00" },
            { meta: "13 Dec 2024", what: "DINE", amount: "£227.00" },
            { meta: "19 Dec 2025", what: "lunch staff team training Christmas", amount: "£250.80" },
            { meta: "19 Dec 2025", what: "team building event", amount: "£259.31" },
          ]}
          total={{ label: "Three Decembers · all paid", amount: "£927.41" }}
          footer="Wording as printed by IPSA. [***] is how IPSA blanks out names. IPSA claim numbers for 19 Dec 2025: 60350715-1 and 60346208-1."
        />
      </Expand>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="uk-christmas">
        One MP told no. She got paid £510.
      </Finding>
      <P>
        We checked five years of bills for all 650 UK seats. Hardly any MPs even try to claim a
        staff Christmas meal.
      </P>
      <P>
        On its own, her <strong>£250.80</strong> lunch was second only to a £300 meal. Add her
        £259.31 team day from the same date, and her <strong>£510</strong> is the biggest festive
        spend we found in the UK.
      </P>

      <ChartFrame
        kicker="All 650 UK seats · 2022/23 to 2026/27"
        title="Staff Christmas meals that IPSA paid for"
        caption="Source: IPSA claim files, all MPs. Only Scottish MPs still in office are linked."
      >
        <RankList
          max={UK_FESTIVE[0].value}
          rows={UK_FESTIVE.map((r) => ({
            key: `${r.name}-${r.date}`,
            who: r.p ? (
              <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />
            ) : (
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-[620] text-[var(--ink)]">{r.name}</span>
                <span className="ui text-[13.5px] text-[var(--muted)]">{r.seat}</span>
              </span>
            ),
            side: r.date,
            value: r.value,
            label: gbp(r.value, false),
            colour: r.p ? PARTY[r.p].colour : "var(--rule-strong)",
            detail: r.detail,
            highlight: Boolean(r.p),
          }))}
        />
      </ChartFrame>

      <P>
        Look at two dates, one year apart. On <strong>19 December 2024</strong>, IPSA turned down
        the Newbury MP&apos;s £204.95 &ldquo;Festive team meal&rdquo; as &ldquo;Not
        claimable&rdquo;. On <strong>19 December 2025</strong>, IPSA paid Christine Jardine&apos;s
        £510 bills in full.
      </P>

      <Receipt
        heading="IPSA records · 19 December 2024 · Newbury MP · Hospitality"
        lines={[{ meta: "Claimed £204.95 · Status: Not Paid", what: "Festive team meal", amount: "£0.00" }]}
        total={{ label: "IPSA's reason", amount: "Not claimable" }}
        footer="Wording as printed by IPSA, claim 60275492-1."
      />

      <P>
        Did the word &ldquo;training&rdquo; get it paid? We can&apos;t tell, because IPSA&apos;s
        file gives no facts past those five words.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="other-claims">
        TV licences, £21,735 on flights, and a wall knocked down then rebuilt
      </Finding>
      <P>
        Her 2025/26 bills hit <strong>£349,032</strong> with staff pay. Look past wages and these
        bills jump out:
      </P>

      <Tiles
        items={[
          { value: "£842", label: "TV licences, five years running", hot: true },
          { value: "£21,735", label: "on her own flights in 2025/26" },
          { value: "£3,358", label: "on papers since 2022" },
        ]}
      />

      <Receipt
        person={JARDINE}
        heading="IPSA records · Office Costs · TV licence"
        lines={[
          { meta: "21 April 2022", what: "TVLICENSING.CO.UK", amount: "£159.00" },
          { meta: "17 April 2023", what: "TVLICENSING.CO.UK", amount: "£159.00" },
          { meta: "17 April 2024", what: "TVLICENSING.CO.UK", amount: "£169.50" },
          { meta: "22 April 2025", what: "TVLICENSING.CO.UK", amount: "£174.50" },
          { meta: "1 May 2026", what: "TVLICENSING.CO.UK", amount: "£180.00" },
        ]}
        total={{ label: "Five licences · all paid", amount: "£842.00" }}
        footer="Wording as printed by IPSA. IPSA allows a TV licence for an MP's local office."
      />

      <PointList
        items={[
          {
            key: "flights",
            title: "£21,735 on flights, while other Edinburgh MPs take the train",
            children: (
              <>
                That was just her own flights in 2025/26. In the same city,{" "}
                <Link href={mp("edinburgh-south-west")}>Scott Arthur</Link> spent £680 on flights
                and £9,467 on trains.{" "}
                <Link href={mp("edinburgh-north-and-leith")}>Tracy Gilbert</Link> spent £529 on
                flights and £11,268 on trains.
              </>
            ),
          },
          {
            key: "taxis",
            title: "£2,411 on taxis (2025/26)",
            children: <>Fourth highest of any Scottish MP that year.</>,
          },
          {
            key: "papers",
            title: "£3,358 on papers since 2022",
            children: (
              <>
                A £269 Telegraph bill each April since 2024, plus The Times, The Herald and The
                Economist.
              </>
            ),
          },
          {
            key: "wall",
            title: "A wall knocked down, then put back up",
            children: (
              <>
                March 2025: £760.80 for &ldquo;Internal office wall knocked down&rdquo;. May 2026:
                £1,100 &ldquo;For materials to build an internal wall/glass door&rdquo;. June 2026:
                £1,250 to wrap up the job.
              </>
            ),
          },
          {
            key: "lights",
            title: "£1,590 on office lights in five weeks",
            children: (
              <>
                Two £264 call outs in October 2025. Then £1,062 for new LED lights the next month.
              </>
            ),
          },
          {
            key: "rent",
            title: "£22,200 rent for her London flat (2025/26)",
            children: <>Plus £763 in council tax.</>,
          },
        ]}
      />

      <P>
        On top of expenses, Scottish Rugby gave her £1,298 in free match seats and meals in
        November 2025 and April 2026. Both sit on her Register of Interests.
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="who-stops-this">
        605 bills sent in, 605 paid
      </Finding>
      <P>
        No one cares about a £10 bag of office tea or coffee. A £510 Christmas lunch and team day
        six days before Christmas is a whole other thing.
      </P>
      <P>
        All 605 of her claims since 2022 were paid in full. Across Scotland, MPs paid back just 91
        of 20,879 claims, as our{" "}
        <Link href="/blog/worst-scottish-mp-expenses">Scottish MP expenses roundup</Link> shows.
      </P>
      <P>Three plain questions for <Link href={JARDINE.href}>Christine Jardine</Link> and IPSA:</P>

      <PointList
        items={[
          {
            key: "training",
            title: "What training took place at the Christmas lunch?",
            children: <>The bill puts &ldquo;training&rdquo; in the title, with no proof of what was taught.</>,
          },
          {
            key: "event",
            title: "What was the £259.31 team day?",
            children: <>No venue, no firm and no facts show in the log.</>,
          },
          {
            key: "refused",
            title: "Why tell one MP no and pay her £510?",
            children: <>IPSA blocked a £204.95 &ldquo;Festive team meal&rdquo; the year before.</>,
          },
        ]}
      />

      <Aside title="Not just Edinburgh West">
        <p>
          See the rest of Scotland&apos;s worst claims:{" "}
          <Link href="/blog/worst-scottish-mp-expenses">the worst Scottish MP expenses</Link>,{" "}
          <Link href="/blog/scottish-mps-tv-licence-expenses">all 29 MPs claiming TV licences</Link>{" "}
          and{" "}
          <Link href="/blog/kilmarnock-mp-23437-electricity-bill">a £23,437 power bill paid in one day</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See her food and drink bills (or check your own MP)"
        body="Open our live Receipt Finder on Christine Jardine's food and drink claims. Copy any receipt for X or WhatsApp, or email her direct."
        href="/mp-expenses-scotland/search?mp=edinburgh-west&q=hospitality"
        cta="See the receipts"
      />
    </Prose>
  );
}
