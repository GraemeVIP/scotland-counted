# Site repositioning plan

How Scotland Counted moves from a poverty guide to an independent public-data
and accountability service, without losing the URLs, content or voice it
already has.

Written 3 August 2026. Status is recorded honestly against each phase: only
Phase 1 is implemented at the time of writing.

## Why this is needed

The product outgrew its positioning. The site now covers poverty and living
standards, take-home pay, council tax, council spending and performance, MPs
and MSPs, political responsibility, investigations, downloadable data and
tools for contacting representatives. The homepage still leads as though it
were only about poverty, so a visitor who arrives for their council or their
payslip has to work out for themselves that the rest exists.

The site should answer four questions:

1. What is happening where I live?
2. What does it mean for my money and public services?
3. Who is responsible?
4. What can I do about it?

And it should carry a visitor through a loop: a useful question, a local
result, evidence they can check, the institution responsible, a practical
action, and a reason to come back.

## Baseline, measured before any change

Taken 3 August 2026 on the production build.

| Check | Result |
| --- | --- |
| `npm run lint` | clean |
| `npm test` | 82 passing, 0 failing (88 after Phase 1) |
| `npm run build` | compiles, 620 static pages |
| Routes | 38 route files under `src/app/(site)` |

## Current routes

These are the URLs that exist today. Preserving them is a hard constraint:
several already rank, and the local pages are the ones journalists link to.

Top level: `/`, `/about`, `/areas`, `/blog`, `/browse`, `/constituencies`,
`/contact`, `/corrections`, `/council-tax-bands-scotland`, `/councils`,
`/data`, `/faq`, `/find-my-mp-and-msp`, `/glasgow-poverty-statistics`,
`/glossary`, `/methods`, `/poverty-in-scotland-quiz`, `/press`, `/privacy`,
`/representatives`, `/solutions-to-poverty-in-scotland`,
`/take-home-pay-calculator-scotland`, `/updates`,
`/what-happens-when-you-email-your-mp`,
`/who-is-responsible-for-poverty-in-scotland`, `/why-poverty-is-worse-in-glasgow`.

Dynamic: `/areas/[slug]`, `/blog/[slug]`, `/blog/category/[category]`,
`/constituencies/[slug]`, `/council-tax-bands-scotland/[slug]`,
`/councils/[slug]`, `/indicators/[slug]`, `/representatives/mps/[slug]`,
`/representatives/msps`, `/representatives/msps/constituencies/[slug]`,
`/representatives/msps/regions/[slug]`,
`/representatives/msps/regions/[slug]/[person]`.

**No route in that list is to be deleted or redirected by this work.** New hubs
are added at new paths. Where a hub duplicates an existing page's job, the
existing page stays and the hub links to it.

## Positioning

From: a guide to poverty in Scotland.
To: independent public data for Scotland.

Supporting line: see what Scotland's numbers mean where you live, who is
responsible and what you can do.

It must not read as a government portal, a party, a charity campaign, a news
site, a financial product or an outrage site. The existing voice, direct and
evidence-led, is the thing that keeps it clear of all six.

Poverty stays a flagship subject rather than the umbrella. A `/poverty` hub
gathers the national figures, working poverty, child poverty, the Glasgow
record, the quiz, the explainers and the action route, and the existing
poverty URLs keep working and keep their internal links.

## Homepage migration map

The homepage currently runs a poverty hero, postcode action, video, article
carousel, quiz, share graphic, area directory, national statistics, Glasgow
content, political action, tools and FAQs. Everything below moves. Nothing is
deleted.

| Current homepage section | Component | Moves to | Stays on the homepage as |
| --- | --- | --- | --- |
| Poverty hero | `./Hero` | `/poverty` hero | Broad product hero, postcode first |
| National poverty statistics | `PictoGrid`, `scotlandPoverty` | `/poverty` | One flagship finding |
| Four minute explainer video | `VideoEmbed`, `explainerVideo` | `/poverty` | Nothing |
| Poverty quiz | `Quiz` | `/poverty` and `/poverty-in-scotland-quiz` | Nothing |
| Share graphic | `ShareGraphic`, `infographic` | `/poverty` and `/press` | Nothing |
| Article carousel | `BlogCarousel` | `/blog` and the investigations hub | One featured investigation |
| Area directory | `AreaGrid`, `councilsByLevel` | `/areas` and the my-area hub | A door, not the full list |
| Glasgow spotlight | inline | `/why-poverty-is-worse-in-glasgow`, `/glasgow-poverty-statistics` | Nothing |
| Political action explainer | `WhyBother` | who-decides hub, `/what-happens-when-you-email-your-mp` | A door |
| FAQs | `faqJsonLd` | `/faq` | Nothing |
| Tools | inline | my-money hub | Popular tools strip |

