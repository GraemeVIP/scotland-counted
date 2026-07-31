import Image from "next/image";

type EditorialImageProps = {
  src: string;
  alt: string;
  caption: string;
  className?: string;
  aspect?: "landscape" | "wide";
  objectPosition?: string;
  sizes?: string;
};

export default function EditorialImage({
  src,
  alt,
  caption,
  className = "",
  aspect = "landscape",
  objectPosition = "center",
  sizes = "(min-width: 1024px) 1120px, calc(100vw - 40px)",
}: EditorialImageProps) {
  return (
    <figure
      className={`overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] ${className}`}
    >
      <div className={`relative ${aspect === "wide" ? "aspect-[2/1]" : "aspect-[3/2]"}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition }}
        />
      </div>
      <figcaption className="border-t border-[var(--rule)] px-5 py-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
        <span className="ui font-[700] text-[var(--ink)]">AI-generated illustration.</span>{" "}
        {caption}
      </figcaption>
    </figure>
  );
}
