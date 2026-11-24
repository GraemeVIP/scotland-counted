import { Header, Footer } from "@/components/Chrome";
import CommandPalette from "@/components/Command";
import AnnouncementBar from "@/components/AnnouncementBar";
import CookieBanner from "@/components/CookieBanner";
import NudgeTracker from "@/components/NudgeTracker";
import { BAR_HIDE_SCRIPT } from "@/lib/announcement";
import { JsonLd, orgJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

/** Site chrome for every ordinary page. Embed routes skip this. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const analyticsEnabled = Boolean(site.analytics.ga4 || site.analytics.clarity);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {/* Hides the top strip before it paints if this browser closed it. */}
      <script dangerouslySetInnerHTML={{ __html: BAR_HIDE_SCRIPT }} />
      <AnnouncementBar />
      <NudgeTracker />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      {analyticsEnabled && <CookieBanner />}
      <CommandPalette />
      <JsonLd data={orgJsonLd()} />
    </>
  );
}
