# ALGOBIC: Website Plan (V1)

**Constraint:** fully hardcoded. No backend, no admin, no auth, no database. Every word authored by the founder in source files, built statically. Designed so a backend can be added later without changing URLs.

Stack unchanged: Next 16 / React 19 / Tailwind 4 / motion. Four dependencies. Don't add more.
**Before writing code:** `AGENTS.md` requires reading `node_modules/next/dist/docs/`. This Next version diverges from training data.

---

## 1. THE ONE IDEA BEHIND THE ARCHITECTURE

**Reels decay. Pages accrue.**

Every piece of content points at a permanent page. The site is not a brochure for the brand. It is the place where the work lives. `/builds/[slug]` is the most important surface in the company, not the homepage.

**Content model:** MDX with frontmatter, one file per build, one per person. Frontmatter fields are chosen now to match the future database schema so nothing has to be backfilled.

---

## 2. PAGE MAP

```
/                        home: the promise, latest builds
/builds                  index of everything built here      ← SEO engine
/builds/[slug]           one build, the whole path           ← the asset
/builds/no-code          crawlable facet: builds with zero code
/builds/tools/[tool]     crawlable facet: builds made with one tool
/work                    what the founder has shipped        ← credibility, low traffic
/work/[slug]             one case study, honest              ← the moat
/u/[handle]              a person and what they shipped      ← URL RESERVED, NOT BUILT IN V1
/start                   what to build first
/tools                   which tool for what                 ← highest-intent SEO
/tools/[comparison]      alphabetical slug only: bolt-vs-lovable, lovable-vs-replit…
/answers                 answer hub (Brand Hub)              ← AEO/GEO surface
/answers/[question]      one question, one answer
/data                    published measurements               ← the citable asset
/data/[slug]             one dataset, one method              ← GEO engine
/manifesto               the copy
/about                   what Algobic is, why now (contact details live here)
/join                    intent capture (hosted form, no backend)     noindex
/privacy                 privacy policy: required, /join collects PII noindex
/terms                   terms of service                             noindex
/404                     exists                                       noindex
```

**Navigation: 5 items maximum.** More than five reads as a company with no opinion.

`Builds · Start · Tools · Answers · Join`

`About`, `Manifesto` and `Work` live in the footer. They matter for trust, not for traffic.

**Three content types, never blended.**

| Type | Surface | Job | Traffic |
|---|---|---|---|
| **Build** | `/builds/*` | replicable by a beginner, ₹0, live URL | carries the traffic |
| **Case study** | `/work/*` | founder-built proof, not replicable | carries the credibility |
| **Data** | `/data/*` | original measurement, method published | carries the citations |

A page that tries to be two of these breaks the promise the first one makes. Section 3 specs them separately.

**URL rules: non-negotiable, because URLs are the one thing that can't be fixed later.**

- Lowercase, hyphenated, no dates, no IDs, no trailing slash
- Maximum two path segments. `/builds/whatsapp-timetable-bot`, never `/builds/2026/no-code/whatsapp-timetable-bot`
- Slug names the search phrase, not the internal title
- A published URL never changes. If it must, 301 the same day and keep the redirect forever

**Indexing policy.** `noindex` means the page serves humans normally but never appears in search results.

| Page | Indexed | Why |
|---|---|---|
| `/404` | No | An error page in search results is a broken result |
| `/join` | No | Owns no query, and it's the wrong entry point (see section 3) |
| `/privacy`, `/terms` | No | Boilerplate, zero search intent. **Preference, not a rule**: indexing them is equally valid and mildly useful as visible proof they exist. Reversible any time. |
| Everything else | Yes | Every indexed URL should be a page that earns traffic |

Anything `noindex` is excluded from the sitemap too. A sitemap entry for a page you've told engines to ignore is a contradictory signal.

⚠️ **Never `noindex` a page and also `Disallow` it in `robots.txt`.** A blocked crawl can't read the `noindex`, so the URL may still surface with no description: the worst of both. Pick one. [`robots.ts`](../src/app/robots.ts) currently allows everything, which is correct; don't add disallow rules for these pages later.

---

## 3. PAGE-BY-PAGE CONTENT SPEC

### `/`: Home

| Section | Content |
|---|---|
| Hero | **"You could have built that."** Sub: the thing you scrolled past. Here's the path. Tagline lockup stays. |
| Answer block | 40-60 words, declarative, extractable: *"ALGOBIC is where people build the AI projects they see online. No coding background required. Each build is documented end to end, from idea to a live URL."* |
| Proof strip | 3 latest builds. Real screenshots. Time-to-build in hours. |
| The gap | Three lines: you saw it → you didn't build it → here's why that's not your fault |
| How it works | 3 steps, no more. Pick a thing · follow the path · ship it public |
| Someone like you | One named person, one thing they shipped. **Leave out entirely until real.** |
| CTA | Single. "Start with this one" → `/start` |

