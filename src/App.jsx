import React, { useState, useMemo } from 'react';

// ============================================================
// DESIGN TOKENS
// ============================================================
const colors = {
  bg: '#FAFAF8',
  bgAlt: '#F1EFE9',
  ink: '#1C2230',
  inkSoft: '#535B6B',
  line: '#DDD8CC',
  accent: '#3D6B6B',      // clinical teal-slate — UI/nav/links
  accentSoft: '#E4ECEA',
  tier: '#D97B4F',         // coral-amber — evidence tier callouts ONLY
  tierSoft: '#F7E8DE',
  star: '#B8924A',         // muted gold — evidence-quality rating glyph ONLY
  safetyGood: '#4C7A5E',
  safetyCaution: '#A8762F',
  safetySig: '#A14B3D',
  white: '#FFFFFF',
};

const fontDisplay = "'Source Serif 4', 'Iowan Old Style', Georgia, serif";
const fontBody = "'Inter', -apple-system, sans-serif";
const fontMono = "'IBM Plex Mono', 'Courier New', monospace";

// ============================================================
// EVIDENCE FINGERPRINT — signature component
// Four aligned bars: Evidence Quality / Magnitude / Safety / Consistency
// Deliberately NOT a single blended star score (Phase 2 §11/§13)
// ============================================================
function EvidenceFingerprint({ evidence, magnitude, safety, consistency, compact }) {
  const evidenceLevels = { 5: 'Strong', 4: 'Moderate', 3: 'Emerging', 2: 'Weak', 1: 'Minimal' };
  const magLevels = { large: 3, moderate: 2, small: 1, unclear: 0.5 };
  const safetyColor = { good: colors.safetyGood, caution: colors.safetyCaution, significant: colors.safetySig };
  const consistLevels = { high: 3, mostly: 2, inconsistent: 1 };

  const Bar = ({ value, max, color, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: compact ? 36 : 64, fontSize: compact ? 9 : 10, fontFamily: fontMono, color: colors.inkSoft, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: max }).map((_, i) => (
          <div key={i} style={{
            width: compact ? 8 : 12, height: compact ? 8 : 12,
            background: i < value ? color : colors.line,
            borderRadius: 2,
          }} />
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 3 : 5, padding: compact ? '6px 0' : '10px 0' }}>
      <Bar value={evidence} max={5} color={colors.star} label="Evid" />
      <Bar value={Math.ceil(magLevels[magnitude] || 1)} max={3} color={colors.accent} label="Effect" />
      <Bar value={3} max={3} color={safetyColor[safety] || colors.safetyGood} label="Safety" />
      <Bar value={consistLevels[consistency] || 2} max={3} color={colors.tier} label="Consist" />
    </div>
  );
}

// ============================================================
// SHARED UI PIECES
// ============================================================
function Citation({ n, onClick }) {
  return (
    <sup
      onClick={onClick}
      style={{
        color: colors.accent, cursor: 'pointer', fontFamily: fontMono,
        fontSize: '0.7em', fontWeight: 600, marginLeft: 1,
      }}
    >[{n}]</sup>
  );
}

function QuickTakeaway({ children }) {
  return (
    <div style={{
      background: colors.bgAlt, borderLeft: `3px solid ${colors.accent}`,
      padding: '14px 18px', margin: '20px 0', borderRadius: '0 6px 6px 0',
    }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: '0.06em', color: colors.accent, marginBottom: 8, textTransform: 'uppercase' }}>Quick Takeaway</div>
      <div style={{ fontSize: 15, lineHeight: 1.6, color: colors.ink }}>{children}</div>
    </div>
  );
}

function ClinicalPearl({ children }) {
  return (
    <div style={{
      background: colors.white, border: `1px solid ${colors.line}`, borderLeft: `3px solid ${colors.star}`,
      padding: '14px 18px', margin: '18px 0', borderRadius: '0 6px 6px 0',
    }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: '0.06em', color: colors.star, marginBottom: 6, textTransform: 'uppercase' }}>✦ Clinical Pearl</div>
      <div style={{ fontSize: 14.5, lineHeight: 1.6, color: colors.ink }}>{children}</div>
    </div>
  );
}

function MythFact({ myth, fact }) {
  return (
    <div style={{ margin: '18px 0', border: `1px solid ${colors.line}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: '12px 18px', background: colors.tierSoft, borderBottom: `1px solid ${colors.line}` }}>
        <span style={{ fontFamily: fontMono, fontSize: 10, color: colors.tier, fontWeight: 700, letterSpacing: '0.05em' }}>MYTH</span>
        <div style={{ fontSize: 14.5, color: colors.ink, marginTop: 4, textDecoration: 'none', opacity: 0.75 }}>{myth}</div>
      </div>
      <div style={{ padding: '12px 18px', background: colors.white }}>
        <span style={{ fontFamily: fontMono, fontSize: 10, color: colors.accent, fontWeight: 700, letterSpacing: '0.05em' }}>FACT</span>
        <div style={{ fontSize: 14.5, color: colors.ink, marginTop: 4, lineHeight: 1.55 }}>{fact}</div>
      </div>
    </div>
  );
}

function ClinicalBottomLine({ children }) {
  return (
    <div style={{
      background: colors.ink, color: colors.bg, padding: '22px 26px', margin: '28px 0',
      borderRadius: 10,
    }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: '0.08em', color: '#A8B5C4', marginBottom: 10, textTransform: 'uppercase' }}>Clinical Bottom Line</div>
      <div style={{ fontSize: 15.5, lineHeight: 1.65, fontFamily: fontDisplay }}>{children}</div>
    </div>
  );
}

// ============================================================
// MEDICAL SIGNAL — distinct from standard disclaimer (Phase 3 §10)
// Used for findings that warrant physician evaluation, not just
// dermatologist/cosmetic follow-up. Visually distinct: this prompts
// action, it doesn't just limit liability.
// ============================================================
function MedicalSignal({ title, children }) {
  return (
    <div style={{
      background: '#FBF0ED', border: `1.5px solid ${colors.safetySig}`, borderRadius: 10,
      padding: '18px 22px', margin: '22px 0', display: 'flex', gap: 14,
    }}>
      <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>⚕</div>
      <div>
        <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.safetySig, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 6, textTransform: 'uppercase' }}>{title}</div>
        <div style={{ fontSize: 14.5, lineHeight: 1.6, color: colors.ink }}>{children}</div>
      </div>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontFamily: fontDisplay, fontSize: 24, fontWeight: 600, color: colors.ink,
      marginTop: 44, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${colors.line}`,
    }}>{children}</h2>
  );
}

function IngredientCard({ name, rating, evidence, magnitude, safety, consistency, children, onCite }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${colors.line}`, borderRadius: 10, marginBottom: 14, overflow: 'hidden', background: colors.white }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <div>
          <div style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 600, color: colors.ink }}>{name}</div>
          <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginTop: 2 }}>{rating}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <EvidenceFingerprint evidence={evidence} magnitude={magnitude} safety={safety} consistency={consistency} compact />
          <span style={{ fontSize: 20, color: colors.inkSoft, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>⌄</span>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 20px 20px 20px', fontSize: 14.5, lineHeight: 1.65, color: colors.ink, borderTop: `1px solid ${colors.line}` }}>
          <div style={{ paddingTop: 16 }}>{children}</div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// DECISION TREE — "Which ingredient should I start with?"
// ============================================================
function IngredientDecisionTree() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      key: 'concern',
      q: 'What\'s your main concern?',
      options: [
        { label: 'Fine lines & texture', value: 'aging' },
        { label: 'Dark spots / uneven tone', value: 'pigment' },
        { label: 'Dryness & barrier', value: 'barrier' },
        { label: 'Just starting out, not sure', value: 'general' },
      ],
    },
    {
      key: 'sensitivity',
      q: 'How does your skin usually react to new products?',
      options: [
        { label: 'Sensitive — irritates easily', value: 'sensitive' },
        { label: 'Tolerant — rarely reacts', value: 'tolerant' },
      ],
    },
  ];

  const result = useMemo(() => {
    if (!answers.concern || !answers.sensitivity) return null;
    const { concern, sensitivity } = answers;
    if (concern === 'aging') {
      return sensitivity === 'sensitive'
        ? { name: 'Bakuchiol', why: 'Comparable photoaging benefits to retinol in a head-to-head trial, with significantly fewer adverse effects — a reasonable lower-irritation entry point.' }
        : { name: 'Retinoid (start with retinol)', why: 'The strongest, most consistent evidence on this page for fine lines and texture. Start low concentration, 2–3x/week, build tolerance.' };
    }
    if (concern === 'pigment') {
      return sensitivity === 'sensitive'
        ? { name: 'Niacinamide', why: 'Well-tolerated even at lower concentrations (2–3%), with solid evidence for hyperpigmentation and barrier support simultaneously.' }
        : { name: 'Tranexamic Acid or Alpha Arbutin', why: 'Strong melasma/pigmentation evidence, performs comparably to hydroquinone in head-to-head trials without hydroquinone\'s long-term safety concerns.' };
    }
    if (concern === 'barrier') {
      return { name: 'Hyaluronic Acid + Ceramides', why: 'The best-evidenced combination specifically for hydration and barrier support — neither is a strong cell-turnover agent, so irritation risk is low.' };
    }
    return { name: 'Vitamin C (AM) + Sunscreen', why: 'The gentlest, broadly evidence-supported starting point. Add a retinoid later once this is a stable daily habit.' };
  }, [answers]);

  if (result) {
    return (
      <div style={{ background: colors.accentSoft, borderRadius: 10, padding: 24, margin: '20px 0' }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Suggested starting point</div>
        <div style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 600, color: colors.ink, marginBottom: 8 }}>{result.name}</div>
        <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6, marginBottom: 16 }}>{result.why}</div>
        <div style={{ fontSize: 12, color: colors.inkSoft, fontStyle: 'italic', marginBottom: 16 }}>
          This is an educational starting suggestion based on the evidence reviewed on this page — not a personalized medical recommendation. Patch-test any new active.
        </div>
        <button
          onClick={() => { setAnswers({}); setStep(0); }}
          style={{ background: 'none', border: `1px solid ${colors.accent}`, color: colors.accent, padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontFamily: fontBody, fontSize: 13 }}
        >Start over</button>
      </div>
    );
  }

  const current = questions[step];
  return (
    <div style={{ background: colors.accentSoft, borderRadius: 10, padding: 24, margin: '20px 0' }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
        Which ingredient should I start with? · Step {step + 1} of {questions.length}
      </div>
      <div style={{ fontFamily: fontDisplay, fontSize: 19, fontWeight: 600, color: colors.ink, marginBottom: 16 }}>{current.q}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {current.options.map(opt => (
          <button
            key={opt.value}
            onClick={() => {
              setAnswers(prev => ({ ...prev, [current.key]: opt.value }));
              setStep(s => s + 1);
            }}
            style={{
              textAlign: 'left', padding: '12px 16px', background: colors.white,
              border: `1px solid ${colors.line}`, borderRadius: 8, cursor: 'pointer',
              fontFamily: fontBody, fontSize: 14.5, color: colors.ink,
            }}
          >{opt.label}</button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MASTER INGREDIENT TABLE
// ============================================================
const ingredientData = [
  { name: 'Retinoids (Tretinoin)', evidence: 5, magnitude: 'large', safety: 'caution', consistency: 'high', conc: '0.025–0.1% (Rx)', skinType: 'Most types; avoid if pregnant', timing: 'PM only', mistake: 'Overuse early → irritation', timeline: '8–12 wks' },
  { name: 'Retinol (OTC)', evidence: 4, magnitude: 'moderate', safety: 'caution', consistency: 'mostly', conc: '0.25–1%', skinType: 'Most types', timing: 'PM only', mistake: 'Combining with AHA/BHA same night', timeline: '8–12 wks' },
  { name: 'Vitamin C', evidence: 4, magnitude: 'moderate', safety: 'good', consistency: 'mostly', conc: '10–20% L-ascorbic acid', skinType: 'Most types', timing: 'AM', mistake: 'Using oxidized (browned) serum', timeline: '8–12 wks' },
  { name: 'Niacinamide', evidence: 4, magnitude: 'moderate', safety: 'good', consistency: 'high', conc: '2–5%', skinType: 'All types incl. sensitive', timing: 'AM or PM', mistake: 'Assuming higher % = better', timeline: '8–12 wks' },
  { name: 'Azelaic Acid', evidence: 4, magnitude: 'moderate', safety: 'good', consistency: 'mostly', conc: '10–20%', skinType: 'Acne-prone, rosacea, melasma', timing: 'AM or PM', mistake: 'Expecting anti-aging-specific results (thin evidence there)', timeline: '8–12 wks' },
  { name: 'AHAs (Glycolic/Lactic)', evidence: 4, magnitude: 'moderate', safety: 'caution', consistency: 'mostly', conc: '5–12%', skinType: 'Most types; not w/ retinoid same night', timing: 'PM', mistake: 'Stacking with retinoid', timeline: '8–24 wks' },
  { name: 'Hyaluronic Acid', evidence: 4, magnitude: 'moderate', safety: 'good', consistency: 'mostly', conc: 'Varies by MW', skinType: 'All types', timing: 'AM & PM', mistake: 'Applying to dry skin (needs damp skin to humectant properly)', timeline: 'Immediate–6 wks' },
  { name: 'Tranexamic Acid', evidence: 4, magnitude: 'moderate', safety: 'good', consistency: 'mostly', conc: '2–5%', skinType: 'Melasma/pigmentation-prone', timing: 'AM or PM', mistake: 'Expecting general anti-aging effect (it\'s pigment-specific)', timeline: '8–12 wks' },
  { name: 'Hydroquinone', evidence: 5, magnitude: 'large', safety: 'significant', consistency: 'high', conc: '2–4% (supervised)', skinType: 'Pigmentation, short-term use only', timing: 'PM', mistake: 'Indefinite unsupervised daily use', timeline: '6–12 wks' },
  { name: 'Bakuchiol', evidence: 3, magnitude: 'moderate', safety: 'good', consistency: 'mostly', conc: '0.5–1%', skinType: 'Sensitive skin, retinoid-intolerant', timing: 'AM or PM', mistake: 'Assuming identical mechanism to retinol', timeline: '8–12 wks' },
  { name: 'Alpha Arbutin', evidence: 3, magnitude: 'moderate', safety: 'good', consistency: 'mostly', conc: '1–2%', skinType: 'Pigmentation-prone', timing: 'AM or PM', mistake: 'Confusing with regular arbutin (less effective)', timeline: '8–12 wks' },
  { name: 'Ceramides', evidence: 3, magnitude: 'moderate', safety: 'good', consistency: 'mostly', conc: 'Varies', skinType: 'Dry, barrier-compromised', timing: 'AM & PM', mistake: 'Expecting depigmenting effect (thin evidence)', timeline: '4–8 wks' },
  { name: 'Peptides (Topical)', evidence: 3, magnitude: 'small', safety: 'good', consistency: 'inconsistent', conc: 'Varies widely', skinType: 'Most types', timing: 'AM or PM', mistake: 'Assuming all peptides are equal', timeline: '8–12 wks' },
  { name: 'Caffeine', evidence: 2, magnitude: 'small', safety: 'good', consistency: 'inconsistent', conc: '0.2–3%', skinType: 'Most types (periorbital use)', timing: 'AM', mistake: 'Expecting dramatic dark-circle results', timeline: '4–12 wks' },
  { name: 'Growth Factors', evidence: 2, magnitude: 'small', safety: 'good', consistency: 'inconsistent', conc: 'Proprietary, varies', skinType: 'Most types', timing: 'AM or PM', mistake: 'Treating as proven equivalent to retinoid', timeline: 'Unclear' },
  { name: 'Exosomes', evidence: 2, magnitude: 'unclear', safety: 'good', consistency: 'inconsistent', conc: 'Proprietary, varies', skinType: 'Most types', timing: 'AM or PM', mistake: 'Treating preclinical promise as clinical proof', timeline: 'Unclear' },
  { name: 'Copper Peptides', evidence: 2, magnitude: 'small', safety: 'good', consistency: 'inconsistent', conc: 'Proprietary, varies', skinType: 'Most types', timing: 'AM or PM', mistake: 'Relying on manufacturer-sourced claims alone', timeline: 'Unclear' },
  { name: 'CoQ10', evidence: 2, magnitude: 'small', safety: 'good', consistency: 'inconsistent', conc: 'Varies (delivery-dependent)', skinType: 'Most types', timing: 'AM or PM', mistake: 'Assuming standard formulation penetrates well', timeline: 'Unclear' },
];

function IngredientTable() {
  const [sortBy, setSortBy] = useState('evidence');
  const [filter, setFilter] = useState('all');

  const evidenceLabel = { 5: '★★★★★', 4: '★★★★', 3: '★★★', 2: '★★', 1: '★' };

  const filtered = useMemo(() => {
    let rows = [...ingredientData];
    if (filter === 'strong') rows = rows.filter(r => r.evidence >= 4);
    if (filter === 'emerging') rows = rows.filter(r => r.evidence === 3);
    if (filter === 'weak') rows = rows.filter(r => r.evidence <= 2);
    rows.sort((a, b) => sortBy === 'evidence' ? b.evidence - a.evidence : a.name.localeCompare(b.name));
    return rows;
  }, [sortBy, filter]);

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {[['all', 'All'], ['strong', 'Strong/Moderate'], ['emerging', 'Emerging'], ['weak', 'Weak']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer',
              border: `1px solid ${filter === val ? colors.accent : colors.line}`,
              background: filter === val ? colors.accent : colors.white,
              color: filter === val ? colors.white : colors.inkSoft,
              fontFamily: fontBody,
            }}
          >{label}</button>
        ))}
        <button
          onClick={() => setSortBy(sortBy === 'evidence' ? 'name' : 'evidence')}
          style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer', border: `1px solid ${colors.line}`, background: colors.white, color: colors.inkSoft, fontFamily: fontBody }}
        >Sort: {sortBy === 'evidence' ? 'Evidence ↓' : 'A–Z'}</button>
      </div>
      <div style={{ overflowX: 'auto', border: `1px solid ${colors.line}`, borderRadius: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: colors.bgAlt, textAlign: 'left' }}>
              {['Ingredient', 'Evidence', 'Concentration', 'Best Skin Type', 'AM/PM', 'Common Mistake', 'Timeline'].map(h => (
                <th key={h} style={{ padding: '10px 14px', fontFamily: fontMono, fontSize: 10.5, color: colors.inkSoft, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: `1px solid ${colors.line}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={row.name} style={{ background: i % 2 === 0 ? colors.white : colors.bg }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: colors.ink, fontFamily: fontDisplay }}>{row.name}</td>
                <td style={{ padding: '10px 14px', color: colors.star, fontFamily: fontMono, fontWeight: 600 }}>{evidenceLabel[row.evidence]}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft }}>{row.conc}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft }}>{row.skinType}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft }}>{row.timing}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft }}>{row.mistake}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft }}>{row.timeline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// NAVIGATION SHELL
// ============================================================
const pages = [
  { id: 'home', title: 'Home', group: 'Start' },
  { id: 'science', title: 'The Science of Aging', group: 'Foundations' },
  { id: 'lifestyle', title: 'Lifestyle', group: 'Foundations' },
  { id: 'exercise', title: 'Exercise & Body Composition', group: 'Foundations' },
  { id: 'nutrition', title: 'Nutrition & Supplements', group: 'Foundations' },
  { id: 'ingredients', title: 'Skincare Ingredients', group: 'Treatments' },
  { id: 'devices', title: 'Device Therapy', group: 'Treatments' },
  { id: 'procedures', title: 'Cosmetic Procedures', group: 'Treatments' },
  { id: 'pigmentation', title: 'Hyperpigmentation', group: 'Treatments' },
  { id: 'decades', title: 'Skin Through the Decades', group: 'Personalize' },
  { id: 'genetics', title: 'Age, Genetics & Skin Type', group: 'Personalize' },
  { id: 'products', title: 'Products Guide', group: 'Act' },
  { id: 'myths', title: 'Myths vs Facts', group: 'Act' },
  { id: 'routine', title: 'Build Your Routine', group: 'Act' },
  { id: 'calculator', title: 'Cost vs Benefit Calculator', group: 'Act' },
  { id: 'glossary', title: 'Glossary & Evidence Key', group: 'Reference' },
];

function ComingSoon({ title }) {
  return (
    <div style={{ padding: '80px 40px', textAlign: 'center' }}>
      <div style={{ fontFamily: fontMono, fontSize: 12, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Phase 4 — Not Yet Built</div>
      <div style={{ fontFamily: fontDisplay, fontSize: 28, color: colors.ink, marginBottom: 12 }}>{title}</div>
      <div style={{ color: colors.inkSoft, fontSize: 15, maxWidth: 440, margin: '0 auto' }}>
        This page is architected (Phase 1) but its content hasn't been researched and written yet. Skincare Ingredients is live as the template — ask to build this page next.
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const grouped = pages.reduce((acc, p) => {
    (acc[p.group] = acc[p.group] || []).push(p);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg, fontFamily: fontBody }}>
      {/* SIDEBAR */}
      <div style={{ width: 260, borderRight: `1px solid ${colors.line}`, padding: '28px 0', flexShrink: 0, background: colors.white }}>
        <div style={{ padding: '0 24px 24px 24px', borderBottom: `1px solid ${colors.line}`, marginBottom: 16 }}>
          <div style={{ fontFamily: fontDisplay, fontSize: 17, fontWeight: 700, color: colors.ink, lineHeight: 1.3 }}>Evidence-Based<br/>Skin & Aging</div>
          <div style={{ fontFamily: fontMono, fontSize: 10.5, color: colors.inkSoft, marginTop: 6, letterSpacing: '0.03em' }}>A REFERENCE, NOT MARKETING</div>
        </div>
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} style={{ marginBottom: 18 }}>
            <div style={{ padding: '0 24px', fontFamily: fontMono, fontSize: 10, color: colors.inkSoft, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{group}</div>
            {items.map(p => (
              <button
                key={p.id}
                onClick={() => setPage(p.id)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '8px 24px',
                  background: page === p.id ? colors.accentSoft : 'none',
                  borderLeft: page === p.id ? `3px solid ${colors.accent}` : '3px solid transparent',
                  border: 'none', borderLeftWidth: 3,
                  color: page === p.id ? colors.accent : colors.ink,
                  fontWeight: page === p.id ? 600 : 400,
                  fontSize: 13.5, cursor: 'pointer', fontFamily: fontBody,
                }}
              >{p.title}</button>
            ))}
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, maxWidth: 880, margin: '0 auto', padding: '48px 40px 100px 40px' }}>
        {page === 'home' ? <HomePage setPage={setPage} /> :
         page === 'ingredients' ? <SkincareIngredientsPage /> :
         page === 'lifestyle' ? <LifestylePage /> :
         page === 'nutrition' ? <NutritionPage /> :
         page === 'pigmentation' ? <PigmentationPage /> :
         page === 'genetics' ? <GeneticsPage /> :
         page === 'exercise' ? <ExercisePage /> :
         page === 'science' ? <ScienceOfAgingPage /> :
         page === 'devices' ? <DeviceTherapyPage /> :
         page === 'procedures' ? <CosmeticProceduresPage /> :
         page === 'decades' ? <DecadesPage /> :
         page === 'products' ? <ProductsGuidePage /> :
         page === 'calculator' ? <CalculatorPage /> :
         page === 'myths' ? <MythsPage /> :
         page === 'routine' ? <RoutinePage /> :
         page === 'glossary' ? <GlossaryPage setPage={setPage} /> :
         <ComingSoon title={pages.find(p => p.id === page)?.title} />}
      </div>
    </div>
  );
}

// ============================================================
// SKINCARE INGREDIENTS — FULL PAGE
// ============================================================
function SkincareIngredientsPage() {
  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 6 OF 16 · TREATMENTS</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>Skincare Ingredients</h1>
      <div style={{ fontSize: 15.5, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640 }}>
        What the actual human clinical evidence says about the major topical actives — what works well, what's promising but unproven, and what's mostly marketing ahead of the science.
      </div>

      <SectionHeading>Overview</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        This page reviews the major topical ingredients used in anti-aging and skin-health skincare: what each one is supposed to do, how strong the actual human evidence is, and how to use it correctly. Ingredients are grouped by what they primarily target — cell turnover, antioxidant/pigment defense, hydration/barrier, and the newer "regenerative" category (growth factors, exosomes, peptides) where marketing has generally outpaced research.
      </p>

      <QuickTakeaway>
        The two ingredients with the strongest, most consistent human evidence for visible anti-aging effects are <strong>topical retinoids</strong> and <strong>topical vitamin C</strong>. Niacinamide, azelaic acid, and hyaluronic acid all have solid trial support for narrower, specific benefits. Exosomes, many growth factor serums, and most copper peptide products are supported mainly by mechanistic or preclinical data — not robust human trials.
      </QuickTakeaway>

      <SectionHeading>Which ingredient should I start with?</SectionHeading>
      <IngredientDecisionTree />

      <SectionHeading>Evidence by Ingredient</SectionHeading>
      <p style={{ fontSize: 14.5, color: colors.inkSoft, marginBottom: 16 }}>Tap any ingredient to expand the full evidence summary. The fingerprint glyph shows four separate ratings — evidence quality, effect size, safety, and consistency — deliberately kept apart rather than blended into one score.</p>

      <IngredientCard name="Retinoids (Retinol, Retinal, Tretinoin)" rating="★★★★★ Strong Evidence" evidence={5} magnitude="large" safety="caution" consistency="high">
        <p>Topical retinoids are the most extensively studied anti-aging topical category. A 2024 systematic review and meta-analysis pooled eight randomized controlled trials (1,361 patients) comparing tretinoin against vehicle for photodamaged skin, with follow-up ranging from 16 weeks to 2 years. Tretinoin significantly improved clinical signs of facial photodamage, with benefits appearing within the first months and sustained over longer use.<Citation n={1} /></p>
        <p>Over-the-counter retinol and retinal are weaker forms of the same vitamin-A family — less direct trial volume than prescription tretinoin, but generally better tolerated, which matters for real-world adherence.</p>
        <ClinicalPearl>Retinoids cause an initial "retinization" period (dryness, flaking, mild irritation) in many users during the first 2–6 weeks. This is expected and usually fades with continued, consistent use — not a sign the product is wrong for you.</ClinicalPearl>
      </IngredientCard>

      <IngredientCard name="Vitamin C (L-ascorbic acid)" rating="★★★★ Moderate Evidence" evidence={4} magnitude="moderate" safety="good" consistency="mostly">
        <p>A 2023 systematic review of RCTs on topical vitamin C for melasma and photoaging concluded it is effective for uneven, wrinkled skin and has depigmenting properties, though long-term use may be needed for noticeable change.<Citation n={2} /> A separate Bayesian meta-analysis of 31 controlled studies found a concentration-dependent effect, with a strong effect at 10%.<Citation n={3} /></p>
        <p>Vitamin C is notably less irritating than retinoids or AHAs. Formulation stability is a practical limitation — a serum that has turned brown/orange has likely degraded.</p>
      </IngredientCard>

      <IngredientCard name="Niacinamide" rating="★★★★ Moderate Evidence" evidence={4} magnitude="moderate" safety="good" consistency="high">
        <p>One of the broadest evidence bases on this page, spanning barrier function, hyperpigmentation, sallowness, and fine lines. A controlled study found 5% niacinamide significantly reduced wrinkle depth, hyperpigmentation, redness, and sallowness over 12 weeks.<Citation n={4} /> Combined with tranexamic acid, it significantly outperformed vehicle for facial hyperpigmentation.<Citation n={5} /></p>
        <p>Lower concentrations (2–3%) appear sufficient and may reduce irritation risk in melanin-rich skin.</p>
      </IngredientCard>

      <IngredientCard name="Azelaic Acid" rating="★★★★ Moderate (acne/rosacea/melasma) · ★★★ Emerging (photoaging)" evidence={4} magnitude="moderate" safety="good" consistency="mostly">
        <p>A 2023 systematic review of 43 RCTs found azelaic acid more effective than vehicle for rosacea, acne, and melasma.<Citation n={6} /> Notably, that same review concluded RCT evidence is still needed specifically for skin-aging outcomes — its anti-aging reputation outpaces what's been directly tested for that indication.</p>
      </IngredientCard>

      <IngredientCard name="Alpha Hydroxy Acids (Glycolic, Lactic)" rating="★★★★ Moderate Evidence" evidence={4} magnitude="moderate" safety="caution" consistency="mostly">
        <p>A classic pilot study found AHA treatment caused an approximate 25% increase in skin thickness, with biopsy-confirmed increases in collagen density and elastic fiber quality after roughly 6 months.<Citation n={7} /> Subsequent trials at 5–12% have shown texture and photoaging-score improvements with good tolerability at moderate concentrations.</p>
      </IngredientCard>

      <IngredientCard name="Hyaluronic Acid (Topical)" rating="★★★★ Moderate (hydration) · ★★★ Emerging (wrinkle depth)" evidence={4} magnitude="moderate" safety="good" consistency="mostly">
        <p>One trial found a statistically significant 30% improvement in plumping and 31% improvement in hydration immediately after application, sustained through 6 weeks.<Citation n={8} /> Effects on wrinkle depth specifically are smaller and less consistent across molecular weights.<Citation n={9} /></p>
      </IngredientCard>

      <IngredientCard name="Tranexamic Acid (Topical)" rating="★★★★ Moderate Evidence (melasma)" evidence={4} magnitude="moderate" safety="good" consistency="mostly">
        <p>A randomized trial comparing 5% topical tranexamic acid to 3% hydroquinone over 12 weeks found a 27% vs. 26.7% MASI reduction — not a statistically significant difference, meaning comparable efficacy to the historical gold standard, without hydroquinone's long-term safety concerns.<Citation n={10} /></p>
      </IngredientCard>

      <IngredientCard name="Hydroquinone" rating="★★★★★ Strong (efficacy) · Significant Caution (safety)" evidence={5} magnitude="large" safety="significant" consistency="high">
        <p>The longest and largest evidence base of any depigmenting agent, and the clinical benchmark newer agents are tested against. Efficacy is well established. The limiting factor is safety: prolonged, especially unsupervised, use is associated with exogenous ochronosis (permanent discoloration).<Citation n={11} /> Generally recommended for supervised, time-limited use rather than indefinite daily use — Evidence Quality and Safety are genuinely different axes here.</p>
      </IngredientCard>

      <IngredientCard name="Bakuchiol" rating="★★★ Emerging Evidence" evidence={3} magnitude="moderate" safety="good" consistency="mostly">
        <p>The most rigorously tested "retinol alternative." A prospective, randomized, double-blind 12-week trial against retinol found comparable improvement in photoaging measures, with significantly fewer adverse events for bakuchiol.<Citation n={12} /> A genuinely good result — but it is one trial, and deserves replication before being treated as settled the way retinoid evidence is.</p>
      </IngredientCard>

      <IngredientCard name="Alpha Arbutin" rating="★★★ Emerging Evidence" evidence={3} magnitude="moderate" safety="good" consistency="mostly">
        <p>Multiple positive RCTs for hyperpigmentation, generally comparable to or better-tolerated than hydroquinone at studied concentrations, including a 90-day study showing significant reductions in melanin content and pigmentation severity.<Citation n={13} /> The evidence base is real but smaller and less mature than hydroquinone's or tranexamic acid's.</p>
      </IngredientCard>

      <IngredientCard name="Ceramides" rating="★★★ Emerging (barrier) · ★★ Weak (oral/depigmentation)" evidence={3} magnitude="moderate" safety="good" consistency="mostly">
        <p>Reasonably consistent support for barrier repair, following directly from their natural role in the skin barrier. Evidence for oral supplementation and depigmentation use is much thinner — one open-label study (no control group) noted that data on oral ceramides remain extremely scarce, mostly from in vivo/in vitro models.<Citation n={14} /></p>
      </IngredientCard>

      <IngredientCard name="Peptides (Topical & Oral Collagen)" rating="★★★ Emerging Evidence — funding caveat applies" evidence={3} magnitude="small" safety="good" consistency="inconsistent">
        <p>Several oral collagen peptide RCTs report improvements in hydration, elasticity, and wrinkle measures.<Citation n={16} /> However, a 2025 meta-analysis that specifically stratified results by funding source found industry-funded trials showed benefit, while independently-funded trials did not.<Citation n={17} /> This doesn't mean zero effect — but the "23 RCTs show benefit" headline is misleading without that stratification.</p>
        <p>Topical peptides (Matrixyl, acetyl hexapeptide-8) show a similar pattern: plausible mechanisms, some positive small trials, but a 2025 review concluded further studies are needed to understand long-term effects.<Citation n={18} /></p>
      </IngredientCard>

      <IngredientCard name="Caffeine (Topical)" rating="★★ Weak Evidence" evidence={2} magnitude="small" safety="good" consistency="inconsistent">
        <p>Widely marketed for under-eye puffiness and dark circles, generally in small studies. A review of eye cream ingredients found supportive small trials but noted large-scale clinical trials focusing specifically on periorbital efficacy are still warranted.<Citation n={15} /> Most positive trials are small (10–55 subjects) and test caffeine combined with several other actives, making it hard to isolate caffeine's individual contribution.</p>
      </IngredientCard>

      <IngredientCard name="Growth Factors & Exosomes" rating="★★ Weak Evidence" evidence={2} magnitude="unclear" safety="good" consistency="inconsistent">
        <p>The newest and most heavily marketed category on this page, with the thinnest independent human clinical evidence relative to the claims surrounding it. Growth factor serums have some small human studies showing texture improvement, but results vary widely.<Citation n={19} /> Exosomes are earlier-stage still — most supporting data comes from cultured cells or animal models rather than controlled human trials.<Citation n={18} /></p>
        <p>The mechanistic plausibility here is genuinely interesting — these molecules do have real cell-signaling roles — but plausibility is not the same as demonstrated clinical benefit in people, and right now the gap between the two is unusually wide for this category.</p>
      </IngredientCard>

      <IngredientCard name="Copper Peptides" rating="★★ Weak Evidence" evidence={2} magnitude="small" safety="good" consistency="inconsistent">
        <p>An interesting basic-science backstory (naturally occurring, declines with age) and mechanistic support for stimulating collagen/elastin. Independent, well-controlled human RCTs isolating topical copper peptides specifically are limited — much of the available material is manufacturer- or provider-sourced rather than independent dermatology literature.</p>
      </IngredientCard>

      <IngredientCard name="CoQ10" rating="★★ Weak Evidence (for skin aging specifically)" evidence={2} magnitude="small" safety="good" consistency="inconsistent">
        <p>Reasonable evidence in other indications, and a plausible antioxidant mechanism for skin, but topical skin-aging-specific human trial evidence is comparatively thin. A real technical barrier exists too: CoQ10's poor water solubility and large molecular size make effective skin delivery difficult without specialized formulation.<Citation n={20} /></p>
      </IngredientCard>

      <SectionHeading>Master Comparison Table</SectionHeading>
      <IngredientTable />

      <SectionHeading>Practical Recommendations</SectionHeading>
      <ul style={{ fontSize: 15, lineHeight: 1.8, color: colors.ink, paddingLeft: 20 }}>
        <li>If starting from zero, a daily broad-spectrum sunscreen plus one antioxidant (vitamin C, AM) and one cell-turnover agent (retinoid, PM) covers the two best-evidenced mechanisms on this page.</li>
        <li>Introduce one new active at a time, roughly 2 weeks apart, so any irritation can be traced to its actual cause.</li>
        <li>Retinoids and AHAs/BHAs are not typically layered together without guidance — combining strong cell-turnover agents increases irritation risk without necessarily adding benefit.</li>
      </ul>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, margin: '28px 0' }}>
        <div>
          <h3 style={{ fontFamily: fontDisplay, fontSize: 17, color: colors.accent, marginBottom: 8 }}>Who Benefits</h3>
          <p style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>Generally healthy adult skin seeking to address fine lines, mild-moderate pigmentation, texture, or hydration — with the patience for weeks-to-months of consistent use.</p>
        </div>
        <div>
          <h3 style={{ fontFamily: fontDisplay, fontSize: 17, color: colors.tier, marginBottom: 8 }}>Who Should Avoid</h3>
          <p style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>Retinoids/AHAs/tretinoin: avoid during pregnancy/breastfeeding without physician guidance. Hydroquinone: avoid unsupervised long-term use. Anyone sensitive: patch-test first.</p>
        </div>
      </div>

      <SectionHeading>Common Misconceptions</SectionHeading>
      <MythFact
        myth='"Natural" or "clean" ingredients are inherently gentler or more effective than synthetic ones.'
        fact="Efficacy and safety depend on the specific molecule and concentration, not natural-vs-synthetic origin. Hydroquinone is highly effective and carries real risk; bakuchiol is plant-derived and well-tolerated but has a smaller evidence base than synthetic retinoids."
      />
      <MythFact
        myth="A product with more active ingredients listed is automatically more effective."
        fact="Many studies (caffeine, peptides) test actives in combination, making it hard to know which ingredient is doing the work — and stacking actives increases irritation risk without guaranteed added benefit."
      />

      <SectionHeading>Research Gaps</SectionHeading>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: colors.ink }}>
        Exosomes and most growth factor products are the clearest research gap on this page: strong mechanistic rationale, minimal independent human RCT data, and a fast-growing market — exactly the combination most likely to produce overstated consumer claims. Oral collagen peptides show an unusually well-documented funding-bias pattern. Azelaic acid's anti-aging-specific evidence (distinct from its strong acne/rosacea/melasma evidence) remains a stated gap in its own systematic review. Caffeine is held back less by negative results than by a shortage of large, single-ingredient trials.
      </p>

      <ClinicalBottomLine>
        Topical retinoids and vitamin C have the strongest, most consistent human evidence on this page and are reasonable foundational choices for most people. Niacinamide, azelaic acid, hyaluronic acid, and tranexamic acid each have solid evidence for narrower, specific goals. Bakuchiol and alpha arbutin are promising but newer alternatives. Hydroquinone works well but needs supervised, time-limited use. The newest, most heavily marketed category — exosomes, many growth factor serums, copper peptides — currently rests on the thinnest independent human evidence relative to its marketing claims.
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ['Does retinol thin your skin?', 'No — a common misconception. Retinoids actually thicken the epidermis over time by increasing cell turnover and collagen production. Initial flaking is surface irritation, not thinning.'],
          ['Can I use vitamin C and retinol together?', 'Many people do — vitamin C in the morning, retinoid at night — which avoids stability/irritation interactions and pairs an antioxidant with a turnover agent.'],
          ['Is "medical-grade" skincare actually different?', '"Medical-grade" is not a regulated term. See Myths vs Facts for a full breakdown.'],
          ['Why isn\'t a trending ingredient rated higher here?', "This page rates ingredients by the strength of independent human clinical evidence, not popularity. Some genuinely promising ingredients are rated cautiously simply because rigorous human trials haven't caught up to the marketing yet."],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>

      <SectionHeading>References</SectionHeading>
      <div style={{ fontSize: 12.5, color: colors.inkSoft, lineHeight: 1.8, fontFamily: fontMono }}>
        {[
          'Tretinoin for Photodamaged Facial Skin: Systematic Review and Meta-Analysis of RCTs. Dermatology Practical & Conceptual, 2024/2025. 8 RCTs, n=1,361. Tier 2.',
          'Correia et al. Efficacy of topical vitamin C in melasma and photoaging: a systematic review. J Cosmetic Dermatology, 2023. Tier 2.',
          'Vitamin C Prevents UV-Induced Pigmentation: Bayesian Meta-analysis of 31 RCTs. JCAD, 2019. Tier 2.',
          'Bissett et al. 2005, 12-week controlled trial, cited in Clinical Evaluation of Niacinamide in Hyperpigmentation and Barrier Repair. Tier 3.',
          'Lee, Oh, Koo, Suk et al. Niacinamide + tranexamic acid RCT. Skin Research and Technology, 2014. Tier 3.',
          'King et al. Systematic review of azelaic acid, 43 RCTs. J Cosmetic Dermatology, 2023. Tier 2.',
          'Ditre, Griffin, Murphy et al. Effects of AHAs on photoaged skin. JAAD, 1996. Tier 3.',
          'Efficacy Evaluation of a Topical HA Serum in Facial Photoaging. Tier 3. Industry-affiliated — see funding note below.',
          'Bravo et al. Benefits of topical hyaluronic acid for skin quality. Dermatologic Therapy, 2022. Tier 2 narrative review.',
          'Janney, Subramaniyan, Dabas et al. TA 5% vs HQ 3% RCT. J Cutaneous and Aesthetic Surgery, 2019. Tier 3.',
          'Multiple sources on hydroquinone/ochronosis risk, consistent across reviewed RCTs.',
          'Dhaliwal et al. Bakuchiol vs retinol RCT. British Journal of Dermatology, 2019;180(2):289-296. Tier 3.',
          'Efficacy/Safety of THBG + α-Arbutin in Indian Females with Melasma. Open-label, single-arm — Tier 6.',
          'Rice Ceramide Supplementation: Open-Label Prospective Study. Tier 6 (no control).',
          'A review of the efficacy of popular eye cream ingredients. Narrative review. Tier 7/8.',
          'Multiple oral collagen peptide RCTs (Reilly 2024; Lee 2023; Proksch 2014), individually Tier 3.',
          'Myung & Park (2025). Meta-analysis of 23 RCTs (n=1,474), stratified by funding source. Tier 2 — funding-bias finding per Phase 2 §5.',
          'Vinson Jones T. Topical peptides, growth factors, and exomes: Hype or science? Opin Prog Cosmet Dermatol, 2025;4(2):41–48. Tier 7/8.',
          'Doctor Rogers Skin Care, citing Wu et al., J Cosmetic Academic Dermatology, 2017. Tier 7/8 synthesis.',
          'Topical Delivery of CoQ10-Loaded Microemulsion for Skin Regeneration. Preclinical/formulation study. Tier 7.',
        ].map((ref, i) => (
          <div key={i} style={{ marginBottom: 6 }}>[{i + 1}] {ref}</div>
        ))}
        <div style={{ marginTop: 12, fontStyle: 'italic', color: colors.inkSoft }}>
          Funding disclosure note (Phase 2 §5): several sources above are manufacturer-affiliated; this is noted per-entry where it materially affects confidence, consistent with disclosure-without-exclusion.
        </div>
      </div>
    </article>
  );
}

