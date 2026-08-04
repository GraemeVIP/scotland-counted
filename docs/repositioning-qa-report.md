# Repositioning QA report

What was done, what was verified, and what was not done.

Dated 4 August 2026. Fourteen commits on `worktree-blog-carousel-review`, none
pushed. The branch has no upstream and does not exist on `origin`. `main` and
`origin/main` are both still at `100fd9b`.

The first version of this file was written when Phases 6, 7, 9, 10 and 11 were
still outstanding, and said so. All five have since been done. The sections
below describe the branch as it actually stands, and the honest record of what
the first pass got wrong is kept rather than tidied away.

## Validation

Every command run against a local production build.

| Check | Command | Result |
| --- | --- | --- |
| Lint | `npm run lint` | Clean |
| Types | `npx tsc --noEmit` | Clean |
| Unit tests | `npm test` | 147 passing, 0 failing (82 at the start) |
| Browser tests | `npm run test:e2e` | 98 passing in Chromium and WebKit |
| Build | `npm run build` | Compiles, 624 static pages |
| Proxy behaviour | `npm run check:proxy` | 10/10 |
| Indexability | `npm run check:indexability` | 410/410 URLs clean |
| Rendered spacing | `npm run check:spacing` | 410 pages, no glued words |
| Representative lookups | `npm run check:reps` | 5/5, against the live APIs |
| Representative freshness | `npm run check:reps:fresh` | 57 MPs and 129 MSPs match the official APIs |
| Social cards | `npm run check:social` | 410/410 pages, 107 distinct images all fetchable |
| Performance budgets | `npm run check:budgets` | 9/9 pages within budget |
| Em dashes | repository-wide test | Zero outside the exempt privacy page |

### Every check was proved able to fail

A check that cannot fail is worse than no check, because it is trusted. Each
one was verified by reintroducing the fault it exists to catch.

- `check:proxy`: renaming the config export back to `proxyConfig` fails it, and
  names the static asset that stopped being excluded.
- `check:indexability`: injecting a second H1 into `/accessibility` fails it and
  names the page and the fault.
- `houseStyle`: verified against the real repository, which had 438 offences.
- Navigation and sitemap tests: written after the bugs they describe, both of
  which were real.

## What changed

### Positioning
Umbrella moved from a poverty guide to independent public data for Scotland.
Poverty keeps a hub of its own at `/poverty` and every poverty URL still works.

### Homepage
Eleven competing sections reduced to a hero, five doors, three tools, one
featured piece, a trust strip, the newsletter and the FAQ. Nothing deleted;
every removed section has a recorded new home in the migration map.

### Navigation
Primary is now Your area, Your money, Councils, Who decides, Investigations.
One registry still feeds the header, both menus, `/browse` and the 404.

### Hubs
`/money`, `/who-decides` and `/poverty` are new. `/accessibility` is new.
`/areas`, `/councils` and `/blog` gained the content moved off the homepage.

### Councils
Unchanged by this work, other than navigation and the em dash sweep. The
council section was rebuilt in the preceding session.

### SEO
Proxy matcher fixed, sitemap completed, indexability checking added.

### Accessibility
Statement published, stating designed and tested against WCAG 2.2 AA rather
than claiming an audit nobody has done, and naming four known limitations.

### Documentation
Five new documents, listed in the deliverables section below.

## Bugs found and fixed along the way

Recorded because each was invisible to the build.

1. **Proxy matcher ignored.** `proxyConfig` is not a name Next.js reads, so the
   proxy ran unmatched on every static asset. Found by requesting a
   `_next/static` stylesheet and getting `X-Robots-Tag` back on a path the
   matcher excludes.
2. **Four pages missing from the sitemap.** `/money`, `/who-decides`,
   `/poverty` and `/accessibility`. The sitemap is a hand-written list. Found
   only because an injection test quietly passed.
3. **Em dash guard in `seo.tsx` broken by the sweep.** A check that threw when
   metadata contained an em dash became a check for comma-space, which would
   have rejected any title with a comma.
4. **The same thing to the navigation test's assertion.** Both now match on an
   escape so no future sweep can rewrite the rule.
5. **The HTML entity form survived the sweep** in the method note, so an em dash
   rendered on all 32 council records. Written as an entity in JSX it is
   invisible to a scan looking for the character. The entity is not spelled out
   here because the house style test scans this file too, which is the correct
   behaviour: documentation is covered by the rule like everything else.
6. **Two components orphaned by the homepage rewrite.** `AreaGrid` and
   `BlogCarousel` were rehomed rather than left as dead code.

