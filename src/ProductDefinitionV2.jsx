import { useState, useMemo, useCallback } from "react";

// ─── Icons (inline SVG components) ─────────────────────────────────────────
const Icons = {
  Shield: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  DollarSign: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Settings: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  FileText: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Layout: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  Home: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Edit: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Upload: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  AlertTriangle: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  ArrowRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Globe: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Grip: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>,
  Link: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Zap: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Package: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Eye: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Truck: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Database: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  Layers: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Play: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Refresh: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Lock: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Map: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  Briefcase: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  GitBranch: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>,
};

// ─── Mock Data ──────────────────────────────────────────────────────────────
const STATES = ["GA", "FL", "SC", "NC", "AL", "TN"];

const COVERAGES = [
  { id: "liability", name: "Commercial Auto Liability", required: true, type: "limit", limitOptions: [300000, 500000, 1000000], defaultLimit: 500000 },
  { id: "comprehensive", name: "Comprehensive", required: false, type: "deductible", deductibleOptions: [250, 500, 1000, 2500], defaultDeductible: 500 },
  { id: "collision", name: "Collision", required: false, type: "deductible", deductibleOptions: [250, 500, 1000, 2500], defaultDeductible: 500 },
  { id: "um_uim", name: "UM/UIM", required: false, type: "percent", pricingMethod: "60% of liability" },
  { id: "med_pay", name: "Medical Payments", required: false, type: "limit", limitOptions: [1000, 2000, 5000, 10000], defaultLimit: 5000 },
  { id: "hired_auto", name: "Hired Auto Liability", required: false, type: "flat", surcharge: 150 },
  { id: "non_owned", name: "Non-Owned Auto Liability", required: false, type: "flat", surcharge: 150 },
  { id: "towing", name: "Towing & Labor", required: false, type: "limit", limitOptions: [50, 75, 100], defaultLimit: 75 },
];

const VEHICLE_CLASS_RATES = [
  { class: "Private Passenger", liability: 850, comp: 220, coll: 300 },
  { class: "Light Truck", liability: 1250, comp: 260, coll: 360 },
  { class: "Medium Truck", liability: 2250, comp: 300, coll: 420 },
  { class: "Heavy Truck", liability: 3500, comp: 360, coll: 520 },
  { class: "Extra Heavy Truck", liability: 4200, comp: 420, coll: 600 },
  { class: "Heavy Truck Tractor", liability: 4800, comp: 480, coll: 680 },
  { class: "Extra Heavy Truck Tractor", liability: 5400, comp: 540, coll: 800 },
  { class: "Trailer", liability: 300, comp: 120, coll: 180 },
];

// ─── Workers' Comp Data ──────────────────────────────────────────────────────
const WC_COVERAGES = [
  { id: "wc_statutory", name: "Workers' Compensation (Part 1)", required: true, type: "statutory", description: "Statutory benefits per state law" },
  { id: "employers_liability", name: "Employers Liability (Part 2)", required: true, type: "limit", limitOptions: [100000, 500000, 1000000], defaultLimit: 500000, perAccident: true, perEmployee: true, policyLimit: true },
  { id: "usl_h", name: "USL&H Coverage", required: false, type: "endorsement", description: "US Longshore & Harbor Workers' Act" },
  { id: "voluntary_comp", name: "Voluntary Compensation", required: false, type: "endorsement", description: "Coverage for excluded employees" },
  { id: "stop_gap", name: "Stop Gap / Employers Liability", required: false, type: "state-specific", description: "For monopolistic state operations" },
];

const WC_CLASS_CODES = [
  { code: "8810", description: "Clerical Office Employees", rate: 0.22, payroll: 850000, premium: 1870 },
  { code: "8742", description: "Salespersons - Outside", rate: 0.48, payroll: 420000, premium: 2016 },
  { code: "5191", description: "Office Machine Installation", rate: 2.75, payroll: 320000, premium: 8800 },
  { code: "5606", description: "Contractor - Project Mgr", rate: 4.12, payroll: 280000, premium: 11536 },
  { code: "7380", description: "Drivers, Chauffeurs - Commercial", rate: 6.88, payroll: 195000, premium: 13416 },
  { code: "5022", description: "Masonry - NOC", rate: 9.45, payroll: 160000, premium: 15120 },
];

const WC_EXPERIENCE_MOD = { current: 0.89, effective: "2026-01-01", bureau: "NCCI", stateException: false };

// ─── Package / BOP Data ──────────────────────────────────────────────────────
const BOP_SUB_LINES = [
  {
    id: "property", name: "Commercial Property", icon: "Home", required: true,
    coverages: [
      { id: "building", name: "Building Coverage", type: "limit", limitOptions: [250000, 500000, 1000000, 2000000], defaultLimit: 500000 },
      { id: "bpp", name: "Business Personal Property", type: "limit", limitOptions: [50000, 100000, 250000, 500000], defaultLimit: 100000 },
      { id: "business_income", name: "Business Income & Extra Expense", type: "limit", limitOptions: [50000, 100000, 250000], defaultLimit: 100000 },
      { id: "equipment_breakdown", name: "Equipment Breakdown", required: false, type: "sublimit", limitOptions: [50000, 100000, 250000], defaultLimit: 100000 },
    ],
    ratingBasis: "Total Insured Values (TIV)",
  },
  {
    id: "liability", name: "General Liability", icon: "Shield", required: true,
    coverages: [
      { id: "cgl", name: "Commercial General Liability", type: "occurrence_aggregate", occurrenceOptions: [500000, 1000000, 2000000], aggregateOptions: [1000000, 2000000, 4000000], defaultOccurrence: 1000000, defaultAggregate: 2000000 },
      { id: "products_completed", name: "Products & Completed Ops", type: "included", description: "Included in CGL aggregate" },
      { id: "personal_advertising", name: "Personal & Advertising Injury", type: "included", description: "Included per occurrence" },
      { id: "medical_expense", name: "Medical Expense", type: "limit", limitOptions: [5000, 10000, 15000], defaultLimit: 10000 },
    ],
    ratingBasis: "Revenue / Sq. Footage",
  },
  {
    id: "inland_marine", name: "Inland Marine", icon: "Truck", required: false,
    coverages: [
      { id: "contractors_equipment", name: "Contractors Equipment", type: "scheduled", description: "Scheduled equipment items" },
      { id: "tools", name: "Tools & Misc. Equipment", type: "blanket", limitOptions: [10000, 25000, 50000], defaultLimit: 25000 },
    ],
    ratingBasis: "Scheduled Values",
  },
  {
    id: "crime", name: "Commercial Crime", icon: "Lock", required: false,
    coverages: [
      { id: "employee_theft", name: "Employee Theft", type: "limit", limitOptions: [10000, 25000, 50000, 100000], defaultLimit: 25000 },
      { id: "forgery", name: "Forgery & Alteration", type: "limit", limitOptions: [10000, 25000], defaultLimit: 10000 },
    ],
    ratingBasis: "Employee Count",
  },
];

// ─── Habitational GL Coverages ───────────────────────────────────────────────
const GL_COVERAGES = [
  { id: "gl_premises", name: "Premises/Operations Liability", required: true, type: "occurrence_aggregate", description: "Core GL coverage", scope: "account" },
  { id: "blanket_ai", name: "Blanket Additional Insured", required: false, type: "toggle", scope: "account" },
  { id: "blanket_pnc", name: "Blanket Primary Non-Contributory", required: false, type: "toggle", scope: "account" },
  { id: "ebl", name: "Employee Benefits Liability", required: false, type: "limit", limitOptions: [25000, 50000, 100000, 250000, 300000, 500000, 1000000], scope: "account" },
  { id: "rroa", name: "Waiver of Transfer of Rights", required: false, type: "toggle", scope: "account" },
  { id: "med_pay_gl", name: "Medical Payments", required: false, type: "limit", limitOptions: [2500, 5000, 10000], scope: "account" },
  { id: "habitability", name: "Habitability", required: false, type: "limit", limitOptions: [25000, 50000, 100000, 250000, 300000], scope: "per-location", scopeNote: "Varies by location crime score — auto-excluded when score ≥ 80" },
  { id: "ab", name: "Assault & Battery", required: false, type: "limit", limitOptions: [25000, 50000, 100000, 250000, 300000, 500000, 1000000], scope: "per-location", scopeNote: "Varies by location crime score — auto-excluded when score ≥ 80" },
  { id: "sam_exclusion", name: "Sexual Abuse & Molestation Excl.", required: false, type: "toggle", scope: "per-location", scopeNote: "Applied per location based on crime score" },
  { id: "firearms_exclusion", name: "Firearms Exclusion", required: false, type: "toggle", scope: "per-location", scopeNote: "Applied per location based on crime score" },
  { id: "hnoa", name: "Hired & Non-Owned Auto", required: false, type: "limit", limitOptions: [25000, 50000, 100000, 250000, 300000, 500000, 1000000], scope: "account" },
  { id: "stop_gap", name: "Stop Gap Employers Liability", required: false, type: "limit", limitOptions: [100000, 500000, 1000000], scope: "account" },
];

// ─── LOB Templates ───────────────────────────────────────────────────────────
const LOB_TEMPLATES = {
  commercial_auto: {
    id: "commercial_auto",
    name: "Commercial Auto",
    icon: "Truck",
    description: "Coverage-centric configuration. Define coverages, limits/deductibles, and vehicle class rates.",
    paradigm: "coverage-centric",
    sections: ["coverages", "rate_tables"],
  },
  workers_comp: {
    id: "workers_comp",
    name: "Workers' Compensation",
    icon: "Briefcase",
    description: "Class-code-centric configuration. Define class codes, experience modification, state rules, and payroll exposure.",
    paradigm: "class-code-centric",
    sections: ["class_codes", "experience_mod", "state_rules", "el_limits"],
  },
  package_bop: {
    id: "package_bop",
    name: "Package / BOP",
    icon: "Package",
    description: "Multi-sub-line configuration. Combine property, liability, and optional coverages into a single package product.",
    paradigm: "multi-sub-line",
    sections: ["sub_lines"],
  },
  habitational_gl: {
    id: "habitational_gl",
    name: "Habitational GL",
    icon: "Home",
    description: "Premises/operations GL for habitational risks. Location-level rating with UW risk factors and crime score modifiers.",
    paradigm: "location-centric",
    sections: ["coverages", "rate_factors", "locations"],
  },
};

// ─── LOB-Specific Workflow Defaults ──────────────────────────────────────────
const WC_WORKFLOW_STEPS = [
  { id: "business_info", label: "Business Information", icon: "Briefcase", description: "Policyholder details, entity type, governing class", fields: ["state", "effective_date", "entity_type", "governing_class"], sourceType: "policy-level" },
  { id: "class_codes", label: "Class Code & Payroll Schedule", icon: "Database", description: "Assign NCCI class codes and annual payroll by classification", fields: [], sourceType: "class-schedule", isTable: true },
  { id: "experience_mod", label: "Experience Modification", icon: "Zap", description: "Apply experience mod factor from bureau worksheet", fields: ["mod_factor", "mod_effective_date", "bureau"], sourceType: "rating-factors" },
  { id: "state_rules", label: "State-Specific Rules", icon: "Map", description: "State surcharges, assessments, and minimum premium rules", fields: [], sourceType: "state-rules" },
  { id: "select_forms", label: "Select Forms", icon: "FileText", description: "Attach WC forms and endorsements", fields: [], sourceType: "forms", isForms: true },
  { id: "review_outputs", label: "Review & Submit", icon: "Eye", description: "Review premium by class code, mod-adjusted totals, and submit", fields: [], sourceType: "outputs", isReview: true },
];

const BOP_WORKFLOW_STEPS = [
  { id: "business_info", label: "Business Information", icon: "Briefcase", description: "Location details, building construction, occupancy", fields: ["state", "effective_date", "building_type", "occupancy_class"], sourceType: "policy-level" },
  { id: "property_config", label: "Property Coverage", icon: "Home", description: "Building values, BPP, business income limits", fields: [], sourceType: "property", isSubLine: true },
  { id: "liability_config", label: "Liability Coverage", icon: "Shield", description: "CGL occurrence/aggregate, medical expense limits", fields: [], sourceType: "liability", isSubLine: true },
  { id: "optional_lines", label: "Optional Coverages", icon: "Plus", description: "Inland marine, crime, cyber — toggle on/off", fields: [], sourceType: "optional-lines", isSubLine: true },
  { id: "select_forms", label: "Select Forms", icon: "FileText", description: "Attach BOP forms and endorsements", fields: [], sourceType: "forms", isForms: true },
  { id: "review_outputs", label: "Review & Submit", icon: "Eye", description: "Review combined package premium and submit", fields: [], sourceType: "outputs", isReview: true },
];

// Habitational GL Workflow Steps
const GL_WORKFLOW_STEPS = [
  { id: "overview", label: "Overview", icon: "Home", description: "Submission overview and insured profile", fields: ["named_insured", "named_entity_type", "industry_class", "primary_zip_code", "num_locations", "new_renewal"], generated: true, sourceType: "policy-level" },
  { id: "loss_history", label: "Loss History", icon: "Clock", description: "Prior claims and loss run analysis", fields: ["rf_claim_his"], generated: true, sourceType: "rating-factor" },
  { id: "contacts", label: "Contacts", icon: "Briefcase", description: "Insured contacts, broker, and additional parties", fields: [], generated: true, sourceType: "policy-level" },
  { id: "submission_summary", label: "Submission Summary", icon: "FileText", description: "Parsed submission intake and document review", fields: ["effective_date", "expiration_date", "new_renewal", "named_entity_type"], generated: true, sourceType: "policy-level" },
  { id: "locations", label: "Locations", icon: "Map", description: "Location details, addresses, and geographic modifiers", fields: ["location_name", "llc_name", "zip_code", "street_address", "num_stories", "crime_score"], generated: true, sourceType: "unit-level", isTable: true },
  { id: "limits", label: "Limits", icon: "Shield", description: "Policy aggregate, occurrence limits, and deductibles per location", fields: ["effective_policy_aggregate", "per_location_aggregate", "occurrence_limit", "deductible"], generated: true, sourceType: "coverage" },
  { id: "exposures", label: "Exposures", icon: "Database", description: "Exposure base units — door count, square footage, or acreage per location", fields: ["sub_industry_class", "primary_exposure_units", "secondary_exposure_units"], generated: true, sourceType: "exposure" },
  { id: "coverages", label: "Coverages", icon: "Layers", description: "Account and location-level optional coverages", fields: ["blanket_ai", "blanket_pnc", "ebl_limit", "rroa", "med_pay_limit", "habitability_limit", "ab_limit", "exclude_sam", "exclude_firearms", "hnoa", "stop_gap_el"], generated: true, sourceType: "coverage" },
  { id: "additional_insureds", label: "Additional Insureds", icon: "Plus", description: "Additional insured parties and endorsement details", fields: [], generated: false, sourceType: "policy-level" },
  { id: "review_rating", label: "Review Rating", icon: "Zap", description: "UW risk factors, geographic modifiers, and premium calculations", fields: ["rf_yrs_in_ops", "rf_op_excel", "rf_prem_cond", "rf_comp_risk", "rf_claim_his", "rf_end_factor", "rf_lro_factor", "rf_vacant_factor"], generated: true, sourceType: "rating-factor" },
  { id: "review_quote", label: "Review & Quote", icon: "Eye", description: "Final premium review and quote generation", fields: [], generated: true, sourceType: "outputs", isReview: true },
  { id: "quote_package", label: "Quote Package", icon: "FileText", description: "Assemble quote documents and deliver to broker", fields: [], generated: true, sourceType: "outputs" },
];

// Simulated rater schema extracted from an Excel workbook
const RATER_SCHEMA = {
  name: "Acme CA Rater v3.2",
  type: "excel",
  filename: "CommercialAutoRater_v3.2.xlsx",
  lastModified: "2026-02-15",
  sheets: [
    { name: "Inputs_Policy", cardinality: "single", scope: "account", fields: [
      { cell: "B6", name: "state", type: "string", description: "Garaging state" },
      { cell: "B8", name: "effective_date", type: "date", description: "Policy effective date" },
      { cell: "B10", name: "is_fleet", type: "boolean", description: "Fleet indicator" },
      { cell: "B13", name: "csl_limit", type: "number", description: "Combined single limit" },
      { cell: "B14", name: "um_uim_selected", type: "boolean", description: "UM/UIM coverage selected" },
      { cell: "B16", name: "med_pay_selected", type: "boolean", description: "Med pay coverage selected" },
      { cell: "B18", name: "med_pay_limit", type: "number", description: "Med pay coverage limit" },
      { cell: "B19", name: "hired_selected", type: "boolean", description: "Hired auto selected" },
      { cell: "B20", name: "non_owned_selected", type: "boolean", description: "Non-owned auto selected" },
    ]},
    { name: "Inputs_Vehicles", cardinality: "array", scope: "per-vehicle", maxItems: 25, drivenBy: "vehicle_count", unitLabel: "Vehicle", fields: [
      { cell: "C2:C26", name: "vehicle_number", type: "number", description: "Vehicle number (1-25)" },
      { cell: "D2:D26", name: "state", type: "string", description: "Vehicle state" },
      { cell: "E2:E26", name: "use_class", type: "string", description: "Use classification" },
      { cell: "F2:F26", name: "vehicle_class", type: "string", description: "Vehicle class" },
      { cell: "G2:G26", name: "year", type: "number", description: "Model year" },
      { cell: "H2:H26", name: "cost_new", type: "currency", description: "Original cost" },
      { cell: "L2:L26", name: "gvw_gcw", type: "number", description: "Gross vehicle weight" },
      { cell: "M2:M26", name: "radius", type: "number", description: "Operating radius (miles)" },
      { cell: "N2:N26", name: "deductible_comp", type: "currency", description: "Comp deductible" },
      { cell: "O2:O26", name: "deductible_coll", type: "currency", description: "Collision deductible" },
    ]},
  ],
  outputs: [
    { cell: "Calculator!AR2", name: "total_vehicles", type: "number" },
    { cell: "Calculator!AR3", name: "total_liability_premium", type: "currency" },
    { cell: "Calculator!AR4", name: "total_comp_premium", type: "currency" },
    { cell: "Calculator!AR6", name: "total_collision_premium", type: "currency" },
    { cell: "Calculator!AR8", name: "total_um_uim_premium", type: "currency" },
    { cell: "Calculator!AR9", name: "total_med_pay_premium", type: "currency" },
    { cell: "Calculator!AR12", name: "total_premium", type: "currency" },
  ],
};

// Habitational GL Rater Schema (from Ascendex Underwriters)
const GL_RATER_SCHEMA = {
  name: "Habitational General Liability Rater",
  type: "excel",
  filename: "sample-workbook.xlsx",
  vendor: "Ascendex Underwriters",
  lastModified: "2026-02-15",
  sheets: [
    {
      name: "Inputs",
      cardinality: "single", scope: "account",
      fields: [
        { cell: "E10", name: "named_insured", type: "string", description: "Named insured name" },
        { cell: "E13", name: "effective_date", type: "date", description: "Policy effective date" },
        { cell: "E16", name: "expiration_date", type: "date", description: "Policy expiration date" },
        { cell: "E19", name: "new_renewal", type: "string", description: "New or Renewal business" },
        { cell: "E22", name: "named_entity_type", type: "string", description: "Named entity type (Owner-Lessor, Property Manager, etc.)" },
        { cell: "E25", name: "primary_zip_code", type: "string", description: "Primary zip code" },
        { cell: "E28", name: "num_locations", type: "number", description: "Number of locations" },
        { cell: "E31", name: "industry_class", type: "string", description: "Industry class" },
      ]
    },
    {
      name: "Inputs_Loc",
      cardinality: "array", scope: "per-location", drivenBy: "num_locations", unitLabel: "Location",
      fields: [
        { cell: "M12", name: "location_name", type: "string", description: "Location name" },
        { cell: "M14", name: "llc_name", type: "string", description: "LLC name" },
        { cell: "M16", name: "zip_code", type: "string", description: "Zip code (if different than primary)" },
        { cell: "M18", name: "street_address", type: "string", description: "Street address" },
        { cell: "M22", name: "crime_score", type: "number", description: "Crime score (0-100)" },
        { cell: "M24", name: "sub_industry_class", type: "string", description: "Sub-industry class" },
        { cell: "M26", name: "num_stories", type: "number", description: "Number of stories" },
        { cell: "M28", name: "primary_exposure_units", type: "number", description: "Primary exposure base units (door count)" },
        { cell: "M31", name: "secondary_exposure_units", type: "number", description: "Secondary exposure base units" },
      ]
    },
    {
      name: "Coverages",
      cardinality: "mixed", scope: "mixed",
      scopeDetail: { account: ["effective_policy_aggregate", "blanket_ai", "blanket_pnc", "ebl_limit", "rroa", "med_pay_limit", "hnoa", "stop_gap_el"], perLocation: ["per_location_aggregate", "occurrence_limit", "deductible", "habitability_limit", "ab_limit", "exclude_sam", "exclude_firearms"] },
      fields: [
        { cell: "I12", name: "effective_policy_aggregate", type: "number", description: "Effective policy aggregate", scope: "account" },
        { cell: "I16", name: "blanket_ai", type: "string", description: "Blanket Additional Insured", scope: "account" },
        { cell: "I18", name: "blanket_pnc", type: "string", description: "Blanket Primary Non-Contributory", scope: "account" },
        { cell: "I20", name: "ebl_limit", type: "number", description: "Employee Benefits Liability limit", scope: "account" },
        { cell: "I22", name: "rroa", type: "string", description: "Waiver of Transfer of Rights of Recovery", scope: "account" },
        { cell: "I24", name: "med_pay_limit", type: "string", description: "Medical Payment limit", scope: "account" },
        { cell: "P14", name: "habitability_limit", type: "string", description: "Habitability sublimit", scope: "per-location" },
        { cell: "P16", name: "ab_limit", type: "string", description: "Assault & Battery aggregate", scope: "per-location" },
        { cell: "P18", name: "exclude_sam", type: "string", description: "Exclude Sexual Abuse & Molestation", scope: "per-location" },
        { cell: "P20", name: "exclude_firearms", type: "string", description: "Exclude Firearms", scope: "per-location" },
        { cell: "P22", name: "hnoa", type: "string", description: "Hired and Non-Owned Auto Liability", scope: "account" },
        { cell: "P24", name: "stop_gap_el", type: "string", description: "Stop Gap Employers Liability limit", scope: "account" },
        { cell: "per_location", name: "per_location_aggregate", type: "number", description: "Per Location/Project Aggregate", scope: "per-location" },
        { cell: "per_location", name: "occurrence_limit", type: "number", description: "Occurrence Limit", scope: "per-location" },
        { cell: "per_location", name: "deductible", type: "number", description: "Deductible", scope: "per-location" },
      ]
    },
    {
      name: "RateFactors",
      cardinality: "array", scope: "per-location", drivenBy: "num_locations", unitLabel: "Location",
      fields: [
        { cell: "RF", name: "rf_yrs_in_ops", type: "string", description: "Years in Operation", scope: "per-location" },
        { cell: "RF", name: "rf_op_excel", type: "string", description: "Operational Experience", scope: "per-location" },
        { cell: "RF", name: "rf_prem_cond", type: "string", description: "Premises Condition", scope: "per-location" },
        { cell: "RF", name: "rf_comp_risk", type: "string", description: "Complexity of Risk", scope: "per-location" },
        { cell: "RF", name: "rf_claim_his", type: "string", description: "Claim History", scope: "per-location" },
        { cell: "RF", name: "rf_end_factor", type: "string", description: "Endorsement Factor", scope: "per-location" },
        { cell: "RF", name: "rf_lro_factor", type: "string", description: "LRO Complexity Risk", scope: "per-location" },
        { cell: "RF", name: "rf_vacant_factor", type: "string", description: "Vacant Land Complexity Risk", scope: "per-location" },
      ]
    },
    {
      name: "Ind_RF",
      cardinality: "lookup", scope: "reference",
      fields: [
        { cell: "A", name: "industry_class_code", type: "string", description: "Industry class code" },
      ]
    },
  ],
  outputs: [
    { cell: "Coverages!G6", name: "total_premium", type: "currency" },
    { cell: "Coverages!J30", name: "primary_base_premium", type: "currency" },
    { cell: "Coverages!K30", name: "secondary_base_premium", type: "currency" },
    { cell: "Coverages!L30", name: "total_base_premium", type: "currency" },
    { cell: "Coverages!M30", name: "account_oc_additional_premium", type: "currency" },
    { cell: "Coverages!N30", name: "location_oc_additional_premium", type: "currency" },
    { cell: "Coverages!O30", name: "total_location_premium", type: "currency" },
  ],
};

// Flattened list of all rater input fields for mapping, with semantic categories
const SEMANTIC_CATEGORIES = [
  { id: "policy-level", label: "Policy-Level", color: "blue", description: "Basic policy information (state, dates, entity)" },
  { id: "coverage", label: "Coverage-Related", color: "green", description: "Tied to a specific coverage toggle or limit" },
  { id: "classification", label: "Classification", color: "amber", description: "Class codes, use classes, vehicle types" },
  { id: "exposure", label: "Exposure", color: "purple", description: "Payroll, TIV, vehicle values, revenue" },
  { id: "unit-level", label: "Unit-Level", color: "sky", description: "Per-vehicle, per-location, or per-class entry" },
  { id: "rating-factor", label: "Rating Factor", color: "orange", description: "Experience mod, credits, schedule rating" },
];

