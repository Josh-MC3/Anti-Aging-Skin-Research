# Contributing / Extending This Site

This project followed a staged process (architecture → evidence standards → style guide → page drafting), documented in full in [`/docs`](./docs). If you're extending or editing content later, a few conventions are worth preserving:

## Content conventions

- **Never blend evidence quality with effect size, safety, or cost.** Every rating on this site is reported as a separate axis — see `/docs/Phase_2_Research_Standards.md` §11 and the live Glossary & Evidence Key page for the full rationale.
- **Cite real, checkable sources only.** Every clinical claim should trace to an actual study, review, or guideline — not be generated from memory. Use the 9-tier source hierarchy (clinical guidelines → meta-analyses → RCTs → cohort → case-control → cross-sectional → mechanistic/animal → expert opinion → marketing/anecdote) to grade what you find.
- **Disclose funding conflicts.** If a cited study is funded by a company with a commercial interest in the result, say so directly in the reference list entry, per `/docs/Phase_2_Research_Standards.md` §5.
- **Don't round up thin evidence to match a category's popularity.** Several pages on this site rate well-marketed products/devices/procedures lower than expected because the independent literature doesn't support the popular claim. Preserve that honesty rather than smoothing it over.
- **Keep the five callout box types consistent**: Clinical Pearl, Research Summary, Myth vs Fact, Quick Takeaway, Clinical Bottom Line. Don't invent a sixth pattern without good reason — see `/docs/Phase_3_Style_Guide.md` §3.

## Code conventions

- All page components live in `src/App.jsx` as named functions (e.g., `function SkincareIngredientsPage()`), routed via a simple string-match router near the bottom of the file (`page === 'ingredients' ? <SkincareIngredientsPage /> : ...`).
- Shared components (`EvidenceFingerprint`, `MythFact`, `ClinicalPearl`, `QuickTakeaway`, `ClinicalBottomLine`, `SectionHeading`, `MedicalSignal`, `Citation`) are defined once near the top of `src/App.jsx` and reused across every page — don't duplicate these inline on a new page.
- Design tokens (`colors`, `fontDisplay`, `fontBody`, `fontMono`) are defined as constants at the top of the file. Adjust them there, not per-component, to keep the site visually consistent.
- To add a new page:
  1. Add an entry to the `pages` array (id, title, group).
  2. Write a new `function YourPageName() { ... }` component following the existing pages' structure (Overview → Mechanism/Evidence → Practical Recommendations → Who Benefits/Avoid → Misconceptions → Research Gaps → Clinical Bottom Line → FAQ → References).
  3. Add a route line: `page === 'your-id' ? <YourPageName /> :` in the router.

## Citation numbering

Citations are numbered per-page (not globally) using the `<Citation n={N} />` component, and reset to 1 on each page. Every number used inline must have a matching entry in that page's References list, and vice versa — there's no automated check for this, so verify manually (or grep for `Citation n={` within a page's function block) after edits.
