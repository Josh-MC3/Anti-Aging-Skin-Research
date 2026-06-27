# Phase 1 — Website Architecture
## Evidence-Based Skin Aging, Healthy Aging & Longevity Resource

**Status:** Draft for approval. No page content has been written. This document is the master blueprint only, per Phase 0 project rules.

---

## 0. Architectural Principles (board consensus)

Before the page-by-page blueprint, the editorial board agreed on a few structural decisions that affect every page below:

1. **Shared page skeleton.** Every page (regardless of topic) uses the same subsection skeleton from Phase 4, so a reader's mental model never has to reset between pages: Overview → Mechanism → Evidence → Practical Recommendations → Who Benefits / Who Should Avoid → Expected Timeline → Costs → Side Effects → Common Misconceptions → Research Gaps → Clinical Bottom Line → FAQ. Page-specific content (decision trees, tables, calculators) is layered into this skeleton, not a replacement for it.

2. **"Decades" is one page, not five.** The source prompt lists 20s/30s/40s/50s/60+ as if each warrants standalone-page depth. The board's judgment: the actual content per decade (what changes, what to adjust, top ROI moves) is short and overlaps heavily across decades — five full pages would mean five thin pages with duplicated citations. We're architecting it as **one page with five expandable decade panels** sharing a single comparison table. **Flagging this as a deviation from "16 separate pages" for your review** — happy to split it into 5 if you'd rather have standalone depth per decade.

3. **Heavy cross-linking is load-bearing, not decorative.** Because ingredients, devices, procedures, and pigmentation topics constantly reference each other (e.g., retinoids show up in Skincare Ingredients, Decades, Hyperpigmentation, and Build Your Routine), every page's "Internal Links" field is treated as a real navigation requirement, not a nice-to-have.

4. **Decision trees and interactive tools = real functional components**, not described/static content, since the final build is a React artifact. Phase 1 specifies *what* each interactive element decides or calculates; Phase 4 will build the actual logic.

5. **"Medical reviewers required" is a labeling convention**, not a claim of real human review. It tells the writer (me, in Phase 4) which specialist voice/standard of rigor a page's claims need to be held to. No page will claim "reviewed by Dr. X" — disclaimer language in Phase 3 will make the actual review process transparent to readers.

---

## 1. Full Sitemap (16 pages)

| # | Page | Difficulty |
|---|------|-----------|
| 1 | Home | Beginner |
| 2 | The Science of Aging | Intermediate |
| 3 | Lifestyle | Beginner–Intermediate |
| 4 | Exercise & Body Composition | Beginner–Intermediate |
| 5 | Nutrition & Supplements | Intermediate |
| 6 | Skincare Ingredients | Intermediate–Advanced |
| 7 | Device Therapy | Intermediate–Advanced |
| 8 | Cosmetic Procedures | Advanced |
| 9 | Hyperpigmentation & Uneven Skin Tone | Intermediate |
| 10 | Skin Through the Decades | Beginner–Intermediate |
| 11 | Age, Genetics & Skin Type | Intermediate |
| 12 | Products Guide | Beginner–Intermediate |
| 13 | Myths vs Facts | Beginner |
| 14 | Build Your Routine | Beginner–Intermediate |
| 15 | Cost vs Benefit Calculator | Beginner–Intermediate |
| 16 | (Cross-cutting) Glossary & Evidence Key | Beginner |

*Page 16 added by the board: a persistent glossary/evidence-rating-key reference wasn't explicitly requested but is required infrastructure — nearly every page uses the ★ rating system and technical terms (glycation, Fitzpatrick type, RCT, etc.) and readers need one place to look them up rather than re-explaining inline everywhere. Flagging this addition for your review.*

---

## 2. Per-Page Blueprint

### 1. Home

