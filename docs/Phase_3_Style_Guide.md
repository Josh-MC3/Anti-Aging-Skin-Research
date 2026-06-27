# Phase 3 — Editorial Style Guide

**Status:** Draft for approval. Governs every page written in Phase 4. No page content has been written yet.

---

## 1. Tone

- **Evidence-first, not alarmist and not promotional.** The site never oversells an intervention's effect, and never frightens the reader about normal aging or about substances/habits where evidence is genuinely mild. Tone target: a knowledgeable clinician explaining things to a smart patient who has time to actually understand the reasoning, not just get a verdict.
- **Direct about uncertainty.** "We don't know yet" and "this is mixed" are acceptable, complete answers — never replaced with hedged-but-still-confident language that implies more certainty than exists.
- **No second-person pressure language.** Avoid "you need to," "you must," "don't make this mistake." Prefer "people who [goal] often find," "evidence suggests," "a common approach is."
- **Respectful of reader autonomy on cosmetic choices.** The site does not moralize about whether someone "should" want a cosmetic outcome (e.g., wanting Botox, wanting to look younger). It evaluates whether an intervention does what it claims, at what cost and risk — not whether the goal itself is worthy.
- **No fear-based urgency.** Never implies a reader is already behind, damaged, or at risk by not having started something sooner.

---

## 2. Formatting & Headings

