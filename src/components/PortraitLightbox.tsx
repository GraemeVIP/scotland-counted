"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type PortraitLightboxProps = {
  src: string;
  alt: string;
  sizes: string;
  className: string;
  priority?: boolean;
};

/** A keyboard-accessible portrait trigger with a larger view for touch users. */
export default function PortraitLightbox({
  src,
  alt,
  sizes,
  className,
  priority = false,
}: PortraitLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => setOpen(false);
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  return (
    <>
      <button
        type="button"
        className={`border-0 bg-transparent p-0 text-left ${className} group cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2`}
        onClick={() => setOpen(true)}
        aria-label={`View a larger portrait: ${alt}`}
        title="Open a larger portrait"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top"
        />
        <span className="pointer-events-none absolute inset-x-1 bottom-1 rounded bg-black/65 px-1.5 py-1 text-center text-[15px] font-[700] leading-none text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          View larger
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={`Larger portrait: ${alt}`}
        onCancel={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
        className="m-auto max-h-[92vh] max-w-[94vw] rounded-[var(--r-m)] bg-transparent p-0 backdrop:bg-black/75"
      >
        <div className="relative rounded-[var(--r-m)] border border-white/15 bg-[var(--surface)] p-3 shadow-2xl sm:p-5">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--surface)] text-[24px] leading-none text-[var(--ink)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            aria-label="Close larger portrait"
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="relative h-[min(76vh,760px)] w-[min(88vw,640px)] overflow-hidden rounded-[var(--r-s)] bg-[var(--surface-2)]">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 88vw, 640px"
              className="object-contain"
            />
          </div>
          <p className="ui mt-3 pr-12 text-[15px] leading-[1.45] text-[var(--ink-2)]">{alt}</p>
        </div>
      </dialog>
    </>
  );
}
