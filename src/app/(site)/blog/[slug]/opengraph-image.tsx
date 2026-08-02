import { ImageResponse } from "next/og";
import { getPost, getPostCategory, posts } from "@/lib/data/posts";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

/**
 * Blog photos are deliberately editorial 3:2 images on the page. Social
 * networks use a roughly 1.91:1 card, so giving each post its own 1200x630
 * share image avoids an accidental crop of the original photograph.
 */
export default async function Image(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = getPost(slug);
  const category = post ? getPostCategory(post.category) : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#16203a",
          color: "#ffffff",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: category?.colorOnDark ?? "#ff8b75",
          }}
        >
          {category?.name ?? "Explained in plain English"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 58,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.08,
              maxWidth: 1030,
            }}
          >
            {post?.title ?? "Scotland Counted"}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#a8b1c1" }}>
            Scotland Counted · plain-English answers backed by the evidence
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 28,
            borderTop: "2px solid rgba(255,255,255,0.16)",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex", fontWeight: 700 }}>
            Scotland<span style={{ color: "#ff5a3c" }}>Counted</span>
          </div>
          <div style={{ display: "flex", color: "#a8b1c1" }}>{site.url.replace("https://", "")}</div>
        </div>
      </div>
    ),
    size
  );
}
