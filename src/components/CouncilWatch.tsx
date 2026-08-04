import NewsletterSignup from "@/components/NewsletterSignup";
import { site } from "@/lib/site";

/**
 * The lower step on the council pages: give an email if you are not ready to
 * write a letter.
 *
 * It sits below the letter CTA on purpose. Writing to an MSP is what this site
 * is for, so it gets asked first and gets the loud block; this is the quieter
 * fallback for the much larger number of people who read, get annoyed, and
 * leave. Those readers arrive from a local news story about one council, so
 * the copy is about that council's next set of figures, not "subscribe to the
 * newsletter", which asks a stranger for a favour.
 *
 * Renders nothing when the form is unwired, same as the signup itself.
 */
export default function CouncilWatch({ councilName }: { councilName?: string }) {
  if (!site.web3formsKey) return null;

  const shortName = councilName?.replace(/ Council$/, "");

  return (
    <section
      aria-labelledby="council-watch-title"
      className="mt-10 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-7"
    >
      <p className="kicker mb-2 text-[var(--brand)]">Not ready to write yet?</p>
      <h2 id="council-watch-title" className="h3 mb-2">
        {shortName ? `Get told when ${shortName}'s figures change` : "Get told when the figures change"}
      </h2>
      <p className="mb-5 max-w-[62ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
        Councils publish new figures every year, and almost nobody hears about it. I read the
        audits and the budget papers when they land, and send one email when the numbers move.
        A few times a year. Nothing else, ever.
      </p>
      <NewsletterSignup />
    </section>
  );
}
