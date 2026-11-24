import { posts } from "@/lib/data/posts";
import { renderPostOg } from "@/lib/ogResolver";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Image(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  return renderPostOg(slug);
}
