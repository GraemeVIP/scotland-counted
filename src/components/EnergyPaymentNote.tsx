import Link from "@/components/IntentLink";
import { postPath } from "@/lib/routeMap";

/**
 * The £100 energy payment goes by council tax band, so this sits next to the
 * prices wherever a band is shown. Budget day took the council tax page from
 * about 5 views a day to 61, and the payment date is still to come.
 *
 * Says nothing about the date itself: that lives on the guide, in one place.
 */
export default function EnergyPaymentNote({
  band,
  className = "mt-6",
}: {
  /** A single band's page. Leave out where every band is on show. */
  band?: string;
  className?: string;
}) {
  return (
    <p
      className={`${className} max-w-[760px] rounded-[var(--r-s)] border-l-[4px] border-[var(--action)] bg-[var(--surface-2)] px-5 py-4 text-[16px] leading-[1.6] text-[var(--ink-2)]`}
    >
      {!band ? (
        <>
          <strong className="text-[var(--ink)]">In band A, B, C or D?</strong> You&apos;re in line
          for the £100 energy payment announced in the UK Budget. Bands E to H don&apos;t get it.{" "}
        </>
      ) : "ABCD".includes(band) ? (
        <>
          <strong className="text-[var(--ink)]">Band {band} homes are in line for the £100 energy
          payment</strong>{" "}
          announced in the UK Budget.{" "}
        </>
      ) : (
        <>
          <strong className="text-[var(--ink)]">Band {band} homes don&apos;t get the £100 energy
          payment</strong>{" "}
          announced in the UK Budget. It goes to bands A to D.{" "}
        </>
      )}
      <Link href={postPath("100-energy-payment-scotland")}>
        Who gets the £100 in Scotland, and when it&apos;s paid
      </Link>
      .
    </p>
  );
}