// ============================================================
// THRESHOLD BAND — interactive occasional vs frequent visual
// ============================================================
function ThresholdBand({ factor, evidence, bands }) {
  const [active, setActive] = useState(null);
  return (
    <div style={{ marginBottom: 14, border: `1px solid ${colors.line}`, borderRadius: 10, padding: 16, background: colors.white }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <div style={{ fontFamily: fontDisplay, fontSize: 16, fontWeight: 600, color: colors.ink }}>{factor}</div>
        <div style={{ fontFamily: fontMono, fontSize: 10.5, color: colors.inkSoft }}>{evidence}</div>
      </div>
      <div style={{ display: 'flex', height: 28, borderRadius: 6, overflow: 'hidden', border: `1px solid ${colors.line}` }}>
        {bands.map((b, i) => (
          <div
            key={i}
            onClick={() => setActive(active === i ? null : i)}
            style={{
              flex: 1, background: b.color, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: '#fff', fontFamily: fontBody, fontWeight: 600,
              opacity: active === null || active === i ? 1 : 0.45,
              transition: 'opacity 0.15s',
            }}
          >{b.label}</div>
        ))}
      </div>
      {active !== null && (
        <div style={{ marginTop: 10, fontSize: 13.5, color: colors.inkSoft, lineHeight: 1.55 }}>{bands[active].detail}</div>
      )}
    </div>
  );
}

// ============================================================
// LIFESTYLE — FULL PAGE
// ============================================================
function LifestylePage() {
  const thresholds = [
    {
      factor: 'Sun Exposure', evidence: '★★★★★ Strong (RCT)',
      bands: [
        { label: 'Daily SPF', color: colors.safetyGood, detail: 'Daily broad-spectrum SPF 30+ use — the Nambour RCT (n=903, 4.5 yrs) found 24% less measured skin aging in this group vs. discretionary use.' },
        { label: 'Discretionary', color: colors.safetyCaution, detail: 'Sunscreen only on visibly sunny days — measurably worse outcomes than daily use in the same trial, even though it still beats no protection at all.' },
        { label: 'Unprotected', color: colors.safetySig, detail: 'No regular protection — cumulative UV exposure drives the majority of extrinsic (photo)aging discussed on The Science of Aging page.' },
      ],
    },
    {
      factor: 'Smoking', evidence: '★★★★ Moderate',
      bands: [
        { label: 'None', color: colors.safetyGood, detail: 'The only pattern with consistent supporting data for minimizing smoking-related facial aging.' },
        { label: 'Any regular use', color: colors.safetySig, detail: 'Wrinkle depth significantly more prominent at 35+ pack-years vs. non-smokers; effect appears additive with UV exposure, not just parallel to it.' },
      ],
    },
    {
      factor: 'Alcohol', evidence: '★★ Weak / Inconsistent',
      bands: [
        { label: 'Evidence is mixed', color: colors.inkSoft, detail: 'Large cross-sectional studies disagree with each other — some find an association with facial aging signs, larger others find none. No defined safe/risk threshold is supported by current data. This page does not pick a side the literature itself hasn\'t resolved.' },
      ],
    },
    {
      factor: 'Sleep', evidence: '★★★ Emerging',
      bands: [
        { label: '7–9 hrs', color: colors.safetyGood, detail: 'Standard general-health recommendation; the one dedicated skin-aging study used 8 hrs/night as its "good sleeper" comparison point.' },
        { label: 'Chronic restriction', color: colors.safetyCaution, detail: 'The same study used 5 hrs/night as "poor sleeper" — significantly worse SCINEXA aging scores and UV-recovery. Real finding, but from one industry-commissioned study (n=60) — treat as suggestive, not settled.' },
      ],
    },
  ];

  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 3 OF 16 · FOUNDATIONS</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>Lifestyle</h1>
      <div style={{ fontSize: 15.5, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640 }}>
        Sun exposure, sleep, smoking, alcohol — what the evidence actually says about where habits cross from occasional to harmful, including where the evidence itself is genuinely unresolved.
      </div>

      <QuickTakeaway>
        <strong>Daily sunscreen use has the single strongest piece of intervention evidence on this entire site</strong> — a real randomized controlled trial, not just an observational association. Smoking has decades of consistent evidence. Alcohol's skin-aging effect is genuinely mixed across studies — this page says so plainly rather than picking the more dramatic-sounding finding. Sleep's evidence is real but currently rests heavily on one small, industry-commissioned study.
      </QuickTakeaway>

      <SectionHeading>Sun Exposure</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        The Nambour trial, a community-based randomized controlled trial of 903 adults followed for 4.5 years, is unusual for this field: most lifestyle-and-skin claims rest on observational data, but this one is a genuine RCT. Participants were randomized to daily versus discretionary sunscreen use. The daily sunscreen group showed no detectable increase in skin aging after 4.5 years, with skin aging 24% less than in the discretionary-use group.<Citation n={1} /> Shorter-term trials are consistent with this, showing measurable improvements in wrinkles, pigmentation, and texture within 8–52 weeks.<Citation n={2} />
      </p>
      <ClinicalPearl>
        Most of what's discussed elsewhere on this site — ingredients, devices, procedures — is trying to repair or compensate for damage that daily sunscreen use prevents in the first place. If you adopt one habit from this whole site, this is the one with the best randomized-trial evidence behind it.
      </ClinicalPearl>
      <p style={{ fontSize: 14, lineHeight: 1.65, color: colors.inkSoft, fontStyle: 'italic' }}>
        One nuance worth knowing: standard sunscreen filters UV-A and UV-B, but visible light can also trigger pigmentation in melasma-prone skin — see Hyperpigmentation for tinted, iron-oxide sunscreen guidance specific to that concern.
      </p>

      <SectionHeading>Sleep</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        The primary evidence connecting sleep to visible skin aging traces substantially to one 2013–2015 trial: 60 premenopausal women categorized as poor- or good-quality sleepers, evaluated using the SCINEXA score. Good sleepers showed significantly lower SCINEXA scores, 30% reduced transepidermal water loss, and better skin recovery after UV exposure.<Citation n={4} /> Worth knowing: this study was commissioned by a cosmetics manufacturer, and the sample (60) is modest.<Citation n={5} /> A great deal of what's written online about sleep and skin aging traces back to this single study rather than independent replication.
      </p>

      <SectionHeading>Smoking & Vaping</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Smoking's link to visible facial aging has been observed since at least 1971 and is supported by multiple studies controlling for age, sex, sun exposure, and alcohol use.<Citation n={6} /> One study found wrinkle depth significantly more prominent in smokers with 35+ pack-years versus non-smokers.<Citation n={7} /> Notably, UV exposure and smoking appear to have an <strong>additive effect</strong> on wrinkle formation — the combination is worse than either factor alone.<Citation n={6} /></p>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Vaping is too recent a behavior to have a comparable long-term human evidence base — rated weak here because of a genuine data gap, not because of reassuring findings.
      </p>

      <SectionHeading>Alcohol</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        This is the clearest case of genuinely conflicting evidence on this page. A large multinational survey of 3,000+ women found associations between alcohol patterns and some facial aging signs — but the same paper notes that other, larger studies have found no association between alcohol use and perceived age or wrinkling score, attributing the inconsistency to differences in how consumption was measured across studies.<Citation n={8} /> Worth disclosing: that multinational survey was funded by, and includes authors employed by, Allergan — a maker of injectable cosmetic procedures.<Citation n={8} /></p>

      <MythFact
        myth="There's a precise, well-established dose-response relationship between alcohol intake and skin aging."
        fact="No such figure is supported by current evidence. Mechanistically plausible pathways exist, but the actual effect size is inconsistent across studies — any source citing a specific years-of-aging-per-drink number is overstating the literature."
      />

      <SectionHeading>Threshold Guide: Occasional vs. Frequent</SectionHeading>
      <p style={{ fontSize: 14, color: colors.inkSoft, marginBottom: 14 }}>Tap a band for detail. Color reflects risk pattern within that factor — not a comparison of evidence strength across factors (see the ★ rating for that).</p>
      {thresholds.map(t => <ThresholdBand key={t.factor} {...t} />)}

      <SectionHeading>Tattoo Care</SectionHeading>
      <p style={{ fontSize: 14, color: colors.inkSoft, marginBottom: 14, fontStyle: 'italic' }}>Housed here rather than as a standalone page — tattoo healing and long-term appearance intersect directly with the UV/skin-barrier mechanisms covered above.</p>

      <h3 style={{ fontFamily: fontDisplay, fontSize: 18, color: colors.ink, marginTop: 20, marginBottom: 8 }}>Healing Timeline</h3>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
        Per the American Academy of Dermatology's public clinical guidance, surface healing typically takes about three weeks for scabbing/flaking to resolve, but deeper skin layers can take several months to fully heal even once the surface looks complete.<Citation n={9} /> Keep the area clean and use water-based (not petroleum-based) moisturizer — petroleum-based products can cause ink to fade.<Citation n={9} />
      </p>

      <h3 style={{ fontFamily: fontDisplay, fontSize: 18, color: colors.ink, marginTop: 20, marginBottom: 8 }}>Sun Protection</h3>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
        UV radiation generates free radicals that break down tattoo pigment through essentially the same oxidative mechanism that damages collagen and elastin elsewhere in skin.<Citation n={10} /> Lighter colors (yellow, light blue, pink) generally fade faster than darker ones, though none are fully UV-resistant. Once healed: broad-spectrum, water-resistant SPF 30+, applied 15 minutes before exposure and reapplied every two hours; avoid tanning beds entirely.<Citation n={9} />
      </p>
      <ClinicalPearl>
        Never apply sunscreen to a fresh, still-healing tattoo — most formulations can irritate compromised skin and interfere with healing. Wait until your artist confirms the surface has healed (typically several weeks), then make daily SPF a permanent habit on that area.
      </ClinicalPearl>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: colors.inkSoft }}>
        A peer-reviewed study notes that tattoo artists are a uniquely positioned venue for skin-cancer-prevention education, but most are not well-informed on comprehensive sun-safety recommendations beyond basic aftercare.<Citation n={11} /> Worth getting sun-protection guidance from a dermatology source directly rather than relying solely on verbal aftercare advice given at the time of tattooing.
      </p>

      <h3 style={{ fontFamily: fontDisplay, fontSize: 18, color: colors.ink, marginTop: 20, marginBottom: 8 }}>When to Seek Professional Evaluation</h3>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
        Normal healing involves redness, mild swelling, and scabbing in the first 1–3 weeks. Spreading redness or warmth beyond the tattoo border, pus or unusual discharge, fever, or a reaction pattern specific to one ink color (suggesting a pigment allergy) all warrant evaluation by a healthcare provider rather than continued home care.
      </p>

      <SectionHeading>Common Misconceptions</SectionHeading>
      <MythFact
        myth='A base tan or gradual sun exposure "prepares" skin and reduces long-term damage.'
        fact="Any tan represents visible evidence of UV-induced DNA damage already having occurred — there's no mechanism by which sun exposure reduces future photoaging risk."
      />

      <SectionHeading>Research Gaps</SectionHeading>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: colors.ink }}>
        Alcohol's skin-aging effect size is the clearest unresolved question on this page — better-standardized measurement across future studies would help. Vaping-specific long-term human skin-aging data essentially doesn't exist yet. Sleep-and-skin-aging would benefit from independent, larger-sample replication. Controlled trials on specific sunscreen formulations' effectiveness at preventing tattoo fading specifically (vs. general photoaging) remain limited.
      </p>

      <ClinicalBottomLine>
        Daily broad-spectrum sunscreen has the strongest randomized-trial evidence on this entire site and is the highest-confidence, lowest-cost recommendation here. Smoking has decades of consistent evidence via a well-understood, UV-additive mechanism. Sleep's connection to skin aging is real but narrower in evidence than its popularity suggests. Alcohol's effect is genuinely unresolved — be skeptical of confident claims either way. For tattooed skin, the same UV-protection logic applies directly to preserving appearance once healing is complete.
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ['Is SPF 30 enough, or do I need SPF 50+?', 'The Nambour trial used SPF 15+; most current guidance recommends 30+. The gap between 30 and 50 in actual UV blocking (97% vs. 98%) is smaller than marketing suggests — consistent daily application matters more than the exact number above 30.'],
          ['Does sunscreen cause vitamin D deficiency?', 'A common concern, addressed with the relevant evidence on the Nutrition & Supplements page rather than here.'],
          ['How soon can I put sunscreen on a new tattoo?', "Not until your artist confirms the surface has fully healed — typically several weeks. Before that, sun avoidance (clothing/shade) rather than sunscreen is the right approach."],
          ['Why is alcohol rated so much lower than sun exposure, when both get cited as skin-aging culprits?', 'Because the underlying evidence quality is genuinely different — sun exposure has a large RCT behind it; alcohol has inconsistent observational data. This page rates by evidence strength, not by how often a claim gets repeated.'],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>

      <SectionHeading>References</SectionHeading>
      <div style={{ fontSize: 12.5, color: colors.inkSoft, lineHeight: 1.8, fontFamily: fontMono }}>
        {[
          'Hughes, Williams, Baker et al. Sunscreen and prevention of skin aging: a randomized trial. Annals of Internal Medicine, 2013. The Nambour trial, n=903, 4.5-yr RCT. Tier 3.',
          'A Comprehensive Systematic Review of the Relationship Between Sunscreen Use and Prevention of Photoaging. Intl J Medical Science and Health Research, 2026. 63 studies. Tier 2.',
          'Sunscreen use and intentional exposure to UVA/UVB radiation: double-blind randomized trial using personal dosimeters. Tier 3 (included for balance).',
          'Sleep deprivation and the skin. Clinical and Experimental Dermatology, 2023, summarizing Baron et al. 2015 SCINEXA study, n=60. Tier 4.',
          'ScienceDaily/Dermatology Times coverage of the same UH Case Medical Center study, industry-commissioned by Estée Lauder — funding disclosure per Phase 2 §5.',
          'Tobacco smoke causes premature skin aging. ScienceDirect review, 2007. Tier 8 narrative review.',
          'Facial wrinkling in men and women, by smoking status. American Journal of Public Health, n=1,136. Tier 6 cross-sectional.',
          'Impact of Smoking and Alcohol Use on Facial Aging in Women: Multinational Cross-sectional Survey. JCAD, 2019, n=3,000+. Tier 6. Allergan-affiliated authors — funding disclosure per Phase 2 §5.',
          'Caring for Tattooed Skin. American Academy of Dermatology, public clinical guidance. Tier 1.',
          'Ultraviolet radiation may cause premature fading of colored tattoos. PubMed-indexed study. Tier 7.',
          'Gonzalez, Walkosz, Dellavalle. Aftercare Instructions in the Tattoo Community. JCAD, 2020. NIH/NCI-funded. Tier 8.',
        ].map((ref, i) => (
          <div key={i} style={{ marginBottom: 6 }}>[{i + 1}] {ref}</div>
        ))}
        <div style={{ marginTop: 12, fontStyle: 'italic', color: colors.inkSoft }}>
          Source-quality note (Phase 2 §3-4): Several tattoo-sunscreen-brand blogs and one addiction-treatment marketing page on alcohol/skin aging were excluded — they repeated real mechanisms but attached unsupported precision not found in the primary literature.
        </div>
      </div>
    </article>
  );
}

// ============================================================
// SUPPLEMENT TABLE
// ============================================================
const supplementData = [
  { name: 'Omega-3 (EPA/DHA)', evidence: 4, useCase: 'Systemic photoprotection', dose: '~2g/day EPA+DHA (study-dependent)', timeline: '4-12 wks', note: 'Additive to sunscreen, not a substitute' },
  { name: 'Probiotics (L. plantarum HY7714)', evidence: 3, useCase: 'Hydration, elasticity, wrinkle depth', dose: '10^10 CFU/day (study dose)', timeline: '4-12 wks', note: 'Strain-specific — not all probiotics equal' },
  { name: 'Zinc', evidence: 3, useCase: 'Acne (general anti-aging: weak)', dose: '30mg elemental (study dose)', timeline: '8-12 wks', note: 'Minocycline outperformed zinc by 17% in key trial' },
  { name: 'Vitamin D', evidence: 4, useCase: 'Eczema/AD (general anti-aging: weak)', dose: 'Per physician — deficiency-dependent', timeline: '8-16 wks', note: 'Best evidence is condition-specific, not anti-aging' },
  { name: 'Vitamin C (oral)', evidence: 2, useCase: 'Collagen cofactor (deficiency-dependent)', dose: 'RDA sufficient if non-deficient', timeline: 'N/A beyond deficiency correction', note: 'Topical evidence is separately strong — see Ingredients' },
  { name: 'Creatine (oral)', evidence: 2, useCase: 'Skin-specific: minimal; exercise: strong (see Exercise page)', dose: 'N/A for skin claims', timeline: 'N/A', note: 'Topical combination-product data ≠ oral skin evidence' },
  { name: 'Copper (oral)', evidence: 2, useCase: 'Collagen/elastin cofactor (mechanistic)', dose: 'RDA sufficient if non-deficient', timeline: 'N/A', note: 'Topical copper peptides reviewed separately' },
  { name: 'Protein (general dietary)', evidence: 3, useCase: 'Collagen synthesis substrate', dose: 'Adequate intake per body weight', timeline: 'Ongoing', note: 'Foundational but rarely tested as isolated skin-aging RCT' },
];

