import Link from "next/link";
import EditorialImage from "@/components/EditorialImage";
import NewsletterSignup from "@/components/NewsletterSignup";
import SnpMoneyTimeline from "@/components/SnpMoneyTimeline";
import { ExplainText, G } from "@/components/Glossary";
import { Aside, BigStat, H2, H3, Lead, LI, P, Prose, UL } from "@/components/Prose";
import {
  snpMoneyTimelineEvents,
  snpMoneyTimelineSourcesById,
} from "@/lib/data/snpMoneyTimeline";

const currentStatus = [
  {
    name: "Peter Murrell",
    status: "Convicted",
    tone: "var(--bad)",
    body: "Admitted embezzling £400,310.65 from the SNP between August 2010 and October 2022. Sentenced to five years and three months.",
  },
  {
    name: "Nicola Sturgeon",
    status: "Not charged",
    tone: "var(--good-text)",
    body: "Arrested in 2023, but no longer under investigation in Operation Branchform since 20 March 2025. A separate 2026 complaint has not publicly named her as a suspect.",
  },
  {
    name: "Colin Beattie",
    status: "Not charged",
    tone: "var(--good-text)",
    body: "Arrested in 2023, then released without charge. Police ended their investigation of him on 20 March 2025.",
  },
  {
    name: "The SNP",
    status: "Victim organisation",
    tone: "var(--brand)",
    body: "The party was the organisation Murrell stole from; it was not prosecuted. An Electoral Commission review of past filings remains separate and was still open at the last update.",
  },
] as const;

const courtFigures = [
  ["£400,310.65", "total embezzled"],
  ["12+ years", "August 2010 to October 2022"],
  ["383", "unauthorised Amazon purchases"],
  ["238", "other unauthorised retailer purchases"],
] as const;

