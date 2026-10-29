import { notFound } from "next/navigation";
import { posts } from "@/lib/data/posts";
import { POST_PATHS } from "@/lib/routeMap";
import { PostView, postMetadata } from "../PostView";

/** Posts that moved to a top level address are served there; next.config.ts redirects here. */
export function generateStaticParams() {
  return posts.filter((post) => !POST_PATHS[post.slug]).map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  return postMetadata(slug);
}

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  if (POST_PATHS[slug]) notFound();
  return <PostView slug={slug} />;
}
