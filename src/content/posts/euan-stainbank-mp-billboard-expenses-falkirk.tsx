import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense figure comes
 * directly from IPSA's published individualBusinessCosts CSV files for 2022/23
 * to 2026/27 (checked 22 November 2026 across all 650 UK MPs, over 350,000
 * rows). Quoted descriptions are IPSA's exact wording and must not be edited.
 * UK advertising board ranking: every "Advertising and contact cards" line whose
 * wording mentions an advertising board, hoarding, billboard or pitchside
 * board (130 claims by 63 MPs). Office address from the UK Parliament members
 * site. Nobody was contacted for comment.
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
  CaseCard,
  Face,
  Tiles,
  PointList,
  Expand,
  Spotlight,
} from "@/components/ExpenseKit";

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const STAINBANK = {
  name: "Euan Stainbank",
  href: mp("falkirk"),
  p: "Labour" as PartyKey,
  place: "Falkirk",
};

const FINDINGS = 4;

function Finding({ n, id, children }: { n: number; id: string; children: ReactNode }) {
  return (
    <KitFinding n={n} of={FINDINGS} id={id}>
      {children}
    </KitFinding>
  );
}

/** Other MPs with their own local story page, linked near the end. */
const MORE_LOCAL_STORIES: { name: string; seat: string; place: string; hook: string; story: string }[] = [
  { name: "Lillian Jones", seat: "kilmarnock-and-loudoun", place: "Kilmarnock", hook: "£23,437 for electricity in one day", story: "/blog/kilmarnock-mp-23437-electricity-bill" },
  { name: "Chris Law", seat: "dundee-central", place: "Dundee", hook: "£3,090 to set up home broadband", story: "/blog/chris-law-mp-3090-broadband-expenses-dundee" },
  { name: "Angus MacDonald", seat: "inverness-skye-and-west-ross-shire", place: "Inverness and Skye", hook: "£3,000 speech coach and £546 drains", story: "/blog/angus-macdonald-mp-speech-coach-drains-expenses" },
  { name: "Pamela Nash", seat: "motherwell-wishaw-and-carluke", place: "Motherwell", hook: "£7,542 on DFS, IKEA and a new carpet", story: "/blog/pamela-nash-mp-furniture-expenses-motherwell" },
  { name: "Torcuil Crichton", seat: "na-h-eileanan-an-iar", place: "Western Isles", hook: "£2,400 coaching from a former IPSA worker", story: "/blog/torcuil-crichton-mp-coaching-expenses-western-isles" },
  { name: "Gregor Poynton", seat: "livingston", place: "Livingston", hook: "Four TV licences in 11 months", story: "/blog/gregor-poynton-mp-four-tv-licences-livingston" },
];

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/** The board against his own office costs, on one scale. */
const SCALE: { what: string; value: number; label: string; hot?: boolean }[] = [
  { what: "His Falkirk office phone and internet bill (typical month, 2025)", value: 85.49, label: "£85" },
  { what: "One month's rent on his Falkirk office (2024/25)", value: 833.33, label: "£833" },
  { what: "His biggest single Falkirk office power bill (January 2025)", value: 986.53, label: "£987" },
  { what: "One advertising board for him, booked for a year (31 October 2024)", value: 3300, label: "£3,300", hot: true },
];

