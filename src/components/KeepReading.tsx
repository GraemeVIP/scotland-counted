import Link from "@/components/IntentLink";
import { ExplainText } from "@/components/ExplainServer";
import { getPostCategory, type Post } from "@/lib/data/posts";
import type { NudgeBridge, NudgeTool } from "@/lib/data/nudges";
import { postPath } from "@/lib/routeMap";

/**
 * "Read this next", straight after the article and before the questions,
 * sources and author note, where most readers still are. It offers three
 * articles on the same topic, the tool that answers the next practical
 * question, and one expenses story with a real figure that ties the topic to
 * what politicians claimed.
 */
export function KeepReading({
  posts,
  tool,
  bridge,
  className = "",
}: {
  posts: Post[];
  tool?: NudgeTool;
  bridge?: NudgeBridge;
  className?: string;
}) {
  if (posts.length === 0 && !tool && !bridge) return null;
  return (
    <section
      aria-labelledby="keep-reading"
      className={`rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7 ${className}`}
    >
      <p className="label">Keep going</p>
      <h2 id="keep-reading" className="ui mt-1 text-[22px] font-[700] leading-[1.25] text-[var(--ink)] sm:text-[26px]">
        Read this next
      </h2>

      <div className={`mt-4 grid gap-6 ${tool ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-start" : ""}`}>
        {posts.length > 0 && (
          <ol className="divide-y divide-[var(--rule)]">
            {posts.map((post, index) => {
              const category = getPostCategory(post.category);
              return (
                <li key={post.slug} className="flex items-start gap-4 py-3.5 first:pt-0">
                  <span aria-hidden="true" className="figure-num tnum w-7 shrink-0 pt-0.5 text-[20px] leading-none text-[var(--brand)]">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link href={postPath(post.slug)} className="ui text-[17px] font-[660] leading-[1.35]">
                      {post.title} <span aria-hidden="true">→</span>
                    </Link>
                    <p className="ui mt-1 text-[14.5px] leading-[1.45] text-[var(--muted)]">
                      <span style={{ color: category?.color }} className="font-[600]">
                        {category?.name}
                      </span>{" "}
                      · {post.readingMinutes} min read
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {tool && <ToolCard tool={tool} />}
      </div>

      {bridge && <BridgeRow bridge={bridge} className="mt-5" />}
    </section>
  );
}

/** The dark "do this next" card. Used here and in the middle of articles. */
export function ToolCard({ tool, className = "" }: { tool: NudgeTool; className?: string }) {
  return (
    <aside
      className={`not-prose rounded-[var(--r-m)] bg-[var(--deep)] p-5 text-[var(--deep-ink)] sm:p-6 ${className}`}
      style={{ boxShadow: "var(--shadow-2)" }}
    >
      <p className="kicker mb-2 text-[var(--action-text)]">{tool.kicker}</p>
      <p className="text-[20px] font-[640] leading-[1.25]">{tool.title}</p>
      <p className="mt-2 text-[15.5px] leading-[1.5] opacity-85">
        <ExplainText>{tool.body}</ExplainText>
      </p>
      <Link href={tool.href} className="btn btn-primary mt-4">
        {tool.cta} <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}

/** One expenses figure with the line that explains it, linking to the story. */
export function BridgeRow({ bridge, className = "" }: { bridge: NudgeBridge; className?: string }) {
  return (
    <Link
      href={bridge.href}
      className={`not-prose group flex flex-col gap-2 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] px-4 py-4 no-underline transition-colors hover:border-[var(--brand)] sm:flex-row sm:items-center sm:gap-5 sm:px-5 ${className}`}
    >
      <span className="figure-num tnum shrink-0 text-[26px] leading-none text-[var(--bad-text)] sm:text-[30px]">
        {bridge.stat}
      </span>
      <span className="min-w-0 flex-1">
        <span className="ui block text-[12.5px] font-[640] uppercase tracking-[0.06em] text-[var(--muted)]">
          From the expenses files
        </span>
        <span className="mt-1 block text-[16px] leading-[1.45] text-[var(--ink)]">{bridge.text}</span>
      </span>
      <span className="ui shrink-0 text-[15px] font-[640] text-[var(--action-text)] group-hover:underline">
        {bridge.cta} <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
