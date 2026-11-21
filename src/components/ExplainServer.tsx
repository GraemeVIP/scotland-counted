import type { ReactNode } from "react";
import { G } from "@/components/Glossary";
import { annotateNode } from "@/components/glossaryAnnotate";

/**
 * ExplainText for pages built on the server. The browser version only sees
 * the parts of a server page that React sends it whole, so some paragraphs
 * missed their tooltips. This runs on the server with the full page in hand.
 */
export function ExplainText({ children }: { children: ReactNode }) {
  return <>{annotateNode(children, "glossary", G)}</>;
}