export default function Post() {
  return (
    <Prose>
      <Lead>
        Peter Murrell stole £400,310.65 from the Scottish National Party. Nicola Sturgeon and
        Colin Beattie were investigated but not charged. This Operation Branchform timeline is
        the complete, source-linked story of how questions about referendum donations became a
        court case — and what remains unfinished.
      </Lead>

      <div className="not-prose rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--deep)] p-6 text-[var(--deep-ink)] sm:p-8">
        <p className="ui text-[15px] font-[760] text-[var(--action)]">Living timeline</p>
        <p className="mt-2 text-[22px] font-[760] leading-[1.3]">Last independently checked: 2 August 2026</p>
        <p className="mt-3 max-w-[58ch] text-[16px] leading-[1.6] opacity-80">
          The event date and the date a fact became known are not always the same. Purchases from
          2010 onward are marked “Established in court” because the public learned the proved
          detail only in 2026.
        </p>
      </div>

      <H2 id="short-answer">The whole story in one minute</H2>
      <P>
        Supporters gave the SNP money in appeals for another independence referendum. The party
        first described the receipts as <strong>ring-fenced</strong>, then explained that the
        money was pooled with its normal cash and tracked as an internal commitment. Concern
        about that gap between ordinary expectations and the accounting treatment led to police
        complaints in 2021.
      </P>
      <P>
        The investigation then uncovered something more direct and much older: chief executive
        Peter Murrell had been using money from the party&apos;s main bank account without
        authority since 2010. He concealed personal spending through false invoices, misleading
        account codes and expense claims. In 2026 he admitted one charge of embezzlement.
      </P>
      <P>
        That does <strong>not</strong> make the appeal total and the stolen total interchangeable.
        Prosecutors said the main account contained money principally from membership fees,
        donations and legacies. The agreed court record does not say which individual stolen
        pounds came from the referendum appeals.
      </P>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        {currentStatus.map((person) => (
          <article
            key={person.name}
            className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6"
            style={{ borderTopWidth: 4, borderTopColor: person.tone }}
          >
            <p className="ui text-[15px] font-[720] text-[var(--muted)]">{person.name}</p>
            <p className="mt-1 text-[22px] font-[780] leading-[1.2]" style={{ color: person.tone }}>
              <ExplainText>{person.status}</ExplainText>
            </p>
            <p className="mt-3 text-[16px] leading-[1.58] text-[var(--ink-2)]"><ExplainText>{person.body}</ExplainText></p>
          </article>
        ))}
      </div>

      <Aside title="Why this is not called “Sturgeon stole the money”">
        <p>
          No court found that Nicola Sturgeon stole money, and prosecutors did not charge her.
          Senior Scottish prosecutors decided that no charge or further inquiry was required; a
          second, independent senior lawyer reached the same conclusion. Her name belongs in the story
          because she led the party, was married to Murrell at the time, made public statements
          about the finances and was arrested before being cleared — not because guilt can be
          transferred from one person to another.
        </p>
      </Aside>

      <H2 id="money">Three money figures people often mix up</H2>
      <P>
        Much of the confusion disappears when three different figures are kept apart.
      </P>

      <div className="not-prose my-7 overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)]">
        <div className="grid gap-1 border-b border-[var(--rule)] p-5 sm:grid-cols-[165px_1fr] sm:gap-6 sm:p-6">
          <p className="display-stat text-[25px] text-[var(--brand)]">£666,953</p>
          <div>
            <p className="text-[18px] font-[740]">Raised by independence appeals through 2020</p>
            <p className="mt-2 text-[16px] leading-[1.55] text-[var(--ink-2)]">
              <ExplainText>
                The SNP&apos;s own 2020 accounts said £51,760 had been applied and the rest was
                internally earmarked. This was a party statement in a regulated filing.
              </ExplainText>
            </p>
          </div>
        </div>
        <div className="grid gap-1 border-b border-[var(--rule)] p-5 sm:grid-cols-[165px_1fr] sm:gap-6 sm:p-6">
          <p className="display-stat text-[25px] text-[var(--action-text)]">£400,310.65</p>
          <div>
            <p className="text-[18px] font-[740]">
              <G t="embezzled">Embezzled</G> by Murrell
            </p>
            <p className="mt-2 text-[16px] leading-[1.55] text-[var(--ink-2)]">
              This is the final court-proved amount taken from the party&apos;s principal account
              over more than 12 years.
            </p>
          </div>
        </div>
        <div className="grid gap-1 p-5 sm:grid-cols-[165px_1fr] sm:gap-6 sm:p-6">
          <p className="display-stat text-[25px] text-[var(--good-text)]">£2,248,353</p>
          <div>
            <p className="text-[18px] font-[740]">Public grants for party policy research, 2010–22</p>
            <p className="mt-2 text-[16px] leading-[1.55] text-[var(--ink-2)]">
              <ExplainText>
                These grants are public money paid to eligible parties for policy research and
                development; they are separate from referendum donations. The Electoral Commission
                said its annual checks found no evidence they were misused. It is separately
                reviewing past party filings after the conviction.
              </ExplainText>
            </p>
          </div>
        </div>
      </div>

      <H3>“Ring-fenced” did not mean a separate bank account</H3>
      <P>
        In 2017 the SNP publicly said appeal money was ring-fenced. In October 2020, treasurer
        Colin Beattie said £593,501 could be deployed “instantaneously”, even though it was woven
        through the party&apos;s general income. The 2020 accounts later said there was no
        separate fund: donor wishes were recorded internally and the commitment would be met from
        cashflow.
      </P>
      <Aside title="Everyday translation">
        <p>
          The original cash was mixed with the party&apos;s other money. The SNP kept an internal
          tally of what supporters wanted it used for and said it would spend an equivalent amount
          on independence work later. That can produce an earmarked promise larger than the cash
          physically in the bank. It also explains why donors questioned whether “ring-fenced” was
          the right ordinary-language description.
        </p>
      </Aside>

      <H2 id="timeline">The full timeline</H2>
      <P>
        This chronology runs from Murrell taking control of the party administration to the
        latest live inquiries. It includes political context only where it explains why money was
        raised, why the promised campaign did not happen, or why a public milestone mattered.
      </P>
      <P>
        Use the labels as an evidence key. “Established in court” is admitted fact. “Officially
        confirmed” is a police, court, regulator, government or filed-account record. “Reported
        at the time” is attributed contemporary reporting. “Allegation at that stage” was not yet
        proved. “Context” must not be treated as evidence of guilt.
      </P>

      <SnpMoneyTimeline events={snpMoneyTimelineEvents} sources={snpMoneyTimelineSourcesById} />

      <H2 id="court-proved">What the court actually proved</H2>
      <BigStat
        value="£400,310.65"
        label="taken from the SNP by Peter Murrell"
        exact="One charge of embezzlement · August 2010 to October 2022"
      />
      <P>
        Murrell was trusted to operate the party&apos;s main account and approve spending. He used
        that legitimate access for an illegitimate purpose. Staff whose cards were also used did
        not know. False descriptions made purchases look like event merchandise, legal costs,
        computer equipment, assets or other party work.
      </P>

      <EditorialImage
        src="/images/editorial/snp-money-court-findings.webp"
        alt="A cut-paper ledger branching to receipts, an unbranded motorhome, two cars, watches, coffee equipment and household goods"
        caption="A symbolic map of the purchase categories in the agreed court narrative. It does not show every item or identify any unnamed recipient."
        className="my-8"
      />

      <div className="not-prose my-8 grid grid-cols-2 gap-3 sm:gap-4">
        {courtFigures.map(([value, label]) => (
          <div
            key={label}
            className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-4 sm:p-5"
          >
            <p className="display-stat text-[25px] text-[var(--action-text)] sm:text-[30px]">{value}</p>
            <p className="mt-2 text-[15px] font-[650] leading-[1.45] text-[var(--ink-2)]">
              <ExplainText>{label}</ExplainText>
            </p>
          </div>
        ))}
      </div>

      <H3>The biggest proved transactions</H3>
      <UL>
        <LI>
          A £124,550 motorhome, paid for from the party account, hidden behind a false vehicle
          invoice and kept at Murrell&apos;s mother&apos;s home. It was insured for Murrell&apos;s
          private use and had four miles on the odometer when seized.
        </LI>
        <LI>
          £57,500 of party money towards a Jaguar i-Pace. When it was sold, £47,378.76 went into
          Murrell&apos;s personal account.
        </LI>
        <LI>
          £16,489 towards a Volkswagen Golf that was Murrell&apos;s personal car, not an SNP
          asset.
        </LI>
        <LI>
          £18,408.91 in false expense claims, supported by fabricated or altered invoices.
        </LI>
        <LI>
          Hundreds of purchases including watches, stationery, coffee equipment, cookware,
          electronics, gardening equipment and household goods.
        </LI>
      </UL>
      <P>
        The detailed purchase list can make the story feel sensational. The legal centre is
        simpler: a person in control of an organisation&apos;s money repeatedly used it without
        authority and disguised the transactions. Lord Young called it calculated dishonesty and
        a serious breach of trust.
      </P>

      <Aside title="What was not proved">
        <p>
          Scotland&apos;s prosecution service explicitly warned that material omitted from the agreed narrative was not proved.
          The public record does not name people described only as receiving items “for others”.
          It is therefore unsafe to guess who received an item, to attribute an omitted purchase
          to Sturgeon, or to turn an investigative claim into a court finding.
        </p>
      </Aside>

      <H2 id="investigation">How the investigation became a court case</H2>
      <div className="not-prose my-7 space-y-3">
        {[
          ["1", "Complaints", "Questions about referendum donations reached Police Scotland from March 2021."],
          ["2", "Formal inquiry", "Police opened the investigation in July 2021 and followed the money beyond the original complaints."],
          ["3", "Warrants and arrests", "A sheriff approved warrants in April 2023. Police searched addresses, seized material and arrested Murrell, Beattie and Sturgeon at different times."],
          ["4", "Different routes", "Murrell was charged. Sturgeon and Beattie were not reported for prosecution; police instead asked prosecutors for advice about whether more inquiry was needed."],
          ["5", "Independent prosecution review", "Prosecutors assessed 516 witness statements, tens of thousands of files and a 542-page report. A second independent senior lawyer checked the key decisions and agreed."],
          ["6", "Plea and sentence", "Murrell pleaded guilty in May 2026. The agreed facts were read in June and he was sentenced later that month."],
        ].map(([number, title, body]) => (
          <div
            key={number}
            className="grid grid-cols-[44px_1fr] gap-4 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-4 sm:p-5"
          >
            <span className="display-stat flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand)] text-[20px] text-white">
              {number}
            </span>
            <div>
              <p className="text-[18px] font-[750]">
                <ExplainText>{title}</ExplainText>
              </p>
              <p className="mt-1.5 text-[16px] leading-[1.55] text-[var(--ink-2)]"><ExplainText>{body}</ExplainText></p>
            </div>
          </div>
        ))}
      </div>

      <Aside title="Why the legal word is embezzlement, not fraud">
        <p>
          Police did not report anyone for prosecution for fraud. Embezzlement describes a person
          who lawfully has access to someone else&apos;s money, then dishonestly converts it for
          an unauthorised use. Calling this a “fraud conviction” sounds close in everyday speech,
          but it is not the offence Murrell admitted.
        </p>
      </Aside>

      <H2 id="what-is-live">What is still live now</H2>
      <P>
        The guilt and sentence part of Murrell&apos;s case is complete. Three connected but
        distinct processes were unfinished at the latest check.
      </P>
      <UL>
        <LI>
          <strong>Recovery:</strong> court action continues to recover money gained through the
          crime and decide what happens to seized property. The SNP has also said it is seeking
          the return of its loss. Neither statement means the full amount has already been recovered.
        </LI>
        <LI>
          <strong>Electoral Commission:</strong> the regulator is reviewing earlier accounts,
          declarations and disclosures after the conviction. A review is not a finding.
        </LI>
        <LI>
          <strong>Yes Scotland:</strong> police are making inquiries after a separate complaint
          about the 2014 campaign organisation&apos;s finances. Yes Scotland denies that money is
          missing and supplied accounts. Police have not publicly named Sturgeon or anyone else as
          a suspect in that matter.
        </LI>
      </UL>
      <P>
        Parliamentary bodies are also discussing broader scrutiny of political-party finance.
        Holyrood voted for an independently led, all-party review, while the Commons Scottish
        Affairs Committee approached Holyrood committees about possible joint work. Neither
        announcement should be described as a completed inquiry.
      </P>

      <H2 id="updates">Bookmark this living record</H2>
      <P>
        Bookmark this page with <strong>⌘D on a Mac</strong> or <strong>Ctrl+D on Windows</strong>.
        Updates will also be posted on{" "}
        <a href="https://x.com/scotlandcounted" target="_blank" rel="noopener noreferrer">
          Scotland Counted on X
        </a>
        . The email list sends a short note when the evidence changes.
      </P>

      <div className="not-prose my-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6 sm:p-8">
        <p className="label mb-2">Follow the evidence</p>
        <h3 className="text-[25px] font-[780] leading-[1.2]">One email when this timeline changes</h3>
        <p className="mb-5 mt-2 max-w-[58ch] text-[16px] leading-[1.55] text-[var(--ink-2)]">
          No daily political newsletter. Just an update when a court, police, prosecutor,
          regulator or official inquiry changes the verified position.
        </p>
        <NewsletterSignup />
      </div>

      <H3>How updates and corrections work</H3>
      <P>
        A new claim is not added as fact merely because it is dramatic or widely repeated. Before
        an update, the court position, contempt restrictions and the best available primary
        record are checked. If only reporting is available, the event is attributed and labelled
        that way. If the public status changes, the four status cards at the top change first.
      </P>
      <P>
        Material corrections are dated in the site&apos;s{" "}
        <Link href="/corrections">corrections log</Link>. Quiet copy edits do not rewrite the
        history: the article date records when the evidence was last checked.
      </P>
    </Prose>
  );
}
