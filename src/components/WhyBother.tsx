import Link from "next/link";
import { pay } from "@/lib/data/power";
import PostcodeStart from "@/components/PostcodeStart";
import { ExplainText } from "@/components/Glossary";

const HOW_IT_WORKS = [
  {
    title: "I find the right people",
    body: "Your postcode is enough to find your MP, MSP and council area. You do not need to know any of them.",
  },
  {
    title: "I add the proof",
    body: "The email includes your area's official figure and sends each question to the person who controls it.",
  },
  {
    title: "You stay in control",
    body: "Both emails open in your own email app. Read them, change anything you want, then press send.",
  },
];

export default function WhyBother({ className = "" }: { className?: string }) {
  return (
    <section className={className} aria-labelledby="why-bother">
      <div
        className="overflow-hidden rounded-[var(--r-l)] bg-[var(--deep)] text-[var(--deep-ink)]"
        style={{ boxShadow: "var(--shadow-2)" }}
      >
        <div className="p-7 sm:p-10 lg:p-12">
          <div className="grid gap-x-14 gap-y-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:items-center">
            <div>
              <p className="kicker text-[var(--action)] mb-3">Your voice counts</p>
              <h2
                id="why-bother"
                className="display-stat text-[clamp(34px,4vw,54px)] max-w-[16ch]"
              >
                Your MP and MSP work for you
              </h2>
              <p className="text-[19px] sm:text-[21px] leading-[1.5] font-[650] mt-6 max-w-[45ch]">
                <ExplainText>
                You do not need to have voted for them. You do not need to understand politics.
                Answering people who live in their area is part of the job.
                </ExplainText>
              </p>
              <p className="text-[17px] leading-[1.6] mt-5 max-w-[52ch] opacity-80">
                <ExplainText>
                A written question also leaves a dated reply you can keep and check later. That is
                more useful than another promise made in passing. {" "}
                <Link
                  href="/what-happens-when-you-email-your-mp"
                  className="underline decoration-[var(--action)] decoration-2 underline-offset-4"
                >
                  See what happens after you send it
                </Link>
                .
                </ExplainText>
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[pay.mp, pay.msp].map((person) => (
                <div
                  key={person.role}
                  className="rounded-[var(--r-m)] border border-white/15 bg-white/[0.07] px-6 py-7"
                >
                  <p className="ui text-[15px] font-[700] opacity-75">{person.role} is paid</p>
                  <p className="display-stat text-[clamp(34px,3.2vw,46px)] mt-3">
                    {person.amount}
                  </p>
                  <p className="text-[15px] leading-[1.45] opacity-75 mt-3">a year, from public money</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-white/15 pt-8">
            <div className="grid gap-5 lg:grid-cols-[0.55fr_1.45fr]">
              <div>
                <p className="kicker text-[var(--action)] mb-2">No faff</p>
                <h3 className="text-[25px] font-[760] leading-[1.15] max-w-[12ch]">
                  From postcode to two ready emails
                </h3>
              </div>
              <ol className="grid gap-4 sm:grid-cols-3">
                {HOW_IT_WORKS.map((item, index) => (
                  <li key={item.title} className="rounded-[var(--r-s)] bg-white/[0.055] p-5">
                    <span className="ui text-[15px] font-[800] text-[var(--action)]" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <h4 className="mt-3 text-[18px] font-[720] leading-[1.25]">{item.title}</h4>
                    <p className="mt-2 text-[15.5px] leading-[1.5] opacity-[0.78]"><ExplainText>{item.body}</ExplainText></p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--rule)] bg-[var(--surface)] px-7 py-7 text-[var(--ink)] sm:px-10 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(260px,0.65fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="kicker text-[var(--action)] mb-2">Ready when you are</p>
              <h3 className="text-[26px] font-[780] leading-[1.12] max-w-[18ch]">
                Put in your postcode. I do the rest.
              </h3>
            </div>
            <PostcodeStart />
          </div>
        </div>
      </div>
    </section>
  );
}