- **Purpose:** Orient the reader, set expectations (evidence-first, not marketing), provide entry points into the rest of the site.
- **Target reader:** Everyone — first touchpoint for beginners and advanced readers alike.
- **Learning objectives:** Understand the site's evidence philosophy; understand the ★ rating system; find the right entry page for their situation (e.g., "I'm in my 30s and want to start a routine" vs. "I want to know if X device works").
- **Estimated reading time:** 3–4 min.
- **Prerequisite knowledge:** None.
- **Internal links:** The Science of Aging, Build Your Routine, Skin Through the Decades, Myths vs Facts, Evidence Key.
- **Related pages:** All (hub page).
- **Illustrations required:** 1 hero diagram — simplified cross-section of skin showing the layers relevant to aging (epidermis, dermis, collagen/elastin network).
- **Tables required:** None.
- **Infographics required:** "How to read this site" — visual legend of evidence stars + callout box types.
- **Decision trees required:** "Where should I start?" — routes reader to Decades, Build Your Routine, or a specific concern page (acne marks → Hyperpigmentation; "is X worth it" → Myths vs Facts) based on 2–3 quick questions.
- **Interactive tools required:** The above decision tree, built as an actual clickable component.
- **Search tags:** evidence-based skincare, anti-aging guide, skin health resource.
- **Primary keywords:** evidence-based skin aging, skincare science.
- **Secondary keywords:** anti-aging guide, healthy aging skin.
- **Medical reviewers required (label):** Medical Science Writer + Dermatologist (tone/accuracy of framing claims).
- **Difficulty level:** Beginner.

---

### 2. The Science of Aging

- **Purpose:** Establish the mechanistic foundation (intrinsic/extrinsic aging, collagen/elastin, glycation, oxidative stress, telomeres, hormones, genetics vs. lifestyle) that every later page will reference rather than re-explain.
- **Target reader:** Curious beginners through advanced readers wanting the "why."
- **Learning objectives:** Distinguish intrinsic vs. extrinsic aging; explain collagen/elastin breakdown, glycation, oxidative stress, mitochondrial/telomere aging in plain terms; understand realistically what is and isn't modifiable.
- **Estimated reading time:** 10–12 min (expandable advanced subsections push this higher for advanced readers).
- **Prerequisite knowledge:** None, but this page is itself a prerequisite for most others.
- **Internal links:** Skincare Ingredients (mechanisms tie directly to retinoids/antioxidants), Lifestyle, Age/Genetics/Skin Type, Evidence Key.
- **Related pages:** Nearly all — this is the mechanistic reference page.
- **Illustrations required:** Collagen/elastin breakdown diagram; UV penetration depth diagram (UVA vs UVB); free radical/antioxidant mechanism diagram; telomere shortening diagram.
- **Tables required:** "Modifiable vs. non-modifiable factors" table.
- **Infographics required:** Cellular aging timeline (intrinsic clock vs. cumulative extrinsic damage).
- **Decision trees required:** None (foundational/explanatory page).
- **Interactive tools required:** Expandable "advanced" toggle per subsection (mitochondrial theory, telomere biology) so beginners aren't overwhelmed but advanced readers can dig in.
- **Search tags:** skin aging mechanisms, intrinsic extrinsic aging, collagen elastin breakdown, glycation, oxidative stress skin.
- **Primary keywords:** how skin ages, science of skin aging.
- **Secondary keywords:** collagen breakdown, telomeres aging, photoaging.
- **Medical reviewers required (label):** Dermatologist + Longevity Researcher + Endocrinologist.
- **Difficulty level:** Intermediate (with advanced expandables).

---

### 3. Lifestyle

- **Purpose:** Cover sleep, hydration, stress, smoking/vaping, alcohol, sun exposure as aging factors, including thresholds where habits become harmful.
- **Target reader:** Beginners wanting practical, prioritized guidance.
- **Learning objectives:** Identify which lifestyle factors have the strongest evidence for skin/aging impact; understand dose-response thresholds (e.g., occasional vs. daily); separate myth from evidence per factor.
- **Estimated reading time:** 14–16 min (multiple sub-topics).
- **Prerequisite knowledge:** Science of Aging (helpful, not required).
- **Internal links:** Science of Aging, Exercise & Body Composition, Skin Through the Decades, Myths vs Facts.
- **Related pages:** Nutrition & Supplements, Exercise & Body Composition.
- **Illustrations required:** None beyond shared iconography.
- **Tables required:** "Threshold table" — occasional/moderate/heavy use bands for alcohol, smoking, vaping, sun exposure, with associated risk framing.
- **Infographics required:** "Top 5 ROI lifestyle changes" ranked infographic.
- **Decision trees required:** None.
- **Interactive tools required:** Self-check sliders (e.g., "how many drinks/week," "hours of sleep") that surface the relevant evidence band — framed as educational, not diagnostic.
- **Search tags:** sleep skin aging, sun exposure skin damage, smoking skin aging, alcohol skin aging, stress cortisol skin.
- **Primary keywords:** lifestyle factors skin aging, sun damage prevention.
- **Secondary keywords:** sleep and skin, smoking and wrinkles, stress and skin health.
- **Medical reviewers required (label):** Dermatologist + Endocrinologist + Epidemiologist (dose-response claims).
- **Difficulty level:** Beginner–Intermediate.

