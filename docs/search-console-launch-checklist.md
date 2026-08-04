# Search Console launch checklist

What to inspect after the repositioning ships, and what a healthy result looks
like.

This is written from the repository, not from Search Console. Nobody has looked
at the account, so nothing here reports what Google currently thinks. Every
figure below is something to go and check.

## Before you open Search Console

Run the automated checks against a local production build first. They catch
most of what Search Console would tell you weeks later.

```bash
npm run build
npm start &
npm run check:indexability
npm run check:proxy
npm run check:spacing
```

`check:indexability` walks all 410 sitemap URLs and reports missing titles,
duplicate canonicals, second H1s and metadata leaking a preview host.

## Submit the sitemap

`https://scotlandcounted.org.uk/sitemap.xml`

It should report 410 discovered URLs. If the number is lower than the count
that `check:indexability` prints, the sitemap has not been re-fetched yet.

## URLs to inspect first

Inspect these in this order. The first four are new and have no history, so
they are the ones that will sit in "Discovered, currently not indexed" longest.

| URL | Why | What good looks like |
| --- | --- | --- |
| `/` | Repositioned. Title, description and H1 all changed | Indexed, canonical is itself, new title shown |
| `/money` | New hub | Indexed within two weeks of submission |
| `/who-decides` | New hub | Indexed, FAQ rich result eligible |
| `/poverty` | New hub, and the subject the site used to lead with | Indexed, no competition with `/` |
| `/accessibility` | New, low priority | Indexed eventually, no errors |
| `/councils` | Repositioned in navigation | Still indexed, no change in canonical |
| `/councils/stirling` | A representative council record | Indexed, canonical self-referencing |
| `/take-home-pay-calculator-scotland` | Highest-intent page on the site | Indexed, no drop after the homepage change |

For each one, use URL Inspection and check:

- Coverage says the page is on Google
- The user-declared canonical and the Google-selected canonical are the same
- Referring page is not empty, meaning it is genuinely linked from the site
- The rendered HTML shows the content, not an empty shell
- No `noindex` reported

## Canonical checks

The proxy sends `X-Robots-Tag: noindex, follow` on every host except
`scotlandcounted.org.uk`. That is deliberate and it protects the preview
deployments.

The thing to verify is the opposite: that the canonical host is **not** being
sent it. `npm run check:proxy` asserts this, and the first check in that script
exists because a forgotten noindex on the real domain is the single most
expensive mistake available.

If Search Console reports "Excluded by noindex tag" on a canonical URL, check
the host that Googlebot actually resolved before changing any code.

## Page indexing categories, and what each means here

| Category | Likely cause on this site | Action |
| --- | --- | --- |
| Discovered, currently not indexed | New page, no internal links yet, or crawl budget | Check it is in the navigation registry and linked from a hub |
| Crawled, currently not indexed | Google judged it thin or duplicative | Compare it against the nearest existing page; if they answer the same question, merge rather than differentiate |
| Duplicate, Google chose a different canonical | Two pages answering one query | Check `check:indexability` for duplicate canonicals first |
| Alternate page with proper canonical tag | Expected on `/blog/category/*` | No action |
| Excluded by noindex tag | Wrong host, or a genuine mistake | Run `npm run check:proxy` |

## Rich results to validate

- **FAQ**: `/`, `/money`, `/who-decides`, `/councils/[slug]`
- **Dataset**: `/areas`, `/data`
- **BlogPosting**: `/blog/[slug]`
- **Breadcrumb**: every hub and every dynamic page

Validate with the Rich Results Test. `check:indexability` already fails on any
structured-data field that is present but empty, which is the failure that
silently disqualifies a rich result.

## Duplicate local pages

The site has three families of local page and they are easy to confuse:

- `/areas/[slug]` is poverty, work and pay for a council area
- `/councils/[slug]` is that council's budget and performance record
- `/council-tax-bands-scotland/[slug]` is that council's tax bands

If Google starts folding these into one another, the fix is editorial, not
technical: each needs a title and an H1 that names a different question.

## Clusters worth watching separately

Set up three filters in Performance and read them apart, because their queries
behave differently:

1. **Calculators**: `/take-home-pay-calculator-scotland`,
   `/council-tax-bands-scotland/*`. High intent, seasonal around April.
2. **Councils**: `/councils/*`. Should rise when a council story runs locally.
3. **Representatives**: `/representatives/*`. Name searches, spiky.

A fall in one and a rise in another is normal. A fall in all three at once is a
site-level problem, and the first thing to check is the canonical host.

## After a council story runs

Local coverage sends a burst of traffic to one `/councils/[slug]` page. Two
days later, check that page in URL Inspection: a page that suddenly earns
external links often gets recrawled and can change its Google-selected
canonical if a near-duplicate exists.
