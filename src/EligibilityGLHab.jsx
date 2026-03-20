import { useState, useMemo } from "react";

// ─── Icons (inline SVG, matching Product Studio) ────────────────────────────
const Icons = {
  Shield: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Lock: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Unlock: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>,
  Package: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  AlertTriangle: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Zap: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  FileText: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  DollarSign: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Settings: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Layout: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  Home: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Map: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  ArrowLeft: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  MoreVertical: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>,
  Eye: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Building: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><line x1="8" y1="6" x2="8" y2="6"/><line x1="12" y1="6" x2="12" y2="6"/><line x1="16" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/></svg>,
  Sliders: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
  Activity: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
};

// ─── GL Habitational Eligibility Data ───────────────────────────────────────

const STATES = ["GA", "FL", "SC", "NC", "AL", "TN"];

// ─── Rule Source Types ──────────────────────────────────────────────────────
// source: "product"  → Filed product definition (locked, product-owned, PS only)
// source: "guideline" → UW Guidelines (CT-owned, surfaced read-only in PS)
// source: "loa"       → Letter of Authority (CT-owned, surfaced read-only in PS)
// source: "enterprise" → Enterprise-wide rule (inherited, locked)

// Clearance Rules — hard accept/decline (like the "Clearance Rule" option in your Create Rule modal)
const CLEARANCE_RULES = [
  // ── Product-filed rules (locked in PS) ──
  { id: "cr-1", name: "Minimum Building Age", field: "Year Built", operator: "≥", value: "1960", action: "decline", failMessage: "Auto-decline pre-1960 construction", status: "active", triggered30d: 12, triggeredPct: "3%", updated: "Feb 15, 2026",
    source: "product", sourceDetail: "Filed product definition — GL Hab form GL-HAB-001", locked: true },
  { id: "cr-2", name: "Maximum TIV per Location", field: "TIV", operator: "≤", value: "$25,000,000", action: "decline", failMessage: "TIV exceeds single-location maximum", status: "active", triggered30d: 4, triggeredPct: "1%", updated: "Jan 20, 2026",
    source: "product", sourceDetail: "Reinsurance treaty cap — Treaty #RT-2026-HAB", locked: true },
  { id: "cr-3", name: "Prohibited Occupancy — Nightclub", field: "Occupancy Type", operator: "≠", value: "Nightclub/Bar", action: "decline", failMessage: "Excluded occupancy class", status: "active", triggered30d: 7, triggeredPct: "2%", updated: "Jan 8, 2026",
    source: "product", sourceDetail: "Filed exclusion — GL Hab form GL-HAB-001 §4.2", locked: true },
  { id: "cr-6", name: "Minimum Units per Building", field: "Unit Count", operator: "≥", value: "4", action: "decline", failMessage: "Below minimum unit threshold for GL Hab", status: "active", triggered30d: 9, triggeredPct: "2%", updated: "Dec 12, 2025",
    source: "product", sourceDetail: "Filed product definition — minimum insurable unit count", locked: true },
  // ── Enterprise rules (inherited, locked) ──
  { id: "cr-7", name: "OFAC / Sanctions Check", field: "Named Insured", operator: "not in", value: "OFAC SDN List", action: "decline", failMessage: "Sanctioned entity — auto-decline", status: "active", triggered30d: 0, triggeredPct: "0%", updated: "Jan 2, 2026",
    source: "enterprise", sourceDetail: "Enterprise compliance — applies to all products", locked: true },
  // ── Guideline rules (CT-owned, read-only in PS) ──
  { id: "cr-4", name: "Active Claims Count", field: "Open Claims", operator: "≤", value: "3", action: "refer", failMessage: "Excessive open claims — refer to UW", status: "active", triggered30d: 18, triggeredPct: "5%", updated: "Mar 1, 2026",
    source: "guideline", sourceDetail: "UW Guideline §3.1 — Claims history threshold", ctRuleId: "CT-GL-HAB-014", locked: false },
  { id: "cr-5", name: "Coastal Wind Exclusion Zone", field: "Distance to Coast", operator: "≥", value: "2,500 ft", action: "decline", failMessage: "Within coastal wind exclusion zone", status: "active", triggered30d: 31, triggeredPct: "8%", updated: "Feb 28, 2026",
    source: "guideline", sourceDetail: "UW Guideline §5.3 — CAT exposure management", ctRuleId: "CT-GL-HAB-022", locked: false },
  { id: "cr-8", name: "Frame Construction > 3 Stories", field: "Construction + Stories", operator: "≤", value: "3 stories if frame", action: "refer", failMessage: "Frame construction height exceeds guideline — VP referral", status: "active", triggered30d: 11, triggeredPct: "3%", updated: "Feb 10, 2026",
    source: "guideline", sourceDetail: "UW Guideline §2.4 — Construction restrictions", ctRuleId: "CT-GL-HAB-008", locked: false },
  // ── LOA rules (CT-owned, read-only in PS) ──
  { id: "cr-9", name: "Single Location TIV > $10M", field: "TIV", operator: ">", value: "$10,000,000", action: "refer", failMessage: "Exceeds standard UW authority — Sr. UW referral", status: "active", triggered30d: 22, triggeredPct: "6%", updated: "Jan 15, 2026",
    source: "loa", sourceDetail: "LOA — Standard UW authority cap (Sr. UW: $15M, VP: $25M)", ctRuleId: "CT-LOA-STD-003", locked: false },
  { id: "cr-10", name: "Prior Arson Conviction", field: "Criminal History", operator: "=", value: "None", action: "decline", failMessage: "Arson history — prohibited risk", status: "expired", triggered30d: 0, triggeredPct: "0%", updated: "Oct 15, 2025",
    source: "enterprise", sourceDetail: "Enterprise prohibited risk — applies to all products", locked: true },
];

