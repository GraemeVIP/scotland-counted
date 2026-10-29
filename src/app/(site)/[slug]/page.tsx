import { notFound } from "next/navigation";
import { resolveTopLevel, topLevelSegments } from "@/lib/routeMap";
import { CouncilTaxDetail, councilTaxMetadata } from "../council-tax-bands-scotland/CouncilTaxDetail";
import { PostView, postMetadata } from "../blog/PostView";

/**
 * Exact match addresses at the top level: /glasgow-council-tax-bands,
 * /council-tax-band-d-scotland, /minimum-wage-scotland and the rest.
 *
 * Static routes at this level always win over this one, so it only ever sees
 * addresses that routeMap.ts lists. Anything else is a 404.
 */

export function generateStaticParams() {
  return topLevelSegments().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const target = resolveTopLevel(slug);
  if (!target) return {};
  if (target.kind === "council-tax") return councilTaxMetadata(target.councilSlug);
  if (target.kind === "council-tax-band") return councilTaxMetadata(`band-${target.letter}`);
  return postMetadata(target.postSlug);
}

export default async function TopLevelPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const target = resolveTopLevel(slug);
  if (!target) notFound();
  if (target.kind === "council-tax") return <CouncilTaxDetail slug={target.councilSlug} />;
  if (target.kind === "council-tax-band") return <CouncilTaxDetail slug={`band-${target.letter}`} />;
  return <PostView slug={target.postSlug} />;
}