---

### 4. Exercise & Body Composition

- **Purpose:** Explain how muscle/body composition affects skin appearance; resistance training, cardio, posture; loose skin after weight loss.
- **Target reader:** Beginners to intermediate, especially readers in active weight loss or strength training.
- **Learning objectives:** Understand why body composition (not just weight) affects skin appearance; set realistic expectations about loose skin and rate of weight loss.
- **Estimated reading time:** 9–11 min.
- **Prerequisite knowledge:** None.
- **Internal links:** Lifestyle, Nutrition & Supplements, Skin Through the Decades.
- **Related pages:** Cosmetic Procedures (skin removal surgery is the surgical answer to loose skin).
- **Illustrations required:** Diagram of skin/fat/muscle layering and how each affects surface appearance.
- **Tables required:** Rapid vs. gradual weight loss comparison (skin elasticity outcomes).
- **Infographics required:** None additional.
- **Decision trees required:** None.
- **Interactive tools required:** None required; optional simple BMI/rate-of-loss calculator could live here but is more naturally housed in Cost vs Benefit Calculator — **flagging for your call** on whether to duplicate or cross-link only.
- **Search tags:** muscle skin tightness, resistance training skin, loose skin weight loss, exercise skin aging.
- **Primary keywords:** exercise and skin aging, body composition skin appearance.
- **Secondary keywords:** loose skin after weight loss, posture and aging appearance.
- **Medical reviewers required (label):** Exercise Physiologist + Plastic Surgeon (loose-skin realism).
- **Difficulty level:** Beginner–Intermediate.

---

### 5. Nutrition & Supplements

- **Purpose:** Evidence review of protein, collagen peptides, vitamin C/D, omega-3, creatine, zinc, copper, probiotics, and other popular anti-aging supplements.
- **Target reader:** Beginners through advanced (supplement claims attract scrutiny from advanced readers especially).
- **Learning objectives:** Evaluate supplement claims against evidence tier; understand realistic dosing, cost, and expected results (if any) per supplement.
- **Estimated reading time:** 16–18 min.
- **Prerequisite knowledge:** Evidence Key helpful.
- **Internal links:** Science of Aging, Skincare Ingredients (collagen peptides overlap topical vs. oral), Myths vs Facts, Products Guide.
- **Related pages:** Exercise & Body Composition.
- **Illustrations required:** None required beyond shared iconography.
- **Tables required:** Master supplement comparison table (mechanism, evidence tier, dose, cost, side effects, expected result) — this is the page's central artifact.
- **Infographics required:** None additional.
- **Decision trees required:** None.
- **Interactive tools required:** Sortable/filterable version of the master table (sort by evidence tier or cost).
- **Search tags:** collagen peptides evidence, vitamin C supplement skin, creatine skin, supplements for skin aging.
- **Primary keywords:** anti-aging supplements, collagen supplements evidence.
- **Secondary keywords:** vitamin D skin, omega-3 skin health, zinc copper skin.
- **Medical reviewers required (label):** Nutrition Scientist + Endocrinologist.
- **Difficulty level:** Intermediate.

---

### 6. Skincare Ingredients