function SupplementTable() {
  const [sortBy, setSortBy] = useState('evidence');
  const evidenceLabel = { 5: '★★★★★', 4: '★★★★', 3: '★★★', 2: '★★', 1: '★' };
  const sorted = useMemo(() => {
    const rows = [...supplementData];
    rows.sort((a, b) => sortBy === 'evidence' ? b.evidence - a.evidence : a.name.localeCompare(b.name));
    return rows;
  }, [sortBy]);

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{ display: 'flex', marginBottom: 12 }}>
        <button
          onClick={() => setSortBy(sortBy === 'evidence' ? 'name' : 'evidence')}
          style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer', border: `1px solid ${colors.line}`, background: colors.white, color: colors.inkSoft, fontFamily: fontBody }}
        >Sort: {sortBy === 'evidence' ? 'Evidence ↓' : 'A–Z'}</button>
      </div>
      <div style={{ overflowX: 'auto', border: `1px solid ${colors.line}`, borderRadius: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: colors.bgAlt, textAlign: 'left' }}>
              {['Supplement', 'Evidence', 'Best-Supported Use', 'Typical Studied Dose', 'Timeline', 'Note'].map(h => (
                <th key={h} style={{ padding: '10px 14px', fontFamily: fontMono, fontSize: 10.5, color: colors.inkSoft, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: `1px solid ${colors.line}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.name} style={{ background: i % 2 === 0 ? colors.white : colors.bg }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: colors.ink, fontFamily: fontDisplay }}>{row.name}</td>
                <td style={{ padding: '10px 14px', color: colors.star, fontFamily: fontMono, fontWeight: 600 }}>{evidenceLabel[row.evidence]}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft }}>{row.useCase}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft }}>{row.dose}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft }}>{row.timeline}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft, fontSize: 12.5 }}>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// NUTRITION & SUPPLEMENTS — FULL PAGE
// ============================================================
function NutritionPage() {
  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 5 OF 16 · FOUNDATIONS</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>Nutrition & Supplements</h1>
      <div style={{ fontSize: 15.5, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640 }}>
        What oral supplementation actually has clinical trial support for skin aging — and where popular marketing claims outrun the evidence behind them.
      </div>

      <QuickTakeaway>
        <strong>Omega-3 fatty acids</strong> have genuine RCT evidence for systemic photoprotection — a real, distinctive benefit among oral supplements. <strong>Zinc</strong> has solid acne-specific trial evidence, though the most-cited comparative trial actually found the antibiotic comparator modestly outperformed it. <strong>Probiotics</strong> have a small but real and growing RCT base via the gut-skin axis. <strong>Vitamin D's</strong> strongest skin evidence is for eczema, not general anti-aging — a distinction often lost in marketing.
      </QuickTakeaway>

      <SectionHeading>Evidence by Supplement</SectionHeading>

      <IngredientCard name="Omega-3 Fatty Acids (EPA/DHA)" rating="★★★★ Moderate Evidence (photoprotection)" evidence={4} magnitude="moderate" safety="good" consistency="mostly">
        <p>Omega-3s have a genuinely distinctive evidence niche: systemic UV photoprotection. A randomized controlled trial gave participants oral omega-3 supplements, then exposed their skin to simulated solar radiation — the supplemented group showed significantly less suppression of cutaneous immune responses than placebo.<Citation n={1} /> Photoprotection is measured via Minimal Erythemal Dose (MED), with supplementation associated with a higher, more protective MED.<Citation n={2} /></p>
        <p>Mechanistically, EPA reduces UV-induced inflammation, inhibits MMP production (the same collagen-degrading enzymes from The Science of Aging), and decreases UV-induced immunosuppression.<Citation n={1} /> This is a real, RCT-supported internal complement to topical sun protection — it does not replace sunscreen.</p>
      </IngredientCard>

      <IngredientCard name="Probiotics" rating="★★★ Emerging Evidence" evidence={3} magnitude="moderate" safety="good" consistency="mostly">
        <p>Probiotics act through the gut-skin axis, and evidence has moved beyond pure mechanism into real human RCTs. A randomized, double-blinded, placebo-controlled trial in 110 participants aged 41–59 found daily <em>Lactobacillus plantarum</em> HY7714 for 12 weeks significantly improved hydration, gloss, elasticity, and reduced facial wrinkles vs. placebo.<Citation n={3} /> A separate trial combining a probiotic with carotenoids found benefit against UV-induced skin damage.<Citation n={4} /></p>
        <p>Smaller and newer than topical retinoid/vitamin C evidence, but more developed than several trendier topical "regenerative" ingredients — real RCTs with objective measurement exist here.</p>
      </IngredientCard>

      <IngredientCard name="Zinc" rating="★★★ Emerging (acne) · ★★ Weak (general anti-aging)" evidence={3} magnitude="moderate" safety="good" consistency="mostly">
        <p>Zinc has a genuine, decades-old RCT literature for acne — but the most commonly-cited trial doesn't show zinc as superior to standard treatment. A multicenter RCT of 332 patients compared 30mg zinc gluconate against 100mg minocycline over 3 months; both were effective, but <strong>minocycline showed a 17% superior effect</strong>.<Citation n={5} /> A more recent meta-analysis found genuine support against placebo, while noting more mixed results versus standard antibiotic therapy.<Citation n={6} /></p>
        <p>For general anti-aging claims beyond acne, zinc's evidence is considerably thinner — real biochemistry (collagen-synthesis enzyme cofactor), but not a demonstrated anti-aging clinical outcome.</p>
        <MythFact
          myth='Zinc supplements work "as well as antibiotics" for acne with none of the downsides.'
          fact="The actual head-to-head trial most cited in zinc's favor found the antibiotic comparator modestly outperformed zinc. Zinc is legitimate and evidence-supported — particularly for avoiding long-term antibiotic use — but 'equally effective' overstates the primary trial's finding."
        />
      </IngredientCard>

      <IngredientCard name="Vitamin D" rating="★★★★ Moderate (eczema) · ★★ Weak (general anti-aging)" evidence={4} magnitude="moderate" safety="good" consistency="mostly">
        <p>Vitamin D's strongest, most consistent skin-specific evidence is for atopic dermatitis, not general anti-aging. A systematic review and meta-analysis of 11 RCTs (686 participants) examined supplementation for AD, building on vitamin D's role in barrier integrity and immune modulation.<Citation n={7} /> A separate RCT found supplementation linked to clinical improvement and reduced bacterial colonization in moderate eczema.<Citation n={8} /></p>
        <p>Vitamin D is frequently marketed under a general "skin health" banner, but its best-supported use case is an inflammatory skin condition, not wrinkles or visible aging markers — an important distinction this page makes explicitly.</p>
      </IngredientCard>

      <IngredientCard name="Creatine (Oral)" rating="★★ Weak Evidence (skin-specific)" evidence={2} magnitude="unclear" safety="good" consistency="inconsistent">
        <p>Creatine appears in topical antiwrinkle combination formulations with some supportive dermal-penetration data.<Citation n={9} /> But this is topical, combination-product evidence — not oral supplementation for skin outcomes. Oral creatine's well-established evidence is for exercise performance (see Exercise & Body Composition), and that shouldn't be assumed to transfer to skin-aging outcomes, which haven't been independently tested for oral creatine specifically.</p>
      </IngredientCard>

      <IngredientCard name="Copper (Oral)" rating="★★ Weak Evidence" evidence={2} magnitude="unclear" safety="good" consistency="inconsistent">
        <p>Copper is a genuine cofactor for lysyl oxidase, an enzyme in collagen/elastin cross-linking — real biochemistry, but minimal dedicated oral-supplementation human trial support for skin aging specifically. Topical copper peptides are reviewed separately on Skincare Ingredients, where the evidence (also weak, but for different reasons — mostly proprietary/manufacturer-sourced) is discussed further.</p>
      </IngredientCard>

      <IngredientCard name="Protein (General Dietary Intake)" rating="★★★ Emerging Evidence" evidence={3} magnitude="moderate" safety="good" consistency="mostly">
        <p>Adequate dietary protein is foundational to collagen synthesis — collagen is built from amino acids the body must obtain from diet — and protein adequacy is well-established for tissue repair broadly. Dedicated trials isolating general protein intake (vs. specific collagen peptide supplements, covered on Skincare Ingredients) as a skin-aging intervention specifically are less common. Rated highly for biochemical necessity, more cautiously for dedicated skin-aging-specific trial evidence.</p>
      </IngredientCard>

      <SectionHeading>Supplement Comparison Table</SectionHeading>
      <SupplementTable />

      <SectionHeading>Practical Recommendations</SectionHeading>
      <ul style={{ fontSize: 15, lineHeight: 1.8, color: colors.ink, paddingLeft: 20 }}>
        <li>Address deficiency first, optimization second — several supplements here have their strongest evidence in correcting an actual deficiency or treating a specific condition, not in healthy non-deficient people seeking generic anti-aging benefit.</li>
        <li>Omega-3 and probiotics are this page's two most genuinely promising categories for skin-aging-specific outcomes in non-deficient people.</li>
        <li>Don't expect oral supplements to substitute for sunscreen — even omega-3's photoprotective effect is additive, not a replacement.</li>
      </ul>

      <SectionHeading>Research Gaps</SectionHeading>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: colors.ink }}>
        Probiotic strain specificity is a real limitation — results are often strain-specific, and the field lacks enough head-to-head comparisons to know which strains work best. Oral creatine for skin aging has essentially no dedicated independent trial base. Zinc's general anti-aging claims (beyond acne) lack the RCT density of its acne-specific evidence. Vitamin D's marketing breadth versus its evidence concentration (eczema, not anti-aging) is a pattern worth generalizing when reading other supplement claims.
      </p>

      <ClinicalBottomLine>
        Omega-3 fatty acids and probiotics currently have the most genuinely RCT-supported, skin-aging-specific evidence among oral supplements, though both are smaller evidence bases than the strongest topical ingredients. Zinc has solid acne-specific evidence (modestly outperformed by antibiotics in the key trial) but thinner support for general anti-aging claims. Vitamin D's best-evidenced skin application is eczema, not anti-aging. Creatine, copper, and general protein/vitamin C have real biochemistry but limited dedicated oral-supplementation trial evidence for skin-aging outcomes specifically in non-deficient adults. The most evidence-grounded approach is addressing confirmed deficiencies rather than broad preventive supplementation.
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ['Should I take a multivitamin for better skin?', "This page doesn't find strong dedicated evidence for general multivitamin use improving skin-aging outcomes absent an underlying deficiency — addressing a confirmed deficiency is the better-evidenced path."],
          ['Is fish oil the same as omega-3 supplements generally?', 'Fish oil is the most common source of the specific omega-3s (EPA/DHA) studied above; plant-based ALA sources require inefficient conversion to EPA/DHA, so they may not provide equivalent benefit at the same dose.'],
          ['Do collagen supplements belong here or on Skincare Ingredients?', "Covered in depth on Skincare Ingredients, since most rigorous trials test it in a framing closely tied to that page's other entries, keeping the funding-bias discussion in one place."],
          ['Why does zinc get a lower rating here than expected?', "Because this page rates zinc's general anti-aging evidence separately from its acne-specific evidence, and because the most-cited comparative trial actually favored the antibiotic — a detail often dropped in zinc's popular marketing."],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>

      <SectionHeading>References</SectionHeading>
      <div style={{ fontSize: 12.5, color: colors.inkSoft, lineHeight: 1.8, fontFamily: fontMono }}>
        {[
          'Pilkington, Watson, Sherratt, Rhodes. Omega-3 polyunsaturated fatty acids: photoprotective macronutrients. Experimental Dermatology, review + associated RCT. Tier 3/2.',
          'Essential Fatty Acids and Skin Health. Linus Pauling Institute, Oregon State University — MED photoprotection synthesis. Tier 2.',
          'RCT of Lactobacillus plantarum HY7714, n=110, ages 41-59, 12 wks, cited in How Microbiomes Affect Skin Aging, PMC. Tier 3.',
          'Bouilly-Gauthier, Jeannes, Maubert et al. Probiotic + carotenoid supplement vs. UV skin damage. British Journal of Dermatology, 2010. Tier 3.',
          'Dreno, Moyse, Alirezai et al. Zinc gluconate vs. minocycline RCT. Dermatology, 2001;203(2):135-140. n=332. Tier 3.',
          'Yee et al. Serum zinc levels and efficacy of zinc treatment in acne vulgaris: systematic review and meta-analysis. Dermatologic Therapy, 2020. Tier 2.',
          'Vitamin D Supplementation for Treating Atopic Dermatitis: Systematic Review and Meta-Analysis. 11 RCTs, n=686. Tier 2.',
          'RCT: Vitamin D supplementation assists eczema treatment, citing Salah et al./Kamanamool et al. Tier 3.',
          'Peirano, Achterberg, Düsing et al. Dermal penetration of creatine (topical combination). J Cosmetic Dermatology, 2011;10(4):273-281. Tier 3 (topical, not oral).',
        ].map((ref, i) => (
          <div key={i} style={{ marginBottom: 6 }}>[{i + 1}] {ref}</div>
        ))}
        <div style={{ marginTop: 12, fontStyle: 'italic', color: colors.inkSoft }}>
          Source-quality note (Phase 2 §3-4): Numerous zinc/copper supplement-brand blog posts were excluded — they repeated real biochemistry without citing or accurately representing comparative trial outcomes (e.g., omitting that minocycline outperformed zinc).
        </div>
      </div>
    </article>
  );
}

// ============================================================
// TRIAGE TABLE — pattern-to-cause matrix
// ============================================================
function TriagePatternTable() {
  const rows = [
    { pattern: 'Symmetrical brown patches, cheeks/forehead/upper lip', cause: 'Melasma', feature: 'Symmetrical, sun/visible-light-triggered, hormonal' },
    { pattern: 'Flat dark mark exactly where a pimple, cut, or bite was', cause: 'Post-inflammatory hyperpigmentation (PIH)', feature: 'Traceable to a specific prior injury/inflammation' },
    { pattern: 'Darkening in skin folds, velvety/thickened texture', cause: 'Friction-related or acanthosis nigricans', feature: 'Texture change — not just color' },
    { pattern: 'Isolated, asymmetric, changing, or bleeding spot', cause: 'Not covered by home-treatment guidance', feature: 'See a professional' },
  ];
  return (
    <div style={{ overflowX: 'auto', border: `1px solid ${colors.line}`, borderRadius: 10, margin: '20px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
        <thead>
          <tr style={{ background: colors.bgAlt, textAlign: 'left' }}>
            {['Pattern', 'Likely Cause', 'Key Distinguishing Feature'].map(h => (
              <th key={h} style={{ padding: '10px 14px', fontFamily: fontMono, fontSize: 10.5, color: colors.inkSoft, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: `1px solid ${colors.line}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? colors.white : colors.bg }}>
              <td style={{ padding: '10px 14px', color: colors.ink, fontWeight: 500 }}>{r.pattern}</td>
              <td style={{ padding: '10px 14px', color: colors.ink, fontFamily: fontDisplay, fontWeight: 600 }}>{r.cause}</td>
              <td style={{ padding: '10px 14px', color: colors.inkSoft }}>{r.feature}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// HYPERPIGMENTATION — FULL PAGE
// ============================================================
function PigmentationPage() {
  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 9 OF 16 · TREATMENTS</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>Hyperpigmentation & Uneven Skin Tone</h1>
      <div style={{ fontSize: 15.5, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640 }}>
        Melasma, post-inflammatory marks, and skin-fold darkening are mechanistically different conditions — getting the cause right matters more than picking a trendy ingredient.
      </div>

      <QuickTakeaway>
        Melasma, PIH, and friction/hormonal darkening get lumped together in consumer content but respond differently to treatment. <strong>Visible light (not just UV) can trigger melasma</strong> — standard sunscreen alone doesn't fully address it. A rigorous systematic review found a <strong>real lack of robust efficacy across PIH treatments in skin of color</strong> — this page states that honestly. And dark, velvety patches at the neck or underarms can be a genuine marker of undiagnosed insulin resistance.
      </QuickTakeaway>

      <SectionHeading>What's Actually Causing This? (Triage by Pattern)</SectionHeading>
      <p style={{ fontSize: 14.5, color: colors.inkSoft, marginBottom: 4 }}>Identify the likely category before treating — the evidence-based approach differs meaningfully by cause.</p>
      <TriagePatternTable />

      <SectionHeading>Melasma</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Melasma's pathogenesis is multifactorial and not fully understood, but three drivers are well established: UV/visible light exposure, hormonal influence, and genetic predisposition.<Citation n={1} /> Melanocytes become hyperactive, producing excess melanin even without significant new UV exposure — meaning patches can persist or worsen even with sun avoidance, because the melanocytes themselves are dysregulated.<Citation n={2} /> The hormonal connection is substantial: melasma occurs more in women than men and commonly develops or worsens during pregnancy.<Citation n={1} />
      </p>
      <ClinicalPearl>
        Visible light (around 415nm, not just UV-A/UV-B) can trigger melasma pigmentation that persists for months.<Citation n={1} /> Standard sunscreens filtering only UV are "unsatisfactory" for melasma specifically, per clinical guidance — tinted, mineral sunscreens containing iron oxide provide meaningfully better visible-light protection than untinted formulations.
      </ClinicalPearl>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
        First-line treatment is strict sun/visible-light avoidance plus broad-spectrum, high-SPF (50+) tinted sunscreen — without this, "potentially successful treatments are doomed to fail."<Citation n={1} /> Topical depigmenting agents are the mainstay beyond protection: tranexamic acid and hydroquinone have the strongest head-to-head evidence (see Skincare Ingredients). Retinoids and azelaic acid serve as adjuncts.<Citation n={1} />
      </p>

      <SectionHeading>Post-Inflammatory Hyperpigmentation (PIH)</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        PIH is fundamentally different from melasma: a direct, localized reaction to a specific prior inflammatory event (acne, eczema, bite, cut, burn, aggressive extraction) rather than an ongoing hormonal/light-driven process.<Citation n={4} /> Melanocytes are activated as a protective response and deposit excess melanin at the injury site, sometimes long after the original inflammation resolved.<Citation n={5} /> PIH can be epidermal (brown/tan, responds better to topicals) or dermal (gray/blue-gray, deeper, slower to respond).<Citation n={5} />
      </p>
      <MythFact
        myth="PIH can be reliably and quickly cleared with the right combination of brightening ingredients."
        fact="A dedicated systematic review of PIH treatment in skin of color found a real lack of robust efficacy across all treatment modalities studied. PIH is treatable to a degree, but expect gradual, partial improvement over months — not a fast or guaranteed result."
      />
      <p style={{ fontSize: 12.5, color: colors.inkSoft, fontFamily: fontMono, marginTop: -6 }}>Source: systematic review, ref<Citation n={6} /></p>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
        The most consistently supported approach: address the underlying inflammatory trigger first (ongoing inflammation generates new pigment even while treating old marks), layer in tranexamic acid/niacinamide/azelaic acid/alpha arbutin (see Skincare Ingredients), and protect consistently from UV, since sun exposure darkens existing PIH.
      </p>

      <SectionHeading>Friction, Hormones & Skin-Fold Darkening</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Two genuinely different causes get marketed together here. <strong>Frictional/mechanical hyperpigmentation</strong> — chronic, low-grade friction (tight clothing, repetitive rubbing, shaving) — is a real, distinct PIH trigger described in dermatology literature as "frictional melanosis."<Citation n={7} /> The mechanism is the same PIH pathway above, just triggered by repeated mechanical irritation.
      </p>

      <MedicalSignal title="Worth a physician visit, not just cosmetic treatment">
        Dark, velvety, thickened patches at the neck, underarms, or groin can be <strong>acanthosis nigricans</strong> — a condition with a well-established evidence base linking it to insulin resistance, obesity, and type 2 diabetes.<Citation n={8} /> High circulating insulin binds IGF-1 receptors in skin, driving epidermal overgrowth and melanin production — a genuine metabolic signal, not just a pigmentation issue.<Citation n={9} /> One study of overweight adolescents found its presence alone predicted hyperinsulinemia and insulin resistance in a meaningful share of those screened.<Citation n={10} /> The distinguishing feature is <strong>texture, not just color</strong>: these patches are thickened and velvety, not just darker. If skin-fold darkening comes with a textural change, raise it with a physician — it can be the first visible sign of undiagnosed insulin resistance, well before other symptoms appear.
      </MedicalSignal>

      <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
        For simple friction-related darkening: reduce the mechanical trigger plus the same PIH-appropriate topicals discussed above. For acanthosis nigricans specifically: the evidence-based approach addresses the underlying metabolic driver — topicals may modestly improve appearance but don't address the cause.<Citation n={9} />
      </p>

      <SectionHeading>When to See a Professional</SectionHeading>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
        This page's home-treatment guidance does <strong>not</strong> apply to: a pigmented spot that's new, asymmetric, has irregular borders, multiple colors, or is changing in size/shape/color; any spot that bleeds, itches persistently, or is newly raised/textured; neck/underarm/groin darkening with a velvety texture change, especially alongside unexplained weight changes or fatigue; or pigmentation that doesn't fit cleanly into the patterns above. These are triage signals, not a diagnosis — only a clinician examining the skin directly can determine what a specific spot actually is.
      </p>

      <SectionHeading>Common Misconceptions</SectionHeading>
      <MythFact
        myth="Melasma, PIH, and 'dark spots' generally are all basically the same thing and respond to the same treatments."
        fact="These are mechanistically distinct — melasma is hormone/light-driven and chronic-relapsing; PIH is a direct reaction to a specific prior injury; friction-based darkening and acanthosis nigricans are mechanically or metabolically driven respectively. Treatment that works well for one may underperform for another."
      />

      <SectionHeading>Research Gaps</SectionHeading>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: colors.ink }}>
        PIH treatment in skin of color is the clearest stated gap — the cited systematic review explicitly calls for more effective interventions for this population. Melasma's relapse mechanism remains incompletely understood. Visible-light protection standards are less standardized and less consumer-familiar than UV protection — there's no universal "visible light protection factor" equivalent to SPF, a real gap between what research shows matters and what's easy for a consumer to act on.
      </p>

      <ClinicalBottomLine>
        Melasma, PIH, and friction/hormonal skin-fold darkening are mechanistically distinct and need different evidence-based approaches: melasma needs aggressive UV-and-visible-light protection plus topical depigmenting agents; PIH needs treatment of the underlying inflammatory trigger and honestly-set expectations, given inconsistent efficacy across treatments in skin of color; friction-based darkening responds to reducing mechanical triggers plus standard pigmentation actives. Acanthosis nigricans — velvety, thickened darkening at the neck or skin folds — is the one pattern here that's a genuine medical signal worth a physician visit, not just a cosmetic concern.
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ['Will my melasma go away if I just stay out of the sun completely?', "Sun and visible-light avoidance is the single most important controllable factor, but melasma's hormonal and genetic components mean some patients see persistent or recurring pigmentation even with excellent protection — a chronic-relapsing condition for many, not something that resolves once and stays resolved."],
          ['Does sunscreen help with PIH the way it helps with melasma?', "Yes — sun exposure can darken existing PIH and slow fading, so daily sunscreen is supportive even though PIH itself isn't primarily sun-triggered the way melasma is."],
          ['I have dark, slightly raised, velvety patches on my neck — is this something to worry about?', "Worth mentioning to a physician — this pattern (acanthosis nigricans) has a well-documented association with insulin resistance and diabetes risk. Not an emergency, but a genuinely useful early signal worth checking rather than just treating cosmetically."],
          ['Why does this page seem more cautious about PIH treatment than other sources I\'ve seen?', "Because the most rigorous available evidence (a systematic review specifically in skin of color) found a real lack of robust efficacy across treatments studied — this page reflects that finding directly rather than the more optimistic framing common in product marketing."],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>

      <SectionHeading>References</SectionHeading>
      <div style={{ fontSize: 12.5, color: colors.inkSoft, lineHeight: 1.8, fontFamily: fontMono }}>
        {[
          'Melasma: Background, Pathophysiology, Etiology. Medscape clinical reference. Tier 8.',
          'Targeting Melasma: Innovations in Pigment Deposition and Photoaging in Cosmetic Dermatology. PMC, 2025. Tier 8.',
          'Update on Melasma — Part I: Pathogenesis. PMC, 2022. Tier 8.',
          'What Is Post Inflammatory Hyperpigmentation (PIH)? Clinical patient-education source. Tier 8.',
          'How to Treat Post-Inflammatory Hyperpigmentation. Distinguishes epidermal vs. dermal PIH. Tier 8.',
          'Treatment of Post-Inflammatory Hyperpigmentation in Skin of Colour: A Systematic Review. Tier 2 — key finding: lack of robust efficacy across modalities.',
          'Pigmented Allergic Salute Sign in an Adult With Dark Skin: Clinical and Dermoscopic Features. Case report. Tier 8 (mechanism illustration only).',
          'Acanthosis Nigricans - StatPearls, NCBI Bookshelf, NIH. Tier 1.',
          'The underlying pathogenesis of obesity-associated acanthosis nigricans: a literature review. Discover Medicine/Springer Nature, 2024. Tier 8.',
          'Acanthosis nigricans as a clinical marker of insulin resistance among overweight adolescents. PMC, n=139. Tier 4.',
        ].map((ref, i) => (
          <div key={i} style={{ marginBottom: 6 }}>[{i + 1}] {ref}</div>
        ))}
        <div style={{ marginTop: 12, fontStyle: 'italic', color: colors.inkSoft }}>
          Source-quality note (Phase 2 §3-4): Numerous PIH and pigmentation product-brand blog posts were excluded — they repeated accurate mechanism descriptions but presented treatment efficacy more optimistically than the systematic review evidence supports.
        </div>
      </div>
    </article>
  );
}