const SEMANTIC_CATEGORY_COLORS = {
  "policy-level": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  "coverage": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  "classification": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  "exposure": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  "unit-level": { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", dot: "bg-sky-500" },
  "rating-factor": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
};

// Auto-infer semantic category based on field metadata
const inferSemanticCategory = (field, sheetName) => {
  // Coverage-related
  if (["csl_limit", "um_uim_selected", "med_pay_selected", "med_pay_limit", "hired_selected", "non_owned_selected", "deductible_comp", "deductible_coll"].includes(field.name)) return "coverage";
  // Classification
  if (["use_class", "vehicle_class"].includes(field.name)) return "classification";
  // Exposure
  if (["cost_new", "gvw_gcw"].includes(field.name)) return "exposure";
  // Unit-level (from vehicle sheet)
  if (sheetName === "Inputs_Vehicles") return "unit-level";
  // Default: policy-level
  return "policy-level";
};

const ALL_RATER_FIELDS = RATER_SCHEMA.sheets.flatMap(s =>
  s.fields.map(f => ({ ...f, sheet: s.name, semanticCategory: inferSemanticCategory(f, s.name) }))
);

// GL-specific semantic category inference
const inferGLSemanticCategory = (field, sheetName) => {
  // Policy-level fields
  if (["named_insured", "effective_date", "expiration_date", "new_renewal", "named_entity_type", "primary_zip_code", "num_locations", "industry_class"].includes(field.name)) return "policy-level";
  // Coverage-related
  if (["effective_policy_aggregate", "blanket_ai", "blanket_pnc", "ebl_limit", "rroa", "med_pay_limit", "habitability_limit", "ab_limit", "exclude_sam", "exclude_firearms", "hnoa", "stop_gap_el", "per_location_aggregate", "occurrence_limit", "deductible"].includes(field.name)) return "coverage";
  // Classification
  if (["industry_class", "sub_industry_class"].includes(field.name)) return "classification";
  // Exposure
  if (["primary_exposure_units", "secondary_exposure_units"].includes(field.name)) return "exposure";
  // Rating factors
  if (field.name.startsWith("rf_")) return "rating-factor";
  // Unit-level (from location sheet)
  if (sheetName === "Inputs_Loc") return "unit-level";
  // Default: policy-level
  return "policy-level";
};

const GL_RATER_FIELDS = GL_RATER_SCHEMA.sheets.flatMap(s =>
  s.fields.map(f => ({ ...f, sheet: s.name, semanticCategory: inferGLSemanticCategory(f, s.name) }))
);

const BASE_FORMS = [
  { formNumber: "CA 00 01", name: "Business Auto Coverage Form", edition: "03 20", type: "coverage_form", required: true },
  { formNumber: "CA 00 05", name: "Business Auto Declarations", edition: "03 20", type: "declarations", required: true },
  { formNumber: "IL 00 17", name: "Common Policy Conditions", edition: "09 07", type: "conditions", required: true },
  { formNumber: "IL 00 21", name: "Nuclear Energy Liability Exclusion", edition: "09 08", type: "exclusion", required: true },
];

const ENDORSEMENTS = [
  { formNumber: "CA 04 44", name: "Waiver of Transfer of Rights of Recovery", edition: "10 13", rule: "optional", condition: "Waiver of subrogation requested" },
  { formNumber: "CA 20 48", name: "Designated Insured for Covered Autos", edition: "10 13", rule: "conditional", condition: "Additional insured count > 0" },
  { formNumber: "CA 99 17", name: "Auto Medical Payments Coverage", edition: "03 06", rule: "conditional", condition: "Med pay selected" },
  { formNumber: "CA 04 03", name: "Additional Insured - Lessor", edition: "10 13", rule: "conditional", condition: "Leased vehicles present" },
];

// ─── Form Template Fields (field superset: rater + form fields) ──────────────
// These are fields that come from form templates — they must also appear in the
// UW workflow so the underwriter can fill them, even if they're not rater inputs.
const FORM_TEMPLATE_FIELDS = [
  { name: "additional_insured_name", type: "string", description: "Name of additional insured", source: "form", formNumber: "CA 20 48", semanticCategory: "policy-level" },
  { name: "additional_insured_address", type: "string", description: "Address of additional insured", source: "form", formNumber: "CA 20 48", semanticCategory: "policy-level" },
  { name: "waiver_entity_name", type: "string", description: "Entity waiving subrogation rights", source: "form", formNumber: "CA 04 44", semanticCategory: "policy-level" },
  { name: "lessor_name", type: "string", description: "Name of vehicle lessor", source: "form", formNumber: "CA 04 03", semanticCategory: "unit-level" },
  { name: "lessor_address", type: "string", description: "Address of vehicle lessor", source: "form", formNumber: "CA 04 03", semanticCategory: "unit-level" },
  { name: "leased_vehicle_vin", type: "string", description: "VIN of leased vehicle", source: "form", formNumber: "CA 04 03", semanticCategory: "unit-level" },
];

// Combined field superset: rater inputs + form template fields
const FIELD_SUPERSET = [
  ...ALL_RATER_FIELDS.map(f => ({ ...f, source: "rater" })),
  ...FORM_TEMPLATE_FIELDS,
];

const GL_FIELD_SUPERSET = [
  ...GL_RATER_FIELDS.map(f => ({ ...f, source: "rater" })),
];

// ─── LOB-aware data resolvers ────────────────────────────────────────────────
const getRaterSchema = (lobType) => lobType === "habitational_gl" ? GL_RATER_SCHEMA : RATER_SCHEMA;
const getRaterFields = (lobType) => lobType === "habitational_gl" ? GL_RATER_FIELDS : ALL_RATER_FIELDS;
const getFieldSuperset = (lobType) => lobType === "habitational_gl" ? GL_FIELD_SUPERSET : FIELD_SUPERSET;
const getFieldDefs = (lobType) => lobType === "habitational_gl" ? GL_PRODUCT_FIELD_DEFINITIONS : PRODUCT_FIELD_DEFINITIONS;

// ─── Field Source Types ───────────────────────────────────────────────────────
const FIELD_SOURCE_TYPES = [
  { id: "rater", label: "Connected Rater", icon: "Database", color: "blue", description: "Extracted from the connected rating workbook or API" },
  { id: "database", label: "Database / Schema Sense", icon: "Layers", color: "purple", description: "Pulled from existing field identity in the platform database" },
  { id: "submission", label: "Submission Intake", icon: "Upload", color: "amber", description: "Captured from submission email, portal upload, or ACORD form" },
  { id: "user-input", label: "User Input", icon: "Edit", color: "teal", description: "Entered manually by the underwriter during the workflow" },
  { id: "form", label: "Form Template", icon: "FileText", color: "pink", description: "Required by an attached form template (fillable fields)" },
];

const FIELD_SOURCE_COLORS = {
  "rater": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  "database": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  "submission": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  "user-input": { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", dot: "bg-teal-500" },
  "form": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", dot: "bg-pink-500" },
};

// ─── Product-Level Field Definitions ─────────────────────────────────────────
// William's key insight: conditions belong on the PRODUCT field definition,
// not on the workflow UI. The product manager defines how each field behaves
// at the product level. The workflow builder inherits these as read-only.
//
// `source` identifies WHERE the field value comes from.
// `linkedTo` identifies cross-field connections (e.g. a form field that is
// conditionally triggered by a rater field — show the link on both sides).
const PRODUCT_FIELD_DEFINITIONS = {
  // ── Policy-level fields ──
  state: {
    label: "Garaging State", inputType: "dropdown", required: true,
    source: "rater", sourceDetail: "Inputs_Policy!B6", semanticCategory: "policy-level",
    allowedValues: ["GA", "FL", "SC", "NC", "AL", "TN"],
    defaultValue: "GA", helpText: "Primary state where vehicles are garaged",
    validation: { type: "required" },
    conditions: [],
    optionConditions: [],
  },
  effective_date: {
    label: "Policy Effective Date", inputType: "date", required: true,
    source: "rater", sourceDetail: "Inputs_Policy!B8", semanticCategory: "policy-level",
    defaultValue: "", helpText: "Must be within 60 days of today",
    validation: { type: "date_range", min: "today", max: "+60d" },
    conditions: [],
    optionConditions: [],
  },
  is_fleet: {
    label: "Fleet Indicator", inputType: "toggle", required: false,
    source: "submission", sourceDetail: "ACORD 127 — fleet question", semanticCategory: "policy-level",
    defaultValue: false, helpText: "Enable if insured has 5+ vehicles",
    conditions: [],
    optionConditions: [],
  },
  // ── Coverage-related fields ──
  csl_limit: {
    label: "Combined Single Limit", inputType: "dropdown", required: true,
    source: "rater", sourceDetail: "Inputs_Policy!B13", semanticCategory: "coverage",
    allowedValues: ["$300K", "$500K", "$1M"],
    defaultValue: "$500K", helpText: "Per-occurrence liability limit",
    conditions: [],
    optionConditions: [
      { id: "oc1", label: "FL caps CSL at $500K", whenField: "state", operator: "equals", whenValue: "FL", filteredValues: ["$300K", "$500K"] },
    ],
  },
  um_uim_selected: {
    label: "UM/UIM Coverage", inputType: "toggle", required: false,
    source: "rater", sourceDetail: "Inputs_Policy!B14", semanticCategory: "coverage",
    defaultValue: true, helpText: "Uninsured/underinsured motorist coverage",
    conditions: [],
    optionConditions: [],
  },
  med_pay_selected: {
    label: "Medical Payments", inputType: "toggle", required: false,
    source: "rater", sourceDetail: "Inputs_Policy!B16", semanticCategory: "coverage",
    defaultValue: false, helpText: "Enable medical payments coverage",
    linkedTo: [{ field: "med_pay_limit", relationship: "controls visibility" }],
    conditions: [],
    optionConditions: [],
  },
  med_pay_limit: {
    label: "Med Pay Limit", inputType: "dropdown", required: true,
    source: "rater", sourceDetail: "Inputs_Policy!B18", semanticCategory: "coverage",
    allowedValues: ["$1,000", "$2,000", "$5,000", "$10,000"],
    defaultValue: "$5,000", helpText: "Per-person medical payment limit",
    linkedTo: [{ field: "med_pay_selected", relationship: "visible when enabled" }],
    conditions: [
      { id: "vc1", type: "visibility", showWhen: "med_pay_selected", operator: "equals", value: true, label: "Show only when med pay is selected" },
    ],
    optionConditions: [
      { id: "oc2", label: "GA limits med pay to $5K max", whenField: "state", operator: "equals", whenValue: "GA", filteredValues: ["$1,000", "$2,000", "$5,000"] },
    ],
  },
  hired_selected: {
    label: "Hired Auto Liability", inputType: "toggle", required: false,
    source: "rater", sourceDetail: "Inputs_Policy!B19", semanticCategory: "coverage",
    defaultValue: false, helpText: "Coverage for rented/hired vehicles",
    linkedTo: [
      { field: "additional_insured_name", relationship: "triggers form field" },
      { field: "additional_insured_address", relationship: "triggers form field" },
    ],
    conditions: [],
    optionConditions: [],
  },
  non_owned_selected: {
    label: "Non-Owned Auto", inputType: "toggle", required: false,
    source: "rater", sourceDetail: "Inputs_Policy!B20", semanticCategory: "coverage",
    defaultValue: false, helpText: "Coverage for employee-owned vehicles used for business",
    conditions: [],
    optionConditions: [],
  },
  // ── Vehicle-level fields ──
  vehicle_number: {
    label: "#", inputType: "auto_increment", required: true,
    source: "rater", sourceDetail: "Inputs_Vehicles!C2:C26", semanticCategory: "unit-level",
    conditions: [],
    optionConditions: [],
  },
  use_class: {
    label: "Use Class", inputType: "dropdown", required: true,
    source: "database", sourceDetail: "Schema Sense — vehicle.use_classification", semanticCategory: "classification",
    allowedValues: ["Commercial", "Service", "Retail", "Pleasure"],
    defaultValue: "Commercial", helpText: "How is the vehicle primarily used?",
    conditions: [],
    optionConditions: [],
  },
  vehicle_class: {
    label: "Vehicle Class", inputType: "dropdown", required: true,
    source: "database", sourceDetail: "Schema Sense — vehicle.iso_class", semanticCategory: "classification",
    allowedValues: ["Private Passenger", "Light Truck", "Medium Truck", "Heavy Truck", "Extra Heavy Truck", "Heavy Truck Tractor", "Extra Heavy Truck Tractor", "Trailer"],
    helpText: "Based on vehicle type and GVW",
    conditions: [],
    optionConditions: [],
  },
  year: {
    label: "Year", inputType: "number", required: true,
    source: "submission", sourceDetail: "ACORD 127 — vehicle schedule", semanticCategory: "unit-level",
    validation: { type: "range", min: 1990, max: 2027 },
    conditions: [],
    optionConditions: [],
  },
  cost_new: {
    label: "Cost New", inputType: "currency", required: true,
    source: "user-input", sourceDetail: "Entered by underwriter", semanticCategory: "exposure",
    helpText: "Original vehicle cost",
    conditions: [],
    optionConditions: [],
  },
  gvw_gcw: {
    label: "GVW/GCW", inputType: "number", required: false,
    source: "user-input", sourceDetail: "Entered by underwriter", semanticCategory: "exposure",
    helpText: "Gross vehicle weight — required for trucks",
    conditions: [
      { id: "vc2", type: "visibility", showWhen: "vehicle_class", operator: "in", value: ["Medium Truck", "Heavy Truck", "Extra Heavy Truck", "Heavy Truck Tractor", "Extra Heavy Truck Tractor"], label: "Show GVW only for truck classes" },
    ],
    optionConditions: [],
  },
  radius: {
    label: "Radius (mi)", inputType: "number", required: false,
    source: "submission", sourceDetail: "ACORD 127 — operating radius", semanticCategory: "unit-level",
    helpText: "Operating radius from base",
    validation: { type: "range", min: 0, max: 1000 },
    conditions: [],
    optionConditions: [],
  },
  deductible_comp: {
    label: "Comp Ded.", inputType: "dropdown", required: false,
    source: "rater", sourceDetail: "Inputs_Vehicles!N2:N26", semanticCategory: "coverage",
    allowedValues: ["$250", "$500", "$1,000", "$2,500"],
    defaultValue: "$500",
    conditions: [
      { id: "vc3", type: "visibility", showWhen: "_coverage_enabled", operator: "equals", value: "comprehensive", label: "Show only if Comprehensive enabled" },
    ],
    optionConditions: [],
  },
  deductible_coll: {
    label: "Coll Ded.", inputType: "dropdown", required: false,
    source: "rater", sourceDetail: "Inputs_Vehicles!O2:O26", semanticCategory: "coverage",
    allowedValues: ["$250", "$500", "$1,000", "$2,500"],
    defaultValue: "$500",
    conditions: [
      { id: "vc4", type: "visibility", showWhen: "_coverage_enabled", operator: "equals", value: "collision", label: "Show only if Collision enabled" },
    ],
    optionConditions: [],
  },
  // ── Form-sourced fields ──
  additional_insured_name: {
    label: "Additional Insured Name", inputType: "text", required: true,
    source: "form", formNumber: "CA 20 48", sourceDetail: "CA 20 48 — Line 1", semanticCategory: "policy-level",
    helpText: "Required when additional insured endorsement is attached",
    linkedTo: [{ field: "hired_selected", relationship: "visible when enabled" }],
    conditions: [
      { id: "vc5", type: "visibility", showWhen: "hired_selected", operator: "equals", value: true, label: "Show when hired auto (additional insured) is selected" },
    ],
    optionConditions: [],
  },
  additional_insured_address: {
    label: "Additional Insured Address", inputType: "text", required: true,
    source: "form", formNumber: "CA 20 48", sourceDetail: "CA 20 48 — Line 2", semanticCategory: "policy-level",
    linkedTo: [{ field: "hired_selected", relationship: "visible when enabled" }],
    conditions: [
      { id: "vc6", type: "visibility", showWhen: "hired_selected", operator: "equals", value: true, label: "Show when hired auto is selected" },
    ],
    optionConditions: [],
  },
  waiver_entity_name: {
    label: "Waiver of Subrogation — Entity", inputType: "text", required: false,
    source: "form", formNumber: "CA 04 44", sourceDetail: "CA 04 44 — Entity Name", semanticCategory: "policy-level",
    helpText: "Entity name for waiver of transfer of recovery rights",
    conditions: [],
    optionConditions: [],
  },
  lessor_name: {
    label: "Lessor Name", inputType: "text", required: true,
    source: "form", formNumber: "CA 04 03", sourceDetail: "CA 04 03 — Lessor Name", semanticCategory: "unit-level",
    conditions: [
      { id: "vc7", type: "visibility", showWhen: "_has_leased_vehicle", operator: "equals", value: true, label: "Show when leased vehicle present" },
    ],
    optionConditions: [],
  },
  lessor_address: {
    label: "Lessor Address", inputType: "text", required: true,
    source: "form", formNumber: "CA 04 03", sourceDetail: "CA 04 03 — Lessor Address", semanticCategory: "unit-level",
    conditions: [
      { id: "vc8", type: "visibility", showWhen: "_has_leased_vehicle", operator: "equals", value: true, label: "Show when leased vehicle present" },
    ],
    optionConditions: [],
  },
  leased_vehicle_vin: {
    label: "Leased Vehicle VIN", inputType: "text", required: true,
    source: "form", formNumber: "CA 04 03", sourceDetail: "CA 04 03 — VIN", semanticCategory: "unit-level",
    conditions: [
      { id: "vc9", type: "visibility", showWhen: "_has_leased_vehicle", operator: "equals", value: true, label: "Show when leased vehicle present" },
    ],
    optionConditions: [],
  },
};

// ─── GL Product Field Definitions (Habitational GL) ──────────────────────────
const GL_PRODUCT_FIELD_DEFINITIONS = {
  // ── Account-level (Insured Profile) ──
  named_insured: {
    label: "Named Insured", inputType: "text", required: true, scope: "account",
    source: "rater", sourceDetail: "Inputs!E10", semanticCategory: "policy-level",
    helpText: "Full legal name of the insured", conditions: [], optionConditions: [],
  },
  effective_date: {
    label: "Effective Date", inputType: "date", required: true, scope: "account",
    source: "rater", sourceDetail: "Inputs!E13", semanticCategory: "policy-level",
    helpText: "Policy effective date", conditions: [], optionConditions: [],
  },
  expiration_date: {
    label: "Expiration Date", inputType: "date", required: true, scope: "account",
    source: "rater", sourceDetail: "Inputs!E16", semanticCategory: "policy-level",
    helpText: "Policy expiration date", conditions: [], optionConditions: [],
  },
  new_renewal: {
    label: "New / Renewal", inputType: "dropdown", required: true, scope: "account",
    source: "rater", sourceDetail: "Inputs!E19", semanticCategory: "policy-level",
    allowedValues: ["New", "Renewal"], defaultValue: "New",
    helpText: "New business or renewal", conditions: [], optionConditions: [],
  },
  named_entity_type: {
    label: "Named Entity Type", inputType: "dropdown", required: true, scope: "account",
    source: "rater", sourceDetail: "Inputs!E22", semanticCategory: "policy-level",
    allowedValues: ["Owner-Lessor (NAIC: 531110, SIC: 6513)", "Owner-Lessor/Property Manager (NAIC: 531110, SIC: 6513)", "Property Manager (NAIC: 531311, SIC: 6531)"],
    helpText: "Determines occupancy type rating factor", conditions: [], optionConditions: [],
  },
  primary_zip_code: {
    label: "Primary Zip Code", inputType: "text", required: true, scope: "account",
    source: "rater", sourceDetail: "Inputs!E25", semanticCategory: "policy-level",
    helpText: "Primary location zip code — drives geographic risk factor",
    conditions: [], optionConditions: [],
  },
  num_locations: {
    label: "Number of Locations", inputType: "number", required: true, scope: "account",
    source: "rater", sourceDetail: "Inputs!E28", semanticCategory: "policy-level",
    helpText: "Total number of insured locations (1-10)", defaultValue: 1,
    validation: { type: "range", min: 1, max: 10 },
    isArrayDriver: true, drivesSheet: "Inputs_Loc", drivesUnitLabel: "Location",
    conditions: [], optionConditions: [],
  },
  industry_class: {
    label: "Industry Class", inputType: "dropdown", required: true, scope: "account",
    source: "rater", sourceDetail: "Ind_RF!C7:C25", semanticCategory: "classification",
    allowedValues: ["Apartments", "Condominiums (Condos)", "Cooperatives (Co-ops)", "Lessors Risk Only (LRO)", "Luxury Apartments/Condos", "Mixed-Use Buildings", "Multi-Family Homes (2 Family)", "Multi-Family Homes (3 Family)", "Multi-Family Homes (4 Family)", "Senior Living/Assisted Living", "Senior Living/Independent Living", "Single-Family Homes", "Student Housing", "Townhouses", "Vacant Land", "Workforce Housing"],
    defaultValue: "Apartments", helpText: "Determines base rate, industry risk factor, and exposure base allocation",
    conditions: [], optionConditions: [],
  },
  // ── Location-level fields (per-location, repeating) ──
  location_name: {
    label: "Location Name", inputType: "text", required: true, scope: "per-location",
    source: "rater", sourceDetail: "Inputs_Loc!M12", semanticCategory: "unit-level",
    helpText: "Descriptive location name", conditions: [], optionConditions: [],
  },
  llc_name: {
    label: "LLC Name", inputType: "text", required: false, scope: "per-location",
    source: "rater", sourceDetail: "Inputs_Loc!M14", semanticCategory: "unit-level",
    helpText: "LLC entity for this location", conditions: [], optionConditions: [],
  },
  zip_code: {
    label: "Location Zip Code", inputType: "text", required: true, scope: "per-location",
    source: "rater", sourceDetail: "Inputs_Loc!M16", semanticCategory: "unit-level",
    helpText: "Zip code if different from primary — drives geographic and crime modifiers",
    conditions: [], optionConditions: [],
  },
  street_address: {
    label: "Street Address", inputType: "text", required: true, scope: "per-location",
    source: "rater", sourceDetail: "Inputs_Loc!M18", semanticCategory: "unit-level",
    conditions: [], optionConditions: [],
  },
  crime_score: {
    label: "Crime Score", inputType: "number", required: true, scope: "per-location",
    source: "rater", sourceDetail: "Inputs_Loc!M22", semanticCategory: "unit-level",
    helpText: "0-100 scale. Drives coverage exclusion rules (A&B, SAM, Firearms, Habitability)",
    validation: { type: "range", min: 0, max: 100 },
    linkedTo: [
      { field: "habitability_limit", relationship: "determines exclusion" },
      { field: "ab_limit", relationship: "determines exclusion" },
      { field: "exclude_sam", relationship: "determines exclusion" },
      { field: "exclude_firearms", relationship: "determines exclusion" },
    ],
    conditions: [], optionConditions: [],
  },
  sub_industry_class: {
    label: "Sub-Industry Class", inputType: "dropdown", required: true, scope: "per-location",
    source: "rater", sourceDetail: "Inputs_Loc!M24", semanticCategory: "classification",
    allowedValues: ["Apartments", "Condominiums (Condos)", "Cooperatives (Co-ops)", "Lessors Risk Only (LRO)", "Luxury Apartments/Condos", "Mixed-Use Buildings", "Single-Family Homes", "Townhouses"],
    helpText: "Location-specific sub-class (inherits from account industry class)",
    conditions: [], optionConditions: [],
  },
  num_stories: {
    label: "Number of Stories", inputType: "number", required: false, scope: "per-location",
    source: "rater", sourceDetail: "Inputs_Loc!M26", semanticCategory: "unit-level",
    validation: { type: "range", min: 1, max: 100 },
    conditions: [], optionConditions: [],
  },
  primary_exposure_units: {
    label: "Primary Exposure Units", inputType: "number", required: true, scope: "per-location",
    source: "rater", sourceDetail: "Inputs_Loc!M28", semanticCategory: "exposure",
    helpText: "Door count, square footage, or acreage — depends on industry class",
    conditions: [], optionConditions: [],
  },
  secondary_exposure_units: {
    label: "Secondary Exposure Units", inputType: "number", required: false, scope: "per-location",
    source: "rater", sourceDetail: "Inputs_Loc!M31", semanticCategory: "exposure",
    helpText: "Secondary exposure base (if applicable)",
    conditions: [], optionConditions: [],
  },
  // ── Coverage fields ──
  effective_policy_aggregate: {
    label: "Effective Policy Aggregate", inputType: "dropdown", required: true, scope: "account",
    source: "rater", sourceDetail: "Coverages!I12", semanticCategory: "coverage",
    allowedValues: ["$100K", "$250K", "$300K", "$500K", "$750K", "$1M", "$1.5M", "$2M", "$3M", "$4M", "$5M"],
    defaultValue: "$2M", helpText: "Account-level policy aggregate limit",
    conditions: [], optionConditions: [],
  },
  per_location_aggregate: {
    label: "Per Location Aggregate", inputType: "dropdown", required: true, scope: "per-location",
    source: "rater", sourceDetail: "Coverages!E30", semanticCategory: "coverage",
    allowedValues: ["$100K", "$250K", "$300K", "$500K", "$750K", "$1M", "$1.5M", "$2M"],
    defaultValue: "$2M", helpText: "Location-level aggregate limit",
    conditions: [], optionConditions: [],
  },
  occurrence_limit: {
    label: "Occurrence Limit", inputType: "dropdown", required: true, scope: "per-location",
    source: "rater", sourceDetail: "Coverages!F30", semanticCategory: "coverage",
    allowedValues: ["$100K", "$250K", "$300K", "$500K", "$750K", "$1M"],
    defaultValue: "$1M", conditions: [], optionConditions: [],
  },
  deductible: {
    label: "Deductible", inputType: "dropdown", required: true, scope: "per-location",
    source: "rater", sourceDetail: "Coverages!G30", semanticCategory: "coverage",
    allowedValues: ["$2,500", "$5,000", "$10,000", "$25,000"],
    defaultValue: "$5,000", helpText: "Minimum deductible varies by industry class",
    conditions: [], optionConditions: [],
  },
  blanket_ai: {
    label: "Blanket Additional Insured", inputType: "toggle", required: false, scope: "account",
    source: "rater", sourceDetail: "Coverages!I16", semanticCategory: "coverage",
    defaultValue: true, helpText: "10% additional premium surcharge",
    conditions: [], optionConditions: [],
  },
  blanket_pnc: {
    label: "Blanket Primary Non-Contributory", inputType: "toggle", required: false, scope: "account",
    source: "rater", sourceDetail: "Coverages!I18", semanticCategory: "coverage",
    defaultValue: false, helpText: "2% additional premium surcharge",
    conditions: [], optionConditions: [],
  },
  ebl_limit: {
    label: "Employee Benefits Liability", inputType: "dropdown", required: false, scope: "account",
    source: "rater", sourceDetail: "Coverages!I20", semanticCategory: "coverage",
    allowedValues: ["Excluded", "$25K", "$50K", "$100K", "$250K", "$300K", "$500K", "$1M"],
    defaultValue: "Excluded", helpText: "Flat fee added to premium",
    conditions: [], optionConditions: [],
  },
  rroa: {
    label: "Waiver of Transfer of Rights (RROA)", inputType: "toggle", required: false, scope: "account",
    source: "rater", sourceDetail: "Coverages!I22", semanticCategory: "coverage",
    defaultValue: false, helpText: "2% additional premium surcharge",
    conditions: [], optionConditions: [],
  },
  med_pay_limit: {
    label: "Medical Payments", inputType: "dropdown", required: false, scope: "account",
    source: "rater", sourceDetail: "Coverages!I24", semanticCategory: "coverage",
    allowedValues: ["Excluded", "$2,500", "$5,000", "$10,000"],
    defaultValue: "Excluded", conditions: [], optionConditions: [],
  },
  habitability_limit: {
    label: "Habitability Sublimit", inputType: "dropdown", required: false, scope: "per-location",
    source: "rater", sourceDetail: "Coverages!P14", semanticCategory: "coverage",
    allowedValues: ["Excluded", "$25K", "$50K", "$100K", "$250K", "$300K"],
    defaultValue: "Excluded", helpText: "Location-level — subject to crime score exclusion rules",
    linkedTo: [{ field: "crime_score", relationship: "excluded by high crime score" }],
    conditions: [], optionConditions: [
      { id: "gl_oc1", label: "Crime ≥80 excludes habitability", whenField: "crime_score", operator: "gte", whenValue: 80, filteredValues: ["Excluded"] },
    ],
  },
  ab_limit: {
    label: "Assault & Battery Limit", inputType: "dropdown", required: false, scope: "per-location",
    source: "rater", sourceDetail: "Coverages!P16", semanticCategory: "coverage",
    allowedValues: ["Excluded", "$25K", "$50K", "$100K", "$250K", "$300K", "$500K", "$1M"],
    defaultValue: "Excluded", helpText: "Location-level A&B aggregate — subject to crime score",
    linkedTo: [{ field: "crime_score", relationship: "excluded by high crime score" }],
    conditions: [], optionConditions: [
      { id: "gl_oc2", label: "Crime ≥80 excludes A&B", whenField: "crime_score", operator: "gte", whenValue: 80, filteredValues: ["Excluded"] },
    ],
  },
  exclude_sam: {
    label: "Exclude Sexual Abuse & Molestation", inputType: "toggle", required: false, scope: "per-location",
    source: "rater", sourceDetail: "Coverages!P18", semanticCategory: "coverage",
    defaultValue: false, helpText: "Mandatory exclusion when crime score ≥ 80",
    conditions: [], optionConditions: [],
  },
  exclude_firearms: {
    label: "Exclude Firearms", inputType: "toggle", required: false, scope: "per-location",
    source: "rater", sourceDetail: "Coverages!P20", semanticCategory: "coverage",
    defaultValue: false, helpText: "Mandatory exclusion when crime score ≥ 80",
    conditions: [], optionConditions: [],
  },
  hnoa: {
    label: "Hired & Non-Owned Auto", inputType: "dropdown", required: false, scope: "account",
    source: "rater", sourceDetail: "Coverages!P22", semanticCategory: "coverage",
    allowedValues: ["Excluded", "$25K", "$50K", "$100K", "$250K", "$300K", "$500K", "$1M"],
    defaultValue: "Excluded", helpText: "HNOA excluded for Senior Living and Assisted Living classes",
    conditions: [], optionConditions: [
      { id: "gl_oc3", label: "Senior Living excludes HNOA", whenField: "industry_class", operator: "in", whenValue: ["Senior Living/Assisted Living", "Senior Living/Independent Living", "Senior Living/Retirement Communities"], filteredValues: ["Excluded"] },
    ],
  },
  stop_gap_el: {
    label: "Stop Gap Employers Liability", inputType: "dropdown", required: false, scope: "account",
    source: "rater", sourceDetail: "Coverages!P24", semanticCategory: "coverage",
    allowedValues: ["Excluded", "$100K", "$500K", "$1M"],
    defaultValue: "Excluded", helpText: "Available only in monopolistic states (ND, OH, WA, WY)",
    conditions: [], optionConditions: [],
  },
  // ── UW Risk Factors ──
  rf_yrs_in_ops: {
    label: "Years in Operation", inputType: "dropdown", required: true, scope: "per-location",
    source: "rater", sourceDetail: "RateFactors!F22", semanticCategory: "rating-factor",
    allowedValues: ["Low Risk", "Average Risk", "High Risk"], defaultValue: "Average Risk",
    helpText: ">10 yrs = Low (0.8-0.95), 3-10 yrs = Avg (0.95-1.1), <2 yrs = High (1.1-1.35)",
    conditions: [], optionConditions: [],
  },
  rf_op_excel: {
    label: "Operational Experience", inputType: "dropdown", required: true, scope: "per-location",
    source: "rater", sourceDetail: "RateFactors!P22", semanticCategory: "rating-factor",
    allowedValues: ["Low Risk", "Average Risk", "High Risk"], defaultValue: "Average Risk",
    helpText: "Based on UW guidelines rubric", conditions: [], optionConditions: [],
  },
  rf_prem_cond: {
    label: "Premises Condition", inputType: "dropdown", required: true, scope: "per-location",
    source: "rater", sourceDetail: "RateFactors!F36", semanticCategory: "rating-factor",
    allowedValues: ["Low Risk", "Average Risk", "High Risk"], defaultValue: "Average Risk",
    helpText: "Score 7-11 = Low, 12-16 = Avg, 17-19 = High", conditions: [], optionConditions: [],
  },
  rf_comp_risk: {
    label: "Complexity of Risk", inputType: "dropdown", required: true, scope: "per-location",
    source: "rater", sourceDetail: "RateFactors!P36", semanticCategory: "rating-factor",
    allowedValues: ["Low Risk", "Average Risk", "High Risk"], defaultValue: "Average Risk",
    helpText: "Based on number of complex risk features", conditions: [], optionConditions: [],
  },
  rf_claim_his: {
    label: "Claim History", inputType: "dropdown", required: true, scope: "per-location",
    source: "rater", sourceDetail: "RateFactors!F50", semanticCategory: "rating-factor",
    allowedValues: ["Low Risk", "Average Risk", "High Risk"], defaultValue: "Average Risk",
    helpText: "Past 5 years — no claims = Low, minimal = Avg, significant = High",
    conditions: [], optionConditions: [],
  },
  rf_end_factor: {
    label: "Endorsement Factor", inputType: "dropdown", required: true, scope: "per-location",
    source: "rater", sourceDetail: "RateFactors!F58", semanticCategory: "rating-factor",
    allowedValues: ["Low Risk", "Average Risk", "High Risk"], defaultValue: "Average Risk",
    helpText: "Reduces exposure = Low, default = Avg, expands = High",
    conditions: [], optionConditions: [],
  },
  rf_lro_factor: {
    label: "LRO Complexity Risk", inputType: "dropdown", required: false, scope: "per-location",
    source: "rater", sourceDetail: "RateFactors!F64", semanticCategory: "rating-factor",
    allowedValues: ["Low Risk", "Average Risk", "High Risk"], defaultValue: "Average Risk",
    helpText: "Tenant type risk — bars/cannabis/liquor = High",
    conditions: [
      { id: "gl_vc1", type: "visibility", showWhen: "industry_class", operator: "equals", value: "Lessors Risk Only (LRO)", label: "Show only for LRO industry class" },
    ],
    optionConditions: [],
  },
  rf_vacant_factor: {
    label: "Vacant Land Complexity", inputType: "dropdown", required: false, scope: "per-location",
    source: "rater", sourceDetail: "RateFactors!F70", semanticCategory: "rating-factor",
    allowedValues: ["Low Risk", "Average Risk", "High Risk"], defaultValue: "Average Risk",
    helpText: "Attractive nuisances and access prevention measures",
    conditions: [
      { id: "gl_vc2", type: "visibility", showWhen: "industry_class", operator: "equals", value: "Vacant Land", label: "Show only for Vacant Land industry class" },
    ],
    optionConditions: [],
  },
};

// ─── Reusable Components ────────────────────────────────────────────────────

function Card({ children, className = "" }) {
  return <div className={`bg-white border border-gray-200 rounded-lg p-5 ${className}`}>{children}</div>;
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
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Draft: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Published: "bg-green-50 text-green-700 border-green-200",
    Connected: "bg-green-50 text-green-700 border-green-200",
    Pending: "bg-gray-50 text-gray-500 border-gray-200",
    Mapped: "bg-blue-50 text-blue-700 border-blue-200",
    Unmapped: "bg-red-50 text-red-600 border-red-200",
    "Auto-mapped": "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${styles[status] || "bg-gray-50 text-gray-500 border-gray-200"}`}>
      {status}
    </span>
  );
}

// ─── Step 1: Rater Connection ───────────────────────────────────────────────

function RaterConnectionStep({ raterStatus, onConnect, lobType }) {
  const raterSchema = getRaterSchema(lobType);
  const raterFields = getRaterFields(lobType);
  const [connectionType, setConnectionType] = useState("excel");
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      onConnect("excel");
    }, 1500);
  };

  if (raterStatus === "connected") {
    return (
      <div className="space-y-5">
        <Card className="border-green-200 bg-green-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Icons.Check />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{raterSchema.filename}</p>
                <p className="text-xs text-gray-500">{raterSchema.name} · Last modified {raterSchema.lastModified}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status="Connected" />
              <button className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded hover:bg-white">Replace</button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <p className="text-2xl font-bold text-gray-900">{raterSchema.sheets.length}</p>
            <p className="text-xs text-gray-500 mt-1">Input Sheets Detected</p>
          </Card>
          <Card>
            <p className="text-2xl font-bold text-gray-900">{raterFields.length}</p>
            <p className="text-xs text-gray-500 mt-1">Input Fields Found</p>
          </Card>
          <Card>
            <p className="text-2xl font-bold text-gray-900">{raterSchema.outputs.length}</p>
            <p className="text-xs text-gray-500 mt-1">Output Fields Found</p>
          </Card>
          <Card className="border-sky-200 bg-sky-50/30">
            <p className="text-2xl font-bold text-sky-700">{raterSchema.sheets.filter(s => s.cardinality === "array").length}</p>
            <p className="text-xs text-gray-500 mt-1">Repeating Schedules</p>
          </Card>
        </div>

        {/* Array / repeating schedule callout */}
        {raterSchema.sheets.some(s => s.cardinality === "array") && (
          <Card className="border-sky-200 bg-sky-50/30">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 flex-shrink-0">
                <Icons.Layers />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">Repeating Data Detected</p>
                <p className="text-xs text-gray-500 mb-2">Some sheets contain per-unit fields that repeat for each item in a schedule. The rater processes each unit independently and rolls up to account-level totals.</p>
                <div className="space-y-1.5">
                  {raterSchema.sheets.filter(s => s.cardinality === "array").map(s => (
                    <div key={s.name} className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded font-medium font-mono">{s.name}</span>
                      <span className="text-gray-600">→ {s.maxItems ? `Up to ${s.maxItems}` : "N"} {s.unitLabel?.toLowerCase()}s · {s.fields.length} fields per {s.unitLabel?.toLowerCase()}</span>
                      <span className="text-gray-400">· driven by <span className="font-mono text-sky-600">{s.drivenBy}</span></span>
                    </div>
                  ))}
                  {raterSchema.sheets.filter(s => s.cardinality === "mixed").map(s => (
                    <div key={s.name} className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-medium font-mono">{s.name}</span>
                      <span className="text-gray-600">→ Mixed scope: <span className="font-semibold">{s.scopeDetail?.account?.length || 0}</span> account-level, <span className="font-semibold">{s.scopeDetail?.perLocation?.length || 0}</span> per-location fields</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card>
          <p className="text-sm font-semibold text-gray-900 mb-3">Detected Schema</p>
          {raterSchema.sheets.map(sheet => (
            <div key={sheet.name} className="mb-4 last:mb-0">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                <Icons.Database /> {sheet.name}
                <span className="text-gray-400 normal-case tracking-normal">{sheet.fields.length} fields</span>
                {sheet.cardinality === "array" && (
                  <span className="normal-case tracking-normal px-1.5 py-0.5 bg-sky-100 text-sky-700 rounded text-[10px] font-semibold flex items-center gap-1">
                    <Icons.Layers /> Repeating · {sheet.maxItems ? `up to ${sheet.maxItems}` : "N"} {sheet.unitLabel?.toLowerCase()}s
                  </span>
                )}
                {sheet.cardinality === "mixed" && (
                  <span className="normal-case tracking-normal px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-semibold">
                    Mixed scope
                  </span>
                )}
                {sheet.cardinality === "lookup" && (
                  <span className="normal-case tracking-normal px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-semibold">
                    Lookup table
                  </span>
                )}
              </p>
              <div className="rounded border border-gray-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Cell</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Field Name</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Type</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Scope</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sheet.fields.map((f, i) => {
                      const fieldScope = f.scope || sheet.scope;
                      return (
                        <tr key={i} className={`border-b border-gray-100 ${fieldScope === "per-location" || fieldScope === "per-vehicle" ? "bg-sky-50/30" : ""}`}>
                          <td className="py-1.5 px-3 font-mono text-gray-600">{f.cell}</td>
                          <td className="py-1.5 px-3 font-medium text-gray-900">{f.name}</td>
                          <td className="py-1.5 px-3"><span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">{f.type}</span></td>
                          <td className="py-1.5 px-3">
                            {(fieldScope === "per-location" || sheet.cardinality === "array") ? (
                              <span className="px-1.5 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded text-[10px] font-medium">per {sheet.unitLabel?.toLowerCase() || "unit"}</span>
                            ) : fieldScope === "account" || sheet.scope === "account" ? (
                              <span className="px-1.5 py-0.5 bg-gray-50 text-gray-500 border border-gray-200 rounded text-[10px] font-medium">account</span>
                            ) : fieldScope === "reference" ? (
                              <span className="px-1.5 py-0.5 bg-gray-50 text-gray-400 border border-gray-200 rounded text-[10px] font-medium">lookup</span>
                            ) : null}
                          </td>
                          <td className="py-1.5 px-3 text-gray-500">{f.description}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card>
        <p className="text-sm font-semibold text-gray-900 mb-1">Connect Your Rater</p>
        <p className="text-xs text-gray-500 mb-5">Upload your rating workbook or connect via API. We'll extract the input schema automatically.</p>

        <div className="flex gap-3 mb-6">
          {[
            { id: "excel", label: "Excel Workbook", desc: "Upload .xlsx or .xlsm file", icon: <Icons.Upload /> },
            { id: "api", label: "API Endpoint", desc: "Connect to a rating API", icon: <Icons.Globe /> },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setConnectionType(opt.id)}
              className={`flex-1 p-4 rounded-lg border-2 text-left transition-all ${
                connectionType === opt.id ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gray-500">{opt.icon}</span>
                <span className="text-sm font-medium text-gray-900">{opt.label}</span>
              </div>
              <p className="text-xs text-gray-500">{opt.desc}</p>
            </button>
          ))}
        </div>

        {connectionType === "excel" && (
          <div
            onClick={handleUpload}
            className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                <p className="text-sm text-gray-700 font-medium">Extracting schema from workbook...</p>
                <p className="text-xs text-gray-500">Analyzing sheets, cell references, and named ranges</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <Icons.Upload />
                </div>
                <p className="text-sm text-gray-700 font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">.xlsx or .xlsm files up to 25MB</p>
              </div>
            )}
          </div>
        )}

        {connectionType === "api" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint URL</label>
              <input
                type="text"
                placeholder="https://rater.example.com/api/v1/rate"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Authentication</label>
              <select className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400">
                <option>API Key</option>
                <option>Bearer Token</option>
                <option>Basic Auth</option>
              </select>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
              Connect & Extract Schema
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── Step 2: Schema Mapping ─────────────────────────────────────────────────

function SemanticCategoryBadge({ category }) {
  const colors = SEMANTIC_CATEGORY_COLORS[category] || { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", dot: "bg-gray-400" };
  const cat = SEMANTIC_CATEGORIES.find(c => c.id === category);
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {cat?.label || category}
    </span>
  );
}

function SchemaMappingStep({ mappings, onUpdateMapping, onUpdateCategory, lobType }) {
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // table | category
  const raterFields = getRaterFields(lobType);
  const raterSchema = getRaterSchema(lobType);

  // Build sheet groups dynamically from the rater schema
  const sheetGroups = raterSchema.sheets.map(sheet => ({
    id: sheet.name.toLowerCase().replace(/\s+/g, "_"),
    label: sheet.name.replace("Inputs_", "").replace("Inputs", "Account-Level"),
    fields: raterFields.filter(f => f.sheet === sheet.name),
    cardinality: sheet.cardinality, scope: sheet.scope, maxItems: sheet.maxItems, unitLabel: sheet.unitLabel, drivenBy: sheet.drivenBy,
  }));

  const stats = {
    total: raterFields.length,
    mapped: Object.values(mappings).filter(m => m.status !== "unmapped").length,
    autoMapped: Object.values(mappings).filter(m => m.status === "auto-mapped").length,
    manual: Object.values(mappings).filter(m => m.status === "manual").length,
    unmapped: Object.values(mappings).filter(m => m.status === "unmapped").length,
  };

  // Group by semantic category for the category view
  const categoryGroups = SEMANTIC_CATEGORIES.map(cat => ({
    ...cat,
    fields: raterFields.filter(f => f.semanticCategory === cat.id),
  })).filter(g => g.fields.length > 0);

  return (
    <div className="space-y-5">
      {/* Mapping stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">Total Fields</p>
        </Card>
        <Card className="border-purple-200 bg-purple-50/30">
          <p className="text-2xl font-bold text-purple-700">{stats.autoMapped}</p>
          <p className="text-xs text-gray-500 mt-1">Auto-Mapped</p>
        </Card>
        <Card className="border-blue-200 bg-blue-50/30">
          <p className="text-2xl font-bold text-blue-700">{stats.manual}</p>
          <p className="text-xs text-gray-500 mt-1">Manually Mapped</p>
        </Card>
        <Card className={stats.unmapped > 0 ? "border-red-200 bg-red-50/30" : "border-green-200 bg-green-50/30"}>
          <p className={`text-2xl font-bold ${stats.unmapped > 0 ? "text-red-600" : "text-green-700"}`}>{stats.unmapped}</p>
          <p className="text-xs text-gray-500 mt-1">Unmapped</p>
        </Card>
      </div>

      {/* Semantic category overview */}
      <Card className="border-gray-300 bg-gray-50/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Semantic Categories</p>
            <p className="text-xs text-gray-500 mt-0.5">Each field is classified by its role in the product. Categories drive automatic workflow step assignment in Step 4.</p>
          </div>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
            <button onClick={() => setViewMode("table")} className={`px-2.5 py-1 text-[10px] font-medium rounded ${viewMode === "table" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700"}`}>By Sheet</button>
            <button onClick={() => setViewMode("category")} className={`px-2.5 py-1 text-[10px] font-medium rounded ${viewMode === "category" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700"}`}>By Category</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryGroups.map(cat => {
            const colors = SEMANTIC_CATEGORY_COLORS[cat.id];
            return (
              <div key={cat.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colors.bg} ${colors.border}`}>
                <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                <div>
                  <span className={`text-xs font-medium ${colors.text}`}>{cat.label}</span>
                  <span className="text-[10px] text-gray-400 ml-1.5">{cat.fields.length} fields</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filter bar */}
      <div className="flex items-center gap-2">
        {["all", "auto-mapped", "manual", "unmapped"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              filter === f ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {f === "all" ? "All Fields" : f === "auto-mapped" ? "Auto-Mapped" : f === "manual" ? "Manual" : "Unmapped"}
          </button>
        ))}
      </div>

      {/* Mapping tables — grouped by sheet or by semantic category */}
      {(viewMode === "table" ? sheetGroups : categoryGroups.map(c => ({ id: c.id, label: c.label, fields: c.fields }))).map(group => {
        const fields = filter === "all" ? group.fields : group.fields.filter(f => mappings[f.name]?.status === filter);
        if (fields.length === 0) return null;

        return (
          <Card key={group.id}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {viewMode === "category" && (() => {
                  const colors = SEMANTIC_CATEGORY_COLORS[group.id];
                  return colors ? <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} /> : null;
                })()}
                <p className="text-sm font-semibold text-gray-900">{group.label}{viewMode === "table" ? " Inputs" : ""}</p>
                <span className="text-xs text-gray-400">{group.fields.length} fields</span>
                {viewMode === "table" && group.cardinality === "array" && (
                  <span className="px-1.5 py-0.5 bg-sky-100 text-sky-700 rounded text-[10px] font-semibold flex items-center gap-1">
                    <Icons.Layers /> Repeating · {group.maxItems ? `up to ${group.maxItems}` : "N"} {group.unitLabel?.toLowerCase()}s × {group.fields.length} fields{group.maxItems ? ` = ${group.maxItems * group.fields.length} cells` : ""}
                  </span>
                )}
                {viewMode === "table" && group.cardinality === "mixed" && (
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-semibold">Mixed scope</span>
                )}
              </div>
              <button className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded hover:bg-gray-50 flex items-center gap-1">
                <Icons.Zap /> Auto-Map All
              </button>
            </div>
            <div className="rounded border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 text-xs">Rater Field</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 text-xs">Cell Ref</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 text-xs">Type</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 text-xs">Scope</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 text-xs">Semantic Category</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 text-xs">Maps To</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600 text-xs">Status</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((f, i) => {
                    const mapping = mappings[f.name] || { status: "unmapped", target: "" };
                    return (
                      <tr key={i} className={`border-b border-gray-100 ${mapping.status === "unmapped" ? "bg-red-50/30" : ""}`}>
                        <td className="py-2 px-3 font-medium text-gray-900 text-xs">{f.name}</td>
                        <td className="py-2 px-3 font-mono text-xs text-gray-500">{f.cell}</td>
                        <td className="py-2 px-3"><span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{f.type}</span></td>
                        <td className="py-2 px-3">
                          {(() => {
                            const parentSheet = raterSchema.sheets.find(s => s.name === f.sheet);
                            const fieldScope = f.scope || parentSheet?.scope;
                            if (fieldScope === "per-location" || parentSheet?.cardinality === "array") {
                              return <span className="px-1.5 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded text-[10px] font-medium">per {parentSheet?.unitLabel?.toLowerCase() || "unit"}</span>;
                            }
                            if (fieldScope === "account") {
                              return <span className="px-1.5 py-0.5 bg-gray-50 text-gray-500 border border-gray-200 rounded text-[10px] font-medium">account</span>;
                            }
                            return <span className="px-1.5 py-0.5 bg-gray-50 text-gray-400 border border-gray-200 rounded text-[10px] font-medium">{fieldScope || "—"}</span>;
                          })()}
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={f.semanticCategory}
                            onChange={e => onUpdateCategory && onUpdateCategory(f.name, e.target.value)}
                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded border appearance-none cursor-pointer ${
                              SEMANTIC_CATEGORY_COLORS[f.semanticCategory]?.bg || "bg-gray-50"
                            } ${SEMANTIC_CATEGORY_COLORS[f.semanticCategory]?.text || "text-gray-600"} ${
                              SEMANTIC_CATEGORY_COLORS[f.semanticCategory]?.border || "border-gray-200"
                            }`}
                          >
                            {SEMANTIC_CATEGORIES.map(c => (
                              <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          {mapping.status === "unmapped" ? (
                            <button
                              onClick={() => onUpdateMapping(f.name, { status: "manual", target: f.name })}
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              + Map field
                            </button>
                          ) : (
                            <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                              <Icons.ArrowRight /> {mapping.target}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <StatusBadge status={mapping.status === "auto-mapped" ? "Auto-mapped" : mapping.status === "manual" ? "Mapped" : "Unmapped"} />
                        </td>
                        <td className="py-2 px-1">
                          {mapping.status !== "unmapped" && (
                            <button onClick={() => onUpdateMapping(f.name, { status: "unmapped", target: "" })} className="text-gray-400 hover:text-gray-600">
                              <Icons.X />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Step 3: Product Configuration (LOB-Adaptive) ───────────────────────────

function AutoConfigSection({ coverageEnabled, onToggleCoverage }) {
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Coverage Configuration</p>
            <p className="text-xs text-gray-500 mt-0.5">Define which coverages this product offers. Enabled coverages become available options in the UW workflow.</p>
          </div>
          <span className="text-xs text-gray-400">{Object.values(coverageEnabled).filter(Boolean).length} of {COVERAGES.length} enabled</span>
        </div>
        <div className="space-y-0 rounded border border-gray-200 overflow-hidden">
          {COVERAGES.map((cov, i) => (
            <div key={cov.id} className={`flex items-center justify-between p-4 ${i < COVERAGES.length - 1 ? "border-b border-gray-100" : ""} ${!coverageEnabled[cov.id] ? "bg-gray-50/50" : ""}`}>
              <div className="flex items-center gap-4">
                <Toggle enabled={coverageEnabled[cov.id]} onChange={v => { if (!cov.required) onToggleCoverage(cov.id, v); }} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${coverageEnabled[cov.id] ? "text-gray-900" : "text-gray-400"}`}>{cov.name}</span>
                    {cov.required && <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Required</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {cov.type === "limit" && `Limits: ${cov.limitOptions.map(l => l >= 1000000 ? `$${l / 1000000}M` : `$${(l / 1000).toFixed(0)}K`).join(", ")}`}
                    {cov.type === "deductible" && `Deductibles: ${cov.deductibleOptions.map(d => `$${d.toLocaleString()}`).join(", ")}`}
                    {cov.type === "percent" && cov.pricingMethod}
                    {cov.type === "flat" && `Flat surcharge: $${cov.surcharge}`}
                  </p>
                </div>
              </div>
              {coverageEnabled[cov.id] && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <Icons.Link /> Linked to rater
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">Vehicle Class Base Rates</p>
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">From rater</span>
          </div>
          <span className="text-xs text-gray-400">Read-only — sourced from connected rater</span>
        </div>
        <div className="overflow-hidden rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Vehicle Class</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600 text-xs">Liability</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600 text-xs">Comp</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600 text-xs">Collision</th>
              </tr>
            </thead>
            <tbody>
              {VEHICLE_CLASS_RATES.map((r, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-1.5 px-3 font-medium text-gray-900 text-xs">{r.class}</td>
                  <td className="py-1.5 px-3 text-right text-gray-700 text-xs">${r.liability.toLocaleString()}</td>
                  <td className="py-1.5 px-3 text-right text-gray-700 text-xs">${r.comp.toLocaleString()}</td>
                  <td className="py-1.5 px-3 text-right text-gray-700 text-xs">${r.coll.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function WCConfigSection() {
  const [classCodesEnabled, setClassCodesEnabled] = useState(
    Object.fromEntries(WC_CLASS_CODES.map(c => [c.code, true]))
  );
  const [wcCoverageEnabled, setWcCoverageEnabled] = useState(
    Object.fromEntries(WC_COVERAGES.map(c => [c.id, c.required || false]))
  );

  return (
    <div className="space-y-5">
      {/* Experience Mod */}
      <Card className="border-blue-200 bg-blue-50/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
              <Icons.Zap />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Experience Modification Factor</p>
              <p className="text-xs text-gray-500">Bureau: {WC_EXPERIENCE_MOD.bureau} · Effective {WC_EXPERIENCE_MOD.effective}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-700">{WC_EXPERIENCE_MOD.current}</p>
            <p className="text-xs text-blue-600">{WC_EXPERIENCE_MOD.current < 1 ? "Credit" : "Debit"} mod</p>
          </div>
        </div>
      </Card>

      {/* Class Code Schedule */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Class Code Schedule</p>
            <p className="text-xs text-gray-500 mt-0.5">Configure NCCI class codes and base rates. Payroll is entered per-code during the UW workflow.</p>
          </div>
          <button className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded hover:bg-gray-50 flex items-center gap-1">
            <Icons.Plus /> Add Class Code
          </button>
        </div>
        <div className="overflow-hidden rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-10 py-2 px-3"></th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Code</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Description</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600 text-xs">Rate / $100</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600 text-xs">Est. Payroll</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600 text-xs">Est. Premium</th>
              </tr>
            </thead>
            <tbody>
              {WC_CLASS_CODES.map((cc, i) => (
                <tr key={cc.code} className={`border-b border-gray-100 ${!classCodesEnabled[cc.code] ? "bg-gray-50/50 opacity-50" : ""}`}>
                  <td className="py-2 px-3">
                    <Toggle enabled={classCodesEnabled[cc.code]} onChange={v => setClassCodesEnabled(p => ({ ...p, [cc.code]: v }))} />
                  </td>
                  <td className="py-2 px-3 font-mono font-semibold text-gray-900 text-xs">{cc.code}</td>
                  <td className="py-2 px-3 text-gray-700 text-xs">{cc.description}</td>
                  <td className="py-2 px-3 text-right text-gray-700 text-xs">${cc.rate.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right text-gray-500 text-xs">${cc.payroll.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-medium text-gray-900 text-xs">${cc.premium.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t border-gray-300">
                <td colSpan={4} className="py-2 px-3 text-xs font-medium text-gray-600">Total (before mod)</td>
                <td className="py-2 px-3 text-right text-xs font-medium text-gray-700">${WC_CLASS_CODES.reduce((s, c) => s + c.payroll, 0).toLocaleString()}</td>
                <td className="py-2 px-3 text-right text-xs font-bold text-gray-900">${WC_CLASS_CODES.reduce((s, c) => s + c.premium, 0).toLocaleString()}</td>
              </tr>
              <tr className="bg-blue-50">
                <td colSpan={4} className="py-2 px-3 text-xs font-medium text-blue-700">Mod-Adjusted Premium ({WC_EXPERIENCE_MOD.current})</td>
                <td className="py-2 px-3"></td>
                <td className="py-2 px-3 text-right text-xs font-bold text-blue-700">${Math.round(WC_CLASS_CODES.reduce((s, c) => s + c.premium, 0) * WC_EXPERIENCE_MOD.current).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* WC Coverages */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Coverage Parts & Endorsements</p>
            <p className="text-xs text-gray-500 mt-0.5">Statutory WC and employers liability are required. Optional coverage endorsements can be toggled.</p>
          </div>
        </div>
        <div className="space-y-0 rounded border border-gray-200 overflow-hidden">
          {WC_COVERAGES.map((cov, i) => (
            <div key={cov.id} className={`flex items-center justify-between p-4 ${i < WC_COVERAGES.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div className="flex items-center gap-4">
                <Toggle enabled={wcCoverageEnabled[cov.id]} onChange={v => { if (!cov.required) setWcCoverageEnabled(p => ({ ...p, [cov.id]: v })); }} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${wcCoverageEnabled[cov.id] ? "text-gray-900" : "text-gray-400"}`}>{cov.name}</span>
                    {cov.required && <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Required</span>}
                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{cov.type}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{cov.description || (cov.type === "limit" ? `Limits: ${cov.limitOptions.map(l => l >= 1000000 ? `$${l / 1000000}M` : `$${(l / 1000).toFixed(0)}K`).join(" / ")}` : "")}</p>
                </div>
              </div>
              {wcCoverageEnabled[cov.id] && cov.type === "limit" && (
                <div className="flex items-center gap-2">
                  {["Per Accident", "Per Employee", "Policy Limit"].map(label => (
                    <div key={label} className="text-center">
                      <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                      <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700">
                        {cov.limitOptions.map(l => <option key={l} value={l}>{l >= 1000000 ? `$${l / 1000000}M` : `$${(l / 1000).toFixed(0)}K`}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* State Rules Preview */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">State Rules & Surcharges</p>
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">From rater</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { state: "GA", surcharge: "2.5%", assessment: "$250 min premium", monopolistic: false },
            { state: "FL", surcharge: "1.8%", assessment: "$300 min premium", monopolistic: false },
            { state: "SC", surcharge: "3.0%", assessment: "$200 min premium", monopolistic: false },
            { state: "NC", surcharge: "2.0%", assessment: "$225 min premium", monopolistic: false },
          ].map(s => (
            <div key={s.state} className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900 bg-white px-1.5 py-0.5 rounded border border-gray-200">{s.state}</span>
                <span className="text-xs text-gray-600">{s.assessment}</span>
              </div>
              <span className="text-xs text-gray-500">Surcharge: {s.surcharge}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function BOPConfigSection() {
  const [subLineEnabled, setSubLineEnabled] = useState(
    Object.fromEntries(BOP_SUB_LINES.map(s => [s.id, s.required || false]))
  );
  const [expandedSubLine, setExpandedSubLine] = useState("property");

  return (
    <div className="space-y-5">
      {/* Sub-line overview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Package Sub-Lines</p>
            <p className="text-xs text-gray-500 mt-0.5">A package product combines multiple coverage lines. Enable the sub-lines included in this product, then configure each one.</p>
          </div>
          <span className="text-xs text-gray-400">{Object.values(subLineEnabled).filter(Boolean).length} of {BOP_SUB_LINES.length} enabled</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {BOP_SUB_LINES.map(sl => {
            const IconComp = Icons[sl.icon] || Icons.Shield;
            const isEnabled = subLineEnabled[sl.id];
            return (
              <button
                key={sl.id}
                onClick={() => {
                  if (!sl.required) setSubLineEnabled(p => ({ ...p, [sl.id]: !p[sl.id] }));
                  if (isEnabled || !subLineEnabled[sl.id]) setExpandedSubLine(sl.id);
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  isEnabled
                    ? expandedSubLine === sl.id ? "border-gray-900 bg-gray-50" : "border-green-300 bg-green-50/30"
                    : "border-gray-200 bg-gray-50/50 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={isEnabled ? "text-gray-700" : "text-gray-400"}><IconComp /></span>
                    <span className={`text-sm font-medium ${isEnabled ? "text-gray-900" : "text-gray-400"}`}>{sl.name}</span>
                  </div>
                  {sl.required && <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Required</span>}
                  {isEnabled && !sl.required && <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded">Enabled</span>}
                </div>
                <p className="text-xs text-gray-500">{sl.coverages.length} coverages · {sl.ratingBasis}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Expanded sub-line detail */}
      {expandedSubLine && (() => {
        const sl = BOP_SUB_LINES.find(s => s.id === expandedSubLine);
        if (!sl || !subLineEnabled[sl.id]) return null;
        const IconComp = Icons[sl.icon] || Icons.Shield;

        return (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-700"><IconComp /></span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{sl.name} — Coverages</p>
                  <p className="text-xs text-gray-500 mt-0.5">Rating basis: {sl.ratingBasis}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{sl.coverages.length} coverage parts</span>
            </div>
            <div className="space-y-0 rounded border border-gray-200 overflow-hidden">
              {sl.coverages.map((cov, i) => (
                <div key={cov.id} className={`flex items-center justify-between p-4 ${i < sl.coverages.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{cov.name}</span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{cov.type}</span>
                    </div>
                    {cov.description && <p className="text-xs text-gray-400 mt-0.5">{cov.description}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {cov.type === "limit" && cov.limitOptions && (
                      <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700">
                        {cov.limitOptions.map(l => <option key={l} value={l}>{l >= 1000000 ? `$${l / 1000000}M` : `$${(l / 1000).toFixed(0)}K`}</option>)}
                      </select>
                    )}
                    {cov.type === "occurrence_aggregate" && (
                      <div className="flex items-center gap-2">
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 mb-0.5">Per Occurrence</p>
                          <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700">
                            {cov.occurrenceOptions.map(l => <option key={l} value={l}>{l >= 1000000 ? `$${l / 1000000}M` : `$${(l / 1000).toFixed(0)}K`}</option>)}
                          </select>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 mb-0.5">Aggregate</p>
                          <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700">
                            {cov.aggregateOptions.map(l => <option key={l} value={l}>{l >= 1000000 ? `$${l / 1000000}M` : `$${(l / 1000).toFixed(0)}K`}</option>)}
                          </select>
                        </div>
                      </div>
                    )}
                    {cov.type === "sublimit" && cov.limitOptions && (
                      <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700">
                        {cov.limitOptions.map(l => <option key={l} value={l}>{l >= 1000000 ? `$${l / 1000000}M` : `$${(l / 1000).toFixed(0)}K`}</option>)}
                      </select>
                    )}
                    {cov.type === "blanket" && cov.limitOptions && (
                      <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700">
                        {cov.limitOptions.map(l => <option key={l} value={l}>{l >= 1000000 ? `$${l / 1000000}M` : `$${(l / 1000).toFixed(0)}K`}</option>)}
                      </select>
                    )}
                    {(cov.type === "included" || cov.type === "scheduled") && (
                      <span className="text-xs text-gray-400 italic">{cov.type === "included" ? "Included" : "Schedule at bind"}</span>
                    )}
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Icons.Link /> Linked
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })()}

      {/* Package Summary */}
      <Card className="bg-gray-50/50">
        <div className="flex items-center gap-2 mb-3">
          <Icons.Package />
          <p className="text-sm font-semibold text-gray-900">Package Summary</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {BOP_SUB_LINES.map(sl => {
            const isEnabled = subLineEnabled[sl.id];
            return (
              <div key={sl.id} className={`p-3 rounded border ${isEnabled ? "border-green-200 bg-green-50/50" : "border-gray-200 bg-white opacity-50"}`}>
                <p className={`text-xs font-medium ${isEnabled ? "text-gray-900" : "text-gray-400"}`}>{sl.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{isEnabled ? `${sl.coverages.length} coverages` : "Not included"}</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-3">Package products use a single rater at the package level. Sub-line premiums are computed within the rater and returned as individual output fields.</p>
      </Card>
    </div>
  );
}

// ─── Product-Level Field Definitions Panel ──────────────────────────────────
// This is the KEY architectural change from the CTO alignment: conditions and
// field configuration are defined at the product level, not the workflow UI level.

function FieldDefinitionsPanel({ fieldDefs, onUpdateFieldDef }) {
  const [expandedField, setExpandedField] = useState(null);
  const [filterSource, setFilterSource] = useState("all"); // all | rater | form

  const fieldEntries = Object.entries(fieldDefs);
  const fieldsWithConditions = fieldEntries.filter(([, d]) => (d.conditions?.length || 0) > 0);
  const fieldsWithOptionConds = fieldEntries.filter(([, d]) => (d.optionConditions?.length || 0) > 0);
  const fieldsWithLinks = fieldEntries.filter(([, d]) => (d.linkedTo?.length || 0) > 0);

  // Count by source type
  const sourceCounts = {};
  FIELD_SOURCE_TYPES.forEach(s => { sourceCounts[s.id] = fieldEntries.filter(([, d]) => d.source === s.id).length; });

  const filteredEntries = filterSource === "all" ? fieldEntries :
    fieldEntries.filter(([, d]) => d.source === filterSource);

  // Group by semantic category
  const grouped = {};
  filteredEntries.forEach(([name, def]) => {
    const cat = def.semanticCategory || "policy-level";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push([name, def]);
  });

  return (
    <div className="space-y-5">
      {/* Summary banner */}
      <Card className="border-indigo-200 bg-indigo-50/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 flex-shrink-0">
            <Icons.Database />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Product-Level Field Definitions</p>
            <p className="text-xs text-gray-500 mt-0.5 mb-3">
              Define how each field behaves at the <span className="font-medium text-indigo-600">product level</span>. Conditions set here are inherited by the Workflow Builder as read-only rules.
              This is the single source of truth for field behavior — input types, allowed values, visibility conditions, and option-level filtering.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-5 h-5 rounded bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">{fieldEntries.length}</span>
                <span className="text-gray-600">total fields</span>
              </div>
              {FIELD_SOURCE_TYPES.filter(s => sourceCounts[s.id] > 0).map(s => {
                const sc = FIELD_SOURCE_COLORS[s.id];
                return (
                  <div key={s.id} className="flex items-center gap-1.5 text-xs">
                    <span className={`w-5 h-5 rounded ${sc.bg} ${sc.text} flex items-center justify-center text-[10px] font-bold`}>{sourceCounts[s.id]}</span>
                    <span className="text-gray-600">{s.label.toLowerCase()}</span>
                  </div>
                );
              })}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-5 h-5 rounded bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">{fieldsWithConditions.length}</span>
                <span className="text-gray-600">conditions</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-5 h-5 rounded bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold">{fieldsWithLinks.length}</span>
                <span className="text-gray-600">linked</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Source filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilterSource("all")}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
            filterSource === "all" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          All <span className="ml-1 opacity-60">{fieldEntries.length}</span>
        </button>
        {FIELD_SOURCE_TYPES.filter(s => sourceCounts[s.id] > 0).map(s => {
          const sc = FIELD_SOURCE_COLORS[s.id];
          return (
            <button
              key={s.id}
              onClick={() => setFilterSource(s.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors flex items-center gap-1.5 ${
                filterSource === s.id
                  ? `${sc.bg} ${sc.text} ${sc.border}`
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              {s.label} <span className="opacity-60">{sourceCounts[s.id]}</span>
            </button>
          );
        })}
      </div>

      {/* Field list by semantic category */}
      {SEMANTIC_CATEGORIES.map(cat => {
        const fields = grouped[cat.id];
        if (!fields || fields.length === 0) return null;
        const colors = SEMANTIC_CATEGORY_COLORS[cat.id];

        return (
          <Card key={cat.id}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
              <p className="text-sm font-semibold text-gray-900">{cat.label}</p>
              <span className="text-xs text-gray-400">{fields.length} fields</span>
            </div>

            <div className="space-y-2">
              {fields.map(([name, def]) => {
                const isExpanded = expandedField === name;
                const condCount = (def.conditions?.length || 0) + (def.optionConditions?.length || 0);

                return (
                  <div key={name} className={`rounded-lg border overflow-hidden transition-all ${isExpanded ? "border-gray-400 shadow-sm" : "border-gray-200"}`}>
                    {/* Field header row */}
                    <button
                      onClick={() => setExpandedField(isExpanded ? null : name)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors ${isExpanded ? "bg-gray-50" : "hover:bg-gray-50/50"}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-mono font-semibold text-gray-900">{name}</span>
                        {(() => {
                          const sc = FIELD_SOURCE_COLORS[def.source] || FIELD_SOURCE_COLORS["rater"];
                          const srcType = FIELD_SOURCE_TYPES.find(s => s.id === def.source);
                          return (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 ${sc.bg} ${sc.text} ${sc.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                              {srcType?.label || def.source}
                            </span>
                          );
                        })()}
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200">{def.inputType}</span>
                        {def.required && <span className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">Required</span>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {def.linkedTo && def.linkedTo.length > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded border border-green-200 flex items-center gap-0.5">
                            <Icons.Link /> {def.linkedTo.length} linked
                          </span>
                        )}
                        {condCount > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded border border-amber-200">
                            {condCount} condition{condCount > 1 ? "s" : ""}
                          </span>
                        )}
                        {isExpanded ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
                      </div>
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 border-t border-gray-200 space-y-3">
                        {/* Source + Basic config */}
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Source</label>
                            <select defaultValue={def.source} className={`w-full px-2 py-1 text-xs border rounded bg-white ${FIELD_SOURCE_COLORS[def.source]?.border || "border-gray-200"}`}>
                              {FIELD_SOURCE_TYPES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Display Label</label>
                            <input type="text" defaultValue={def.label} className="w-full px-2 py-1 text-xs border border-gray-200 rounded" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Input Type</label>
                            <select defaultValue={def.inputType} className="w-full px-2 py-1 text-xs border border-gray-200 rounded bg-white">
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                              <option value="currency">Currency</option>
                              <option value="dropdown">Dropdown</option>
                              <option value="toggle">Toggle</option>
                              <option value="date">Date</option>
                              <option value="auto_increment">Auto-Increment</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Default Value</label>
                            <input type="text" defaultValue={def.defaultValue !== undefined ? String(def.defaultValue) : ""} className="w-full px-2 py-1 text-xs border border-gray-200 rounded" />
                          </div>
                        </div>

                        {/* Source detail */}
                        {def.sourceDetail && (
                          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded border border-gray-200">
                            <span className={`w-1.5 h-1.5 rounded-full ${FIELD_SOURCE_COLORS[def.source]?.dot || "bg-gray-400"}`} />
                            <span className="text-[10px] text-gray-500">Source path:</span>
                            <span className="text-[10px] font-mono text-gray-700">{def.sourceDetail}</span>
                          </div>
                        )}

                        {/* Linked fields */}
                        {def.linkedTo && def.linkedTo.length > 0 && (
                          <div className="pt-1">
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                              <Icons.Link /> Linked Fields
                            </p>
                            <div className="space-y-1">
                              {def.linkedTo.map(link => {
                                const linkedDef = fieldDefs[link.field];
                                const linkedSc = FIELD_SOURCE_COLORS[linkedDef?.source] || FIELD_SOURCE_COLORS["rater"];
                                return (
                                  <div key={link.field} className="flex items-center gap-2 px-2.5 py-1.5 bg-green-50/50 rounded border border-green-200">
                                    <Icons.ArrowRight />
                                    <span className="text-[10px] font-mono font-medium text-gray-900">{link.field}</span>
                                    <span className={`text-[10px] px-1 py-0.5 rounded ${linkedSc.bg} ${linkedSc.text}`}>{linkedDef?.source}</span>
                                    <span className="text-[10px] text-gray-400">— {link.relationship}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Allowed values */}
                        {def.allowedValues && (
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Allowed Values (full set)</label>
                            <div className="flex flex-wrap gap-1">
                              {def.allowedValues.map(v => (
                                <span key={v} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200">{v}</span>
                              ))}
                              <button className="text-[10px] px-1.5 py-0.5 text-blue-600 hover:bg-blue-50 rounded border border-dashed border-blue-300">+ Add</button>
                            </div>
                          </div>
                        )}

                        {/* ── Visibility Conditions (show/hide field) ── */}
                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1">
                              <Icons.Eye /> Visibility Conditions
                            </p>
                            <button className="text-[10px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5"><Icons.Plus /> Add</button>
                          </div>
                          {def.conditions && def.conditions.length > 0 ? (
                            <div className="space-y-1.5">
                              {def.conditions.map(cond => (
                                <div key={cond.id} className="flex items-center gap-2 px-2.5 py-2 bg-amber-50/50 rounded border border-amber-200">
                                  <Icons.Zap />
                                  <span className="text-[10px] text-gray-700 flex-1">{cond.label}</span>
                                  <span className="text-[10px] font-mono text-amber-700">
                                    {cond.showWhen} {cond.operator} {Array.isArray(cond.value) ? cond.value.join(", ") : String(cond.value)}
                                  </span>
                                  <button className="text-gray-400 hover:text-gray-600"><Icons.X /></button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-gray-400 italic">No visibility conditions — field is always shown</p>
                          )}
                        </div>

                        {/* ── Option-Level Conditions (filter dropdown values) ── */}
                        {(def.inputType === "dropdown" && def.allowedValues) && (
                          <div className="pt-2 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1">
                                <Icons.Settings /> Option-Level Conditions
                              </p>
                              <button className="text-[10px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5"><Icons.Plus /> Add</button>
                            </div>
                            {def.optionConditions && def.optionConditions.length > 0 ? (
                              <div className="space-y-1.5">
                                {def.optionConditions.map(oc => (
                                  <div key={oc.id} className="px-2.5 py-2 bg-orange-50/50 rounded border border-orange-200">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[10px] font-medium text-gray-700">{oc.label}</span>
                                      <button className="text-gray-400 hover:text-gray-600"><Icons.X /></button>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] text-gray-400">When</span>
                                      <span className="text-[10px] font-mono text-orange-700">{oc.whenField} {oc.operator} "{oc.whenValue}"</span>
                                      <span className="text-[10px] text-gray-400">→ filter to:</span>
                                      <div className="flex gap-1">
                                        {oc.filteredValues.map(v => (
                                          <span key={v} className="text-[10px] px-1 py-0.5 bg-white text-orange-700 rounded border border-orange-200">{v}</span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[10px] text-gray-400 italic">No option-level conditions — all values are always available</p>
                            )}
                          </div>
                        )}

                        {def.helpText && <p className="text-[10px] text-gray-400 italic pt-1">{def.helpText}</p>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── GL Config Section ───────────────────────────────────────────────────────

const GL_UW_RISK_FACTORS = [
  { id: "rf_yrs_in_ops", label: "Years in Operation", options: ["Low", "Average", "High"], description: "Experience and track record of the insured", scope: "per-location", scopeNote: "Rater evaluates per location — same value often applied across locations but can vary" },
  { id: "rf_op_excel", label: "Operational Excellence", options: ["Low", "Average", "High"], description: "Quality of management and operations", scope: "per-location", scopeNote: "Rater evaluates per location — may differ for locations under different management" },
  { id: "rf_prem_cond", label: "Premises Condition", options: ["Low", "Average", "High"], description: "Physical condition and maintenance of insured premises", scope: "per-location" },
  { id: "rf_comp_risk", label: "Complexity of Risk", options: ["Low", "Average", "High"], description: "Overall risk complexity based on operations", scope: "per-location" },
  { id: "rf_claim_his", label: "Claim History", options: ["Low", "Average", "High"], description: "Prior loss history and claim frequency", scope: "per-location", scopeNote: "Rater evaluates per location — allows location-specific loss weighting" },
  { id: "rf_end_factor", label: "Endorsement Factor", options: ["Low", "Average", "High"], description: "Complexity and breadth of endorsements", scope: "per-location", scopeNote: "Rater evaluates per location — endorsement load may vary by location" },
  { id: "rf_lro_factor", label: "LRO Complexity", options: ["Low", "Average", "High"], description: "Land/Residential Owner risk (LRO class only)", scope: "per-location" },
  { id: "rf_vacant_factor", label: "Vacant Land Factor", options: ["Low", "Average", "High"], description: "Vacant land risk (Vacant Land class only)", scope: "per-location" },
];

const GL_INDUSTRY_CLASSES = [
  { code: "APT", name: "Apartments", baseRate: 12.50, primaryUnit: "Door Count" },
  { code: "CON", name: "Condominiums", baseRate: 10.25, primaryUnit: "Door Count" },
  { code: "SHC", name: "Student Housing Complexes", baseRate: 18.75, primaryUnit: "Door Count" },
  { code: "SLF", name: "Senior Living Facilities", baseRate: 22.00, primaryUnit: "Bed Count" },
  { code: "MHP", name: "Manufactured Housing Parks", baseRate: 8.50, primaryUnit: "Pad Count" },
  { code: "LRO", name: "Land/Residential Owner", baseRate: 6.25, primaryUnit: "Sq Footage" },
  { code: "VAC", name: "Vacant Land", baseRate: 3.75, primaryUnit: "Acreage" },
  { code: "MXU", name: "Mixed-Use Residential", baseRate: 15.00, primaryUnit: "Door Count" },
  { code: "TOW", name: "Townhomes", baseRate: 11.00, primaryUnit: "Door Count" },
];

function GLConfigSection({ coverageEnabled, onToggleCoverage }) {
  return (
    <div className="space-y-5">
      {/* Coverage toggles — grouped by scope */}
      {[
        { scope: "account", label: "Account-Level Coverages", desc: "Set once for the entire policy. Applied uniformly across all locations.", color: "gray" },
        { scope: "per-location", label: "Per-Location Coverages", desc: "Evaluated independently for each location. May vary based on crime score, sub-industry class, or other location attributes.", color: "sky" },
      ].map(scopeGroup => {
        const covs = GL_COVERAGES.filter(c => c.scope === scopeGroup.scope);
        if (covs.length === 0) return null;
        return (
          <Card key={scopeGroup.scope}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-gray-900">{scopeGroup.label}</p>
                  {scopeGroup.scope === "per-location" && (
                    <span className="px-1.5 py-0.5 bg-sky-100 text-sky-700 rounded text-[10px] font-semibold flex items-center gap-1">
                      <Icons.Layers /> Repeating · per location
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{scopeGroup.desc}</p>
              </div>
              <span className="text-xs text-gray-400">{covs.filter(c => coverageEnabled[c.id]).length} of {covs.length} enabled</span>
            </div>
            <div className="space-y-0 rounded border border-gray-200 overflow-hidden">
              {covs.map((cov, i) => (
                <div key={cov.id} className={`flex items-center justify-between p-4 ${i < covs.length - 1 ? "border-b border-gray-100" : ""} ${!coverageEnabled[cov.id] ? "bg-gray-50/50" : ""} ${cov.scope === "per-location" ? "border-l-2 border-l-sky-300" : ""}`}>
                  <div className="flex items-center gap-4">
                    <Toggle enabled={coverageEnabled[cov.id]} onChange={v => { if (!cov.required) onToggleCoverage(cov.id, v); }} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${coverageEnabled[cov.id] ? "text-gray-900" : "text-gray-400"}`}>{cov.name}</span>
                        {cov.required && <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Required</span>}
                        {cov.type === "toggle" && <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">Include / Exclude</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {cov.type === "limit" && `Limits: ${cov.limitOptions.map(l => l >= 1000000 ? `$${l / 1000000}M` : `$${(l / 1000).toFixed(0)}K`).join(", ")}`}
                        {cov.type === "occurrence_aggregate" && cov.description}
                        {cov.type === "toggle" && (cov.description || "Binary toggle — included or excluded")}
                      </p>
                      {cov.scopeNote && <p className="text-[10px] text-sky-600 mt-0.5">{cov.scopeNote}</p>}
                    </div>
                  </div>
                  {coverageEnabled[cov.id] && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <Icons.Link /> Linked to rater
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        );
      })}

      {/* UW Risk Factors — grouped by scope */}
      {[
        { scope: "account", label: "Account-Level Risk Factors", desc: "Set once for the entire policy — UW scores these in the Review Rating step.", color: "gray" },
        { scope: "per-location", label: "Per-Location Risk Factors", desc: "Scored independently for each location — multipliers vary by premises condition, complexity, or class.", color: "sky" },
      ].map(group => {
        const factors = GL_UW_RISK_FACTORS.filter(rf => rf.scope === group.scope);
        if (factors.length === 0) return null;
        return (
          <Card key={group.scope} className={group.color === "sky" ? "border-l-2 border-l-sky-400" : ""}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">{group.label}</p>
                <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">From RateFactors sheet</span>
                {group.scope === "per-location" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-0.5">
                    <Icons.Map /> per location
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{factors.length} factors</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">{group.desc}</p>
            <div className="overflow-hidden rounded border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Factor</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Description</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600 text-xs">Options</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600 text-xs">Visibility</th>
                  </tr>
                </thead>
                <tbody>
                  {factors.map((rf, i) => (
                    <tr key={rf.id} className={`border-b border-gray-100 ${group.scope === "per-location" ? "bg-sky-50/30" : ""}`}>
                      <td className="py-2 px-3 font-medium text-gray-900 text-xs">{rf.label}</td>
                      <td className="py-2 px-3 text-gray-500 text-xs">{rf.description}</td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {rf.options.map(o => (
                            <span key={o} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${o === "Low" ? "bg-green-50 text-green-700" : o === "Average" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>{o}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        {rf.id === "rf_lro_factor" ? (
                          <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">LRO class only</span>
                        ) : rf.id === "rf_vacant_factor" ? (
                          <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Vacant Land only</span>
                        ) : (
                          <span className="text-[10px] text-gray-400">Always</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );
      })}

      {/* Industry Classes */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">Industry Classes & Base Rates</p>
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">From Ind_RF sheet</span>
          </div>
          <span className="text-xs text-gray-400">Read-only — sourced from connected rater</span>
        </div>
        <div className="overflow-hidden rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Code</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Industry Class</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600 text-xs">Base Rate</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Primary Exposure Unit</th>
              </tr>
            </thead>
            <tbody>
              {GL_INDUSTRY_CLASSES.map((ic, i) => (
                <tr key={ic.code} className="border-b border-gray-100">
                  <td className="py-1.5 px-3 font-mono text-gray-600 text-xs">{ic.code}</td>
                  <td className="py-1.5 px-3 font-medium text-gray-900 text-xs">{ic.name}</td>
                  <td className="py-1.5 px-3 text-right text-gray-700 text-xs">${ic.baseRate.toFixed(2)}</td>
                  <td className="py-1.5 px-3 text-gray-500 text-xs">{ic.primaryUnit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Crime score exclusion rules */}
      <Card className="border-red-200 bg-red-50/30">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600 flex-shrink-0">
            <Icons.AlertTriangle />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Crime Score Exclusion Rules</p>
            <p className="text-xs text-gray-500 mb-2">Per-location crime scores drive automatic coverage exclusions. These rules are applied in the rater and surfaced in the workflow.</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-16 font-mono text-red-700 bg-red-100 px-1.5 py-0.5 rounded text-center">Score 80+</span>
                <span className="text-gray-600">Habitability and Assault & Battery coverages automatically excluded</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-16 font-mono text-red-700 bg-red-100 px-1.5 py-0.5 rounded text-center">Score 90+</span>
                <span className="text-gray-600">Location is flagged for manual review — may be declined</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ProductConfigStep({ lobType, coverageEnabled, onToggleCoverage, fieldDefs, onUpdateFieldDef, workflowSteps }) {
  const template = LOB_TEMPLATES[lobType];
  const _fieldDefs = fieldDefs || (lobType === "habitational_gl" ? GL_PRODUCT_FIELD_DEFINITIONS : PRODUCT_FIELD_DEFINITIONS);

  // Compute live workflow impact summary
  const covStepFields = workflowSteps?.find(s => s.id === "coverages")?.fields?.length || 0;
  const enabledCount = Object.values(coverageEnabled || {}).filter(Boolean).length;

  return (
    <div className="space-y-5">
      {/* Template header */}
      <Card className="border-gray-300 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
              {(() => { const IC = Icons[template.icon] || Icons.Settings; return <IC />; })()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">{template.name} — Coverages & Rating</p>
                <span className="text-xs text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded">{template.paradigm}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{template.description}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Live workflow impact banner */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200">
        <span className="text-amber-600"><Icons.Zap /></span>
        <div className="flex-1">
          <span className="text-xs font-medium text-amber-800">Live graph connection</span>
          <span className="text-xs text-amber-600 ml-2">Toggling coverages updates the UW Workflow in real time</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{enabledCount} coverages ON</span>
          <span className="text-[10px] bg-white text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">{covStepFields} fields in workflow</span>
        </div>
      </div>

      {/* LOB-specific content */}
      {lobType === "commercial_auto" && (
        <AutoConfigSection coverageEnabled={coverageEnabled} onToggleCoverage={onToggleCoverage} />
      )}
      {lobType === "workers_comp" && (
        <WCConfigSection />
      )}
      {lobType === "package_bop" && (
        <BOPConfigSection />
      )}
      {lobType === "habitational_gl" && (
        <GLConfigSection coverageEnabled={coverageEnabled} onToggleCoverage={onToggleCoverage} />
      )}

      {/* Field definitions notice */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue-50 border border-blue-200">
        <span className="text-blue-500"><Icons.Database /></span>
        <div className="flex-1">
          <span className="text-xs font-medium text-blue-700">Field definitions live in the Data Graph</span>
          <span className="text-xs text-blue-500 ml-2">Schema bindings, scope, and conditions are configured by the FDE in Rater Configuration → Data Graph</span>
        </div>
      </div>
    </div>
  );
}

// ─── Field Inventory View (used inside Data Graph) ───────────────────────────

function FieldInventoryView({ fieldDefs, mappings, raterFields, edges }) {
  const allFields = Object.entries(fieldDefs).map(([name, def]) => ({ name, ...def }));
  const accountFields = allFields.filter(f => f.scope === "account");
  const perLocFields = allFields.filter(f => f.scope === "per-location");
  const unscopedFields = allFields.filter(f => !f.scope);

  const edgeTypeStyles = {
    drives: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "drives" },
    lookup: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", label: "lookup" },
    maps: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", label: "populates" },
    conditions: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "conditions" },
    triggers: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", label: "triggers" },
  };

  const renderRow = (f, idx) => {
    const mapping = mappings[f.name];
    const srcColor = FIELD_SOURCE_COLORS[f.source] || FIELD_SOURCE_COLORS["rater"];
    const hasConditions = (f.conditions?.length || 0) + (f.optionConditions?.length || 0);
    // Split edges into inbound and outbound
    const inboundEdges = edges ? edges.filter(e => e.to && e.to.includes(f.name)) : [];
    const outboundEdges = edges ? edges.filter(e => e.from === f.name) : [];
    const allEdges = [...inboundEdges, ...outboundEdges];

    return (
      <div key={f.name + idx} className={`p-3 rounded-lg border ${f.scope === "per-location" ? "bg-sky-50/30 border-sky-200" : "bg-white border-gray-200"}`}>
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${srcColor.dot}`} />
              <span className="text-xs font-mono font-bold text-gray-900">{f.name}</span>
              {f.inputType && <span className="text-[10px] text-gray-400">{f.inputType}</span>}
              {f.scope && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${f.scope === "per-location" ? "bg-sky-100 text-sky-700 border border-sky-200" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                  {f.scope === "per-location" ? "per-location" : "account"}
                </span>
              )}
              {f.required && <span className="text-[9px] px-1 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">required</span>}
              {f.isArrayDriver && <span className="text-[9px] px-1 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">DRIVER</span>}
            </div>
            {f.label && <p className="text-[11px] text-gray-600 mb-0.5">{f.label}</p>}
            {f.helpText && <p className="text-[10px] text-gray-400 italic">{f.helpText}</p>}
          </div>
          <div className="flex flex-col gap-1 items-end flex-shrink-0">
            <span className={`text-[9px] px-1.5 py-0.5 rounded ${srcColor.bg} ${srcColor.text} border ${srcColor.border}`}>{f.source || "rater"}</span>
            {f.sourceDetail && <span className="text-[9px] text-gray-400 font-mono">{f.sourceDetail}</span>}
            {mapping && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded ${mapping.status === "unmapped" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
                {mapping.status === "unmapped" ? "\u2717 unmapped" : "\u2713 mapped"}
              </span>
            )}
            {hasConditions > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">{hasConditions} conditions</span>}
          </div>
        </div>

        {/* Inline edge details — inbound and outbound */}
        {allEdges.length > 0 && (
          <div className="mt-2 space-y-1">
            {inboundEdges.length > 0 && (
              <div className="flex flex-col gap-1">
                {inboundEdges.map((e, ei) => {
                  const es = edgeTypeStyles[e.type] || edgeTypeStyles.conditions;
                  return (
                    <div key={"in" + ei} className={`flex items-center gap-1.5 px-2 py-1 rounded ${es.bg} border ${es.border} text-[10px]`}>
                      <span className="text-gray-400 font-medium">IN</span>
                      <span className="font-mono font-semibold text-gray-800">{e.from}</span>
                      <span className="text-gray-400">\u2192</span>
                      <span className={`px-1 py-0.5 rounded font-medium ${es.text} bg-white`}>{es.label}</span>
                      <span className="text-gray-400">\u2192</span>
                      <span className="font-mono font-semibold text-gray-800">{f.name}</span>
                      <span className="text-gray-400 ml-1">{e.desc}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {outboundEdges.length > 0 && (
              <div className="flex flex-col gap-1">
                {outboundEdges.map((e, ei) => {
                  const es = edgeTypeStyles[e.type] || edgeTypeStyles.conditions;
                  return (
                    <div key={"out" + ei} className={`flex items-center gap-1.5 px-2 py-1 rounded ${es.bg} border ${es.border} text-[10px]`}>
                      <span className="text-gray-400 font-medium">OUT</span>
                      <span className="font-mono font-semibold text-gray-800">{f.name}</span>
                      <span className="text-gray-400">\u2192</span>
                      <span className={`px-1 py-0.5 rounded font-medium ${es.text} bg-white`}>{es.label}</span>
                      <span className="text-gray-400">\u2192</span>
                      <span className="font-mono font-semibold text-gray-800">{e.to}</span>
                      <span className="text-gray-400 ml-1">{e.desc}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {f.allowedValues && f.allowedValues.length > 0 && (
          <div className="mt-2 flex items-center gap-1 flex-wrap">
            <span className="text-[9px] text-gray-400">Values:</span>
            {f.allowedValues.map((v, vi) => <span key={vi} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{v}</span>)}
          </div>
        )}
        {f.linkedTo && f.linkedTo.length > 0 && (
          <div className="mt-1 flex items-center gap-1 flex-wrap">
            <span className="text-[9px] text-gray-400">Linked:</span>
            {f.linkedTo.map((l, li) => <span key={li} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">{typeof l === "string" ? l : `${l.field} (${l.relationship})`}</span>)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Field Inventory — All Definitions</h4>
            <p className="text-xs text-gray-500 mt-0.5">Every field with its definition, scope, conditions, and graph edges. This is the FDE's field configuration workspace.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{allFields.length} total</span>
            <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">{accountFields.length} account</span>
            <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200">{perLocFields.length} per-location</span>
          </div>
        </div>

        {accountFields.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-700">Account-Level Fields</span>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{accountFields.length}</span>
            </div>
            <div className="space-y-1.5">{accountFields.map((f, i) => renderRow(f, i))}</div>
          </div>
        )}

        {perLocFields.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-sky-700">Per-Location Fields</span>
              <span className="text-[10px] text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">{perLocFields.length} · repeating</span>
            </div>
            <div className="space-y-1.5">{perLocFields.map((f, i) => renderRow(f, i))}</div>
          </div>
        )}

        {unscopedFields.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-orange-700">Other Fields</span>
              <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">{unscopedFields.length}</span>
            </div>
            <div className="space-y-1.5">{unscopedFields.map((f, i) => renderRow(f, i))}</div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── Data Graph Step (FDE) — merged schema mapping + dependency graph ─────────

function DataGraphStep({ mappings, onUpdateMapping, lobType }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphView, setGraphView] = useState("sources"); // sources | edges | mapping | fields
  const raterSchema = getRaterSchema(lobType);
  const raterFields = getRaterFields(lobType);
  const fieldDefs = getFieldDefs(lobType);

  // Data source nodes — represents ALL external schemas that map to Federato core
  const sourceNodes = [
    { id: "rater", label: "Connected Rater", type: "rater", icon: "📊", color: "blue", fields: raterFields, desc: `${raterSchema.sheets.length} sheets \u00B7 ${raterFields.length} fields`, mappingContext: "Rater cell references \u2192 Federato core columns" },
    { id: "database", label: "Federato Core Schema", type: "database", icon: "🗄\uFE0F", color: "purple", fields: [
      { name: "carrier_id", sheet: "DB", type: "ref" },
      { name: "management_co", sheet: "DB", type: "text" },
      { name: "new_buyer", sheet: "DB", type: "boolean" },
      { name: "new_purchase", sheet: "DB", type: "boolean" },
      { name: "account_name", sheet: "DB", type: "text" },
      { name: "primary_state", sheet: "DB", type: "text" },
    ], desc: "Core data model \u2014 all sources map here", mappingContext: "Canonical schema \u2014 other sources map TO these columns" },
    { id: "submission", label: "Submission Intake", type: "submission", icon: "📧", color: "amber", fields: [
      { name: "sub_insured_name", sheet: "Submission", type: "text" },
      { name: "sub_address", sheet: "Submission", type: "text" },
      { name: "sub_locations", sheet: "Submission", type: "array" },
      { name: "sub_effective_date", sheet: "Submission", type: "date" },
      { name: "sub_broker", sheet: "Submission", type: "text" },
    ], desc: "Parsed from ACORD forms or email intake", mappingContext: "Submission fields \u2192 Federato core columns (e.g. sub_address \u2192 street_address)" },
    { id: "policy_admin", label: "Policy Admin System", type: "database", icon: "🏛\uFE0F", color: "teal", fields: [
      { name: "pas_policy_number", sheet: "PAS", type: "text" },
      { name: "pas_prior_premium", sheet: "PAS", type: "currency" },
      { name: "pas_loss_runs", sheet: "PAS", type: "array" },
    ], desc: "Renewal data from carrier PAS", mappingContext: "PAS fields \u2192 Federato core columns for renewal submissions" },
    { id: "geo_api", label: "Geo Risk API", type: "api", icon: "🌐", color: "pink", fields: [
      { name: "api_crime_score", sheet: "API", type: "number" },
      { name: "api_flood_zone", sheet: "API", type: "text" },
      { name: "api_wind_tier", sheet: "API", type: "text" },
    ], desc: "Per-location enrichment \u2014 requires zip_code", mappingContext: "API response fields \u2192 Federato core columns (auto-mapped per location)" },
    { id: "forms", label: "Form Templates", type: "forms", icon: "📄", color: "orange", fields: (typeof FORM_TEMPLATE_FIELDS !== 'undefined' ? FORM_TEMPLATE_FIELDS : []).map(f => ({ name: f.name || f, sheet: "Forms", type: "form" })), desc: "Merge fields + attachment logic", mappingContext: "Template slots \u2192 Federato core columns (merge fields like {{effective_date}})" },
  ];

  // Dependency edges — full multi-hop lineage chain
  const edges = [
    // Array drivers
    { from: "num_locations", to: "Inputs_Loc array", type: "drives", color: "blue", desc: "Drives location array size (unbounded)" },
    { from: "num_locations", to: "RateFactors array", type: "drives", color: "blue", desc: "Drives risk factor array size" },
    // Submission \u2192 Core \u2192 Rater chain
    { from: "sub_insured_name", to: "named_insured", type: "maps", color: "green", desc: "Submission intake \u2192 Federato core \u2192 rater Inputs sheet" },
    { from: "sub_address", to: "street_address", type: "maps", color: "green", desc: "Submission parsed address \u2192 per-location field in core schema" },
    { from: "sub_locations", to: "Inputs_Loc array", type: "maps", color: "green", desc: "Parsed locations from submission populate the location array" },
    // Geo API chain: zip_code \u2192 API call \u2192 crime_score \u2192 rater
    { from: "zip_code", to: "api_crime_score", type: "lookup", color: "pink", desc: "Zip code triggers Geo Risk API call per location" },
    { from: "api_crime_score", to: "crime_score", type: "maps", color: "green", desc: "API response populates rater crime_score field" },
    // Crime score downstream effects
    { from: "crime_score", to: "habitability_limit", type: "conditions", color: "amber", desc: "Excluded when crime score \u2265 80" },
    { from: "crime_score", to: "ab_limit", type: "conditions", color: "amber", desc: "Excluded when crime score \u2265 80" },
    // Lookup tables
    { from: "industry_class", to: "Ind_RF lookup", type: "lookup", color: "gray", desc: "Keys into industry class reference table for base rate" },
    // Form triggers
    { from: "blanket_ai", to: "CG 20 10 form", type: "triggers", color: "orange", desc: "Attaches Additional Insured form when ON" },
    { from: "ebl_limit", to: "EBL Endorsement", type: "triggers", color: "orange", desc: "Attaches EBL form when limit > 0" },
    // Conditional visibility
    { from: "sub_industry_class", to: "rf_lro_factor", type: "conditions", color: "amber", desc: "Visible only for LRO class" },
    { from: "sub_industry_class", to: "rf_vacant_factor", type: "conditions", color: "amber", desc: "Visible only for Vacant Land class" },
    // Policy Admin \u2192 Core
    { from: "pas_loss_runs", to: "rf_claim_his", type: "maps", color: "green", desc: "Prior loss runs from PAS inform claim history risk factor" },
  ];

  const edgeTypeColors = {
    drives: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
    lookup: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-500" },
    maps: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
    conditions: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
    triggers: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
  };

  // Confidence computation
  const totalFields = raterFields.length;
  const mappedFields = Object.values(mappings).filter(m => m.status === "auto-mapped" || m.status === "confirmed").length;
  const unmappedFields = Object.values(mappings).filter(m => m.status === "unmapped").length;
  const mappingPct = Math.round((mappedFields / totalFields) * 100);
  const edgesPct = Math.min(100, Math.round((edges.length / 15) * 100)); // 15 = estimated total edges
  const overallReadiness = Math.round((mappingPct * 0.5) + (edgesPct * 0.5));

  return (
    <div className="space-y-5">
      {/* Graph header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Data Dependency Graph</h3>
          <p className="text-xs text-gray-500">All data sources, field mappings, and dependency edges in one view. Click a source to inspect fields and edit schema bindings.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Readiness indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${overallReadiness >= 80 ? "bg-green-500" : overallReadiness >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${overallReadiness}%` }} />
            </div>
            <span className={`text-xs font-semibold ${overallReadiness >= 80 ? "text-green-700" : overallReadiness >= 50 ? "text-amber-700" : "text-red-700"}`}>{overallReadiness}%</span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="text-lg font-bold text-blue-700">{totalFields}</div>
          <div className="text-xs text-blue-600">Rater Fields</div>
        </div>
        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="text-lg font-bold text-green-700">{mappedFields}</div>
          <div className="text-xs text-green-600">Mapped ({mappingPct}%)</div>
        </div>
        <div className={`p-3 rounded-lg ${unmappedFields > 0 ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-200"}`}>
          <div className={`text-lg font-bold ${unmappedFields > 0 ? "text-red-700" : "text-gray-400"}`}>{unmappedFields}</div>
          <div className={`text-xs ${unmappedFields > 0 ? "text-red-600" : "text-gray-400"}`}>Unmapped</div>
        </div>
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
          <div className="text-lg font-bold text-amber-700">{edges.length}</div>
          <div className="text-xs text-amber-600">Dependency Edges</div>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
        {[
          { id: "sources", label: "Data Sources" },
          { id: "fields", label: "Field Inventory" },
          { id: "edges", label: "Dependency Edges" },
          { id: "mapping", label: "Rater Mapping" },
        ].map(v => (
          <button key={v.id} onClick={() => { setGraphView(v.id); setSelectedNode(null); }}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${graphView === v.id ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Sources view */}
      {graphView === "sources" && (
        <div className="grid grid-cols-2 gap-4">
          {/* Source cards */}
          <div className="space-y-3">
            {sourceNodes.map(src => {
              const isSelected = selectedNode === src.id;
              return (
                <div key={src.id} onClick={() => setSelectedNode(isSelected ? null : src.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? `border-${src.color}-400 bg-${src.color}-50/50` : "border-gray-200 bg-white hover:border-gray-300"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{src.icon}</span>
                    <span className="text-sm font-semibold text-gray-900">{src.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded bg-${src.color}-100 text-${src.color}-700`}>{src.type}</span>
                  </div>
                  <p className="text-xs text-gray-500">{src.desc}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {src.fields.slice(0, 6).map(f => (
                      <span key={f.name} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{f.name}</span>
                    ))}
                    {src.fields.length > 6 && <span className="text-[10px] text-gray-400">+{src.fields.length - 6} more</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Node detail panel (schema mapping lives here) */}
          <div>
            {selectedNode ? (() => {
              const src = sourceNodes.find(s => s.id === selectedNode);
              if (!src) return null;
              const nodeEdges = edges.filter(e => src.fields.some(f => f.name === e.from) || src.fields.some(f => f.name === e.to?.split(" ")[0]));
              return (
                <div className="border border-gray-200 rounded-lg overflow-hidden sticky top-20">
                  <div className={`px-4 py-3 bg-${src.color}-600 text-white`}>
                    <div className="flex items-center gap-2">
                      <span>{src.icon}</span>
                      <span className="text-sm font-semibold">{src.label}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                    {/* Mapping context */}
                    {src.mappingContext && (
                      <div className="px-3 py-2 rounded bg-indigo-50 border border-indigo-200">
                        <p className="text-[10px] text-indigo-700"><span className="font-semibold">Schema mapping:</span> {src.mappingContext}</p>
                      </div>
                    )}
                    {/* Schema bindings for each field */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Fields & Definitions</h4>
                      <div className="space-y-1.5">
                        {src.fields.map(f => {
                          const mapping = mappings[f.name];
                          const def = fieldDefs[f.name];
                          const fieldScope = def?.scope;
                          const hasConditions = def?.conditions?.length > 0 || def?.optionConditions?.length > 0;
                          return (
                            <div key={f.name} className={`px-3 py-2 rounded border text-xs ${fieldScope === "per-location" ? "bg-sky-50/50 border-sky-200" : "bg-white border-gray-200"}`}>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-semibold text-gray-900 truncate" title={f.name}>{f.name}</span>
                                <span className="text-gray-400">{def?.inputType || f.type || ""}</span>
                                {fieldScope && (
                                  <span className={`text-[9px] px-1 py-0.5 rounded font-medium ${fieldScope === "per-location" ? "bg-sky-100 text-sky-700" : "bg-gray-100 text-gray-600"}`}>
                                    {fieldScope === "per-location" ? "per-loc" : "acct"}
                                  </span>
                                )}
                                {def?.required && <span className="text-[9px] px-1 py-0.5 rounded bg-red-50 text-red-600">req</span>}
                                {hasConditions && <span className="text-[9px] px-1 py-0.5 rounded bg-amber-50 text-amber-600">{(def.conditions?.length || 0) + (def.optionConditions?.length || 0)} cond</span>}
                                <span className="flex-1" />
                                {mapping ? (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${mapping.status === "auto-mapped" ? "bg-green-100 text-green-700" : mapping.status === "unmapped" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                                    {mapping.status === "auto-mapped" ? "✓ mapped" : mapping.status === "unmapped" ? "✗ unmapped" : "confirmed"}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-gray-300">—</span>
                                )}
                              </div>
                              {def?.label && <p className="text-[10px] text-gray-500 mt-1">{def.label}</p>}
                              {def?.helpText && <p className="text-[9px] text-gray-400 italic mt-0.5">{def.helpText}</p>}
                              {def?.allowedValues && (
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  {def.allowedValues.slice(0, 5).map(v => <span key={v} className="text-[8px] px-1 py-0.5 rounded bg-gray-100 text-gray-500">{v}</span>)}
                                  {def.allowedValues.length > 5 && <span className="text-[8px] text-gray-400">+{def.allowedValues.length - 5}</span>}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Edges from/to this source */}
                    {nodeEdges.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Dependency Edges</h4>
                        <div className="space-y-1.5">
                          {nodeEdges.map((e, i) => {
                            const ec = edgeTypeColors[e.type] || edgeTypeColors.conditions;
                            return (
                              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded border text-xs ${ec.bg} ${ec.border}`}>
                                <span className={`w-2 h-2 rounded-full ${ec.dot}`} />
                                <span className="font-mono font-semibold">{e.from}</span>
                                <span className="text-gray-400">→</span>
                                <span className="font-mono">{e.to}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${ec.text} bg-white`}>{e.type}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })() : (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                <div className="text-gray-300 mb-3"><Icons.Database /></div>
                <p className="text-sm font-medium text-gray-400">Select a data source</p>
                <p className="text-xs text-gray-300 mt-1">Click a source card to inspect fields, schema bindings, and dependency edges</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edges view */}
      {graphView === "edges" && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-500"><Icons.Link /></span>
            <h4 className="text-sm font-semibold text-gray-900">All Dependency Edges</h4>
            <span className="text-xs text-gray-400">{edges.length} edges</span>
          </div>
          {/* Edge type legend */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(edgeTypeColors).map(([type, c]) => (
              <span key={type} className={`text-[10px] px-2 py-1 rounded font-medium ${c.bg} ${c.text} border ${c.border}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${c.dot} mr-1`} />{type}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            {edges.map((e, i) => {
              const ec = edgeTypeColors[e.type] || edgeTypeColors.conditions;
              return (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${ec.border} ${ec.bg}`}>
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${ec.dot}`} />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs font-mono font-semibold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{e.from}</span>
                    <svg width="20" height="12" className="text-gray-400 flex-shrink-0"><path d="M0 6h14m-4-4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
                    <span className="text-xs font-mono font-semibold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{e.to}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${ec.text}`}>{e.type}</span>
                  <span className="text-[10px] text-gray-500">{e.desc}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Field Inventory — all fields with full definitions */}
      {graphView === "fields" && (
        <FieldInventoryView fieldDefs={fieldDefs} mappings={mappings} raterFields={raterFields} edges={edges} />
      )}

      {/* Mapping view — full schema mapping table */}
      {graphView === "mapping" && (
        <SchemaMappingStep mappings={mappings} onUpdateMapping={onUpdateMapping} onUpdateCategory={() => {}} lobType={lobType} />
      )}
    </div>
  );
}

// ─── Forms & Documents Step (PM) ─────────────────────────────────────────────

function FormsDocumentsStep({ lobType, coverageEnabled }) {
  const [formsTab, setFormsTab] = useState("library");

  const formLibrary = [
    { number: "CG 00 01", title: "Commercial General Liability Coverage Form", type: "Mandatory", edition: "04/13", lob: "GL", state: "All", premiumBearing: true },
    { number: "CG 20 10", title: "Additional Insured — Owners, Lessees or Contractors", type: "Conditional", edition: "04/13", lob: "GL", state: "All", trigger: "blanket_ai = ON", premiumBearing: false },
    { number: "CG 20 37", title: "Additional Insured — Owners, Lessees or Contractors (Completed Ops)", type: "Conditional", edition: "04/13", lob: "GL", state: "All", trigger: "blanket_ai = ON", premiumBearing: false },
    { number: "IL 00 21", title: "Nuclear Energy Liability Exclusion", type: "Mandatory", edition: "09/08", lob: "GL", state: "All", premiumBearing: false },
    { number: "EBL-001", title: "Employment Benefits Liability Endorsement", type: "Conditional", edition: "01/20", lob: "GL", state: "All", trigger: "ebl_limit > 0", premiumBearing: true },
    { number: "SAM-EX", title: "Sexual Abuse or Molestation Exclusion", type: "Conditional", edition: "01/20", lob: "GL", state: "All", trigger: "crime_score ≥ 80", premiumBearing: false },
    { number: "HAB-001", title: "Habitability Coverage Endorsement", type: "Conditional", edition: "01/22", lob: "GL", state: "CA, NY, FL", trigger: "habitability = ON AND crime_score < 80", premiumBearing: true },
    { number: "HNOA-001", title: "Hired and Non-Owned Auto Liability", type: "Optional", edition: "01/20", lob: "GL", state: "All", trigger: "hnoa = ON", premiumBearing: true },
  ];

  const mergeFieldMap = [
    { template: "{{account_name}}", node: "named_insured", scope: "account", status: "mapped" },
    { template: "{{effective_date}}", node: "effective_date", scope: "account", status: "mapped" },
    { template: "{{expiration_date}}", node: "expiration_date", scope: "account", status: "mapped" },
    { template: "{{broker_text}}", node: "broker_name", scope: "account", status: "unmapped" },
    { template: "{{location_number}}", node: "location_name", scope: "per-location", status: "mapped" },
    { template: "{{address}}", node: "street_address", scope: "per-location", status: "mapped" },
    { template: "{{city}}", node: "—", scope: "per-location", status: "unmapped" },
    { template: "{{state}}", node: "—", scope: "per-location", status: "unmapped" },
    { template: "{{zip_code}}", node: "zip_code", scope: "per-location", status: "mapped" },
    { template: "{{per_project_aggregate_cap}}", node: "per_loc_aggregate", scope: "per-location", status: "mapped" },
    { template: "{{general_aggregate_limit}}", node: "policy_aggregate", scope: "account", status: "mapped" },
    { template: "{{deductible}}", node: "deductible", scope: "per-location", status: "mapped" },
  ];

  const typeColors = {
    "Mandatory": "bg-gray-900 text-white",
    "Conditional": "bg-amber-100 text-amber-800",
    "Optional": "bg-blue-100 text-blue-800",
  };

  return (
    <div className="space-y-5">
      {/* Sub-tab toggle */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
        {[
          { id: "library", label: "Form Library", count: formLibrary.length },
          { id: "rules", label: "Attachment Rules", count: formLibrary.filter(f => f.trigger).length },
          { id: "mapping", label: "Template Mapping", count: mergeFieldMap.length },
        ].map(t => (
          <button key={t.id} onClick={() => setFormsTab(t.id)}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1.5 ${formsTab === t.id ? "bg-green-700 text-white" : "text-gray-500 hover:bg-gray-50"}`}>
            {t.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${formsTab === t.id ? "bg-green-600 text-green-100" : "bg-gray-100 text-gray-500"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Form Library */}
      {formsTab === "library" && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Policy Forms</h4>
              <p className="text-xs text-gray-500 mt-0.5">Forms available for this product. Mandatory forms always attach. Conditional forms attach based on graph edge rules.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded border border-gray-200">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Form</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Title</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600">Type</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600">Edition</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600">States</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600">Premium</th>
                </tr>
              </thead>
              <tbody>
                {formLibrary.map(f => (
                  <tr key={f.number} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 font-mono font-semibold text-gray-900">{f.number}</td>
                    <td className="py-2 px-3 text-gray-700">{f.title}</td>
                    <td className="py-2 px-3 text-center"><span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${typeColors[f.type]}`}>{f.type}</span></td>
                    <td className="py-2 px-3 text-center text-gray-500">{f.edition}</td>
                    <td className="py-2 px-3 text-center text-gray-500">{f.state}</td>
                    <td className="py-2 px-3 text-center">{f.premiumBearing ? <span className="text-green-600">✓</span> : <span className="text-gray-300">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Attachment Rules */}
      {formsTab === "rules" && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Attachment Rules</h4>
              <p className="text-xs text-gray-500 mt-0.5">Each rule is a conditional edge in the data graph — a field value triggers form attachment.</p>
            </div>
          </div>
          <div className="space-y-2">
            {formLibrary.filter(f => f.trigger).map(f => (
              <div key={f.number} className="flex items-center gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50/50">
                <div className="flex-shrink-0 w-24">
                  <span className="text-xs font-mono font-semibold text-gray-900">{f.number}</span>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[10px] text-gray-500">WHEN</span>
                  <span className="text-xs font-mono font-semibold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200">{f.trigger}</span>
                  <svg width="20" height="12" className="text-amber-400 flex-shrink-0"><path d="M0 6h14m-4-4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
                  <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-medium">ATTACH</span>
                </div>
                <span className="text-[10px] text-gray-400">{f.title}</span>
              </div>
            ))}
            {formLibrary.filter(f => f.type === "Mandatory").map(f => (
              <div key={f.number} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50/50">
                <div className="flex-shrink-0 w-24">
                  <span className="text-xs font-mono font-semibold text-gray-900">{f.number}</span>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[10px] text-gray-900 bg-gray-900 text-white px-2 py-0.5 rounded font-medium">ALWAYS ATTACH</span>
                </div>
                <span className="text-[10px] text-gray-400">{f.title}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Template Mapping */}
      {formsTab === "mapping" && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Merge Field → Graph Node Mapping</h4>
              <p className="text-xs text-gray-500 mt-0.5">Template merge fields resolve to data graph nodes. Unmapped fields are disconnected — the template slot has no data source.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">{mergeFieldMap.filter(m => m.status === "mapped").length} mapped</span>
              <span className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">{mergeFieldMap.filter(m => m.status === "unmapped").length} disconnected</span>
            </div>
          </div>
          <div className="overflow-hidden rounded border border-gray-200">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Merge Field</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600">→</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Graph Node</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600">Scope</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {mergeFieldMap.map(m => (
                  <tr key={m.template} className={`border-b border-gray-100 ${m.status === "unmapped" ? "bg-red-50/30" : ""}`}>
                    <td className="py-2 px-3 font-mono font-semibold text-purple-700">{m.template}</td>
                    <td className="py-2 px-3 text-center text-gray-300">→</td>
                    <td className="py-2 px-3 font-mono text-gray-900">{m.node}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${m.scope === "per-location" ? "bg-sky-100 text-sky-700" : "bg-gray-100 text-gray-600"}`}>
                        {m.scope}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      {m.status === "mapped" ? (
                        <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 font-medium">✓ mapped</span>
                      ) : (
                        <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 font-medium">disconnected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {mergeFieldMap.some(m => m.status === "unmapped") && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-xs text-red-700"><span className="font-semibold">⚠ Disconnected merge fields:</span> These template slots have no graph node providing data. The quote document will show blank values for these fields until they are mapped to a data source.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// ─── Step 4: Workflow Builder ────────────────────────────────────────────────

// Helper: resolve field config from product definitions (single source of truth)
const resolveFieldConfig = (fieldName) => PRODUCT_FIELD_DEFINITIONS[fieldName] || null;

// Helper: resolve conditions for a field from product definitions
const resolveFieldConditions = (fieldName) => PRODUCT_FIELD_DEFINITIONS[fieldName]?.conditions || [];
const resolveOptionConditions = (fieldName) => PRODUCT_FIELD_DEFINITIONS[fieldName]?.optionConditions || [];

const DEFAULT_WORKFLOW_STEPS = [
  {
    id: "business_info", label: "Business Information", icon: "Briefcase",
    description: "Basic policy-level information collected at intake",
    fields: ["state", "effective_date", "is_fleet"],
    sourceType: "policy-level",
    generated: true, // auto-generated from semantic categories
    formTriggers: [],
  },
  {
    id: "coverage_selection", label: "Coverage Selection", icon: "Shield",
    description: "UW selects which coverages to include and sets limits/deductibles",
    fields: ["csl_limit", "um_uim_selected", "med_pay_selected", "med_pay_limit", "hired_selected", "non_owned_selected"],
    sourceType: "coverages",
    generated: true,
    formTriggers: [
      { id: "ft1", formNumber: "CA 99 17", formName: "Auto Medical Payments Coverage", triggerField: "med_pay_selected", operator: "equals", triggerValue: true, label: "Attach when medical payments is selected" },
      { id: "ft2", formNumber: "CA 20 48", formName: "Designated Insured for Covered Autos", triggerField: "hired_selected", operator: "equals", triggerValue: true, label: "Attach when hired auto is selected" },
    ],
  },
  {
    id: "additional_insured_info", label: "Additional Insured Details", icon: "FileText",
    description: "Collect form-required fields for additional insured endorsement",
    fields: ["additional_insured_name", "additional_insured_address"],
    sourceType: "form-fields",
    generated: true,
    formTriggers: [],
  },
  {
    id: "vehicle_schedule", label: "Vehicle Schedule", icon: "Truck",
    description: "Vehicle-by-vehicle data entry — class, use, weight, radius, deductibles",
    fields: ["vehicle_number", "state", "use_class", "vehicle_class", "year", "cost_new", "gvw_gcw", "radius", "deductible_comp", "deductible_coll"],
    sourceType: "vehicle-level",
    isTable: true,
    generated: true,
    formTriggers: [
      { id: "ft3", formNumber: "CA 04 03", formName: "Additional Insured - Lessor", triggerField: "_has_leased_vehicle", operator: "equals", triggerValue: true, label: "Attach when any vehicle is leased" },
    ],
  },
  {
    id: "select_forms", label: "Select Forms", icon: "FileText",
    description: "Attach required forms and optional endorsements",
    fields: [],
    sourceType: "forms",
    isForms: true,
    generated: true,
    formTriggers: [],
  },
  {
    id: "credits_debits", label: "Credits & Debits", icon: "DollarSign",
    description: "Subjective credits/debits applied by the underwriter",
    fields: [],
    sourceType: "rating-factors",
    isSubjectives: true,
    generated: false, // PM-added custom step
    formTriggers: [],
  },
  {
    id: "review_outputs", label: "Review & Submit", icon: "Eye",
    description: "Review rater outputs, premium summary, and submit quote",
    fields: [],
    sourceType: "outputs",
    isReview: true,
    generated: true,
    formTriggers: [],
  },
];

function WorkflowBuilderStep({ workflowSteps, onReorderStep, onToggleStep, onUpdateStep, fieldDefs, fieldSuperset, raterFields }) {
  const _fieldDefs = fieldDefs || PRODUCT_FIELD_DEFINITIONS;
  const _fieldSuperset = fieldSuperset || FIELD_SUPERSET;
  const _raterFields = raterFields || ALL_RATER_FIELDS;
  const [selectedStep, setSelectedStep] = useState(null);
  const [detailTab, setDetailTab] = useState("fields"); // fields | conditions | forms

  // Compute inherited conditions for a step from product field definitions
  const getInheritedConditions = (step) => {
    const inherited = [];
    (step.fields || []).forEach(f => {
      const def = _fieldDefs?.[f];
      if (def) {
        (def.conditions || []).forEach(c => inherited.push({ ...c, fieldName: f, fieldLabel: def.label || f, type: "visibility" }));
        (def.optionConditions || []).forEach(c => inherited.push({ ...c, fieldName: f, fieldLabel: def.label || f, type: "option-filter" }));
      }
    });
    return inherited;
  };

  const detailTabs = [
    { id: "fields", label: "Field Config", count: (s) => s.fields?.length || 0 },
    { id: "conditions", label: "Conditions", count: (s) => getInheritedConditions(s).length },
    { id: "forms", label: "Form Triggers", count: (s) => s.formTriggers?.length || 0 },
  ];

  // Compute generation stats
  const totalFields = workflowSteps.reduce((sum, s) => sum + (s.fields?.length || 0), 0);
  const allInheritedConditions = workflowSteps.reduce((sum, s) => sum + getInheritedConditions(s).length, 0);
  const totalFormTriggers = workflowSteps.reduce((sum, s) => sum + (s.formTriggers?.length || 0), 0);
  const configuredFields = workflowSteps.reduce((sum, s) => sum + (s.fields?.filter(f => _fieldDefs[f]).length || 0), 0);
  const allAssignedFields = workflowSteps.flatMap(s => s.fields || []);
  const unassignedFields = _fieldSuperset.filter(f => !allAssignedFields.includes(f.name));
  const autoGenSteps = workflowSteps.filter(s => s.generated);
  const customSteps = workflowSteps.filter(s => !s.generated);
  const repeatingSteps = workflowSteps.filter(s => {
    const plf = (s.fields || []).filter(f => _fieldDefs[f]?.scope === "per-location");
    const af = (s.fields || []).filter(f => _fieldDefs[f]?.scope === "account");
    return s.isTable || (plf.length > 0 && plf.length >= af.length);
  });

  // Confidence scoring per step
  const getStepConfidence = (step) => {
    if (step.isReview || step.isForms) return { level: "green", label: "Ready", reason: step.isReview ? "Output step — read-only summary" : "Form selection step" };
    if (!step.fields || step.fields.length === 0) return { level: "green", label: "Ready", reason: "No fields required — structural step" };
    const mapped = step.fields.filter(f => _fieldDefs[f]);
    const scoped = step.fields.filter(f => _fieldDefs[f]?.scope);
    if (mapped.length === step.fields.length && scoped.length === step.fields.length) {
      return { level: "green", label: "Ready", reason: `All ${mapped.length} fields mapped and scoped` };
    }
    if (mapped.length > 0) {
      return { level: "yellow", label: "Partial", reason: `${mapped.length}/${step.fields.length} fields resolved — ${step.fields.length - mapped.length} need configuration` };
    }
    return { level: "red", label: "Placeholder", reason: "Fields detected but not yet mapped to product definitions" };
  };

  // Generation reason per step (why did the algorithm produce this step?)
  const getGenerationReason = (step) => {
    if (step.sourceType === "policy-level") return "Scope grouping: account-level identification fields clustered together";
    if (step.sourceType === "unit-level") return "Risk unit detection: per-location array fields from Inputs_Loc sheet";
    if (step.sourceType === "exposure") return "Domain clustering: exposure base fields grouped by semantic category";
    if (step.sourceType === "coverage") return "Domain clustering: coverage selections — mixed scope (account + per-location)";
    if (step.sourceType === "rating-factor") return "Domain clustering: UW risk factors — all per-location, inferred table widget";
    if (step.sourceType === "forms") return "Form trigger resolution: forms attached based on coverage and field edge rules";
    if (step.sourceType === "outputs") return step.isReview ? "Output isolation: rater outputs are always last, read-only" : "Output step";
    if (step.sourceType === "form-fields") return "Form field extraction: fields required by attached endorsements";
    if (step.sourceType === "vehicle-level") return "Risk unit detection: per-vehicle array fields from Inputs_Vehicles sheet";
    return "Auto-generated from rater schema analysis";
  };

  const stepConfidences = workflowSteps.map(s => getStepConfidence(s));
  const greenCount = stepConfidences.filter(c => c.level === "green").length;
  const readinessPct = workflowSteps.length > 0 ? Math.round((greenCount / workflowSteps.length) * 100) : 0;
  const confColors = { green: "bg-green-500", yellow: "bg-amber-500", red: "bg-red-500" };
  const confTextColors = { green: "text-green-700", yellow: "text-amber-700", red: "text-red-700" };
  const confBgColors = { green: "bg-green-50", yellow: "bg-amber-50", red: "bg-red-50" };
  const confBorderColors = { green: "border-green-200", yellow: "border-amber-200", red: "border-red-200" };

  return (
    <div className="space-y-5">
      {/* Readiness bar */}
      <Card className={`${readinessPct === 100 ? "border-green-300 bg-green-50/30" : readinessPct >= 60 ? "border-amber-300 bg-amber-50/30" : "border-red-300 bg-red-50/30"}`}>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-gray-900">Workflow Readiness</span>
              <span className={`text-sm font-bold ${readinessPct === 100 ? "text-green-700" : readinessPct >= 60 ? "text-amber-700" : "text-red-700"}`}>{readinessPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${readinessPct === 100 ? "bg-green-500" : readinessPct >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${readinessPct}%` }} />
            </div>
            <div className="flex items-center gap-3 mt-2">
              {["green", "yellow", "red"].map(level => {
                const count = stepConfidences.filter(c => c.level === level).length;
                if (count === 0) return null;
                return (
                  <span key={level} className="flex items-center gap-1 text-[10px] text-gray-500">
                    <span className={`w-2 h-2 rounded-full ${confColors[level]}`} />
                    {count} {level === "green" ? "ready" : level === "yellow" ? "partial" : "placeholder"}
                  </span>
                );
              })}
            </div>
          </div>
          {readinessPct === 100 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold flex-shrink-0">
              <Icons.Check /> Ready to publish
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium flex-shrink-0">
              <Icons.Lock /> Publish blocked
            </div>
          )}
        </div>
      </Card>

      {/* Auto-generation summary banner */}
      <Card className="border-amber-200 bg-amber-50/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700 flex-shrink-0">
            <Icons.Zap />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-gray-900">Workflow auto-generated from data graph</p>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              The system analyzed your mapped fields and product settings to build this workflow. Review, customize, and add any business rules it couldn't infer.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-5 h-5 rounded bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">{autoGenSteps.length}</span>
                <span className="text-gray-600">auto-generated steps</span>
              </div>
              {customSteps.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="w-5 h-5 rounded bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold">{customSteps.length}</span>
                  <span className="text-gray-600">PM-added steps</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-5 h-5 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">{totalFields}</span>
                <span className="text-gray-600">fields assigned</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-5 h-5 rounded bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">{allInheritedConditions}</span>
                <span className="text-gray-600">inherited conditions</span>
              </div>
              {repeatingSteps.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="w-5 h-5 rounded bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-bold">{repeatingSteps.length}</span>
                  <span className="text-gray-600">repeating steps</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-5 h-5 rounded bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold">{totalFormTriggers}</span>
                <span className="text-gray-600">form triggers</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ─── Unassigned Field Pool ─── */}
      {unassignedFields.length > 0 && (
        <Card className="border-red-300 bg-red-50/20 border-2 border-dashed">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 flex-shrink-0">
              <Icons.AlertTriangle />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-red-700">{unassignedFields.length} Unassigned Field{unassignedFields.length > 1 ? "s" : ""}</p>
                <p className="text-[10px] text-red-400">Drag fields into a step below to assign them</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {unassignedFields.map(f => {
                  const def = _fieldDefs[f.name];
                  const sc = FIELD_SOURCE_COLORS[def?.source || f.source] || FIELD_SOURCE_COLORS["rater"];
                  return (
                    <div key={f.name} className="group/field flex items-center gap-1.5 px-2 py-1.5 bg-white rounded-md border-2 border-red-200 hover:border-red-400 hover:shadow-sm cursor-grab transition-all">
                      <span className="text-red-300 group-hover/field:text-red-500">
                        <Icons.Grip />
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      <span className="text-xs font-mono font-medium text-gray-900">{f.name}</span>
                      {def && <span className="text-[10px] text-gray-400">{def.inputType}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Two-column layout: step list + detail */}
      <div className="flex gap-5">
        {/* Workflow steps list */}
        <div className={`space-y-3 ${selectedStep ? "w-[380px] flex-shrink-0" : "flex-1"}`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-gray-900">UW Workflow Steps</p>
              <p className="text-xs text-gray-500 mt-0.5">Click a step to inspect. Drag field chips between steps to reassign.</p>
            </div>
            <button className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded hover:bg-gray-50 flex items-center gap-1">
              <Icons.Plus /> Add Step
            </button>
          </div>

          {workflowSteps.map((step, idx) => {
            const IconComp = Icons[step.icon] || Icons.Settings;
            const inheritedConds = getInheritedConditions(step);
            const condCount = inheritedConds.length;
            const ftCount = step.formTriggers?.length || 0;
            const conf = stepConfidences[idx];
            const genReason = getGenerationReason(step);
            const definedCount = step.fields?.filter(f => _fieldDefs[f]).length || 0;
            // Compute scope breakdown for this step's fields
            const perLocFields = (step.fields || []).filter(f => _fieldDefs[f]?.scope === "per-location");
            const acctFields = (step.fields || []).filter(f => _fieldDefs[f]?.scope === "account");
            const hasPerLocFields = perLocFields.length > 0;
            const isRepeatingStep = step.isTable || (hasPerLocFields && perLocFields.length >= acctFields.length);
            const isMixedScope = hasPerLocFields && acctFields.length > 0 && !step.isTable;
            return (
              <div
                key={step.id}
                className={`rounded-lg border transition-all ${
                  selectedStep === step.id
                    ? "border-gray-900 shadow-sm"
                    : step.enabled === false
                      ? "border-gray-200 bg-gray-50/50 opacity-60"
                      : isRepeatingStep
                        ? "border-sky-200 bg-sky-50/20 hover:border-sky-300"
                        : step.generated
                          ? "border-gray-200 bg-white hover:border-gray-300"
                          : "border-teal-200 bg-teal-50/20 hover:border-teal-300"
                }`}
              >
                {/* Step header — clickable */}
                <div
                  onClick={() => { setSelectedStep(step.id === selectedStep ? null : step.id); setDetailTab("fields"); }}
                  className={`group flex items-start gap-3 p-3 cursor-pointer ${step.fields && step.fields.length > 0 ? "border-b border-gray-100" : ""}`}
                >
                  <div className="pt-0.5 flex flex-col items-center gap-1">
                    <div className="text-gray-300 group-hover:text-gray-400 cursor-grab"><Icons.Grip /></div>
                    <span className={`w-2.5 h-2.5 rounded-full ${confColors[conf.level]}`} title={conf.reason} />
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    step.enabled === false ? "bg-gray-200 text-gray-400" : isRepeatingStep ? "bg-sky-600 text-white" : step.generated ? "bg-gray-900 text-white" : "bg-teal-600 text-white"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gray-500"><IconComp /></span>
                      <span className="text-sm font-medium text-gray-900">{step.label}</span>
                      {step.generated ? (
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded border border-gray-200 flex items-center gap-0.5">
                          <Icons.Zap /> auto
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 bg-teal-50 text-teal-600 rounded border border-teal-200 flex items-center gap-0.5">
                          <Icons.Edit /> custom
                        </span>
                      )}
                      {isRepeatingStep && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded border border-sky-200 flex items-center gap-0.5">
                          <Icons.Layers /> repeating · {step.sourceType === "vehicle-level" ? "per vehicle" : "per location"}
                        </span>
                      )}
                      {isMixedScope && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-200 flex items-center gap-0.5">
                          mixed scope · {acctFields.length} acct + {perLocFields.length} per-loc
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {condCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded border border-amber-200 flex items-center gap-0.5">
                          <Icons.Lock /> {condCount} inherited
                        </span>
                      )}
                      {ftCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded border border-purple-200">
                          {ftCount} form trigger{ftCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    {/* Generation reason */}
                    {step.generated && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${confColors[conf.level]}`} />
                        <span className="text-[10px] text-gray-400 italic">{genReason}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {idx > 0 && (
                      <button onClick={e => { e.stopPropagation(); onReorderStep(idx, idx - 1); }} className="p-1 text-gray-400 hover:text-gray-600 rounded" title="Move up">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                      </button>
                    )}
                    {idx < workflowSteps.length - 1 && (
                      <button onClick={e => { e.stopPropagation(); onReorderStep(idx, idx + 1); }} className="p-1 text-gray-400 hover:text-gray-600 rounded" title="Move down">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* ─── Field chips inside step (the key visual association) ─── */}
                {step.fields && step.fields.length > 0 && (
                  <div className="px-3 py-2.5 bg-gray-50/50">
                    <div className="flex flex-wrap gap-1.5">
                      {step.fields.map(f => {
                        const def = _fieldDefs[f];
                        const sc = def ? (FIELD_SOURCE_COLORS[def.source] || FIELD_SOURCE_COLORS["rater"]) : null;
                        return (
                          <div key={f} className={`group/chip flex items-center gap-1 px-2 py-1 rounded border hover:border-blue-400 hover:shadow-sm cursor-grab transition-all ${def?.scope === "per-location" ? "bg-sky-50/50 border-sky-200" : "bg-white border-gray-200"}`}>
                            <span className="text-gray-300 group-hover/chip:text-blue-400">
                              <Icons.Grip />
                            </span>
                            {sc && <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />}
                            <span className="text-[10px] font-mono font-medium text-gray-800">{f}</span>
                            {def && (
                              <span className="text-[10px] text-gray-400 ml-0.5">{def.inputType}</span>
                            )}
                            {def?.scope === "per-location" && (
                              <span className="text-[10px] text-sky-600"><Icons.Map /></span>
                            )}
                            {def?.conditions?.length > 0 && (
                              <span className="text-[10px] text-amber-500"><Icons.Zap /></span>
                            )}
                            {def?.linkedTo?.length > 0 && (
                              <span className="text-[10px] text-green-500"><Icons.Link /></span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Drop zone indicator for steps with no fields */}
                {(!step.fields || step.fields.length === 0) && !step.isForms && !step.isSubjectives && !step.isReview && (
                  <div className="px-3 py-3">
                    <div className="border-2 border-dashed border-gray-200 rounded-lg py-3 text-center">
                      <p className="text-[10px] text-gray-400">Drop fields here</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── Enriched Step Detail Panel ─── */}
        {selectedStep && (() => {
          const step = workflowSteps.find(s => s.id === selectedStep);
          if (!step) return null;
          const IconComp = Icons[step.icon] || Icons.Settings;
          const inheritedConditions = getInheritedConditions(step);
          const formTriggers = step.formTriggers || [];

          return (
            <div className="flex-1 min-w-0">
              <Card className="sticky top-0">
                {/* Panel header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500"><IconComp /></span>
                    <p className="text-sm font-semibold text-gray-900">{step.label}</p>
                    <span className="text-xs text-gray-400">Step Configuration</span>
                  </div>
                  <button onClick={() => setSelectedStep(null)} className="text-gray-400 hover:text-gray-600"><Icons.X /></button>
                </div>

                {/* Step basics (compact) */}
                <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Label</label>
                    <input type="text" defaultValue={step.label} className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Source Type</label>
                    <select defaultValue={step.sourceType} className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white">
                      <option value="policy-level">Policy-Level</option>
                      <option value="coverages">Coverages</option>
                      <option value="vehicle-level">Vehicle-Level</option>
                      <option value="forms">Forms</option>
                      <option value="rating-factors">Rating Factors</option>
                      <option value="outputs">Outputs</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                {/* Tab bar for detail sections */}
                <div className="flex border-b border-gray-200 mb-4">
                  {detailTabs.map(t => {
                    const count = t.count(step);
                    return (
                      <button
                        key={t.id}
                        onClick={() => setDetailTab(t.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                          detailTab === t.id ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {t.label}
                        {count > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            detailTab === t.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
                          }`}>{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* ─── Tab: Field Configuration (read-only from product defs) ─── */}
                {detailTab === "fields" && (
                  <div className="space-y-3">
                    {step.fields && step.fields.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">{step.fields.length} fields assigned to this step</p>
                          <button className="text-[10px] text-blue-600 hover:text-blue-700 font-medium">+ Add Field</button>
                        </div>

                        {/* Read-only notice */}
                        <div className="px-2.5 py-2 bg-indigo-50 rounded border border-indigo-200">
                          <p className="text-[10px] text-indigo-600 flex items-center gap-1">
                            <Icons.Lock /> Field configuration is defined in <span className="font-medium">Rater Config → Data Graph</span>. Changes here are read-only.
                          </p>
                        </div>

                        {step.fields.map(f => {
                          const fc = _fieldDefs[f];
                          const raterField = _raterFields.find(rf => rf.name === f);
                          if (!fc) {
                            return (
                              <div key={f} className="px-3 py-2.5 bg-red-50/50 rounded-lg border border-red-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Icons.AlertTriangle />
                                    <span className="text-xs font-mono font-medium text-gray-900">{f}</span>
                                  </div>
                                  <span className="text-[10px] text-red-500 font-medium">Not defined in product</span>
                                </div>
                                <p className="text-[10px] text-red-400 mt-1">This field has no product-level definition. Add it in Rater Config → Data Graph.</p>
                              </div>
                            );
                          }
                          const condCount = (fc.conditions?.length || 0) + (fc.optionConditions?.length || 0);
                          return (
                            <div key={f} className="rounded-lg border border-gray-200 overflow-hidden">
                              {/* Field header */}
                              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono font-semibold text-gray-900">{f}</span>
                                  {raterField && <span className="text-[10px] text-gray-400">→ {raterField.sheet}!{raterField.cell}</span>}
                                  {fc.source === "form" && <span className="text-[10px] text-purple-500">form: {fc.formNumber}</span>}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {fc.required && <span className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">Required</span>}
                                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">{fc.inputType}</span>
                                  {condCount > 0 && <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">{condCount} cond.</span>}
                                </div>
                              </div>
                              {/* Field config details (read-only) */}
                              <div className="px-3 py-2 space-y-1.5">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-gray-400">Label:</span>
                                    <span className="text-[10px] font-medium text-gray-700">{fc.label}</span>
                                  </div>
                                  {fc.defaultValue !== undefined && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px] text-gray-400">Default:</span>
                                      <span className="text-[10px] font-mono text-gray-700">{String(fc.defaultValue)}</span>
                                    </div>
                                  )}
                                  {fc.validation && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                                      {fc.validation.type === "required" ? "Required" :
                                       fc.validation.type === "range" ? `${fc.validation.min}–${fc.validation.max}` :
                                       fc.validation.type === "date_range" ? `${fc.validation.min} to ${fc.validation.max}` : fc.validation.type}
                                    </span>
                                  )}
                                </div>
                                {fc.allowedValues && (
                                  <div className="flex flex-wrap gap-1">
                                    {fc.allowedValues.map(v => (
                                      <span key={v} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{v}</span>
                                    ))}
                                  </div>
                                )}
                                {fc.helpText && <p className="text-[10px] text-gray-400 italic">{fc.helpText}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="text-center py-6 text-gray-400">
                        <p className="text-xs">No configurable fields in this step.</p>
                        <p className="text-[10px] mt-1">{step.isForms ? "Form selection is handled by form attachment rules." : step.isSubjectives ? "Credits & debits use predefined rating factors." : step.isReview ? "Review step displays rater outputs." : ""}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── Tab: Inherited Conditions (read-only from product defs) ─── */}
                {detailTab === "conditions" && (
                  <div className="space-y-3">
                    {/* Read-only notice */}
                    <div className="px-2.5 py-2 bg-indigo-50 rounded border border-indigo-200">
                      <p className="text-[10px] text-indigo-600 flex items-center gap-1">
                        <Icons.Lock /> Conditions are inherited from <span className="font-medium">Rater Config → Data Graph</span>. Edit them there to change behavior.
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {inheritedConditions.length > 0
                          ? `${inheritedConditions.length} condition${inheritedConditions.length > 1 ? "s" : ""} inherited from product field definitions`
                          : "No conditions apply to fields in this step"}
                      </p>
                    </div>

                    {inheritedConditions.length > 0 ? (
                      <>
                        {/* Visibility conditions */}
                        {inheritedConditions.filter(c => c.type === "visibility").length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                              <Icons.Eye /> Visibility Conditions
                            </p>
                            <div className="space-y-1.5">
                              {inheritedConditions.filter(c => c.type === "visibility").map(cond => (
                                <div key={cond.id} className="rounded-lg border border-amber-200 bg-amber-50/30 p-3 opacity-90">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded bg-amber-100 flex items-center justify-center text-amber-700">
                                        <Icons.Zap />
                                      </div>
                                      <span className="text-xs font-medium text-gray-900">{cond.label}</span>
                                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded flex items-center gap-0.5">
                                        <Icons.Lock /> read-only
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 bg-white rounded border border-amber-200 px-3 py-2">
                                    <span className="text-[10px] text-gray-400">Show</span>
                                    <span className="text-xs font-mono font-medium text-gray-900">{cond.fieldLabel}</span>
                                    <span className="text-[10px] text-gray-400">when</span>
                                    <span className="text-xs font-mono text-gray-700">{cond.showWhen}</span>
                                    <span className="text-[10px] text-gray-400">{cond.operator}</span>
                                    <span className="text-xs font-mono text-amber-700">
                                      {Array.isArray(cond.value) ? cond.value.join(", ") : String(cond.value)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Option-level conditions */}
                        {inheritedConditions.filter(c => c.type === "option-filter").length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                              <Icons.Settings /> Option-Level Conditions
                            </p>
                            <div className="space-y-1.5">
                              {inheritedConditions.filter(c => c.type === "option-filter").map(cond => (
                                <div key={cond.id} className="rounded-lg border border-orange-200 bg-orange-50/30 p-3 opacity-90">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded bg-orange-100 flex items-center justify-center text-orange-700">
                                        <Icons.Settings />
                                      </div>
                                      <span className="text-xs font-medium text-gray-900">{cond.label}</span>
                                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded flex items-center gap-0.5">
                                        <Icons.Lock /> read-only
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 bg-white rounded border border-orange-200 px-3 py-2">
                                    <span className="text-[10px] text-gray-400">On</span>
                                    <span className="text-xs font-mono font-medium text-gray-900">{cond.fieldLabel}</span>
                                    <span className="text-[10px] text-gray-400">when</span>
                                    <span className="text-xs font-mono text-orange-700">{cond.whenField}={cond.whenValue}</span>
                                    <span className="text-[10px] text-gray-400">→ show only</span>
                                    <div className="flex gap-1">
                                      {cond.filteredValues?.map(v => (
                                        <span key={v} className="text-[10px] px-1 py-0.5 bg-orange-50 text-orange-700 rounded border border-orange-200">{v}</span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2 text-gray-400">
                          <Icons.Zap />
                        </div>
                        <p className="text-xs text-gray-500">No conditions apply to this step's fields</p>
                        <p className="text-[10px] text-gray-400 mt-1">Add visibility or option-level conditions in Rater Config → Data Graph</p>
                      </div>
                    )}

                    {/* Step-level condition hint */}
                    <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                      <p className="text-[10px] text-gray-500">
                        <span className="font-medium text-gray-600">Tip:</span> You can also add a step-level condition to skip this entire step.
                        For example, skip the Vehicle Schedule step if the product is non-fleet.
                      </p>
                    </div>
                  </div>
                )}

                {/* ─── Tab: Form Triggers ─── */}
                {detailTab === "forms" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Forms & endorsements attached based on values in this step</p>
                      <button className="text-[10px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"><Icons.Plus /> Add Trigger</button>
                    </div>

                    {formTriggers.length > 0 ? formTriggers.map(ft => (
                      <div key={ft.id} className="rounded-lg border border-purple-200 bg-purple-50/30 p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-purple-100 flex items-center justify-center text-purple-700">
                              <Icons.FileText />
                            </div>
                            <div>
                              <span className="text-xs font-medium text-gray-900">{ft.formNumber}</span>
                              <span className="text-xs text-gray-500 ml-1.5">{ft.formName}</span>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600"><Icons.X /></button>
                        </div>
                        <div className="flex items-center gap-2 bg-white rounded border border-purple-200 px-3 py-2">
                          <span className="text-[10px] text-gray-400">Attach when</span>
                          <span className="text-xs font-mono font-medium text-gray-900">{ft.triggerField}</span>
                          <select defaultValue={ft.operator} className="text-[10px] px-1.5 py-0.5 border border-gray-200 rounded bg-white">
                            <option value="equals">equals</option>
                            <option value="not_equals">not equals</option>
                            <option value="in">is one of</option>
                          </select>
                          <span className="text-xs font-mono text-purple-700">{String(ft.triggerValue)}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1.5 italic">{ft.label}</p>
                      </div>
                    )) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2 text-gray-400">
                          <Icons.FileText />
                        </div>
                        <p className="text-xs text-gray-500">No form triggers defined</p>
                        <p className="text-[10px] text-gray-400 mt-1">Add triggers to auto-attach endorsements based on field values</p>
                      </div>
                    )}

                    {/* Accumulated forms summary */}
                    {formTriggers.length > 0 && (
                      <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                        <p className="text-[10px] text-gray-500">
                          <span className="font-medium text-gray-600">How it works:</span> Triggered forms accumulate across all workflow steps and are surfaced in the "Select Forms" step for the underwriter to review. Base forms are always attached.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ─── Step 5: Workflow Preview ───────────────────────────────────────────────

function WorkflowPreviewStep({ workflowSteps, coverageEnabled, fieldDefs, raterFields: raterFieldsProp, lobType }) {
  const _fieldDefs = fieldDefs || PRODUCT_FIELD_DEFINITIONS;
  const _raterFields = raterFieldsProp || ALL_RATER_FIELDS;
  const _raterSchema = getRaterSchema(lobType);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [formValues, setFormValues] = useState({
    state: "GA", is_fleet: false, effective_date: "2026-03-01",
    csl_limit: "$500K", um_uim_selected: true, med_pay_selected: false,
    med_pay_limit: "$5,000", hired_selected: false, non_owned_selected: false,
  });

  const enabledSteps = workflowSteps.filter(s => s.enabled !== false);
  const currentStep = enabledSteps[activeStep];
  if (!currentStep) return null;

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, activeStep]));
    if (activeStep < enabledSteps.length - 1) setActiveStep(activeStep + 1);
  };
  const handleBack = () => { if (activeStep > 0) setActiveStep(activeStep - 1); };

  // Evaluate whether a field should be visible based on product-level conditions
  const isFieldVisible = (fieldName, step) => {
    const def = _fieldDefs[fieldName];
    if (!def || !def.conditions || def.conditions.length === 0) return true;
    return def.conditions.every(cond => {
      const depValue = formValues[cond.showWhen];
      if (cond.operator === "equals") return depValue === cond.value;
      if (cond.operator === "not_equals") return depValue !== cond.value;
      if (cond.operator === "in") return Array.isArray(cond.value) && cond.value.includes(depValue);
      return true;
    });
  };

  // Get allowed values for a field, filtered by option-level conditions
  const getFilteredOptions = (fieldName) => {
    const def = _fieldDefs[fieldName];
    if (!def || !def.allowedValues) return null;
    if (!def.optionConditions || def.optionConditions.length === 0) return def.allowedValues;
    // Check each option condition — if its trigger matches, use filtered values
    for (const oc of def.optionConditions) {
      const depValue = formValues[oc.whenField];
      if (oc.operator === "equals" && depValue === oc.whenValue) return oc.filteredValues;
      if (oc.operator === "not_equals" && depValue !== oc.whenValue) return oc.filteredValues;
    }
    return def.allowedValues; // no condition matched, show all
  };

  // Collect all triggered forms across all workflow steps based on current form values
  const triggeredForms = useMemo(() => {
    const triggered = [];
    workflowSteps.forEach(step => {
      (step.formTriggers || []).forEach(ft => {
        const val = formValues[ft.triggerField];
        let isTriggered = false;
        if (ft.operator === "equals") isTriggered = val === ft.triggerValue;
        if (ft.operator === "not_equals") isTriggered = val !== ft.triggerValue;
        if (isTriggered) {
          triggered.push({ ...ft, sourceStep: step.label });
        }
      });
    });
    return triggered;
  }, [formValues, workflowSteps]);

  const sampleVehicles = [
    { vehicle_number: "1", state: "GA", use_class: "Commercial", vehicle_class: "Light Truck", year: "2022", cost_new: "$35,000", gvw_gcw: "10,000", radius: "150", deductible_comp: "$500", deductible_coll: "$500" },
    { vehicle_number: "2", state: "GA", use_class: "Service", vehicle_class: "Medium Truck", year: "2020", cost_new: "$48,000", gvw_gcw: "16,000", radius: "200", deductible_comp: "$1,000", deductible_coll: "$1,000" },
    { vehicle_number: "3", state: "GA", use_class: "Commercial", vehicle_class: "Heavy Truck", year: "2019", cost_new: "$65,000", gvw_gcw: "26,000", radius: "300", deductible_comp: "$500", deductible_coll: "$500" },
  ];

  // Render a single field using field definitions + option-level conditions
  const renderField = (f, step) => {
    const fc = _fieldDefs[f];
    const rField = _raterFields.find(rf => rf.name === f);
    const label = fc?.label || f.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const inputType = fc?.inputType || (rField?.type === "boolean" ? "toggle" : rField?.type === "date" ? "date" : "text");
    const filteredOpts = getFilteredOptions(f);
    const hasOptionFilter = fc?.optionConditions?.length > 0 && filteredOpts && fc.allowedValues && filteredOpts.length < fc.allowedValues.length;

    return (
      <div key={f}>
        <label className="block text-sm font-medium text-gray-900 mb-1.5">{label}</label>
        {inputType === "toggle" ? (
          <div className="flex items-center gap-3">
            <Toggle enabled={formValues[f] || false} onChange={v => setFormValues(p => ({ ...p, [f]: v }))} />
            <span className="text-sm text-gray-600">{formValues[f] ? "Yes" : "No"}</span>
          </div>
        ) : inputType === "dropdown" && filteredOpts ? (
          <div>
            <select
              value={formValues[f] || fc?.defaultValue || ""}
              onChange={e => setFormValues(p => ({ ...p, [f]: e.target.value }))}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white ${hasOptionFilter ? "border-orange-300" : "border-gray-200"}`}
            >
              {filteredOpts.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            {hasOptionFilter && (
              <p className="text-[10px] text-orange-500 mt-1 flex items-center gap-1">
                <Icons.AlertTriangle /> Options filtered: {fc.allowedValues.length - filteredOpts.length} value{fc.allowedValues.length - filteredOpts.length > 1 ? "s" : ""} hidden by condition
              </p>
            )}
          </div>
        ) : inputType === "date" ? (
          <input type="date" defaultValue={formValues[f] || fc?.defaultValue || ""} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg" />
        ) : inputType === "currency" ? (
          <input type="text" defaultValue={formValues[f] || fc?.defaultValue || ""} placeholder="$0" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg" />
        ) : inputType === "number" ? (
          <input type="number" defaultValue={formValues[f] || fc?.defaultValue || ""} placeholder={f} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg" />
        ) : (
          <input type="text" defaultValue={formValues[f] || fc?.defaultValue || ""} placeholder={f} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg" />
        )}
        {fc?.helpText && <p className="text-[10px] text-gray-400 mt-1">{fc.helpText}</p>}
        {rField && <p className="text-[10px] text-gray-400 mt-0.5 font-mono">→ {rField.sheet}!{rField.cell}</p>}
        {fc?.source === "form" && <p className="text-[10px] text-purple-400 mt-0.5">Form field: {fc.formNumber}</p>}
      </div>
    );
  };

  const renderStepContent = () => {
    if (currentStep.isTable) {
      return (
        <div>
          <p className="text-xs text-gray-500 mb-3">Each row maps to the rater workbook range <span className="font-mono">Inputs_Vehicles!C2:S26</span></p>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {currentStep.fields.map(f => {
                    const fc = _fieldDefs[f];
                    return <th key={f} className="text-left py-2 px-2 font-medium text-gray-600">{fc?.label || f.replace(/_/g, " ")}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {sampleVehicles.map((row, ri) => (
                  <tr key={ri} className="border-b border-gray-100">
                    {currentStep.fields.map(f => {
                      const fc = _fieldDefs[f];
                      const opts = getFilteredOptions(f);
                      return (
                        <td key={f} className="py-1.5 px-2">
                          {fc?.inputType === "dropdown" && opts ? (
                            <select defaultValue={row[f]} className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded bg-white">
                              {opts.map(v => <option key={v}>{v}</option>)}
                            </select>
                          ) : (
                            <input type="text" defaultValue={row[f]} className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded bg-white" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="mt-3 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50">+ Add Vehicle</button>
        </div>
      );
    }

    if (currentStep.isForms) {
      return (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Auto-Attached Base Forms</p>
            <div className="space-y-1.5">
              {BASE_FORMS.map(f => (
                <div key={f.formNumber} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Icons.Lock />
                    <span className="text-xs font-medium text-gray-900">{f.formNumber}</span>
                    <span className="text-xs text-gray-500">{f.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Ed. {f.edition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conditionally triggered forms */}
          {triggeredForms.length > 0 && (
            <div>
              <p className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-2 flex items-center gap-1">
                <Icons.Zap /> Triggered by Workflow Selections
              </p>
              <div className="space-y-1.5">
                {triggeredForms.map(ft => (
                  <div key={ft.id} className="flex items-center justify-between px-3 py-2 bg-purple-50 rounded border border-purple-200">
                    <div className="flex items-center gap-2">
                      <Icons.Check />
                      <span className="text-xs font-medium text-gray-900">{ft.formNumber}</span>
                      <span className="text-xs text-gray-500">{ft.formName}</span>
                    </div>
                    <span className="text-[10px] text-purple-500">From: {ft.sourceStep}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Optional Endorsements</p>
            <div className="space-y-1.5">
              {ENDORSEMENTS.filter(e => !triggeredForms.find(ft => ft.formNumber === e.formNumber)).map(e => (
                <div key={e.formNumber} className="flex items-center justify-between px-3 py-2 bg-white rounded border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Toggle enabled={false} onChange={() => {}} />
                    <div>
                      <span className="text-xs font-medium text-gray-900">{e.formNumber}</span>
                      <span className="text-xs text-gray-500 ml-2">{e.name}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400">{e.condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentStep.isSubjectives) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Experience Credit", range: "-15% to +10%", value: "-5%", reason: "3 years loss-free" },
              { label: "Fleet Credit", range: "-10% to +5%", value: "-8%", reason: "20+ vehicles" },
              { label: "Safety Program", range: "-5% to 0%", value: "-3%", reason: "Certified program" },
              { label: "Schedule Rating", range: "-25% to +25%", value: "+2%", reason: "New territory" },
            ].map(item => (
              <div key={item.label} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-900">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.range}</span>
                </div>
                <input type="text" defaultValue={item.value} className="w-full px-2.5 py-2 text-sm border border-gray-200 rounded bg-white mb-1" />
                <p className="text-[10px] text-gray-400">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (currentStep.isReview) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {_raterSchema.outputs.map(o => (
              <div key={o.name} className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded border border-gray-200">
                <span className="text-xs text-gray-600">{o.name.replace(/_/g, " ")}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {o.type === "currency" ? "$" + (Math.floor(Math.random() * 50000) + 5000).toLocaleString() : Math.floor(Math.random() * 10) + 1}
                </span>
              </div>
            ))}
          </div>
          {triggeredForms.length > 0 && (
            <div className="p-3 bg-purple-50 rounded border border-purple-200">
              <p className="text-xs font-medium text-purple-700 mb-1">Forms triggered by this quote:</p>
              <div className="flex flex-wrap gap-1.5">
                {triggeredForms.map(ft => (
                  <span key={ft.id} className="text-[10px] px-1.5 py-0.5 bg-white text-purple-700 rounded border border-purple-200">{ft.formNumber}</span>
                ))}
              </div>
            </div>
          )}
          <div className="p-4 bg-gray-900 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Estimated Premium</span>
              <span className="text-2xl font-bold">$47,832</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Based on 3 vehicles · {formValues.state || "GA"} · {formValues.csl_limit || "$500K"} CSL</p>
          </div>
        </div>
      );
    }

    // Default: field-based step with conditional visibility
    const visibleFields = currentStep.fields.filter(f => isFieldVisible(f, currentStep));
    const hiddenFields = currentStep.fields.filter(f => !isFieldVisible(f, currentStep));

    return (
      <div className="space-y-4">
        {visibleFields.map(f => renderField(f, currentStep))}
        {hiddenFields.length > 0 && (
          <div className="pt-2 border-t border-dashed border-gray-200">
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <Icons.Eye /> {hiddenFields.length} field{hiddenFields.length > 1 ? "s" : ""} hidden by conditions:
              {hiddenFields.map(f => {
                const fc = currentStep.fieldConfigs?.[f];
                return <span key={f} className="font-mono ml-1">{fc?.label || f}</span>;
              })}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="border-gray-300 bg-gray-50/50">
        <div className="flex items-center gap-2 mb-1">
          <Icons.Eye />
          <p className="text-sm font-semibold text-gray-900">Live Workflow Preview</p>
        </div>
        <p className="text-xs text-gray-500">This is what the underwriter will see. Fields, conditions, and form triggers are driven by your Step 4 configuration.</p>
      </Card>

      <div className="flex gap-5">
        {/* Step sidebar */}
        <div className="w-56 flex-shrink-0 space-y-1">
          {enabledSteps.map((step, idx) => {
            const IconComp = Icons[step.icon] || Icons.Settings;
            const isActive = idx === activeStep;
            const isCompleted = completedSteps.has(idx);
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all ${
                  isActive ? "bg-gray-900 text-white" : isCompleted ? "bg-green-50 text-gray-700 border border-green-200" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                  isActive ? "bg-white text-gray-900" : isCompleted ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {isCompleted ? <Icons.Check /> : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isActive ? "text-white" : "text-gray-900"}`}>{step.label}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Step content */}
        <div className="flex-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-base font-semibold text-gray-900">{currentStep.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{currentStep.description}</p>
              </div>
              <span className="text-xs text-gray-400">Step {activeStep + 1} of {enabledSteps.length}</span>
            </div>

            {renderStepContent()}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleBack}
                disabled={activeStep === 0}
                className={`px-4 py-2 text-sm rounded-lg border ${activeStep === 0 ? "text-gray-300 border-gray-200" : "text-gray-700 border-gray-200 hover:bg-gray-50"}`}
              >
                <span className="flex items-center gap-1"><Icons.ArrowLeft /> Back</span>
              </button>
              <button onClick={handleNext} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
                <span className="flex items-center gap-1">
                  {activeStep === enabledSteps.length - 1 ? "Submit Quote" : "Continue"} <Icons.ArrowRight />
                </span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


// ─── Main Unified Product Definition Module ─────────────────────────────────

const DEFINITION_STEPS = [
  { id: "rater", label: "Rater Connection", icon: <Icons.Upload />, description: "Connect your rating workbook or API" },
  { id: "mapping", label: "Schema Mapping", icon: <Icons.Link />, description: "Map rater fields to product inputs" },
  { id: "coverage", label: "Product Configuration", icon: <Icons.Shield />, description: "Configure product options using LOB-specific templates" },
  { id: "workflow", label: "Workflow Builder", icon: <Icons.Layers />, description: "Design the underwriter data entry flow" },
  { id: "preview", label: "Workflow Preview", icon: <Icons.Eye />, description: "Preview the live underwriter experience" },
];

function ProductDefinitionModule() {
  const [activeStep, setActiveStep] = useState("rater");
  const [raterStatus, setRaterStatus] = useState("disconnected"); // disconnected | connected
  const [lobType, setLobType] = useState("habitational_gl"); // commercial_auto | workers_comp | package_bop | habitational_gl

  // Coverage state — LOB-aware
  const buildCoverageState = (lob) => {
    if (lob === "habitational_gl") {
      return Object.fromEntries(GL_COVERAGES.map(c => [c.id, c.required || ["blanket_ai", "blanket_pnc", "med_pay_gl", "habitability", "ab"].includes(c.id)]));
    }
    return Object.fromEntries(COVERAGES.map(c => [c.id, c.required || ["comprehensive", "collision", "um_uim", "med_pay"].includes(c.id)]));
  };
  const [coverageEnabled, setCoverageEnabled] = useState(() => buildCoverageState(lobType));

  // Schema mapping state — LOB-aware
  const buildMappings = (lob) => {
    const fields = getRaterFields(lob);
    const m = {};
    fields.forEach(f => {
      m[f.name] = { status: "auto-mapped", target: f.name };
    });
    // Leave a couple unmapped for demo
    if (lob === "habitational_gl") {
      m["secondary_exposure_units"] = { status: "unmapped", target: "" };
    } else {
      m["gvw_gcw"] = { status: "unmapped", target: "" };
      m["radius"] = { status: "unmapped", target: "" };
    }
    return m;
  };
  const [mappings, setMappings] = useState(() => buildMappings(lobType));

  // Workflow state — adapts to LOB type
  const getWorkflowForLOB = (lob) => {
    switch (lob) {
      case "workers_comp": return WC_WORKFLOW_STEPS;
      case "package_bop": return BOP_WORKFLOW_STEPS;
      case "habitational_gl": return GL_WORKFLOW_STEPS;
      default: return DEFAULT_WORKFLOW_STEPS;
    }
  };
  const [workflowSteps, setWorkflowSteps] = useState(getWorkflowForLOB(lobType));

  const handleLobChange = (newLob) => {
    setLobType(newLob);
    setWorkflowSteps(getWorkflowForLOB(newLob));
    setMappings(buildMappings(newLob));
    setCoverageEnabled(buildCoverageState(newLob));
  };

  const handleConnect = (type) => {
    setRaterStatus("connected");
  };

  const handleUpdateMapping = (fieldName, mapping) => {
    setMappings(prev => ({ ...prev, [fieldName]: mapping }));
  };

  const handleReorderStep = (fromIdx, toIdx) => {
    setWorkflowSteps(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  const handleToggleCoverage = (covId, enabled) => {
    setCoverageEnabled(prev => ({ ...prev, [covId]: enabled }));
  };

  const currentStepIdx = DEFINITION_STEPS.findIndex(s => s.id === activeStep);

  const isStepAccessible = (stepId) => {
    if (stepId === "rater") return true;
    if (raterStatus !== "connected") return false;
    return true; // In production, you'd check prerequisites per step
  };

  return (
    <div className="space-y-5">
      {/* Header + LOB Selector */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Rater Configuration</h2>
          <p className="text-sm text-gray-500">Connect your rater, configure product fields, and build the underwriter workflow.</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 flex-shrink-0">
          {Object.values(LOB_TEMPLATES).map(t => {
            const IconComp = Icons[t.icon] || Icons.Settings;
            const isActive = lobType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleLobChange(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
                title={t.description}
              >
                <IconComp />
                <span className="hidden xl:inline">{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress stepper */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1.5">
        {DEFINITION_STEPS.map((step, idx) => {
          const isActive = step.id === activeStep;
          const isPast = currentStepIdx > idx;
          const accessible = isStepAccessible(step.id);
          return (
            <button
              key={step.id}
              onClick={() => accessible && setActiveStep(step.id)}
              disabled={!accessible}
              className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-md text-left transition-all ${
                isActive
                  ? "bg-gray-900 text-white shadow-sm"
                  : isPast
                    ? "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    : accessible
                      ? "text-gray-500 hover:bg-gray-50"
                      : "text-gray-300 cursor-not-allowed"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                isActive ? "bg-white text-gray-900" : isPast ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
              }`}>
                {isPast ? <Icons.Check /> : idx + 1}
              </div>
              <div className="flex-1 min-w-0 hidden lg:block">
                <p className={`text-xs font-medium truncate ${isActive ? "text-white" : ""}`}>{step.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Step content */}
      {activeStep === "rater" && (
        <RaterConnectionStep raterStatus={raterStatus} onConnect={handleConnect} lobType={lobType} />
      )}

      {activeStep === "mapping" && (
        <SchemaMappingStep mappings={mappings} onUpdateMapping={handleUpdateMapping} lobType={lobType} onUpdateCategory={(fieldName, category) => {
          // In production this would update the field's semantic category in state
        }} />
      )}

      {activeStep === "coverage" && (
        <ProductConfigStep lobType={lobType} coverageEnabled={coverageEnabled} onToggleCoverage={handleToggleCoverage} fieldDefs={getFieldDefs(lobType)} onUpdateFieldDef={(fieldName, updates) => {
          // In production, this would update the field definition in state
        }} />
      )}

      {activeStep === "workflow" && (
        <WorkflowBuilderStep workflowSteps={workflowSteps} onReorderStep={handleReorderStep} fieldDefs={getFieldDefs(lobType)} fieldSuperset={getFieldSuperset(lobType)} raterFields={getRaterFields(lobType)} onUpdateStep={(stepId, updates) => {
          setWorkflowSteps(prev => prev.map(s => s.id === stepId ? { ...s, ...updates } : s));
        }} />
      )}

      {activeStep === "preview" && (
        <WorkflowPreviewStep workflowSteps={workflowSteps} coverageEnabled={coverageEnabled} fieldDefs={getFieldDefs(lobType)} raterFields={getRaterFields(lobType)} lobType={lobType} />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => {
            const prevIdx = currentStepIdx - 1;
            if (prevIdx >= 0) setActiveStep(DEFINITION_STEPS[prevIdx].id);
          }}
          disabled={currentStepIdx === 0}
          className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
            currentStepIdx === 0 ? "text-gray-300 border-gray-200" : "text-gray-700 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <span className="flex items-center gap-1"><Icons.ArrowLeft /> Previous Step</span>
        </button>
        <button
          onClick={() => {
            const nextIdx = currentStepIdx + 1;
            if (nextIdx < DEFINITION_STEPS.length) setActiveStep(DEFINITION_STEPS[nextIdx].id);
          }}
          disabled={currentStepIdx === DEFINITION_STEPS.length - 1 || !isStepAccessible(DEFINITION_STEPS[Math.min(currentStepIdx + 1, DEFINITION_STEPS.length - 1)]?.id)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentStepIdx === DEFINITION_STEPS.length - 1
              ? "text-gray-300 bg-gray-100"
              : "text-white bg-gray-900 hover:bg-gray-800"
          }`}
        >
          <span className="flex items-center gap-1">Next Step <Icons.ArrowRight /></span>
        </button>
      </div>
    </div>
  );
}

// ─── Revised Tab Order ──────────────────────────────────────────────────────

// V1 sidebar: single combined module (current state)
const MODULES_V1 = [
  { id: "overview", label: "Overview", icon: <Icons.Home /> },
  { id: "eligibility", label: "Eligibility Rules", icon: <Icons.Shield /> },
  { id: "forms", label: "Policy Forms", icon: <Icons.FileText /> },
  { id: "product-definition", label: "Rater Configuration", icon: <Icons.Layers /> },
  { id: "lifecycle", label: "Policy Life Cycle", icon: <Icons.Clock /> },
  { id: "layouts", label: "Layouts", icon: <Icons.Layout /> },
  { id: "versions", label: "Versions", icon: <Icons.GitBranch /> },
];

// V2 sidebar: split into Rater Config (FDE) + Product Definition (PM)
const MODULES_V2_SPLIT = [
  { id: "overview", label: "Overview", icon: <Icons.Home /> },
  { id: "eligibility", label: "Eligibility Rules", icon: <Icons.Shield /> },
  { id: "forms", label: "Policy Forms", icon: <Icons.FileText /> },
  { id: "rater-config", label: "Rater Configuration", icon: <Icons.Database />, persona: "fde" },
  { id: "product-def-v2", label: "Product Definition", icon: <Icons.Briefcase />, persona: "pm" },
  { id: "lifecycle", label: "Policy Life Cycle", icon: <Icons.Clock /> },
  { id: "layouts", label: "Layouts", icon: <Icons.Layout /> },
  { id: "versions", label: "Versions", icon: <Icons.GitBranch /> },
];

// ─── V2 Split: Rater Config Module (FDE persona) ────────────────────────────

const RATER_CONFIG_STEPS = [
  { id: "rater", label: "Rater Connection", icon: <Icons.Upload />, description: "Connect your rating workbook or API" },
  { id: "graph", label: "Data Graph", icon: <Icons.Database />, description: "Dependency graph — field mappings, data sources, and transformation edges" },
];

function RaterConfigModuleSplit() {
  const [activeStep, setActiveStep] = useState("rater");
  const [raterStatus, setRaterStatus] = useState("disconnected");
  const lobType = "habitational_gl"; // In production, this would come from app state

  const [mappings, setMappings] = useState(() => {
    const fields = getRaterFields(lobType);
    const m = {};
    fields.forEach(f => { m[f.name] = { status: "auto-mapped", target: f.name }; });
    if (lobType === "habitational_gl") {
      m["secondary_exposure_units"] = { status: "unmapped", target: "" };
    } else {
      m["gvw_gcw"] = { status: "unmapped", target: "" };
      m["radius"] = { status: "unmapped", target: "" };
    }
    return m;
  });

  const handleConnect = () => setRaterStatus("connected");
  const handleUpdateMapping = (fieldName, mapping) => setMappings(prev => ({ ...prev, [fieldName]: mapping }));

  const currentStepIdx = RATER_CONFIG_STEPS.findIndex(s => s.id === activeStep);
  const isStepAccessible = (stepId) => {
    if (stepId === "rater") return true;
    return raterStatus === "connected";
  };

  // Data Sources section showing the graph concept
  const renderDataSourcesStep = () => {
    const sourceGroups = [
      { type: "rater", label: "Connected Rater", color: "blue", count: getRaterFields(lobType).length, desc: "Fields extracted from the connected rating workbook" },
      { type: "database", label: "Database / Schema Sense", color: "purple", count: 3, desc: "Fields auto-matched from existing platform schema" },
      { type: "api", label: "External APIs", color: "amber", count: 1, desc: "Fields derived from third-party API integrations" },
      { type: "submission", label: "Submission Intake", color: "teal", count: 2, desc: "Fields captured from submission email or ACORD forms" },
      { type: "form", label: "Form Templates", color: "pink", count: FORM_TEMPLATE_FIELDS.length, desc: "Fields required by attached form templates" },
    ];

    // Example dependency chains
    const chains = [
      { input: "address", via: "ISO Crime API", output: "iso_crime_score", raterInput: true },
      { input: "zip_code", via: "Territory Lookup", output: "territory_code", raterInput: true },
      { input: "hired_selected", via: "Form Trigger", output: "additional_insured_name", raterInput: false },
    ];

    return (
      <div className="space-y-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Data Source Configuration</h3>
          <p className="text-xs text-gray-500">Configure where each field originates and how dependency chains resolve to rater inputs. This is the technical wiring — PMs consume the resolved fields in Product Definition.</p>
        </div>

        {/* Source type summary */}
        <div className="grid grid-cols-5 gap-3">
          {sourceGroups.map(sg => (
            <div key={sg.type} className={`p-3 rounded-lg border border-${sg.color}-200 bg-${sg.color}-50`}>
              <div className={`text-lg font-bold text-${sg.color}-700`}>{sg.count}</div>
              <div className={`text-xs font-medium text-${sg.color}-700`}>{sg.label}</div>
              <div className="text-[10px] text-gray-500 mt-1">{sg.desc}</div>
            </div>
          ))}
        </div>

        {/* Dependency chain visualization */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-500"><Icons.Link /></span>
            <h4 className="text-sm font-semibold text-gray-900">Dependency Chains</h4>
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Graph Preview</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">Each chain shows how an upstream input resolves through transformations to produce a value the rater or workflow needs.</p>

          <div className="space-y-3">
            {chains.map((chain, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 bg-gray-50">
                {/* Input node */}
                <div className="px-3 py-1.5 rounded-md bg-green-50 border border-green-200 text-xs font-medium text-green-700 flex-shrink-0">
                  <div className="text-[9px] text-green-500 font-normal">User Input</div>
                  {chain.input}
                </div>

                {/* Arrow */}
                <div className="flex items-center text-gray-300">
                  <div className="w-6 h-px bg-gray-300" />
                  <Icons.ArrowRight />
                </div>

                {/* Transformation */}
                <div className="px-3 py-1.5 rounded-md bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700 flex-shrink-0">
                  <div className="text-[9px] text-amber-500 font-normal">Transformation</div>
                  {chain.via}
                </div>

                {/* Arrow */}
                <div className="flex items-center text-gray-300">
                  <div className="w-6 h-px bg-gray-300" />
                  <Icons.ArrowRight />
                </div>

                {/* Output node */}
                <div className={`px-3 py-1.5 rounded-md border text-xs font-medium flex-shrink-0 ${
                  chain.raterInput
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-pink-50 border-pink-200 text-pink-700"
                }`}>
                  <div className={`text-[9px] font-normal ${chain.raterInput ? "text-blue-500" : "text-pink-500"}`}>
                    {chain.raterInput ? "→ Rater Input" : "→ Form Field"}
                  </div>
                  {chain.output}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-indigo-50 border border-indigo-200">
            <p className="text-xs text-indigo-700">
              <span className="font-semibold">Graph model:</span> Each node is a field in the database. Each edge is a transformation (API call, lookup, schema sense mapping). The PM in Product Definition consumes the resolved output fields — they don't configure these chains.
            </p>
          </div>
        </Card>

        {/* Published fields summary */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-500"><Icons.Layers /></span>
              <h4 className="text-sm font-semibold text-gray-900">Published Field Inventory</h4>
            </div>
            <span className="text-xs text-gray-400">{getFieldSuperset(lobType).length} fields available to Product Definition</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">These fields are published to the Product Definition module. The PM uses them as building blocks for coverages, conditions, and workflow steps.</p>

          <div className="flex flex-wrap gap-1.5">
            {getFieldSuperset(lobType).slice(0, 20).map((f, i) => {
              const srcColor = FIELD_SOURCE_COLORS[f.source] || FIELD_SOURCE_COLORS["rater"];
              return (
                <span key={i} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium ${srcColor.bg} ${srcColor.text} border ${srcColor.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${srcColor.dot}`} />
                  {f.name}
                </span>
              );
            })}
            {getFieldSuperset(lobType).length > 20 && (
              <span className="inline-flex items-center px-2 py-1 rounded text-[11px] text-gray-400 bg-gray-100">
                +{getFieldSuperset(lobType).length - 20} more
              </span>
            )}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-gray-900">Rater Configuration</h2>
            <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">FDE / Technical</span>
          </div>
          <p className="text-sm text-gray-500">Technical wiring — connect the rater, map schemas, and configure data source dependency chains.</p>
        </div>
      </div>

      {/* Progress stepper */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1.5">
        {RATER_CONFIG_STEPS.map((step, idx) => {
          const isActive = step.id === activeStep;
          const isPast = currentStepIdx > idx;
          const accessible = isStepAccessible(step.id);
          return (
            <button
              key={step.id}
              onClick={() => accessible && setActiveStep(step.id)}
              disabled={!accessible}
              className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-md text-left transition-all ${
                isActive ? "bg-blue-600 text-white shadow-sm"
                  : isPast ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                    : accessible ? "text-gray-500 hover:bg-gray-50" : "text-gray-300 cursor-not-allowed"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                isActive ? "bg-white text-blue-600" : isPast ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-500"
              }`}>
                {isPast ? <Icons.Check /> : idx + 1}
              </div>
              <div className="flex-1 min-w-0 hidden lg:block">
                <p className={`text-xs font-medium truncate ${isActive ? "text-white" : ""}`}>{step.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Step content */}
      {activeStep === "rater" && <RaterConnectionStep raterStatus={raterStatus} onConnect={handleConnect} lobType={lobType} />}
      {activeStep === "graph" && <DataGraphStep mappings={mappings} onUpdateMapping={handleUpdateMapping} lobType={lobType} />}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => { const prev = currentStepIdx - 1; if (prev >= 0) setActiveStep(RATER_CONFIG_STEPS[prev].id); }}
          disabled={currentStepIdx === 0}
          className={`px-4 py-2 text-sm rounded-lg border transition-colors ${currentStepIdx === 0 ? "text-gray-300 border-gray-200" : "text-gray-700 border-gray-200 hover:bg-gray-50"}`}
        >
          <span className="flex items-center gap-1"><Icons.ArrowLeft /> Previous</span>
        </button>
        <button
          onClick={() => { const next = currentStepIdx + 1; if (next < RATER_CONFIG_STEPS.length) setActiveStep(RATER_CONFIG_STEPS[next].id); }}
          disabled={currentStepIdx === RATER_CONFIG_STEPS.length - 1 || !isStepAccessible(RATER_CONFIG_STEPS[Math.min(currentStepIdx + 1, RATER_CONFIG_STEPS.length - 1)]?.id)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentStepIdx === RATER_CONFIG_STEPS.length - 1 ? "text-gray-300 bg-gray-100" : "text-white bg-blue-600 hover:bg-blue-700"}`}
        >
          <span className="flex items-center gap-1">Next <Icons.ArrowRight /></span>
        </button>
      </div>
    </div>
  );
}

// ─── V2 Split: Product Definition Module (PM persona) ───────────────────────

const PRODUCT_DEF_STEPS = [
  { id: "coverage", label: "Coverages & Rating", icon: <Icons.Shield />, description: "Coverages, limits, risk factors, industry classes" },
  { id: "forms", label: "Forms & Documents", icon: <Icons.FileText />, description: "Form library, attachment rules, merge field mapping" },
  { id: "workflow", label: "UW Workflow", icon: <Icons.Layout />, description: "Generated sequential flow — review and adjust" },
  { id: "preview", label: "Preview", icon: <Icons.Eye />, description: "Live underwriter experience preview" },
];

function ProductDefinitionModuleSplit() {
  const [activeStep, setActiveStep] = useState("coverage");
  const [lobType, setLobType] = useState("habitational_gl");

  const buildCoverageStateSplit = (lob) => {
    if (lob === "habitational_gl") {
      return Object.fromEntries(GL_COVERAGES.map(c => [c.id, c.required || ["blanket_ai", "blanket_pnc", "med_pay_gl", "habitability", "ab"].includes(c.id)]));
    }
    return Object.fromEntries(COVERAGES.map(c => [c.id, c.required || ["comprehensive", "collision", "um_uim", "med_pay"].includes(c.id)]));
  };
  const [coverageEnabled, setCoverageEnabled] = useState(() => buildCoverageStateSplit(lobType));

  const getWorkflowForLOB = (lob) => {
    switch (lob) {
      case "workers_comp": return WC_WORKFLOW_STEPS;
      case "package_bop": return BOP_WORKFLOW_STEPS;
      case "habitational_gl": return GL_WORKFLOW_STEPS;
      default: return DEFAULT_WORKFLOW_STEPS;
    }
  };
  const [workflowSteps, setWorkflowSteps] = useState(getWorkflowForLOB(lobType));

  const handleLobChange = (newLob) => {
    setLobType(newLob);
    setWorkflowSteps(getWorkflowForLOB(newLob));
    setCoverageEnabled(buildCoverageStateSplit(newLob));
  };

  const handleToggleCoverage = (covId, enabled) => {
    const newCovState = { ...coverageEnabled, [covId]: enabled };
    setCoverageEnabled(newCovState);
    // Live regeneration: update the coverages step fields based on enabled coverages
    if (lobType === "habitational_gl") {
      const covFieldMap = {
        blanket_ai: "blanket_ai", blanket_pnc: "blanket_pnc", ebl: "ebl_limit", rroa: "rroa",
        med_pay_gl: "med_pay_limit", habitability: "habitability_limit", ab: "ab_limit",
        sam_exclusion: "exclude_sam", firearms_exclusion: "exclude_firearms", hnoa: "hnoa", stop_gap_el: "stop_gap_el",
      };
      const alwaysFields = ["effective_policy_aggregate", "per_location_aggregate", "occurrence_limit", "deductible"];
      const enabledCovFields = Object.entries(newCovState)
        .filter(([k, v]) => v && covFieldMap[k])
        .map(([k]) => covFieldMap[k]);
      setWorkflowSteps(prev => prev.map(s =>
        s.id === "coverages" ? { ...s, fields: [...alwaysFields, ...enabledCovFields] } : s
      ));
    }
  };

  const handleReorderStep = (fromIdx, toIdx) => {
    setWorkflowSteps(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  const currentStepIdx = PRODUCT_DEF_STEPS.findIndex(s => s.id === activeStep);

  return (
    <div className="space-y-5">
      {/* Header + LOB Selector */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-gray-900">Product Definition</h2>
            <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Product Manager</span>
          </div>
          <p className="text-sm text-gray-500">Business logic — what the product offers and how underwriters interact with it. Fields are sourced from Rater Configuration.</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 flex-shrink-0">
          {Object.values(LOB_TEMPLATES).map(t => {
            const IconComp = Icons[t.icon] || Icons.Settings;
            const isActive = lobType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleLobChange(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
                title={t.description}
              >
                <IconComp />
                <span className="hidden xl:inline">{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Source status banner */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue-50 border border-blue-200">
        <span className="text-blue-500"><Icons.Database /></span>
        <div className="flex-1">
          <span className="text-xs font-medium text-blue-700">Fields sourced from Rater Configuration</span>
          <span className="text-xs text-blue-500 ml-2">{getFieldSuperset(lobType).length} fields available · Dependency chains resolved</span>
        </div>
        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">FDE Configured ✓</span>
      </div>

      {/* Progress stepper */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1.5">
        {PRODUCT_DEF_STEPS.map((step, idx) => {
          const isActive = step.id === activeStep;
          const isPast = currentStepIdx > idx;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-md text-left transition-all ${
                isActive ? "bg-green-700 text-white shadow-sm"
                  : isPast ? "bg-green-50 text-green-700 hover:bg-green-100"
                    : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                isActive ? "bg-white text-green-700" : isPast ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
              }`}>
                {isPast ? <Icons.Check /> : idx + 1}
              </div>
              <div className="flex-1 min-w-0 hidden lg:block">
                <p className={`text-xs font-medium truncate ${isActive ? "text-white" : ""}`}>{step.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Step content */}
      {activeStep === "coverage" && (
        <ProductConfigStep lobType={lobType} coverageEnabled={coverageEnabled} onToggleCoverage={handleToggleCoverage} fieldDefs={getFieldDefs(lobType)} onUpdateFieldDef={() => {}} workflowSteps={workflowSteps} />
      )}
      {activeStep === "forms" && (
        <FormsDocumentsStep lobType={lobType} coverageEnabled={coverageEnabled} />
      )}
      {activeStep === "workflow" && (
        <WorkflowBuilderStep workflowSteps={workflowSteps} onReorderStep={handleReorderStep} fieldDefs={getFieldDefs(lobType)} fieldSuperset={getFieldSuperset(lobType)} raterFields={getRaterFields(lobType)} onUpdateStep={(stepId, updates) => {
          setWorkflowSteps(prev => prev.map(s => s.id === stepId ? { ...s, ...updates } : s));
        }} />
      )}
      {activeStep === "preview" && (
        <WorkflowPreviewStep workflowSteps={workflowSteps} coverageEnabled={coverageEnabled} fieldDefs={getFieldDefs(lobType)} raterFields={getRaterFields(lobType)} lobType={lobType} />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => { const prev = currentStepIdx - 1; if (prev >= 0) setActiveStep(PRODUCT_DEF_STEPS[prev].id); }}
          disabled={currentStepIdx === 0}
          className={`px-4 py-2 text-sm rounded-lg border transition-colors ${currentStepIdx === 0 ? "text-gray-300 border-gray-200" : "text-gray-700 border-gray-200 hover:bg-gray-50"}`}
        >
          <span className="flex items-center gap-1"><Icons.ArrowLeft /> Previous</span>
        </button>
        <button
          onClick={() => { const next = currentStepIdx + 1; if (next < PRODUCT_DEF_STEPS.length) setActiveStep(PRODUCT_DEF_STEPS[next].id); }}
          disabled={currentStepIdx === PRODUCT_DEF_STEPS.length - 1}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentStepIdx === PRODUCT_DEF_STEPS.length - 1 ? "text-gray-300 bg-gray-100" : "text-white bg-green-700 hover:bg-green-800"}`}
        >
          <span className="flex items-center gap-1">Next <Icons.ArrowRight /></span>
        </button>
      </div>
    </div>
  );
}

// ─── Placeholder modules (simplified) ───────────────────────────────────────

function OverviewPlaceholder() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Product Overview</h2>
        <p className="text-sm text-gray-500">High-level summary of the Habitational GL product configuration.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <p className="text-xs text-gray-500 mb-1">Rater Status</p>
          <p className="text-sm font-semibold text-green-700">Connected</p>
          <p className="text-xs text-gray-400 mt-0.5">sample-workbook.xlsx</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 mb-1">Coverages</p>
          <p className="text-sm font-semibold text-gray-900">6 of 8 Enabled</p>
          <p className="text-xs text-gray-400 mt-0.5">Including required Liability</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 mb-1">Workflow Steps</p>
          <p className="text-sm font-semibold text-gray-900">6 Steps</p>
          <p className="text-xs text-gray-400 mt-0.5">Sequential UW flow configured</p>
        </Card>
      </div>
      <Card>
        <p className="text-sm font-semibold text-gray-900 mb-3">Configuration Progress</p>
        <div className="space-y-2">
          {[
            { label: "Rater Connection", status: "complete" },
            { label: "Schema Mapping", status: "in-progress", detail: "17 of 19 fields mapped" },
            { label: "Coverage Config", status: "complete" },
            { label: "Workflow Builder", status: "complete" },
            { label: "Eligibility Rules", status: "not-started" },
            { label: "Policy Forms", status: "not-started" },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between px-3 py-2 rounded border border-gray-200">
              <div className="flex items-center gap-2">
                {item.status === "complete" ? (
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-700"><Icons.Check /></div>
                ) : item.status === "in-progress" ? (
                  <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-100" />
                )}
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              {item.detail && <span className="text-xs text-gray-400">{item.detail}</span>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function PlaceholderModule({ title, description }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Card className="text-center py-12">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 text-gray-400">
          <Icons.Settings />
        </div>
        <p className="text-sm text-gray-500">This module is configured in the original prototype.</p>
        <p className="text-xs text-gray-400 mt-1">Switch to ProductStudio.jsx for the full experience.</p>
      </Card>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────

export default function App() {
  const [paradigm, setParadigm] = useState("v1"); // v1 = current combined | v2 = proposed split
  const [activeModule, setActiveModule] = useState("product-definition");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const product = {
    name: "Habitational GL",
    status: "Draft",
    version: "v0.3",
    lobName: "General Liability",
  };

  // When switching paradigms, reset to the default module for that paradigm
  const handleParadigmSwitch = (newParadigm) => {
    setParadigm(newParadigm);
    if (newParadigm === "v1") {
      setActiveModule("product-definition");
    } else {
      setActiveModule("rater-config");
    }
  };

  const currentModules = paradigm === "v1" ? MODULES_V1 : MODULES_V2_SPLIT;
  const activeModuleLabel = currentModules.find(m => m.id === activeModule)?.label || "";

  const renderModule = () => {
    // Shared modules (same in both paradigms)
    switch (activeModule) {
      case "overview": return <OverviewPlaceholder />;
      case "eligibility": return <PlaceholderModule title="Eligibility Rules" description="Define who qualifies for this product — risk appetite, class restrictions, and territory rules." />;
      case "forms": return <PlaceholderModule title="Policy Forms" description="Attach base forms, conditional endorsements, and manage form template fields." />;
      case "lifecycle": return <PlaceholderModule title="Policy Life Cycle" description="Configure new business, renewal, endorsement, cancellation, and audit workflows." />;
      case "layouts": return <PlaceholderModule title="Layouts" description="Design the visual layout of policy documents, dec pages, and quote summaries." />;
      case "versions": return <PlaceholderModule title="Versions" description="Track published and draft versions of each component." />;
      default: break;
    }

    // V1: single combined module
    if (paradigm === "v1" && activeModule === "product-definition") {
      return <ProductDefinitionModule />;
    }

    // V2: split modules
    if (paradigm === "v2") {
      if (activeModule === "rater-config") return <RaterConfigModuleSplit />;
      if (activeModule === "product-def-v2") return <ProductDefinitionModuleSplit />;
    }

    return null;
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Sidebar */}
      <div className={`flex flex-col bg-white border-r border-gray-200 ${sidebarExpanded ? "w-56" : "w-14"} transition-all duration-200`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
          <span className="text-gray-700"><Icons.Package /></span>
          {sidebarExpanded && <span className="text-sm font-semibold text-gray-900 tracking-tight">Product Studio</span>}
        </div>

        {/* Paradigm toggle */}
        {sidebarExpanded && (
          <div className="px-3 pt-3 pb-1">
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => handleParadigmSwitch("v1")}
                className={`flex-1 text-[11px] font-medium py-1.5 px-2 rounded-md transition-all ${
                  paradigm === "v1"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                v1 Combined
              </button>
              <button
                onClick={() => handleParadigmSwitch("v2")}
                className={`flex-1 text-[11px] font-medium py-1.5 px-2 rounded-md transition-all ${
                  paradigm === "v2"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                v2 Split
              </button>
            </div>
          </div>
        )}

        {/* Product context */}
        {sidebarExpanded && (
          <div className="px-3 py-3 border-b border-gray-100 space-y-2">
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
              <Icons.ArrowLeft /> All Products
            </button>
            <div className="px-2.5 py-2 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-700 truncate">{product.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={product.status} />
                <span className="text-[11px] text-gray-400 font-mono">{product.version}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-2 px-2">
          {currentModules.map(m => {
            const isActive = activeModule === m.id;
            // Persona color accents for v2 split
            const personaAccent = paradigm === "v2" && m.persona === "fde"
              ? { active: "bg-blue-50 text-blue-900", icon: "text-blue-500", dot: "bg-blue-500" }
              : paradigm === "v2" && m.persona === "pm"
                ? { active: "bg-green-50 text-green-900", icon: "text-green-500", dot: "bg-green-500" }
                : { active: "bg-gray-100 text-gray-900", icon: "text-gray-700", dot: null };

            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-sm mb-0.5 transition-colors ${
                  isActive
                    ? `${personaAccent.active} font-medium`
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className={isActive ? personaAccent.icon : "text-gray-400"}>{m.icon}</span>
                {sidebarExpanded && (
                  <span className="flex-1 text-left flex items-center gap-1.5">
                    {m.label}
                    {paradigm === "v2" && m.persona && (
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.persona === "fde" ? "bg-blue-400" : "bg-green-400"}`} />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarExpanded && (
          <div className="px-3 py-3 border-t border-gray-100">
            <div className="text-xs text-gray-400">
              <p className="text-gray-500 font-medium">{product.lobName}</p>
              <p className="mt-0.5">{product.version} · {product.status}</p>
              <p className="mt-0.5">Last saved 2 min ago</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Products</span>
            <Icons.ChevronRight />
            <span className="text-gray-600">{product.name}</span>
            {activeModule !== "overview" && (
              <>
                <Icons.ChevronRight />
                <span className="text-gray-900 font-medium">{activeModuleLabel}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Paradigm indicator in top bar */}
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
              paradigm === "v1"
                ? "bg-gray-100 text-gray-500"
                : "bg-gradient-to-r from-blue-100 to-green-100 text-gray-700"
            }`}>
              {paradigm === "v1" ? "v1 · Combined Flow" : "v2 · FDE / PM Split"}
            </span>
            <button className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50">Save Draft</button>
            <button className="px-3 py-1.5 text-xs text-white bg-gray-900 rounded hover:bg-gray-800">Publish</button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-6">
          {renderModule()}
        </div>
      </div>
    </div>
  );
}
