import Image from "next/image";
import Link from "next/link";
import { getPostCategory, type Post } from "@/lib/data/posts";

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ArticleCard({
  post,
  heading = "h2",
}: {
  post: Post;
  heading?: "h2" | "h3";
}) {
  const category = getPostCategory(post.category);
  const titleClass =
    "text-[22px] font-[760] leading-[1.22] mt-3 text-[var(--ink)] group-hover:text-[var(--action)] transition-colors";
  const title = heading === "h3" ? (
    <h3 className={titleClass}>{post.title}</h3>
  ) : (
    <h2 className={titleClass}>{post.title}</h2>
  );

  return (
    <article className="group min-w-0 overflow-hidden rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--rule-strong)] transition-colors">
      <Link href={`/blog/${post.slug}`} className="block no-underline">
        <div className="relative aspect-[3/2] overflow-hidden bg-[var(--paper-3)]">
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            sizes="(min-width: 1024px) 430px, (min-width: 640px) 50vw, calc(100vw - 40px)"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            style={{ objectPosition: post.image.objectPosition ?? "center" }}
          />
        </div>
        <div className="p-5 sm:p-6">
          <p className="ui text-[15px] font-[750]" style={{ color: category?.color }}>
            {category?.name}
          </p>
          {title}
          <p className="text-[16px] leading-[1.55] text-[var(--ink-2)] mt-3">
            {post.standfirst}
          </p>
          <p className="text-[15px] text-[var(--muted)] mt-4">
            {fmtDate(post.updated ?? post.date)} · {post.readingMinutes} min read
          </p>
        </div>
      </Link>
    </article>
  );
}