// ============================================================
// FITZPATRICK REFERENCE TABLE — descriptive, not diagnostic
// ============================================================
function FitzpatrickTable() {
  const rows = [
    { type: 'I', desc: 'Very fair, often red/blond hair, blue/green eyes', uv: 'Always burns, never tans' },
    { type: 'II', desc: 'Fair skin, light eyes/hair', uv: 'Burns easily, tans minimally' },
    { type: 'III', desc: 'Medium skin, darker hair', uv: 'Burns moderately, tans gradually' },
    { type: 'IV', desc: 'Olive/light brown skin', uv: 'Rarely burns, tans easily' },
    { type: 'V', desc: 'Brown skin', uv: 'Very rarely burns, tans very easily' },
    { type: 'VI', desc: 'Deeply pigmented dark brown to black skin', uv: 'Never burns, tans deeply' },
  ];
  return (
    <div style={{ overflowX: 'auto', border: `1px solid ${colors.line}`, borderRadius: 10, margin: '16px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
        <thead>
          <tr style={{ background: colors.bgAlt, textAlign: 'left' }}>
            {['Type', 'Typical Description', 'UV Response'].map(h => (
              <th key={h} style={{ padding: '10px 14px', fontFamily: fontMono, fontSize: 10.5, color: colors.inkSoft, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: `1px solid ${colors.line}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.type} style={{ background: i % 2 === 0 ? colors.white : colors.bg }}>
              <td style={{ padding: '10px 14px', fontFamily: fontDisplay, fontWeight: 700, color: colors.accent }}>{r.type}</td>
              <td style={{ padding: '10px 14px', color: colors.ink }}>{r.desc}</td>
              <td style={{ padding: '10px 14px', color: colors.inkSoft }}>{r.uv}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: '10px 14px', fontSize: 12, color: colors.inkSoft, fontStyle: 'italic', borderTop: `1px solid ${colors.line}` }}>
        Self-reported UV burn/tan response — not a measure of race or ethnicity. See limitations discussed above before using this table to self-categorize.
      </div>
    </div>
  );
}

// ============================================================
// AGE, GENETICS & SKIN TYPE — FULL PAGE
// ============================================================
function GeneticsPage() {
  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 11 OF 16 · PERSONALIZE</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>Age, Genetics & Skin Type</h1>
      <div style={{ fontSize: 15.5, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640 }}>
        How genetics and skin type genuinely influence aging and procedure selection — and where the field's most-used classification tool has real, documented limitations worth understanding.
      </div>

      <QuickTakeaway>
        The Fitzpatrick scale was designed in 1975 to predict sunburn risk and guide UV phototherapy dosing — <strong>not</strong> as a measure of race or ethnicity. A documented pattern of clinical misuse treats it as a race/ethnicity proxy anyway. Specific, well-characterized genes account for a large share of population-level pigmentation variation — genuine science, not a basis for stereotyping. <strong>Skin of color carries a real, measurably higher risk</strong> of certain procedure complications with specific devices — the legitimate clinical reason individualized selection matters.
      </QuickTakeaway>

      <SectionHeading>The Fitzpatrick Scale: What It Measures, and What It Doesn't</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        The Fitzpatrick scale was developed in 1975 by Harvard dermatologist Thomas B. Fitzpatrick, originally to assess how skin reacts to UV light — specifically to predict sunburn risk and calculate safe UV dosing for phototherapy.<Citation n={3} /> It classifies skin into six types by burn/tan response:
      </p>
      <FitzpatrickTable />

      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink, marginTop: 16 }}>
        For its original, narrow purpose, the scale remains genuinely useful: it informs sun-protection counseling and — most concretely here — guides laser and energy-device parameter selection.<Citation n={4} />
      </p>

      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        But the scale has well-documented limitations dermatology's own literature openly discusses. It was validated predominantly in light-skinned populations, and its burn/tan focus doesn't fully capture melanin-rich skin's photobiology.<Citation n={1} /> More seriously: a 2024 study found a patient's race significantly predicted discrepancies between how providers and patients described the same patient's Fitzpatrick type — real evidence of subjective bias in a tool meant to be objective.<Citation n={2} /> Separately, surveys suggest roughly <strong>one-third of academic dermatologists and trainees erroneously use Fitzpatrick type as a race descriptor</strong> in clinical documentation — a use the scale was never designed for.<Citation n={2} /></p>

      <MythFact
        myth="Fitzpatrick skin type is a reliable way to describe or infer someone's race or ethnicity."
        fact="This is a documented clinical misuse, not a legitimate function of the scale. It measures self-reported UV burn/tan response — a real but narrow physiological trait — not ancestry or ethnicity. Dermatology literature explicitly warns against this conflation; the same person can be inconsistently categorized depending on who's assessing them."
      />

      <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
        Newer tools aim to fix this. The <strong>Monk Skin Tone scale</strong> — a 10-tone, open-source scale adopted by major tech companies for AI applications — shows stronger correlation with objective measurement in darker skin tones, outperforming Fitzpatrick-based classification in at least one comparison.<Citation n={6} /> Objective instrumental methods (reflectance spectrophotometry, CIELAB-derived measures) are also emerging as bias-resistant alternatives, though cost and accessibility remain real barriers to routine clinical adoption.<Citation n={5} /><Citation n={7} /></p>

      <SectionHeading>Genetics: What the Science Actually Shows</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Human pigmentation variation has real, well-characterized genetic explanations. <strong>MC1R</strong> loss-of-function variants favor pheomelanin production and are prevalent in European populations, linked to lighter skin, red hair, and heightened UV susceptibility.<Citation n={8} /> <strong>SLC24A5</strong> is one of the most significant single contributors to pigmentation variation — one well-studied variant accounts for roughly 25–38% of the European-African pigmentation difference, and separately explains about 27% of variation within a directly-studied South Asian cohort (n=1,228).<Citation n={9} /><Citation n={10} /> Combined multi-gene models explain roughly 45-52% of pigmentation variance in some studied populations.<Citation n={11} /></p>

      <ClinicalPearl>
        Lighter pigmentation arose independently, through different genetic mechanisms, in European and East Asian populations — a textbook example of convergent evolution. Natural selection reached a broadly similar visible outcome via different genetic routes in different lineages.<Citation n={8} /> Population-level pigmentation difference is the product of geography-driven selection acting independently — not a single linear scale from "more" to "less" of anything.
      </ClinicalPearl>

      <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
        Even where these population-level patterns are real and well-documented, variation <em>within</em> any population is substantial — an individual's specific genetics, sun history, and skin behavior should drive their personal decisions, not assumptions based on population averages.
      </p>

      <SectionHeading>Procedure & Device Selection: Where Skin Type Is a Genuine Clinical Variable</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        This is where Fitzpatrick-type information remains directly relevant — not as a social category, but as a real input into device safety. Lasers targeting pigment can't fully distinguish between the pigment in a lesion and pigment naturally present throughout melanin-rich skin, raising risk of unintended thermal injury.<Citation n={12} /> Specific, well-documented risks:
      </p>
      <ul style={{ fontSize: 15, lineHeight: 1.8, color: colors.ink, paddingLeft: 20 }}>
        <li><strong>PIH</strong> — risk of dyspigmentation after laser is highest in Fitzpatrick III–VI.<Citation n={13} /> (See Hyperpigmentation for mechanism.)</li>
        <li><strong>Keloid/hypertrophic scarring</strong> — skin of color is estimated <strong>3 to 18 times more vulnerable</strong> to keloid formation post-procedure.<Citation n={14} /></li>
        <li><strong>Hypopigmentation</strong> — less common, harder to treat, less likely to self-resolve; melanocytes in darker skin show particular cold-sensitivity, a specific concern with cryotherapy.<Citation n={13} /><Citation n={14} /></li>
      </ul>

      <MedicalSignal title="Informed selection, not avoidance">
        Older lasers (1990s-era, optimized for lighter skin) genuinely carried higher risk for darker skin tones.<Citation n={12} /> Modern <strong>Nd:YAG lasers</strong>, with wavelengths suited to Fitzpatrick IV–VI, show substantially improved safety when used by experienced practitioners.<Citation n={12} /><Citation n={13} /> If you have melanin-rich skin and are considering laser or energy-based procedures, finding a practitioner with specific, demonstrated experience treating skin of color matters more than almost any other selection factor on this site. The risk is concentrated in mismatched device selection or inexperience — not an unavoidable property of darker skin itself.
      </MedicalSignal>

      <p style={{ fontSize: 14, lineHeight: 1.7, color: colors.inkSoft }}>
        A real evidence gap worth stating: for keloid scar treatment specifically, a clinical reference source notes there are <strong>no current published data addressing the effect of skin type on recurrence rates</strong> — the elevated baseline risk is well-documented, but comparative treatment effectiveness by skin type is less established.<Citation n={14} /></p>

      <SectionHeading>Common Misconceptions</SectionHeading>
      <MythFact
        myth='Lighter skin types are simply "more sensitive" while darker skin types are uniformly "tougher" or more resilient to procedures.'
        fact="Each skin type carries its own different risk profile — lighter types generally show higher UV-burn sensitivity and certain skin cancer risk patterns; darker types generally show higher risk of PIH and keloid scarring from procedures. Neither is simply better or worse — they're different profiles requiring different precautions."
      />
      <MythFact
        myth="Avoiding laser/energy-based procedures entirely is the safest choice for melanin-rich skin."
        fact="Modern devices combined with an experienced practitioner substantially mitigate the elevated risks. The evidence-based response to elevated risk is informed, specific device and practitioner selection — not blanket avoidance."
      />

      <SectionHeading>Research Gaps</SectionHeading>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: colors.ink }}>
        A validated, widely-adopted, bias-resistant replacement for the Fitzpatrick scale doesn't yet exist in routine practice, despite clear calls for one from dermatology literature itself. Keloid scar treatment outcomes by skin type specifically lack published comparative data, despite well-established elevated baseline risk. Self-vs-provider Fitzpatrick discrepancy research remains limited to small, single-site studies — broader replication would strengthen confidence in how widespread this bias pattern actually is.
      </p>

      <ClinicalBottomLine>
        The Fitzpatrick scale remains genuinely useful for its original purpose — particularly selecting safe laser parameters — but has well-documented limitations and a real pattern of clinical misuse as an informal race/ethnicity proxy, which dermatology's own literature explicitly warns against. Population-level pigmentation differences have real, well-characterized genetic explanations shaped by convergent evolution — solid science that should inform understanding, not stereotyping. The actionable takeaway: melanin-rich skin carries measurably higher risk of specific procedure complications, and the evidence-based response is informed device and practitioner selection, not avoidance — individual variation within any skin type consistently exceeds average differences between groups.
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ['How do I find out my Fitzpatrick type, and does it really matter?', "It matters specifically for procedure/device safety planning — a provider experienced with your skin type is better positioned to determine this through direct examination than a self-administered quiz, given the documented self-vs-provider discrepancy issues."],
          ["Why does this page spend so much time on the Fitzpatrick scale's limitations?", "Because dermatology's own peer-reviewed literature does the same thing — these limitations are the documented, mainstream clinical consensus, not a fringe position."],
          ['Is darker skin "harder to treat" for aesthetic procedures?', "Not categorically — it has a different risk profile (higher PIH/keloid risk with certain devices) requiring different technology and practitioner experience, not an absence of safe options."],
          ['Does genetics mean my skin aging is basically predetermined?', "No — see The Science of Aging for the genetics-vs-lifestyle heritability data. Genetics explain a meaningful but partial share (roughly 40-60% depending on the trait) of variation, leaving substantial room for environmental and lifestyle factors."],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>

      <SectionHeading>References</SectionHeading>
      <div style={{ fontSize: 12.5, color: colors.inkSoft, lineHeight: 1.8, fontFamily: fontMono }}>
        {[
          'Understanding the Fitzpatrick Scale: Skin Typing, Limitations & Inclusive Alternatives. Clinical-education source. Tier 8.',
          'Fitzpatrick Skin Type Self Reporting Versus Provider Reporting: A Single-center, Survey-based Study. JCAD, 2024-2025. Tier 6.',
          'Fitzpatrick Skin Type Scale: Is It Accurate for Skin Cancer Risk? Citing original 1975/1988 publications. Tier 8.',
          'Integrating skin color assessments into clinical practice and research: A review of current approaches. JAAD, 2024. Tier 2.',
          'Skin Phototype Classification with Machine Learning Based on Broadband Optical Measurements. PMC/Sensors, 2024. Tier 7.',
          'The Efficacy of the Fitzpatrick Scale in Clinical Practice. PMC, 2025. Tier 8, discussing Monk Skin Tone scale validation.',
          'Beyond Fitzpatrick: AI-based skin tone analysis in dermatological patients. PMC, 2024. Tier 7.',
          'The Genetics and Evolution of Human Pigmentation. PMC/NIH, 2024. Tier 2.',
          'SLC24A5: exchanging genetic and biochemical knowledge. Quillen et al. Pigment Cell & Melanoma Research, 2008. Tier 7.',
          'The Light Skin Allele of SLC24A5 in South Asians and Europeans Shares Identity by Descent. PLOS Genetics, 2013, n=1,228. Tier 6.',
          'Gene Polymorphism and Human Pigmentation. US DOJ forensic genetics report, three-SNP predictive models. Tier 7.',
          'Laser Treatment for Skin of Color: Is It Safe? Clinical-education source. Tier 8.',
          'Laser Complications. StatPearls, NCBI Bookshelf, NIH. Tier 1.',
          'Management of Scars in Skin of Color. Textbook on Scar Management, NCBI Bookshelf. Tier 8 — source of the 3-18x keloid risk figure and the no-published-data note on skin-type-specific recurrence.',
        ].map((ref, i) => (
          <div key={i} style={{ marginBottom: 6 }}>[{i + 1}] {ref}</div>
        ))}
        <div style={{ marginTop: 12, fontStyle: 'italic', color: colors.inkSoft }}>
          Source-quality note (Phase 2 §3-4): Several laser-clinic marketing pages were found discussing skin-of-color laser safety and were generally consistent with the clinical references above on mechanism, though more promotional regarding their own services — StatPearls/NCBI Bookshelf sources were prioritized as governing references for risk-rate claims.
        </div>
      </div>
    </article>
  );
}

// ============================================================
// EXERCISE & BODY COMPOSITION — FULL PAGE
// ============================================================
function ExercisePage() {
  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 4 OF 16 · FOUNDATIONS</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>Exercise & Body Composition</h1>
      <div style={{ fontSize: 15.5, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640 }}>
        How muscle and body composition genuinely affect skin appearance, and what the evidence actually shows about loose skin after weight loss.
      </div>

      <QuickTakeaway>
        <strong>Resistance training has real, RCT-measured effects on skin</strong> — not just muscle. A 16-week trial found resistance training specifically increased dermal thickness, something aerobic exercise alone didn't achieve in the same study. Loose skin after weight loss has real histological causes — biopsy studies consistently show disorganized collagen and fragmented elastic fibers. Rate of weight loss plausibly matters, but the strongest evidence is about duration and amount carried, not rate specifically. Exercise cannot remove excess skin — it can improve the tissue underneath it.
      </QuickTakeaway>

      <SectionHeading>Why Muscle Makes Skin Appear Tighter</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        A 2023 study in <em>Scientific Reports</em> directly compared aerobic training (AT) and resistance training (RT) head-to-head in 56 previously sedentary middle-aged women over 16 weeks.<Citation n={1} /> Both significantly improved skin elasticity and upper dermal structure. But <strong>resistance training specifically increased dermal thickness — aerobic training did not</strong>, despite both improving elasticity.<Citation n={1} /> At the cellular level, resistance training reduced circulating inflammatory factors and increased dermal extracellular matrix gene expression (specifically dermal biglycan) in fibroblasts — a distinct mechanism from aerobic exercise's skin benefits.<Citation n={1} /></p>
      <ClinicalPearl>
        Muscle doesn't simply "fill out" skin like a balloon being inflated. Resistance training appears to trigger active dermal remodeling — thicker, more structurally robust dermis — mechanistically distinct from, and additive to, aerobic exercise's separate skin benefits. If skin firmness specifically is the goal, this trial suggests resistance training deserves a place in the routine, not just cardio.
      </ClinicalPearl>

      <SectionHeading>Loose Skin After Weight Loss</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        This isn't a vague phenomenon — it's been directly studied via skin biopsy, with a consistent histological picture across independent studies. Multiple biopsy-based studies of patients before and after massive weight loss have found measurable disorganization of collagen fibers and fragmentation of elastic fibers in the dermis.<Citation n={2} /><Citation n={3} /> One study of 33 patients found significant epidermal thickness changes alongside collagen disorganization one year after surgery.<Citation n={3} /> A larger comparative study (80 biopsies) found skin from surgical massive-weight-loss patients showed significantly lower collagen fiber fractions than skin from people who never had obesity (46-48% vs. 53-59%, depending on region) — a substantial, biopsy-confirmed structural difference.<Citation n={4} /></p>

      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        The most directly studied predictors of skin laxity outcome are <strong>duration of excess weight carried</strong> and <strong>total amount lost</strong> — both with biopsy-based support.<Citation n={5} /> Age at time of weight change matters too, since baseline elastic recoil declines with age independent of weight history.
      </p>

      <MythFact
        myth='The relationship between rate of weight loss and loose skin is settled, precisely-quantified science.'
        fact="The mechanistic story (gradual loss allows more time for dermal remodeling) is plausible and consistent with known collagen/elastin biology, but no source reviewed for this page provided a controlled study isolating rate of loss as an independent variable from total amount lost and duration carried — the two factors with the most direct biopsy-based support. Treat 'lose weight gradually' as reasonable, biologically plausible guidance, not as precisely established as the duration/amount findings."
      />

      <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
        A current, genuinely relevant consideration: <strong>GLP-1 medications</strong> (semaglutide, tirzepatide, and similar) can produce substantial weight reduction over months — faster than most diet-based loss, generally less abrupt than surgical massive weight loss.<Citation n={6} /> Since skin remodeling operates on a timescale of years, a meaningful gap can open between how fast fat volume is lost and how fast skin can structurally adapt — consistent with the mechanism above, though dedicated published research specifically on GLP-1-associated skin changes is still emerging rather than established.
      </p>

      <SectionHeading>What Exercise Can and Cannot Do About Existing Loose Skin</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        <strong>Exercise cannot remove excess, already-loose skin.</strong> Resistance training can improve the muscle and tissue underneath loose skin — meaningfully improving appearance, comfort, and function — but this works through a different mechanism than skin retraction itself, and doesn't reduce excess skin volume the way surgical removal does.<Citation n={7} /> For functionally significant skin laxity (rashes, chafing, mobility limitation), body contouring procedures are the direct solution — see Cosmetic Procedures.<Citation n={7} /></p>

      <SectionHeading>Common Misconceptions</SectionHeading>
      <MythFact
        myth="Building muscle 'fills out' loose skin the way air fills a balloon."
        fact="The actual mechanism is more interesting: resistance training appears to trigger active dermal remodeling rather than simply pushing skin outward from underneath. This is also why resistance training can't fully substitute for skin removal in significant existing excess skin — building tissue underneath and structurally remodeling the dermis are related but distinct processes."
      />

      <SectionHeading>Research Gaps</SectionHeading>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: colors.ink }}>
        Rate of weight loss as an isolated variable is the clearest gap on this page — most available evidence studies duration and total amount, while rate is commonly asserted but not independently isolated. GLP-1-medication-specific skin outcomes are an emerging area without the dedicated histological base bariatric surgery already has. Resistance training's skin benefit rests on one well-designed trial (n=56, Japanese women specifically) — genuinely good evidence, but would benefit from independent replication before being treated as definitively generalizable.
      </p>

      <ClinicalBottomLine>
        Resistance training has real, RCT-measured benefits for skin — specifically increasing dermal thickness through active extracellular matrix remodeling, distinct from aerobic exercise's separate elasticity benefits — making a combined training approach the best-supported recommendation. Loose skin after weight loss has a well-documented histological basis, most directly tied to duration of excess weight carried and total amount lost; rate of weight loss is plausible but less directly isolated in controlled research. Exercise can meaningfully improve the tissue underneath loose skin but cannot remove existing excess skin — that requires a different approach, covered on Cosmetic Procedures.
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ['Will lifting weights get rid of my loose skin?', "Not directly — it can improve the muscle tissue underneath and may meaningfully improve appearance and comfort, but it works through a different mechanism than removing excess skin. See Cosmetic Procedures for direct skin-removal options."],
          ['Is it true that losing weight slowly prevents loose skin?', "It's reasonable, biologically plausible practice, but the most directly-studied predictors are how long you carried excess weight and how much you lost in total — not rate specifically, which is less directly isolated in the research reviewed."],
          ['Should I worry about loose skin if I\'m using a GLP-1 medication?', "It's a reasonable consideration given how quickly these medications can produce weight loss relative to skin's multi-year remodeling timescale, though dedicated research on this specific medication class is still emerging."],
          ['Does cardio or weights matter more for skin appearance?', "Based on the one well-designed head-to-head trial available, they appear to do somewhat different things — both improve elasticity, but resistance training specifically increased dermal thickness in a way aerobic training didn't in the same study. A combined approach is best-supported."],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>

      <SectionHeading>References</SectionHeading>
      <div style={{ fontSize: 12.5, color: colors.inkSoft, lineHeight: 1.8, fontFamily: fontMono }}>
        {[
          'Resistance training rejuvenates aging skin by reducing circulating inflammatory factors and enhancing dermal extracellular matrices. Scientific Reports, 2023. RCT, n=56, 16-week intervention. Tier 3.',
          'Histological Changes in Skin and Subcutaneous Cellular Tissue in Patients with Massive Weight Loss After Bariatric Surgery. Aesthetic Plastic Surgery, 2024. n=9, paired biopsies. Tier 7.',
          'Histological Skin Assessment of Patients Submitted to Bariatric Surgery: A Prospective Longitudinal Cohort Study. Obesity Surgery. n=33, paired biopsies. Tier 4.',
          'Comparison of Histological Skin Changes After Massive Weight Loss in Post-bariatric and Non-bariatric Patients. Obesity Surgery, 2024. n=80 biopsies. Tier 4.',
          'Skin Changes Due to Massive Weight Loss: Histological Changes and the Causes of the Limited Results of Contouring Surgeries. Obesity Surgery, 2020. n=40. Tier 5.',
          'General clinical characterization of GLP-1 receptor agonist weight-loss timelines, consistent across multiple clinical-education sources. Tier 8.',
          'Mental and Physical Impact of Body Contouring Procedures on Post-Bariatric Surgery Patients. PMC. Tier 6.',
        ].map((ref, i) => (
          <div key={i} style={{ marginBottom: 6 }}>[{i + 1}] {ref}</div>
        ))}
        <div style={{ marginTop: 12, fontStyle: 'italic', color: colors.inkSoft }}>
          Source-quality note (Phase 2 §3-4): Numerous weight-loss-clinic and skin-tightening-product blog posts asserted a more precisely causal relationship between rate of loss specifically and outcome than the underlying cited studies (mostly about duration/amount) actually support. Primary biopsy-based studies were prioritized accordingly.
        </div>
      </div>
    </article>
  );
}

// ============================================================
// MODIFIABLE VS NON-MODIFIABLE TABLE
// ============================================================
function ModifiableTable() {
  const rows = [
    { factor: 'UV/photoaging exposure', type: 'Modifiable', note: 'The single largest extrinsic factor — see Lifestyle for sunscreen RCT evidence' },
    { factor: 'Smoking', type: 'Modifiable', note: 'Additive effect with UV on wrinkle formation' },
    { factor: 'Diet / glycation-related sugar intake', type: 'Modifiable', note: 'Influences AGE accumulation rate' },
    { factor: 'Sleep quality', type: 'Modifiable', note: 'Emerging evidence — see Lifestyle' },
    { factor: 'Genetic predisposition', type: 'Non-modifiable', note: '40-60% of variance in specific traits, depending on trait studied' },
    { factor: 'Chronological/intrinsic aging rate', type: 'Non-modifiable', note: 'Baseline collagen decline happens regardless of environment' },
    { factor: 'Telomere baseline length', type: 'Non-modifiable', note: 'Set substantially by genetics; shortens with each cell division regardless' },
    { factor: 'Hormonal decline timing (e.g., menopause)', type: 'Partially modifiable', note: 'Timing is largely biological; some management options exist medically' },
  ];
  return (
    <div style={{ overflowX: 'auto', border: `1px solid ${colors.line}`, borderRadius: 10, margin: '16px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
        <thead>
          <tr style={{ background: colors.bgAlt, textAlign: 'left' }}>
            {['Factor', 'Category', 'Note'].map(h => (
              <th key={h} style={{ padding: '10px 14px', fontFamily: fontMono, fontSize: 10.5, color: colors.inkSoft, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: `1px solid ${colors.line}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.factor} style={{ background: i % 2 === 0 ? colors.white : colors.bg }}>
              <td style={{ padding: '10px 14px', color: colors.ink, fontWeight: 500 }}>{r.factor}</td>
              <td style={{ padding: '10px 14px' }}>
                <span style={{
                  fontFamily: fontMono, fontSize: 11, padding: '3px 8px', borderRadius: 12,
                  background: r.type === 'Modifiable' ? colors.accentSoft : r.type === 'Non-modifiable' ? colors.tierSoft : colors.bgAlt,
                  color: r.type === 'Modifiable' ? colors.accent : r.type === 'Non-modifiable' ? colors.tier : colors.inkSoft,
                }}>{r.type}</span>
              </td>
              <td style={{ padding: '10px 14px', color: colors.inkSoft, fontSize: 13 }}>{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// THE SCIENCE OF AGING — FULL PAGE
// ============================================================
function ScienceOfAgingPage() {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 2 OF 16 · FOUNDATIONS</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>The Science of Aging</h1>
      <div style={{ fontSize: 15.5, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640 }}>
        The mechanistic foundation every other page on this site refers back to — explained once, in plain language.
      </div>

      <QuickTakeaway>
        Skin aging has two broad causes: <strong>intrinsic aging</strong> (genetically-programmed, happens regardless of environment) and <strong>extrinsic aging</strong> (driven by environmental exposures, overwhelmingly UV — "photoaging"). At a cellular level, several distinct mechanisms — collagen/elastin breakdown, glycation, oxidative stress, and cellular senescence — interact and reinforce each other. Twin studies suggest <strong>genetics account for roughly 40–60%</strong> of the variation in specific aging traits between individuals — meaningful, but leaving plenty of room for the environmental and lifestyle factors this site focuses on.
      </QuickTakeaway>

      <SectionHeading>Intrinsic vs. Extrinsic Aging</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Dermatology distinguishes two aging processes happening simultaneously. <strong>Intrinsic aging</strong> is the natural, chronological process — in the dermis, characterized by atrophy from collagen loss, degeneration of the elastic fiber network, and loss of hydration.<Citation n={1} /> It happens even on skin never exposed to sun (e.g., inner-arm skin).
      </p>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        <strong>Extrinsic aging</strong> is environmentally caused, and since UV exposure dominates, it's usually called <strong>photoaging</strong>.<Citation n={1} /> Its microscopic hallmark is <strong>solar elastosis</strong> — a disorganized buildup of damaged elastic fibers in the upper-to-mid dermis. UV radiation actually triggers increased but defective elastin production, part of why photoaged skin looks different from purely chronologically-aged skin, not just "more of the same."<Citation n={1} /> Extrinsic aging tends to produce more dramatic visible changes than intrinsic aging alone.<Citation n={2} /></p>
      <ClinicalPearl>
        Comparing the inner upper arm to the face/neck/hands of the same person is a classic, low-tech way to see intrinsic vs. extrinsic aging side-by-side — the inner arm reflects mostly intrinsic aging; sun-exposed areas show the extrinsic component layered on top.
      </ClinicalPearl>

      <SectionHeading>Collagen and Elastin Breakdown</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Collagen and elastin both decline with age through different routes. <strong>Intrinsically</strong>, collagen density gradually decreases — particularly Type I and Type III — with the ratio shifting as Type III declines faster.<Citation n={3} /> <strong>Extrinsically (UV-driven)</strong>, the picture is more aggressive: UV activates <strong>matrix metalloproteinases (MMPs)</strong> that actively degrade existing collagen while suppressing new collagen production — a double hit.<Citation n={4} /> Elastin under UV doesn't simply degrade — its gene is abnormally activated, producing elastin that's improperly assembled, the molecular basis of solar elastosis.<Citation n={5} /></p>
      <p style={{ fontSize: 14, color: colors.inkSoft, fontStyle: 'italic' }}>This mechanism is directly why several well-evidenced skincare ingredients (retinoids, vitamin C, AHAs — see Skincare Ingredients) work the way they do: they inhibit MMP activity, stimulate new collagen synthesis, or both.</p>

      <SectionHeading>Glycation</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Glycation is a sugar-driven mechanism closely intertwined with oxidative stress. <strong>Advanced glycation end-products (AGEs)</strong> form when sugars react with proteins (including collagen) without enzymatic help.<Citation n={6} /> This happens naturally throughout life but accumulates because collagen turns over slowly — once glycated, it tends to stay that way.<Citation n={7} /> Counterintuitively, glycated collagen becomes <em>more</em> resistant to the body's normal repair/renewal enzymes, so instead of being replaced, it accumulates — stiffer, less functional.<Citation n={6} /> AGEs also bind cell receptors that further trigger oxidative stress and inflammation, making glycation and oxidative stress mutually reinforcing.<Citation n={6} /></p>

      <SectionHeading>Oxidative Stress</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Oxidative stress happens when reactive oxygen species (ROS / "free radicals") outpace skin's antioxidant defenses, generated both internally (cellular energy metabolism) and externally (UV is dominant; pollution and smoking contribute). ROS trigger the same MMP enzymes that degrade collagen, can damage DNA (including mitochondrial DNA), and directly contribute to glycation by accelerating sugar-protein reactions.<Citation n={6} /> This is the mechanistic basis for antioxidant skincare ingredients — though mechanistic plausibility and demonstrated clinical benefit aren't automatically the same thing (see Skincare Ingredients).
      </p>

      <button
        onClick={() => setAdvancedOpen(!advancedOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, background: colors.bgAlt, border: `1px solid ${colors.line}`,
          borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontFamily: fontBody, fontSize: 13.5, color: colors.accent, margin: '20px 0',
        }}
      >
        <span style={{ transform: advancedOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>▸</span>
        Advanced: Cellular Senescence — Telomeres & Mitochondria
      </button>
      {advancedOpen && (
        <div style={{ padding: '16px 20px', background: colors.white, border: `1px solid ${colors.line}`, borderRadius: 10, marginBottom: 20 }}>
          <p style={{ fontSize: 14.5, lineHeight: 1.7, color: colors.ink }}>
            At the cellular level, skin aging is driven substantially by <strong>cellular senescence</strong> — a state where cells permanently stop dividing but don't die. Senescent cells actively secrete inflammatory signaling molecules (the senescence-associated secretory phenotype, or SASP), damaging nearby healthy tissue and degrading the surrounding extracellular matrix — a relatively small number of senescent cells can have an outsized effect.<Citation n={8} /></p>
          <p style={{ fontSize: 14.5, lineHeight: 1.7, color: colors.ink }}>
            Two well-supported triggers drive cells into senescence: <strong>telomere shortening</strong> — protective chromosome-end caps that shorten with each division until the cell can no longer divide safely<Citation n={9} /> (UV exposure can accelerate this on top of the baseline rate<Citation n={10} />) — and <strong>mitochondrial dysfunction</strong> — mitochondria are a major source of internally-generated ROS, and UV exposure can damage mitochondrial DNA, impairing energy generation and creating a feedback loop with oxidative stress.<Citation n={10} /> Both pathways converge on fewer functional fibroblasts actively maintaining the dermis.
          </p>
        </div>
      )}

      <SectionHeading>Hormonal Aging</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Hormonal decline — most thoroughly studied around menopause and estrogen — has a measurable effect on skin. Estrogen supports fibroblast activity, collagen synthesis, hydration, and antioxidant defenses; as it declines, these supportive effects decline too, with a documented correlation between skin collagen content and thickness tracking menopausal status.<Citation n={11} /> Hormone therapy decisions involve risk/benefit considerations well outside cosmetic scope and are a decision for a physician, not a skincare choice.
      </p>

      <SectionHeading>What People Can and Cannot Realistically Change</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Twin studies — uniquely useful since identical twins share genetics but often differ in lifestyle — provide some of the best available evidence. One heritability analysis found <strong>41-60% of the variation</strong> in sun damage, wrinkling, wrinkle depth, and pigmented age spots was explained by genetic factors.<Citation n={12} /> A separate GWAS found similar ranges: roughly 55% for facial wrinkling, 41% for pigmented spots, 61% for sagging eyelids.<Citation n={13} /></p>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        That leaves a meaningful, genuinely modifiable share — roughly 40-60% depending on the trait — attributable to non-genetic factors. This is the part lifestyle and skincare interventions can act on, and it's large enough to be worth real effort.
      </p>

      <MythFact
        myth='A widely-cited "identical twins" study proves lifestyle matters far more than genetics for skin aging.'
        fact="That study (Guyuron et al., 2009) measured something different than the heritability studies above: it compared perceived age differences between twin pairs correlated with lifestyle factors, rather than calculating what share of total population variation is genetic. Both are legitimate, but they answer different questions — conflating them (as much secondary coverage does) overstates how much genetics can be 'overridden.'"
      />

      <ModifiableTable />

      <SectionHeading>Common Misconceptions</SectionHeading>
      <MythFact
        myth='Skin aging is basically just "running out" of collagen, like a tank emptying.'
        fact="It's more accurate to think of it as a shifting balance between collagen breakdown and synthesis, with multiple mechanisms (UV-driven MMP activity, glycation, oxidative stress, senescence) all pushing that balance toward more breakdown over time — not a single depleting resource."
      />
      <MythFact
        myth='If something is "genetic," there is nothing you can do about it.'
        fact="Even traits with substantial heritability (40-60% for several measures) still leave a large modifiable share. Genetic predisposition affects your starting point and trajectory, not a fixed, unchangeable outcome."
      />

      <SectionHeading>Research Gaps</SectionHeading>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: colors.ink }}>
        Precisely how glycation, oxidative stress, senescence, and hormonal decline interact and reinforce each other is an active research area — the relative weighting of each in a typical person's visible aging isn't precisely quantified. Telomere length is mechanistically well-supported as a marker of cellular aging, but claims about directly lengthening telomeres for cosmetic benefit substantially outpace controlled human evidence. The precise modifiable share of skin aging varies by which specific trait is measured — there isn't one single genetics-vs-lifestyle percentage for skin aging as a whole.
      </p>

      <ClinicalBottomLine>
        Skin aging results from genetically-programmed intrinsic aging and environmentally-driven extrinsic aging (overwhelmingly UV-driven), operating through interconnected mechanisms: collagen/elastin breakdown, glycation, oxidative stress, and cellular senescence, with hormonal decline adding a further well-documented layer. Twin studies suggest genetics explain roughly 40-60% of the variation in specific visible aging traits — substantial, but leaving a meaningful, real share open to the environmental and lifestyle modification covered throughout the rest of this site.
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ['Is photoaging reversible?', "Partially. Some signs (fine lines, some pigmentation, texture) can improve meaningfully with consistent intervention (see Skincare Ingredients, Device Therapy); deeper structural changes are harder to fully reverse topically and may need procedural intervention (see Cosmetic Procedures)."],
          ['Does stress actually age your skin?', "There's a plausible mechanistic link, covered in more depth with the actual human evidence on the Lifestyle page rather than here, since this page focuses on mechanism."],
          ['If my parents aged a certain way, will I age the same way?', "There's a real genetic component (40-60% of variance in several traits), so family patterns are a meaningful signal — but not a guarantee, given the substantial modifiable share and differing environmental exposures."],
          ["What's the single most important thing to remember from this page?", "That \"aging\" isn't one process — it's several distinct, interacting mechanisms, which is why no single ingredient or product addresses everything, and why this site evaluates interventions mechanism-by-mechanism."],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>

      <SectionHeading>References</SectionHeading>
      <div style={{ fontSize: 12.5, color: colors.inkSoft, lineHeight: 1.8, fontFamily: fontMono }}>
        {[
          'Uitto J. The role of elastin and collagen in cutaneous aging: intrinsic aging versus photoexposure. Journal of Drugs in Dermatology, 2008;7(2 Suppl):s12-6. Tier 8.',
          'Fighting against Skin Aging: The Way from Bench to Bedside. Narrative review. Tier 8.',
          'Enhancing dermal collagen density towards youthfulness — Type I/III collagen ratio discussion. Tier 7 (mechanism only).',
          'Multiple sources consistent on UV/MMP/procollagen mechanism. Signs of skin aging: a review, Intl J Research in Medical Sciences, 2024. Tier 8.',
          'Elastin structure and its involvement in skin photoageing. PubMed review. Tier 8.',
          'Wang et al. The effects of advanced glycation end-products on skin and potential anti-glycation strategies. Experimental Dermatology, 2024. Tier 8.',
          'Advanced Glycation End Products in the Skin: Molecular Mechanisms, Methods of Measurement, and Inhibitory Pathways. Frontiers, 2022. Tier 8.',
          'Skin senescence — from basic research to clinical practice. Frontiers in Medicine, 2024. Tier 8.',
          'The role of cellular senescence in skin aging and age-related skin pathologies. Frontiers in Physiology, 2023. Tier 8.',
          'Mechanistic Insights on Skin ageing and Dermatologic Interventions to Slow Ageing Process. PMC, 2025. Tier 8.',
          'Influences on Skin and Intrinsic Aging: Biological, Environmental, and Therapeutic Insights. Hussein et al. Journal of Cosmetic Dermatology, 2025. Tier 8.',
          'Objective assessment of facial skin aging in Japanese monozygotic twins, citing Gunn et al. heritability analysis. PMC, 2014. Tier 4.',
          'Identification of New Biological Pathways Involved in Skin Aging From French Women Genome-Wide Data. Frontiers in Genetics, 2022, citing Gunn et al. 2009/Jacobs et al. 2014. Tier 4/GWAS.',
        ].map((ref, i) => (
          <div key={i} style={{ marginBottom: 6 }}>[{i + 1}] {ref}</div>
        ))}
        <div style={{ marginTop: 12, fontStyle: 'italic', color: colors.inkSoft }}>
          Source-quality note (Phase 2 §3-4): Several secondary sources discussing the Guyuron et al. twin study were excluded — they appeared on plastic-surgery-practice marketing pages with promotional framing. The underlying study is real and described directly above rather than through those secondary sources.
        </div>
      </div>
    </article>
  );
}

// ============================================================
// VERDICT STRIP — "does it work or is it marketing"
// ============================================================
function VerdictStrip() {
  const verdicts = [
    { name: 'Red/NIR Light (LED)', verdict: 'Real Evidence', color: colors.safetyGood },
    { name: 'RF Microneedling', verdict: 'Real, Funding Caveats', color: colors.safetyCaution },
    { name: 'HIFU/Ultrasound', verdict: 'Real Evidence', color: colors.safetyGood },
    { name: 'Microneedling (no RF)', verdict: 'Emerging', color: colors.safetyCaution },
    { name: 'Microcurrent', verdict: 'Mostly Marketing', color: colors.safetySig },
    { name: 'EMS (cosmetic claims)', verdict: 'Mostly Marketing', color: colors.safetySig },
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '16px 0' }}>
      {verdicts.map(v => (
        <div key={v.name} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
          border: `1px solid ${colors.line}`, borderRadius: 20, background: colors.white,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: v.color }} />
          <span style={{ fontSize: 13, color: colors.ink, fontWeight: 500 }}>{v.name}</span>
          <span style={{ fontSize: 11.5, color: colors.inkSoft, fontFamily: fontMono }}>· {v.verdict}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// DEVICE COMPARISON TABLE
// ============================================================
const deviceData = [
  { name: 'Red/Near-Infrared Light (LED)', evidence: 4, candidate: 'Most skin types, first-time device buyers', cost: 'Low (at-home) / Moderate (clinic)', risk: 'Minimal, atraumatic', schedule: '3-5x/week, ongoing' },
  { name: 'RF Microneedling', evidence: 3, candidate: 'Skin laxity/texture, all Fitzpatrick types w/ insulated tips', cost: 'Moderate-High (clinic per session)', risk: 'Transient redness/swelling; PIH risk if device mismatched', schedule: '1-3 sessions, repeat at 6-12mo' },
  { name: 'Microneedling (standalone)', evidence: 3, candidate: 'Acne scarring, general texture', cost: 'Low-Moderate', risk: 'Transient redness, mild discomfort', schedule: 'Monthly series' },
  { name: 'HIFU / Micro-focused Ultrasound', evidence: 4, candidate: 'Mild-moderate laxity (brow, submental/jawline)', cost: 'High (clinic per session)', risk: 'Moderate discomfort, transient erythema', schedule: '1 session, repeat at 12mo+' },
  { name: 'Microcurrent', evidence: 2, candidate: 'Low-stakes addition, not primary strategy', cost: 'Low-Moderate (at-home device)', risk: 'Minimal', schedule: 'Daily-weekly per device instructions' },
  { name: 'EMS (facial)', evidence: 2, candidate: 'Muscle toning interest, low-risk experimentation', cost: 'Low-Moderate (at-home device)', risk: 'Minimal; standard implant precautions', schedule: '2-4x/week per device instructions' },
];

function DeviceTable() {
  const [sortBy, setSortBy] = useState('evidence');
  const evidenceLabel = { 5: '★★★★★', 4: '★★★★', 3: '★★★', 2: '★★', 1: '★' };
  const sorted = useMemo(() => {
    const rows = [...deviceData];
    rows.sort((a, b) => sortBy === 'evidence' ? b.evidence - a.evidence : a.name.localeCompare(b.name));
    return rows;
  }, [sortBy]);

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{ display: 'flex', marginBottom: 12 }}>
        <button
          onClick={() => setSortBy(sortBy === 'evidence' ? 'name' : 'evidence')}
          style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer', border: `1px solid ${colors.line}`, background: colors.white, color: colors.inkSoft, fontFamily: fontBody }}
        >Sort: {sortBy === 'evidence' ? 'Evidence ↓' : 'A–Z'}</button>
      </div>
      <div style={{ overflowX: 'auto', border: `1px solid ${colors.line}`, borderRadius: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: colors.bgAlt, textAlign: 'left' }}>
              {['Device', 'Evidence', 'Best Candidate', 'Cost', 'Risk', 'Schedule'].map(h => (
                <th key={h} style={{ padding: '10px 14px', fontFamily: fontMono, fontSize: 10.5, color: colors.inkSoft, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: `1px solid ${colors.line}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.name} style={{ background: i % 2 === 0 ? colors.white : colors.bg }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: colors.ink, fontFamily: fontDisplay }}>{row.name}</td>
                <td style={{ padding: '10px 14px', color: colors.star, fontFamily: fontMono, fontWeight: 600 }}>{evidenceLabel[row.evidence]}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft, fontSize: 12.5 }}>{row.candidate}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft }}>{row.cost}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft, fontSize: 12.5 }}>{row.risk}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft, fontSize: 12.5 }}>{row.schedule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// AT-HOME VS PROFESSIONAL DECISION TREE
// ============================================================
function DeviceDecisionTree() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    { key: 'goal', q: 'What\'s your main goal?', options: [
      { label: 'General glow / low-risk entry point', value: 'general' },
      { label: 'Skin laxity / texture concerns', value: 'laxity' },
      { label: 'Just curious about muscle toning', value: 'toning' },
    ]},
    { key: 'budget', q: 'How much are you looking to spend?', options: [
      { label: 'Low — one-time at-home device', value: 'low' },
      { label: 'Higher — open to professional sessions', value: 'high' },
    ]},
  ];

  const result = useMemo(() => {
    if (!answers.goal || !answers.budget) return null;
    const { goal, budget } = answers;
    if (goal === 'general') return { name: 'At-home Red/NIR Light (LED)', why: 'Best independent-evidence-to-risk ratio on this page. Reasonable as a first device purchase regardless of budget tier.' };
    if (goal === 'laxity') return budget === 'high'
      ? { name: 'Professional RF Microneedling or HIFU', why: 'Real, measurable effects for laxity/texture — professional-grade intensity delivers a meaningfully larger effect than at-home equivalents. Seek a practitioner experienced with your Fitzpatrick type.' }
      : { name: 'At-home LED + topical retinoid (see Skincare Ingredients)', why: 'At-home RF/microneedling devices are intensity-limited — a real but smaller effect than clinic equivalents. Pairing LED with a well-evidenced topical may be a better low-budget combination.' };
    return { name: 'Microcurrent or EMS, framed as low-stakes experimentation', why: "Reasonable to try at low cost and low risk, but the evidence base doesn't support expecting dramatic muscle-toning or collagen-remodeling results." };
  }, [answers]);

  if (result) {
    return (
      <div style={{ background: colors.accentSoft, borderRadius: 10, padding: 24, margin: '20px 0' }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Suggested starting point</div>
        <div style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 600, color: colors.ink, marginBottom: 8 }}>{result.name}</div>
        <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6, marginBottom: 16 }}>{result.why}</div>
        <button onClick={() => setAnswers({})} style={{ background: 'none', border: `1px solid ${colors.accent}`, color: colors.accent, padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontFamily: fontBody, fontSize: 13 }}>Start over</button>
      </div>
    );
  }

  const current = questions[step] || questions[0];
  const currentStep = answers.goal ? 1 : 0;
  return (
    <div style={{ background: colors.accentSoft, borderRadius: 10, padding: 24, margin: '20px 0' }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
        At-home or professional? · Step {currentStep + 1} of 2
      </div>
      <div style={{ fontFamily: fontDisplay, fontSize: 19, fontWeight: 600, color: colors.ink, marginBottom: 16 }}>{questions[currentStep].q}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {questions[currentStep].options.map(opt => (
          <button key={opt.value} onClick={() => setAnswers(prev => ({ ...prev, [questions[currentStep].key]: opt.value }))}
            style={{ textAlign: 'left', padding: '12px 16px', background: colors.white, border: `1px solid ${colors.line}`, borderRadius: 8, cursor: 'pointer', fontFamily: fontBody, fontSize: 14.5, color: colors.ink }}
          >{opt.label}</button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// DEVICE THERAPY — FULL PAGE
// ============================================================
function DeviceTherapyPage() {
  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 7 OF 16 · TREATMENTS</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>Device Therapy</h1>
      <div style={{ fontSize: 15.5, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640 }}>
        At-home and professional skin devices, rated by independent evidence quality — and where a large share of the literature comes from the device manufacturers themselves.
      </div>

      <QuickTakeaway>
        <strong>Red/near-infrared light (LED) has the most genuinely independent, well-designed RCT evidence</strong> of any device category, including real split-face trials. <strong>RF microneedling has real, measurable effects</strong> (20–60% improvement in some outcomes), but a large share of supporting studies are non-randomized, small, or manufacturer-sponsored. <strong>Microcurrent has the weakest evidence on this page</strong> — even sources selling the devices admit the core mechanism lacks strong clinical support. <strong>HIFU has real systematic-review-level support</strong>, but investigator-rated scores (92%) run notably higher than patient-rated scores (42-53%) for the same treatment and timepoint.
      </QuickTakeaway>

      <SectionHeading>Does It Work, or Is It Marketing?</SectionHeading>
      <VerdictStrip />

      <SectionHeading>Red & Near-Infrared Light Therapy (LED / Photobiomodulation)</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        This category has the most genuinely independent trial support on this page. A well-designed split-face RCT recruited 137 women (40-65, Fitzpatrick II-IV) comparing red (660nm) vs. amber (590nm) LED at the same dose, finding measurable reduction in periocular wrinkle volume.<Citation n={1} /> A separate, frequently-cited RCT treated 136 subjects with combined 633nm/830nm light over 30 sessions across 15 weeks, finding significant improvements in skin complexion (91%), tone (87%), and a mean 29% increase in collagen density measured by ultrasound, with controls showing no significant change.<Citation n={2} /></p>
      <ClinicalPearl>
        Photobiomodulation is atraumatic — unlike most other devices on this page, which work specifically by causing controlled injury, light in the 600-1300nm range directly stimulates regenerative processes without an initial destructive step.<Citation n={3} /> This makes LED one of the more reasonable lower-risk entry points into device therapy, though expect gradual improvement over weeks, not a single-session transformation.
      </ClinicalPearl>

      <SectionHeading>Radiofrequency (RF) & RF Microneedling</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        RF microneedling combines mechanical microneedling with radiofrequency energy delivered into the dermis. A review found studies showing <strong>20-60% mean improvement</strong> in facial wrinkles, skin laxity, and textural roughness after one to three sessions, with effects beginning around 1 month and peaking around 3 months.<Citation n={4} /> A prospective study of fractional RF microneedling for the lower face/jawline/neck (n=30) found high patient satisfaction with low downtime.<Citation n={5} /></p>
      <MythFact
        myth="RF microneedling has the same level of independent, large-scale RCT support as something like topical tretinoin."
        fact="RF microneedling has real, mechanistically-plausible, measurably positive evidence — but a meaningful share of supporting studies are smaller, non-randomized, and manufacturer-affiliated. One frequently-cited periorbital wrinkle study was explicitly co-authored by employees of the device manufacturer. This is a different evidence profile than the multi-trial, independently-replicated evidence behind the strongest topical actives."
      />
      <p style={{ fontSize: 12.5, color: colors.inkSoft, fontFamily: fontMono, marginTop: -6 }}>Source: manufacturer-affiliated study, ref<Citation n={6} /></p>

      <SectionHeading>Microcurrent & EMS</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        This page rates microcurrent's evidence as the weakest of any device category reviewed. Its core proposed mechanism — sub-sensory current enhancing cellular ATP production to drive collagen synthesis — is described even by sources marketing microcurrent devices as having <strong>limited clinical evidence supporting this specific mechanism in at-home devices.</strong><Citation n={7} /> An independent evaluation specified what a genuinely convincing trial would require (100+ participants, sham-controlled, double-blind, 12+ weeks, blinded objective endpoint, isolated from co-treatments) — and noted this trial doesn't appear to exist yet.<Citation n={8} /></p>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
        <strong>EMS</strong> causes visible muscle contraction (unlike sub-sensory microcurrent) and has a more plausible mechanism for muscle toning specifically — but rigorous cosmetic-outcome trials remain similarly thin, and a fair comparison against structured facial exercise hasn't been done under blinded conditions.<Citation n={8} /></p>
      <MythFact
        myth="Microcurrent and EMS facial devices have multiple peer-reviewed studies proving they boost collagen and lift skin, the way the marketing often states."
        fact="Even brand-affiliated sources acknowledge the core collagen-boosting mechanism lacks strong clinical support in at-home devices, and no rigorous, blinded, sham-controlled trial isolating microcurrent's effect appears to have been published. This doesn't prove it doesn't work — it means the confident claims attached to it outpace the evidence considerably more than other devices reviewed here."
      />

      <SectionHeading>High-Intensity / Micro-Focused Ultrasound (HIFU / MFU)</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        HIFU has genuine systematic-review-level support, setting it apart from several other categories here. A systematic review pooling investigator-rated outcomes (n=337) found <strong>92% of patients demonstrated improvement</strong> at day 90, continuing for up to a year, with measurable brow-lift (0.47-1.7mm) and submental reduction (26-45mm²).<Citation n={9} /></p>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        The honest caveat: the same review's <strong>patient-reported</strong> scores (n=81) were notably more modest — 42% at 90 days, rising to 53% by 360 days — compared to the 92% investigator-rated figure over a similar window.<Citation n={9} /></p>
      <ClinicalPearl>
        When researching any device, check whether a quoted "improvement" statistic is investigator-rated or patient-rated — as the HIFU data shows directly, these can differ by a wide margin for the exact same treatment and timepoint.
      </ClinicalPearl>

      <SectionHeading>Device Comparison Table</SectionHeading>
      <DeviceTable />

      <SectionHeading>At-Home or Professional?</SectionHeading>
      <DeviceDecisionTree />

      <SectionHeading>Common Misconceptions</SectionHeading>
      <MythFact
        myth='If a device has "clinical studies," its evidence is comparable in strength to a well-evidenced topical ingredient or pharmaceutical.'
        fact='"Clinical studies exist" covers an enormous range of actual rigor — from genuine independent multi-site RCTs (much of the LED evidence) to small, single-arm, manufacturer-sponsored case series (a meaningful share of RF microneedling and microcurrent literature).'
      />

      <SectionHeading>Research Gaps</SectionHeading>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: colors.ink }}>
        Microcurrent specifically is the clearest gap on this page — no rigorous trial meeting basic standards appears to exist for the core cosmetic claims attached to it. HIFU's longer-term outcomes beyond one year are explicitly noted as an open question. Independent, non-manufacturer-funded replication of RF microneedling findings would meaningfully strengthen confidence in the real but currently industry-concentrated evidence base.
      </p>

      <ClinicalBottomLine>
        Red/near-infrared light therapy has the most genuinely independent RCT support on this page and the most favorable risk profile. RF microneedling and HIFU both have real, measurable effects for skin laxity and texture — HIFU with systematic-review-level support, though with a meaningful investigator-vs-patient rating gap — but a notable share of RF microneedling evidence comes from manufacturer-affiliated studies. Microcurrent and EMS have the thinnest evidence relative to their marketing claims. Professional devices generally deliver more intensity than at-home equivalents — not necessarily a difference in speed alone, but potentially in achievable effect.
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ['Is an at-home red light mask as good as in-office treatment?', 'Likely a smaller effect given lower output intensity, though the underlying mechanism — and a meaningful share of supporting RCTs — applies to at-home-intensity LED specifically, making this one of the more reasonably-supported at-home categories.'],
          ['Does RF microneedling hurt?', 'Studies report moderate, manageable discomfort with topical numbing, and notably low downtime.'],
          ['Are microcurrent facial devices a waste of money?', "Not necessarily — they're low-risk and low-cost relative to procedures — but the evidence doesn't support the dramatic collagen-boosting claims often attached to them."],
          ['How do I know if a device claim is trustworthy?', 'Check whether the cited study was independently funded or manufacturer-affiliated, whether it was randomized/controlled or a single-arm case series, and whether the outcome was investigator-rated or patient-rated.'],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>

      <SectionHeading>References</SectionHeading>
      <div style={{ fontSize: 12.5, color: colors.inkSoft, lineHeight: 1.8, fontFamily: fontMono }}>
        {[
          'Mota et al. Photobiomodulation Reduces Periocular Wrinkle Volume by 30%: A Randomized Controlled Trial. Photobiomodulation, Photomedicine, and Laser Surgery, 2023;41(2):48-56. Split-face RCT, n=137. Tier 3.',
          'Combined 633nm/830nm LED RCT, n=136, 30 sessions over 15 weeks. Tier 3.',
          'A Controlled Trial to Determine the Efficacy of Red and Near-Infrared Light Treatment. PMC. Tier 3, mechanism discussion.',
          "Transcutaneous Radiofrequency Microneedling in the Facial Plastic Surgeon's Practice: A Review. Facial Plastic Surgery & Aesthetic Medicine. Tier 8 narrative review (20-60% improvement range).",
          'Radiofrequency Microneedling for Skin Tightening of the Lower Face, Jawline, and Neck Region. n=30. Tier 7.',
          'Cheles, Vinshtok, Gershonowitz. Microneedling With RF-Assisted Skin Penetration. J Cosmetic Dermatology, 2024. n=24. Tier 7 — author affiliation includes device manufacturer (Pollogen Ltd).',
          'EMS vs Microcurrent Facial Devices: Complete Science-Backed Comparison. Device-brand-affiliated source. Tier 8/9.',
          'Microcurrent vs EMS at Home: What Each One Actually Does. Independent critical evaluation. Tier 8.',
          'A Systematic Review of the Efficacy of Microfocused Ultrasound for Facial Skin Tightening. Intl J Environmental Research and Public Health. 16 studies. Tier 2.',
          'A Systematic Review of High-Intensity Focused Ultrasound (HIFU) in Skin Tightening and Body Contouring. Aesthetic Surgery Journal. Tier 2.',
          'Shu et al. Effectiveness of a Radiofrequency Device for Rejuvenation of Aged Skin at Home: RCT. Dermatology and Therapy, 2022. Tier 3.',
        ].map((ref, i) => (
          <div key={i} style={{ marginBottom: 6 }}>[{i + 1}] {ref}</div>
        ))}
        <div style={{ marginTop: 12, fontStyle: 'italic', color: colors.inkSoft }}>
          Source-quality note (Phase 2 §3-4): This page required more active funding-bias screening than most others — a large share of RF microneedling and microcurrent sources were manufacturer blogs or device-brand-affiliated content. Where a source's own marketing content directly acknowledged a mechanism's limited evidence (ref 7), it was retained specifically as evidence of that admission, not as a positive efficacy source.
        </div>
      </div>
    </article>
  );
}

// ============================================================
// ELEVATED MEDICAL DISCLAIMER — strongest treatment on the site
// Per Phase 3 §10, page-top, before any content.
// ============================================================
function ElevatedDisclaimer() {
  return (
    <div style={{
      background: colors.ink, color: colors.bg, borderRadius: 10,
      padding: '20px 24px', margin: '0 0 28px 0', display: 'flex', gap: 16,
      border: `2px solid ${colors.safetySig}`,
    }}>
      <div style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>⚕</div>
      <div>
        <div style={{ fontFamily: fontMono, fontSize: 11, color: '#E8A896', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8, textTransform: 'uppercase' }}>Medical Disclaimer — Elevated</div>
        <div style={{ fontSize: 14.5, lineHeight: 1.65 }}>
          This page discusses procedures that involve injectables, devices, or surgery performed by licensed medical professionals. Nothing here substitutes for an in-person consultation. Decisions about these procedures — including candidacy, technique, and product selection — should be made directly with a licensed provider who can examine you, take a full medical history, and discuss your specific risks. This page provides background for that conversation, not a substitute for it.
        </div>
      </div>
    </div>
  );
}

// ============================================================
// REVERSIBLE VS PERMANENT SPECTRUM
// ============================================================
function ReversibilitySpectrum() {
  const items = [
    { name: 'Botulinum Toxin', pos: 8 },
    { name: 'HA Fillers (hyaluronidase-reversible)', pos: 18 },
    { name: 'PRP', pos: 30 },
    { name: 'Chemical Peels', pos: 42 },
    { name: 'Thread Lifts', pos: 55 },
    { name: 'Fat Grafting', pos: 72 },
    { name: 'Facelift / Surgical', pos: 92 },
  ];
  return (
    <div style={{ margin: '20px 0', padding: '24px 20px 36px 20px', background: colors.white, border: `1px solid ${colors.line}`, borderRadius: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: fontMono, color: colors.inkSoft, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        <span>← Reversible / Temporary</span>
        <span>Permanent →</span>
      </div>
      <div style={{ position: 'relative', height: 6, background: `linear-gradient(90deg, ${colors.safetyGood}, ${colors.safetyCaution}, ${colors.safetySig})`, borderRadius: 3, marginBottom: 8 }}>
        {items.map(item => (
          <div key={item.name} style={{ position: 'absolute', left: `${item.pos}%`, top: -6, transform: 'translateX(-50%)' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: colors.white, border: `2px solid ${colors.ink}` }} />
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', height: 60, marginTop: 8 }}>
        {items.map(item => (
          <div key={item.name} style={{
            position: 'absolute', left: `${item.pos}%`, transform: 'translateX(-50%)',
            fontSize: 11, color: colors.ink, textAlign: 'center', width: 90, lineHeight: 1.3,
          }}>{item.name}</div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PROCEDURE COMPARISON TABLE
// ============================================================
const procedureData = [
  { name: 'Botulinum Toxin', evidence: 5, longevity: '3-4 months', risk: 'Low; transient, localized' },
  { name: 'HA Fillers', evidence: 4, longevity: '6-9 months', risk: 'Low-moderate; rare vascular events' },
  { name: 'Chemical Peels', evidence: 4, longevity: 'Weeks-months per session', risk: 'Depth-dependent; PIH risk in darker skin' },
  { name: 'PRP', evidence: 3, longevity: 'Variable, understudied', risk: 'Low (autologous)' },
  { name: 'Thread Lifts', evidence: 2, longevity: '~12-18 months in available studies', risk: 'Migration, puckering, scar tissue' },
  { name: 'Fat Grafting', evidence: 3, longevity: 'Potentially long-term', risk: 'Surgical/harvest-related' },
  { name: 'Facelift / Surgical', evidence: 4, longevity: 'Years', risk: 'Highest on this page; longest recovery' },
];

function ProcedureTable() {
  const [sortBy, setSortBy] = useState('evidence');
  const evidenceLabel = { 5: '★★★★★', 4: '★★★★', 3: '★★★', 2: '★★', 1: '★' };
  const sorted = useMemo(() => {
    const rows = [...procedureData];
    rows.sort((a, b) => sortBy === 'evidence' ? b.evidence - a.evidence : a.name.localeCompare(b.name));
    return rows;
  }, [sortBy]);
  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{ display: 'flex', marginBottom: 12 }}>
        <button onClick={() => setSortBy(sortBy === 'evidence' ? 'name' : 'evidence')}
          style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer', border: `1px solid ${colors.line}`, background: colors.white, color: colors.inkSoft, fontFamily: fontBody }}
        >Sort: {sortBy === 'evidence' ? 'Evidence ↓' : 'A–Z'}</button>
      </div>
      <div style={{ overflowX: 'auto', border: `1px solid ${colors.line}`, borderRadius: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: colors.bgAlt, textAlign: 'left' }}>
              {['Procedure', 'Evidence', 'Typical Longevity', 'Key Risk Profile'].map(h => (
                <th key={h} style={{ padding: '10px 14px', fontFamily: fontMono, fontSize: 10.5, color: colors.inkSoft, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: `1px solid ${colors.line}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.name} style={{ background: i % 2 === 0 ? colors.white : colors.bg }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: colors.ink, fontFamily: fontDisplay }}>{row.name}</td>
                <td style={{ padding: '10px 14px', color: colors.star, fontFamily: fontMono, fontWeight: 600 }}>{evidenceLabel[row.evidence]}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft }}>{row.longevity}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft, fontSize: 12.5 }}>{row.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// COSMETIC PROCEDURES — FULL PAGE
// ============================================================
function CosmeticProceduresPage() {
  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 8 OF 16 · TREATMENTS</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>Cosmetic Procedures</h1>
      <div style={{ fontSize: 15.5, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640, marginBottom: 24 }}>
        Evidence, cost, longevity, and risk across the major injectable, energy-based, and surgical procedures — the most procedurally serious page on this site.
      </div>

      <ElevatedDisclaimer />

      <QuickTakeaway>
        <strong>Botulinum toxin has the strongest, most rigorous evidence of any procedure here</strong> — multiple Level 1 RCTs, FDA on-label duration data, five approved formulations. <strong>HA fillers are broadly safe and effective</strong>, but a meta-analysis of 748 participants found no significant difference in aesthetic improvement scores at several timepoints despite a higher responder rate than control. <strong>PDO thread lifts are explicitly described in peer-reviewed literature as "a scarcely studied" technique.</strong> <strong>PRP's own systematic review describes the evidence as limited</strong>, with highly varied results and ill-defined methods.
      </QuickTakeaway>

      <SectionHeading>Botulinum Toxin (Botox, Dysport, Xeomin, and Others)</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        This is the best-evidenced procedure on this page by a wide margin. Botulinum toxin is the most commonly performed minimally invasive cosmetic procedure in the US, with nearly 4 million procedures in 2022 alone.<Citation n={1} /> Five formulations are FDA-approved for glabellar lines, with on-label duration claims of 3-4 months, cosmetic benefit within days, peak effect within 30 days.<Citation n={1} /> A Phase 2 RCT found median duration of effect around 148-183 days depending on formulation — Level of Evidence 1, the strongest rating in the hierarchy.<Citation n={1} /></p>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
        Mechanistically, it inhibits acetylcholine release at the neuromuscular junction, temporarily preventing the repeated muscle contractions that create dynamic wrinkles — as opposed to wrinkles from collagen/elastin loss alone (see The Science of Aging).<Citation n={2} /> Documented side effects include localized bruising, and in eye-area treatment specifically, diplopia, ptosis, and lagophthalmos, generally transient.<Citation n={3} /></p>

      <SectionHeading>Dermal Fillers (Hyaluronic Acid-Based)</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        HA fillers have a large, generally favorable evidence base for facial volumization, best data for nasolabial folds and the periocular region.<Citation n={4} /> Temporary (typically 6-9 months), and reversible via hyaluronidase if needed — a real safety advantage over permanent materials.<Citation n={4} /></p>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        A specific finding worth highlighting rather than presenting filler evidence as uniformly strong: a meta-analysis of 5 RCTs (748 participants) found HA fillers produced a significantly higher <em>responder rate</em> than control, but <strong>GAIS scores showed no statistically significant improvement at 4, 8, or 24 weeks</strong> in the same analysis.<Citation n={5} /> Two different ways of measuring the same outcome told different stories — citing only the more favorable figure would overstate the precision of what's actually been shown.</p>
      <MythFact
        myth="All hyaluronic acid fillers have equally strong, directly comparable clinical evidence behind them."
        fact="A primary trial publication itself notes that despite progress in filler design, there is still limited evidence on the clinical efficacy of many specific products, and comparative studies between fillers are often lacking — clinicians and patients frequently rely on manufacturer-provided information rather than independent comparative data."
      />
      <p style={{ fontSize: 12.5, color: colors.inkSoft, fontFamily: fontMono, marginTop: -6 }}>Source: ref<Citation n={6} /></p>

      <SectionHeading>Platelet-Rich Plasma (PRP)</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        PRP uses a concentrated portion of the patient's own blood plasma, injected to stimulate regeneration via growth factors.<Citation n={7} /> A systematic review (9 trials, 2 observational studies) found 4 studies indicated improved wrinkles and texture, with histological evidence of increased dermal density.<Citation n={7} /> However, the same review is direct: <strong>evidence is limited, results highly varied, application methods ill-defined</strong> across the existing literature.<Citation n={7} /></p>

      <SectionHeading>Thread Lifts (PDO, PLLA, PCL)</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        This page wants to be direct: thread lifts are frequently marketed as a "non-surgical facelift" with confidence outpacing the literature. A 2023 systematic review on PDO threads is titled, in the authors' own words, <strong>"a scarcely studied rejuvenation technique,"</strong> explicitly noting very few published studies on absorbable threads in facial rejuvenation despite gaining popularity among practitioners.<Citation n={8} /></p>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
        That said, available studies generally report positive results: one 2-year study found significant rejuvenation with barbed PDO threads, especially combined with Botox/fillers/PRP, and a separate study of 68 patients found clinically significant lifting averaging 18 months.<Citation n={8} /><Citation n={9} /></p>
      <MythFact
        myth="Thread lifts are a well-established, thoroughly studied alternative to surgical facelifts with a comparable evidence base."
        fact='A peer-reviewed systematic review of this exact technique describes it in its own title as "a scarcely studied rejuvenation technique." Positive results exist, but the volume and rigor of independent comparative research is genuinely thinner than for botulinum toxin or HA fillers.'
      />
      <p style={{ fontSize: 14, lineHeight: 1.7, color: colors.inkSoft }}>
        Documented risks include thread migration, skin puckering/dimpling, and potential scar tissue formation that could complicate future procedures — worth discussing directly with a provider given the comparatively thin evidence base.<Citation n={10} /></p>

      <SectionHeading>Facelifts, Body Contouring & Surgical Procedures</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Surgical facelift remains the most durable solution for significant skin laxity, with decades of refinement, though much of the evidence base is observational/cohort rather than RCT-structured — randomizing patients to surgery vs. no surgery for cosmetic indications is impractical. Body contouring (abdominoplasty, brachioplasty) is the direct surgical solution for excess skin after significant weight loss (see Exercise & Body Composition) — though post-bariatric body contouring patients show measurably lower quality-of-life scores than the general population even after successful surgery, a sobering finding worth knowing going in.<Citation n={11} /></p>

      <SectionHeading>Reversible vs. Permanent</SectionHeading>
      <ReversibilitySpectrum />

      <SectionHeading>Procedure Comparison Table</SectionHeading>
      <ProcedureTable />

      <SectionHeading>Common Misconceptions</SectionHeading>
      <MythFact
        myth="Newer, more expensive, or more heavily marketed procedures are automatically more effective than established options."
        fact="Botulinum toxin — among the oldest, least expensive procedures here — has the strongest evidence base by a wide margin. Several newer techniques (thread lifts, some PRP applications) currently have thinner independent evidence than their marketing presence would suggest."
      />

      <SectionHeading>Research Gaps</SectionHeading>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: colors.ink }}>
        Thread lifts are the clearest stated research gap on this page, by the field's own peer-reviewed admission. PRP standardization — preparation method, platelet concentration, injection technique — varies across the literature, making cross-study comparison difficult. Comparative effectiveness research between different HA filler products is limited, per a primary trial's own stated limitation.
      </p>

      <ClinicalBottomLine>
        Botulinum toxin has by far the strongest evidence base on this page. HA fillers are broadly safe and effective, though aesthetic improvement scores specifically haven't always shown statistical significance in rigorous meta-analysis. PRP is biologically plausible but methodologically unstandardized. Thread lifts are explicitly, by the field's own literature, understudied. Surgical procedures remain the most durable options for structural change, with the highest risk and recovery burden. Every procedure here requires an in-person consultation with a licensed provider — nothing here substitutes for that conversation.
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ['Is Botox safe long-term?', 'It has the longest and most rigorous safety track record of any procedure here, with decades of use and multiple FDA-approved formulations; standard medical contraindications still apply.'],
          ['Are fillers or thread lifts better for sagging skin?', 'Neither directly addresses true structural sagging the way surgery does — fillers restore volume, threads provide temporary, evidence-thin lift. For significant structural laxity, a surgical consultation is the most evidence-grounded next step.'],
          ['Is PRP worth trying?', "A reasonable, low-risk option given its biological plausibility and autologous safety profile, but the field hasn't standardized preparation or administration — ask your provider about their specific protocol."],
          ['Why does this page rate thread lifts so much lower than expected given their popularity?', 'Because popularity and evidence strength are different things — the relevant systematic review literally titles itself around how understudied the technique is.'],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>

      <SectionHeading>References</SectionHeading>
      <div style={{ fontSize: 12.5, color: colors.inkSoft, lineHeight: 1.8, fontFamily: fontMono }}>
        {[
          'Botulinum toxin formulations, FDA on-label duration data, Phase 2 RCT findings (PrabotulinumtoxinA-xvfs trial). PMC, Level of Evidence 1. Tier 1/3.',
          'Mechanism of action consistent across multiple botulinum toxin RCTs, including the BEB pretarsal injection RCT. Tier 3.',
          'Side effect profile from the benign essential blepharospasm RCT and related trials. Tier 3.',
          'Hyaluronic Acid Dermal Fillers: Safety and Efficacy. Narrative review. Tier 8.',
          'Efficacy and Safety of Hyaluronic Acid Fillers for Midface Augmentation: Systematic Review and Meta-Analysis. PMC. 5 RCTs, n=748. Tier 2.',
          'Efficacy and safety of a new resilient HA dermal filler. 64-week RCT, noting limited comparative evidence between products. Tier 3.',
          'Efficacy of platelet-rich plasma in facial rejuvenation: A systematic review. ScienceDirect, 2025. 9 trials + 2 observational. Tier 2.',
          'Contreras et al. Using PDO threads: A scarcely studied rejuvenation technique. J Cosmetic Dermatology, 2023. Tier 2.',
          "Two years' outcome of thread lifting with absorbable barbed PDO threads. Tier 7.",
          'What Are The Risks Of PDO Thread Lift? Clinical-education/marketing source. Tier 8/9.',
          'Mental and Physical Impact of Body Contouring Procedures on Post-Bariatric Surgery Patients. PMC. Tier 6.',
        ].map((ref, i) => (
          <div key={i} style={{ marginBottom: 6 }}>[{i + 1}] {ref}</div>
        ))}
        <div style={{ marginTop: 12, fontStyle: 'italic', color: colors.inkSoft }}>
          Source-quality note (Phase 2 §3-4): Numerous PDO thread lift and PRP marketing pages asserted more confidence than the field's own systematic reviews support — several were explicitly promoting a competing treatment. Peer-reviewed systematic reviews were prioritized as governing sources throughout.
        </div>
      </div>
    </article>
  );
}

// ============================================================
// "WHERE SHOULD I START?" DECISION TREE — routes via setPage
// ============================================================
function StartHereDecisionTree({ setPage }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    { key: 'situation', q: 'What brings you here today?', options: [
      { label: "I'm new to all this and want a starting point", value: 'new' },
      { label: 'I have a specific concern (spots, texture, sagging)', value: 'concern' },
      { label: 'I want to know if something specific actually works', value: 'verify' },
      { label: "I'm deciding where to spend money/time", value: 'decide' },
    ]},
  ];

  const result = useMemo(() => {
    if (!answers.situation) return null;
    const map = {
      new: { name: 'Skin Through the Decades', page: 'decades', why: 'A practical, age-banded starting point — what to focus on now, and the highest-ROI moves for your stage.' },
      concern: { name: 'Hyperpigmentation or Skincare Ingredients', page: 'pigmentation', why: 'For spots/tone, start with Hyperpigmentation. For texture/fine lines/general routine-building, Skincare Ingredients is the better starting page.' },
      verify: { name: 'Myths vs Facts', page: 'myths', why: "Direct, evidence-based verdicts on specific commonly-asked claims — search for your question or browse the list." },
      decide: { name: 'Cost vs Benefit Calculator', page: 'calculator', why: 'Ranks interventions by evidence strength, cost, and expected effect, side by side.' },
    };
    return map[answers.situation];
  }, [answers]);

  if (result) {
    return (
      <div style={{ background: colors.accentSoft, borderRadius: 10, padding: 24, margin: '20px 0' }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Suggested starting point</div>
        <div style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 600, color: colors.ink, marginBottom: 8 }}>{result.name}</div>
        <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6, marginBottom: 16 }}>{result.why}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setPage(result.page)} style={{ background: colors.accent, border: 'none', color: colors.white, padding: '10px 18px', borderRadius: 6, cursor: 'pointer', fontFamily: fontBody, fontSize: 13.5, fontWeight: 600 }}>Take me there →</button>
          <button onClick={() => setAnswers({})} style={{ background: 'none', border: `1px solid ${colors.accent}`, color: colors.accent, padding: '10px 18px', borderRadius: 6, cursor: 'pointer', fontFamily: fontBody, fontSize: 13.5 }}>Start over</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: colors.accentSoft, borderRadius: 10, padding: 24, margin: '20px 0' }}>
      <div style={{ fontFamily: fontDisplay, fontSize: 19, fontWeight: 600, color: colors.ink, marginBottom: 16 }}>{questions[0].q}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {questions[0].options.map(opt => (
          <button key={opt.value} onClick={() => setAnswers({ situation: opt.value })}
            style={{ textAlign: 'left', padding: '12px 16px', background: colors.white, border: `1px solid ${colors.line}`, borderRadius: 8, cursor: 'pointer', fontFamily: fontBody, fontSize: 14.5, color: colors.ink }}
          >{opt.label}</button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// HOME — FULL PAGE
// ============================================================
function HomePage({ setPage }) {
  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 1 OF 16 · START</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>Evidence-Based Skin & Aging</h1>
      <div style={{ fontSize: 16, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640 }}>
        A reference, not marketing. Every recommendation here is rated by actual independent clinical evidence — not popularity, price, or how often a claim gets repeated.
      </div>

      <QuickTakeaway>
        This site rates every intervention by <strong>actual independent clinical evidence</strong>, not popularity or marketing presence — sometimes that means a cheap, unglamorous habit (sunscreen) outranks an expensive, heavily-marketed device or product. Skin aging has two broad causes — <strong>intrinsic</strong> (genetic, happens regardless of environment) and <strong>extrinsic</strong> (environmental, overwhelmingly UV) — with several interacting cellular mechanisms underneath both. Look for the <strong>★ evidence rating</strong> throughout — it always means evidence quality specifically, never blended with effect size, safety, or cost.
      </QuickTakeaway>

      <SectionHeading>How Skin Ages, Briefly</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Visible aging comes from two processes happening at once. <strong>Intrinsic aging</strong> is the slow, chronological process driven by genetics — it happens even on skin that's never seen the sun. <strong>Extrinsic aging</strong> is driven by environment, and since UV exposure dominates, it's usually just called <strong>photoaging</strong>. Extrinsic aging tends to produce the more dramatic visible changes — and it's also the one with the most room for prevention. (Full mechanism: The Science of Aging.)
      </p>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>Underneath both processes, a handful of cellular mechanisms do most of the work:</p>
      <ul style={{ fontSize: 15, lineHeight: 1.8, color: colors.ink, paddingLeft: 20 }}>
        <li><strong>Collagen and elastin</strong> — the dermis's main structural proteins (firmness and recoil, respectively). Both decline with age; UV exposure actively accelerates breakdown of both.</li>
        <li><strong>Hyaluronic acid</strong> — a natural humectant in the dermis that holds many times its weight in water, keeping skin hydrated and plump. Declines with age.</li>
        <li><strong>Glycation</strong> — a sugar-driven process where sugars bind to proteins like collagen, making them stiffer and harder for the body to renew.</li>
        <li><strong>Oxidative stress</strong> — reactive molecules ("free radicals") from UV, pollution, and normal metabolism outpace skin's antioxidant defenses, damaging collagen, elastin, and cellular DNA.</li>
        <li><strong>Inflammation</strong> — from sun exposure or irritation, activates pathways that compound the mechanisms above rather than acting in isolation.</li>
        <li><strong>Hormonal changes</strong> — especially menopausal estrogen decline, measurably affect collagen production and skin thickness.</li>
      </ul>
      <p style={{ fontSize: 14, color: colors.inkSoft, fontStyle: 'italic' }}>These mechanisms interact constantly — part of why no single ingredient or product addresses everything skin aging involves. Full depth on each: The Science of Aging.</p>

      <SectionHeading>How This Site Rates Evidence</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Every intervention on this site gets evaluated against a tiered evidence hierarchy (clinical guidelines and meta-analyses at the top; marketing claims and anecdotes at the bottom) and rated with a consistent ★ system. That rating always means <strong>evidence quality</strong> specifically. Effect size, safety, and cost are shown as separate ratings alongside it — a real, well-documented small effect looks different from an unproven large claim, and the two are never collapsed into one number.
      </p>
      <ClinicalPearl>
        This sometimes cuts against popular expectation. Across this site so far: <strong>daily sunscreen has the single strongest piece of intervention evidence on the entire site</strong> — a real randomized controlled trial, stronger than the evidence behind any topical ingredient, device, or procedure reviewed. Meanwhile some heavily-marketed categories turn out to have considerably thinner independent evidence than their popularity suggests. This isn't a contrarian stance for its own sake — it's just what happens when popularity and evidence strength, which aren't the same thing, are checked against each other directly.
      </ClinicalPearl>

      <SectionHeading>Where Should I Start?</SectionHeading>
      <StartHereDecisionTree setPage={setPage} />

      <SectionHeading>Common Misconceptions</SectionHeading>
      <MythFact
        myth="The most expensive or most talked-about products and procedures are generally the most effective."
        fact="Price and popularity don't reliably track with evidence quality on this site. Some of the strongest-evidenced interventions reviewed (daily sunscreen, topical retinoids) are inexpensive and unglamorous; some of the most heavily marketed categories (certain devices, certain 'regenerative' ingredients) currently rest on considerably thinner independent evidence."
      />

      <ClinicalBottomLine>
        Skin aging is driven by genetics (intrinsic aging) and environment (extrinsic aging, overwhelmingly UV-driven), acting through interacting mechanisms — collagen/elastin breakdown, hyaluronic acid decline, glycation, oxidative stress, inflammation, and hormonal change. This site evaluates every intervention against that mechanistic backdrop and a consistent evidence-tier system, rating evidence quality separately from effect size, safety, and cost — so readers can tell the difference between "well-proven but modest" and "popular but unproven."
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ["Where should I actually start if I'm completely new to this?", 'Use the tool above, or jump directly to Skin Through the Decades for an age-banded starting point, or Build Your Routine for a structured, tiered routine-builder.'],
          ['Is this site selling anything?', 'No — recommendations are based on independent clinical evidence, not sponsorship. Where a cited study is industry-funded, that\'s disclosed directly in the relevant page\'s references.'],
          ['Why does this site sometimes rate a popular product or procedure lower than expected?', 'Because popularity and evidence strength are genuinely different things, and this site rates by the latter — see Device Therapy on microcurrent, Cosmetic Procedures on thread lifts, or Nutrition & Supplements on zinc for direct examples.'],
          ['How often is this site updated?', 'Each page lists its sources in context; evidence in this field evolves, and pages are written to be revisited as new research is published rather than treated as permanently settled.'],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>
    </article>
  );
}

// ============================================================
// DECADE PANEL — expandable, one per decade
// ============================================================
function DecadePanel({ decade, concern, defaultOpen, children }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div style={{ border: `1px solid ${colors.line}`, borderRadius: 10, marginBottom: 14, overflow: 'hidden', background: colors.white }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div>
          <div style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, color: colors.accent }}>{decade}</div>
          <div style={{ fontSize: 13, color: colors.inkSoft, marginTop: 2 }}>{concern}</div>
        </div>
        <span style={{ fontSize: 20, color: colors.inkSoft, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>⌄</span>
      </button>
      {open && <div style={{ padding: '0 22px 22px 22px', borderTop: `1px solid ${colors.line}` }}><div style={{ paddingTop: 18 }}>{children}</div></div>}
    </div>
  );
}

// ============================================================
// DECADES COMPARISON TABLE
// ============================================================
function DecadesTable() {
  const rows = [
    { decade: '20s', concern: 'Acne/oil, prevention', focus: 'Sunscreen, simple routine', input: 'Persistent acne scarring risk' },
    { decade: '30s', concern: 'Early fine lines, tone', focus: '+ Retinoid, antioxidant', input: 'Emerging pigmentation concerns' },
    { decade: '40s', concern: 'Menopausal transition, structural onset', focus: '+ Ceramides/HA, barrier support', input: 'Disproportionate changes vs. prior decade' },
    { decade: '50s', concern: 'Structural volume/laxity', focus: 'Continue topical foundation', input: 'Considering procedural escalation' },
    { decade: '60+', concern: 'Cumulative UV effects, skin-cancer risk', focus: 'Gentler formulations, continued SPF', input: 'Annual skin-cancer screening; structural change' },
  ];
  return (
    <div style={{ overflowX: 'auto', border: `1px solid ${colors.line}`, borderRadius: 10, margin: '16px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: colors.bgAlt, textAlign: 'left' }}>
            {['Decade', 'Primary Concern', 'Topical Focus', 'Consider Professional Input When...'].map(h => (
              <th key={h} style={{ padding: '10px 14px', fontFamily: fontMono, fontSize: 10.5, color: colors.inkSoft, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: `1px solid ${colors.line}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.decade} style={{ background: i % 2 === 0 ? colors.white : colors.bg }}>
              <td style={{ padding: '10px 14px', fontFamily: fontDisplay, fontWeight: 700, color: colors.accent }}>{r.decade}</td>
              <td style={{ padding: '10px 14px', color: colors.ink, fontSize: 12.5 }}>{r.concern}</td>
              <td style={{ padding: '10px 14px', color: colors.inkSoft, fontSize: 12.5 }}>{r.focus}</td>
              <td style={{ padding: '10px 14px', color: colors.inkSoft, fontSize: 12.5 }}>{r.input}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// SKIN THROUGH THE DECADES — FULL PAGE
// ============================================================
function DecadesPage() {
  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 10 OF 16 · PERSONALIZE</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>Skin Through the Decades</h1>
      <div style={{ fontSize: 15.5, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640 }}>
        Practical, age-banded guidance synthesizing the mechanisms and evidence covered elsewhere on this site — what changes, what to prioritize, and the highest-ROI move at each stage.
      </div>

      <QuickTakeaway>
        There is <strong>no universal "right age"</strong> to start retinoids or other actives — it's about what your skin shows, not a fixed birthday. A specific, well-documented event happens around menopause: women lose roughly <strong>30% of skin collagen in the first five years after menopause</strong>, then about 2%/year afterward — a real, quantified inflection point. The highest-ROI move is the same in every decade: <strong>daily sunscreen.</strong>
      </QuickTakeaway>

      <SectionHeading>By Decade</SectionHeading>
      <p style={{ fontSize: 14, color: colors.inkSoft, marginBottom: 14 }}>Tap your decade to expand. Each links to the relevant deep-dive page for full evidence.</p>

      <DecadePanel decade="20s" concern="Acne/oil, prevention" defaultOpen>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
          <strong>What's changing:</strong> Collagen production is near its lifetime peak, but the decline begins earlier than most assume — by some estimates, synthesis starts a slow decline around the mid-20s.<Citation n={1} /> Visible aging signs are typically minimal; acne and oil-related concerns are usually the dominant issue, not aging.<Citation n={2} /></p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
          <strong>What to prioritize:</strong> Daily broad-spectrum sunscreen is, by a wide margin, the single highest-leverage habit at any age (see Lifestyle) — starting now compounds the most. A simple routine (cleanse, treat acne, moisturize, SPF) is appropriate; retinoids aren't necessary for anti-aging specifically at this stage, though may be used for acne under guidance.<Citation n={2} /><Citation n={3} /></p>
        <ClinicalPearl>Common mistake: either over-treating with a complex routine before there's anything to address, or under-protecting by skipping daily sunscreen because damage isn't yet visible — exactly the period where prevention compounds the most. Highest ROI move: daily sunscreen, full stop.</ClinicalPearl>
      </DecadePanel>

      <DecadePanel decade="30s" concern="Early fine lines, tone">
        <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
          <strong>What's changing:</strong> Early, subtle signs typically appear — fine lines, first signs of uneven tone, gradual elasticity decline.<Citation n={4} /> This is the decade most dermatology sources point to as a reasonable time to introduce a retinoid if not already started.<Citation n={3} /><Citation n={4} /></p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
          <strong>What to prioritize:</strong> Building on the 20s foundation — sunscreen stays non-negotiable — this is a reasonable decade to add one antioxidant (AM) and one cell-turnover agent (PM), per Skincare Ingredients. If pigmentation or texture concerns emerge, see Hyperpigmentation's triage table.
        </p>
        <ClinicalPearl>Common mistake: starting a strong retinoid concentration too aggressively, causing irritation severe enough to cause abandonment — start low and slow. Highest ROI move: adding a retinoid to an already-consistent sunscreen habit.</ClinicalPearl>
      </DecadePanel>

      <DecadePanel decade="40s" concern="Menopausal transition, structural onset">
        <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
          <strong>What's changing:</strong> This is the decade where a specific, well-documented physiological event becomes directly relevant for many women: the menopausal transition. Multiple peer-reviewed sources, tracing to a foundational 1987 study, consistently report women lose approximately <strong>30% of dermal collagen in the first five years after menopause</strong>, then roughly <strong>2% per year for about 15 years after that</strong>.<Citation n={5} /><Citation n={6} /><Citation n={7} /> A real, quantified inflection point — distinct from the slower, gradual intrinsic decline of the 20s and 30s.</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
          <strong>What to prioritize:</strong> The existing foundation remains the base, but hydration becomes more strategic as barrier function and oil production decline — ceramides and hyaluronic acid become more directly relevant. For pronounced menopause-related changes, discuss hormonal status with a physician — topical estrogen has shown increased dermal collagen/thickness in some studies, but <strong>hormone therapy decisions are a physician conversation, not a skincare choice.</strong><Citation n={7} /></p>
        <ClinicalPearl>Common mistake: attributing all 40s skin changes to "just aging" without recognizing the menopause-specific component, which has a different magnitude and timeline than ordinary decline. Highest ROI move: continue the sunscreen/retinoid foundation while recognizing menopausal status — not just chronological age — is now a relevant variable.</ClinicalPearl>
      </DecadePanel>

      <DecadePanel decade="50s" concern="Structural volume/laxity">
        <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
          <strong>What's changing:</strong> The post-menopausal collagen decline continues at its slower ongoing rate (~2%/year), compounding over the decade.<Citation n={5} /><Citation n={6} /> Skin thickness continues declining, and structural changes (volume loss, deeper static wrinkles) become more prominent relative to dynamic, expression-driven wrinkles.</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
          <strong>What to prioritize:</strong> Topicals continue having a real, if more modest, role — but this is the decade many first seriously consider procedural escalation. Cosmetic Procedures and Device Therapy become more directly relevant: fillers for volume, botulinum toxin for dynamic wrinkles, the comparison tables on those pages for laxity specifically.</p>
        <ClinicalPearl>Common mistake: assuming topicals alone can address structural volume loss or significant laxity — a different category of change than topicals are mechanistically suited for. Highest ROI move: a consultation conversation about which specific changes are present and which intervention category actually matches them.</ClinicalPearl>
      </DecadePanel>

      <DecadePanel decade="60+" concern="Cumulative UV effects, skin-cancer risk">
        <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
          <strong>What's changing:</strong> Both intrinsic chronological decline and decades of cumulative extrinsic (UV) exposure are now fully expressed — thinner skin, reduced elasticity, more pronounced static wrinkles, and higher relative prevalence of accumulated pigmentation changes.</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.ink }}>
          <strong>What to prioritize:</strong> Gentler formulations of the same evidence-based actives, continued daily sunscreen (benefit doesn't stop accruing at any age), and a higher relative weight on professional evaluation — both skin-cancer screening and procedural options for structural concerns.</p>
        <ClinicalPearl>Common mistake: assuming it's "too late" for evidence-based topicals to help — well-evidenced actives continue showing measurable benefit when introduced even later in life. Highest ROI move: regular dermatologic skin-cancer screening alongside continued sunscreen use.</ClinicalPearl>
      </DecadePanel>

      <SectionHeading>Comparison Across Decades</SectionHeading>
      <DecadesTable />

      <SectionHeading>Common Misconceptions</SectionHeading>
      <MythFact
        myth="There's a specific 'right age' to start using retinol, and starting earlier or later than that window means missing the benefit."
        fact="Dermatology sources are consistent that timing depends on what your skin is showing, not a fixed age. Retinoids continue showing measurable benefit whenever introduced — earlier introduction simply means more cumulative years of benefit, not a hard eligibility window."
      />
      <MythFact
        myth="Skin aging is a smooth, gradual process that looks the same for everyone at the same age."
        fact="For many women, there's a real, quantified inflection point around menopause (~30% collagen loss in five years) meaningfully different in magnitude and timeline from the slower, steadier intrinsic decline of earlier decades — aging isn't one uniform curve."
      />

      <SectionHeading>Research Gaps</SectionHeading>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: colors.ink }}>
        Individual variation in menopausal timing and skin impact is real but not precisely predictable in advance — the ~30% five-year figure is a population average. Comparative research on optimal retinoid introduction timing (earlier vs. later starts, controlling for total years of use) is thinner than the confident "start in your 20s/30s" framing common in consumer content would suggest.
      </p>

      <ClinicalBottomLine>
        The same core evidence-based foundation (daily sunscreen, eventually a retinoid, supporting antioxidants/hydration) applies across every decade — what changes is which additional concerns become relevant and which intervention category best matches them. The menopausal transition is a real, quantified, decade-specific event worth knowing about specifically rather than attributing all midlife skin change to age alone. At every decade, the highest-ROI single action remains the same: consistent daily sun protection.
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ['Is it too late to start a skincare routine in my 50s or 60s?', 'No — well-evidenced actives continue showing measurable benefit whenever introduced, just potentially requiring gentler formulations and more gradual introduction in more sensitive, thinner skin.'],
          ['Should I start Botox in my 20s as "prevention"?', "This page doesn't find strong, directly comparative evidence isolating preventative use at this age as superior to starting later — see Cosmetic Procedures for botulinum toxin's evidence base, strong for treating existing dynamic wrinkles but less directly studied as an early-prevention strategy."],
          ["How do I know if my skin changes are 'just aging' or menopause-related?", "If changes feel disproportionate to the prior decade, or coincide with other perimenopausal symptoms, that's a reasonable prompt to discuss with a physician."],
          ['Do men go through an equivalent skin-aging transition?', "This page's menopause-specific findings are female-specific by definition; men's skin aging is driven more continuously by the gradual mechanisms in The Science of Aging without an equivalent sudden hormonal inflection point."],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>

      <SectionHeading>References</SectionHeading>
      <div style={{ fontSize: 12.5, color: colors.inkSoft, lineHeight: 1.8, fontFamily: fontMono }}>
        {[
          'General dermatological consensus on collagen synthesis decline beginning in the mid-20s, consistent across multiple clinical-education sources. Tier 8.',
          'How Your Skincare Routine Should Evolve in Your 20s, 30s, 40s and Beyond. SLMD Skincare (Sandra Lee, MD). Tier 8.',
          'When Should You Start Using Retinol? Why Timing Matters. Tier 8.',
          'Retinol by Decade: The Formulas for Your 20s, 30s, 40s and Beyond. Dermstore. Tier 8.',
          'Affinito et al. 1987, foundational study on postmenopausal collagen loss, cited via secondary peer-reviewed reviews below. Tier 7.',
          'Menopause, skin and common dermatoses. Part 2: skin disorders. Clinical and Experimental Dermatology, 2022;47(12):2117-2122. Tier 2.',
          'Skin, hair and beyond: the impact of menopause. Climacteric, 2022;25(5):434-442. Tier 2.',
        ].map((ref, i) => (
          <div key={i} style={{ marginBottom: 6 }}>[{i + 1}] {ref}</div>
        ))}
        <div style={{ marginTop: 12, fontStyle: 'italic', color: colors.inkSoft }}>
          Source-quality note (Phase 2 §3-4): This page draws more on Tier 8 clinical-education sources than most others, appropriate for practical decade-by-decade synthesis. One source's claims about a specific "JAMA Dermatology twin study" and "landmark JAMA Dermatology" sunscreen trial were not used, as they could not be independently verified and read as possibly fabricated or misattributed citations.
        </div>
      </div>
    </article>
  );
}

// ============================================================
// PRODUCTS GUIDE — category table + budget/premium pairing
// ============================================================
function ProductCategoryTable({ title, note, rows, budget, premium, valueNote }) {
  return (
    <div style={{ margin: '20px 0' }}>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 19, color: colors.ink, marginBottom: 4 }}>{title}</h3>
      <p style={{ fontSize: 13, color: colors.inkSoft, fontStyle: 'italic', marginBottom: 12 }}>{note}</p>
      <div style={{ overflowX: 'auto', border: `1px solid ${colors.line}`, borderRadius: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: colors.bgAlt, textAlign: 'left' }}>
              {['Product', 'Active/Type', 'Price Range', 'Best For'].map(h => (
                <th key={h} style={{ padding: '9px 14px', fontFamily: fontMono, fontSize: 10, color: colors.inkSoft, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: `1px solid ${colors.line}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name} style={{ background: i % 2 === 0 ? colors.white : colors.bg }}>
                <td style={{ padding: '9px 14px', fontWeight: 600, color: colors.ink, fontSize: 12.5 }}>{r.name}</td>
                <td style={{ padding: '9px 14px', color: colors.inkSoft, fontSize: 12 }}>{r.active}</td>
                <td style={{ padding: '9px 14px', color: colors.inkSoft, fontFamily: fontMono, fontSize: 12 }}>{r.price}</td>
                <td style={{ padding: '9px 14px', color: colors.inkSoft, fontSize: 12 }}>{r.best}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12.5 }}>
        <span style={{ color: colors.accent }}><strong>Budget:</strong> {budget}</span>
        <span style={{ color: colors.tier }}><strong>Premium:</strong> {premium}</span>
      </div>
      {valueNote && <p style={{ fontSize: 12.5, color: colors.inkSoft, marginTop: 8, lineHeight: 1.5 }}><strong>Value note:</strong> {valueNote}</p>}
    </div>
  );
}

function ProductsGuidePage() {
  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 12 OF 16 · ACT</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>Products Guide</h1>
      <div style={{ fontSize: 15.5, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640 }}>
        A curated list (not an exhaustive database) of specific products, organized by the active ingredients with meaningful evidence support.
      </div>

      <QuickTakeaway>
        <strong>Evidence quality and price are not reliably correlated.</strong> Several of the best-evidenced actives (retinol, niacinamide, vitamin C) are available under $30; some premium products differentiate mainly on texture or luxury feel. <strong>This page will go stale faster than any other page on the site</strong> — specific products and prices change; the underlying active-ingredient evidence (see Skincare Ingredients) is far more durable. <strong>Device categories sit in a meaningfully higher price tier</strong> than topicals — weigh against Cost vs Benefit Calculator before buying.
      </QuickTakeaway>

      <ProductCategoryTable
        title="Sunscreen"
        note="Active ingredients to look for: zinc oxide/titanium dioxide (mineral); avobenzone, octisalate, octocrylene (chemical) — broad-spectrum labeling is non-negotiable, per Lifestyle's evidence."
        rows={[
          { name: 'EltaMD UV Clear Broad-Spectrum SPF 46', active: 'Hybrid', price: '$40-45', best: 'Sensitive/acne-prone; widely derm-recommended' },
          { name: 'La Roche-Posay Anthelios Melt-in', active: 'Hybrid', price: '$35-40', best: 'Daily wear, lighter texture' },
          { name: 'CeraVe Mineral Sunscreen SPF 30/50', active: 'Mineral', price: '$15-20', best: 'Budget; ceramides for barrier support' },
          { name: 'Blue Lizard Sensitive Mineral SPF 50', active: 'Mineral', price: '$18-22', best: 'Sensitive skin, kids, fragrance-free' },
          { name: 'Tinted mineral options (e.g., Black Girl Sunscreen)', active: 'Mineral, tinted', price: '$15-20', best: 'Reduced white cast on deeper skin tones' },
        ]}
        budget="CeraVe Mineral Sunscreen"
        premium="EltaMD UV Clear"
        valueNote="Since sunscreen is this site's single strongest-evidenced intervention (see Lifestyle), the best sunscreen is genuinely the one you'll use consistently every day."
      />

      <ProductCategoryTable
        title="Retinoids"
        note="Retinol (OTC, gentler), retinaldehyde (OTC, stronger), tretinoin (prescription, strongest) — see Skincare Ingredients for the evidence tier on each."
        rows={[
          { name: 'The Ordinary Retinol 0.2-1% in Squalane', active: 'Retinol', price: '$6-10', best: 'Absolute beginners; lowest-cost entry' },
          { name: 'Neutrogena Rapid Wrinkle Repair', active: 'Retinol', price: '$25-30', best: 'Budget, widely available' },
          { name: 'La Roche-Posay Retinol B3 Serum', active: 'Retinol + niacinamide', price: '$30-38', best: 'First-time users wanting less irritation' },
          { name: 'SkinCeuticals Retinol 0.3 / 1.0', active: 'Retinol', price: '$78-102', best: 'Experienced users, higher-strength OTC' },
          { name: 'Medik8 Crystal Retinal 6/10', active: 'Retinaldehyde', price: '$75-120', best: 'Stronger OTC, one step below prescription' },
          { name: 'Prescription Tretinoin (generic)', active: 'Tretinoin', price: '~$20-40/mo via telehealth', best: 'Strongest evidence tier; needs prescription' },
        ]}
        budget="The Ordinary Retinol"
        premium="Medik8 Crystal Retinal"
        valueNote="Prescription tretinoin is sometimes cheaper than premium OTC retinol via generic/telehealth pricing, despite being the strongest-evidenced option."
      />

      <ProductCategoryTable
        title="Vitamin C Serums"
        note="L-ascorbic acid (most studied form), typically 10-20% — see Skincare Ingredients."
        rows={[
          { name: 'La Roche-Posay Pure Vitamin C10 Serum', active: '10% LAA', price: '$35-40', best: 'Sensitive/acne-prone skin' },
          { name: "Paula's Choice C15 Super Booster", active: '15% LAA', price: '$42-48', best: 'Layers well with niacinamide' },
          { name: 'SkinCeuticals C E Ferulic', active: '15% + vit E + ferulic', price: '$169-182', best: 'Most-cited combination formula in literature' },
          { name: 'Budget stable-derivative serums', active: 'Varies', price: '$15-25', best: 'Oilier skin, lower irritation risk' },
        ]}
        budget="Stable-derivative drugstore option"
        premium="SkinCeuticals C E Ferulic"
        valueNote="Formulation stability (airtight, dark packaging) matters as much as concentration — a degraded, browned serum has lost much of its activity regardless of price."
      />

      <ProductCategoryTable
        title="Niacinamide"
        note="2-10% — see Skincare Ingredients for the evidence that 2-3% is often sufficient."
        rows={[
          { name: 'The Ordinary Niacinamide 10% + Zinc 1%', active: '10%', price: '$6-10', best: 'Budget; oil control' },
          { name: "Good Molecules Niacinamide Serum", active: '5%', price: '$10-12', best: 'Lower irritation-risk option' },
        ]}
        budget="The Ordinary"
        premium="Limited price differentiation in this category — efficacy is broadly similar at comparable concentrations."
        valueNote={null}
      />

      <ProductCategoryTable
        title="Moisturizers (Barrier/Hydration)"
        note="Ceramides, hyaluronic acid, and the ceramide-cholesterol-fatty-acid ratio found in healthy skin barrier — see Skincare Ingredients."
        rows={[
          { name: 'CeraVe Moisturizing Cream', active: 'Ceramides 1, 3, 6-II', price: '$16-20', best: 'Broadly suitable, widely studied formulation' },
          { name: 'Vanicream Moisturizing Cream', active: 'Minimal-ingredient', price: '$14-18', best: 'Highly sensitive/reactive skin' },
          { name: 'Neutrogena Hydro Boost Water Gel', active: 'Hyaluronic acid', price: '$18-22', best: 'Oilier skin wanting hydration w/o heaviness' },
          { name: 'La Roche-Posay Toleriane Double Repair', active: 'Ceramides + niacinamide', price: '$20-24', best: 'Combination barrier + brightening' },
        ]}
        budget="CeraVe or Vanicream"
        premium="Premium pricing here often reflects texture/fragrance, not superior barrier-repair evidence."
        valueNote={null}
      />

      <ProductCategoryTable
        title="Collagen Supplements"
        note="See Nutrition & Supplements and Skincare Ingredients for the funding-bias finding (industry-funded trials positive, independent trials null) before purchasing."
        rows={[
          { name: 'Vital Proteins Collagen Peptides', active: 'Hydrolyzed collagen', price: '$35-45/container', best: 'Most-studied brand; funding-bias caveat applies' },
          { name: 'Generic hydrolyzed collagen peptide powders', active: 'Hydrolyzed collagen', price: '$15-30/container', best: 'Comparable active at lower cost' },
        ]}
        budget="Generic hydrolyzed collagen"
        premium="No confident 'premium is worth it' pick for this category — evidence doesn't support strong brand/price differentiation."
        valueNote={null}
      />

      <ProductCategoryTable
        title="LED / Red Light Devices"
        note="See Device Therapy for full evidence — genuinely independent RCT support, but a meaningfully higher price tier than topicals."
        rows={[
          { name: 'At-home LED face masks (CurrentBody-class)', active: '630-660nm red, 830nm NIR', price: '$200-400+', best: 'Most-studied at-home category — verify wavelength matches studied parameters' },
          { name: 'Smaller handheld LED devices', active: 'Varies', price: '$50-150', best: 'Lower cost, generally lower power output' },
        ]}
        budget="Handheld device"
        premium="Full LED mask"
        valueNote="The single largest price jump on this page relative to topicals — cross-reference Cost vs Benefit Calculator before purchasing."
      />

      <SectionHeading>Common Misconceptions</SectionHeading>
      <MythFact
        myth="A higher price reliably indicates a more effective or higher-quality product."
        fact="For several of the best-evidenced actives on this page (retinol, niacinamide, vitamin C), budget and premium formulations at comparable concentrations show similar evidence-based efficacy. Premium pricing often reflects texture, packaging, fragrance, or brand positioning rather than a meaningfully different active-ingredient outcome."
      />

      <ClinicalBottomLine>
        Price and evidence-based efficacy are not reliably correlated across the categories on this page — several of the strongest-evidenced actives are available in well-formulated, inexpensive products, while some premium pricing reflects texture and brand positioning rather than superior outcomes. The clearest exception is collagen supplements, where the funding-bias finding means this page can't confidently recommend a premium option as worth the extra cost. LED devices represent the steepest price jump on this page and should be weighed against the Cost vs Benefit Calculator before purchasing.
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ['Is The Ordinary actually as good as more expensive brands?', "For several specific actives at comparable concentrations (retinol, niacinamide), yes — the active ingredient evidence doesn't distinguish by brand."],
          ['Should I buy an LED mask or spend that money elsewhere?', 'See the Cost vs Benefit Calculator for a direct comparison — LED therapy has real independent RCT evidence, but at a meaningfully higher price point than topicals with comparable or stronger evidence tiers.'],
          ['Why isn\'t this page an exhaustive database?', 'Per project direction, this is a curated list (5-10 per category) prioritizing products with clear active-ingredient evidence support over comprehensive brand coverage.'],
          ['How often are the prices on this page updated?', 'Prices reflect current market research at time of writing and will drift — treat dollar figures as directional (budget/mid/premium tier) rather than exact.'],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: '14px 18px', background: colors.bgAlt, borderRadius: 8, fontSize: 12.5, color: colors.inkSoft, fontStyle: 'italic' }}>
        Pricing and product information synthesized from current (2026) dermatologist-recommendation sources and retailer listings, cross-checked across multiple independent sources per product where possible. This page does not carry a traditional Tier 1-9 citation list, since its content is commercial/pricing information rather than a clinical efficacy claim — efficacy claims for each active ingredient are sourced and cited in full on Skincare Ingredients, Nutrition & Supplements, and Device Therapy. Content current as of mid-2026.
      </div>
    </article>
  );
}

// ============================================================
// COST VS BENEFIT CALCULATOR — sortable/filterable comparison
// ============================================================
const roiData = [
  { name: 'Daily sunscreen', evidence: 5, cost: 1, effect: 'Large (prevention)', maintenance: 'Daily, indefinite', category: 'topical' },
  { name: 'Topical retinoid', evidence: 5, cost: 1, effect: 'Moderate-Large', maintenance: 'Daily, indefinite', category: 'topical' },
  { name: 'Topical vitamin C', evidence: 4, cost: 1, effect: 'Moderate', maintenance: 'Daily, indefinite', category: 'topical' },
  { name: 'Niacinamide', evidence: 4, cost: 1, effect: 'Moderate', maintenance: 'Daily, indefinite', category: 'topical' },
  { name: 'Resistance training', evidence: 3, cost: 1, effect: 'Moderate', maintenance: '2-3x/week, indefinite', category: 'lifestyle' },
  { name: 'Tranexamic acid (melasma)', evidence: 4, cost: 2, effect: 'Moderate (pigmentation-specific)', maintenance: 'Daily, ongoing', category: 'topical' },
  { name: 'Omega-3 supplementation', evidence: 4, cost: 2, effect: 'Small-Moderate', maintenance: 'Daily, indefinite', category: 'supplement' },
  { name: 'Red/NIR light (LED) device', evidence: 4, cost: 3, effect: 'Moderate', maintenance: '3-5x/week, indefinite', category: 'device' },
  { name: 'Botulinum toxin', evidence: 5, cost: 3, effect: 'Large (dynamic wrinkles only)', maintenance: 'Every 3-4 months, indefinite', category: 'procedure' },
  { name: 'HA fillers', evidence: 4, cost: 3, effect: 'Moderate (precision caveats)', maintenance: 'Every 6-9 months, indefinite', category: 'procedure' },
  { name: 'RF microneedling', evidence: 3, cost: 3, effect: 'Moderate (20-60% range)', maintenance: '1-3 sessions, repeat 6-12mo', category: 'device' },
  { name: 'HIFU', evidence: 4, cost: 4, effect: 'Moderate (investigator) / Small (patient)', maintenance: '1 session, repeat 12mo+', category: 'device' },
  { name: 'Microcurrent device', evidence: 2, cost: 2, effect: 'Small-Unclear', maintenance: 'Frequent, indefinite', category: 'device' },
  { name: 'Thread lifts', evidence: 2, cost: 3, effect: 'Small-Moderate, thin evidence', maintenance: 'Repeat at ~12-18mo', category: 'procedure' },
  { name: 'PRP', evidence: 3, cost: 3, effect: 'Small-Moderate, highly varied', maintenance: 'Variable, understudied', category: 'procedure' },
  { name: 'Facelift / surgical', evidence: 4, cost: 4, effect: 'Large, structural', maintenance: 'Years between procedures', category: 'procedure' },
  { name: 'Collagen supplements', evidence: 3, cost: 2, effect: 'Small, funding-dependent', maintenance: 'Daily, indefinite', category: 'supplement' },
];

function ROITable() {
  const [sortBy, setSortBy] = useState('ratio');
  const [filter, setFilter] = useState('all');
  const evidenceLabel = { 5: '★★★★★', 4: '★★★★', 3: '★★★', 2: '★★', 1: '★' };
  const costLabel = { 1: 'Low', 2: 'Moderate', 3: 'High', 4: 'Very High' };

  const filtered = useMemo(() => {
    let rows = [...roiData];
    if (filter !== 'all') rows = rows.filter(r => r.category === filter);
    rows.sort((a, b) => {
      if (sortBy === 'ratio') return (b.evidence / b.cost) - (a.evidence / a.cost);
      if (sortBy === 'evidence') return b.evidence - a.evidence;
      if (sortBy === 'cost') return a.cost - b.cost;
      return a.name.localeCompare(b.name);
    });
    return rows;
  }, [sortBy, filter]);

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {[['all', 'All'], ['topical', 'Topical'], ['device', 'Device'], ['procedure', 'Procedure'], ['supplement', 'Supplement'], ['lifestyle', 'Lifestyle']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer', border: `1px solid ${filter === val ? colors.accent : colors.line}`, background: filter === val ? colors.accent : colors.white, color: filter === val ? colors.white : colors.inkSoft, fontFamily: fontBody }}
          >{label}</button>
        ))}
        <button onClick={() => setSortBy(sortBy === 'ratio' ? 'evidence' : sortBy === 'evidence' ? 'cost' : 'ratio')}
          style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer', border: `1px solid ${colors.line}`, background: colors.white, color: colors.inkSoft, fontFamily: fontBody }}
        >Sort: {sortBy === 'ratio' ? 'Cost-to-Evidence Ratio' : sortBy === 'evidence' ? 'Evidence ↓' : 'Cost ↑'}</button>
      </div>
      <div style={{ overflowX: 'auto', border: `1px solid ${colors.line}`, borderRadius: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: colors.bgAlt, textAlign: 'left' }}>
              {['Intervention', 'Evidence', 'Annual Cost', 'Expected Effect', 'Maintenance'].map(h => (
                <th key={h} style={{ padding: '10px 14px', fontFamily: fontMono, fontSize: 10.5, color: colors.inkSoft, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: `1px solid ${colors.line}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={row.name} style={{ background: i % 2 === 0 ? colors.white : colors.bg }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: colors.ink, fontFamily: fontDisplay }}>{row.name}</td>
                <td style={{ padding: '10px 14px', color: colors.star, fontFamily: fontMono, fontWeight: 600 }}>{evidenceLabel[row.evidence]}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft }}>{costLabel[row.cost]}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft, fontSize: 12.5 }}>{row.effect}</td>
                <td style={{ padding: '10px 14px', color: colors.inkSoft, fontSize: 12.5 }}>{row.maintenance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CalculatorPage() {
  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 15 OF 16 · ACT</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>Cost vs Benefit Calculator</h1>
      <div style={{ fontSize: 15.5, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640 }}>
        Every intervention reviewed on this site, placed on one framework — so "does it work" and "is it worth it" can be answered together.
      </div>

      <QuickTakeaway>
        <strong>"Strong evidence" and "worth the money" are different questions.</strong> Botulinum toxin has the strongest procedural evidence on the site but requires recurring cost every 3-4 months indefinitely; daily sunscreen has comparably strong evidence at a fraction of the cost, with no escalation over time. <strong>By cost-to-evidence ratio, the top of this ranking is dominated by inexpensive, unglamorous interventions</strong> — not devices or procedures. <strong>High cost does not predict high evidence tier anywhere on this site.</strong>
      </QuickTakeaway>

      <SectionHeading>Full Comparison</SectionHeading>
      <p style={{ fontSize: 14, color: colors.inkSoft, marginBottom: 4 }}>Filter by category or sort by cost-to-evidence ratio, evidence, or cost. Figures are drawn directly from the cited evidence on each intervention's full page.</p>
      <ROITable />

      <SectionHeading>Ranked by Annualized Cost-to-Evidence Ratio</SectionHeading>
      <p style={{ fontSize: 14, color: colors.inkSoft, marginBottom: 10 }}>This is <strong>not</strong> a ranking of absolute effect size — HIFU and facelifts produce more dramatic individual change than sunscreen, but cost vastly more per unit of independently-verified evidence.</p>
      <ol style={{ fontSize: 15, lineHeight: 1.85, color: colors.ink, paddingLeft: 22 }}>
        <li><strong>Daily sunscreen</strong> — strongest evidence on the entire site, lowest cost, no escalation over time.</li>
        <li><strong>Topical retinoid</strong> — comparably strong evidence, low cost, requires an adjustment-period patience cost.</li>
        <li><strong>Niacinamide / Vitamin C</strong> — moderate evidence, very low cost, narrower specific benefits.</li>
        <li><strong>Resistance training</strong> — emerging but genuine RCT evidence, effectively free with bodyweight training.</li>
        <li><strong>Tranexamic acid</strong> (pigmentation-specific) — strong, targeted evidence for melasma.</li>
        <li><strong>Botulinum toxin</strong> — strongest procedural evidence, but recurring cost every 3-4 months raises lifetime cost substantially.</li>
        <li><strong>Red/NIR light devices</strong> — genuinely independent RCT evidence, meaningfully higher entry cost than topicals.</li>
        <li><strong>HA fillers, RF microneedling</strong> — real, moderate evidence, real recurring cost and precision/funding caveats.</li>
        <li><strong>HIFU, facelift/surgical</strong> — real and (facelift) strong evidence, but the highest absolute costs reviewed.</li>
        <li><strong>Microcurrent, thread lifts, PRP</strong> — the weakest cost-to-evidence ratios — not necessarily worthless, but evidence tier doesn't yet justify the price point.</li>
      </ol>

      <SectionHeading>Common Misconceptions</SectionHeading>
      <MythFact
        myth="More expensive interventions generally have stronger evidence behind them, since providers and manufacturers wouldn't charge a premium otherwise."
        fact="The data on this page directly contradicts that assumption. The single strongest evidence on the entire site (daily sunscreen) is also among the cheapest interventions reviewed; some of the most expensive categories (HIFU, thread lifts) sit in the middle or bottom of the evidence-quality range."
      />

      <SectionHeading>Research Gaps</SectionHeading>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: colors.ink }}>
        "Expected effect" isn't always measured the same way across compared interventions — a topical's effect is typically measured via validated scoring over weeks-to-months, while a procedure's effect is sometimes investigator-rated immediately post-treatment (see Device Therapy's HIFU investigator-vs-patient gap). The "Expected Effect" column here is necessarily a simplification of each page's fuller discussion.
      </p>

      <ClinicalBottomLine>
        When evidence quality and annualized cost are placed on the same comparison, the highest-ROI interventions on this entire site are inexpensive, unglamorous daily habits — sunscreen first, topical retinoids close behind — not the devices or procedures that typically receive the most marketing attention. This doesn't mean procedures and devices are poor choices; several have real, substantial evidence for effects topicals genuinely cannot achieve. But their cost-to-evidence ratio is different, and recurring procedures carry a lifetime cost that's easy to underestimate when considering only one treatment at a time.
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ['Is it ever worth paying for an expensive procedure if a cheap topical has "stronger" evidence?', "Yes — evidence quality and what an intervention can mechanistically achieve are different things. No topical addresses dynamic wrinkles like botulinum toxin, or structural volume loss like a filler or facelift. This page ranks cost-to-evidence ratio, not 'which single intervention is best.'"],
          ['Why does sunscreen rank so much higher than Botox if both have equally strong evidence?', 'Botox requires repeat treatment every 3-4 months indefinitely, while sunscreen is a low, flat daily cost with no escalation — the same evidence tier at a very different lifetime cost changes the ROI ranking even though it doesn\'t change which one "works."'],
          ['Should I stop using a low-ranked intervention because it\'s at the bottom of this page?', "Not necessarily — a low ranking reflects the current state of independent research, not a definitive verdict. Several lower-ranked items have genuine biological plausibility; their literature just hasn't caught up yet."],
          ['Does this page account for individual results varying?', 'No — this is a population-level comparison, not a personalized prediction. See Age, Genetics & Skin Type for why individual variation matters, and consult a provider before a procedural decision.'],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: '14px 18px', background: colors.bgAlt, borderRadius: 8, fontSize: 12.5, color: colors.inkSoft, fontStyle: 'italic' }}>
        This page synthesizes evidence ratings, longevity figures, and cost ranges already established and cited in full on: Lifestyle (sunscreen), Skincare Ingredients (retinoid, vitamin C, niacinamide, tranexamic acid), Exercise & Body Composition (resistance training), Nutrition & Supplements (omega-3, collagen), Device Therapy (LED, RF microneedling, microcurrent, HIFU), and Cosmetic Procedures (botulinum toxin, fillers, thread lifts, PRP, facelift). No new primary sources are introduced on this page; see each linked page's References section for underlying citations.
      </div>
    </article>
  );
}

// ============================================================
// MYTH ENTRY — collapsible, searchable
// ============================================================
function MythEntry({ q, verdict, verdictColor, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${colors.line}`, borderRadius: 10, marginBottom: 12, overflow: 'hidden', background: colors.white }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{ fontFamily: fontDisplay, fontSize: 16.5, fontWeight: 600, color: colors.ink, flex: 1, paddingRight: 12 }}>{q}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{ fontFamily: fontMono, fontSize: 11, padding: '4px 10px', borderRadius: 12, background: verdictColor + '22', color: verdictColor, fontWeight: 700 }}>{verdict}</span>
          <span style={{ fontSize: 18, color: colors.inkSoft, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>⌄</span>
        </div>
      </button>
      {open && <div style={{ padding: '0 20px 18px 20px', borderTop: `1px solid ${colors.line}`, fontSize: 14.5, lineHeight: 1.65, color: colors.ink }}><div style={{ paddingTop: 14 }}>{children}</div></div>}
    </div>
  );
}

const mythData = [
  { q: 'Does collagen cream build collagen?', verdict: 'Myth (with nuance)', color: colors.safetyCaution, tags: 'collagen cream topical' },
  { q: 'Can loose skin be tightened without surgery?', verdict: 'Partially True', color: colors.safetyCaution, tags: 'loose skin surgery tightening' },
  { q: 'Does red light therapy work?', verdict: 'Fact', color: colors.safetyGood, tags: 'red light therapy LED device' },
  { q: 'Is expensive skincare better?', verdict: 'Myth', color: colors.safetySig, tags: 'expensive cheap price luxury' },
  { q: 'Are luxury brands worth it?', verdict: 'Preference, Not Evidence', color: colors.safetyCaution, tags: 'luxury brands worth it price' },
  { q: 'Does sugar age skin?', verdict: 'Fact', color: colors.safetyGood, tags: 'sugar glycation diet' },
  { q: 'Does alcohol age skin?', verdict: 'Unresolved', color: colors.inkSoft, tags: 'alcohol drinking skin aging' },
  { q: 'Does vaping age skin?', verdict: 'Likely, Not Proven', color: colors.safetyCaution, tags: 'vaping nicotine skin' },
  { q: 'Do facial exercises work?', verdict: 'Promising, Not Proven', color: colors.safetyCaution, tags: 'facial exercises face yoga' },
  { q: 'Can supplements replace skincare?', verdict: 'Myth', color: colors.safetySig, tags: 'supplements replace skincare' },
  { q: '"Medical-grade" — actually different?', verdict: 'Myth (as blanket claim)', color: colors.safetySig, tags: 'medical grade products' },
];

// ============================================================
// MYTHS VS FACTS — FULL PAGE
// ============================================================
function MythsPage() {
  const [search, setSearch] = useState('');
  const filtered = mythData.filter(m => (m.q + m.tags).toLowerCase().includes(search.toLowerCase()));

  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 13 OF 16 · ACT</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>Myths vs Facts</h1>
      <div style={{ fontSize: 15.5, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640 }}>
        Direct, evidence-based verdicts on the claims people ask about most — phrased the way you'd actually ask, not in clinical language.
      </div>

      <QuickTakeaway>
        Several popular claims here are <strong>genuinely more nuanced than a simple yes/no</strong>. Some myths get debunked in the expected direction (collagen cream, facial exercises lack robust evidence); <strong>others get debunked in the opposite direction</strong> — sunscreen, often dismissed as "just" a basic step, is this site's single best-evidenced intervention.
      </QuickTakeaway>

      <input
        type="text"
        placeholder="Search a claim (e.g. 'sugar', 'expensive', 'collagen')..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', padding: '12px 16px', fontSize: 14.5, border: `1px solid ${colors.line}`,
          borderRadius: 8, marginBottom: 20, marginTop: 24, fontFamily: fontBody, boxSizing: 'border-box',
        }}
      />

      {filtered.length === 0 && <p style={{ color: colors.inkSoft, fontSize: 14 }}>No matching claims — try a different search term.</p>}

      <MythEntry q="Does collagen cream build collagen?" verdict="Myth (with nuance)" verdictColor={colors.safetyCaution}>
        <p>No, not by penetrating and directly adding to your skin's existing collagen — but some formulations can still measurably help via a different mechanism. Collagen molecules are far too large to cross the skin barrier (the practical penetration limit is around 500 Daltons; collagen is vastly larger).<Citation n={1} /> However, specially processed micronized or hydrolyzed collagen formulations, engineered around that size barrier, have shown measurable hydration and firmness improvements in some controlled studies — most likely by acting as a humectant/surface-conditioning agent, not by triggering new dermal collagen synthesis.<Citation n={2} /><Citation n={3} /></p>
        <p style={{ fontSize: 13.5, color: colors.inkSoft, fontStyle: 'italic' }}>"Collagen cream rebuilds your collagen" overstates the mechanism. "A well-formulated collagen-containing product may modestly hydrate and condition skin, similar to other humectants" is more accurate. See Skincare Ingredients for hyaluronic acid's better-established version of this mechanism.</p>
      </MythEntry>

      <MythEntry q="Can loose skin be tightened without surgery?" verdict="Partially True" verdictColor={colors.safetyCaution}>
        <p>Partially, for mild-moderate laxity — but significant excess skin cannot be meaningfully reduced without surgical removal. HIFU has genuine systematic-review-level evidence for mild-moderate tightening; RF microneedling shows real, measurable improvement with manufacturer-funding caveats (see Device Therapy). Resistance training can improve the tissue underneath loose skin but doesn't reduce actual excess skin volume (see Exercise & Body Composition).</p>
        <p style={{ fontSize: 13.5, color: colors.inkSoft, fontStyle: 'italic' }}>Significant excess skin — the kind that follows substantial weight loss — isn't meaningfully addressed by any non-surgical option reviewed; see Cosmetic Procedures' body contouring section.</p>
      </MythEntry>

      <MythEntry q="Does red light therapy work?" verdict="Fact" verdictColor={colors.safetyGood}>
        <p>Yes, with genuinely independent RCT support — one of the better-evidenced device categories on this site, including real split-face RCTs showing measurable wrinkle reduction and increased collagen density (see Device Therapy). It's mechanistically distinct from most other devices, working atraumatically rather than via controlled injury.</p>
        <p style={{ fontSize: 13.5, color: colors.inkSoft, fontStyle: 'italic' }}>Standard caveat: gradual improvement over weeks of consistent use, not an immediate transformation; at-home devices likely deliver a smaller effect than higher-powered clinic versions.</p>
      </MythEntry>

      <MythEntry q="Is expensive skincare better?" verdict="Myth" verdictColor={colors.safetySig}>
        <p>Not reliably — concentration and formulation of the active ingredient matter far more than price tier. Rigorous, dedicated comparative trials (luxury vs. drugstore, head-to-head) are largely absent from peer-reviewed literature; most discussion comes from consumer/industry commentary. What the evidence-based pages on this site consistently show: the same active ingredients work via the same mechanism regardless of brand, and several of the best-evidenced products are inexpensive (see Products Guide).</p>
      </MythEntry>

      <MythEntry q="Are luxury brands worth it?" verdict="Preference, Not Evidence" verdictColor={colors.safetyCaution}>
        <p>Sometimes, for reasons unrelated to efficacy. If the experience, texture, or brand relationship genuinely adds value and budget allows, that's a legitimate reason to choose a product. But for whether luxury pricing predicts stronger evidence-based outcomes specifically — no, consistent with the section above.</p>
      </MythEntry>

      <MythEntry q="Does sugar age skin?" verdict="Fact" verdictColor={colors.safetyGood}>
        <p>Yes, via a specific, well-understood mechanism — glycation. Sugar molecules bind to collagen and other proteins, forming advanced glycation end-products (AGEs) that make collagen stiffer and harder to renew (see The Science of Aging). This is real, established biochemistry.</p>
        <p style={{ fontSize: 13.5, color: colors.inkSoft, fontStyle: 'italic' }}>No precise, quantified "X grams of sugar = Y skin aging" figure exists — that specific dose-response relationship isn't well-isolated in human literature the way the underlying mechanism is.</p>
      </MythEntry>

      <MythEntry q="Does alcohol age skin?" verdict="Unresolved" verdictColor={colors.inkSoft}>
        <p>Genuinely unresolved in the current literature, and this page won't pretend otherwise. Some studies find an association with facial aging signs; other, larger studies find none, with researchers attributing the inconsistency to differences in how alcohol consumption was measured across studies (see Lifestyle). One study finding an association was funded by a company with a commercial interest in cosmetic procedures — a relevant disclosure, not proof the finding is wrong.</p>
        <p style={{ fontSize: 13.5, color: colors.inkSoft, fontStyle: 'italic' }}>Be skeptical of confident claims in either direction, including any "years of aging per drink" figure, which the literature doesn't support.</p>
      </MythEntry>

      <MythEntry q="Does vaping age skin?" verdict="Likely, Not Proven" verdictColor={colors.safetyCaution}>
        <p>Probably similar mechanisms to smoking, but the dedicated long-term evidence doesn't exist yet. Rated weak evidence specifically because of a data-maturity gap — vaping hasn't been around long enough to generate the decades of population data combustible smoking has (see Lifestyle). This is a data gap, not a reassurance that vaping is safe for skin.</p>
      </MythEntry>

      <MythEntry q="Do facial exercises work?" verdict="Promising, Not Proven" verdictColor={colors.safetyCaution}>
        <p>Some genuinely positive small studies exist, but the field's own systematic review concludes evidence is currently insufficient. A 2013 review found that while all 9 studies reviewed reported positive outcomes, none used a control group or randomization — most were single case reports or small case series, assessed subjectively without blinding.<Citation n={4} /> The review's direct conclusion: evidence is insufficient, and large RCTs are needed before conclusions can be drawn.</p>
        <p>More recent individual studies are more encouraging — including a clinical trial finding facial exercise associated with improved appearance, and an 8-week face yoga trial finding measurable reductions in facial muscle tension via objective tonometry.<Citation n={5} /><Citation n={6} /> But these remain individual studies, not the rigorous controlled evidence base the field's own review says is still needed.</p>
        <p style={{ fontSize: 13.5, color: colors.inkSoft, fontStyle: 'italic' }}>This is a "the evidence hasn't caught up yet" case, distinct from either debunked or proven — closer in evidentiary shape to PRP or thread lifts than to a settled myth.</p>
      </MythEntry>

      <MythEntry q="Can supplements replace skincare?" verdict="Myth" verdictColor={colors.safetySig}>
        <p>No — oral and topical interventions largely address different things. The strongest oral supplement evidence (omega-3 photoprotection, probiotics) is explicitly described in the underlying research as additive/supportive, not a replacement for sunscreen or topical actives (see Nutrition & Supplements). Several supplements have their strongest evidence for specific conditions (eczema, acne) rather than general anti-aging.</p>
      </MythEntry>

      <MythEntry q='"Medical-grade" — actually different?' verdict="Myth (as blanket claim)" verdictColor={colors.safetySig}>
        <p>"Medical-grade" is not a regulated term, and its use doesn't guarantee superior formulation. Unlike "prescription" (a genuine regulatory category), "medical-grade" has no formal FDA definition in cosmetics. Some products marketed this way genuinely do contain higher-concentration, well-evidenced actives — the label itself just isn't a reliable signal either way. Check the active ingredient and concentration directly (see Skincare Ingredients).</p>
      </MythEntry>

      <SectionHeading>Clinical Bottom Line</SectionHeading>
      <ClinicalBottomLine>
        Across the claims on this page, the pattern that holds throughout this site repeats: evidence quality and popular belief don't reliably track each other in either direction. Some popular claims hold up (red light therapy, sugar's glycation mechanism); some don't (collagen cream rebuilding collagen, supplements replacing skincare, expensive skincare being reliably superior); a few are genuinely unresolved rather than cleanly true or false (alcohol, facial exercises). The throughline is to check what was actually measured before accepting either a confident debunking or a confident endorsement.
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ["Why doesn't every myth here get a clean yes/no?", "Because several genuinely don't have one — the evidence itself is sometimes inconclusive (facial exercises, alcohol) rather than this page being deliberately vague."],
          ['If a myth is "busted," does that mean the practice is useless?', '"The evidence doesn\'t currently support this specific claim" is different from "proven not to work." Several items have genuine biological plausibility; they just don\'t meet this site\'s bar for a confident "yes" yet.'],
          ['Where can I find full citations behind these verdicts?', 'Most draw on evidence cited in full on the linked deep-dive pages. New sources specific to this page (collagen penetration, facial exercise review) are listed below.'],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>

      <SectionHeading>References</SectionHeading>
      <div style={{ fontSize: 12.5, color: colors.inkSoft, lineHeight: 1.8, fontFamily: fontMono }}>
        {[
          'The Role of Collagen in Skin Care. Art of Dermatology, citing the ~500 Dalton skin-penetration threshold. Tier 8.',
          'A Novel Facial Cream Based on Skin-penetrable Fibrillar Collagen Microparticles. PMC. Tier 7.',
          'Collagen Supplements for Aging and Wrinkles: A Paradigm Shift. PMC, review of oral/topical collagen RCTs. Tier 2.',
          'Van Borsel et al. The Effectiveness of Facial Exercises for Facial Rejuvenation: A Systematic Review. Tier 2 — evidence insufficient, no controlled/randomized studies.',
          'Alam et al. Association of Facial Exercise With the Appearance of Aging. PMC, unblinded clinical trial. Tier 3.',
          'Effect of Intensive Face Yoga on Facial Muscles Tonus, Stiffness, and Elasticity in Middle-Aged Women. Medicina, 2025. Tier 7 (no control group).',
        ].map((ref, i) => (
          <div key={i} style={{ marginBottom: 6 }}>[{i + 1}] {ref}</div>
        ))}
        <div style={{ marginTop: 12, fontStyle: 'italic', color: colors.inkSoft }}>
          Source-quality note (Phase 2 §3-4): The expensive-skincare sections drew primarily on consumer/industry commentary rather than peer-reviewed comparative trials, since a dedicated rigorous trial of this specific question does not appear to exist — this absence is noted in Research Gaps rather than papered over.
        </div>
      </div>
    </article>
  );
}

// ============================================================
// ROUTINE BUILDER — real interactive tier selector
// ============================================================
const routineTiers = {
  beginner: {
    label: 'Beginner', cost: 'Low',
    am: ['Gentle cleanser', 'Moisturizer', 'Broad-spectrum SPF 30+'],
    pm: ['Gentle cleanser', 'Moisturizer'],
    weekly: [], monthly: [],
    why: "Daily sunscreen alone is this site's single best-evidenced intervention. This is the foundation every other tier builds on.",
  },
  budget: {
    label: 'Budget', cost: 'Low',
    am: ['Gentle cleanser', 'Niacinamide serum', 'Moisturizer', 'SPF 30+'],
    pm: ['Gentle cleanser', 'Retinol (2-3x/week to start)', 'Moisturizer'],
    weekly: [], monthly: [],
    why: 'Niacinamide and retinol are both strong/moderate-evidence actives available at very low cost — real benefit without a large cost increase.',
  },
  intermediate: {
    label: 'Intermediate', cost: 'Low-Moderate',
    am: ['Gentle cleanser', 'Vitamin C serum', 'Niacinamide (optional)', 'Moisturizer', 'SPF 30+'],
    pm: ['Gentle cleanser', 'Retinol (building toward nightly)', 'Moisturizer'],
    weekly: ['Gentle AHA exfoliation 1-2x/week on non-retinoid nights'],
    monthly: [],
    why: 'Adds vitamin C as a morning antioxidant and a weekly exfoliation option, while preserving the retinoid/AHA separation rule.',
  },
  advanced: {
    label: 'Advanced', cost: 'Moderate-High',
    am: ['Gentle cleanser', 'Vitamin C', 'Niacinamide', 'Moisturizer', 'SPF 30+ (tinted/iron-oxide if melasma-prone)'],
    pm: ['Gentle cleanser', 'Retinoid (nightly) OR pigmentation actives (alternate nights)', 'Moisturizer'],
    weekly: ['AHA/BHA on non-retinoid nights', 'Optional LED session 3-5x/week'],
    monthly: ['Reassess progress; consider prescription tretinoin if OTC has plateaued'],
    why: 'Introduces targeted pigmentation actives and an optional device layer with genuinely independent evidence (LED).',
  },
  premium: {
    label: 'Premium', cost: 'High',
    am: ['Gentle cleanser', 'Vitamin C (combination formula, e.g. C+E+ferulic)', 'Niacinamide', 'Moisturizer', 'SPF 30+'],
    pm: ['Gentle cleanser', 'Prescription tretinoin (per physician guidance)', 'Moisturizer'],
    weekly: ['AHA/BHA on non-retinoid nights', 'LED session 3-5x/week'],
    monthly: ['Consider professional treatment escalation (peel, RF microneedling)'],
    why: "Access to prescription-strength tretinoin and professional treatments — doesn't assume more expensive automatically means proportionally better results.",
  },
};

function RoutineBuilder() {
  const [tier, setTier] = useState('beginner');
  const r = routineTiers[tier];

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(routineTiers).map(([key, t]) => (
          <button key={key} onClick={() => setTier(key)}
            style={{
              padding: '10px 18px', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontFamily: fontBody, fontWeight: 600,
              border: `1.5px solid ${tier === key ? colors.accent : colors.line}`,
              background: tier === key ? colors.accent : colors.white,
              color: tier === key ? colors.white : colors.ink,
            }}
          >{t.label}</button>
        ))}
      </div>

      <div style={{ background: colors.white, border: `1px solid ${colors.line}`, borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div style={{ fontFamily: fontDisplay, fontSize: 24, fontWeight: 700, color: colors.accent }}>{r.label} Routine</div>
          <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, textTransform: 'uppercase' }}>Annual cost: {r.cost}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.star, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>☀ Morning</div>
            <ol style={{ fontSize: 14, lineHeight: 1.7, color: colors.ink, paddingLeft: 20, margin: 0 }}>
              {r.am.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
          <div>
            <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>☾ Evening</div>
            <ol style={{ fontSize: 14, lineHeight: 1.7, color: colors.ink, paddingLeft: 20, margin: 0 }}>
              {r.pm.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
        </div>

        {r.weekly.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.tier, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Weekly</div>
            <ul style={{ fontSize: 13.5, lineHeight: 1.6, color: colors.inkSoft, paddingLeft: 20, margin: 0 }}>
              {r.weekly.map((step, i) => <li key={i}>{step}</li>)}
            </ul>
          </div>
        )}
        {r.monthly.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.tier, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Monthly</div>
            <ul style={{ fontSize: 13.5, lineHeight: 1.6, color: colors.inkSoft, paddingLeft: 20, margin: 0 }}>
              {r.monthly.map((step, i) => <li key={i}>{step}</li>)}
            </ul>
          </div>
        )}

        <div style={{ paddingTop: 14, borderTop: `1px solid ${colors.line}`, fontSize: 13.5, color: colors.inkSoft, lineHeight: 1.6 }}>
          <strong style={{ color: colors.ink }}>Why this works:</strong> {r.why}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// BUILD YOUR ROUTINE — FULL PAGE
// ============================================================
function RoutinePage() {
  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 14 OF 16 · ACT</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>Build Your Routine</h1>
      <div style={{ fontSize: 15.5, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640 }}>
        Five tiers, each built from already-cited active ingredients, correctly layered. Tap a tier below to see the full routine.
      </div>

      <QuickTakeaway>
        <strong>Tier reflects complexity and budget, not "better skin."</strong> The Beginner tier (sunscreen + gentle cleanser) covers this site's single strongest-evidenced intervention; every tier above adds complexity and cost without necessarily adding proportional benefit. <strong>Layering order is not arbitrary</strong> — thinnest to thickest, water-based before oil-based, sunscreen always last in the morning. <strong>More products is not the goal</strong> — introducing actives one at a time matters more than routine complexity.
      </QuickTakeaway>

      <SectionHeading>The Layering Rule (Applies to Every Tier)</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Across every dermatologist-sourced guide reviewed for this page, the consistent rule is: <strong>cleanse first, then layer thinnest to thickest, with sunscreen always the final morning step.</strong><Citation n={1} /><Citation n={2} /> A brief pause (roughly 30-90 seconds) between layers lets each product absorb before the next sits on top.<Citation n={2} /><Citation n={3} /></p>
      <ClinicalPearl>
        Morning logic: protection-focused (antioxidant, then SPF last). Evening logic: repair-focused (active/retinoid, then moisturizer to buffer). Never layer two strong actives in the same session (e.g., retinoid + AHA) — alternate nights instead.
      </ClinicalPearl>

      <SectionHeading>Build Your Routine</SectionHeading>
      <RoutineBuilder />

      <SectionHeading>Common Misconceptions</SectionHeading>
      <MythFact
        myth="A higher tier on this page means meaningfully better results."
        fact="Tier reflects complexity, targeted-concern coverage, and cost — not a guarantee of proportionally better outcomes. The Beginner tier alone (consistent sunscreen) captures this site's single strongest-evidenced benefit; higher tiers add narrower, additional benefits rather than multiplying the foundation's effect."
      />

      <SectionHeading>Research Gaps</SectionHeading>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: colors.ink }}>
        There is no dedicated clinical trial testing "five-tier routine structures" as such — each tier is built from individually-evidenced actives combined according to verified layering-order literature, not tested as an assembled routine in a single study.
      </p>

      <ClinicalBottomLine>
        Every tier on this page is built from the same evidence-based foundation — daily sunscreen and, eventually, a retinoid — with each successive tier adding narrower, additional-evidence actives rather than replacing the foundation. Layering order follows a consistent, verified rule that affects how well any tier's actives actually work. Moving up a tier is a complexity and budget decision, not a guarantee of proportionally better results.
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ['Do I need to start at Beginner even if I want to use retinol right away?', 'Not strictly — but starting with consistent sunscreen first, then adding one active at a time, reduces the risk of irritation that leads people to abandon a new active before giving it a fair trial.'],
          ['Can I mix tiers (e.g., Premium sunscreen with Budget retinol)?', "Yes — tiers are organizational groupings, not a strict package. Mixing budget and premium products across categories is consistent with Products Guide's finding that price and efficacy aren't reliably correlated."],
          ['Why does Premium include treatments costing much more than the topical tiers?', 'At higher budget levels, devices and procedures with genuine evidence become a reasonable consideration — but check Cost vs Benefit Calculator before assuming higher cost means proportionally higher benefit.'],
          ["What if I can't tolerate retinoids at all?", "See Skincare Ingredients' bakuchiol entry — a lower-irritation alternative with a real, smaller evidence base, reasonable to substitute into any tier's PM retinoid slot."],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>

      <SectionHeading>References</SectionHeading>
      <div style={{ fontSize: 12.5, color: colors.inkSoft, lineHeight: 1.8, fontFamily: fontMono }}>
        {[
          'How to Layer Skincare Products: The Science of Correct Application Order, citing Biomedical Dermatology (2020) absorption research. Tier 8.',
          'How to Layer Skincare Products in the Right Order, citing Dr. Michael I. Jacobs (Weill Cornell Dermatology). Tier 8.',
          'How to correctly layer skincare: order, timing, what clashes, citing AAD guidance on sunscreen as final morning step. Tier 8/1.',
        ].map((ref, i) => (
          <div key={i} style={{ marginBottom: 6 }}>[{i + 1}] {ref}</div>
        ))}
        <div style={{ marginTop: 12, fontStyle: 'italic', color: colors.inkSoft }}>
          Source-quality note (Phase 2 §3-4): Layering-order guidance is consistent across every dermatologist-sourced guide reviewed — this consistency across independent sources, rather than any single study, supports confidence here, since dedicated RCT evidence isolating "layering order" as a variable doesn't exist the way ingredient efficacy trials do.
        </div>
      </div>
    </article>
  );
}