New homepage order: broad hero with postcode entry and a secondary route to
the pay calculator; four or five task-led doors; one current flagship finding;
popular tools; one featured investigation; a trust and evidence strip; a local
updates section.

## Navigation

`src/lib/data/navigation.ts` is already the single registry, exporting
`PRIMARY`, `SECTIONS`, `QUICK_AREAS`, `INVENTORY` and `MENU_FOOTER_LINKS`, and
it is consumed by `Chrome.tsx`, `SiteMenu.tsx`, `/browse` and `not-found.tsx`.
That is the right shape, so the work is to change its contents rather than to
build anything new. Editing one file updates the header, both menus, the
browse page, the 404 and the command palette together, which is what keeps the
navigation systems from disagreeing.

Target primary navigation: My area, My money, Councils, Who decides,
Investigations. Secondary and evidence navigation: Data, Methods, Press,
Updates, Corrections, About, Contact, Accessibility.

## Phases and status

| Phase | Work | Status |
| --- | --- | --- |
| 1 | Proxy matcher export and tests | Done |
| 2 | Positioning and `/poverty` hub | Not started |
| 3 | Homepage hierarchy | Not started |
| 4 | Navigation registry update | Not started |
| 5 | Section hubs | Not started |
| 6 | Postcode journey | Not started |
| 7 | Publisher identity and structured data | Not started |
| 8 | Indexability check and Search Console docs | Not started |
| 9 | Accessibility statement and automated testing | Not started |
| 10 | Performance measurement | Not started |
| 11 | Press release tooling | Not started |
| 12 | Roadmap documentation | Not started |
| 13 | Success metrics documentation | Not started |
| 14 | Regression coverage | Partly, see below |

### Phase 1, implemented

`src/proxy.ts` exported its matcher as `proxyConfig`. Next.js only reads
`config`, and an unrecognised name is not an error: the proxy runs with no
matcher, which the file convention documentation describes as running on every
request including static files. Confirmed by requesting a `_next/static`
stylesheet and getting `X-Robots-Tag` and `X-Frame-Options` back on a path the
matcher excludes.

The matcher has to stay a string literal, because Turbopack static-analyses it
and rejects a variable. `src/proxyMatcher.ts` mirrors it so the tests can
exercise the pattern without importing `next/server`, and a test fails if the
two drift.

Covered by six unit tests in `src/proxy.test.ts` and ten runtime checks in
`scripts/check-proxy.mjs`, runnable with `npm run check:proxy`. Both fail when
the original bug is reintroduced, which was verified rather than assumed.

### Regression coverage already in place

Earlier work added tests that the remaining phases must not weaken:

- Council summaries: every number traces to a sourced field.
- Ranking direction: a rank phrase never contradicts the comparison beside it.
- Cost per pupil is never scored, so low spend is not rendered as a win.
- Reading level: no summary sentence runs past 28 words.
- Plain English: a banned-word list over the council prose and components.
- Rendered spacing: `npm run check:spacing` over every page in the sitemap.

## Constraints carried through every phase

- Analytics, Clarity, consent, tracking, the privacy page and the
  analytics-related CSP rules are out of scope and are not to be touched, even
  incidentally while editing neighbouring files.
- No em dashes in visible copy, metadata, comments or documentation. This is a
  new rule and existing content predates it, so a sweep and a regression test
  are needed in Phase 14.
- No single overall council league table.
- No invented data, rankings or comparisons. Derived figures labelled as
  derived.
- Postcodes are not stored and never appear in a shareable URL.
- Existing URLs preserved. Redirects only where a route genuinely must move.

## Open questions

- The local updates section in Phase 3 depends on whether council-level
  preferences can be supported without changing subscription storage, which is
  out of scope. If they cannot, the section ships behind a disabled flag and
  the implementation is documented in the roadmap instead.
- Similar-council comparison in Phase 5 needs a defensible peer grouping.
  Population, rurality and deprivation are all available from authoritative
  sources, but an arbitrary similarity rule would breach the no-invented-
  comparisons rule. If no defensible grouping exists, the data model is
  documented and the interface left out.
