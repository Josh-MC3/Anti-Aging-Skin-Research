# Changelog

## v1.0.0 — Initial publication

All 16 planned pages complete and committed:

**Foundations:** Home, The Science of Aging, Lifestyle, Exercise & Body Composition, Nutrition & Supplements
**Treatments:** Skincare Ingredients, Device Therapy, Cosmetic Procedures, Hyperpigmentation
**Personalize:** Skin Through the Decades, Age/Genetics & Skin Type
**Act:** Products Guide, Myths vs Facts, Build Your Routine, Cost vs Benefit Calculator
**Reference:** Glossary & Evidence Key

### Notable architecture decisions (see `/docs/Phase_1_Architecture.md` for full reasoning)

- "Skin Through the Decades" was built as a single page with five expandable panels rather than five standalone pages, since per-decade content overlapped too heavily to justify five full pages.
- Tattoo care was added as a subsection of Lifestyle (not a standalone page) after the brief was extended mid-project.
- A 16th page (Glossary & Evidence Key) was added beyond the original 15-page brief, since the evidence-rating system and recurring terminology needed one persistent, searchable reference point.

### Evidence framework (see `/docs/Phase_2_Research_Standards.md`)

Every intervention is rated on multiple separate axes — Evidence Quality (★), Magnitude of Effect, Safety, Consistency, and Long-Term Data — deliberately never blended into one combined score. Source quality follows a 9-tier hierarchy from clinical guidelines down to marketing claims.

### Known editorial flags carried into this release

A few findings surfaced during research are worth knowing about as you read the site:

- A source's claims about a specific "JAMA Dermatology twin study" and a "landmark JAMA Dermatology" sunscreen trial (encountered while researching Skin Through the Decades) could not be independently verified and were excluded as possibly fabricated or misattributed citations.
- No dedicated peer-reviewed trial directly comparing luxury vs. drugstore skincare efficacy appears to exist in the literature; the Myths vs Facts page notes this gap explicitly rather than citing industry commentary with more confidence than it deserves.
- Several pages (Device Therapy, Cosmetic Procedures, Nutrition & Supplements) found that popular, heavily-marketed categories — microcurrent devices, thread lifts, zinc-for-acne — have notably thinner independent evidence than their marketing presence suggests. This is reported directly rather than softened.

### Maintenance notes

- `Products Guide` and `Cost vs Benefit Calculator` are the two pages most likely to need revisiting first, since pricing data drifts faster than clinical evidence.
- Per-page draft files in `/docs/phase-drafts` include "Open Items for Your Review" sections flagging editorial judgment calls made during drafting — useful context if extending or auditing any single page later.
