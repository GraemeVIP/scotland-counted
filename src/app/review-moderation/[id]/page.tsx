import type { Metadata } from "next";
import ModerationPanel from "./ModerationPanel";

export const metadata: Metadata = {
  title: "Review moderation",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default async function ReviewModerationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[760px]">
        <p className="ui mb-10 text-[18px] font-[800] tracking-[-0.04em]">Scotland<span className="text-[var(--action)]">Counted</span></p>
        <ModerationPanel id={id} />
      </div>
    </main>
  );
}