// Scoring Factors — appetite modifiers (ALL are CT-owned by definition — appetite = strategy)
const SCORING_FACTORS = [
  { id: "sf-1", name: "Favorable TIV > $10M", score: +2, status: "active", triggered30d: 53, triggeredPct: "26%", updated: "Jan 12, 2025",
    source: "guideline", sourceDetail: "UW Guideline — Appetite matrix, preferred TIV band", ctRuleId: "CT-GL-HAB-SF-001" },
  { id: "sf-2", name: "High Flood Risk (Zone A/V)", score: -2, status: "active", triggered30d: 6, triggeredPct: "1%", updated: "Feb 18, 2023",
    source: "guideline", sourceDetail: "UW Guideline §5.1 — CAT exposure scoring", ctRuleId: "CT-GL-HAB-SF-002" },
  { id: "sf-3", name: "Highly Concentrated Risk", score: -3, status: "expired", triggered30d: 0, triggeredPct: "--", updated: "Oct 1, 2025",
    source: "guideline", sourceDetail: "UW Guideline §5.5 — Aggregate concentration", ctRuleId: "CT-GL-HAB-SF-003" },
  { id: "sf-4", name: "Young Building (< 10 yrs)", score: +1, status: "active", triggered30d: 38, triggeredPct: "18%", updated: "Mar 5, 2026",
    source: "guideline", sourceDetail: "UW Guideline — Construction quality preference", ctRuleId: "CT-GL-HAB-SF-004" },
  { id: "sf-5", name: "Sprinklered Building", score: +2, status: "active", triggered30d: 97, triggeredPct: "47%", updated: "Nov 20, 2025",
    source: "guideline", sourceDetail: "UW Guideline §2.2 — Fire protection credit", ctRuleId: "CT-GL-HAB-SF-005" },
  { id: "sf-6", name: "Loss Ratio > 60%", score: -2, status: "active", triggered30d: 14, triggeredPct: "7%", updated: "Feb 2, 2026",
    source: "guideline", sourceDetail: "UW Guideline §6.1 — Portfolio performance threshold", ctRuleId: "CT-GL-HAB-SF-006" },
  { id: "sf-7", name: "Mixed-Use Occupancy", score: -1, status: "active", triggered30d: 22, triggeredPct: "11%", updated: "Jan 15, 2026",
    source: "guideline", sourceDetail: "UW Guideline — Occupancy risk modifier", ctRuleId: "CT-GL-HAB-SF-007" },
  { id: "sf-8", name: "Professional Management Co.", score: +1, status: "active", triggered30d: 64, triggeredPct: "31%", updated: "Dec 8, 2025",
    source: "guideline", sourceDetail: "UW Guideline — Risk quality indicator", ctRuleId: "CT-GL-HAB-SF-008" },
  { id: "sf-9", name: "Vacant Units > 20%", score: -3, status: "archived", triggered30d: 0, triggeredPct: "--", updated: "Sep 19, 2025",
    source: "guideline", sourceDetail: "UW Guideline §3.4 — Vacancy risk factor", ctRuleId: "CT-GL-HAB-SF-009" },
];

// Class / Occupancy Restrictions — mix of product-filed and guideline-driven
const CLASS_RESTRICTIONS = [
  // Product-filed (locked): what the product CAN cover
  { class: "Condo / HOA", status: "eligible", conditions: "4+ units, built after 1960", tier: "preferred",
    source: "product", sourceDetail: "Filed class of business — GL Hab form", locked: true },
  { class: "Garden-Style Apartments", status: "eligible", conditions: "Frame or masonry, ≤ 3 stories", tier: "standard",
    source: "product", sourceDetail: "Filed class of business — GL Hab form", locked: true },
  { class: "Mid-Rise Apartments", status: "eligible", conditions: "4–12 stories, sprinklered", tier: "standard",
    source: "product", sourceDetail: "Filed class of business — GL Hab form", locked: true },
  { class: "Senior Living / Assisted", status: "eligible", conditions: "Licensed, sprinklered", tier: "preferred",
    source: "product", sourceDetail: "Filed class of business — GL Hab form", locked: true },
  { class: "Affordable / Section 8", status: "eligible", conditions: "HUD-compliant, passed inspection < 24 mo", tier: "standard",
    source: "product", sourceDetail: "Filed class of business — GL Hab form", locked: true },
  // Product-filed exclusions (locked): what the filing explicitly excludes
  { class: "Short-Term Rental (Airbnb)", status: "excluded", conditions: "Filed exclusion — uncontrolled occupancy", tier: "excluded",
    source: "product", sourceDetail: "Filed exclusion — GL Hab form §4.2", locked: true },
  // Guideline-driven (CT-owned): appetite narrowing what we WANT to write
  { class: "High-Rise Apartments", status: "refer", conditions: "13+ stories, sprinklered, class A fire", tier: "referred",
    source: "guideline", sourceDetail: "UW Guideline — High-rise appetite restriction", ctRuleId: "CT-GL-HAB-CL-001", locked: false },
  { class: "Student Housing", status: "refer", conditions: "University-affiliated only", tier: "referred",
    source: "guideline", sourceDetail: "UW Guideline — Student housing appetite", ctRuleId: "CT-GL-HAB-CL-002", locked: false },
  { class: "SRO / Rooming House", status: "excluded", conditions: "Not within current appetite", tier: "excluded",
    source: "guideline", sourceDetail: "UW Guideline — Prohibited by appetite, not filing", ctRuleId: "CT-GL-HAB-CL-003", locked: false },
  { class: "Mixed-Use (Retail Ground)", status: "refer", conditions: "Commercial exposure ≤ 25% of TIV", tier: "referred",
    source: "guideline", sourceDetail: "UW Guideline — Mixed-use appetite restriction", ctRuleId: "CT-GL-HAB-CL-004", locked: false },
];

// Territory configuration
const TERRITORY_CONFIG = [
  { state: "GA", status: "active", zones: 4, restrictions: "Coastal counties excluded from wind", notes: "Primary market" },
  { state: "FL", status: "active", zones: 6, restrictions: "Tri-county wind exclusion, sinkhole sub-limit", notes: "High cat exposure" },
  { state: "SC", status: "active", zones: 3, restrictions: "Charleston coastal wind buffer", notes: "Growth market" },
  { state: "NC", status: "active", zones: 4, restrictions: "Outer Banks excluded", notes: "Growth market" },
  { state: "AL", status: "active", zones: 2, restrictions: "Gulf coast wind exclusion", notes: "Standard" },
  { state: "TN", status: "active", zones: 2, restrictions: "None", notes: "Low cat, preferred territory" },
];

// State overrides for eligibility
const STATE_OVERRIDES = {
  FL: [
    { field: "Maximum TIV per Location", base: "$25,000,000", override: "$15,000,000", reason: "Cat exposure — reduced FL capacity" },
    { field: "Coastal Wind Exclusion Zone", base: "2,500 ft", override: "5,000 ft", reason: "Tri-county wind buffer expansion" },
    { field: "Minimum Building Age", base: "1960", override: "1980", reason: "FL building code compliance threshold" },
  ],
  GA: [
    { field: "Coastal Wind Exclusion Zone", base: "2,500 ft", override: "3,500 ft", reason: "Coastal GA wind mitigation" },
  ],
  NC: [
    { field: "Coastal Wind Exclusion Zone", base: "2,500 ft", override: "4,000 ft", reason: "Outer Banks proximity buffer" },
  ],
};

