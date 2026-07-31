import { Header, Footer } from "@/components/Chrome";
import { JsonLd, orgJsonLd } from "@/lib/seo";

/** Site chrome for every ordinary page. Embed routes skip this. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <JsonLd data={orgJsonLd()} />
    </>
  );
}