- **Purpose:** The evidence-density core of the site — every major topical active, individually reviewed.
- **Target reader:** All levels; this is likely the highest-traffic page.
- **Learning objectives:** Match ingredient to skin type/goal; understand correct usage (AM/PM, concentration, layering mistakes); set a realistic timeline for visible results.
- **Estimated reading time:** 20–25 min (designed for scanning/searching, not linear reading).
- **Prerequisite knowledge:** Science of Aging (mechanism section references it directly).
- **Internal links:** Science of Aging, Hyperpigmentation, Build Your Routine, Products Guide, Skin Through the Decades.
- **Related pages:** Device Therapy, Cosmetic Procedures (escalation path when topicals plateau).
- **Illustrations required:** Skin penetration depth diagram comparing ingredient classes (e.g., AHA surface action vs. retinoid cellular turnover action).
- **Tables required:** Master ingredient comparison table (evidence rating, concentration, skin type fit, AM/PM, common mistakes, timeline) — every ingredient gets a row; this table is the page's spine.
- **Infographics required:** "Layering order" infographic (what goes under/over what, what not to combine — e.g., retinoid + AHA conflicts).
- **Decision trees required:** "Which ingredient should I start with?" — routes by skin concern (texture, pigmentation, fine lines, sensitivity) and skin type.
- **Interactive tools required:** Searchable/filterable ingredient table; the decision tree above as a real component.
- **Search tags:** retinol vs retinoid, niacinamide evidence, vitamin C serum skin, azelaic acid, peptides skincare, bakuchiol evidence.
- **Primary keywords:** evidence-based skincare ingredients, retinoid guide.
- **Secondary keywords:** niacinamide benefits, hyaluronic acid serum, tranexamic acid skin.
- **Medical reviewers required (label):** Dermatologist + Cosmetic Chemist.
- **Difficulty level:** Intermediate–Advanced (structured for both: quick-scan table for beginners, full mechanism text for advanced).

---

### 7. Device Therapy

- **Purpose:** Evidence review of at-home and professional devices (LED/red light, RF, microneedling, laser, IPL, ultrasound, microcurrent, cryotherapy).
- **Target reader:** Intermediate–advanced; readers comparing at-home devices against clinic treatments and against social-media claims.
- **Learning objectives:** Distinguish device categories by actual clinical evidence; compare at-home vs. professional versions of the same modality; identify which trends are mostly marketing.
- **Estimated reading time:** 16–18 min.
- **Prerequisite knowledge:** Science of Aging (collagen/elastin mechanism).
- **Internal links:** Skincare Ingredients (combination protocols), Cosmetic Procedures (professional escalation), Myths vs Facts (red light/social trends), Products Guide.
- **Related pages:** Cosmetic Procedures.
- **Illustrations required:** Diagram comparing penetration depth/mechanism across device categories (light-based vs. RF vs. mechanical microneedling).
- **Tables required:** Device comparison table (clinical evidence tier, best candidates, cost, home vs. clinic, risks, schedule).
- **Infographics required:** "Does it actually work?" verdict strip per device (clear evidence / mixed / marketing-driven).
- **Decision trees required:** "At-home or professional?" — routes by goal, budget, and severity.
- **Interactive tools required:** Comparison table filter (by goal: texture / firmness / pigmentation / acne); decision tree as real component.
- **Search tags:** red light therapy evidence, RF microneedling, LED mask skin, at home microcurrent, does red light therapy work.
- **Primary keywords:** skin device therapy evidence, LED mask evidence.
- **Secondary keywords:** RF microneedling results, at-home vs professional devices.
- **Medical reviewers required (label):** Dermatologist + Plastic Surgeon.
- **Difficulty level:** Intermediate–Advanced.

---

### 8. Cosmetic Procedures

- **Purpose:** Evidence and practical comparison of injectable/surgical/energy-based procedures (Botox, fillers, peels, PRP, fat grafting, thread lifts, facelifts, body contouring, skin removal).
- **Target reader:** Advanced/decision-stage readers — people actively considering a procedure.
- **Learning objectives:** Compare cost, longevity, downtime, risk, and ideal candidacy across procedures; understand what's reversible vs. permanent; know what questions to bring to a consultation.
- **Estimated reading time:** 18–20 min.
- **Prerequisite knowledge:** Skincare Ingredients and/or Device Therapy (this page assumes the reader has already considered non-procedural options).
- **Internal links:** Device Therapy, Age/Genetics/Skin Type, Cost vs Benefit Calculator.
- **Related pages:** Exercise & Body Composition (loose-skin surgical path).
- **Illustrations required:** Facial anatomy diagram showing injection zones (educational, non-graphic) for Botox/filler context.
- **Tables required:** Procedure comparison table (cost, longevity, downtime, ideal age/candidate, risk level).
- **Infographics required:** "Reversible vs. permanent" spectrum graphic.
- **Decision trees required:** "What's the right escalation point?" — routes from topical/device options to specific procedure categories based on concern and risk tolerance.
- **Interactive tools required:** Decision tree above; cost/longevity sort on the comparison table.
- **Search tags:** botox vs fillers, thread lift evidence, PRP skin, facelift recovery, body contouring evidence.
- **Primary keywords:** cosmetic procedures comparison, botox fillers evidence.
- **Secondary keywords:** thread lift results, facelift vs non-surgical, skin removal surgery.
- **Medical reviewers required (label):** Plastic Surgeon + Dermatologist.
- **Difficulty level:** Advanced.

