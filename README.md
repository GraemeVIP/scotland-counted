# Glasgow Counted

An independent, fully sourced record of poverty in Glasgow since 2000.

A personal project by Graeme at [Strathmark Consulting](https://strathmarkconsulting.com).
Not commissioned, not funded, no party affiliation.

**The argument:** every figure on this site was already public. It was just spread
across a dozen government portals in formats nobody reads. This puts it in one
place, in plain English, with the source on every number.

---

## Before you deploy

Open `site.config.ts` and change these four things:

| Field | Why |
|---|---|
| `url` | Canonical URLs, sitemap, Open Graph tags and JSON-LD all derive from it. Must be the live domain, no trailing slash — currently set to glasgowcounted.co.uk. |
| `author.name` | Currently just "Graeme" — add your surname if you want the byline to carry it. |
| `contactEmail` | Used on the about and corrections pages. |
| `web3formsKey` | Optional. A free web3forms.com access key; pasting it turns on the email sign-up forms site-wide. |

Nothing else needs touching to go live.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build, 55 static pages
```

## Deploying to Vercel

```bash
npx vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard. There is no configuration to
add: no environment variables, no database, no external services. Every page is
statically generated at build time.

Once the domain is attached, update `site.config.ts` with the real URL and redeploy —
otherwise canonical tags and the sitemap will point at the placeholder.

## After it is live

1. **Google Search Console** — verify the domain and submit `/sitemap.xml`.
2. **Bing Webmaster Tools** — same, it feeds several other engines.
3. Check the Open Graph card renders by pasting the URL into any social composer.
   The card is generated at `/opengraph-image`, and every council area has its own.

## How it is organised

```
site.config.ts              identity, URL, contact — the only file most changes need
src/app/                    routes (App Router)
  page.tsx                    home
  the-numbers/                indicator index
  indicators/[slug]/          six indicator pages
  areas/                      all 32 councils + one page each
  why-glasgow/                the causal argument
  what-would-fix-it/          costed policy options
  accountability/             the record, by tier of government
  take-action/                letter builder (runs entirely in the browser)
  methods/  glossary/  data/  about/  corrections/
  sitemap.ts  robots.ts  opengraph-image.tsx
src/lib/data/               all datasets, typed
  indicators.ts               headline time series
  councils.ts                 32 council areas (generated from the ECP workbook)
  glossary.ts                 20 plain-English definitions
  policy.ts                   costed fixes and the accountability record
  sources.ts                  every source, with what was taken and what was derived
src/components/             chart engine, glossary popover, page furniture
public/data/                the CSVs offered for download
```

## Editing content

- **A figure changed?** Edit `src/lib/data/`. Charts, tables, meta descriptions and
  structured data all read from there, so one edit propagates everywhere.
- **New source?** Add it to `sources.ts` and reference its `id` from the relevant
  indicator. It will appear on the methods page automatically.
- **New glossary term?** Add it to `glossary.ts`, then use `<G t="your-id">word</G>`
  anywhere in the prose.
- **Made a correction?** Add an entry to the `LOG` array in
  `src/app/corrections/page.tsx`. The page is built to show the log publicly, which
  is the point.

## Editorial rules the site holds itself to

These are stated publicly on `/methods` and are worth keeping:

1. Primary sources only — nothing cited from reporting of a statistic.
2. Derived figures are labelled as derived, and validated against a published number
   where one exists.
3. Unreliable data is shown dotted and shaded with the reason, not quietly dropped.
4. Definitional breaks in a series are declared.
5. No individual politician is named, and no claim is made about anyone's motives or
   honesty. The record is decisions and their measured consequences.
6. Corrections are logged in public.

Rule 5 is not timidity. Named, sourced decisions are much harder to dismiss than
accusations, and the site's whole value is that it cannot easily be waved away.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind 4 · TypeScript.
No database, no CMS, no client-side data fetching. Charts are hand-built SVG with
no charting dependency.

## Licence

Analysis, charts and code: free to reuse with attribution.
Underlying data belongs to its original publishers, almost all under the Open
Government Licence.