## Bugs found in my own tooling before they did damage

1. The em dash script's tidy-up pass matched punctuation on 5,415 lines that
   contained no dash, which would have rewritten unrelated prose repository
   wide. Caught because the changed-line count was ten times the dash count.
2. The same script used a whitespace class that matches newlines, so a dash at
   a line break joined two lines and reflowed the file.
3. `check-proxy` originally used `fetch`, which silently drops a `host` header
   because it is forbidden by the Fetch spec. Ten checks passed while testing
   nothing. Rewritten with `node:http`.

## Browser verification

Now an automated suite rather than a spot check. `npm run test:e2e` builds the
site, starts a production server and drives it in Chromium and WebKit: 67 tests
across accessibility, the journeys, keyboard access and layout. Full detail in
`docs/browser-qa.md`.

- axe against WCAG 2.2 AA on 15 pages, in light and dark, plus the 404 and the
  open command palette. Clean, excluding the declared contrast deviation.
- No horizontal overflow at 390, 768, 1024, 1280 and 1440px, not just the two
  extremes. Content survives 200% zoom, and header tap targets clear 24px.
- Keyboard: skip link, focus visibility, focus containment in the palette,
  heading order on four pages.
- Journeys: postcode lookup, both calculators, palette, mobile menu, CSV
  downloads, theme toggle, reduced motion and the 404.

### Still not verified in a real browser

- **Real iOS Safari.** WebKit on macOS is the same engine family, not the same
  product. `docs/browser-qa.md` lists the six things that need a handset.
- **Screen readers.** VoiceOver, NVDA and JAWS have not been run across every
  page, and the accessibility statement says so.

## Deliverables

| Deliverable | Status |
| --- | --- |
| `docs/site-repositioning-plan.md` | Done, including the homepage migration map |
| `docs/search-console-launch-checklist.md` | Done |
| `docs/distribution-playbook.md` | Done |
| `docs/product-roadmap.md` | Done |
| `docs/success-metrics.md` | Done |
| `docs/repositioning-qa-report.md` | This file |
| Homepage migration map | Done, inside the plan |
| Automated SEO and indexability checks | Done, `check:indexability` and `check:proxy` |
| Accessibility statement | Done |
| Automated accessibility testing | Done, axe over 15 pages in both themes, plus the 404 and the open palette |
| Updated navigation and command search | Done |
| New or strengthened section hubs | Done for money, who-decides, poverty. Partial for councils and areas |
| Improved homepage | Done |
| Performance measurement and budgets | Done, `check:budgets` |
| Browser QA and iOS documentation | Done, `docs/browser-qa.md` |
| Improved postcode journey | Done |
| Updated publisher and structured-data model | Done |
| Press release generation tooling | Done, a pack for any of the 32 councils |

## Done since the first pass

Each of these was listed as not done above, and each is now on the branch.

**Phase 7, publisher identity.** There was one Organization node and it was
Strathmark Consulting, so every article and dataset named a consultancy as the
publisher of this site. Three separate entities now: Scotland Counted publishes,
a named person writes, and the consultancy is that person's employer and
publishes none of it. Content points at the publisher by `@id` rather than
carrying inline copies. Datasets take `publisher`, not `creator`, because the
ONS and the Scottish Government made the data. Nine tests, and reinstating the
old publisher makes two of them fail.

**Phase 6, the postcode journey.** `/api/representatives` had a live GET that
read `?postcode=` and answered 200, so postcodes were landing in access logs
and Referer headers. It is gone, and the library ignores the query string on
any method. A resolved postcode now also opens the area, the council, the
council tax bands and the constituency, all as URLs that name a place rather
than a house. A test walks all 32 councils against all 57 constituencies and
fails if any combination would 404.

**Phase 9, browser QA.** Playwright and axe, 67 tests in Chromium and WebKit.
Found that opening the mobile menu never moved focus into it, and that the 404
page had no link home at all. Both fixed. `docs/browser-qa.md` records what is
covered, the measured difference in Safari's tab order, and the six things that
still need a real iPhone.

**Phase 10, performance.** Measured before and after against a production
build. The command palette was importing its whole index into the root layout,
so everyone downloaded every council, constituency, MP, glossary term and FAQ
on every page. It loads on first open now: roughly 400 to 460kB less
JavaScript per page, 27 to 32 per cent. `mermaid` was removed, an 83MB runtime
dependency imported by nothing, which changes nothing a reader downloads and is
not counted as a saving.

