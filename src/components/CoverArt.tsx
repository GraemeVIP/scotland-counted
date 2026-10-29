/**
 * The cover for a guide with no photograph: the Saltire blue with the cross in
 * light and the subject set large. Used by listing cards so a guide never shows
 * an empty frame, and so a page of guides reads as one family.
 */
export default function CoverArt({ label, title, className = "" }: { label: string; title: string; className?: string }) {
  return (
    <div className={`saltire-hero flex h-full w-full flex-col justify-end p-5 sm:p-6 ${className}`} aria-hidden="true">
      <div className="beams">
        <div className="beam a" />
        <div className="beam b" />
        <div className="beam-edge a" />
        <div className="beam-edge b" />
      </div>
      <span className="eyebrow">{label}</span>
      <span className="mt-2 max-w-[18ch] text-[clamp(20px,2.4vw,28px)] font-[600] leading-[1.08] tracking-[-0.03em] text-white">
        {title}
      </span>
    </div>
  );
}
