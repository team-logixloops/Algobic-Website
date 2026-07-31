# ALGOBIC: Design System & Homepage Plan

**Status:** 🟢 approved, built, visually reviewed and **live at `/`**. The coming-soon splash is gone.
Companion to [`website.md`](website.md) (structure, SEO) and [`brand.md`](brand.md) (voice, philosophy).

**Built 2026-07-31:** tokens · type scale · slash grammar · `BrandMask` · `Seam` · header · footer · hero · build index + zero state · the gap · how it works · what this is not · CTA. Marquee not built: cut in section 9.

**Shipped 2026-08-01 (D-009).** `/` now serves a landing page composed for the zero-build state: hero · the gap · why now · how it works · what this is not · resolution. The token system, type scale and slash grammar in this document were kept unchanged and carried it. Three things in this document were superseded by measurement or by review:

| Was | Now | Why |
|---|---|---|
| §2 "`#ff7712` on `#f7f5f2` is roughly 2.6:1", marked 🔴 estimated | **Measured 2.44:1.** Also measured: dark `--muted` at 4.35:1, and `background`-on-`accent` at 2.44 light / 3.89 dark | Under the 3:1 floor for graphical objects, not just for text. `--accent` now carries no text and no meaning on paper. Focus ring, CTA fill, toggle hover and the Instagram glyph all moved to `--accent-ink`; dark `--muted` lifted to `#847a94` (4.96:1) |
| §5 hero: two columns, evidence on the right | Single statement, answer block dropped a line to the right, and a **`0` counter** stating the build count at display size | The right column was half a fold promising evidence that does not exist. Printing the zero is the cheaper and more honest version of the same claim |
| §5 "How it works": bordered three-up grid | One rule per step with an accent leader that draws on scroll | The grid was the one shape on the page that could have come off any template, in the section whose subject is a path |

**Not yet done:** `/preview` still exists and still renders the earlier two-column composition. It is `noindex`, so it costs nothing, and it is kept until the founder has seen `/` and is happy. Delete `src/app/preview/` then.

---

## 0. THE CONFLICT, RESOLVED

[`brand.md`](brand.md) states **"Restraint reads as confidence. Ornament reads as insecurity"** and **"Motion: clarifies causality only."** The brief asks for maximalism. Both cannot be literally true.

**Resolution: maximalism of evidence, not of ornament.**

The page is dense (many type sizes, many rules, layered accents, data in the margins), but **every dense element is a fact**: hours, ₹0, tool names, dates, failure counts, verbatim prompts. Nothing is added that doesn't carry information. That satisfies the brief (the page reads busy, layered, deliberate) without contradicting the brand (no decoration that means nothing).

The test for any element: **delete it and ask whether the reader loses a fact.** If not, it goes.

**What stays restrained on purpose:** motion, and the number of simultaneous ideas per screen. Density ≠ chaos.

---

## 1. WHAT ALREADY EXISTS: REUSE, DON'T REBUILD

Audited 2026-07-30. All of this is good and stays:

