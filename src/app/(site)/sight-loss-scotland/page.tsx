import { Page, ContentFrame } from "@/components/Blocks";
import Breadcrumbs from "@/components/Breadcrumbs";
import { meta } from "@/lib/seo";
import SightLossWorkspace from "./SightLossWorkspace";

export const metadata = meta({
  title: "Sight Loss and Blindness in Scotland: Data, Rights & Benefits",
  description:
    "Data-led guide for blind and partially sighted people in Scotland. Includes a High Contrast Dark + Large Text mode, 2026/27 tax savings checker, CVI steps, and direct Scottish helplines.",
  path: "/sight-loss-scotland",
});

export default function SightLossScotlandPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Benefits", path: "/benefits" },
          { name: "Sight loss in Scotland", path: "/sight-loss-scotland" },
        ]}
      />
      <Page>
        <ContentFrame className="py-6 sm:py-10">
          <SightLossWorkspace />
        </ContentFrame>
      </Page>
    </>
  );
}