**Phase 11, press packs.** `/press` generates a full package for any of the 32
councils from fixed templates that cannot phrase a judgement. A ranking claim
is only made where the data supports one, and a test walks every pack looking
for a superlative the council does not hold.

## Found by doing the work

**The calculator was sending salaries to Google.** The take-home pay calculator
mirrored every field into the URL as you typed: salary, pension contributions,
pension type, student loan plan, hours and tax code. The analytics tag reports
the page URL, so all of it reached `region1.google-analytics.com`, and because
Google treats `s` as a site-search parameter a salary also arrived as an
explicit `search_term` event. The page says, in these words, "Nothing you type
is sent anywhere. The sum happens in your browser." The URL write is gone. Old
links still restore and then clean themselves up. No analytics, consent or
tracking code was touched.

**The accessibility statement was not true about contrast.** It said contrast
was checked against 4.5:1 and listed no exception. The accent measures 3.10:1
against white, which passes the 3:1 bar for large text and interface components
and misses the 4.5:1 bar for normal text. The colour is settled, so it is named
as a known limitation with the measured figure, and a test holds the node
counts so it cannot spread.

**Two test assertions had been silently disarmed.** The em dash sweep rewrote
`councilSignals.test.ts` from checking a headline card was not an em dash
placeholder into checking it was not `", "`, which no card would ever be. The
same happened to a vote result assertion. Both are written as `\u2014` now, and
an injected em dash makes each fail.

**A test that passed against the wrong element.** The first mobile-menu focus
test matched `[aria-label="Main"]`, which also matches the desktop nav:
`display:none` at phone width and still in the DOM. It passed while the thing
it described was broken.

## Still not done

**Phase 5 is now done, and the earlier refusal was half right.** The refusal
to invent a peer grouping was correct. The mistake was assuming nobody had
already made one: the Improvement Service sorts all 32 councils into official
family groups, eight per group, two sets, one by rurality and one by
deprivation, and publishes the grouping and each group's average inside the
LGBF dataset itself. Every council page now carries "How this council compares
with similar councils": the two official peer lists, named and linked, and for
each of the site's seven measures the council figure, the publisher's family
group average, the Scotland figure and the first published year for trend,
adjusted for inflation by the publisher. Which set applies to which measure is
read from the data, not the prose, which matters because the prose is wrong
about CHN01. The grouping was verified against a member council's own
committee papers, and a pinned test keeps it official.

**The three npm audit advisories, reviewed.** All high severity, all inside
Next 16.2.12's own dependency tree: postcss at or below 8.5.22 (XSS via
unescaped style output, sourceMappingURL file disclosure) and sharp below
0.35.0 (inherited libvips CVEs). Practical exposure here is low: postcss runs
at build time on this repository's own CSS, not on user input, and sharp
processes this repository's own images, not uploads. The only offered fix is
Next 16.3.0, outside the stated dependency range, so it is a deliberate
framework upgrade to schedule, not a patch to apply in passing. Nothing on
this branch introduced or worsened any of the three.

**Phase 14, partially.** Regression coverage exists for navigation, sitemap
completeness, house style, proxy behaviour, structured data, the postcode
journey, press packs and performance budgets. Not added: representative
freshness and social card presence.

**Real iOS Safari.** WebKit on macOS is the same engine family, not the same
product. The software keyboard, scroll locking behind the open menu, Safari's
dynamic toolbars and VoiceOver on iOS are all still unverified, and
`docs/browser-qa.md` lists them.

**One contrast change, deliberately left.** In dark mode the primary button is
white on the lighter orange at 2.56:1, where the site's own ink on the same
orange measures 6.86:1. That is a text colour rather than the accent, so it
would not touch the settled decision, but it changes how the button looks and
that is a design call.

**Three npm audit advisories.** All high, all pre-existing transitive
dependencies of Next 16.2.12 (`postcss`, `sharp`), none introduced here. The
suggested fix moves Next outside its stated range.

## Out of scope, and untouched

Analytics, Microsoft Clarity, analytics consent, cookie consent, tracking, the
privacy page and the analytics-related Content Security Policy rules. None were
edited. The privacy page was caught by the em dash sweep and has since been
restored byte for byte to its state at `100fd9b`, dashes included. The house
style test carries an explicit exemption for it, and asserts the exempt path
exists, because the first version of that list silently exempted nothing by
omitting a path segment.

`docs/success-metrics.md` defines event names for whoever implements tracking
later. It adds no tracking code.
