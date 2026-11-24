<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Scotland Counted editorial image rule

- **Zero duplicate article images:** Every article in `src/lib/data/posts.ts` MUST have its own unique `image.src` file under `public/images/editorial/`. Never reuse another article's or hub page's editorial image on a new post. This rule is enforced automatically by `src/lib/readability.test.ts`.

## Scotland Counted article approval rule

- **Show Graeme every article on the local preview site before it goes live:** Keep a local preview server running and give Graeme the localhost URL so he can review the full page (headline, standfirst, body, charts, and image/photo) in his browser before committing, pushing, or deploying to the live site.


