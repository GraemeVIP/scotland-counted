import { getPost, posts } from "@/lib/data/posts";
import { POST_PATHS } from "@/lib/routeMap";
import postImage from "../../(site)/blog/[slug]/opengraph-image";

export function generateStaticParams() {
  return posts.filter((post) => POST_PATHS[post.slug] && !post.shareImage)
    .map((post) => ({ slug: post.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!POST_PATHS[slug] || !getPost(slug)) return new Response(null, { status: 404 });
  return postImage({ params: Promise.resolve({ slug }) });
}
