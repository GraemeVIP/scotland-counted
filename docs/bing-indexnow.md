# Bing and IndexNow launch checklist

IndexNow tells participating search engines that a canonical URL was added,
meaningfully updated, moved or deleted. It helps discovery; it does not guarantee
crawling, indexing, ranking or inclusion in an AI answer.

The site keeps wildcard crawling open in `src/app/robots.ts` and publishes the
canonical sitemap there. No bot-specific rules are needed.

## One-time setup

1. Deploy the production domain and confirm that this file returns HTTP 200 with
   only the key as its body:

   `https://scotlandcounted.org.uk/9e299ef33d078ff12fc3a9f51833ffa5.txt`

2. Add `https://scotlandcounted.org.uk` to
   [Bing Webmaster Tools](https://www.bing.com/webmasters/). Bing supports importing
   an already verified Google Search Console property or manual verification by
   XML file, meta tag or DNS CNAME.
3. Submit `https://scotlandcounted.org.uk/sitemap.xml` in Bing Webmaster Tools.
   It is also advertised in `robots.txt`.

Do not send an IndexNow request before step 1. The submit command enforces this by
fetching the deployed key file and comparing its contents before it contacts the
IndexNow endpoint.

## Notify changed URLs after a deployment

For a commit containing only directly mapped page or article changes, compare it
with the previous deployed Git revision:

```bash
npm run indexnow:plan -- --base <previous-deployed-git-ref>
npm run indexnow:submit -- --base <previous-deployed-git-ref>
```

The plan is a dry run. Review it before submitting. Shared templates and data files
can affect an unknown set of pages, so Git-based discovery deliberately stops and
asks for exact URLs instead of guessing:

```bash
npm run indexnow:plan -- \
  --url /areas \
  --url /areas/glasgow-city

npm run indexnow:submit -- \
  --url /areas \
  --url /areas/glasgow-city
```

The submit command:

- accepts only URLs on the configured canonical HTTPS origin;
- rejects queries and fragments;
- checks the deployed key file first;
- requires changed live pages to be HTTP 200, self-canonical, indexable and in the
  deployed sitemap;
- permits a URL marked deleted by the Git comparison only when production returns
  a redirect, 404 or 410;
- sends one deduplicated JSON batch to the global IndexNow endpoint;
- exits non-zero on invalid keys, bad deployment state, network failure or any API
  response other than HTTP 200 or 202; and
- records accepted revision/URL fingerprints in `.git/indexnow-submissions.json`,
  so rerunning the same batch in the same checkout does not notify twice.

Use `--force` only when there has been another meaningful deployment for the same
revision and the same URLs. IndexNow's own guidance says not to submit cosmetic
changes or repeatedly submit unchanged URLs.

## Measure it in Bing Webmaster Tools

After the first accepted request, open **IndexNow** in Bing Webmaster Tools and
check:

- **Submitted URLs** and submission time;
- each sample URL's crawl status, index status and first-indexed time;
- **Important URLs Missing**, which highlights recently discovered URLs not sent
  through IndexNow; and
- **URL Inspection** for a specific canonical URL.

A newly verified Bing property can take up to 48 hours to populate analytics.
IndexNow's HTTP 200 means the batch was received; HTTP 202 means it was received
while key validation is pending. Neither response promises indexing.

## Official references

- [IndexNow protocol documentation](https://www.indexnow.org/documentation)
- [IndexNow FAQ and automation guidance](https://www.indexnow.org/faq)
- [Add and verify a site in Bing Webmaster Tools](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b)
- [Submit and inspect sitemaps in Bing Webmaster Tools](https://www.bing.com/webmasters/help/Sitemaps-3b5cf6ed)
- [IndexNow Insights in Bing Webmaster Tools](https://www.bing.com/webmasters/help/indexnow-0z209wby)

`llms.txt` is maintained as a concise description for systems that choose to read
it. Neither IndexNow nor Bing documents it as a ranking control, so it should not
be treated as one.