/** The biggest single advertising board claims across all 650 UK MPs. */
const UK_TOP_BOARDS: {
  name: string;
  p: PartyKey;
  seat: string;
  href?: string;
  date: string;
  detail: ReactNode;
  value: number;
}[] = [
  {
    name: "Euan Stainbank",
    p: "Labour",
    seat: "Falkirk",
    href: mp("falkirk"),
    date: "31 Oct 2024",
    detail: "“Advertising board to advertise Euan as local MP”. To be advertised for 1 year.",
    value: 3300,
  },
  {
    name: "Lizzi Collinge",
    p: "Labour",
    seat: "Morecambe & Lunesdale",
    date: "31 Jul 2025",
    detail: "“Football Hoarding costs for 2025/2026”",
    value: 1800,
  },
  {
    name: "Frank McNally",
    p: "Labour",
    seat: "Coatbridge & Bellshill",
    href: mp("coatbridge-and-bellshill"),
    date: "27 Mar 2025",
    detail: "Board at Albion Rovers FC",
    value: 1621.48,
  },
  {
    name: "Joani Reid",
    p: "Labour",
    seat: "East Kilbride & Strathaven",
    href: mp("east-kilbride-and-strathaven"),
    date: "9 Oct 2024",
    detail: "“Advertising Hoarding at East Kilbride FC”",
    value: 1500,
  },
  {
    name: "Michelle Donelan",
    p: "Conservative",
    seat: "Chippenham (former MP)",
    date: "30 Mar 2024",
    detail: "Board at Melksham Football Club",
    value: 1200,
  },
  {
    name: "Lillian Jones",
    p: "Labour",
    seat: "Kilmarnock & Loudoun",
    href: mp("kilmarnock-and-loudoun"),
    date: "7 Nov 2024",
    detail: "Board at Kilmarnock FC",
    value: 1020,
  },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function EuanStainbankMpBillboardExpensesFalkirk() {
  const scaleMax = Math.max(...SCALE.map((s) => s.value));

  return (
    <Prose>
      <QuickTake
        items={[
          <>
            <strong>Taxpayers</strong> paid <strong>£3,300</strong> for a board advertising Falkirk
            MP <Link href={STAINBANK.href}>Euan Stainbank</Link>. It was booked for a whole year.
          </>,
          <>
            IPSA&apos;s own words: the board was there <strong>&ldquo;to advertise Euan as local
            MP&rdquo;</strong>.
          </>,
          <>
            The <strong>biggest advertising board claim</strong> of all 650 UK MPs since 2022, and
            nearly <strong>double</strong> the next one.
          </>,
          <>
            Paid on <strong>31 October 2024</strong>, less than four months after he won Falkirk for
            Labour.
          </>,
          <>
            It cost about <strong>four months&apos; rent</strong> on his Falkirk office. And{" "}
            <strong>£0</strong> has been paid back.
          </>,
        ]}
      />

      <Spotlight
        person={STAINBANK}
        kicker="31 October 2024 · booked for a whole year"
        amount="£3,300"
        headline="You paid for a board advertising him."
        lines={[
          {
            meta: "Office Costs · Advertising and contact cards",
            what: "Advertising board to advertise Euan as local MP and contact details. To be advertised for 1 year.",
            amount: "£3,300.00",
          },
        ]}
      >
        <p>The people he works for paid for a year of adverts telling them who he is.</p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-billboard">
        What the IPSA record shows
      </Finding>
      <P>
        <Link href={STAINBANK.href}>Euan Stainbank</Link> won Falkirk for Labour on 4 July 2024.
        His office is on Newmarket Street in the town centre.
      </P>
      <P>
        IPSA is the body that pays MPs&apos; expenses with public money. On 31 October 2024 it paid
        £3,300 for an advertising board. The board told people he was the local MP and how to
        reach him.
      </P>
      <P>
        Where did the board stand? Who made it? The record doesn&apos;t say. All you get is
        &ldquo;To be advertised for 1 year&rdquo;.
      </P>

      <ChartFrame
        kicker="Putting £3,300 in perspective"
        title="One advertising board vs his own Falkirk office bills"
        caption="Source: IPSA files (2024/25 and 2025/26) for Euan Stainbank MP."
      >
        <div className="space-y-4">
          {SCALE.map((s) => (
            <div key={s.label}>
              <p
                className={`ui mb-1 text-[14.5px] leading-[1.45] ${s.hot ? "font-[680] text-[var(--ink)]" : "text-[var(--ink-2)]"}`}
              >
                {s.what}
              </p>
              <Bar
                value={s.value}
                max={scaleMax}
                colour={s.hot ? "var(--bad)" : "var(--rule-strong)"}
                label={s.label}
              />
            </div>
          ))}
        </div>
      </ChartFrame>

      <Tiles
        items={[
          { value: "£275", label: "what the board cost for every month it was booked" },
          { value: "£3,300", label: "the full bill, paid in one go", hot: true },
        ]}
      />

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="uk-number-one">
        The biggest advertising board claim of all 650 UK MPs
      </Finding>
      <P>
        We checked over 350,000 claim lines from all 650 UK MPs, from 2022 to 2027. We pulled out
        every claim for an advertising board or hoarding.
      </P>
      <P>
        There were <strong>130 of them</strong>, from 63 MPs. Most are a board at the local
        football ground for a few hundred pounds. Then there&apos;s his, at nearly double the next
        biggest in the country.
      </P>

      <ChartFrame
        kicker="All 650 UK MPs · 2022/23 to 2026/27"
        title="Biggest single advertising board claims by any UK MP"
        caption="Source: Five years of IPSA files (2022/23 to 2026/27) across all 650 UK seats. One line per MP."
      >
        <RankList
          max={UK_TOP_BOARDS[0].value}
          rows={UK_TOP_BOARDS.map((r, i) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />,
            side: r.date,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
            detail: r.detail,
            highlight: i === 0,
          }))}
        />
      </ChartFrame>

      <P>
        Four of the top six are Scottish Labour MPs.{" "}
        <Link href={mp("kilmarnock-and-loudoun")}>Lillian Jones</Link> paid £1,020 for a board at
        Kilmarnock FC, which is hardly cheap. His cost more than three times that.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="his-other-claims">
        Everything else he billed you for
      </Finding>
      <P>
        The board isn&apos;t the only big bill. A few more stand out in his files since 2024.
      </P>

      <CaseCard kicker="Office furniture, in one go" figure="£5,002" people={[STAINBANK]}>
        <p>
          On <strong>19 September 2024</strong>, IPSA paid <strong>£5,001.60</strong> to an office
          furniture shop. It&apos;s one of the biggest single furniture bills of any Scottish MP.
        </p>
      </CaseCard>

      <PointList
        items={[
          {
            key: "heating",
            title: "£2,380 to get the office heating working",
            children: (
              <>
                His office says the air conditioning units are its only heating, and they were broken
                when it took over the lease. IPSA paid £2,006.17 for a part, £205.44 for repairs and
                £168 for a service. You&apos;d normally expect the landlord to sort that.
              </>
            ),
          },
          {
            key: "apb",
            title: "£2,808 to a display firm, with no reason given",
            children: (
              <>
                Three bills from APB Displays Limited: £897 (November 2025), £897 (January 2026) and
                £1,014 (March 2026). The record does not say what they were for.
              </>
            ),
          },
          {
            key: "tv",
            title: "£344 for TV licences",
            children: (
              <>
                One in January 2025 (£169.50) and another in September 2025 (£174.50, split over two lines). See{" "}
                <Link href="/blog/scottish-mps-tv-licence-expenses">all 29 Scottish MPs who did it</Link>.
              </>
            ),
          },
          {
            key: "training",
            title: "£1,500 for staff training from a firm called Real Clear",
            children: <>Two bills of £750 each, both paid on 31 January 2025.</>,
          },
          {
            key: "flat",
            title: "£24,480 a year for a London flat",
            children: (
              <>
                £2,040 a month for his second home in London, in 2025/26. MPs from outside London
                are allowed to claim it, but it&apos;s still your money.
              </>
            ),
          },
        ]}
      />

      <Expand summary="See the proof: his biggest claims, word for word">
        <Receipt
          person={STAINBANK}
          heading="IPSA records · Euan Stainbank · 2024 to 2026"
          lines={[
            {
              meta: "31 Oct 2024 · Advertising and contact cards",
              what: "Advertising board to advertise Euan as local MP and contact details. To be advertised for 1 year.",
              amount: "£3,300.00",
            },
            {
              meta: "19 Sep 2024 · Equipment purchase",
              what: "[***] Office Furniture Centre- Euan Stainbank",
              amount: "£5,001.60",
            },
            {
              meta: "29 Nov 2024 · Equipment purchase",
              what: "Part required to fix office heating",
              amount: "£2,006.17",
            },
            {
              meta: "26 Nov 2024 · Maintenance and repairs",
              what: "Required repairs to AC units. There is no heating within the office and the air conditioning units provide heat which were not working when we took over the lease.",
              amount: "£205.44",
            },
            {
              meta: "19 Jan 2026 · Advertising and contact cards",
              what: "APB DISPLAYS LIMITED",
              amount: "£897.00",
            },
            {
              meta: "30 Mar 2026 · Maintenance and repairs",
              what: "APB DISPLAYS LIMITED [200013613-2355]",
              amount: "£1,014.00",
            },
          ]}
          footer="Wording as printed by IPSA, including the [***] where IPSA hid part of the name. IPSA claim number for the board: 60262102-1 (2024/25). Every line is marked Paid. £0 repaid."
        />
      </Expand>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="why-ipsa-paid">
        Why IPSA said yes
      </Finding>
      <P>
        IPSA lets MPs spend public money telling local people how to reach them. Cards, adverts
        and boards all count, as long as there is no party badge.
      </P>
      <P>
        So a big board with his name on it counts as &ldquo;contact details&rdquo;. The problem is
        the rules themselves. They let a brand new MP advertise himself for a year and send you
        the bill.
      </P>
      <P>
        Now, a new MP does need people to know where his office is. But plenty manage it for a
        few hundred pounds at the local football club. So three questions are still unanswered:
      </P>

      <PointList
        items={[
          {
            key: "where",
            title: "Where was the board, and who made it?",
            children: <>IPSA&apos;s record names no place and no firm.</>,
          },
          {
            key: "why-so-much",
            title: "Why did it cost nearly double any other MP's board?",
            children: <>The next biggest in the whole UK was £1,800.</>,
          },
          {
            key: "worth-it",
            title: "How many people in Falkirk got help because of it?",
            children: <>£3,300 is an awful lot of public money for a sign.</>,
          },
        ]}
      />

      <Aside title="Part of a wider pattern in Westminster">
        <p>
          <Link href={STAINBANK.href}>Euan Stainbank</Link> isn&apos;t the only MP paying to put his
          name in front of you. Some send glossy reports about their own work through every door,
          on your money. See{" "}
          <Link href="/blog/worst-scottish-mp-expenses">the worst Scottish MP expenses</Link>,{" "}
          <Link href="/blog/worst-scottish-mp-expenses">the worst claims</Link>, or compare{" "}
          <Link href="/mp-expenses-scotland">all 57 Scottish MPs</Link>.
        </p>
      </Aside>

      <section aria-labelledby="more-local-stories" className="not-prose my-10">
        <h2
          id="more-local-stories"
          className="ui text-[20px] font-[700] leading-[1.25] text-[var(--ink)] sm:text-[22px]"
        >
          More local MP stories
        </h2>
        <p className="ui mt-1 text-[15px] leading-[1.5] text-[var(--muted)]">
          One MP, one town, one bill. Is yours here?
        </p>
        <ul className="mt-4 divide-y divide-[var(--rule)] rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] px-4 sm:px-5">
          {MORE_LOCAL_STORIES.map((s) => (
            <li key={s.story} className="flex items-center gap-3 py-3.5">
              <Face name={s.name} href={mp(s.seat)} size={44} />
              <div className="min-w-0 flex-1">
                <Link href={s.story} className="ui text-[16px] font-[660] leading-[1.35]">
                  {s.hook} →
                </Link>
                <p className="ui mt-0.5 text-[13.5px] leading-[1.4] text-[var(--muted)]">
                  <Link href={mp(s.seat)} className="text-[var(--muted)]">
                    {s.name}
                  </Link>{" "}
                  · {s.place}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <PostCTA
        title="See every claim Euan Stainbank has made"
        body="Open our live Receipt Finder on the Falkirk MP. Copy any claim for X or WhatsApp, or email him direct."
        href="/mp-expenses-scotland/search?mp=falkirk"
        cta="See his receipts"
      />

      <P>
        Want the full picture? <Link href="/mp-expenses-scotland">Compare all 57 Scottish MPs</Link>.
      </P>
    </Prose>
  );
}