- **Heading hierarchy:** H1 = page title (one per page). H2 = the Phase 4 required subsections (Overview, Mechanism, Evidence, etc. — fixed order, every page). H3 = sub-topics within a subsection (e.g., individual ingredients within the Skincare Ingredients page's Evidence subsection). H4 reserved for rare deep nesting; if a page needs H4 regularly, it's a sign the page should be split.
- **Paragraph length:** 3–5 sentences max in body text; longer explanations get broken into labeled sub-points or moved into a callout box.
- **No walls of unbroken evidence-tier citation strings.** A paragraph citing multiple sources reads as prose with citations attached, not a list of "(1)(2)(3)" stacked at the end of a sentence.

---

## 3. Callout Box Types

Five reusable box types, used consistently by name and visual treatment across all 16 pages:

| Box Type | Purpose | Visual cue |
|----------|---------|------------|
| **Clinical Pearl** | A practical, often non-obvious tip from the "expert board" — e.g., a usage detail that matters more than people expect. | Distinct accent border + icon, not full-bleed color (avoid screaming-yellow-warning treatment, since these are positive/practical, not cautionary). |
| **Research Summary** | A condensed callout when a subsection leans on one pivotal study or meta-analysis — gives study type, sample size, headline finding, tier. | Muted, citation-styled treatment, distinct from Clinical Pearl. |
| **Myth vs Fact** | Direct claim-then-correction format. Used inline on any page (not just the dedicated Myths page) wherever a common misconception intersects with that page's topic. | Two-part box: "Myth:" / "Fact:" visually distinguished (e.g., strikethrough-adjacent treatment on the myth half). |
| **Quick Takeaway** | 2-4 bullet summary at the top of a long subsection, for scanners. Never replaces the full text — always followed by the full explanation. | Lightweight, no heavy border, sits directly under the subsection heading. |
| **Clinical Bottom Line** | The required end-of-section synthesis (per Phase 2 §11g). One per major topic/intervention, always in the same place structurally (end of that intervention's coverage). | Strongest visual weight of all five box types — this is the thing a skimming reader should land on. |

**Rule:** these five box types are never invented ad hoc with new names. If Phase 4 drafting finds a need for a sixth pattern, it comes back for board discussion rather than silently proliferating box types.

---

## 4. Evidence Tables

- Every intervention comparison table uses the Phase 2 §11 multi-axis rating columns in a fixed column order across the entire site: **Evidence Quality (★) → Magnitude of Effect → Safety → Cost-Effectiveness → Consistency → Long-Term Data**, followed by topic-specific columns (e.g., "Best concentration" only appears on Skincare Ingredients).
- Fixed column order matters more than it might seem — a reader who learns the table on one page should be able to read any other page's table without relearning the layout.
- Tables are always sortable/filterable where the page is built as interactive (per Phase 1 specs), but must also degrade gracefully to a readable static table if JS/interactivity fails.

---

## 5. Citation Style

Per your direction in planning: **inline numbered citations with a References list per page**, real-medical-site style.

- In-text: superscript or bracketed number, e.g., "Topical retinoids increase epidermal turnover.[3]"
- Each page ends with a numbered **References** section listing: source name/title, source type (mapped to its Tier per Phase 2), and link where publicly accessible.
- Where a citation is industry-funded (per Phase 2 §5), this is noted in the reference list entry itself, e.g., "*Funded by [manufacturer].*"
- Numbering is per-page (resets each page), not global across the site — simpler to maintain as pages are added/edited independently.
- No citation is fabricated or approximated from memory. Per the build plan already agreed: Phase 4 will involve live source verification before a citation is finalized on any page. If a specific claim can't be traced to a real, checkable source at write-time, the claim is either softened to match what's actually supportable or flagged in Research Gaps instead of footnoted to an invented source.

---

## 6. Terminology Consistency

A locked glossary of preferred terms (full definitions live on Page 16, Glossary & Evidence Key — this section just locks *which term wins* when synonyms exist):

| Use | Not |
|-----|-----|
| "retinoid" (umbrella term) / specify "retinol," "tretinoin," "retinal" when precision matters | "Vitamin A cream" (vague) |
| "topical" | "skincare product" when specifically discussing application route |
| "RCT" on first use per page, spelled out once, then abbreviation | Switching between "randomized trial," "clinical trial," "RCT" within one page |
| "evidence quality" for the ★ axis specifically | "overall rating" (implies a blended score we explicitly decided not to produce) |
| "Fitzpatrick type" | "skin color type" |
| "professional" (for in-clinic procedures) | "medical-grade" (flagged on Myths page as a non-regulated marketing term; site doesn't use it approvingly elsewhere) |
| "limited evidence" | "no evidence" when Tier 7-9 evidence does exist, just weak — these are not the same claim |

---

## 7. Consistency Rules

- Any numeric claim (percentage improvement, cost figure, timeline) that appears on more than one page must match exactly, or the discrepancy must be explained (e.g., different studies, different population). This is explicitly checked in Phase 6's site-wide audit, but Phase 4 drafting should self-check against already-written pages before introducing a new figure for the same claim.
- Evidence ratings for the same intervention must match across every page it appears on (e.g., retinoids' rating on Skincare Ingredients must match its rating wherever referenced on Decades, Build Your Routine, Hyperpigmentation).
- A running internal terminology/figures tracker will be maintained during Phase 4 specifically to catch this — practically, this means before finalizing each page I'll check prior pages for the same intervention's existing rating/figures rather than re-deriving independently.

---

## 8. Writing Rules

- Active voice by default.
- No invented statistics, ever — a claim with no real supportable number is described qualitatively (per Phase 2 §11) rather than given a fabricated-sounding precise figure.
- Avoid absolute language ("always," "never," "proven") except where the evidence genuinely is that strong (Tier 1 guideline-level) — and even then, prefer "strong evidence supports" over "proven," since "proven" overstates how science works.
- Second person ("you") is fine for practical instructions (Build Your Routine) but avoided for risk/fear framing (see Tone, §1).
- One claim per sentence where possible — avoid stacking multiple evidence-tier claims into one compound sentence, which makes later fact-checking and Phase 6 auditing harder.

---

## 9. Reading Level

- Target: **Flesch-Kincaid Grade 9–10** for primary body text (Overview, Practical Recommendations, FAQ) — accessible to a general adult reader without a science background.
- **Mechanism and Evidence subsections** may run higher (Grade 11–13) since they necessarily use technical vocabulary, but every technical term used must be either defined inline on first use per page or linked to the Glossary (Page 16) — not both required, but at least one.
- Advanced-reader expandable sections (per Phase 1, e.g., Science of Aging's mitochondrial/telomere toggles) are exempt from the Grade 9–10 ceiling, since a reader has explicitly opted into depth by expanding them.

---

## 10. Medical Disclaimer Style

- **Site-wide footer disclaimer** (every page): general statement that content is educational, not a substitute for individualized medical advice, and reflects evidence available as of the page's last-reviewed date.
- **Elevated inline disclaimer** (Cosmetic Procedures, and any page discussing prescription-strength interventions like tretinoin or hydroquinone): a more prominent, page-top disclaimer specifically noting that procedure/prescription decisions require in-person consultation with a licensed provider.
- **Pigmentation "see a professional" flag** (Hyperpigmentation page specifically): per Phase 1's spec, a distinct visual flag (not just disclaimer text) for situations warranting evaluation (asymmetric, rapidly changing, bleeding) — this is a clinical-safety callout, styled differently from the standard legal-style disclaimer, since its job is to prompt action, not just limit liability.
- Disclaimers are never used as a substitute for accuracy — i.e., a disclaimer doesn't license a sloppier claim elsewhere on the same page.

---

## 11. Accessibility Standards

- All illustrations/diagrams/infographics require descriptive alt text conveying the actual information (not just "diagram of skin"), since these are often conveying real content (e.g., "Diagram showing UVA penetrating to the dermis while UVB is largely absorbed at the epidermis").
- Color is never the sole carrier of meaning (relevant for ★ ratings, evidence-tier color coding, and "verdict strip" treatments per Phase 1's Device Therapy spec) — every color-coded element also carries a text/icon label.
- Interactive components (decision trees, calculators, filters) must be operable via keyboard, not mouse/touch only.
- Reduced-motion preference is respected for any animated transitions (per frontend-design skill guidance already noted for the build phase).
- Minimum contrast ratios follow WCAG AA as a floor across all text and UI elements.

---

## 12. Image Style

- Illustrations are clean medical/scientific diagram style — line-art or soft-shaded anatomical/process diagrams, not stock-photo aesthetic, consistent with the site reading as a textbook rather than a lifestyle blog.
- A single consistent illustration style (line weight, color palette, labeling convention) is used across every diagram on the site, established at first diagram production in Phase 4 and reused, not reinvented per page.
- No before/after photography will be sourced or fabricated for this build (flagged previously) — where the brief calls for it, the page instead uses descriptive illustration (e.g., a labeled diagram of "typical timeline of visible change") rather than implying real clinical photography exists.

---

## 13. Color Coding

- **Evidence tier** (when shown visually, e.g., on Device Therapy's "verdict strip") uses a consistent, accessible scale — not literal red/yellow/green traffic-light coding (which over-implies a safety judgment rather than an evidence-quality judgment). Exact palette to be finalized during the build's design pass (frontend-design skill), but the *rule* — evidence-quality color scale is distinct from any safety-risk color scale — is locked here so the two are never visually conflated.
- **Safety rating** (Phase 2 §11c) gets its own, separate color treatment when shown visually, specifically so a reader can't mistake "weak evidence" for "unsafe" or vice versa — these are different axes and must look different.

---

## 14. Expandable Sections

- Used for: advanced/mechanistic depth (Science of Aging), decade panels (Skin Through the Decades), and long ingredient/intervention lists where scanning matters more than linear reading (Skincare Ingredients, Device Therapy, Nutrition & Supplements).
- Expandable sections always show a one-line summary when collapsed — never collapse to a bare heading with no preview of what's inside.
- Default collapse state is per-page based on its primary reader (Phase 1's "target reader" field): beginner-primary pages default to collapsed-advanced; advanced-primary pages (Cosmetic Procedures) default more open.

---

## 15. Interactive Components

- All interactive tools specified in Phase 1 (decision trees, calculators, filters, routine builder) follow one shared interaction pattern across the site: question/input → immediate visible result → option to adjust inputs and see the result update, rather than a multi-page wizard with a final "submit."
- Every interactive tool's output explicitly states what it's based on (e.g., the routine builder shows which evidence-tier ingredients it selected and why), so the tool itself is a teaching surface, not a black box.
- No interactive tool collects or stores personal health information; self-assessment tools (Fitzpatrick estimator, lifestyle sliders) are explicitly framed as educational, not diagnostic, directly in the tool's UI copy — not just in surrounding text.

---

## 16. FAQ Formatting

- Every page's FAQ (required per Phase 4) draws from genuinely common reader questions about that topic, phrased the way a person would actually ask it ("Does retinol thin your skin?"), not restated in clinical phrasing.
- FAQ answers are short (2-4 sentences) with a link back into the relevant subsection for full depth — FAQ is a fast-answer layer, not a duplicate of the page body.
- No FAQ answer introduces a claim that isn't already supported elsewhere on the page (FAQs answer using the page's existing evidence base, they don't sneak in new uncited claims).

---

## 17. Open Items for Your Review

1. **Color coding plan (§13)** is locked as a *rule* (evidence-tier color ≠ safety color, never traffic-light-style for evidence) but the literal palette is deferred to the build/design pass. Confirm that's fine to finalize visually during Phase 4 rather than here.
2. **No before/after photography** (§12) — confirming this stays a hard rule rather than sourcing stock/licensed before-after imagery later.
3. **Reading level target (§9)** — Grade 9-10 for body text is a fairly standard health-literacy target; flagging in case you want it even simpler (Grade 7-8, more aggressive plain-language) given the site's "useful for beginners and advanced readers" dual mandate.

This completes Phases 1–3. Per your earlier instruction, this is the pause point — nothing in Phase 4 (actual page writing) begins until you've signed off on Phases 1, 2, and 3 together.
