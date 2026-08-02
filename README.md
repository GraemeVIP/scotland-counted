# Scotland Counted

Independent evidence on poverty, work and living standards across Scotland, connected directly
to the representatives with the power to act.

A personal project by Graeme at [Strathmark Consulting](https://strathmarkconsulting.com).
Not commissioned, not funded, no party affiliation.

**The argument:** every figure on this site was already public. It was just spread across a dozen
government portals in formats nobody reads. This puts national evidence, all 32 council areas,
all 57 Scottish Westminster constituencies and the Glasgow deep dive in one place, in plain
English, with the source on every number. A postcode then finds the right MP and MSP and prepares
the addressed emails.

---

## Before you deploy

Open `site.config.ts` and change these four things:

| Field | Why |
|---|---|
| `url` | Canonical URLs, sitemap, Open Graph tags and JSON-LD all derive from it, and `src/proxy.ts` serves `noindex` on any host that is not this one. It must match the domain Vercel serves production from, exactly — a mismatch silently noindexes the whole site. Currently `scotlandcounted.org.uk`; `scotlandcounted.co.uk` redirects to it. |
| `author.name` | Currently just "Graeme" — add your surname if you want the byline to carry it. |
| `contactEmail` | Used on the about and corrections pages. |
| `web3formsKey` | Optional. A free web3forms.com access key; pasting it turns on the email sign-up forms site-wide. |

Nothing else needs touching to go live.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deploying to Vercel

```bash
npx vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard. There are no required environment variables or
database. Content pages are statically generated; the representative lookup is a dynamic,
no-storage route. It uses Postcodes.io for the submitted postcode and checked-in snapshots of
official UK and Scottish Parliament data, with official APIs as a fallback.

Once the permanent domain is attached, update `site.config.ts` with it and redeploy — otherwise
canonical tags and the sitemap will continue to point at the temporary Vercel address.

## After it is live

1. **Google Search Console** — verify the domain and submit `/sitemap.xml`.
2. **Bing Webmaster Tools** — verify the canonical domain, submit the sitemap and
   follow the [Bing and IndexNow checklist](docs/bing-indexnow.md).
3. Check the Open Graph card renders by pasting the URL into any social composer.
   The card is generated at `/opengraph-image`, and every council area has its own.

## How it is organised

```
site.config.ts              identity, URL, contact — the only file most changes need
src/app/                    routes (App Router)
  page.tsx                    home
  glasgow-poverty-statistics/ six-measure Glasgow record
  indicators/[slug]/          six indicator pages
  areas/                      poverty, claimant count and pay for all 32 councils
  constituencies/             child poverty for all 57 Scottish Westminster seats
  why-poverty-is-worse-in-glasgow/  founding deep dive and causal argument
  solutions-to-poverty-in-scotland/ costed policy options
  who-is-responsible-for-poverty-in-scotland/ decisions by tier of government
  find-my-mp-and-msp/         postcode lookup and automatically addressed letter builder
  representatives/            crawlable current MP and MSP contact directories
  api/representatives/        no-storage MP/MSP lookup from parliamentary sources
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
- **Representatives changed?** Run `npm run data:update:mps` and
  `npm run data:update:msps`, review the official-data diff, then run the tests before publishing.

## Editorial rules the site holds itself to

These are stated publicly on `/methods` and are worth keeping:

1. Primary sources only — nothing cited from reporting of a statistic.
2. Derived figures are labelled as derived, and validated against a published number
   where one exists.
3. Unreliable data is shown dotted and shaded with the reason, not quietly dropped.
4. Definitional breaks in a series are declared.
5. The analytical record makes no claim about anyone's motives or honesty. Individual politicians
   are named only when the postcode tool retrieves the reader's current representatives from
   official sources.
6. Corrections are logged in public.

Rule 5 is not timidity. Named, sourced decisions are much harder to dismiss than
accusations, and the site's whole value is that it cannot easily be waved away.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind 4 · TypeScript.
No database or CMS. The representative lookup uses one no-storage server route backed by
Postcodes.io and checked-in official parliamentary snapshots, with the official APIs as a
fallback. Charts are hand-built SVG with no charting dependency.

## Licence

Analysis, charts and code: free to reuse with attribution.
Underlying data belongs to its original publishers, almost all under the Open
Government Licence.