// Version / audit data
const VERSION_INFO = {
  version: "v2.3",
  status: "Published",
  lastChanged: "Mar 1, 2026",
  changes: 0,
};

const AUDIT_LOG = [
  { id: 1, timestamp: "Mar 1, 2026 2:30 PM", user: "Sarah Chen", action: "Modified", field: "Coastal Wind Exclusion Zone", before: "2,000 ft", after: "2,500 ft" },
  { id: 2, timestamp: "Feb 28, 2026 4:15 PM", user: "Sarah Chen", action: "Added", field: "Scoring Factor: Young Building", before: null, after: "+1" },
  { id: 3, timestamp: "Feb 15, 2026 11:00 AM", user: "James Morton", action: "Modified", field: "Minimum Building Age", before: "1950", after: "1960" },
  { id: 4, timestamp: "Jan 20, 2026 3:45 PM", user: "Sarah Chen", action: "Modified", field: "Maximum TIV per Location", before: "$20,000,000", after: "$25,000,000" },
];

// Condition builder field options (for Create Rule modal)
const CONDITION_FIELDS = [
  "TIV", "Year Built", "Construction Type", "Number of Stories", "Unit Count",
  "Occupancy Type", "Distance to Coast", "Flood Zone", "Sprinkler System",
  "Protection Class", "Loss Ratio (3yr)", "Open Claims", "Prior Cancellations",
  "Named Insured", "Management Type", "Vacancy Rate", "Roof Age", "Account Name",
];

const CONDITION_OPERATORS = [
  "equals", "does not equal", "greater than", "less than",
  "greater than or equal", "less than or equal", "contains",
  "does not contain", "matches", "is in", "not in",
];

// ─── Shared UI Primitives ───────────────────────────────────────────────────

function Card({ children, className = "" }) {
  return <div className={`bg-white border border-gray-200 rounded-lg p-5 ${className}`}>{children}</div>;
}