One decision per screen. Never two CTAs.

### `/builds`: the index

Grid. Each card: screenshot · what it is · time to build · tools used · "no coding required" badge where true.

**Filters (static, no JS state needed):** by tool, by time-to-build, by "needs code / no code."

This page is the site's SEO engine because it internally links to every long-tail build page.

### `/builds/[slug]`: the asset

**Admission bar (all four, no exceptions):**

1. One non-coder can follow it start to finish and end up with a working thing
2. ₹0 to build **and** ₹0 to keep running, permanently
3. A live URL that does not sleep, pause, or expire
4. Real prompts and at least one real failure to document

Anything failing any of these is a `/work` case study, not a build page.

**Boring and hyper-specific beats clever and broad.** Novelty is worth nothing here; search specificity is worth everything. "WhatsApp bot that sends your class timetable every morning" is a build page. "AI assistant" is not. The project stays small; the *write-up* is what has to be excellent.

**Template, identical every time:**

1. **What it is:** one sentence, one screenshot, live URL
2. **Answer block:** 40-60 words, declarative. This is what gets extracted by AI engines.
3. **Who'd use this:** a real use case, in India
4. **Time and tools:** "3h 20m · Lovable + Supabase · no code written"
5. **The path:** numbered steps, screenshots, actual prompts used verbatim
6. **Where it broke:** the honest section. What failed, what the AI got wrong, the tell.
7. **What it cost:** ₹0, plus the free-tier limits that keep it there
8. **Make it yours:** three specific variations
9. **Who built it:** plain-text byline in V1. No link until `/u/*` exists.

Frontmatter:
```yaml
slug:
title:
oneLine:
shipped:          # ISO date: drives freshness signals
updated:          # ISO date: bump when edited
minutes:          # integer: "3h 20m" is formatted from this, never rounded
tools: []
codeWritten:      # true | false
liveUrl:
builder:          # handle: founder's own until real students ship
cost:             # INR: must be 0 to qualify as a build page
difficulty:       # first-build | second | harder
```

**Uptime obligation.** A build page's `liveUrl` is a promise. If it dies, the page gets converted to a `/work` case study or pulled the same week, never left as a 404 magnet on the most SEO-valuable surface on the site. Prefer hosts with no idle-sleep and no inactivity-pause; a paused database behind a live frontend reads as "his code broke," which is the exact inverse of what the page exists to prove.

### `/work/[slug]`: the case study

For founder-built projects that are real but **not replicable by a beginner**: agentic systems, heavy backend, anything needing API spend. These carry credibility, not traffic. No "build this yourself" claim is made, so none of the build-page constraints apply.

**Template:**

1. **What it does:** one sentence, one screenshot
2. **Demo:** screen recording, unedited, real latency and real failures. **No public live URL that spends API credits.**
3. **Why it exists:** the actual problem
4. **How it's built:** architecture, honest about what's held together with tape
5. **The Catch:** where the model was wrong and how it got caught. Transcript, diff, the tell. **This section is the whole point of the page.**
6. **What it cost:** real ₹, including API spend
7. **Repo:** if public

Frontmatter:
```yaml
slug:
title:
oneLine:
shipped:
updated:
stack: []
demoVideo:        # required
liveUrl:          # optional, often deliberately absent
repoUrl:
cost:             # INR, real
```

