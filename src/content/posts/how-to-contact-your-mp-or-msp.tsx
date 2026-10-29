import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { SCOTTISH_PARLIAMENT as SP, TOTAL_MSPS } from "@/lib/data/local";
import { holyroodConstituencies, holyroodRegions } from "@/lib/data/holyrood";
import { mps } from "@/lib/data/mps";

/** UK Parliament switchboard and postal address for every MP. */
const COMMONS = {
  phone: "020 7219 3000",
  phoneHref: "tel:02072193000",
  address: ["House of Commons", "London", "SW1A 0AA"],
};

const allMsps = [
  ...holyroodConstituencies.map((record) => record.msp),
  ...holyroodRegions.flatMap((region) => region.msps),
];
const mspPattern = allMsps.filter((msp) => /\.msp@parliament\.scot$/i.test(msp.email)).length;
const mpPattern = mps.filter((mp) => /\.mp@parliament\.uk$/i.test(mp.email)).length;

const Email = ({ children }: { children: string }) => (
  <span className="[overflow-wrap:anywhere]">{children}</span>
);

export default function Post() {
  return (
    <Prose>
      <Lead>
        To contact your MSP, email them at <Email>firstname.surname.msp@parliament.scot</Email>,
        phone the Scottish Parliament on {SP.phone}, or write to {SP.address.join(", ")}. To
        contact your MP, email <Email>firstname.surname.mp@parliament.uk</Email> or write to{" "}
        {COMMONS.address.join(", ")}. Whichever you choose, put your full address and postcode in.
      </Lead>

      <P>
        Most people never write to the people who represent them. When you ask why, the answer is
        almost never that they do not care. It is that nobody ever told them how it works, and
        nobody wants to look daft.
      </P>

      <P>
        So here is the whole thing, plainly. There is no test, no form of words you have to get
        right, and no way to do it wrong.
      </P>

      <H2 id="mp-and-msp">MSP or MP: which one to contact</H2>

      <P>
        Everyone in Scotland has an MP and {SP.perPerson} MSPs. They are different people in
        different parliaments deciding different things.
      </P>

      <UL>
        <LI>
          <strong>Your MP</strong> works in the UK Parliament in London. Scotland has {mps.length}{" "}
          of them, one for each constituency.
        </LI>
        <LI>
          <strong>Your MSPs</strong> work in the Scottish Parliament in Edinburgh. You have one
          constituency MSP for your local area and {SP.regionalPerRegion} regional MSPs for the
          wider region, {TOTAL_MSPS} in all across Scotland.
        </LI>
      </UL>

      <GuideTable
        kicker="Who deals with what"
        title="Which representative to contact"
        columns={["Contact", "About things like"]}
        rows={[
          [
            "Your MSP",
            "The NHS and social care, schools, housing and homelessness, policing and justice, transport, Scottish Income Tax, and Scottish benefits such as the Scottish Child Payment and Best Start Grant",
          ],
          [
            "Your MP",
            "Universal Credit and most other benefits, the State Pension, employment rights and the minimum wage, immigration and visas, defence and trade",
          ],
          [
            "Your councillor",
            "Bins, potholes, council housing, council tax, planning, and getting your child into a local school",
          ],
        ]}
        caption={
          <>
            Based on the Scottish Parliament&apos;s guide to what MSPs can help with. The full
            split of powers is on <Link href="/who-decides">who decides what</Link>.
          </>
        }
      />

      <P>
        You do not need to work out which one handles your issue. If you are not sure, write to
        both. Nobody will mind, and the wrong one will usually pass it on. For local services,
        your councillor is often quickest, see{" "}
        <Link href="/who-is-my-local-councillor-by-postcode">who is my local councillor by postcode</Link>.
      </P>

      <Aside title="You do not need to have voted for them">
        <p>
          This is the one that stops people most often. An MP or MSP represents{" "}
          <strong>everyone</strong> who lives in their area, people who voted for them, people who
          voted against them, and people who did not vote at all. They still have to deal with you.
        </p>
      </Aside>

      <H2 id="contact-msp">Contact MSP: email, phone, letter or surgery</H2>

      <P>
        Start by finding out who your MSPs are. The{" "}
        <Link href="/who-is-my-msp">who is my MSP</Link> lookup shows all {SP.perPerson} of yours
        from your postcode, with their exact email addresses. The Scottish Parliament says you can
        contact either type, constituency or regional, about anything it deals with.
      </P>

      <GuideTable
        kicker="Scottish Parliament"
        title="Ways to contact your MSP"
        columns={["How", "Details"]}
        rows={[
          [
            "Email",
            <>
              Usually <Email>firstname.surname.msp@parliament.scot</Email>.{" "}
              {mspPattern === allMsps.length
                ? `All ${allMsps.length} current MSPs use that pattern.`
                : `${mspPattern} of the ${allMsps.length} current MSPs use that pattern.`}
            </>,
          ],
          [
            "Phone",
            <>
              <a href={SP.phoneHref}>{SP.phone}</a>, or free on{" "}
              <a href={SP.freephoneHref}>{SP.freephone}</a>. Calls are answered {SP.hours}.
            </>,
          ],
          ["Letter", SP.address.join(", ")],
          ["British Sign Language", "Through the Contact Scotland BSL video relay service"],
          ["In person", "Many MSPs hold local surgeries. Their own website or social media will have the times."],
        ]}
        caption="Scottish Parliament contact details, checked 29 October 2026."
      />

      <P>
        Every MSP also has a page on this site, in the{" "}
        <Link href="/representatives/msps">MSP directory</Link>, with their email, office and
        recent votes.
      </P>

      <H2 id="contact-mp">Contact your MP: email, phone or letter</H2>

      <P>
        MPs normally only take up cases for people who live in their constituency, so check you
        have the right one first. The <Link href="/who-is-my-msp">postcode lookup</Link> shows
        your MP as well as your MSPs, or you can browse{" "}
        <Link href="/representatives/mps">every Scottish MP</Link>.
      </P>

      <GuideTable
        kicker="UK Parliament"
        title="Ways to contact your MP"
        columns={["How", "Details"]}
        rows={[
          [
            "Email",
            <>
              Usually <Email>firstname.surname.mp@parliament.uk</Email>. {mpPattern} of Scotland&apos;s{" "}
              {mps.length} MPs use that pattern. Each MP&apos;s page on this site shows the exact one.
            </>,
          ],
          [
            "Phone",
            <>
              The MP&apos;s local office number, on their page here, or the House of Commons on{" "}
              <a href={COMMONS.phoneHref}>{COMMONS.phone}</a>.
            </>,
          ],
          ["Letter", `${COMMONS.address.join(", ")}, or the MP's local office`],
          ["In person", "Most MPs hold surgeries in the constituency. Their local office can tell you when."],
        ]}
        caption="Email patterns counted from the UK and Scottish Parliament records used on this site."
      />

      <H2 id="what-to-say">What to actually say</H2>

      <P>
        Short is better than long. A message that takes two minutes to read is more likely to be
        read than one that takes ten. The Scottish Parliament asks for your postcode and contact
        details, a short description of the problem, and any ideas you have for sorting it out. A
        good message has four parts:
      </P>

      <UL>
        <LI>
          <strong>Where you live.</strong> This is the part that makes them have to answer. They
          represent your area, so give your full address and postcode.
        </LI>
        <LI>
          <strong>One fact.</strong> Not ten. One clear, checkable local figure lands harder than a
          general complaint about the state of things.
        </LI>
        <LI>
          <strong>A clear question.</strong> Something specific enough that a vague reply is
          obviously a vague reply.
        </LI>
        <LI>
          <strong>A request for an answer.</strong> Ask them to reply. It changes how the message
          is handled.
        </LI>
      </UL>

      <Aside title="A short example you can copy">
        <p>Dear [name],</p>
        <p>I live at [your address and postcode], in your area.</p>
        <p>[One or two sentences on what has happened or what worries you, with one fact.]</p>
        <p>Could you tell me [your question]? Please reply to this email.</p>
        <p>Yours sincerely, [your name]</p>
      </Aside>

      <H3>What not to worry about</H3>

      <P>
        Spelling. Grammar. Whether you sound clever enough. None of it matters, and none of it is
        being judged. Staff read constituent mail all day and what registers is that a real person
        in the area took the time to write.
      </P>

      <P>Being angry is fine. Threatening anybody is not, and will get your message binned.</P>

      <H2 id="what-happens-next">What happens next</H2>

      <P>
        You will usually get a reply, though it can take a few weeks. It might be a standard letter
        rather than a personal one. That is normal and it does not mean it was ignored.
      </P>

      <P>
        Offices keep a record of what constituents are writing in about. That is the part people
        underestimate: even where an individual reply is short, the volume of letters on a subject
        is tracked, and it shapes what gets raised. One letter is a data point. Two hundred from
        the same area is a problem that needs managing. There is more on this in{" "}
        <Link href="/what-happens-when-you-email-your-mp">what happens when you email your MP</Link>.
      </P>

      <Aside title="If you get a non answer">
        <p>
          Write back once, quoting your original question and asking it again. Politely refusing to
          accept a non answer is entirely legitimate, and it is what journalists do. You can also
          try one of your regional MSPs instead.
        </p>
      </Aside>

      <H2 id="scottish-government">Contact the Scottish Government or your MSP?</H2>

      <P>
        The Scottish Parliament and the Scottish Government are separate. The Parliament is the{" "}
        {TOTAL_MSPS} MSPs, who pass laws and question ministers. The Government is the First
        Minister, the ministers and the civil servants who run things day to day.
      </P>

      <P>
        If you want a government decision looked at again, your MSP is usually the best place to
        start. They can raise it with ministers or ask a question in Parliament, and a minister has
        to answer them.
      </P>

      <H2 id="one-minute-version">The one minute version</H2>

      <P>
        If all of that still feels like effort, that is exactly why this site exists. Put in your
        postcode and I will find both of your representatives, put your own area&apos;s figures
        into the message, write both emails and open them in your email app. You read them, change
        anything you like, and press send.
      </P>

      <PostCTA
        title="Write to your MP and MSP now"
        body="Enter your postcode. I find the right people and write both emails for you. Nothing is sent from this site and your postcode is not saved."
        href="/email-your-mp-and-msp"
        cta="Write my emails for me"
      />

      <P>
        Not sure who represents you? <Link href="/who-is-my-msp">Find your MSP and MP</Link>,{" "}
        <Link href="/constituencies">find your MP&apos;s area</Link> or{" "}
        <Link href="/areas">look up your council</Link>.
      </P>
    </Prose>
  );
}
