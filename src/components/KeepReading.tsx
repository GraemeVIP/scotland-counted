import Link from "@/components/IntentLink";
import { getPostCategory, type Post } from "@/lib/data/posts";
import type { NudgeBridge, NudgeTool } from "@/lib/data/nudges";
import { postPath } from "@/lib/routeMap";

/**
 * "Read this next", straight after the article and before the questions,
 * sources and author note: the point where reading naturally ends. Nothing
 * like it sits at the top or in the middle of an article, so readers finish
 * the page first.
 *
 * Kept slim and quiet on purpose: a short list of three articles on the same
 * topic, then one line each for the tool that answers the next practical
 * question and the expenses story that ties the topic to what politicians
 * claimed.
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
      data-nudge="keep_reading"
      aria-labelledby="keep-reading"
      className={`rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] px-5 py-5 sm:px-6 ${className}`}
    >
      <h2 id="keep-reading" className="ui text-[18px] font-[680] leading-[1.3] text-[var(--ink)]">
        Read this next
      </h2>

      {posts.length > 0 && (
        <ul className="mt-2 divide-y divide-[var(--rule)]">
          {posts.map((post) => {
            const category = getPostCategory(post.category);
            return (
              <li key={post.slug} className="py-3">
                <Link href={postPath(post.slug)} className="ui text-[16px] font-[620] leading-[1.4]">
                  {post.title}
                </Link>
                <span className="ui mt-0.5 block whitespace-nowrap text-[14px] text-[var(--muted)] sm:ml-2 sm:mt-0 sm:inline">
                  {category?.name} · {post.readingMinutes} min
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {(tool || bridge) && (
        <div className="mt-2 grid gap-2 border-t border-[var(--rule)] pt-4 sm:grid-cols-2 sm:gap-4">
          {tool && <QuietLink kicker={tool.kicker} text={tool.title} href={tool.href} cta={tool.cta} />}
          {bridge && (
            <QuietLink kicker="From the expenses files" text={`${bridge.stat}: ${bridge.text}`} href={bridge.href} cta={bridge.cta} />
          )}
        </div>
      )}
    </section>
  );
}

function QuietLink({ kicker, text, href, cta }: { kicker: string; text: string; href: string; cta: string }) {
  return (
    <Link
      href={href}
      className="group block rounded-[var(--r-s)] px-1 py-1 text-[15px] leading-[1.45] text-[var(--ink-2)] no-underline"
    >
      <span className="ui block text-[12.5px] font-[640] uppercase tracking-[0.06em] text-[var(--muted)]">{kicker}</span>
      <span className="mt-0.5 block">{text}</span>
      <span className="ui mt-1 block font-[620] text-[var(--action-text)] group-hover:underline">
        {cta} <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
