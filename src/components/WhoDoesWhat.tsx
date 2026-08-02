import { EvidenceDetails } from "@/components/Blocks";

/**
 * Plain-English explainer of MP vs MSP.
 *
 * Most people who land here from a search for their own town have never been
 * told the difference, and the words themselves ("constituency", "devolved",
 * "reserved") are the barrier. Not understanding is the main reason people do
 * nothing, so this has to work on one read with no prior knowledge.
 *
 * It is built to be understood before it is read: two buildings, two cities,
 * two colours, two lists. Someone who only looks at it should still come away
 * knowing they have both kinds of representative and that both work for them. Precision that
 * would slow that down moves into the panel at the foot.
 */

const PEOPLE = [
  {
    who: "Your MP",
    city: "London",
    building: "The UK Parliament",
    lead: "Decides the money almost everyone gets.",
    decides: [
      "Universal Credit and most benefits",
      "Help with the rent if you rent privately",
      "Tax, and the State Pension",
    ],
    colorVar: "--glasgow",
    /** Big Ben: a tower with a clock face. Recognisable at a glance. */
    icon: (
      <svg viewBox="0 0 48 64" fill="none" aria-hidden="true" className="w-full h-full">
        <path d="M24 2 30 12H18L24 2Z" fill="currentColor" />
        <rect x="18" y="12" width="12" height="9" fill="currentColor" />
        <circle cx="24" cy="27" r="7" stroke="currentColor" strokeWidth="2.6" />
        <path d="M24 23.5V27l3 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="17" y="36" width="14" height="26" fill="currentColor" />
        <rect x="8" y="46" width="9" height="16" fill="currentColor" opacity="0.55" />
        <rect x="31" y="46" width="9" height="16" fill="currentColor" opacity="0.55" />
      </svg>
    ),
  },
  {
    who: "Your MSP",
    city: "Edinburgh",
    building: "The Scottish Parliament",
    lead: "Decides things that are run here in Scotland.",
    decides: [
      "The Scottish Child Payment",
      "Council houses, and help if you are homeless",
      "Schools, childcare and the NHS in Scotland",
    ],
    colorVar: "--scotland",
    /** A saltire-free civic building: steps up to a broad, low chamber. */
    icon: (
      <svg viewBox="0 0 48 64" fill="none" aria-hidden="true" className="w-full h-full">
        <path d="M6 30 24 16l18 14" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <rect x="10" y="32" width="28" height="20" fill="currentColor" opacity="0.55" />
        <rect x="15" y="38" width="5" height="14" fill="currentColor" />
        <rect x="28" y="38" width="5" height="14" fill="currentColor" />
        <rect x="4" y="54" width="40" height="4" fill="currentColor" />
        <rect x="1" y="59" width="46" height="4" fill="currentColor" opacity="0.55" />
      </svg>
    ),
  },
];

export default function WhoDoesWhat({
  className = "",
  showDetail = true,
}: {
  className?: string;
  showDetail?: boolean;
}) {
  return (
    <section className={className} aria-labelledby="who-does-what">
      <p className="label mb-3">The bit nobody explains</p>
      <h2 id="who-does-what" className="h2 mb-3">
        What is the difference between an MP and an MSP?
      </h2>
      <p className="text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[62ch]">
        Lots of people are not sure, and nobody ever explains it. Here it is in plain words.
        <strong className="text-[var(--ink)]"> You have both kinds.</strong> They work in two
        different cities and decide two different sets of things.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {PEOPLE.map((p) => (
          <div
            key={p.who}
            className="relative overflow-hidden rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-6 sm:p-7"
            style={{ borderTop: `4px solid var(${p.colorVar})`, boxShadow: "var(--shadow-2)" }}
          >
            {/* The building sits behind the words: recognised, not read. */}
            <div
              aria-hidden="true"
              className="absolute -top-2 -right-3 w-[132px] h-[176px] opacity-[0.07] pointer-events-none"
              style={{ color: `var(${p.colorVar})` }}
            >
              {p.icon}
            </div>

            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="w-[38px] h-[50px] shrink-0" style={{ color: `var(${p.colorVar})` }}>
                  {p.icon}
                </div>
                <div>
                  <p className="text-[27px] sm:text-[31px] font-[790] leading-[1.05]">{p.who}</p>
                  <p
                    className="ui text-[16px] font-[740] mt-0.5"
                    style={{ color: `var(${p.colorVar})` }}
                  >
                    Works in {p.city}
                  </p>
                </div>
              </div>

              <p className="text-[15px] text-[var(--muted)] leading-[1.45] mt-3">{p.building}</p>

              <p className="text-[18px] leading-[1.55] font-[560] mt-4">{p.lead}</p>

              <p className="ui text-[15px] font-[720] text-[var(--ink-2)] mt-5 mb-2.5">
                Things they help decide
              </p>
              <ul className="space-y-2">
                {p.decides.map((item) => (
                  <li
                    key={item}
                    className="text-[16.5px] leading-[1.5] text-[var(--ink-2)] flex gap-2.5"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[9px] w-[7px] h-[7px] rounded-full shrink-0"
                      style={{ background: `var(${p.colorVar})` }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-5 rounded-[var(--r-m)] bg-[var(--deep)] text-[var(--deep-ink)] px-6 sm:px-8 py-6"
        style={{ boxShadow: "var(--shadow-1)" }}
      >
        <p className="text-[19px] sm:text-[21px] leading-[1.5] font-[620] max-w-[64ch]">
          Both kinds work for you. You do not need to know which one is in charge of what, and you
          do not need to pick.
        </p>
        <p className="text-[17px] leading-[1.6] mt-3 max-w-[64ch] opacity-85">
          I automatically write to your MP and your constituency MSP. Each email only asks for
          things that person can actually do. You do not need to have voted for them. They still
          represent you.
        </p>
      </div>

      {showDetail && (
        <EvidenceDetails
          className="mt-6 max-w-[780px] mx-auto"
          summary="The proper names for all this, if you want them"
        >
          <p>
            MP stands for Member of Parliament. They sit in the UK Parliament at Westminster, in
            London. The area an MP covers is called a constituency. Scotland has 57 of them.
          </p>
          <p className="mt-3">
            MSP stands for Member of the Scottish Parliament, at Holyrood in Edinburgh. Powers
            held in London are called reserved; powers held in Edinburgh are called devolved.
          </p>
          <p className="mt-3">
            You actually have more than one MSP. Everyone has one constituency MSP for their local
            area, plus seven regional MSPs covering a wider region. Any of them can be contacted.
            This site shows all eight. It uses your constituency MSP for the ready-written email
            because that is the one whose area matches where you live most closely. You do not
            have to choose.
          </p>
          <p className="mt-3">
            MP areas and MSP areas are drawn differently and do not sit on top of each other. That
            is the only reason I ask for a postcode to find your MSP.
          </p>
        </EvidenceDetails>
      )}
    </section>
  );
}