| Asset | File | Note |
|---|---|---|
| Lockup (cat + shatter + `ALGOBIC\` + tagline) | [`algobic-lockup.tsx`](../src/components/ui/algobic-lockup.tsx) | Two CSS mask layers; ink follows `currentColor`, accent follows `--accent`. One asset pair serves both themes. |
| Ambient shatter field | [`glitch-field.tsx`](../src/components/ui/glitch-field.tsx) | Canvas. Reads palette live, `MutationObserver` on theme, pauses on hidden tab, respects reduced-motion, pointer-reactive. |
| Theme reveal | [`globals.css`](../src/app/globals.css) | View transition, wordmark SVG mask, zoom 0 → readable → hold → 4000vmax over 1.4s. **Unchanged: brief requires it stays identical.** |
| Theme state | [`mask-view-transition-theme-toggle.tsx`](../src/components/ui/mask-view-transition-theme-toggle.tsx) | `dark` class on `<html>` is source of truth, set pre-paint. Subscribe, never mirror. |
| Instagram trapdoor | [`instagram-trapdoor.tsx`](../src/components/ui/instagram-trapdoor.tsx) | Goes in the footer as-is. |

**The identity, described honestly:** a line-drawn cat, sitting, alert, one accent eye, facing right, dissolving leftward into a field of accent and ink shards. `ALGOBIC\` in wide-tracked Orbitron with a custom `Λ` and a trailing accent backslash. Tagline with "Before" in accent.

That is not a templated identity. The design system's job is to extend it, not to invent alongside it.

---

## 2. COLOR

### Existing tokens: unchanged

| Token | Light | Dark |
|---|---|---|
| `--background` | `#f7f5f2` paper | `#08070c` void |
| `--foreground` | `#0b0a0c` | `#f2eef7` |
| `--muted` | `#6b6560` | `#7a7188` |
| `--line` | `#ddd7ce` | `#211c2a` |
| `--accent` | `#ff7712` orange | `#8847e4` violet |

Two genuinely different palettes, not one palette inverted. Warm on paper, cool in the void. Keep.

### New tokens: maximalism needs layers

**`--accent-2` = the other theme's accent.**

| | `--accent` | `--accent-2` |
|---|---|---|
| Light | `#ff7712` orange | `#8847e4` violet |
| Dark | `#8847e4` violet | `#ff7712` orange |

The two palettes become siblings, the toggle becomes a **colour trade** rather than a brightness flip, and it costs zero new hues. Every hue on the site was already in the brand.

**`--surface`**, one step off background for panels: Light `#efebe4`, Dark `#100d18` (violet-shifted, matching the dark accent's temperature).

**`--shard`**, ambient shatter tint, tunable independently of `--foreground`: Light `#b8b0a4`, Dark `#2e2640`.

### ⚠️ Accessibility finding: must fix

**`#ff7712` on `#f7f5f2` is roughly 2.6:1.** That fails WCAG AA for normal text (4.5:1) and for large text (3:1). The current homepage sets `COMING SOON` in `--accent` at `clamp(0.65rem, 2vw, 0.95rem)`: small text, light theme, failing contrast. Real bug, not a theoretical one. **Verify the exact ratios with a contrast checker before implementing; the figures here are estimates.**

Fix: split the accent by role.

| Token | Role | Light | Dark |
|---|---|---|---|
| `--accent` | Large display type, fills, rules, glyphs, the shatter field | `#ff7712` | `#8847e4` |
| `--accent-ink` | **Any text below ~24px** and any small UI label | `#9c3d06` | `#a97cf0` |

Rule: `--accent` never sets small text. `--accent-ink` never fills a large area.

Focus rings keep `--accent`: [`globals.css`](../src/app/globals.css) already does 2px + 3px offset, which is correct and stays.

---

## 3. TYPE

| Role | Face | Weights | Use |
|---|---|---|---|
| Display | **Orbitron** | 700, 900 | Headlines, eyebrows, the wordmark's own voice |
| Body | **Inter** | 400, 500, 600 | Prose, answer blocks, everything readable |
| Data | **IBM Plex Mono** *(new)* | 400, 500 | Verbatim prompts, hours, ₹, dates, tool names, counts |

**Why a third face, and why this one.** Section 5 of the build template is *actual prompts, verbatim*. That is code-adjacent text and it has to be mono or it reads as paraphrase. Choosing IBM Plex Mono over the reflexive JetBrains Mono for two reasons: it has a Devanagari sibling if Hinglish content ever ships to an Indian audience, and it's narrower so dense data tables survive a 360px phone. One family, two weights, latin subset: the added weight is small and it buys the site's most important credibility signal.

**Cost noted:** [`brand.md`](brand.md) says four dependencies, don't add more. `next/font` is not an npm dependency, but a third family is real bytes. Budget it, subset it, and drop it if the build-page weight budget gets tight.

### Scale: maximalism uses many steps at once

| Step | Size | Face | Tracking |
|---|---|---|---|
| Display XL | `clamp(2.75rem, 9vw, 7.5rem)` | Orbitron 700 | `-0.02em` |
| Display L | `clamp(1.75rem, 4vw, 3rem)` | Orbitron 700 | `-0.01em` |
| Eyebrow | `0.6875rem` uppercase | Orbitron 700 | `0.42em` |
| Body | `1rem / 1.6` | Inter 400 | `0` |
| Body S | `0.875rem / 1.55` | Inter 400 | `0` |
| Data | `0.8125rem` `tabular-nums` | Plex Mono 500 | `0.02em` |
| Micro | `0.6875rem` | Plex Mono 400 | `0.06em` |

Orbitron is already wide, so display steps track **negative**. The `0.42em` eyebrow tracking is lifted from the existing `COMING SOON` treatment. It's already the brand's voice, keep it.

---

## 4. THE SIGNATURE: `\`

**One idea, derived from the logo and from nothing else: the wordmark ends in an accent backslash. That diagonal becomes the page's only angle.**

`--slash-angle: 16deg` (`8deg` below 640px: steep diagonals eat vertical space on a phone).

Applied as, and only as:

1. **Section seams.** Every section boundary is a slashed edge via `clip-path`, never a horizontal rule. Sections interlock the way the shards do.
2. **Card corner.** Build rows have one corner cut on the slash, filled `--accent-2`.
3. **Hover.** Accent wipe travels *along* the slash, not left-to-right.
4. **Link underlines.** Slashed, not straight.

Why this and not something else: the existing shatter field is built from **horizontal** bars. Horizontal shards streaming into a single **diagonal** is a literal description of the logo. The grammar is already in the artwork; the page just extends it.

**Everything else stays quiet.** No gradients, no glows, no border-radius beyond the existing 10px on the toggle, no drop shadows. Boldness spent in one place.

---

## 5. HOMEPAGE LAYOUT

`brand.md`: **"The work: shipped things are the hero. Never the founder, never us."** So the hero is the index of shipped things, and the cat is the anchor it dissolves out of. Left is the itch, right is the evidence, the shards cross the seam between them.

### Desktop (≥1024px)

```
┌────────────────────────────────────────────────────────────────────────┐
│ ▲LGOBIC\    BUILDS · START · TOOLS · ANSWERS · JOIN            [◐]     │ sticky, slashed rule
├────────────────────────────────────────────────────────────────────────┤
│                                    ╱                                   │
│  YOU COULD HAVE               ╱   ┌──────────────────────────────────┐ │
│  BUILT THAT.                ╱     │ WhatsApp bot that texts your     │ │
│  ▁▁ ▃ ▁▂  ▁ ▃▁▂                   │ class timetable            3h20m │ │
│   shards stream right ──▸ ╱       │ Lovable · ₹0 · no code       ╱   │ │
│                         ╱         ├────────────────────────────╱─────┤ │
│  ALGOBIC is where people build  ╱ │ AI resume screener         2h05m │ │
│  the AI projects they see      ╱  │ Bolt · ₹0 · no code     ╱        │ │
│  online. No coding background ╱   ├───────────────────────╱──────────┤ │
│  required. Each build is      ╱   │ Attendance tracker      1h40m    │ │
│  documented end to end.      ╱    │ Replit · ₹0 · no code ╱          │ │
│                            ╱      └─────────────────────╱────────────┘ │
│  Start with this one ⁄            ALL 12 BUILDS ⁄                      │
│                     ╱                                                  │
│   ╭─╮ cat bleeds off ╱                                                 │
│  ╱ ◜ ◝ left edge, 22% opacity                                          │
└──────────────────────────────╱─────────────────────────────────────────┘
   ╱ slashed seam ╱
┌────────────────────────────────────────────────────────────────────────┐
│ THE GAP                                                                │
│ You saw it.  ──────────────────────────────────── accent rule          │
│    You didn't build it.  ───────────────────────── accent-2 rule       │
│        That's not your fault.  ─────────────────── line                │
└───────────────────────────╱────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│ HOW IT WORKS                                                           │
│  01 ╱ Pick a thing    02 ╱ Follow the path    03 ╱ Ship it public      │
│     one you actually     every step, every       live URL, your name   │
│     saw somewhere        prompt, every break     on it                 │
└───────────────────────╱────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│ ⟨ marquee ⟩  timetable bot · resume screener · attendance · ₹0 · ₹0 ·  │  ≥6 builds only
└───────────────────────────╱────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│ WHAT THIS IS NOT                                                       │
│ ✕ not a school        no courses, no modules, no certificates          │
│ ✕ not a tool          Lovable and Bolt are the tools. We're the door.  │
│ ✕ not a placement     we never guarantee a job                        │
│ ✕ not motivational    demonstration, not encouragement                │
└──────────────────────────╱─────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│                     [ START WITH THIS ONE ⁄ ]        ← the only button │
└────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│ ▲LGOBIC\   Builds Start Tools Answers   Work About Manifesto Data      │
│            Privacy Terms                  ⟨ig trapdoor⟩  Updated 30 Jul│
└────────────────────────────────────────────────────────────────────────┘
```

**Numbering on "How it works" is legitimate**: it is a genuine sequence and the order carries information. Numbering appears nowhere else on the page, so it stays meaningful.

### Mobile (320-639px)

```
┌──────────────────────┐
│ ▲LGOBIC\        [◐]  │
│ Builds Start Tools ⟩ │ ← mono strip, horizontal scroll, no JS, no hamburger
├──────────────────────┤
│  YOU COULD           │
│  HAVE BUILT          │
│  THAT.               │
│  ▁▃▁▂ ▁▃▁            │
│                      │
│  ALGOBIC is where    │
│  people build the    │
│  AI projects they    │
│  see online…         │
│                      │
│  Start with this ⁄   │
├───────────────╱──────┤
│ ┌──────────────────┐ │
│ │ WhatsApp bot…    │ │ ← index rows full-width,
│ │ 3h20m · ₹0    ╱  │ │   tap targets ≥44px
│ ├──────────────────┤ │
│ │ AI resume…       │ │
│ │ 2h05m · ₹0    ╱  │ │
│ └──────────────────┘ │
│  ALL 12 BUILDS ⁄     │
│                      │
│   ╭─╮ cat, top-right │
│  ╱ ◜◝ bleed, 14%     │
└──────────────────────┘
```

Mobile changes: slash `16deg → 8deg`. Cat moves to a top-right bleed at lower opacity so it never sits under text. Nav is a scrolling mono strip: no hamburger, no JS. Index rows stack. Marquee keeps one row. Test at **320px**, not 375px.

### Zero-build state: must not fake anything

There are no builds yet ([`website.md`](website.md) section 10 open items). The right column degrades honestly:

- **0 builds:** right column shows the one `/work` case study, labelled as a case study, plus one line: *"First builds land this month."* No placeholder cards, no skeleton rows, no invented titles.
- **1-5 builds:** real rows only. Marquee hidden: a marquee of three items reads as padding.
- **≥6:** marquee appears.

The homepage ships at **priority 6** in the build order, after builds exist. Designing it now is correct anyway: the token system, the slash grammar and the type scale all get inherited by the build pages that ship first. Design system first, homepage published later.

---

## 6. MOTION

| Moment | Behaviour | Cost |
|---|---|---|
| Theme toggle | **Unchanged.** Existing wordmark-mask view transition, 1.4s. | Already built |
| Ambient shatter | **Unchanged.** Existing `GlitchField`. | Already built |
| Index rows on scroll | Staggered reveal via CSS `animation-timeline: view()`, `@supports` guarded | No JS |
| Row hover | Accent wipe along the slash, 220ms | CSS |
| Marquee | CSS translate loop, paused on hover and under reduced-motion | CSS |

**Nothing else.** No parallax, no scroll-jacking, no counters ticking up, no entrance animation on the headline: the headline is the LCP element and animating it delays paint. `prefers-reduced-motion: reduce` kills every item in rows 3-5 and is already handled for rows 1-2.

---

## 7. SEO, BAKED IN NOT BOLTED ON

Per [`website.md`](website.md) section 4:

- **One `<h1>`:** "You could have built that." The 40-60 word answer block sits immediately after it, inside the first 100 words, carrying the keywords. The `<title>` does the keyword work; the H1 does the human work.
- **Section `<h2>`s** in order: The gap · How it works · What this is not. No skipped levels.
- **Index rows are real `<a>` elements**, server-rendered, crawlable. Not a JS-hydrated list.
- **Schema:** existing `Organization` + `WebSite` + `WebPage` blocks stay as separate top-level blocks. Add `ItemList` for the build index. Add `contactPoint` to `Organization`.
- **`GlitchField` is the only client component.** Everything that carries meaning is server-rendered. The page's content is fully readable with JS disabled.
- **LCP element is the headline**: text, no webfont blocking (`display: swap`), no image. The cat and the lockup are CSS masks, which paint after and don't gate LCP.
- **Per-page OG image** already exists and stays.
- `lang="en-IN"` already flows from [`site.ts`](../src/lib/site.ts).

**Targets** (section 6 of `website.md`): LCP < 2.0s, INP < 200ms, CLS < 0.05, measured on throttled Slow 4G against a mid-range Android. Homepage may carry more weight than a build page, but not more than **1.2 MB** total.

**CLS discipline:** the cat and lockup are `mask-image` on sized boxes with explicit `aspect-ratio` (no layout shift). Every index row has a fixed min-height so staggered reveals don't reflow.

---

## 8. ACCESSIBILITY FLOOR

Not negotiable, not announced on the page:

- `--accent-ink` for all small text (see section 2). **Verify every pairing with a contrast checker before shipping.**
- Focus visible on every interactive element: [`globals.css`](../src/app/globals.css) `:focus-visible` already correct
- Tap targets ≥ 44px on mobile index rows
- The cat, lockup and shatter field are all `aria-hidden`; the H1 and answer block carry the meaning
- Nav strip reachable by keyboard without a horizontal-scroll trap
- Marquee stops on hover, on focus, and under reduced motion
- `select-none` on the current page is fine for a splash but **must be removed** on the real homepage: people copy build titles

---

## 9. WHAT I'D CUT

Chanel's rule: remove one accessory before leaving.

**Cut: the marquee.** It's the one element on this page that is density for density's sake. The build titles it scrolls are already in the index above it, so it repeats rather than informs, and it fails the section 0 test: delete it and the reader loses no fact. Kept in the plan behind a ≥6-builds gate so it's a deliberate later decision, not a default.

**Runner-up, kept:** the cat at 22% opacity behind the left column. Justified because it's the brand mark doing structural work (the thing the shards come from), not wallpaper.

---

## 10. OPEN

| Item | Status |
|---|---|
| Maximalism vs `brand.md` restraint clause | 🟡 resolved in section 0 as *density of evidence*. **If ornamental maximalism is wanted instead, `brand.md` must be amended: it is canonical.** |
| Exact contrast ratios for all accent pairings | 🔴 estimated here, **must be verified with a checker** |
| Third typeface: worth the bytes? | 🟡 yes for verbatim prompts; revisit if build-page weight budget tightens |
| `--slash-angle` exact value | 🟡 `16deg` proposed; match it to the logo's real backslash slope by measurement |
| Homepage copy beyond the answer block | 🔴 not written: "The gap" and "How it works" lines are placeholders in brand voice, not final |
| Whether the cat reads as playful vs serious to the ICP | 🔴 untested, and it's load-bearing for the whole identity |
