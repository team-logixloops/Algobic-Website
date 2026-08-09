> ⚠️ **RETIRED 2026-07-30, never ratified.** Standards-body direction rejected; no judge panel available. Superseded by [`brand.md`](brand.md). Kept for audit trail only.

# THE ALGOBIC BAR: v1 specification

**Status: 🟡 designed, pending judge ratification.** A standard authored without judges has no authority: the panel must co-sign or amend before the first round runs.

**Public by default.** Refusal #3 requires the standard be published, including the failure rate.

---

## THE ONE-LINE VERSION

> Ship something a stranger actually used. Then defend every decision in it, live, to two people who would know if you were bluffing.

---

## WHY THIS SHAPE

AI made *producing* work free. So the bar cannot measure output: output is no longer evidence of anything.

What AI did not make free:
- deciding **what** to build and what to leave out
- knowing **when the model is wrong**
- getting a **real human** to use the thing
- **defending** it in real time, under pressure, against someone who knows more than you

The oldest and most robust verification humans have built is the oral defense: the viva, the thesis defense, medical boards, the legal bar. It survives because you cannot prompt your way through thirty minutes of hostile questioning about your own work.

**That is the bar. Not a test. A defense.**

---

## THE THREE COMPONENTS

### 1. THE WORK
One thing you built. Shipped. **Used by at least one person who is not your friend, classmate, or relative.**

Submitted evidence:
- live URL or installable artifact
- git history (the process, not just the result)
- one sentence: who used it, when, what happened

**Any stack. Any language. Any domain.** The bar measures judgment, not technology, which is why it stays valid when the technology changes.

### 2. THE DEFENSE
**30 minutes. Two judges. Live. Adversarial.**

You defend the work. Judges probe until they hit the bottom of your understanding. Then they probe one level past it, because where a person stops knowing is the measurement.

### 3. THE CATCH
You must produce **at least one documented instance where AI gave you wrong output and you caught it.**

The actual transcript. The actual diff. What was wrong, how you noticed, what you did.

*This is the highest-signal criterion in the whole bar.* 2026 hiring already screens for it: employers look for the candidate who pushes back on model output, not the one who avoided using models. Nobody has turned it into a standard yet.

---

## WHAT THE DEFENSE MEASURES

Five things. Published, so candidates know exactly what they're walking into.

| # | Criterion | The question behind it |
|---|---|---|
| 1 | **Scope** | Why this problem, at this size? Defend what you left out. |
| 2 | **Decisions** | Every non-obvious choice. "Why this and not that?" |
| 3 | **Verification** | What did you check yourself? How do you know it works? |
| 4 | **The Catch** | Where was the model wrong, and how did you know? |
| 5 | **Reality** | Who used it? What happened? What broke? |

## AUTOMATIC NOT-YET

Published, because a bar people can't see isn't a bar.

- You cannot explain a line of your own submitted code
- No real user outside your circle
- No Catch
- Your answers change under pressure
- The work was submitted by someone else, in any part

---

## THE VERDICT

**Binary. `Cleared` or `Not Yet`.**

No scores, no percentiles, no tiers (not in v1). Scores invite gaming and drift upward under commercial pressure. Binary verdicts don't inflate quietly.

Every verdict ships with a **written judgment**: what held, what didn't, what would clear it next time. Signed by both judges.

`Not Yet` is a real, respectable, publishable outcome. It is not a failure state and the language never treats it as one.

**Re-attemptable.** No limit. Each attempt is dated and recorded.

**Time-stamped, not permanent.** You cleared the bar *in 2026*. This is honest (a 2026 standard should not certify a 2031 engineer), and it means the record stays alive instead of becoming a dead certificate.

---

## WHAT THE BAR IS NOT

| Not | Because |
|---|---|
| A DSA / competitive-programming test | Codeforces already measures that, better, for free |
| A fixed project brief | That's a curriculum. We refuse curriculum. |
| A timed challenge | Measures speed. Speed is now free. |
| A certificate | A certificate is a PDF. This is a public record with the work attached. |
| A course with an exam at the end | There is no course. |

---

## SCALE AND ECONOMICS 🟡

**Judge time is the binding constraint, and that is a feature.**

| | Round 1 |
|---|---|
| Attempts | ~20 |
| Judge time | 2 judges × 30 min × 20 = **20 judge-hours** |
| Batch cadence | Monthly, so scarcity is structural |

Attempt fee exists to pay judge honoraria, not to generate margin. **Cheap to attempt, standing earned, never sold** (Principle 9). Actual number: 🔴 blocked on E3.

Scarcity is not a growth problem to solve. A bar anyone can attempt any time, at volume, is a bar under commercial pressure to pass people.

---

## WHY IT SURVIVES AI GETTING 100× BETTER

The defense is human, live, and adversarial: it degrades under no model improvement.

The Catch criterion gets **harder**, not easier, as models improve: better models fail in subtler ways, so catching them requires deeper understanding. As AI improves, this bar becomes a more discriminating instrument, not a less relevant one.

---

## WHY IT APPRECIATES

Every round adds: a public pass rate, a set of named judges, a set of written judgments, and a cohort of people who cleared it.

None of that can be bought, copied, or funded around. **A competitor launching this same bar tomorrow starts at zero rounds held.** That gap only widens.

---

## OPEN ITEMS

| Item | Status | Owner |
|---|---|---|
| Judge ratification of this spec | 🟡 | founder (needs the panel) |
| Attempt fee | 🔴 | E3 |
| Whether students will accept `Not Yet` | 🔴 | E3 (**load-bearing**) |
| Judge calibration across pairs | 🟡 | after round 1 |
| Public record page design | next | Phase 2 |
