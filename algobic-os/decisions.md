# Decision Log

Append-only. Never edit an entry. Supersede it with a new one.

Format:
```
## D-NNN | YYYY-MM-DD | Type 1 (one-way) | Type 2 (reversible)
DECISION:
BET (what must be true):
KILL (what makes us reverse):
REVIEW:
SUPERSEDES / SUPERSEDED BY:
```

---

## D-001 | 2026-07-30 | Type 2

DECISION: Run parallel discovery (Workstream A) instead of pivoting to a marketplace model.
BET: Load-bearing assumptions sit at 30-45% confidence; testing costs ~₹0 and 2 weeks.
KILL: Discovery returns nothing in 3 weeks, or reveals the current vision is already validated.
REVIEW: 2026-08-13

---

## D-002 | 2026-07-30 | Type 2

DECISION: All discovery experiments are solution-agnostic. Algobic is never mentioned in an interview.
BET: Past-behaviour questions produce truer data than future-intent questions.
KILL: Interviews produce unactionable mush across 10+ conversations.
REVIEW: 2026-08-06

---

## D-003 | 2026-07-30 | Type 2

DECISION: Site positioning frozen. `"portfolio over certificates"` keyword stays until E5 returns.
BET: Portfolio-decay is a 45%-confidence prediction, not a finding. Not enough to act on.
KILL: E5 shows employers no longer open portfolios first.
REVIEW: after E5

---

## D-004 | 2026-07-30 | **Type 1 (one-way)**

DECISION: Algobic's category is a **standards body / proving ground**. Not a school, marketplace, or platform.
BET: Authority is time-denominated, so a held bar is the only asset that appreciates. Standards is the one emotional territory unowned in Indian education. Survives all four AI-future scenarios.
KILL: E3 shows students will not tolerate being judged, or judges cannot be recruited.
REVIEW: after E3
EVIDENCE: CSE employability >80% (kills the employability category); Bloom's effect traced to the mastery standard not the tutor (0.37 SD replication vs claimed 2.0); 16 of 27 Indian edtechs loss-making 2025.

---

## D-005 | 2026-07-30 | Type 2

DECISION: Authority is **borrowed from a named judge panel**, never asserted by the founder. Founder is curator of judges, not the face.
BET: Historical bootstrap path for every examining body. Also removes the founder single point of failure.
KILL: No credible judge will participate without an existing track record.
REVIEW: 2026-08-13
EVIDENCE: Buildspace shut down Aug 2024 (two years runway, best season on record, path to $3-5M ARR). Cause: founder burnout, not money.

---

## D-006 | 2026-07-30 | Type 2

DECISION: Core emotion shifts from **fear of unemployment → fear of mediocrity**. Manifesto rewritten (`identity.md` §9). Not yet deployed to the live site.
BET: The unemployment frame is factually false at 80%+ employability. A false premise cannot support a standards brand.
KILL: E3 shows students do not recognise the underemployment ceiling as their problem.
REVIEW: after E3

---

## D-007 | 2026-07-30 | **Type 1 (one-way)** (SUPERSEDES D-004, D-005, D-006)

DECISION: Algobic is **the front door to building**, the place people go to build the AI project they scrolled past. Not a standards body. Not engineers-only. Prerequisite dropped: no coding background required.
BET: The tools solved capability; nobody solved activation. Dropping the engineering requirement widens the market honestly rather than diluting it.
KILL: E3 shows non-engineers don't see themselves as potential builders, or the activation gap isn't felt strongly enough to act on.
REVIEW: after E3
EVIDENCE: vibe-coding market $4.7B in 2026 → $12.3B forecast 2027; 84% of AI coding tool users have no engineering background; Lovable $100M→$400M ARR in 8 months; Replit $10M→$100M in 9; Emergent AI (India) $25M ARR run-rate, $23M Series A; ~41% of global code AI-generated.
RETIRES: `identity.md`, `the-bar.md` (banners added, files kept for audit trail).
PRODUCES: `brand.md`, `content.md`, `website.md`.

---

## D-008 | 2026-07-30 | Type 2

DECISION: Fear hooks capped at ~10% of content output; status and utility hooks carry the rest. Fear is never the brand promise.
BET: DM shares now outweigh likes for new-audience reach, and fear content about one's own inadequacy is consumed but not forwarded. Sharing it broadcasts anxiety. Status content is shared as a flex, utility as a gift.
KILL: Own baseline shows fear hooks out-performing on sends-per-reach, not just views.
REVIEW: after first 20 posts

---

## D-009 | 2026-08-01 | Type 2

DECISION: Ship the homepage now, at priority 6's content but priority 0's slot. `/` serves a real landing page; the coming-soon splash is deleted. This overrides `website.md` section 7, which puts the homepage after `/builds` and `/work` exist and says plainly "do not build the homepage first."
BET: The objection to an early homepage is that it becomes a brochure making promises no work backs up. That failure mode is avoidable rather than inherent: the page states its build count as **0** at display size, prints its market figures with a verification date, and renders its single best-sounding statistic (63-84% no coding background) in muted with "no published method" beside it. A page that marks down its own numbers is not a brochure. The `/builds` template is still the next thing built and still carries the traffic.
KILL: The page draws attention before build #1 exists and the honest zero reads as vapour rather than as confidence. Or: publishing pulls founder time away from writing build #1, which is the only thing that compounds.
REVIEW: when build #1 ships, or 2026-09-01, whichever is first.
EVIDENCE: no distribution exists yet (`brand.md` open items), so the downside of publishing early is bounded by an audience of roughly nobody, while the upside is that the one live channel (Instagram) finally has somewhere to point.
NOTE: `/join` was considered as the page's action and rejected. It needs `/privacy` and `/terms` in the same ship, and both DPDP obligations and the under-18 question are still 🔴 unresolved in `website.md` section 10. Instagram collects no personal data, so it carries no legal surface. Revisit when those two are answered.

---

## PRE-REGISTERED READING RULES (written before data exists)

| If we observe | Then |
|---|---|
| E1: 5/5 hire by referral only | Employer-pays model is dead. Do not resuscitate. |
| E3: most have never paid for anything | Segment may not be a market. Reconsider ICP, not product. |
| E2: winners share one channel | That channel becomes the company. |
| E5: portfolios still opened first | Portfolio-death prediction was wrong. Record it. |
| E6: clubs dormant | Campus thesis dead. |
| Zero surprises across all 6 | Questions were leading. Redo, don't proceed. |

---

## PENDING (blocked on discovery)

- D1.1 Core scarce good: blocked on E1, E2, E3
- D1.2 Who pays (**Type 1**): blocked on E1, E3
- D1.3 Student promise: blocked on E3, E4
- D1.5 School vs marketplace: blocked on E1, E2
