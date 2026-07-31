import { EvidenceDetails } from "@/components/Blocks";

/**
 * Plain-English explainer of MP vs MSP.
 *
 * Most people who land here from a search for their own town have never been
 * told the difference, and the words themselves ("constituency", "devolved",
 * "reserved") are the barrier. Not understanding is the main reason people do
 * nothing, so this is written to be understood on one read, with no prior
 * knowledge. Precision that would slow that down is moved into the expandable
 * panel at the foot, where the detail is still on the record.
 */

const PEOPLE = [
  {
    who: "Your MP",
    where: "Works in London",
    building: "In the UK Parliament",
    lead: "Your MP helps decide the money almost everyone gets.",
    decides: [
      "Universal Credit and most benefits",
      "Help with the rent if you rent privately",
      "Tax, and the State Pension",
    ],
    colorVar: "--glasgow",
    washVar: "--glasgow-wash",
  },
  {
    who: "Your MSP",
    where: "Works in Edinburgh",
    building: "In the Scottish Parliament",
    lead: "Your MSP helps decide things that are run here in Scotland.",
    decides: [
      "The Scottish Child Payment",
      "Council houses, and help if you are homeless",
      "Schools, childcare and the NHS in Scotland",
    ],
    colorVar: "--scotland",
    washVar: "--brand-wash",
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
      <h2 id="who-does-what" className="h2 mb-2">
        What is the difference between an MP and an MSP?
      </h2>
      <p className="text-[17px] text-[var(--ink-2)] leading-[1.6] max-w-[62ch]">
        Lots of people are not sure, and nobody ever explains it. Here it is in plain words.
        <strong className="text-[var(--ink)]"> You have both of them.</strong> They are two
        different people, and they decide different things.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {PEOPLE.map((person) => (
          <div
            key={person.who}
            className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-5 sm:p-6"
            style={{
              borderTop: `3px solid var(${person.colorVar})`,
              boxShadow: "var(--shadow-1)",
            }}
          >
            <p className="text-[22px] font-[750] leading-[1.2]">{person.who}</p>
            <p
              className="ui text-[15px] font-[720] mt-1.5"
              style={{ color: `var(${person.colorVar})` }}
            >
              {person.where}
            </p>
            <p className="text-[15px] text-[var(--muted)] leading-[1.45] mt-0.5">
              {person.building}
            </p>

            <p className="text-[16.5px] leading-[1.55] mt-4">{person.lead}</p>

            <p className="ui text-[15px] font-[700] text-[var(--ink-2)] mt-4 mb-2">
              Things they help decide:
            </p>
            <ul className="space-y-1.5">
              {person.decides.map((item) => (
                <li
                  key={item}
                  className="text-[16px] leading-[1.5] text-[var(--ink-2)] flex gap-2.5"
                >
                  <span aria-hidden="true" style={{ color: `var(${person.colorVar})` }}>
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-[17px] leading-[1.6] mt-5 max-w-[62ch]">
        <strong>Both of them work for you.</strong> You do not need to know which one is in
        charge of what. You do not need to pick. That is why we write one email to each of them,
        and each email only asks for things that person can actually do.
      </p>

      <p className="text-[16px] text-[var(--ink-2)] leading-[1.6] mt-3 max-w-[62ch]">
        You do not need to have voted for them. They still have to answer you.
      </p>

      {showDetail && (
        <EvidenceDetails
          className="mt-6 max-w-[780px]"
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
            This site finds your constituency MSP, because that is the one whose area matches
            where you live most closely.
          </p>
          <p className="mt-3">
            MP areas and MSP areas are drawn differently and do not sit on top of each other. That
            is the only reason we ask for a postcode to find your MSP.
          </p>
        </EvidenceDetails>
      )}
    </section>
  );
}