function SectionHeader({ title, tier, children }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {tier && (
          <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-gray-100 text-gray-500 border border-gray-200">
            {tier}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex border-b border-gray-200 mb-5">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${active === t.id ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          {t.label}
          {t.count !== undefined && (
            <span className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full ${active === t.id ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-500"}`}>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${enabled ? "bg-gray-700" : "bg-gray-200"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
    </button>
  );
}

function StatusDot({ status }) {
  const colors = {
    active: "bg-emerald-500",
    expired: "bg-orange-400",
    archived: "bg-gray-400",
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || "bg-gray-300"}`} />;
}

function StatusBadge({ status }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    expired: "bg-orange-50 text-orange-700 border-orange-200",
    archived: "bg-gray-50 text-gray-500 border-gray-200",
    eligible: "bg-emerald-50 text-emerald-700 border-emerald-200",
    refer: "bg-amber-50 text-amber-700 border-amber-200",
    excluded: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded border font-medium ${styles[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      <StatusDot status={status} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ScoreBadge({ score }) {
  const isPositive = score > 0;
  const isZero = score === 0;
  return (
    <span className={`inline-block text-sm font-semibold tabular-nums min-w-[2.5rem] text-center ${
      isPositive ? "text-emerald-600" : isZero ? "text-gray-500" : "text-red-600"
    }`}>
      {isPositive ? `+${score}` : score}
    </span>
  );
}

function OverrideBadge({ state }) {
  return (
    <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 rounded px-2 py-0.5 text-[11px] font-medium ml-2">
      {state} Override
    </span>
  );
}

function ActionBadge({ action }) {
  const styles = {
    decline: "bg-red-100 text-red-800",
    refer: "bg-amber-100 text-amber-800",
    accept: "bg-emerald-100 text-emerald-800",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded font-medium ${styles[action] || "bg-gray-100 text-gray-700"}`}>
      {action}
    </span>
  );
}

// ─── Source Attribution Badges ───────────────────────────────────────────────
function SourceBadge({ source, detail, ctRuleId, locked }) {
  const config = {
    product:    { label: "Product Filed", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "📋" },
    enterprise: { label: "Enterprise",    bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: "🏢" },
    guideline:  { label: "UW Guideline",  bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "📐" },
    loa:        { label: "LOA",           bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: "🔑" },
  };
  const c = config[source] || config.product;

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded border font-medium ${c.bg} ${c.text} ${c.border}`} title={detail}>
      <span>{c.icon}</span>
      {c.label}
      {locked && <span className="text-[10px] opacity-60">🔒</span>}
      {ctRuleId && (
        <span className="text-[10px] opacity-70 font-mono ml-0.5" title={`Control Tower Rule: ${ctRuleId}`}>
          → CT
        </span>
      )}
    </span>
  );
}

function RuleSourceLegend() {
  return (
    <div className="flex items-center flex-wrap gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-lg mb-4">
      <span className="text-[11px] text-gray-500 font-medium">Rule Sources:</span>
      <div className="flex items-center gap-1.5">
        <SourceBadge source="product" locked={true} />
        <span className="text-[11px] text-gray-400">Hard boundary — filed with DOI or reinsurance treaty</span>
      </div>
      <span className="text-gray-200">|</span>
      <div className="flex items-center gap-1.5">
        <SourceBadge source="enterprise" locked={true} />
        <span className="text-[11px] text-gray-400">Inherited, enterprise-wide</span>
      </div>
      <span className="text-gray-200">|</span>
      <div className="flex items-center gap-1.5">
        <SourceBadge source="guideline" ctRuleId="CT" />
        <span className="text-[11px] text-gray-400">Appetite strategy — managed in Control Tower</span>
      </div>
      <span className="text-gray-200">|</span>
      <div className="flex items-center gap-1.5">
        <SourceBadge source="loa" ctRuleId="CT" />
        <span className="text-[11px] text-gray-400">Authority-based — managed in Control Tower</span>
      </div>
    </div>
  );
}

// ─── Score Gradient Bar (matching the appetite slider from mockup) ──────────
function ScoreSlider({ score, small = false }) {
  const normalized = ((score + 5) / 10) * 100; // -5 to +5 range
  return (
    <div className={`flex items-center gap-2 ${small ? "w-28" : "w-48"}`}>
      {!small && <span className="text-[10px] text-gray-400 whitespace-nowrap">Out</span>}
      <div className="relative flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "linear-gradient(to right, #ef4444, #fbbf24, #f5f5f4, #86efac, #22c55e)" }}>
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-700 shadow-sm"
          style={{ left: `calc(${Math.max(0, Math.min(100, normalized))}% - 6px)` }}
        />
      </div>
      {!small && <span className="text-[10px] text-gray-400 whitespace-nowrap">In</span>}
    </div>
  );
}

// ─── Component Version Bar ──────────────────────────────────────────────────
function VersionBar() {
  const [showAudit, setShowAudit] = useState(false);
  const cv = VERSION_INFO;
  const isLocked = cv.status === "Published";
  const overrideSummary = Object.entries(STATE_OVERRIDES).map(([state, overrides]) => ({ state, count: overrides.length }));

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden mb-4">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {isLocked ? <Icons.Lock /> : <Icons.Unlock />}
            <span className="text-xs font-medium text-gray-700">Eligibility Rules</span>
          </div>
          <span className="text-xs font-mono font-medium text-gray-600 bg-white px-1.5 py-0.5 rounded border border-gray-200">{cv.version}</span>
          <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${
            cv.status === "Draft" ? "bg-white text-gray-600 border border-gray-300" :
            cv.status === "Published" ? "bg-gray-800 text-white" :
            "bg-gray-100 text-gray-400"
          }`}>{cv.status}</span>
          {cv.changes > 0 && (
            <span className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{cv.changes} pending</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-gray-400">Last changed: {cv.lastChanged}</span>
          <button onClick={() => setShowAudit(!showAudit)} className="text-[11px] text-gray-500 hover:text-gray-700 underline">
            {showAudit ? "Hide" : "Recent Changes"}
          </button>
        </div>
      </div>

      {overrideSummary.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-100/50 border-t border-gray-200 text-[11px] text-gray-500">
          <span>State overrides:</span>
          {overrideSummary.map(({ state, count }) => (
            <span key={state} className="font-medium text-gray-600">{state} ({count})</span>
          ))}
          <span className="text-gray-400">· {STATES.length - overrideSummary.length} states using base</span>
        </div>
      )}

      {showAudit && (
        <div className="border-t border-gray-200">
          {AUDIT_LOG.slice(0, 4).map((entry, i) => (
            <div key={entry.id} className={`flex items-center justify-between px-4 py-2 text-[11px] ${i < 3 ? "border-b border-gray-100" : ""}`}>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{entry.timestamp}</span>
                <span className="text-gray-600">{entry.user}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{entry.action}: {entry.field}</span>
                {entry.before && entry.after && (
                  <span className="text-gray-400">{entry.before} → {entry.after}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── State Override Bar ─────────────────────────────────────────────────────
function StateOverrideBar({ selectedState, onStateChange }) {
  const overrides = selectedState && selectedState !== "All" ? (STATE_OVERRIDES[selectedState] || []) : [];
  const isBaseView = !selectedState || selectedState === "All";

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Viewing:</span>
        {isBaseView ? (
          <span className="text-xs font-medium text-gray-700">All States (Base Configuration)</span>
        ) : (
          <span className="text-xs font-medium text-gray-700">{selectedState} — {overrides.length} override{overrides.length !== 1 ? "s" : ""}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-gray-400">Switch state:</span>
        <select
          value={selectedState || "All"}
          onChange={(e) => onStateChange(e.target.value)}
          className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 bg-white"
        >
          <option value="All">All States (Base)</option>
          {STATES.map(s => (
            <option key={s} value={s}>{s}{STATE_OVERRIDES[s] ? " ★" : ""}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── Create Rule Modal ──────────────────────────────────────────────────────
function CreateRuleModal({ onClose, ruleType: initialType }) {
  const [ruleName, setRuleName] = useState("");
  const [ruleType, setRuleType] = useState(initialType || "clearance");
  const [conditions, setConditions] = useState([{ field: CONDITION_FIELDS[0], operator: CONDITION_OPERATORS[0], value: "" }]);
  const [score, setScore] = useState(0);
  const [failAction, setFailAction] = useState("decline");

  const addCondition = () => {
    setConditions([...conditions, { field: CONDITION_FIELDS[0], operator: CONDITION_OPERATORS[0], value: "" }]);
  };

  const updateCondition = (idx, key, val) => {
    const updated = [...conditions];
    updated[idx] = { ...updated[idx], [key]: val };
    setConditions(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[560px] max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 space-y-5">
          <h2 className="text-xl font-semibold text-gray-900">Create a Rule</h2>

          {/* Rule Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rule Name</label>
            <input
              type="text"
              value={ruleName}
              onChange={e => setRuleName(e.target.value)}
              placeholder="Add a rule name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Rule Type Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setRuleType("clearance")}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-colors text-left ${
                ruleType === "clearance" ? "border-blue-500 bg-blue-50/30" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                ruleType === "clearance" ? "border-blue-500" : "border-gray-300"
              }`}>
                {ruleType === "clearance" && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Clearance Rule</div>
                <div className="text-xs text-gray-500 mt-0.5">Automatically decline or clear new submissions</div>
              </div>
            </button>
            <button
              onClick={() => setRuleType("scoring")}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-colors text-left ${
                ruleType === "scoring" ? "border-blue-500 bg-blue-50/30" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                ruleType === "scoring" ? "border-blue-500" : "border-gray-300"
              }`}>
                {ruleType === "scoring" && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Appetite Scoring Factor</div>
                <div className="text-xs text-gray-500 mt-0.5">Add or remove points from a submission's appetite score</div>
              </div>
            </button>
          </div>

          {/* Condition Builder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              When a submission is {ruleType === "clearance" ? "received" : "cleared"}...
            </label>
            <div className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50/50">
              {conditions.map((cond, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 w-10 text-right">{idx === 0 ? "IF" : "AND"}</span>
                  <select
                    value={cond.field}
                    onChange={e => updateCondition(idx, "field", e.target.value)}
                    className="text-xs border border-gray-200 rounded px-2 py-1.5 bg-white text-gray-700 flex-1"
                  >
                    {CONDITION_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <select
                    value={cond.operator}
                    onChange={e => updateCondition(idx, "operator", e.target.value)}
                    className="text-xs border border-gray-200 rounded px-2 py-1.5 bg-white text-gray-700 w-36"
                  >
                    {CONDITION_OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <input
                    type="text"
                    value={cond.value}
                    onChange={e => updateCondition(idx, "value", e.target.value)}
                    placeholder="Value"
                    className="text-xs border border-gray-200 rounded px-2 py-1.5 bg-white text-gray-700 w-28"
                  />
                  {idx > 0 && (
                    <button onClick={() => setConditions(conditions.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-gray-600">
                      <Icons.X />
                    </button>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-3 pt-1">
                <button onClick={addCondition} className="text-xs text-blue-600 font-medium hover:text-blue-700">+ Add Condition</button>
                <button className="text-xs text-blue-600 font-medium hover:text-blue-700">+ Add Condition Group</button>
              </div>
            </div>
          </div>

          {/* Outcome */}
          {ruleType === "clearance" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Then...</label>
              <div className="flex gap-3">
                {["decline", "refer"].map(action => (
                  <button
                    key={action}
                    onClick={() => setFailAction(action)}
                    className={`flex-1 text-sm py-2 rounded-lg border-2 font-medium transition-colors ${
                      failAction === action
                        ? action === "decline" ? "border-red-400 bg-red-50 text-red-700" : "border-amber-400 bg-amber-50 text-amber-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {action === "decline" ? "Auto-Decline" : "Refer to Underwriter"}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Then update the submission's appetite score by...</label>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 whitespace-nowrap">Very Out-of-Appetite</span>
                <div className="flex-1 relative">
                  <div className="h-2 rounded-full" style={{ background: "linear-gradient(to right, #ef4444, #fde68a, #f5f5f4, #bbf7d0, #22c55e)" }} />
                  <input
                    type="range"
                    min={-5}
                    max={5}
                    value={score}
                    onChange={e => setScore(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    style={{ height: "20px", marginTop: "-5px" }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-gray-600 shadow"
                    style={{ left: `calc(${((score + 5) / 10) * 100}% - 10px)`, pointerEvents: "none" }}
                  />
                  <div
                    className="absolute top-5 bg-gray-800 text-white text-[11px] font-semibold px-2 py-0.5 rounded"
                    style={{ left: `calc(${((score + 5) / 10) * 100}% - 12px)` }}
                  >
                    {score > 0 ? `+${score}` : score}
                  </div>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">Very In-Appetite</span>
              </div>
            </div>
          )}

          {/* Advanced Settings teaser */}
          <details className="text-sm">
            <summary className="text-gray-500 cursor-pointer hover:text-gray-700 flex items-center gap-1">
              <Icons.ChevronRight />
              Advanced Settings
            </summary>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-2">
              <div className="flex items-center justify-between">
                <span>Apply to new submissions only</span>
                <Toggle enabled={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <span>Retroactive evaluation</span>
                <Toggle enabled={false} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <span>Notify UW on trigger</span>
                <Toggle enabled={true} onChange={() => {}} />
              </div>
            </div>
          </details>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2">Cancel</button>
          <button
            onClick={onClose}
            className="text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 px-5 py-2 rounded-lg"
          >
            Create Rule
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Drawer for a Rule ───────────────────────────────────────────────
function RuleDetailDrawer({ rule, type, onClose }) {
  if (!rule) return null;
  const isClearance = type === "clearance";
  const isCTOwned = rule.source === "guideline" || rule.source === "loa";

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-end z-50" onClick={onClose}>
      <div className="bg-white w-[480px] h-full shadow-xl overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{rule.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><Icons.X /></button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={rule.status} />
            {isClearance ? <ActionBadge action={rule.action} /> : <ScoreBadge score={rule.score} />}
            <SourceBadge source={rule.source} detail={rule.sourceDetail} locked={rule.locked} ctRuleId={rule.ctRuleId} />
          </div>

          {/* Source detail card */}
          <div className={`rounded-lg p-3 text-xs ${isCTOwned ? "bg-amber-50 border border-amber-200" : "bg-blue-50 border border-blue-200"}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{isCTOwned ? "Control Tower Rule" : rule.source === "enterprise" ? "Enterprise Rule" : "Product Filed Rule"}</span>
              {rule.locked && <span className="text-[10px] opacity-60">🔒 Locked</span>}
            </div>
            <div className="text-gray-600">{rule.sourceDetail}</div>
            {rule.ctRuleId && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-gray-500 font-mono">{rule.ctRuleId}</span>
                <button className={`text-xs font-medium px-2 py-1 rounded border ${
                  isCTOwned ? "text-amber-700 border-amber-300 hover:bg-amber-100" : "text-gray-500 border-gray-300"
                }`}>
                  {isCTOwned ? "Edit in Control Tower →" : "View Source"}
                </button>
              </div>
            )}
            {!isCTOwned && rule.locked && (
              <div className="mt-2 text-[11px] text-gray-500">
                This rule is locked because it comes from the product filing or reinsurance treaty. Changes require a new filing.
              </div>
            )}
          </div>

          {isClearance && (
            <Card>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Field</span><span className="font-medium">{rule.field}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Operator</span><span className="font-mono text-xs">{rule.operator}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Value</span><span className="font-medium">{rule.value}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Fail Action</span><ActionBadge action={rule.action} /></div>
                <div className="flex justify-between"><span className="text-gray-500">Fail Message</span><span className="text-xs text-gray-600">{rule.failMessage}</span></div>
              </div>
            </Card>
          )}

          {!isClearance && (
            <Card>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Score Impact</span>
                  <ScoreBadge score={rule.score} />
                </div>
                <ScoreSlider score={rule.score} />
              </div>
            </Card>
          )}

          <Card>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Performance (Last 30 Days)</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-2xl font-semibold text-gray-900">{rule.triggered30d}</div>
                <div className="text-xs text-gray-500">Submissions triggered</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">{rule.triggeredPct}</div>
                <div className="text-xs text-gray-500">of all submissions</div>
              </div>
            </div>
          </Card>

          <div className="text-[11px] text-gray-400">Last updated: {rule.updated}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Clearance Rules Tab ────────────────────────────────────────────────────
function ClearanceRulesTab({ overrideState, onCreateRule }) {
  const [selectedRule, setSelectedRule] = useState(null);
  const [sourceFilter, setSourceFilter] = useState("all");
  const overrides = overrideState && overrideState !== "All" ? (STATE_OVERRIDES[overrideState] || []) : [];

  const filteredRules = sourceFilter === "all"
    ? CLEARANCE_RULES
    : CLEARANCE_RULES.filter(r => r.source === sourceFilter);

  // Group rules by source for visual separation
  const productRules = filteredRules.filter(r => r.source === "product" || r.source === "enterprise");
  const ctRules = filteredRules.filter(r => r.source === "guideline" || r.source === "loa");

  return (
    <>
      <RuleSourceLegend />

      <Card>
        <SectionHeader title="Clearance Rules" tier="configure">
          <div className="flex items-center gap-2">
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 bg-white"
            >
              <option value="all">All Sources</option>
              <option value="product">Product Filed Only</option>
              <option value="enterprise">Enterprise Only</option>
              <option value="guideline">UW Guidelines Only</option>
              <option value="loa">LOA Only</option>
            </select>
            <button onClick={() => onCreateRule("clearance")} className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded hover:bg-gray-50 flex items-center gap-1">
              <Icons.Plus /> Add Rule
            </button>
          </div>
        </SectionHeader>
        <p className="text-xs text-gray-500 mb-4">
          Hard accept/decline rules evaluated on every new submission. <strong className="text-gray-700">Product-filed</strong> and <strong className="text-gray-700">Enterprise</strong> rules are locked here — <strong className="text-gray-700">Guideline</strong> and <strong className="text-gray-700">LOA</strong> rules are managed in Control Tower and surfaced read-only.
        </p>

        {/* Product-owned rules section */}
        {productRules.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-2 mt-4">
              <div className="h-px flex-1 bg-blue-200" />
              <span className="text-[11px] font-medium text-blue-600 uppercase tracking-wide">Product-Owned Rules</span>
              <span className="text-[11px] text-blue-400">🔒 Locked — filed with DOI / reinsurance</span>
              <div className="h-px flex-1 bg-blue-200" />
            </div>
            <div className="overflow-hidden rounded border border-gray-200 mb-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Rule</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Source</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Condition</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Fail Action</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Status</th>
                    <th className="text-right py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Triggered (30d)</th>
                  </tr>
                </thead>
                <tbody>
                  {productRules.map((r, i) => {
                    const override = overrides.find(o => o.field === r.name);
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedRule(r)}
                        className={`group border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${override ? "bg-blue-50/30" : i % 2 === 0 ? "" : "bg-gray-50/30"}`}
                      >
                        <td className="py-2.5 px-3 font-medium text-gray-900">
                          {r.name}
                          {override && <OverrideBadge state={overrideState} />}
                        </td>
                        <td className="py-2.5 px-3">
                          <SourceBadge source={r.source} detail={r.sourceDetail} locked={r.locked} />
                        </td>
                        <td className="py-2.5 px-3 text-gray-600 font-mono text-xs">
                          {override ? (
                            <span>
                              <span className="text-gray-800">{r.field} {r.operator} {override.override}</span>
                              <span className="text-gray-400 line-through ml-2 text-[11px]">{override.base}</span>
                            </span>
                          ) : (
                            `${r.field} ${r.operator} ${r.value}`
                          )}
                        </td>
                        <td className="py-2.5 px-3"><ActionBadge action={r.action} /></td>
                        <td className="py-2.5 px-3"><StatusBadge status={r.status} /></td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="font-medium text-gray-900">{r.triggered30d}</span>
                          <span className="text-gray-400 text-xs ml-1">{r.triggeredPct}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* CT-owned rules section (read-only in PS) */}
        {ctRules.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-2 mt-2">
              <div className="h-px flex-1 bg-amber-200" />
              <span className="text-[11px] font-medium text-amber-600 uppercase tracking-wide">Control Tower Rules</span>
              <span className="text-[11px] text-amber-400">Surfaced from Guidelines & LOAs — edit in CT</span>
              <div className="h-px flex-1 bg-amber-200" />
            </div>
            <div className="overflow-hidden rounded-lg border-2 border-dashed border-amber-200 bg-amber-50/20">
              <div className="flex items-center justify-between px-4 py-2 bg-amber-50 border-b border-amber-200">
                <div className="flex items-center gap-2 text-xs text-amber-700">
                  <span>📐</span>
                  <span className="font-medium">These rules are owned by Control Tower</span>
                  <span className="text-amber-500">— shown here for visibility, editable in CT</span>
                </div>
                <button className="text-xs font-medium text-amber-700 hover:text-amber-900 border border-amber-300 bg-white px-2.5 py-1 rounded hover:bg-amber-50">
                  Open in Control Tower →
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-amber-50/50 border-b border-amber-100">
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Rule</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Source</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Condition</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Fail Action</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Status</th>
                    <th className="text-right py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Triggered (30d)</th>
                  </tr>
                </thead>
                <tbody>
                  {ctRules.map((r, i) => {
                    const override = overrides.find(o => o.field === r.name);
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedRule(r)}
                        className={`group border-b border-amber-100/50 cursor-pointer hover:bg-amber-50/30 ${i % 2 === 0 ? "" : "bg-amber-50/20"}`}
                      >
                        <td className="py-2.5 px-3 font-medium text-gray-900">
                          {r.name}
                          {override && <OverrideBadge state={overrideState} />}
                        </td>
                        <td className="py-2.5 px-3">
                          <SourceBadge source={r.source} detail={r.sourceDetail} ctRuleId={r.ctRuleId} />
                        </td>
                        <td className="py-2.5 px-3 text-gray-600 font-mono text-xs">
                          {override ? (
                            <span>
                              <span className="text-gray-800">{r.field} {r.operator} {override.override}</span>
                              <span className="text-gray-400 line-through ml-2 text-[11px]">{override.base}</span>
                            </span>
                          ) : (
                            `${r.field} ${r.operator} ${r.value}`
                          )}
                        </td>
                        <td className="py-2.5 px-3"><ActionBadge action={r.action} /></td>
                        <td className="py-2.5 px-3"><StatusBadge status={r.status} /></td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="font-medium text-gray-900">{r.triggered30d}</span>
                          <span className="text-gray-400 text-xs ml-1">{r.triggeredPct}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {selectedRule && <RuleDetailDrawer rule={selectedRule} type="clearance" onClose={() => setSelectedRule(null)} />}
    </>
  );
}

// ─── Scoring Factors Tab ────────────────────────────────────────────────────
function ScoringFactorsTab({ onCreateRule }) {
  const [selectedRule, setSelectedRule] = useState(null);

  return (
    <>
      {/* CT ownership banner */}
      <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border-2 border-dashed border-amber-200 rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📐</span>
          <div>
            <div className="text-sm font-medium text-amber-800">Scoring Factors are fully owned by Control Tower</div>
            <div className="text-xs text-amber-600">Appetite scoring is strategy, not product definition. These rules are surfaced here for visibility — create and edit them in Control Tower.</div>
          </div>
        </div>
        <button className="text-xs font-medium text-amber-700 hover:text-amber-900 border border-amber-300 bg-white px-3 py-1.5 rounded-lg hover:bg-amber-50 whitespace-nowrap">
          Open in Control Tower →
        </button>
      </div>

      <Card>
        <SectionHeader title="Scoring Factors" tier="appetite">
          <button onClick={() => onCreateRule("scoring")} className="text-xs text-amber-600 border border-amber-200 px-2.5 py-1 rounded hover:bg-amber-50 flex items-center gap-1">
            <Icons.Plus /> Add Factor in CT
          </button>
        </SectionHeader>
        <p className="text-xs text-gray-500 mb-4">Appetite scoring factors add and subtract appetite score from submissions and accounts. All factors are managed as UW Guidelines in Control Tower.</p>

        <div className="overflow-hidden rounded-lg border-2 border-dashed border-amber-200 bg-amber-50/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-amber-50/50 border-b border-amber-200">
                <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Factor</th>
                <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Score</th>
                <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Source</th>
                <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Status</th>
                <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Triggered (Last 30 Days)</th>
                <th className="text-right py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Updated</th>
              </tr>
            </thead>
            <tbody>
              {SCORING_FACTORS.map((f, i) => (
                <tr
                  key={f.id}
                  onClick={() => setSelectedRule(f)}
                  className={`group border-b border-amber-100/50 cursor-pointer hover:bg-amber-50/30 ${i % 2 === 0 ? "" : "bg-amber-50/20"}`}
                >
                  <td className="py-3 px-3 font-medium text-gray-900">{f.name}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <ScoreBadge score={f.score} />
                      <ScoreSlider score={f.score} small={true} />
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <SourceBadge source={f.source} detail={f.sourceDetail} ctRuleId={f.ctRuleId} />
                  </td>
                  <td className="py-3 px-3"><StatusBadge status={f.status} /></td>
                  <td className="py-3 px-3">
                    {f.triggered30d > 0 ? (
                      <div>
                        <span className="font-medium text-gray-900">{f.triggered30d}</span>
                        <span className="text-gray-400 text-xs ml-1">{f.triggeredPct} of submissions</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-500 text-xs">{f.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedRule && <RuleDetailDrawer rule={selectedRule} type="scoring" onClose={() => setSelectedRule(null)} />}
    </>
  );
}

// ─── Class Restrictions Tab ─────────────────────────────────────────────────
function ClassRestrictionsTab() {
  const productClasses = CLASS_RESTRICTIONS.filter(c => c.source === "product");
  const ctClasses = CLASS_RESTRICTIONS.filter(c => c.source === "guideline" || c.source === "loa");

  const renderClassRow = (c, i, isCT) => (
    <tr key={i} className={`border-b ${isCT ? "border-amber-100/50" : "border-gray-100"} ${i % 2 === 0 ? "" : isCT ? "bg-amber-50/20" : "bg-gray-50/30"}`}>
      <td className="py-2.5 px-3 font-medium text-gray-900">{c.class}</td>
      <td className="py-2.5 px-3">
        <SourceBadge source={c.source} detail={c.sourceDetail} locked={c.locked} ctRuleId={c.ctRuleId} />
      </td>
      <td className="py-2.5 px-3"><StatusBadge status={c.status} /></td>
      <td className="py-2.5 px-3">
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
          c.tier === "preferred" ? "bg-emerald-50 text-emerald-700" :
          c.tier === "standard" ? "bg-gray-100 text-gray-700" :
          c.tier === "referred" ? "bg-amber-50 text-amber-700" :
          "bg-red-50 text-red-700"
        }`}>{c.tier}</span>
      </td>
      <td className="py-2.5 px-3 text-gray-500 text-xs">{c.conditions}</td>
    </tr>
  );

  return (
    <>
      <RuleSourceLegend />

      <Card>
        <SectionHeader title="Occupancy / Class Restrictions" tier="configure">
          <button className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded hover:bg-gray-50 flex items-center gap-1">
            <Icons.Plus /> Add Class
          </button>
        </SectionHeader>
        <p className="text-xs text-gray-500 mb-4">
          The product filing defines what classes <strong className="text-gray-700">can</strong> be written (outer boundary). Control Tower guidelines narrow what you <strong className="text-gray-700">want</strong> to write (appetite strategy).
        </p>

        {/* Product-filed classes */}
        <div className="flex items-center gap-2 mb-2 mt-2">
          <div className="h-px flex-1 bg-blue-200" />
          <span className="text-[11px] font-medium text-blue-600 uppercase tracking-wide">Filed Product Classes</span>
          <span className="text-[11px] text-blue-400">🔒 What we CAN write</span>
          <div className="h-px flex-1 bg-blue-200" />
        </div>
        <div className="overflow-hidden rounded border border-gray-200 mb-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Occupancy / Class</th>
                <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Source</th>
                <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Status</th>
                <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Tier</th>
                <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Conditions</th>
              </tr>
            </thead>
            <tbody>
              {productClasses.map((c, i) => renderClassRow(c, i, false))}
            </tbody>
          </table>
        </div>

        {/* CT guideline classes */}
        {ctClasses.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-2 mt-2">
              <div className="h-px flex-1 bg-amber-200" />
              <span className="text-[11px] font-medium text-amber-600 uppercase tracking-wide">Appetite Restrictions (Control Tower)</span>
              <span className="text-[11px] text-amber-400">📐 What we WANT to write</span>
              <div className="h-px flex-1 bg-amber-200" />
            </div>
            <div className="overflow-hidden rounded-lg border-2 border-dashed border-amber-200 bg-amber-50/10">
              <div className="flex items-center justify-between px-4 py-2 bg-amber-50 border-b border-amber-200">
                <div className="flex items-center gap-2 text-xs text-amber-700">
                  <span>📐</span>
                  <span>These class restrictions come from UW Guidelines — adjustable in Control Tower without touching the product filing.</span>
                </div>
                <button className="text-xs font-medium text-amber-700 hover:text-amber-900 border border-amber-300 bg-white px-2.5 py-1 rounded hover:bg-amber-50">
                  Open in Control Tower →
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-amber-50/50 border-b border-amber-200">
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Occupancy / Class</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Source</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Status</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Tier</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 uppercase text-[11px] tracking-wide">Conditions</th>
                  </tr>
                </thead>
                <tbody>
                  {ctClasses.map((c, i) => renderClassRow(c, i, true))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </>
  );
}

// ─── Territory Tab ──────────────────────────────────────────────────────────
function TerritoryTab() {
  return (
    <Card>
      <SectionHeader title="Territory Availability" tier="configure" />
      <p className="text-xs text-gray-500 mb-4">Active states and territory zones for GL Habitational product.</p>

      <div className="grid grid-cols-1 gap-3">
        {TERRITORY_CONFIG.map(t => (
          <div key={t.state} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Toggle enabled={t.status === "active"} onChange={() => {}} />
                <span className="text-sm font-semibold text-gray-900 w-8">{t.state}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 rounded">{t.zones} zones</span>
                <span>{t.restrictions}</span>
              </div>
            </div>
            <span className="text-xs text-gray-400">{t.notes}</span>
          </div>
        ))}

        {/* Disabled states */}
        {["VA", "MS", "LA"].map(s => (
          <div key={s} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Toggle enabled={false} onChange={() => {}} />
                <span className="text-sm text-gray-400 w-8">{s}</span>
              </div>
              <span className="text-xs text-gray-400">Not available</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Summary Stats Banner ───────────────────────────────────────────────────
function EligibilitySummary() {
  const activeClearance = CLEARANCE_RULES.filter(r => r.status === "active").length;
  const activeScoring = SCORING_FACTORS.filter(f => f.status === "active").length;
  const totalTriggered = CLEARANCE_RULES.reduce((sum, r) => sum + r.triggered30d, 0) + SCORING_FACTORS.reduce((sum, f) => sum + f.triggered30d, 0);
  const eligibleClasses = CLASS_RESTRICTIONS.filter(c => c.status === "eligible").length;

  const stats = [
    { label: "Clearance Rules", value: activeClearance, sublabel: "active", icon: <Icons.Shield /> },
    { label: "Scoring Factors", value: activeScoring, sublabel: "active", icon: <Icons.Sliders /> },
    { label: "Triggered (30d)", value: totalTriggered, sublabel: "submissions", icon: <Icons.Activity /> },
    { label: "Eligible Classes", value: eligibleClasses, sublabel: `of ${CLASS_RESTRICTIONS.length}`, icon: <Icons.Building /> },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {stats.map((s, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            {s.icon}
            <span className="text-xs font-medium">{s.label}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold text-gray-900">{s.value}</span>
            <span className="text-xs text-gray-400">{s.sublabel}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MODULES for sidebar navigation ─────────────────────────────────────────
const MODULES = [
  { id: "overview", label: "Overview", icon: <Icons.Home /> },
  { id: "versions", label: "Versions", icon: <Icons.Clock /> },
  { id: "eligibility", label: "Eligibility", icon: <Icons.Shield /> },
  { id: "pricing", label: "Pricing", icon: <Icons.DollarSign /> },
  { id: "operations", label: "Operations", icon: <Icons.Settings /> },
  { id: "forms", label: "Policy Forms", icon: <Icons.FileText /> },
  { id: "layouts", label: "Layouts", icon: <Icons.Layout /> },
];

// ─── Main Eligibility Page (Full App Shell) ─────────────────────────────────
export default function EligibilityPrototype() {
  const [activeModule, setActiveModule] = useState("eligibility");
  const [subTab, setSubTab] = useState("clearance");
  const [overrideState, setOverrideState] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalType, setCreateModalType] = useState("clearance");

  const handleCreateRule = (type) => {
    setCreateModalType(type);
    setShowCreateModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* ── Sidebar ── */}
      <div className="flex flex-col bg-white border-r border-gray-200 w-56">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
          <span className="text-gray-700"><Icons.Package /></span>
          <span className="text-sm font-semibold text-gray-900 tracking-tight">Product Studio</span>
        </div>

        {/* Back + Product Name */}
        <div className="px-3 py-3 border-b border-gray-100 space-y-2">
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
            <Icons.ArrowLeft /> Back to Products
          </button>
          <div>
            <div className="text-sm font-semibold text-gray-900">GL Habitational</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-800 text-white font-medium">v2.3</span>
              <span className="text-[11px] text-gray-500">Published</span>
            </div>
          </div>
        </div>

        {/* Module Nav */}
        <nav className="flex-1 py-2 space-y-0.5 px-2">
          {MODULES.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                activeModule === m.id ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span className="text-gray-500">{m.icon}</span>
              {m.label}
              {m.id === "eligibility" && <span className="ml-auto text-[11px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">New</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-gray-100 text-[11px] text-gray-400">
          GL Habitational · SE Region
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Product Studio</span>
            <span>/</span>
            <span>Products</span>
            <span>/</span>
            <span className="text-gray-900 font-medium flex items-center gap-1.5">
              <Icons.Building />
              GL Habitational
              <Icons.ChevronDown />
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Draft version active</span>
            <button className="text-xs font-medium text-white bg-gray-800 hover:bg-gray-900 px-3 py-1.5 rounded-lg">
              Publish Version
            </button>
          </div>
        </div>

        {/* Draft banner */}
        <div className="bg-gray-100 border-b border-gray-200 px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">✏️</span>
            <span className="text-gray-700"><strong className="text-gray-900">Q2 2026</strong> is the current working draft version of this product.</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">● 3 changes Ready to Publish</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 max-w-[1200px]">
          {activeModule === "eligibility" ? (
            <div className="space-y-5">
              {/* Header */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Eligibility</h2>
                <p className="text-sm text-gray-500">
                  Who and what can we insure? <strong className="text-gray-700">Product-filed rules</strong> define the outer boundary. <strong className="text-gray-700">Control Tower rules</strong> narrow appetite strategy. Viewing {overrideState === "All" ? "all states" : overrideState}.
                </p>
              </div>

              {/* Summary Stats */}
              <EligibilitySummary />

              {/* Version + State Bars */}
              <VersionBar />
              <StateOverrideBar selectedState={overrideState} onStateChange={setOverrideState} />

              {/* Tabs */}
              <TabBar
                tabs={[
                  { id: "clearance", label: "Clearance Rules", count: CLEARANCE_RULES.filter(r => r.status === "active").length },
                  { id: "scoring", label: "Scoring Factors", count: SCORING_FACTORS.filter(f => f.status === "active").length },
                  { id: "classes", label: "Class Restrictions", count: CLASS_RESTRICTIONS.length },
                  { id: "territory", label: "Territory", count: STATES.length },
                ]}
                active={subTab}
                onChange={setSubTab}
              />

              {subTab === "clearance" && <ClearanceRulesTab overrideState={overrideState} onCreateRule={handleCreateRule} />}
              {subTab === "scoring" && <ScoringFactorsTab onCreateRule={handleCreateRule} />}
              {subTab === "classes" && <ClassRestrictionsTab />}
              {subTab === "territory" && <TerritoryTab />}
            </div>
          ) : (
            /* Placeholder for other modules */
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-3">🏗️</div>
                <div className="text-lg font-medium text-gray-600">{MODULES.find(m => m.id === activeModule)?.label}</div>
                <div className="text-sm text-gray-400 mt-1">Module content — see full Product Studio prototype</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <CreateRuleModal
          ruleType={createModalType}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
