# Browser QA

What is checked in a real browser, what was found, and what still needs a
device nobody here has.

Run it:

```bash
npm run test:e2e
```

That builds the site, starts a production server on port 3311 and drives it in
Chromium and WebKit. `npm run test:e2e:a11y` runs the axe sweep alone.

Everything else in this repository is checked without a browser: types, 112
unit tests, a proxy check over real sockets, an indexability crawl of all 410
sitemap URLs. None of that can tell you whether the mobile menu moves focus,
whether a calculator can be filled in from the keyboard, or whether a page
scrolls sideways on a 390px phone.

## What it covers

| File | What it asserts |
| --- | --- |
| `e2e/a11y.spec.ts` | axe against WCAG 2.2 AA on 15 pages, in light and dark, plus the 404 and the open command palette |
| `e2e/journeys.spec.ts` | postcode lookup, both calculators, command palette, mobile menu, CSV downloads, embeds, theme toggle, reduced motion, 404 |
| `e2e/keyboard.spec.ts` | skip link, focus visibility, focus containment in the palette, heading order |
| `e2e/responsive.spec.ts` | no sideways scroll at 390, 768, 1024, 1280 and 1440px; 200% zoom; tap-target size |

The Parliament lookups are stubbed. A suite that goes red when somebody else's
server is slow is a suite people learn to ignore. The real API is exercised by
`npm run check:reps` instead, which calls it for five postcodes.

## What it found

**The mobile menu never moved focus into itself.** Opening the sheet left
focus on the burger button underneath a full-screen overlay, so a keyboard or
screen-reader user was told nothing had happened and had to tab forward blindly
into a menu already in front of them. Closing it did not put focus back either.
Fixed in `src/components/SiteMenu.tsx`: the sheet focuses its close button on
open and restores focus on close.

This one is worth dwelling on. The component already had an `autoFocus` prop
threaded through it for exactly this purpose, and nothing ever passed it as
`true`. The first version of the test passed anyway, because its selector
matched the desktop nav that is `display:none` at phone width but still in the
DOM. A test that passes against the wrong element is worse than no test.

**The 404 page had no way home.** `not-found.tsx` sits outside the `(site)`
route group, so it does not get the site header, and none of its links pointed
at `/`. Every route out of it went sideways. It now carries the wordmark,
linked home. The same page also still had a comma splice left over from the
em dash sweep.

## The known contrast shortfall

The orange accent, `#ff5a3c`, measures **3.10:1** against white. That clears
the 3:1 bar for large text and interface components and misses the 4.5:1 bar
for normal-size text. In dark mode the accent itself is fine on the near-black
background at 7.63:1, but **white text on the lighter orange `#ff7a5c` is
2.56:1**, which misses even the 3:1 bar.

Measured node counts, which is what the baseline in `e2e/a11y.spec.ts` holds:

| Page | Nodes |
| --- | --- |
| `/` | 5 |
| `/areas/glasgow-city` | 10 |
| `/councils/glasgow-city` | 7 |
| `/money` | 4 |
| `/take-home-pay-calculator-scotland` | 5 |

The colour is a settled decision, so `color-contrast` is excluded from the
page-by-page sweep. It is not swept away: a separate test holds the counts
above, so anything that makes contrast worse still fails, and the
accessibility statement names the shortfall in public rather than implying it
passes.

Excluding contrast, all 15 pages, both themes, the 404 and the open command
palette are clean.

One change would help without touching the accent: in dark mode the primary
button uses white text on `#ff7a5c` at 2.56:1, where the site's own ink
`#131926` on the same orange measures **6.86:1**. That is a text colour, not
the accent. It has not been applied, because it changes how the button looks
and that is a design call rather than a QA one.

## Safari and iOS

WebKit runs everything except four tests that assert a Tab sequence, and that
is a platform fact rather than a shortcut.

**Safari does not put links or buttons in the Tab order by default.** Measured
on the homepage:

```
chromium: Skip to content -> ScotlandCounted -> Your area -> Your money -> Councils ...
webkit:   INPUT -> INPUT[Your email address] -> SUMMARY -> SUMMARY ...
```

WebKit skips every link and button and goes straight to form controls and
`<summary>` elements. This is Safari's "Press Tab to highlight each item on a
webpage" setting, off by default, and no markup on this site can turn it on.
Asserting a tab sequence there would test the browser's preferences.

Safari also does not focus a `<button>` when you click it. That is why the
mobile menu's return-focus assertion is Chromium-only: there is nothing to
give focus back to, so WebKit asserts the weaker property that focus is not
left stranded on a removed element.

### Still needs a real handset

WebKit on macOS is the same engine family, not the same product. None of the
following is covered by anything in this repository:

- The software keyboard. Whether the postcode field and both calculators stay
  visible when iOS raises the keyboard over them, and whether `inputMode` gives
  the right keypad.
- Scroll locking behind the open menu. `MobileMenu` sets `overflow: hidden` on
  both `<html>` and `<body>` specifically because the body-only form is the
  classic iOS failure, and that fix has never been observed failing or working
  on a real iPhone.
- Safari's dynamic toolbars and the resulting viewport height changes, which
  affect the full-height menu sheet.
- Rubber-band overscroll at the top and bottom of the sheet.
- VoiceOver on iOS, which is a different interaction model from VoiceOver on
  macOS and from every desktop screen reader.
- Reduced motion driven by the real system setting rather than an emulated
  media query.

The accessibility statement lists real-device iOS testing under known
limitations. Nothing here changes that.