**Never expose an agent on your own API key at a public URL.** No hosting tier caps that. One loop script drains it. If a live demo is genuinely needed: BYOK (user's key, browser session only, never stored), or a free-tier inference provider behind per-IP rate limits, plus a provider-side hard spend cap and a graceful "demo limit reached" state. All of those, not some.

**Why this page type is the moat:** nobody publishing AI-app-builder content has real agentic failure transcripts. Section 5 is unfakeable and it is the highest-signal criterion in [`the-bar.md`](the-bar.md).

### `/u/[handle]`: person

**Not built in V1.** Zero students have shipped, so there is nothing truthful to put here, and a fabricated builder is the one lie that ends the brand on contact. See the `Automatic Not Yet` list in [`the-bar.md`](the-bar.md).

URL shape stays reserved so build-page bylines can become links later without breaking anything. Byline is plain text until then.

### `/start`: the entry point

The single most important conversion page. Answers one question: *what do I build first?*

Content: 5 first builds, each with time, prerequisites (none), and a one-line "you'll have this by tonight." Not a quiz, not a form. Five links.

### `/tools` and `/tools/[comparison]`

**Highest commercial-intent search real estate available to us.** People search "lovable vs bolt" constantly and the results are mostly vendor blogs.

Pages to write: `lovable-vs-bolt` · `replit-vs-lovable` · `bolt-vs-v0` · `best-ai-app-builder-india` · `emergent-ai-review` · `free-ai-app-builders`

Each: answer block first, comparison table, "use X if / use Y if", honest limitations, what it costs in ₹, and a link to a build we made with it. **The build link is what vendor blogs can't fake.**

### `/answers` and `/answers/[question]`

The AEO/GEO surface. One page per real question, encyclopedia tone, declarative sentences.

First 15 questions:
1. Can you build an app without knowing how to code? · 2. What is vibe coding? · 3. What's the best AI app builder for beginners? · 4. How long does it take to build an app with AI? · 5. Do you need a computer science degree to build software? · 6. How much does it cost to build an app with AI in India? · 7. What can't AI build yet? · 8. Is AI-generated code safe to use? · 9. How do you deploy an app you built with AI? · 10. What should a non-engineer build first? · 11. Are no-code apps real apps? · 12. How do you know if AI-generated code is wrong? · 13. What's the difference between no-code and vibe coding? · 14. Can students in India use these tools for free? · 15. What do employers think of AI-built projects?

**Format for every answer page:** question as H1 → 40-60 word direct answer in the first paragraph → then the detail → then links to relevant builds. FAQPage schema.

### `/data` and `/data/[slug]`: the citable asset

**Original measurement is the most-cited content type that exists, and it's the only kind a bigger competitor cannot outrank by being bigger.** They can outspend us on volume; they cannot publish our numbers.

Section 5 already commits to running 20 target queries weekly across four answer engines. That is original research. Publishing it turns an internal test loop into a citable asset at zero extra cost.

First three datasets, all already generated by work we're doing anyway:

1. **What AI answer engines actually cite for AI-app-builder questions:** 20 queries × 4 engines, weekly, sources logged. Updated monthly.
2. **Real ₹ cost of shipping N student projects:** measured from build pages, not estimated.
3. **Where AI coding tools failed, categorized:** aggregated from every build's "Where it broke" section and every case study's "The Catch". Failure taxonomy with counts.

**Template:**

1. **The number:** headline finding in one sentence, in the first 30 words
2. **Method:** how it was measured, sample size, dates, what would invalidate it
3. **The data:** a real table. Downloadable CSV.
4. **Limitations:** stated plainly. This is what makes it trustworthy enough to cite.
5. **Last measured:** visible date, plus cadence

`Dataset` schema. **Cite-us line** on every data page: an explicit "how to cite this" block with our name, URL and date. Makes attribution frictionless for anyone quoting it.

**Hard rule: never publish a number we cannot source to our own measurement.** Two invented statistics were already retracted from this document on 2026-07-30. A `/data` page carrying a fabricated figure would be terminal for the one asset class where credibility is the entire product.

### `/manifesto`
The copy, alone on the page, no CTA. Trust surface.

### `/about`
What Algobic is, why now, what we refuse. Pull from `brand.md`. Include the market numbers with sources. They make the "why now" concrete and they're citable.

### `/join`
Hosted form endpoint (Tally / Formspree / Google Form embed). Capture: name, what you want to build, campus, phone. **Ask what they want to build:** that's the qualifying field that makes CPQC computable.

`noindex`: not for crawl budget, which is irrelevant at this scale. Two real reasons: a form has no query to own, and it's the wrong search entry point. Someone arriving from a search for the brand should land on `/`, read the promise, then choose to join, not land cold on a page asking for their phone number.

Link to `/privacy` directly beside the submit button, not only in the footer.

### `/privacy` and `/terms`: legal, and genuinely required

Not decoration. `/join` collects name, phone and campus from students in India, which makes these load-bearing:

- **India's DPDP Act (2023)** governs personal data of people in India. A form collecting name and phone number needs a stated purpose, a retention position, and a way to ask for deletion. **Verify current DPDP compliance requirements at source before publishing. I have not verified the operative rules and notice obligations, and they have been phasing in.**
- The form is **third-party hosted** (Tally / Formspree / Google Forms), so data goes to a processor we don't control. That has to be disclosed by name.
- Any analytics script, however lightweight, is a disclosure too.
- **Many students are minors.** Under-18 data carries stricter obligations under DPDP. Either state an 18+ requirement on the form or handle consent properly. Decide before launch, not after.

**`/privacy` must state, plainly:** what's collected · why · who processes it (named) · how long it's kept · how to request deletion · a real contact address.

**`/terms` must state:** that build guides are provided as-is with no warranty · that third-party tools (Lovable, Bolt, Supabase, free tiers) have their own terms and their own costs and pricing changes are not ours · IP position on published builds and prompts · that `/data` figures are our own measurements, cited method included, not guarantees.

Both `noindex`, both excluded from the sitemap, both linked in the footer sitewide. Write them in plain language. A legal page nobody can read is a trust cost, not a trust signal. **Neither is a substitute for actual legal review before you take real data from real students.**

---

## 4. SEO

### Keyword clusters

| Cluster | Intent | Example terms | Difficulty |
|---|---|---|---|
| **Tool comparison** | commercial | lovable vs bolt, best ai app builder, emergent ai review | Medium: winnable with real builds |
| **Build how-to** | informational, long tail | how to make a whatsapp bot without coding, ai resume screener project | **Low: start here** |
| **No-code / vibe coding** | informational | build app without coding, what is vibe coding, no code app builder india | Medium |
| **Student project** | informational | ai project ideas for students, final year project with ai | Low-medium |
| **Brand** | navigational | algobic | Trivial |

**Start with long-tail build how-tos.** Every `/builds/[slug]` page is a long-tail keyword page that a competitor can only copy by actually building the thing.

### What ranking is actually achievable, and when

Structure is necessary and not sufficient. Head terms are held by domains with years of authority and thousands of referring domains; no site architecture overtakes that in months. Stated plainly so the plan isn't measured against the wrong target:

| Term type | Example | Realistic |
|---|---|---|
| Brand / navigational | `algobic` | Weeks. Own it outright. |
| Long-tail build how-to | `whatsapp timetable bot without coding` | 1-4 months per page. **This is the game.** |
| Long-tail student project | `ai resume screener project for final year` | 2-6 months |
| Mid-tail comparison | `lovable vs bolt` | 4-12 months, needs the real-build differentiator |
| Head term | `ai projects`, `ai tools` | Year 2-3 at the earliest, and only as a by-product of winning hundreds of long tails first |

**The mechanism:** long-tail pages earn traffic, mentions and links; that authority is what eventually makes mid-tail and head terms winnable. Chasing head terms first produces pages that rank for nothing. Volume of specific, genuinely-useful pages is the only lever that compounds.

### One intent, one URL: ownership table

Two pages targeting one query split link equity and let the engine choose, usually wrongly. Every query has exactly one owner. Every other page links to the owner instead of re-answering.

| Query intent | Owner | Others must |
|---|---|---|
| what to build first | `/start` | link, never re-answer (including `/answers` Q10) |
| best AI app builder for beginners | `/tools/best-ai-app-builder-india` | `/answers` Q3 links here |
| free tools / free tiers | `/tools/free-ai-app-builders` | `/answers` Q14 links here |
| cost of building with AI in India | `/answers/cost-to-build-an-app-with-ai-india` | every `/tools/*` cost section links here |
| how to build *one specific thing* | that `/builds/[slug]` | `/answers` never covers a specific build |
| what is vibe coding | `/answers/what-is-vibe-coding` | `/about`, `/manifesto` link, never define |
| tool X vs tool Y | one `/tools/[comparison]` | see slug rule below |

**Before writing any new page:** find its query in this table. If it's absent, add a row. If the owner already exists, you're writing a link, not a page.

### Comparison slug canonicalization

`lovable-vs-bolt` and `bolt-vs-lovable` are one page to a reader and two searches to an engine.

- **Slug is always alphabetical.** `bolt-vs-lovable`, `bolt-vs-v0`, `lovable-vs-replit`
- The reverse slug 301s to the alphabetical one, permanently
- Body copy uses **both phrasings** naturally, and the H1 uses whichever ordering has more search volume. The slug does not have to match the H1
- Never publish both directions as separate pages

### Facet pages: the decision

Filters on `/builds` are static links to real crawlable URLs, not client-side state. Keeps the no-client-JS rule intact and adds keyword surface.

- **Indexable, hand-written:** `/builds/no-code` and `/builds/tools/[tool]`. Each needs a unique 40-60 word intro and its own H1. Facets with fewer than 3 builds are not published.
- **Never generated:** no combination facets (`/builds/no-code/lovable/under-2-hours`). Combinatorial facets are the classic thin-content explosion.
- **Time-to-build filtering is not a facet.** It's a sort order on `/builds`, no separate URL.
- Every facet page `rel=canonical`s to itself and links back to `/builds`.

### Pagination

`/builds` stays a single page until 40 builds. After that, `/builds/page/2…` with self-canonicals, and `/builds` keeps linking every build from a full index section so crawl depth never exceeds 2. No infinite scroll, ever.

### Sitemap

Current [`sitemap.ts`](../src/app/sitemap.ts) hand-sets a single `lastModified`. That cannot scale to per-page freshness, which is the one GEO lever we control cheaply.

- `lastModified` derives from each MDX file's `updated` frontmatter. Never `new Date()`. Build-time churn is what makes crawlers ignore lastmod entirely.
- Exclude `/join` and `/404`.
- **Drop `priority` and `changeFrequency`.** ✅ *Verified 2026-07-30:* Google ignores both: they're self-reported and every site claims priority 1.0. `lastmod` is the only sitemap attribute Google actively uses, **and only while it stays verifiably accurate**, which is exactly why the bump-only-on-substantive-change rule is load-bearing rather than cosmetic. Source: [Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

### On-page rules
- One H1, matching search intent
- Answer block within the first 100 words of every page
- Descriptive URLs, never dated, never changed
- Internal links: every build links to its tools page and two related builds
- **No orphans.** A page with zero internal inbound links does not ship. Applies to case study #1 before `/work` exists: footer link from day one.
- Real screenshots with descriptive alt text, not stock, not AI-generated
- `updated` field surfaced visibly on the page ("Updated 12 Aug 2026")
- **Bump `updated` only on substantive change.** Mechanical date-bumping to fake freshness is the fastest way to make the signal worthless.
- Language is `en-IN` everywhere: `<html lang>`, schema `inLanguage`, OG locale. The audience and the use cases are Indian and the domain is `.in`.
- Per-page OG image. Distribution is Instagram; a shared build link that previews a generic card wastes the channel.

### Schema (extending what's already in `layout.tsx`)
| Page | Add |
|---|---|
| `/builds/[slug]` | `HowTo` + `Article`, with `datePublished` / `dateModified` |
| `/builds`, facets | `CollectionPage` + `ItemList` |
| `/work/[slug]` | `Article` + `VideoObject` for the demo recording |
| `/answers/[question]` | `FAQPage` |
| `/tools/[comparison]` | `Article` + `ItemList` |
| `/data/[slug]` | `Dataset` + `Article` |
| `/u/[handle]` | `Person`, deferred with the page itself |
| All | `BreadcrumbList` |

**No `HowTo` on `/work/*`.** Case studies make no replicability claim; marking them up as instructions is a promise the page doesn't keep.

⚠️ **Rich-result reality: verified 2026-07-30, both are dead.**

| Type | What happened | SERP lift today |
|---|---|---|
| `HowTo` | Limited on mobile, then fully deprecated on desktop September 2023. No HowTo rich result on any surface. | **Zero** |
| `FAQPage` | Restricted to government and health sites August 2023; **fully deprecated 7 May 2026** for every site. Search Console reporting removed June 2026, API data August 2026. | **Zero** |

Both remain valid schema.org types, and Google states unused structured data causes no problems. So:

- **Keep emitting both:** the value is clean extraction by answer engines, which do parse them
- **Budget zero Google traffic against either.** No expandable FAQ dropdown, no HowTo carousel, not for anyone
- Don't spend design effort on markup shaped to win a rich result that no longer exists

Sources: [Search Engine Journal](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/) · [Passionfruit](https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now)

Keep emitting separate top-level blocks rather than one `@graph`. That decision in `layout.tsx` is already correct.

### Entity graph: the highest-leverage schema work

Answer engines decide whether an organization is real by corroborating it across sources. [`layout.tsx`](../src/app/layout.tsx) currently lists **one** `sameAs` entry. Thin entity graph, and it's cheap to fix:

- `sameAs` gets every profile that genuinely exists: Instagram, GitHub, LinkedIn, YouTube, X, tool directories. Only real ones; a dead link is worse than an absent one.
- Add a `Person` block for the founder with `worksFor` → the Organization `@id`, and their own `sameAs`. Builds and case studies reference that `@id` as `author`.
- Keep `@id` values stable forever. They are the join key across every page's schema.

---

## 5. GEO / AEO / AIO

Three variables reliably predict citation: **structure, freshness, credible sourcing.**

**Freshness is the one we control cheaply.** ⚠️ *Corrected 2026-07-30: my earlier "83% of citations from pages updated within 12 months" could not be verified at source and is withdrawn.*

✅ **Re-verified at source 2026-07-30.** Ahrefs extracted **16.975 million cited URLs** across ChatGPT, Perplexity, Gemini, Copilot, AI Overviews and organic Google SERPs:

| Surface | Average age of cited URL |
|---|---|
| ChatGPT | 958 days |
| Copilot | 1,056 days |
| Gemini | 1,118 days |
| Perplexity | 1,166 days |
| **AI average** | **1,064 days** |
| Organic Google SERP | 1,432 days |

AI citations are **25.7% fresher** than organic results, a full year younger. ChatGPT is 33% fresher. The same dataset reports roughly **half of AI citations point to content under 13 weeks old**, which matters more than the averages: the recency window that actually wins citations is months, not years.

Source: [Ahrefs](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content). Magnitude is real but smaller than the retracted figure implied. So:
- Every page carries a visible `updated` date
- Quarterly refresh pass on all `/tools` and `/answers` pages
- Never publish an undated page

**Structure:**
- Answer block first, 40-60 words, declarative
- Encyclopedia tone. Objective sentences get selected more often than persuasive ones. **Our brand voice already matches this:** numbers over adverbs, no adjectives doing verbs' work.
- One question per page. Don't bundle.
- Tables for anything comparative: they extract cleanly.

**Sourcing:** cite real sources with publisher and date. Pages that cite get cited.

**Testing loop:** Perplexity first (citations are visible inline and retrieval is near real-time). Run a fixed set of 20 target queries weekly across Perplexity, ChatGPT, Claude and Gemini and log which sources appear. Manual, but it's ground truth. **Publish the log** (see `/data`).

### Off-site: the half of GEO this plan was missing

Everything above is on-site. For a domain this new, **on-site structure alone will not produce citations**, because answer engines synthesize from sources they already trust. Corroboration is the work.

| Surface | Why it matters | Effort |
|---|---|---|
| Reddit / Quora threads where the question is already being asked | Heavily retrieved by answer engines; a genuine answer with a link is citable | High value, must be a real answer not a drop |
| Tool directories and "best AI app builder" listicles | These *are* the sources engines quote for commercial queries | Submit; some are free |
| YouTube descriptions + comments on tool review videos | Video transcripts get retrieved | Cheap |
| GitHub: repos, READMEs, awesome-lists | Strong entity signal, high crawl trust | Cheap, already have repos |
| Guest mentions / founder interviews on small dev newsletters | Real referring domains | Slow, high value |
| Product Hunt / Peerlist / Indie Hackers presence | Entity corroboration + `sameAs` targets | One-time |

**Rule: never astroturf.** A link dropped into an unrelated thread costs more than it earns and it contradicts the brand. Answer the question properly, link only where the link is the most useful thing in the reply.

**Owner and cadence:** solo founder, so pick **one** off-site surface per week, not all six. Log what was done and whether the query set moved. That log is itself dataset #1.

**Sequencing:** off-site work before ~5 published pages is wasted, because there's nothing worth linking to. Start after build #3 ships.

### `llms.txt`: demoted, do not maintain

⚠️ **Correction, 2026-07-30.** An earlier draft of this plan treated [`llms.txt`](../public/llms.txt) as a GEO asset worth keeping in sync as pages ship. The evidence says otherwise:

- Ahrefs analysed **137,000 sites**: **97% of `llms.txt` files got zero traffic** in May 2026. AI bots simply don't fetch them
- Across 500M AI bot visits over 90 days, only **408** targeted `llms.txt`
- Google's John Mueller: it's "not done for search," a "temporary crutch, perhaps to save some tokens" for AI coding tools, and he compared it to the discredited keywords meta tag
- Google's own generative-AI guidance states machine-readable files like `llms.txt` aren't needed to appear in AI features

**Decision: keep the file, drop the obligation.** It costs nothing to leave in place, it's genuinely used by coding tools (Cursor, Cline, Continue), and it's already written. But it earns **no** answer-engine citations, so it gets **no** ongoing maintenance budget and no place in the freshness routine. Effort that would have gone to syncing it goes to off-site corroboration, which is where citations actually come from.

Sources: [Ahrefs study](https://ahrefs.com/blog/llmstxt-study/) · [Baseline Labs on Mueller](https://baselinelabs.ai/blog/llms-txt-google-search)

**Honest expectation-setting:** ⚠️ *the specific "32,000+ referring domains → 3.5x more likely to be cited" figure could not be verified at source and is withdrawn.* The general principle (that authority and entity recognition affect citation, and a brand-new domain starts far behind) is widely asserted but I have no verified magnitude for it. Either way: **long-tail SEO is the winnable game in months 1-12; GEO is the game in years 2-3.** Build the structure now because retrofitting is expensive, but don't measure success by it this year.

---

## 6. SXO: search experience

Ranking is not the goal; the click has to survive.

- **No dead ends:** every page has an obvious next link. A build page always offers two more builds.
- **Match the promise:** if the title says "in 40 minutes," the page shows 40 minutes. Mismatch is the fastest way to lose the ranking you earned.
- **Mobile first, genuinely:** the audience is on phones on patchy connections. Test on throttled 3G, not on a laptop.
- **No interstitials, no cookie walls, no newsletter popup.** They cost more than they earn at this stage.
- **Dark and light both first-class.** Already implemented.

### Core Web Vitals: targets, not vibes

"Four dependencies, static build" is a good starting position, not a measurement. Set numbers or the claim is unfalsifiable:

Google's "good" thresholds, verified 2026-07-30, and the stricter internal targets we hold ourselves to:

| Metric | Google "good" | Our target | Why stricter |
|---|---|---|---|
| LCP | < 2.5s | **< 2.0s** | Audience is on patchy mobile; Google's bar assumes better connections than ours has |
| INP | < 200ms | **< 200ms** | Static pages, no client JS: no reason to be near the limit |
| CLS | < 0.1 | **< 0.05** | Screenshot-heavy pages; explicit image dimensions should make near-zero achievable |
| Page weight | *(not a CWV)* | **< 900 KB** on a build page | Our own constraint, see image budget |

**Google grades at the 75th percentile of real CrUX visitor data, per URL**, not on your machine, not on average. A page that's fast for you and slow for a quarter of visitors fails. Measure on throttled Slow 4G against a mid-range Android, before publishing each build page, not quarterly.

Source: [Core Web Vitals thresholds](https://www.corewebvitals.io/core-web-vitals).

### The screenshot problem: resolved

**Direct conflict in this document:** the build template requires a screenshot in section 1 and screenshots per step in section 5 (realistically 8-15 images) on exactly the pages that carry all the traffic, aimed at phones on patchy connections. Rules that reconcile it:

- `next/image`, AVIF with WebP fallback. No raw PNG screenshots.
- **Explicit `width`/`height` on every image.** Unsized images are the single largest CLS source.
- One eager-loaded hero image. Everything else `loading="lazy"`.
- **Image budget: 10 images maximum per build page, 700 KB total after compression.** Over budget means the write-up is too long, not that the budget is wrong.
- Screenshots cropped to the relevant region, not full-screen captures. A cropped 900px-wide crop beats a 2560px desktop screenshot for both weight and readability on a phone.
- Alt text describes what the step accomplished, not "screenshot of dashboard."
- A step that needs no screenshot doesn't get one. Prose is free; images are not.

---

## 7. BUILD ORDER

| Priority | Ship | Why |
|---|---|---|
| **0** | Sitemap from frontmatter · `en-IN` · entity graph · per-page OG | Hours of work, and every page shipped after it inherits the fix. Doing it later means touching every page again. |
| **1** | `/builds/[slug]` template + build #1 | The asset. Nothing works without content. Start the flywheel. |
| **2** | `/work/[slug]` template + 1 case study | **Ships fastest: the projects already exist.** Buys credibility while builds accumulate. Footer link from day one, no orphans. |
| **3** | Builds #2 and #3 | Three is the minimum for an index to look alive |
| **4** | `/builds` index | Internal linking spine |
| **5** | `/start` | Conversion |
| **6** | `/` rebuild around the new promise | Needs builds to exist first |
| **7** | Off-site pass begins, one surface per week | Only earns anything once ~5 pages exist |
| **8** | `/data` + dataset #1 (the citation log) | Already being generated by the section 5 test loop |
| **9** | `/work` index | Only worth a page once 2+ case studies exist |
| **10** | `/join` + hosted form + `/privacy` + `/terms` | CPQC becomes computable. **Legal pages ship in the same commit as the form, never after.** |
| **11** | `/tools` + 3 comparisons | Highest-intent traffic |
| **12** | `/answers` + 10 questions | AEO foundation |
| **13** | `/builds` facets (`/no-code`, `/tools/[tool]`) | Needs 3+ builds per facet to be publishable |
| **14** | `/about`, `/manifesto` | Trust, low traffic |
| **-** | `/u/[handle]` | **Deferred out of V1.** Unblocks only when a real student ships. |

**Do not build the homepage first.** A homepage with no builds behind it is a brochure, and we've already got one of those.

**Do not let `/work` jump the queue.** It is the easier page to write (existing projects, no new building required), which is exactly why it will feel tempting to do first and second and third. Case studies do not generate traffic. One, then back to builds.

---

## 8. PAGES CONSIDERED AND REJECTED

A standard corporate page list was evaluated on 2026-07-30. Recorded here with reasons so it doesn't get re-proposed.

**Already in the plan under a better name. Do not add:**

| Proposed | Already is | Why the existing name is better |
|---|---|---|
| Home | `/` | - |
| About | `/about` | - |
| Products | `/builds` | We have no product. "Products" ranks for nothing; `/builds` matches how people actually search. |
| AI Labs | `/work` | Zero search volume, meaningless to a student, and it's the same content. |
| Research | `/data` | Same content. `/data` is more precise and pairs with `Dataset` schema. Nav label may read "Research". The URL stays `/data`. |
| FAQs | `/answers` | Direct cannibalization. One page per question beats one page with twenty. FAQ rich results are dead as of May 2026, so a bundled FAQ page has no upside at all. |
| Blog | `/builds` + `/answers` + `/data` | **The most expensive mistake on this list.** A blog becomes the dumping ground for content that should have been a build, an answer or a dataset, then competes with all three for the same queries. Every post that belongs somewhere specific weakens the page that should have owned it. No blog. |

**Rejected because the thing doesn't exist yet:**

| Proposed | Verdict |
|---|---|
| Testimonials | **No.** Zero real users. This is the single highest-risk fabrication on the list: a fake testimonial is checkable, and it ends a brand whose entire product is verified work. Same rule that deferred `/u/[handle]`. Ships when a real student says something real, attributably. |
| Community | **No.** No community exists. A "Community" page with no members reads as vapour and invites the one question we can't answer. Revisit if `/join` volume ever justifies it. |
| Careers | **No.** Solo founder, no open roles, no budget. A careers page listing nothing is worse than no page. |

**Accepted as genuine additions:** `/privacy`, `/terms` (see section 3: required, `/join` collects PII), and contact details, which live on `/about` rather than a separate `/contact` page. A standalone contact page with an email address on it is a thin page; folded into `/about` it strengthens a page that already needs to exist. Add `contactPoint` to the `Organization` schema so engines can read it either way.

**The rule this encodes:** every page must own a query no other page owns, or exist for a legal or trust reason. Pages that exist because other companies have them are how a site ends up with forty URLs and no rankings.

---

## 9. WHAT V1 DELIBERATELY LACKS

No auth · no dashboard · no comments · no search (use static filters) · no newsletter infrastructure · no payments · no CMS · no analytics beyond one lightweight script · no chatbot.

Every one of these is addable later without changing a URL. That's the only architectural promise V1 needs to keep.

---

## 10. OPEN

| Item | Status |
|---|---|
| Do we have distribution to send anyone here? | 🔴 unanswered |
| Whether `/u/[handle]` earns its reservation | 🟢 **resolved 2026-07-30:** URL reserved, page deferred out of V1. No fabricated builders, ever. |
| Whether founder-built agentic projects belong on the site | 🟢 **resolved 2026-07-30:** yes, as `/work/*` case studies, not build pages |
| Whether any beginner-replicable ₹0 build exists yet | 🔴 **none written:** every existing project is agentic/heavy-backend. Build #1 must be made deliberately small. |
| Route noun: `/work` vs `/proof` | 🟡 `/work` chosen; low traffic either way, cheap to change before launch |
| Which off-site surfaces the founder can actually sustain weekly | 🔴 unanswered: six listed, one per week is the realistic cap |
| Real `sameAs` profile list | 🔴 only Instagram confirmed to exist |
| DPDP Act obligations for the `/join` form | 🔴 **unverified:** check at source before collecting real data |
| Whether `/join` accepts under-18s | 🔴 **decide before launch:** stricter consent rules if yes |
| Legal review of `/privacy` and `/terms` | 🔴 not done: these are drafts until reviewed |
| `llms.txt` as a GEO lever | 🟢 **resolved 2026-07-30:** demoted. 97% never read; keep the file, drop the maintenance. |
| `FAQPage` / `HowTo` rich results | 🟢 **resolved 2026-07-30:** both fully deprecated. Emit for AI extraction only, budget zero SERP lift. |
| Pricing / paid anything | 🔴 E3 |
| Public category noun for the hero | 🔴 needs student language |

---

## 11. WHAT THIS PLAN CANNOT DO

Stated so success is measured against the right target.

**No site structure ranks #1 for `ai projects` or `ai tools`.** Those are head terms held by domains with years of accumulated authority and thousands of referring domains. Structure is a prerequisite, not a cause. What structure buys is that every page we publish converts its full earned authority into ranking instead of leaking it to cannibalization, thin facets, orphans, slow images and broken canonicals, which is what this section 4 rewrite fixes.

**The order of operations is fixed and cannot be skipped:**

1. Win long-tail build queries: dozens of pages, each nearly uncontested
2. Those pages earn mentions, links and answer-engine citations
3. That authority makes mid-tail comparison terms winnable
4. Only then are head terms in range

**Honest timeline:** brand term in weeks. First long-tail rankings in 1-4 months. Comparison terms in 4-12 months. Head terms are a year-2-3 outcome and only if steps 1-3 actually happen. Anyone promising faster on a new domain is selling something.

**The binding constraint is not SEO.** It is publishing rate: a solo founder writing real builds with real prompts and real failures. Ten excellent pages beat a hundred thin ones, and a hundred thin ones actively hurt. The `/data` and `/work` surfaces exist because they produce citable, unfakeable assets from work already being done, which is the only way a solo operator outruns a content farm.