// ============================================================
// GLOSSARY ENTRY + SEARCH
// ============================================================
const glossaryData = [
  { term: 'AGEs (Advanced Glycation End-Products)', def: "Compounds formed when sugars bind to proteins like collagen without enzymatic help, making the protein stiffer and harder for the body to renew.", link: 'science' },
  { term: 'Cellular senescence', def: "A state where cells permanently stop dividing but don't die, instead secreting inflammatory signals that damage surrounding tissue. Driven by telomere shortening and mitochondrial dysfunction.", link: 'science' },
  { term: 'Collagen', def: "The dermis's main structural protein, responsible for skin firmness. Declines with both intrinsic and extrinsic aging.", link: 'science' },
  { term: 'Elastin', def: "The protein responsible for skin's recoil/elasticity. Under UV exposure, production increases but becomes disorganized (see solar elastosis).", link: 'science' },
  { term: 'Extrinsic aging (photoaging)', def: 'Aging caused by environmental factors, overwhelmingly UV exposure. Tends to produce more dramatic visible change than intrinsic aging alone.', link: 'science' },
  { term: 'Fitzpatrick scale', def: 'A six-category skin classification originally designed to predict UV burn/tan response and guide phototherapy dosing — not a measure of race or ethnicity, despite documented clinical misuse in that direction.', link: 'genetics' },
  { term: 'Glycation', def: 'See AGEs.', link: 'science' },
  { term: 'Intrinsic aging', def: 'The natural, chronological aging process driven by genetics, occurring even on sun-protected skin.', link: 'science' },
  { term: 'MED (Minimal Erythemal Dose)', def: 'The lowest UV dose that produces detectable sunburn 24 hours later; used as a research measure of photoprotection.', link: 'nutrition' },
  { term: 'Melanocyte', def: 'The cell responsible for producing melanin (pigment). Becomes hyperactive in melasma and activated as a protective response in PIH.', link: 'pigmentation' },
  { term: 'MMPs (Matrix Metalloproteinases)', def: 'Enzymes activated by UV exposure that actively degrade existing collagen while suppressing new collagen production. A primary mechanism well-evidenced actives (retinoids, vitamin C) work by inhibiting.', link: 'science' },
  { term: 'PIH (Post-Inflammatory Hyperpigmentation)', def: 'Localized dark marks from a specific prior inflammatory event, distinct from melasma\'s ongoing hormonal/light-driven process.', link: 'pigmentation' },
  { term: 'RCT (Randomized Controlled Trial)', def: 'A study design where participants are randomly assigned to an intervention or control/comparator, minimizing bias. Tier 3 on this site\'s evidence hierarchy.', link: null },
  { term: 'Solar elastosis', def: 'The microscopic hallmark of photoaging: a disorganized buildup of damaged elastic fibers in the upper-to-mid dermis.', link: 'science' },
  { term: 'Tretinoin', def: 'The prescription-strength retinoid (vitamin A derivative); the most rigorously evidenced topical anti-aging active reviewed on this site.', link: 'ingredients' },
];