- **Note from board:** This page will include a clear, prominent disclaimer (per Phase 3 style guide) that procedure decisions require an in-person consultation with a licensed provider, and the page does not substitute for individualized medical advice.

---

### 9. Hyperpigmentation & Uneven Skin Tone

- **Purpose:** Dedicated treatment of sun spots, PIH, melasma, and friction/hormonal darkening (underarms, knees, elbows, neck), causes through to professional treatment.
- **Target reader:** Beginner–intermediate; high direct-search intent (people often land here specifically).
- **Learning objectives:** Identify likely cause category for a pigmentation concern; understand realistic topical vs. professional treatment timelines; know when to seek in-person evaluation (e.g., rapidly changing or asymmetric pigmentation).
- **Estimated reading time:** 14–16 min.
- **Prerequisite knowledge:** None required; links back to Skincare Ingredients for mechanism depth.
- **Internal links:** Skincare Ingredients (tranexamic acid, azelaic acid, vitamin C, hydroquinone), Age/Genetics/Skin Type (Fitzpatrick-related risk), Device Therapy (IPL/laser for pigmentation).
- **Related pages:** Skin Through the Decades.
- **Illustrations required:** Diagram of melanocyte activity / where pigment forms in skin layers.
- **Tables required:** Cause-to-treatment matrix (cause category → likely topical options → likely professional options → expected timeline).
- **Infographics required:** "When to see a professional" flagged-symptom infographic (e.g., asymmetric, rapidly changing, or bleeding spots warrant evaluation).
- **Decision trees required:** "What's likely causing this?" — by location (face/underarm/knee/neck) and pattern, routing to relevant treatment section. Explicitly framed as educational triage, not diagnosis.
- **Interactive tools required:** Decision tree above as real component.
- **Search tags:** melasma treatment, post inflammatory hyperpigmentation, dark underarms causes, dark inner thighs, hyperpigmentation evidence.
- **Primary keywords:** hyperpigmentation treatment, uneven skin tone causes.
- **Secondary keywords:** melasma evidence, dark knees elbows causes, acne marks treatment.
- **Medical reviewers required (label):** Dermatologist + Endocrinologist (hormonal/insulin-resistance contributors).
- **Difficulty level:** Intermediate.

---

### 10. Skin Through the Decades *(architected as one page with 5 panels — see Section 0.2 deviation note)*