function GlossarySearch({ setPage }) {
  const [search, setSearch] = useState('');
  const filtered = glossaryData.filter(g => (g.term + g.def).toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <input
        type="text"
        placeholder="Search a term (e.g. 'collagen', 'Fitzpatrick', 'RCT')..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '12px 16px', fontSize: 14.5, border: `1px solid ${colors.line}`, borderRadius: 8, marginBottom: 20, fontFamily: fontBody, boxSizing: 'border-box' }}
      />
      {filtered.length === 0 && <p style={{ color: colors.inkSoft, fontSize: 14 }}>No matching terms.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(g => (
          <div key={g.term} style={{ padding: '14px 18px', border: `1px solid ${colors.line}`, borderRadius: 8, background: colors.white }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
              <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 700, color: colors.ink }}>{g.term}</div>
              {g.link && (
                <button onClick={() => setPage(g.link)} style={{ background: 'none', border: 'none', color: colors.accent, fontSize: 12, cursor: 'pointer', fontFamily: fontBody, fontWeight: 600, flexShrink: 0 }}>
                  See full page →
                </button>
              )}
            </div>
            <div style={{ fontSize: 14, color: colors.inkSoft, lineHeight: 1.6, marginTop: 4 }}>{g.def}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// EVIDENCE TABLES (rating system + hierarchy)
// ============================================================
function EvidenceRatingTable() {
  const rows = [
    { stars: '★★★★★', label: 'Strong Evidence', desc: 'Guideline-level or meta-analysis/systematic-review support, consistent across multiple independent, adequately powered studies.' },
    { stars: '★★★★', label: 'Moderate Evidence', desc: 'Multiple RCTs, generally consistent, reasonable sample sizes.' },
    { stars: '★★★', label: 'Emerging Evidence', desc: 'A small number of RCTs or good cohort data; promising but not yet widely replicated, or mixed results.' },
    { stars: '★★', label: 'Weak Evidence', desc: 'Mostly case-control, cross-sectional, or mechanistic/animal/lab data; human clinical data sparse.' },
    { stars: '★', label: 'Minimal Evidence', desc: 'Expert opinion or marketing/anecdote only, or contradicted by what limited evidence exists.' },
  ];
  return (
    <div style={{ overflowX: 'auto', border: `1px solid ${colors.line}`, borderRadius: 10, margin: '16px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.label} style={{ background: i % 2 === 0 ? colors.white : colors.bg }}>
              <td style={{ padding: '12px 16px', color: colors.star, fontFamily: fontMono, fontWeight: 700, whiteSpace: 'nowrap' }}>{r.stars}</td>
              <td style={{ padding: '12px 16px', fontFamily: fontDisplay, fontWeight: 600, color: colors.ink, whiteSpace: 'nowrap' }}>{r.label}</td>
              <td style={{ padding: '12px 16px', color: colors.inkSoft }}>{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SourceTierTable() {
  const rows = [
    { tier: '1', label: 'Clinical practice guidelines, professional society guidelines, government health agencies' },
    { tier: '2', label: 'Umbrella reviews, meta-analyses, systematic reviews' },
    { tier: '3', label: 'Randomized controlled trials (RCTs)' },
    { tier: '4', label: 'Prospective cohort studies' },
    { tier: '5', label: 'Case-control studies' },
    { tier: '6', label: 'Cross-sectional studies' },
    { tier: '7', label: 'Mechanistic, animal, or laboratory studies' },
    { tier: '8', label: 'Expert opinion (including dermatologist-authored clinical-education content)' },
    { tier: '9', label: 'Marketing claims, influencer claims, anecdotal reports' },
  ];
  return (
    <div style={{ overflowX: 'auto', border: `1px solid ${colors.line}`, borderRadius: 10, margin: '16px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.tier} style={{ background: i % 2 === 0 ? colors.white : colors.bg }}>
              <td style={{ padding: '10px 16px', fontFamily: fontMono, fontWeight: 700, color: colors.accent, width: 60 }}>Tier {r.tier}</td>
              <td style={{ padding: '10px 16px', color: colors.ink, fontSize: 13 }}>{r.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// GLOSSARY & EVIDENCE KEY — FULL PAGE (final, 16th page)
// ============================================================
function GlossaryPage({ setPage }) {
  return (
    <article>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.inkSoft, marginBottom: 8, letterSpacing: '0.04em' }}>PAGE 16 OF 16 · REFERENCE</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 38, fontWeight: 700, color: colors.ink, marginBottom: 8, lineHeight: 1.15 }}>Glossary & Evidence Key</h1>
      <div style={{ fontSize: 15.5, color: colors.inkSoft, lineHeight: 1.6, maxWidth: 640 }}>
        A lookup, not a linear read. Every page on this site uses the ★ rating system and a set of recurring terms — defined once here.
      </div>

      <SectionHeading>The Evidence Rating System</SectionHeading>
      <p style={{ fontSize: 15.5, lineHeight: 1.75, color: colors.ink }}>
        Every intervention reviewed on this site is rated on <strong>multiple separate axes</strong> — never blended into a single combined score. This is the most important thing to understand about how ratings work here.
      </p>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 17, color: colors.ink, marginTop: 20, marginBottom: 8 }}>Evidence Quality (the ★ rating shown throughout)</h3>
      <EvidenceRatingTable />
      <p style={{ fontSize: 14.5, lineHeight: 1.7, color: colors.ink, marginTop: 12 }}>
        This rating always means evidence quality specifically — never effect size, safety, or cost. Those appear as separate, adjacent ratings: <strong>Magnitude of Effect</strong> (Large/Moderate/Small/Negligible-Unclear), <strong>Safety</strong> (Generally well-tolerated/Moderate caution/Significant caution), <strong>Consistency</strong> (Highly/Mostly consistent/Inconsistent), and <strong>Long-Term Data</strong> (Available/Limited/Absent).
      </p>
      <ClinicalPearl>
        An intervention can be ★★★★★ (strong evidence) for a small effect, or ★★ (weak evidence) for a claim of large effect. Collapsing these into one score would hide exactly the distinction this site is built to preserve.
      </ClinicalPearl>

      <SectionHeading>The Evidence Hierarchy (Source Tiers)</SectionHeading>
      <p style={{ fontSize: 14.5, color: colors.inkSoft, marginBottom: 4 }}>Used throughout every page's References section, strongest to weakest:</p>
      <SourceTierTable />
      <p style={{ fontSize: 14, color: colors.inkSoft, marginTop: 8 }}>A single Tier 1-2 source generally outweighs multiple Tier 7-9 sources — this site does not "average" evidence quality across tiers.</p>

      <SectionHeading>Glossary</SectionHeading>
      <GlossarySearch setPage={setPage} />

      <SectionHeading>Common Misconceptions</SectionHeading>
      <MythFact
        myth='A single ★ rating can tell you everything you need to know about whether an intervention is "worth it."'
        fact="Evidence quality (★) is one of several axes this site tracks — magnitude of effect, safety, cost, and consistency are reported separately precisely because they answer different questions. A reader who only looks at the star count misses most of what this site is trying to communicate."
      />

      <ClinicalBottomLine>
        This page is infrastructure, not a clinical claim in itself — it exists so the rating system and recurring terminology used across all 15 other pages don't need re-explaining each time. The single most important thing to carry into every other page: evidence quality, effect size, safety, and cost are tracked separately, never blended into one score.
      </ClinicalBottomLine>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          ["Why isn't there a single combined 'score' for each intervention?", 'Because blending evidence quality with effect size, safety, and cost would hide exactly the distinctions this site is built to preserve — a well-proven small effect should look different from an unproven large claim.'],
          ['What does it mean if a page cites a "Tier 8" source?', 'Expert opinion or clinical-education content — useful for mechanism explanations or practical synthesis, but a different (lower) evidence standard than a systematic review or RCT.'],
          ['Is this page itself evidence-based?', "This page doesn't make clinical claims of its own — it consolidates definitions already established and cited on the content pages it links to."],
        ].map(([q, a]) => (
          <div key={q}>
            <div style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: colors.ink, marginBottom: 4 }}>{q}</div>
            <div style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: '14px 18px', background: colors.bgAlt, borderRadius: 8, fontSize: 12.5, color: colors.inkSoft, fontStyle: 'italic' }}>
        This page does not carry its own References section, since it introduces no new claims — every term and rating definition links back to the content page where it's established and cited in full.
      </div>
    </article>
  );
}