- **Purpose:** Age-banded practical guidance (20s/30s/40s/50s/60+): what changes, what to adjust, highest-ROI moves, common mistakes per decade.
- **Target reader:** Beginner–intermediate, self-selecting by age.
- **Learning objectives:** Identify the highest-ROI actions for their decade; avoid the most common decade-specific mistakes; understand how recommendations should evolve over time rather than staying static.
- **Estimated reading time:** 12–14 min total (each panel ~2–3 min, since readers usually want their own decade plus maybe the next one).
- **Prerequisite knowledge:** None; this page is a practical synthesis that links back to mechanism/evidence pages rather than re-deriving them.
- **Internal links:** Build Your Routine, Skincare Ingredients, Hyperpigmentation, Cosmetic Procedures.
- **Related pages:** Age, Genetics & Skin Type.
- **Illustrations required:** None additional (shared iconography per decade panel).
- **Tables required:** Single comparison table across all 5 decades (rows = focus areas like "topicals," "procedures to consider," "biggest mistake," columns = decades) — this is the page's central artifact and the reason it works better as one page than five.
- **Infographics required:** None additional.
- **Decision trees required:** None (age self-selection replaces a decision tree here).
- **Interactive tools required:** Expandable panel per decade (so the page loads compact, expands to depth per the reader's actual decade).
- **Search tags:** skincare in your 20s, skincare in your 40s, anti-aging routine by age, when to start retinol, when to consider botox.
- **Primary keywords:** skincare by decade, anti-aging routine by age.
- **Secondary keywords:** skincare in your 30s, skin changes after 50.
- **Medical reviewers required (label):** Dermatologist + Plastic Surgeon (procedure-timing claims) + Medical Science Writer.
- **Difficulty level:** Beginner–Intermediate.

---

### 11. Age, Genetics & Skin Type

- **Purpose:** Explain how age, genetics, biological sex, Fitzpatrick skin type, and ancestry influence aging and procedure selection — explicitly framed around individual variation exceeding population-level difference, avoiding stereotyping.
- **Target reader:** Intermediate; readers wanting to personalize recommendations from other pages.
- **Learning objectives:** Locate their Fitzpatrick type and understand what it does/doesn't predict; understand genetics vs. modifiable lifestyle contribution; understand why procedure/ingredient choice should be individualized rather than population-generalized.
- **Estimated reading time:** 10–12 min.
- **Prerequisite knowledge:** Science of Aging.
- **Internal links:** Hyperpigmentation (risk by Fitzpatrick type), Cosmetic Procedures (selection considerations), Skin Through the Decades.
- **Related pages:** Skincare Ingredients.
- **Illustrations required:** Fitzpatrick scale reference diagram (descriptive, not stereotyping — framed around sun sensitivity/burn-tan response, the actual clinical basis of the scale).
- **Tables required:** Fitzpatrick type → typical sun sensitivity → typical pigmentation/scar-risk considerations → procedure-selection notes table, with explicit caveat text on individual variation built into the table, not just surrounding prose.
- **Infographics required:** None additional.
- **Decision trees required:** None — board judgment: a decision tree here risks oversimplifying inherently individual factors into a flowchart; better handled as reference table with strong caveat framing.
- **Interactive tools required:** Simple self-assessment to estimate Fitzpatrick type from sun-reaction history (descriptive tool, explicitly not diagnostic).
- **Search tags:** fitzpatrick skin type, skin type and aging, genetics vs lifestyle skin aging, skin type and sun sensitivity.
- **Primary keywords:** Fitzpatrick skin type guide, genetics and skin aging.
- **Secondary keywords:** skin type and procedure selection, ancestry and skin aging.
- **Medical reviewers required (label):** Dermatologist + Epidemiologist (population-variation framing, to keep this page evidence-grounded and non-stereotyping).
- **Difficulty level:** Intermediate.

---

### 12. Products Guide

- **Purpose:** Curated (5–10 per category, per your direction) product recommendations grounded in active-ingredient evidence rather than brand popularity.
- **Target reader:** Beginner–intermediate; people ready to buy something specific.
- **Learning objectives:** Choose a product based on active ingredient evidence and their own skin type/budget; understand budget vs. premium tradeoffs (or lack thereof).
- **Estimated reading time:** Variable/scanning page, not linear (8–10 min typical session).
- **Prerequisite knowledge:** Skincare Ingredients (this page is the "now go buy something" companion to that page).
- **Internal links:** Skincare Ingredients, Device Therapy, Nutrition & Supplements, Build Your Routine.
- **Related pages:** Cost vs Benefit Calculator.
- **Illustrations required:** None.
- **Tables required:** Per-category comparison table (active ingredients, price range, evidence support, pros/cons, budget pick, premium pick, value note).
- **Infographics required:** None.
- **Decision trees required:** None.
- **Interactive tools required:** Filterable list by category/budget; this page will need live verification of prices and current formulations at build time (Phase 4), since these change — flagging that this page has the shortest "shelf life" of accuracy on the whole site and may need a "last verified" date per entry.
- **Search tags:** best sunscreen evidence, best retinol product, best vitamin C serum, budget vs premium skincare.
- **Primary keywords:** evidence-based skincare products, best sunscreen for skin aging.
- **Secondary keywords:** budget skincare alternatives, best retinol serum.
- **Medical reviewers required (label):** Cosmetic Chemist + Dermatologist.
- **Difficulty level:** Beginner–Intermediate.

---

### 13. Myths vs Facts

- **Purpose:** Direct myth-busting page addressing the specific claims listed in the brief (collagen cream, loose skin tightening, red light therapy, expensive vs. cheap skincare, sugar/alcohol/vaping aging claims, facial exercises, "medical-grade" marketing term).
- **Target reader:** Beginners specifically seeking a quick, citable answer to a specific claim.
- **Learning objectives:** Get a direct evidence-based verdict per myth with the reasoning, not just a yes/no.
- **Estimated reading time:** 10–12 min (designed for scanning to one's specific question).
- **Prerequisite knowledge:** None — this page is intentionally self-contained, with links out for depth.
- **Internal links:** Skincare Ingredients, Device Therapy, Lifestyle, Nutrition & Supplements (each myth links to its deeper home page).
- **Related pages:** All evidence-heavy pages.
- **Illustrations required:** None.
- **Tables required:** None — format is myth/fact callout boxes (per Phase 3 style guide), not tabular.
- **Infographics required:** None.
- **Decision trees required:** None.
- **Interactive tools required:** Searchable myth list (type a claim, jump to the relevant verdict).
- **Search tags:** does collagen cream work, does red light therapy work, is expensive skincare better, does sugar age your skin, do facial exercises work, medical grade skincare meaning.
- **Primary keywords:** skincare myths vs facts, anti-aging myths debunked.
- **Secondary keywords:** does sugar age skin, facial exercises evidence.
- **Medical reviewers required (label):** Medical Science Writer + Dermatologist + Cosmetic Chemist.
- **Difficulty level:** Beginner.

---

### 14. Build Your Routine

- **Purpose:** Interactive routine-builder by tier (Beginner/Budget/Intermediate/Advanced/Premium) across morning/evening/weekly/monthly/annual cadence.
- **Target reader:** Beginner–intermediate; action-oriented readers ready to assemble a plan.
- **Learning objectives:** Leave with a concrete, correctly-sequenced routine appropriate to their tier and goals.
- **Estimated reading time:** 6–8 min to build a routine; reference page thereafter.
- **Prerequisite knowledge:** Skincare Ingredients (for layering logic).
- **Internal links:** Skincare Ingredients, Products Guide, Skin Through the Decades, Device Therapy.
- **Related pages:** Cost vs Benefit Calculator.
- **Illustrations required:** None (the routine builder itself is the visual).
- **Tables required:** None — output is a generated routine card, not a static table.
- **Infographics required:** None.
- **Decision trees required:** Tier-selection logic (budget/goals/experience → recommended tier) feeding the builder.
- **Interactive tools required:** The routine builder itself — real functional component: select tier → generates AM/PM/weekly/monthly/annual routine with correct product-layering order and links back to the relevant ingredient/device entries.
- **Search tags:** beginner skincare routine, anti-aging routine, AM PM skincare order, budget skincare routine.
- **Primary keywords:** build a skincare routine, evidence-based skincare routine.
- **Secondary keywords:** skincare layering order, budget anti-aging routine.
- **Medical reviewers required (label):** Dermatologist + Cosmetic Chemist (layering/interaction safety, e.g., retinoid + AHA conflicts).
- **Difficulty level:** Beginner–Intermediate.

---

### 15. Cost vs Benefit Calculator

- **Purpose:** Quantitative comparison tool ranking interventions by expected improvement, annual cost, evidence strength, time commitment, and maintenance burden.
- **Target reader:** Intermediate–advanced; readers deciding where to actually spend money/time.
- **Learning objectives:** Compare interventions on a consistent ROI framework rather than in isolation; understand that "works" and "worth it" are different questions.
- **Estimated reading time:** 6–8 min to use; reference thereafter.
- **Prerequisite knowledge:** Helpful to have read at least one of Skincare Ingredients / Device Therapy / Cosmetic Procedures first.
- **Internal links:** Skincare Ingredients, Device Therapy, Cosmetic Procedures, Products Guide.
- **Related pages:** Build Your Routine.
- **Illustrations required:** None.
- **Tables required:** Master ROI table underlying the calculator (intervention, evidence tier, expected improvement, annual cost, time commitment, maintenance).
- **Infographics required:** None.
- **Decision trees required:** None (this page is itself a decision-support tool, structurally different from a tree).
- **Interactive tools required:** Real sortable/filterable comparison tool — sort by cost, by evidence tier, by ROI; filter by category (topical/device/procedure).
- **Search tags:** is botox worth it, is retinol worth it, skincare ROI, cheapest effective anti-aging.
- **Primary keywords:** anti-aging cost benefit, best ROI skincare.
- **Secondary keywords:** is red light therapy worth the money, cheapest effective skincare.
- **Medical reviewers required (label):** Statistician + Dermatologist (the "expected improvement" quantification needs the most rigor-checking on the whole site, since it's the most quantified claim type).
- **Difficulty level:** Beginner–Intermediate (simple to use, built on intermediate-level underlying data).

---

### 16. Glossary & Evidence Key *(board-added, flagged above)*

- **Purpose:** Persistent reference for the ★ evidence rating system and recurring technical terms.
- **Target reader:** Everyone, as a lookup, not a linear read.
- **Learning objectives:** Quickly look up what a rating or term means without leaving their current page (likely as a slide-over panel rather than full navigation, in Phase 4 build).
- **Estimated reading time:** N/A (reference, not linear).
- **Prerequisite knowledge:** None.
- **Internal links:** All pages link to this one; this page links back contextually.
- **Related pages:** All.
- **Illustrations required:** None.
- **Tables required:** Evidence rating definitions table (★ through ★★★★★, what each requires).
- **Infographics required:** None.
- **Decision trees required:** None.
- **Interactive tools required:** Searchable glossary.
- **Search tags:** N/A (reference page, low independent search intent).
- **Primary keywords:** N/A.
- **Secondary keywords:** N/A.
- **Medical reviewers required (label):** Medical Editor.
- **Difficulty level:** Beginner.

---

## 3. Cross-Reference Map (high level)

The densest hubs, by inbound/outbound link count:
- **Skincare Ingredients** ↔ Hyperpigmentation, Decades, Products Guide, Build Your Routine, Device Therapy
- **Science of Aging** ↔ nearly everything (mechanistic foundation)
- **Cost vs Benefit Calculator** ↔ Skincare Ingredients, Device Therapy, Cosmetic Procedures, Products Guide

This means Skincare Ingredients and Science of Aging should likely be written early in Phase 4, since later pages will reference their content/terminology rather than re-deriving it.

---

## 4. Open Items for Your Review

1. Decades-as-one-page-with-5-panels vs. five standalone pages (Section 0.2).
2. Added 16th page (Glossary & Evidence Key) — keep, cut, or fold into Home?
3. Whether a rate-of-weight-loss / BMI-type calculator belongs on Exercise & Body Composition, on Cost vs Benefit Calculator, or both.
4. Products Guide accuracy will visibly age faster than the rest of the site (prices/formulations change) — open to a "last verified" date convention per entry, to be formalized in Phase 3.

## 5. Architecture Addendum: Tattoo Care (added post-approval)

Added per direction during Phase 4. Tattoo care doesn't fit cleanly as its own page-scale topic (the brief's other 16 pages are each substantially larger in scope), and it isn't really an "anti-aging" topic in the same sense as the rest of the site — but it does intersect directly with mechanisms already covered: skin barrier/healing, sun protection (UV breaks down tattoo pigment the same way it damages collagen/elastin), and hyperpigmentation/scarring risk.

**Board decision: housed as a subsection within *Lifestyle*** (Page 3), alongside sun exposure — rather than as a 17th standalone page. Covers: aftercare/healing timeline, long-term fading mechanisms (UV-driven, same photoaging pathway as skin aging generally), sunscreen-over-tattoo practice, and when irritation/healing concerns warrant professional evaluation versus normal healing.

Flagging for your review: confirm subsection-of-Lifestyle is the right home, versus a standalone page if you'd rather it have more room (e.g., removal options, ingredient-specific reactions, allergy risk by ink color would expand it closer to page-scale).

Everything else is presented as the board's working architecture, ready for Phase 2 (Research Standards) once you've weighed in on the above.
