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
  Globe: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Grip: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>,
  Link: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Zap: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Package: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Eye: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  TrendingUp: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Map: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  ArrowLeft: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Copy: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Briefcase: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Layers: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Truck: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Umbrella: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"/></svg>,
  Archive: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>,
  MoreVertical: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>,
  Folder: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  GitBranch: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>,
  Lock: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Unlock: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>,
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

const USE_CLASS_FACTORS = [
  { use: "Service", factor: 0.95 },
  { use: "Retail", factor: 1.05 },
  { use: "Commercial", factor: 1.00 },
];

const INITIAL_STATE_FACTORS = {
  GA: { liability: 1.05, physical_damage: 1.04, med_pay: 1.01 },
  FL: { liability: 1.15, physical_damage: 1.12, med_pay: 1.05 },
  SC: { liability: 1.00, physical_damage: 1.00, med_pay: 1.00 },
  NC: { liability: 1.08, physical_damage: 1.06, med_pay: 1.02 },
  AL: { liability: 1.10, physical_damage: 1.07, med_pay: 1.03 },
  TN: { liability: 1.03, physical_damage: 1.02, med_pay: 1.00 },
};

const LIMIT_MULTIPLIERS = [
  { csl_limit: 300000, multiplier: 1.00 },
  { csl_limit: 500000, multiplier: 1.18 },
  { csl_limit: 1000000, multiplier: 1.45 },
];

const DEDUCTIBLE_CREDITS = [
  { deductible: 250, credit: 0.92 },
  { deductible: 500, credit: 1.00 },
  { deductible: 1000, credit: 1.06 },
  { deductible: 2500, credit: 1.15 },
];

const ELIGIBILITY_RULES = [
  { id: "fleet-size", name: "Fleet Size", condition: "1–100 vehicles", outcome: "accept", failOutcome: "refer" },
  { id: "gvw-limit", name: "Gross Vehicle Weight", condition: "≤ 45,000 lbs", outcome: "accept", failOutcome: "decline" },
  { id: "driver-age", name: "Driver Age", condition: "21–70 years", outcome: "accept", failOutcome: "refer" },
  { id: "years-business", name: "Years in Business", condition: "≥ 2 years", outcome: "accept", failOutcome: "refer" },
  { id: "radius", name: "Operating Radius", condition: "≤ 500 miles", outcome: "accept", failOutcome: "decline" },
  { id: "loss-ratio", name: "Loss Ratio", condition: "< 65%", outcome: "accept", failOutcome: "refer" },
];

const CLASS_RESTRICTIONS = [
  { class: "Long Haul Trucking", status: "excluded", reason: "Outside eligibility" },
  { class: "Hazmat Transport", status: "excluded", reason: "Excluded class" },
  { class: "Sand & Gravel", status: "refer", reason: "High loss frequency" },
  { class: "Auto Hauler", status: "refer", reason: "Specialized risk" },
  { class: "Logging", status: "excluded", reason: "Excluded class" },
];

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

const INPUT_MAPPINGS = [
  { field: "state", cell: "Inputs_Policy!B6", type: "string" },
  { field: "effective_date", cell: "Inputs_Policy!B8", type: "date" },
  { field: "is_fleet", cell: "Inputs_Policy!B10", type: "boolean" },
  { field: "csl_limit", cell: "Inputs_Policy!B13", type: "number" },
  { field: "um_uim_selected", cell: "Inputs_Policy!B14", type: "boolean" },
  { field: "med_pay_selected", cell: "Inputs_Policy!B16", type: "boolean" },
  { field: "med_pay_limit", cell: "Inputs_Policy!B18", type: "number" },
  { field: "hired_selected", cell: "Inputs_Policy!B19", type: "boolean" },
  { field: "non_owned_selected", cell: "Inputs_Policy!B20", type: "boolean" },
];

const OUTPUT_MAPPINGS = [
  { field: "total_vehicles", cell: "Calculator!AR2", type: "number" },
  { field: "total_liability_premium", cell: "Calculator!AR3", type: "currency" },
  { field: "total_comp_premium", cell: "Calculator!AR4", type: "currency" },
  { field: "total_collision_premium", cell: "Calculator!AR6", type: "currency" },
  { field: "total_um_uim_premium", cell: "Calculator!AR8", type: "currency" },
  { field: "total_med_pay_premium", cell: "Calculator!AR9", type: "currency" },
  { field: "total_premium", cell: "Calculator!AR12", type: "currency" },
];

const VEHICLE_INPUT_MAPPINGS = [
  { field: "vehicle_number", column: "C", type: "number" },
  { field: "state", column: "D", type: "string" },
  { field: "use_class", column: "E", type: "string" },
  { field: "vehicle_class", column: "F", type: "string" },
  { field: "year", column: "G", type: "number" },
  { field: "cost_new", column: "H", type: "currency" },
  { field: "gvw_gcw", column: "L", type: "number" },
  { field: "radius", column: "M", type: "number" },
  { field: "deductible_comp", column: "N", type: "currency" },
  { field: "deductible_coll", column: "O", type: "currency" },
];

const LAYOUT_SECTIONS = [
  { id: "insured_info", title: "Insured Information", fieldCount: 6, visible: true },
  { id: "coverage_selection", title: "Coverage Selection", fieldCount: 3, visible: true },
  { id: "vehicle_summary", title: "Vehicle Summary", fieldCount: 10, visible: true },
  { id: "driver_summary", title: "Driver Summary", fieldCount: 8, visible: true },
  { id: "premium_summary", title: "Premium", fieldCount: 5, visible: true },
  { id: "loss_history", title: "Loss History", fieldCount: 4, visible: false },
];

// ─── Lines of Business & Products ───────────────────────────────────────────
const LINES_OF_BUSINESS = [
  {
    id: "commercial-auto", name: "Commercial Auto", icon: "Truck", category: "Auto",
    description: "Covers liability and physical damage for vehicles used in business operations including trucks, vans, and fleets.",
    defaultCoverages: 8, defaultForms: 6, defaultRatingFactors: 14, defaultLifecycleStages: 8,
    includedCoverages: ["Liability", "Comprehensive", "Collision", "UM/UIM", "Med Pay", "Hired Auto", "Non-Owned", "Towing & Labor"],
    isStandard: true,
  },
  {
    id: "general-liability", name: "General Liability", icon: "Shield", category: "Liability",
    description: "Protects businesses against third-party claims of bodily injury, property damage, and personal/advertising injury.",
    defaultCoverages: 5, defaultForms: 8, defaultRatingFactors: 10, defaultLifecycleStages: 7,
    includedCoverages: ["Premises/Operations", "Products/Completed Ops", "Personal & Advertising Injury", "Medical Payments", "Damage to Rented Premises"],
    isStandard: true,
  },
  {
    id: "workers-comp", name: "Workers' Compensation", icon: "Shield", category: "Liability",
    description: "Provides benefits to employees for work-related injuries and illnesses, covering medical expenses and lost wages.",
    defaultCoverages: 4, defaultForms: 7, defaultRatingFactors: 12, defaultLifecycleStages: 8,
    includedCoverages: ["Part One — WC Benefits", "Part Two — Employers Liability", "Other States Coverage", "Voluntary Comp"],
    isStandard: true,
  },
  {
    id: "commercial-property", name: "Commercial Property", icon: "Briefcase", category: "Property",
    description: "Covers buildings, equipment, inventory, and business personal property against fire, theft, and other covered perils.",
    defaultCoverages: 6, defaultForms: 9, defaultRatingFactors: 16, defaultLifecycleStages: 7,
    includedCoverages: ["Building", "BPP", "Business Income", "Extra Expense", "Inland Marine Extensions", "Equipment Breakdown"],
    isStandard: true,
  },
  {
    id: "commercial-umbrella", name: "Commercial Umbrella", icon: "Umbrella", category: "Liability",
    description: "Provides excess liability coverage above underlying commercial auto, general liability, and employers liability policies.",
    defaultCoverages: 3, defaultForms: 4, defaultRatingFactors: 8, defaultLifecycleStages: 6,
    includedCoverages: ["Following Form Excess", "Drop-Down Coverage", "Defense Costs"],
    isStandard: true,
  },
  {
    id: "bop", name: "Business Owners Policy", icon: "Briefcase", category: "Package",
    description: "Combines property and liability coverage into a single policy for small to mid-size businesses with simplified rating.",
    defaultCoverages: 10, defaultForms: 12, defaultRatingFactors: 9, defaultLifecycleStages: 7,
    includedCoverages: ["Building", "BPP", "Business Income", "Liability", "Medical Payments", "Employee Dishonesty", "Mechanical Breakdown", "Outdoor Signs", "Valuable Papers", "Data Processing"],
    isStandard: true,
  },
  {
    id: "inland-marine", name: "Inland Marine", icon: "Truck", category: "Property",
    description: "Covers property in transit, mobile equipment, and specialized assets that are not adequately covered under standard property forms.",
    defaultCoverages: 5, defaultForms: 6, defaultRatingFactors: 11, defaultLifecycleStages: 6,
    includedCoverages: ["Contractors Equipment", "Builders Risk", "Motor Truck Cargo", "Installation Floater", "Transit Coverage"],
    isStandard: true,
  },
  {
    id: "professional-liability", name: "Professional Liability", icon: "FileText", category: "Specialty",
    description: "Provides errors & omissions coverage for professionals against claims arising from negligent acts, errors, or omissions in services.",
    defaultCoverages: 3, defaultForms: 5, defaultRatingFactors: 8, defaultLifecycleStages: 6,
    includedCoverages: ["E&O — Claims Made", "Defense & Settlement", "Extended Reporting Period"],
    isStandard: true,
  },
];

const PRODUCTS = [
  {
    id: "comm-auto-southeast", name: "Commercial Auto — Southeast", lobId: "commercial-auto",
    status: "Published", version: "v3.1", states: ["GA", "FL", "SC", "NC", "AL", "TN"],
    lastModified: "Feb 8, 2026", author: "Sarah Chen", coverageCount: 8, formCount: 6,
    description: "Regional commercial auto program for the Southeast.",
  },
  {
    id: "gl-national", name: "General Liability — National", lobId: "general-liability",
    status: "Draft", version: "v1.0", states: ["All"],
    lastModified: "Feb 6, 2026", author: "James Miller", coverageCount: 5, formCount: 8,
    description: "National general liability program targeting small businesses.",
  },
  {
    id: "wc-southeast", name: "Workers' Comp — Southeast", lobId: "workers-comp",
    status: "Published", version: "v2.4", states: ["GA", "FL", "SC"],
    lastModified: "Jan 28, 2026", author: "Sarah Chen", coverageCount: 4, formCount: 7,
    description: "Workers' compensation program for Southeast states.",
  },
  {
    id: "bop-small-biz", name: "BOP — Small Business", lobId: "bop",
    status: "Draft", version: "v0.3", states: ["GA", "FL"],
    lastModified: "Feb 3, 2026", author: "David Park", coverageCount: 10, formCount: 12,
    description: "Business owners policy package for small commercial accounts.",
  },
  {
    id: "comm-auto-texas", name: "Commercial Auto — Texas", lobId: "commercial-auto",
    status: "In Review", version: "v1.2", states: ["TX"],
    lastModified: "Feb 5, 2026", author: "Maria Rodriguez", coverageCount: 8, formCount: 7,
    description: "Texas-specific commercial auto product with state-mandated coverages.",
  },
];

// ─── Shared Components ──────────────────────────────────────────────────────

function Badge({ tier }) {
  const styles = {
    configure: "bg-gray-100 text-gray-700",
    reference: "bg-gray-50 text-gray-500",
    document: "bg-gray-50 text-gray-400",
  };
  const icons = {
    configure: <Icons.Edit />,
    reference: <Icons.Search />,
    document: <Icons.Link />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${styles[tier]}`}>
      {icons[tier]} {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}

function SectionHeader({ title, tier, children }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {tier && <Badge tier={tier} />}
      </div>
      {children}
    </div>
  );
}

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

// ─── Editable Cell with What-If ─────────────────────────────────────────────
function EditableCell({ value, published, onChange, format = "number" }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const changed = published !== undefined && value !== published;
  const displayVal = format === "currency" ? `$${Number(value).toLocaleString()}` : value;
  const pubVal = format === "currency" ? `$${Number(published).toLocaleString()}` : published;

  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        step="any"
        value={tempValue}
        onChange={e => setTempValue(e.target.value)}
        onBlur={() => { setEditing(false); onChange(Number(tempValue)); }}
        onKeyDown={e => { if (e.key === "Enter") { setEditing(false); onChange(Number(tempValue)); } if (e.key === "Escape") { setEditing(false); setTempValue(value); } }}
        className="w-20 px-1.5 py-0.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
      />
    );
  }

  return (
    <button onClick={() => { setTempValue(value); setEditing(true); }} className="text-left group">
      <span className={`text-sm ${changed ? "font-medium text-gray-900" : "text-gray-700"}`}>{displayVal}</span>
      {changed && (
        <span className="text-xs text-gray-400 ml-1">was {pubVal}</span>
      )}
    </button>
  );
}

// ─── Impact Preview Panel ───────────────────────────────────────────────────
function ImpactPreview({ changes, stateFactors, publishedFactors }) {
  if (changes.length === 0) return null;

  const impacts = changes.map(c => {
    const diff = ((c.draft - c.published) / c.published) * 100;
    const samplePremium = 2500;
    const impact = samplePremium * (diff / 100);
    return { ...c, diff, impact };
  });

  return (
    <Card className="border-gray-300 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icons.Zap />
          <h4 className="text-sm font-semibold text-gray-900">Draft Changes</h4>
          <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">{changes.length} change{changes.length !== 1 ? "s" : ""}</span>
        </div>
        <span className="text-xs text-gray-500">vs. Published</span>
      </div>
      <div className="space-y-2 mb-4">
        {impacts.map((c, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-white rounded border border-gray-200">
            <div className="text-sm text-gray-700">
              <span className="font-medium">{c.state} {c.type}</span>
              <span className="text-gray-400 mx-2">{c.published}</span>
              <Icons.ArrowRight />
              <span className="ml-2 font-medium">{c.draft}</span>
            </div>
            <div className="text-right">
              <span className={`text-sm font-medium ${c.diff > 0 ? "text-gray-900" : "text-gray-600"}`}>
                {c.diff > 0 ? "+" : ""}{c.diff.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-400 ml-2">
                ~{c.impact > 0 ? "+" : ""}${Math.round(c.impact).toLocaleString()}/vehicle
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-100">Discard All</button>
        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100">Save Draft</button>
        <button className="px-3 py-1.5 text-xs font-medium text-white bg-gray-800 rounded hover:bg-gray-700">Submit for Approval</button>
      </div>
    </Card>
  );
}

// ─── Overview Module ────────────────────────────────────────────────────────
function Overview({ selectedState }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Commercial Auto</h2>
        <p className="text-sm text-gray-500">Product configuration overview{selectedState !== "All" ? ` for ${selectedState}` : " — all states"}</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active States", value: "6", sub: "GA, FL, SC, NC, AL, TN" },
          { label: "Coverages", value: "8", sub: "3 required, 5 optional" },
          { label: "Vehicle Classes", value: "8", sub: "PP through Trailer" },
          { label: "Version", value: "Draft", sub: "3 pending changes" },
        ].map((s, i) => (
          <Card key={i}>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Version History */}
      <Card>
        <SectionHeader title="Product Versions" />
        <div className="overflow-hidden rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2.5 px-4 font-medium text-gray-600">Version</th>
                <th className="text-left py-2.5 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-2.5 px-4 font-medium text-gray-600">Effective Date</th>
                <th className="text-left py-2.5 px-4 font-medium text-gray-600">Created</th>
                <th className="text-left py-2.5 px-4 font-medium text-gray-600">Author</th>
                <th className="text-left py-2.5 px-4 font-medium text-gray-600">Changes</th>
              </tr>
            </thead>
            <tbody>
              {[
                { version: "v3.2", status: "Draft", effective: "—", created: "Feb 3, 2026", author: "Sarah Chen", changes: "3 factor changes, 1 coverage added" },
                { version: "v3.1", status: "Published", effective: "Jan 15, 2026", created: "Jan 12, 2026", author: "Sarah Chen", changes: "Updated eligibility rules" },
                { version: "v3.0", status: "Published", effective: "Jan 1, 2026", created: "Dec 20, 2025", author: "Mike Rodriguez", changes: "Annual rate revision" },
                { version: "v2.4", status: "Archived", effective: "Oct 1, 2025", created: "Sep 25, 2025", author: "James Wilson", changes: "Added FL and TN states" },
                { version: "v2.3", status: "Archived", effective: "Jul 1, 2025", created: "Jun 22, 2025", author: "Sarah Chen", changes: "Rater workbook update" },
              ].map((v, i) => (
                <tr key={i} className={`border-b border-gray-100 ${v.status === "Draft" ? "bg-gray-50/60" : ""}`}>
                  <td className="py-2.5 px-4">
                    <span className="text-sm font-medium text-gray-900">{v.version}</span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      v.status === "Draft" ? "bg-gray-200 text-gray-700" :
                      v.status === "Published" ? "bg-gray-100 text-gray-700" :
                      "bg-gray-50 text-gray-400"
                    }`}>{v.status}</span>
                  </td>
                  <td className="py-2.5 px-4 text-sm text-gray-600">{v.effective}</td>
                  <td className="py-2.5 px-4 text-sm text-gray-500">{v.created}</td>
                  <td className="py-2.5 px-4 text-sm text-gray-500">{v.author}</td>
                  <td className="py-2.5 px-4 text-xs text-gray-400">{v.changes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Module Status" />
        <div className="space-y-3">
          {[
            { icon: <Icons.Shield />, name: "Eligibility", version: "v3.1", status: "Published", rules: "6 eligibility rules, 5 class restrictions", effective: "Jan 15, 2026" },
            { icon: <Icons.DollarSign />, name: "Pricing & Product Definition", version: "v3.2-draft", status: "Draft", rules: "8 coverages, 4 factor tables, rater configured", effective: "—" },
            { icon: <Icons.Settings />, name: "Operations", version: "v3.0", status: "Published", rules: "Full lifecycle, 3 payment plans, authority rules", effective: "Jan 1, 2026" },
            { icon: <Icons.FileText />, name: "Policy Forms", version: "v3.1", status: "Published", rules: "4 base forms, 4 endorsements", effective: "Jan 15, 2026" },
            { icon: <Icons.Layout />, name: "Layouts", version: "v3.0", status: "Published", rules: "5 sections configured", effective: "Jan 1, 2026" },
          ].map((m, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-gray-500">{m.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{m.name}</span>
                    <span className="text-xs text-gray-400 font-mono">{m.version}</span>
                  </div>
                  <p className="text-xs text-gray-400">{m.rules}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded ${m.status === "Draft" ? "bg-gray-200 text-gray-700 font-medium" : "bg-gray-50 text-gray-500"}`}>
                  {m.status}
                </span>
                <span className="text-xs text-gray-400 w-24">{m.effective}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader title="Recent Activity" />
        <div className="space-y-2">
          {[
            { action: "Updated GA liability state factor", who: "Sarah Chen", time: "2 hours ago", version: "v3.2-draft" },
            { action: "Added Towing & Labor coverage", who: "Mike Rodriguez", time: "Yesterday", version: "v3.2-draft" },
            { action: "Published v3.1 — eligibility rules update", who: "Sarah Chen", time: "3 days ago", version: "v3.1" },
            { action: "Updated rater workbook", who: "James Wilson", time: "1 week ago", version: "v3.1-draft" },
            { action: "Published v3.0 — annual rate revision", who: "Mike Rodriguez", time: "Jan 1, 2026", version: "v3.0" },
          ].map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2 text-sm">
              <span className="text-gray-700">{a.action}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-mono">{a.version}</span>
                <span className="text-gray-500">{a.who}</span>
                <span className="text-xs text-gray-400">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Eligibility Module ─────────────────────────────────────────────────────
function EligibilityModule({ selectedState }) {
  const [subTab, setSubTab] = useState("rules");
  const [overrideState, setOverrideState] = useState(selectedState || "All");
  const eligibilityOverrides = getStateOverrides("eligibility", overrideState);
  const overrideFieldSet = new Set(eligibilityOverrides.map(o => o.field));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Eligibility</h2>
        <p className="text-sm text-gray-500">Can we insure this? Rules for {overrideState === "All" ? "All States" : overrideState}</p>
      </div>

      <ComponentVersionBar componentKey="eligibility" />
      <StateOverrideBar componentKey="eligibility" selectedState={overrideState} onStateChange={setOverrideState} />

      <TabBar
        tabs={[
          { id: "rules", label: "Eligibility Rules" },
          { id: "classes", label: "Class Restrictions" },
          { id: "territory", label: "Territory" },
        ]}
        active={subTab}
        onChange={setSubTab}
      />

      {subTab === "rules" && (
        <Card>
          <SectionHeader title="Eligibility Rules" tier="configure">
            <button className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded hover:bg-gray-50">+ Add Rule</button>
          </SectionHeader>
          <div className="overflow-hidden rounded border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2.5 px-3 font-medium text-gray-600">Rule</th>
                  <th className="text-left py-2.5 px-3 font-medium text-gray-600">Condition</th>
                  <th className="text-left py-2.5 px-3 font-medium text-gray-600">Pass</th>
                  <th className="text-left py-2.5 px-3 font-medium text-gray-600">Fail</th>
                  {overrideState !== "All" && <th className="text-left py-2.5 px-3 font-medium text-gray-600">Override</th>}
                </tr>
              </thead>
              <tbody>
                {ELIGIBILITY_RULES.map((r, i) => {
                  const override = eligibilityOverrides.find(o => o.field === r.name);
                  return (
                    <tr key={r.id} className={`group border-b border-gray-100 ${override ? "bg-gray-100/40" : i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                      <td className="py-2.5 px-3 font-medium text-gray-900">
                        {r.name}
                        {override && <OverrideBadge state={overrideState} />}
                      </td>
                      <td className="py-2.5 px-3 text-gray-600 font-mono text-xs">
                        {override ? (
                          <span>
                            <span className="text-gray-800">{override.override}</span>
                            <span className="text-gray-400 line-through ml-2 text-[11px]">{override.base}</span>
                          </span>
                        ) : r.condition}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">{r.outcome}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${r.failOutcome === "decline" ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"}`}>
                          {r.failOutcome}
                        </span>
                      </td>
                      {overrideState !== "All" && (
                        <td className="py-2.5 px-3 text-xs">
                          {override ? (
                            <span className="text-[11px] text-gray-500" title={override.reason}>{override.reason}</span>
                          ) : (
                            <AddOverrideButton />
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
                {/* Show override-only rules not in base */}
                {eligibilityOverrides.filter(o => !ELIGIBILITY_RULES.find(r => r.name === o.field)).map((o, i) => (
                  <tr key={`override-${i}`} className="group border-b border-gray-100 bg-gray-100/40">
                    <td className="py-2.5 px-3 font-medium text-gray-900">
                      {o.field}
                      <OverrideBadge state={overrideState} />
                    </td>
                    <td className="py-2.5 px-3 text-gray-800 font-mono text-xs">{o.override}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">accept</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-xs px-2 py-0.5 rounded font-medium bg-gray-200 text-gray-800">decline</span>
                    </td>
                    {overrideState !== "All" && (
                      <td className="py-2.5 px-3 text-[11px] text-gray-500">{o.reason}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {subTab === "classes" && (
        <Card>
          <SectionHeader title="Class Restrictions" tier="configure" />
          <div className="overflow-hidden rounded border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2.5 px-3 font-medium text-gray-600">Class</th>
                  <th className="text-left py-2.5 px-3 font-medium text-gray-600">Status</th>
                  <th className="text-left py-2.5 px-3 font-medium text-gray-600">Reason</th>
                </tr>
              </thead>
              <tbody>
                {CLASS_RESTRICTIONS.map((c, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2.5 px-3 font-medium text-gray-900">{c.class}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${c.status === "excluded" ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500">{c.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {subTab === "territory" && (
        <Card>
          <SectionHeader title="Territory Availability" tier="configure" />
          <div className="grid grid-cols-3 gap-3">
            {STATES.map(s => (
              <div key={s} className={`flex items-center justify-between p-3 rounded border ${s === selectedState ? "border-gray-400 bg-gray-50" : "border-gray-200"}`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{s}</span>
                  {s === selectedState && <span className="text-xs text-gray-500">(selected)</span>}
                </div>
                <Toggle enabled={true} onChange={() => {}} />
              </div>
            ))}
            {["VA", "MS", "LA"].map(s => (
              <div key={s} className="flex items-center justify-between p-3 rounded border border-gray-100 bg-gray-50/50">
                <span className="text-sm text-gray-400">{s}</span>
                <Toggle enabled={false} onChange={() => {}} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Pricing Module ─────────────────────────────────────────────────────────
function PricingModule({ selectedState }) {
  const [subTab, setSubTab] = useState("coverages");
  const [overrideState, setOverrideState] = useState(selectedState || "All");
  const [coverageEnabled, setCoverageEnabled] = useState(
    Object.fromEntries(COVERAGES.map(c => [c.id, c.required || ["comprehensive", "collision", "um_uim", "med_pay"].includes(c.id)]))
  );
  const [stateFactors, setStateFactors] = useState(JSON.parse(JSON.stringify(INITIAL_STATE_FACTORS)));
  const [publishedFactors] = useState(JSON.parse(JSON.stringify(INITIAL_STATE_FACTORS)));
  const [showCompare, setShowCompare] = useState(false);
  const ratesOverrides = getStateOverrides("rates", overrideState);

  const changes = useMemo(() => {
    const result = [];
    Object.keys(stateFactors).forEach(state => {
      Object.keys(stateFactors[state]).forEach(type => {
        if (stateFactors[state][type] !== publishedFactors[state][type]) {
          result.push({ state, type, draft: stateFactors[state][type], published: publishedFactors[state][type] });
        }
      });
    });
    return result;
  }, [stateFactors, publishedFactors]);

  const updateStateFactor = (state, type, value) => {
    setStateFactors(prev => ({ ...prev, [state]: { ...prev[state], [type]: value } }));
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Pricing & Product Definition</h2>
        <p className="text-sm text-gray-500">What do we offer and at what price? Showing {overrideState === "All" ? "All States" : overrideState}</p>
      </div>

      <ComponentVersionBar componentKey="rates" />
      <StateOverrideBar componentKey="rates" selectedState={overrideState} onStateChange={setOverrideState} />

      <TabBar
        tabs={[
          { id: "coverages", label: "Coverages" },
          { id: "rating", label: "Rating Factors" },
          { id: "rater", label: "Rater Configuration" },
        ]}
        active={subTab}
        onChange={setSubTab}
      />

      {subTab === "coverages" && (
        <Card>
          <SectionHeader title="Coverage Configuration" tier="configure" />
          <div className="space-y-0 rounded border border-gray-200 overflow-hidden">
            {COVERAGES.map((cov, i) => (
              <div key={cov.id} className={`flex items-center justify-between p-4 ${i < COVERAGES.length - 1 ? "border-b border-gray-100" : ""} ${!coverageEnabled[cov.id] ? "bg-gray-50/50" : ""}`}>
                <div className="flex items-center gap-4">
                  <Toggle enabled={coverageEnabled[cov.id]} onChange={v => { if (!cov.required) setCoverageEnabled(prev => ({ ...prev, [cov.id]: v })); }} />
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
                  <div className="text-sm text-gray-600">
                    {cov.type === "limit" && cov.limitOptions && (
                      <select className="text-sm border border-gray-200 rounded px-2 py-1 bg-white text-gray-700">
                        {cov.limitOptions.map(l => (
                          <option key={l} value={l} selected={l === cov.defaultLimit}>
                            {l >= 1000000 ? `$${l / 1000000}M` : l >= 1000 ? `$${(l / 1000).toFixed(0)}K` : `$${l}`}
                          </option>
                        ))}
                      </select>
                    )}
                    {cov.type === "deductible" && (
                      <select className="text-sm border border-gray-200 rounded px-2 py-1 bg-white text-gray-700">
                        {cov.deductibleOptions.map(d => (
                          <option key={d} value={d} selected={d === cov.defaultDeductible}>${d.toLocaleString()}</option>
                        ))}
                      </select>
                    )}
                    {cov.type === "flat" && <span className="text-gray-500">${cov.surcharge}</span>}
                    {cov.type === "percent" && <span className="text-gray-500">{cov.pricingMethod}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {subTab === "rating" && (
        <div className="space-y-5">
          {changes.length > 0 && (
            <ImpactPreview changes={changes} stateFactors={stateFactors} publishedFactors={publishedFactors} />
          )}

          {/* State Override Summary for Rates */}
          {ratesOverrides.length > 0 && (
            <Card>
              <SectionHeader title={`${overrideState} Rate Overrides`} tier="configure">
                <span className="text-xs text-gray-500">{ratesOverrides.length} override{ratesOverrides.length !== 1 ? "s" : ""} from base</span>
              </SectionHeader>
              <div className="overflow-hidden rounded border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-2.5 px-3 font-medium text-gray-600">Factor</th>
                      <th className="text-left py-2.5 px-3 font-medium text-gray-600">Base Value</th>
                      <th className="text-left py-2.5 px-3 font-medium text-gray-600">{overrideState} Value</th>
                      <th className="text-left py-2.5 px-3 font-medium text-gray-600">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratesOverrides.map((o, i) => (
                      <tr key={i} className="border-b border-gray-100 bg-gray-100/40">
                        <td className="py-2.5 px-3 font-medium text-gray-900">
                          {o.field}
                          <OverrideBadge state={overrideState} />
                        </td>
                        <td className="py-2.5 px-3 text-gray-400 line-through">{o.base}</td>
                        <td className="py-2.5 px-3 text-gray-800 font-medium">{o.override}</td>
                        <td className="py-2.5 px-3 text-gray-500 text-xs">{o.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <Card>
            <SectionHeader title="Vehicle Class Base Rates" tier="reference">
              <span className="text-xs text-gray-400">ISO base rates - read only</span>
            </SectionHeader>
            <div className="overflow-hidden rounded border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600">Vehicle Class</th>
                    <th className="text-right py-2.5 px-3 font-medium text-gray-600">Liability</th>
                    <th className="text-right py-2.5 px-3 font-medium text-gray-600">Comp</th>
                    <th className="text-right py-2.5 px-3 font-medium text-gray-600">Collision</th>
                  </tr>
                </thead>
                <tbody>
                  {VEHICLE_CLASS_RATES.map((r, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 px-3 font-medium text-gray-900">{r.class}</td>
                      <td className="py-2 px-3 text-right text-gray-700">${r.liability.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-gray-700">${r.comp.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-gray-700">${r.coll.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <SectionHeader title="Use Class Factors" tier="configure" />
            <div className="overflow-hidden rounded border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600">Use Class</th>
                    <th className="text-right py-2.5 px-3 font-medium text-gray-600">Factor</th>
                  </tr>
                </thead>
                <tbody>
                  {USE_CLASS_FACTORS.map((f, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2.5 px-3 font-medium text-gray-900">{f.use}</td>
                      <td className="py-2.5 px-3 text-right text-gray-700">{f.factor.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <SectionHeader title="State Factors" tier="configure">
              <div className="flex items-center gap-2">
                {changes.length > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{changes.length} draft change{changes.length !== 1 ? "s" : ""}</span>
                )}
                <button
                  onClick={() => setShowCompare(!showCompare)}
                  className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded hover:bg-gray-50"
                >
                  {showCompare ? "Hide Compare" : "Compare Versions"}
                </button>
              </div>
            </SectionHeader>
            <div className="overflow-hidden rounded border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600">State</th>
                    <th className="text-right py-2.5 px-3 font-medium text-gray-600">Liability</th>
                    {showCompare && <th className="text-right py-2.5 px-3 font-medium text-gray-400 text-xs">Published</th>}
                    <th className="text-right py-2.5 px-3 font-medium text-gray-600">Physical Damage</th>
                    {showCompare && <th className="text-right py-2.5 px-3 font-medium text-gray-400 text-xs">Published</th>}
                    <th className="text-right py-2.5 px-3 font-medium text-gray-600">Med Pay</th>
                    {showCompare && <th className="text-right py-2.5 px-3 font-medium text-gray-400 text-xs">Published</th>}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(stateFactors).map((state, i) => (
                    <tr key={state} className={`border-b border-gray-100 ${state === selectedState ? "bg-gray-50" : ""}`}>
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-gray-900">{state}</span>
                        {state === selectedState && <span className="text-xs text-gray-400 ml-1.5">active</span>}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <EditableCell
                          value={stateFactors[state].liability}
                          published={publishedFactors[state].liability}
                          onChange={v => updateStateFactor(state, "liability", v)}
                        />
                      </td>
                      {showCompare && <td className="py-2.5 px-3 text-right text-gray-400 text-xs">{publishedFactors[state].liability}</td>}
                      <td className="py-2.5 px-3 text-right">
                        <EditableCell
                          value={stateFactors[state].physical_damage}
                          published={publishedFactors[state].physical_damage}
                          onChange={v => updateStateFactor(state, "physical_damage", v)}
                        />
                      </td>
                      {showCompare && <td className="py-2.5 px-3 text-right text-gray-400 text-xs">{publishedFactors[state].physical_damage}</td>}
                      <td className="py-2.5 px-3 text-right">
                        <EditableCell
                          value={stateFactors[state].med_pay}
                          published={publishedFactors[state].med_pay}
                          onChange={v => updateStateFactor(state, "med_pay", v)}
                        />
                      </td>
                      {showCompare && <td className="py-2.5 px-3 text-right text-gray-400 text-xs">{publishedFactors[state].med_pay}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">Click any factor to edit. Changes appear as draft until submitted for approval.</p>
          </Card>

          <div className="grid grid-cols-2 gap-5">
            <Card>
              <SectionHeader title="Limit Multipliers" tier="configure" />
              <div className="overflow-hidden rounded border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-2.5 px-3 font-medium text-gray-600">CSL Limit</th>
                      <th className="text-right py-2.5 px-3 font-medium text-gray-600">Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LIMIT_MULTIPLIERS.map((l, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2.5 px-3 text-gray-900">${(l.csl_limit / 1000).toFixed(0)}K</td>
                        <td className="py-2.5 px-3 text-right text-gray-700">{l.multiplier.toFixed(2)}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <SectionHeader title="Deductible Credits" tier="configure" />
              <div className="overflow-hidden rounded border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-2.5 px-3 font-medium text-gray-600">Deductible</th>
                      <th className="text-right py-2.5 px-3 font-medium text-gray-600">Factor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEDUCTIBLE_CREDITS.map((d, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2.5 px-3 text-gray-900">${d.deductible.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right text-gray-700">{d.credit.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      )}

      {subTab === "rater" && <RaterConfiguration />}
    </div>
  );
}

// ─── Rater Component Preview ────────────────────────────────────────────────
// This component is programmatically generated from Product Studio config data.
// It shows the sequential flow an underwriter would interact with to rate a risk.

const RATER_STEPS = [
  {
    id: "business_info",
    step: 1,
    label: "Business Information",
    source: "policy-level inputs",
    fields: [
      { field: "state", label: "State", type: "select", options: STATES, derived: "Inputs_Policy!B6" },
      { field: "is_fleet", label: "Fleet", type: "boolean", derived: "Inputs_Policy!B10" },
      { field: "effective_date", label: "Effective Date", type: "date", derived: "Inputs_Policy!B8" },
    ],
  },
  {
    id: "coverage_selection",
    step: 2,
    label: "Coverage Selection",
    source: "coverages + policy inputs",
    fields: [
      { field: "csl_limit", label: "CSL Limit", type: "select", options: ["$300K", "$500K", "$1M"], derived: "Inputs_Policy!B13" },
      { field: "um_uim_selected", label: "UM/UIM Coverage", type: "boolean", derived: "Inputs_Policy!B14" },
      { field: "med_pay_selected", label: "Medical Payments", type: "boolean", derived: "Inputs_Policy!B16" },
      { field: "med_pay_limit", label: "Med Pay Limit", type: "select", options: ["$1,000", "$2,000", "$5,000", "$10,000"], derived: "Inputs_Policy!B18", condition: "med_pay_selected" },
      { field: "hired_selected", label: "Hired Auto Liability", type: "boolean", derived: "Inputs_Policy!B19" },
      { field: "non_owned_selected", label: "Non-Owned Auto", type: "boolean", derived: "Inputs_Policy!B20" },
    ],
  },
  {
    id: "vehicle_schedule",
    step: 3,
    label: "Vehicle Schedule",
    source: "vehicle-level inputs",
    isTable: true,
    columns: [
      { field: "vehicle_number", label: "#", width: "w-10" },
      { field: "state", label: "State", width: "w-14" },
      { field: "use_class", label: "Use Class", width: "w-24" },
      { field: "vehicle_class", label: "Vehicle Class", width: "w-32" },
      { field: "year", label: "Year", width: "w-14" },
      { field: "cost_new", label: "Cost New", width: "w-24" },
      { field: "gvw_gcw", label: "GVW", width: "w-16" },
      { field: "radius", label: "Radius", width: "w-16" },
      { field: "deductible_comp", label: "Comp Ded", width: "w-20" },
      { field: "deductible_coll", label: "Coll Ded", width: "w-20" },
    ],
    sampleRows: [
      { vehicle_number: "1", state: "GA", use_class: "Commercial", vehicle_class: "Light Truck", year: "2022", cost_new: "$35,000", gvw_gcw: "10,000", radius: "150", deductible_comp: "$500", deductible_coll: "$500" },
      { vehicle_number: "2", state: "GA", use_class: "Service", vehicle_class: "Medium Truck", year: "2020", cost_new: "$48,000", gvw_gcw: "16,000", radius: "200", deductible_comp: "$1,000", deductible_coll: "$1,000" },
      { vehicle_number: "3", state: "GA", use_class: "Commercial", vehicle_class: "Heavy Truck", year: "2019", cost_new: "$65,000", gvw_gcw: "26,000", radius: "300", deductible_comp: "$500", deductible_coll: "$500" },
    ],
  },
  {
    id: "select_forms",
    step: 4,
    label: "Select Forms",
    source: "policy forms + endorsements",
    isForms: true,
  },
  {
    id: "subjectives",
    step: 5,
    label: "Credits & Debits",
    source: "rating factors",
    isSubjectives: true,
  },
  {
    id: "review_outputs",
    step: 6,
    label: "Review Rater Outputs",
    source: "output mappings",
    isOutputs: true,
  },
  {
    id: "review_quote",
    step: 7,
    label: "Review Quote",
    source: "all modules",
    isQuote: true,
  },
];

function RaterComponentPreview() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [formValues, setFormValues] = useState({
    state: "GA", is_fleet: false, effective_date: "2026-03-01",
    csl_limit: "$500K", um_uim_selected: true, med_pay_selected: true,
    med_pay_limit: "$5,000", hired_selected: false, non_owned_selected: false,
  });

  const currentStep = RATER_STEPS[activeStep];

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, activeStep]));
    if (activeStep < RATER_STEPS.length - 1) setActiveStep(activeStep + 1);
  };
  const handleBack = () => { if (activeStep > 0) setActiveStep(activeStep - 1); };

  const renderFieldInput = (f) => {
    if (f.type === "select") {
      return (
        <select
          value={formValues[f.field] || f.options[0]}
          onChange={e => setFormValues(p => ({ ...p, [f.field]: e.target.value }))}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400"
        >
          {f.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    if (f.type === "boolean") {
      const val = formValues[f.field] || false;
      return (
        <div className="flex items-center gap-3 py-1">
          <Toggle enabled={val} onChange={v => setFormValues(p => ({ ...p, [f.field]: v }))} />
          <span className="text-sm text-gray-600">{val ? "Yes" : "No"}</span>
        </div>
      );
    }
    if (f.type === "date") {
      return (
        <input
          type="date"
          value={formValues[f.field] || ""}
          onChange={e => setFormValues(p => ({ ...p, [f.field]: e.target.value }))}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400"
        />
      );
    }
    return (
      <input
        type="text"
        value={formValues[f.field] || ""}
        onChange={e => setFormValues(p => ({ ...p, [f.field]: e.target.value }))}
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400"
        placeholder={f.label}
      />
    );
  };

  // ── Step content renderers ──
  const renderFormFields = () => (
    <div className="space-y-5">
      {currentStep.fields
        .filter(f => !f.condition || formValues[f.condition])
        .map((f, i) => (
        <div key={i}>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">{f.label}</label>
          {renderFieldInput(f)}
        </div>
      ))}
    </div>
  );

  const renderVehicleTable = () => (
    <div>
      <p className="text-sm text-gray-500 mb-3">Enter vehicle details. Each row maps to the rater workbook range <span className="font-mono text-xs">Inputs_Vehicles!C2:S26</span>.</p>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {currentStep.columns.map(c => (
                <th key={c.field} className={`text-left py-2.5 px-2 font-medium text-gray-600 text-xs ${c.width}`}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentStep.sampleRows.map((row, ri) => (
              <tr key={ri} className="border-b border-gray-100">
                {currentStep.columns.map(c => (
                  <td key={c.field} className="py-2 px-2">
                    <input
                      type="text"
                      defaultValue={row[c.field]}
                      className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:border-gray-400"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="mt-3 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50">+ Add Vehicle</button>
    </div>
  );

  const renderSelectForms = () => (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Auto-Attached Base Forms</p>
        <div className="space-y-1.5">
          {BASE_FORMS.map((f, i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded border border-gray-200">
              <div className="w-4 h-4 rounded border-2 border-gray-300 bg-gray-200 flex items-center justify-center">
                <Icons.Check />
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-700">{f.name}</span>
                <span className="text-xs text-gray-400 ml-2">{f.formNumber}</span>
              </div>
              <span className="text-xs text-gray-400">Required</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Optional Endorsements</p>
        <div className="space-y-1.5">
          {ENDORSEMENTS.map((e, i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-3 rounded border border-gray-200 hover:bg-gray-50">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" defaultChecked={i === 2} />
              <div className="flex-1">
                <span className="text-sm text-gray-900">{e.name}</span>
                <span className="text-xs text-gray-400 ml-2">{e.formNumber}</span>
              </div>
              <span className="text-xs text-gray-400">{e.condition}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSubjectives = () => (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Schedule Rating Credits / Debits</p>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2.5 px-3 font-medium text-gray-600">Factor</th>
                <th className="text-right py-2.5 px-3 font-medium text-gray-600 w-28">Credit/Debit</th>
                <th className="text-left py-2.5 px-3 font-medium text-gray-600 w-24">Range</th>
              </tr>
            </thead>
            <tbody>
              {[
                { factor: "Management", range: "-15% to +15%" },
                { factor: "Employees", range: "-10% to +10%" },
                { factor: "Equipment Condition", range: "-10% to +10%" },
                { factor: "Safety Program", range: "-20% to +5%" },
                { factor: "Classification", range: "-5% to +15%" },
              ].map((s, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2.5 px-3 text-gray-900">{s.factor}</td>
                  <td className="py-2.5 px-3 text-right">
                    <input type="text" defaultValue="0%" className="w-20 px-2 py-1 text-xs text-right border border-gray-200 rounded focus:outline-none focus:border-gray-400" />
                  </td>
                  <td className="py-2.5 px-3 text-xs text-gray-400">{s.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Experience Modification</p>
        <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
          <label className="text-sm text-gray-700">Experience Mod Factor</label>
          <input type="text" defaultValue="1.00" className="w-20 px-2 py-1.5 text-sm text-right border border-gray-200 rounded focus:outline-none focus:border-gray-400" />
          <span className="text-xs text-gray-400">Range: 0.50 – 2.00</span>
        </div>
      </div>
    </div>
  );

  const renderOutputs = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Premium breakdown computed from rater workbook. Each value maps to an output cell in the Calculator sheet.</p>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-2.5 px-4 font-medium text-gray-600">Coverage</th>
              <th className="text-right py-2.5 px-4 font-medium text-gray-600">Premium</th>
              <th className="text-left py-2.5 px-4 font-medium text-gray-400 text-xs">Source Cell</th>
            </tr>
          </thead>
          <tbody>
            {[
              { coverage: "Liability", premium: "$4,648.50", cell: "Calculator!AR3" },
              { coverage: "Comprehensive", premium: "$811.20", cell: "Calculator!AR4" },
              { coverage: "Collision", premium: "$1,123.20", cell: "Calculator!AR6" },
              { coverage: "UM/UIM", premium: "$2,789.10", cell: "Calculator!AR8" },
              { coverage: "Medical Payments", premium: "$165.50", cell: "Calculator!AR9" },
            ].map((o, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-2.5 px-4 text-gray-900">{o.coverage}</td>
                <td className="py-2.5 px-4 text-right font-medium text-gray-900">{o.premium}</td>
                <td className="py-2.5 px-4 font-mono text-xs text-gray-400">{o.cell}</td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="py-3 px-4 font-semibold text-gray-900">Total Premium</td>
              <td className="py-3 px-4 text-right font-semibold text-gray-900 text-base">$9,537.50</td>
              <td className="py-3 px-4 font-mono text-xs text-gray-400">Calculator!AR12</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500">Total Vehicles</p>
          <p className="text-lg font-semibold text-gray-900">3</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500">Avg Premium / Vehicle</p>
          <p className="text-lg font-semibold text-gray-900">$3,179</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500">Min Premium Check</p>
          <p className="text-lg font-semibold text-gray-900">Passed</p>
        </div>
      </div>
    </div>
  );

  const renderQuote = () => (
    <div className="space-y-5">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Quote Summary</p>
            <p className="text-lg font-semibold text-gray-900 mt-0.5">Commercial Auto — GA</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total Annual Premium</p>
            <p className="text-2xl font-bold text-gray-900">$9,537.50</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "State", value: formValues.state },
            { label: "CSL Limit", value: formValues.csl_limit },
            { label: "Vehicles", value: "3" },
            { label: "Effective", value: formValues.effective_date },
          ].map((s, i) => (
            <div key={i} className="p-2 bg-white rounded border border-gray-200">
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-sm font-medium text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Coverages Included</p>
        <div className="space-y-1.5">
          {[
            { name: "Commercial Auto Liability", limit: formValues.csl_limit, premium: "$4,648.50" },
            { name: "Comprehensive", limit: "Per vehicle", premium: "$811.20" },
            { name: "Collision", limit: "Per vehicle", premium: "$1,123.20" },
            { name: "UM/UIM", limit: "60% of liability", premium: "$2,789.10" },
            { name: "Medical Payments", limit: formValues.med_pay_limit, premium: "$165.50" },
          ].map((c, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-3 border border-gray-200 rounded">
              <span className="text-sm text-gray-900">{c.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">{c.limit}</span>
                <span className="text-sm font-medium text-gray-900 w-20 text-right">{c.premium}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Forms Attached (5)</p>
        <p className="text-xs text-gray-500">CA 00 01, CA 00 05, IL 00 17, IL 00 21, CA 99 17</p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (currentStep.fields) return renderFormFields();
    if (currentStep.isTable) return renderVehicleTable();
    if (currentStep.isForms) return renderSelectForms();
    if (currentStep.isSubjectives) return renderSubjectives();
    if (currentStep.isOutputs) return renderOutputs();
    if (currentStep.isQuote) return renderQuote();
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Header banner */}
      <Card className="border-gray-300 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center">
              <Icons.Zap />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Rater Component Preview</h3>
              <p className="text-xs text-gray-500">Auto-generated from Product Studio configuration. This is the flow underwriters will use.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{RATER_STEPS.length} steps</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400">{INPUT_MAPPINGS.length + VEHICLE_INPUT_MAPPINGS.length} mapped fields</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400">{OUTPUT_MAPPINGS.length} outputs</span>
          </div>
        </div>
      </Card>

      {/* Generated-from callout */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded border border-gray-200">
        <Icons.AlertTriangle />
        <p className="text-xs text-gray-500">
          Steps below are derived from: <span className="font-medium text-gray-700">input mappings</span> (policy + vehicle),
          <span className="font-medium text-gray-700"> coverages</span>,
          <span className="font-medium text-gray-700"> policy forms</span>,
          <span className="font-medium text-gray-700"> rating factors</span>, and
          <span className="font-medium text-gray-700"> output mappings</span>.
          Changes to those sections will update this preview.
        </p>
      </div>

      {/* Wizard container */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white" style={{ minHeight: 560 }}>
        {/* ── Left sidebar: step nav ── */}
        <div className="w-56 border-r border-gray-200 bg-white flex-shrink-0 flex flex-col">
          {/* Product label */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Preview</p>
            <p className="text-sm font-medium text-gray-900">Commercial Auto</p>
          </div>

          {/* Steps list */}
          <nav className="flex-1 py-2 overflow-y-auto">
            {RATER_STEPS.map((s, i) => {
              const isActive = i === activeStep;
              const isCompleted = completedSteps.has(i);
              const isPast = i < activeStep;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
                    isActive
                      ? "bg-blue-50 border-l-2 border-blue-500"
                      : "border-l-2 border-transparent hover:bg-gray-50"
                  }`}
                >
                  {/* Step indicator circle */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium ${
                    isActive
                      ? "border-2 border-blue-500 text-blue-600"
                      : isCompleted || isPast
                      ? "bg-gray-200 text-gray-600"
                      : "border border-gray-300 text-gray-400"
                  }`}>
                    {(isCompleted || isPast) && !isActive ? (
                      <Icons.Check />
                    ) : (
                      s.step
                    )}
                  </div>
                  <span className={`text-sm ${
                    isActive
                      ? "font-medium text-blue-700"
                      : isPast || isCompleted
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Step data source */}
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Data source</p>
            <p className="text-xs text-gray-600 font-medium">{currentStep.source}</p>
          </div>
        </div>

        {/* ── Right content area ── */}
        <div className="flex-1 flex flex-col">
          {/* Content header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{currentStep.label}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Step {currentStep.step} of {RATER_STEPS.length}</p>
            </div>
            {/* Step progress bar */}
            <div className="flex items-center gap-1">
              {RATER_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-colors ${
                    i === activeStep
                      ? "w-6 bg-gray-700"
                      : i < activeStep || completedSteps.has(i)
                      ? "w-3 bg-gray-400"
                      : "w-3 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {renderStepContent()}
          </div>

          {/* Footer actions */}
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className={`px-4 py-2 text-sm font-medium rounded border ${
                activeStep === 0
                  ? "text-gray-300 border-gray-100 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Back
            </button>
            <div className="flex items-center gap-2">
              {activeStep === RATER_STEPS.length - 1 ? (
                <>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100">
                    Save as Draft
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700">
                    Generate Quote
                  </button>
                </>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-5 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mapping debug view */}
      <Card>
        <SectionHeader title="Field Mapping Trace" tier="reference" />
        <p className="text-xs text-gray-500 mb-3">Shows how each UI field in Step {currentStep.step} maps to the rater workbook.</p>
        <div className="overflow-hidden rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">UI Field</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Input Type</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Source</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Workbook Cell / Column</th>
              </tr>
            </thead>
            <tbody>
              {(currentStep.fields || []).map((f, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-1.5 px-3 text-xs text-gray-900">{f.label}</td>
                  <td className="py-1.5 px-3 text-xs"><span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{f.type}</span></td>
                  <td className="py-1.5 px-3 text-xs text-gray-500">{currentStep.source}</td>
                  <td className="py-1.5 px-3 font-mono text-xs text-gray-600">{f.derived || "—"}</td>
                </tr>
              ))}
              {currentStep.isTable && currentStep.columns.map((c, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-1.5 px-3 text-xs text-gray-900">{c.label}</td>
                  <td className="py-1.5 px-3 text-xs"><span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">text</span></td>
                  <td className="py-1.5 px-3 text-xs text-gray-500">vehicle-level inputs</td>
                  <td className="py-1.5 px-3 font-mono text-xs text-gray-600">Column {VEHICLE_INPUT_MAPPINGS.find(m => m.field === c.field)?.column || "—"}</td>
                </tr>
              ))}
              {(currentStep.isForms || currentStep.isSubjectives || currentStep.isOutputs || currentStep.isQuote) && (
                <tr className="border-b border-gray-100">
                  <td colSpan={4} className="py-2 px-3 text-xs text-gray-400 italic">
                    {currentStep.isForms && "Fields derived from Policy Forms module — base forms auto-attached, endorsements selectable based on conditions."}
                    {currentStep.isSubjectives && "Schedule rating factors derived from Rating Factors configuration. Ranges constrained by product rules."}
                    {currentStep.isOutputs && "Output fields mapped from Calculator sheet cells defined in Output Mapping section."}
                    {currentStep.isQuote && "Aggregated from all prior steps — coverages, vehicles, forms, and computed premiums."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Rater Configuration ────────────────────────────────────────────────────
function RaterConfiguration() {
  const [raterType, setRaterType] = useState("excel");
  const [testResult, setTestResult] = useState(null);
  const [viewMode, setViewMode] = useState("config"); // "config" | "preview"

  return (
    <div className="space-y-5">
      {/* View toggle: Configuration vs Component Preview */}
      <div className="flex items-center justify-between">
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("config")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === "config" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Configuration
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${viewMode === "preview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Icons.Eye /> Component Preview
          </button>
        </div>
        {viewMode === "preview" && (
          <p className="text-xs text-gray-400">Preview auto-generated from product configuration</p>
        )}
      </div>

      {viewMode === "preview" && <RaterComponentPreview />}

      {viewMode === "config" && (
        <>
          <Card>
            <SectionHeader title="Rater Type" tier="configure" />
            <div className="flex gap-4">
              {[
                { id: "excel", label: "Excel Workbook", desc: "Upload a carrier rating workbook with cell mappings" },
                { id: "api", label: "External API", desc: "Connect to an external rating engine via REST API" },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setRaterType(t.id)}
                  className={`flex-1 p-4 rounded border text-left transition-colors ${raterType === t.id ? "border-gray-400 bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${raterType === t.id ? "border-gray-700" : "border-gray-300"}`}>
                      {raterType === t.id && <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{t.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-5.5 pl-1">{t.desc}</p>
                </button>
              ))}
            </div>
          </Card>

          {raterType === "excel" && (
            <>
              <Card>
                <SectionHeader title="Workbook" tier="configure" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <Icons.FileText />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">commercial-auto-rater-ga.xlsx</p>
                        <p className="text-xs text-gray-400 mt-0.5">Version 2025-10-12 · 342 KB</p>
                        <p className="text-xs text-gray-400">Sheets: Inputs_Policy, Inputs_Vehicles, Inputs_Drivers, Rates_*, Calculator</p>
                        <div className="flex gap-2 mt-2">
                          <button className="text-xs text-gray-500 hover:text-gray-700 underline">Download</button>
                          <button className="text-xs text-gray-500 hover:text-gray-700 underline">Remove</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded p-4 flex flex-col items-center justify-center text-center hover:border-gray-300 cursor-pointer">
                    <Icons.Upload />
                    <p className="text-sm text-gray-600 mt-2">Upload New Version</p>
                    <p className="text-xs text-gray-400 mt-0.5">Drag & drop or browse</p>
                    <p className="text-xs text-gray-400">.xlsx, .xlsm</p>
                  </div>
                </div>
              </Card>

              <Card>
                <SectionHeader title="Input Mapping — Policy Level" tier="configure">
                  <button className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded hover:bg-gray-50">+ Add Field</button>
                </SectionHeader>
                <div className="overflow-hidden rounded border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-2.5 px-3 font-medium text-gray-600">Federato Field</th>
                        <th className="text-left py-2.5 px-3 font-medium text-gray-600">Workbook Cell</th>
                        <th className="text-left py-2.5 px-3 font-medium text-gray-600">Type</th>
                        <th className="w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {INPUT_MAPPINGS.map((m, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-2 px-3 font-mono text-xs text-gray-900">{m.field}</td>
                          <td className="py-2 px-3 font-mono text-xs text-gray-600">{m.cell}</td>
                          <td className="py-2 px-3">
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{m.type}</span>
                          </td>
                          <td className="py-2 px-3 text-gray-400 hover:text-gray-600 cursor-pointer"><Icons.Edit /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <SectionHeader title="Input Mapping — Vehicle Level (Array)" tier="configure" />
                <p className="text-xs text-gray-500 mb-3">Range: <span className="font-mono">Inputs_Vehicles!C2:S26</span> — maps each vehicle row to workbook columns</p>
                <div className="overflow-hidden rounded border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-2.5 px-3 font-medium text-gray-600">Federato Field</th>
                        <th className="text-left py-2.5 px-3 font-medium text-gray-600">Column</th>
                        <th className="text-left py-2.5 px-3 font-medium text-gray-600">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {VEHICLE_INPUT_MAPPINGS.map((m, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-2 px-3 font-mono text-xs text-gray-900">{m.field}</td>
                          <td className="py-2 px-3 font-mono text-xs text-gray-600">{m.column}</td>
                          <td className="py-2 px-3">
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{m.type}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <SectionHeader title="Output Mapping" tier="configure" />
                <div className="overflow-hidden rounded border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-2.5 px-3 font-medium text-gray-600">Output Field</th>
                        <th className="text-left py-2.5 px-3 font-medium text-gray-600">Workbook Cell</th>
                        <th className="text-left py-2.5 px-3 font-medium text-gray-600">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OUTPUT_MAPPINGS.map((m, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-2 px-3 font-mono text-xs text-gray-900">{m.field}</td>
                          <td className="py-2 px-3 font-mono text-xs text-gray-600">{m.cell}</td>
                          <td className="py-2 px-3">
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{m.type}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <SectionHeader title="Test Rater" />
                <p className="text-xs text-gray-500 mb-3">Run the rater with sample inputs to verify mappings produce expected outputs.</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Sample Inputs</p>
                    <div className="bg-gray-50 rounded border border-gray-200 p-3 font-mono text-xs text-gray-700 space-y-1">
                      <div>state: "GA"</div>
                      <div>csl_limit: 500000</div>
                      <div>vehicle_class: "Light Truck"</div>
                      <div>use_class: "Commercial"</div>
                      <div>year: 2022</div>
                      <div>deductible_comp: 500</div>
                      <div>deductible_coll: 500</div>
                    </div>
                  </div>
                  {testResult && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-2">Results</p>
                      <div className="bg-gray-50 rounded border border-gray-200 p-3 font-mono text-xs text-gray-700 space-y-1">
                        <div>liability_premium: <span className="font-semibold">$1,549.50</span></div>
                        <div>comp_premium: <span className="font-semibold">$270.40</span></div>
                        <div>collision_premium: <span className="font-semibold">$374.40</span></div>
                        <div>total_vehicle_premium: <span className="font-semibold">$2,194.30</span></div>
                        <div className="pt-1 border-t border-gray-200 text-gray-500">Completed in 230ms</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setTestResult(true)} className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700">
                    Test Rater
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                    Save Configuration
                  </button>
                </div>
              </Card>
            </>
          )}

          {raterType === "api" && (
            <Card>
              <SectionHeader title="API Configuration" tier="configure" />
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Endpoint URL</label>
                  <input type="text" placeholder="https://api.carrier.com/rate/commercial-auto" className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Authentication</label>
                    <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white">
                      <option>API Key (Header)</option>
                      <option>Bearer Token</option>
                      <option>Basic Auth</option>
                      <option>OAuth 2.0</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Timeout (ms)</label>
                    <input type="number" defaultValue={30000} className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Request Template (JSON)</label>
                  <textarea
                    rows={6}
                    defaultValue={JSON.stringify({ state: "{{state}}", vehicles: "{{vehicles}}", coverages: "{{coverages}}" }, null, 2)}
                    className="w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Response Mapping (JSONPath)</label>
                  <div className="bg-gray-50 border border-gray-200 rounded p-3 font-mono text-xs text-gray-600 space-y-1">
                    <div>total_premium → $.result.totalPremium</div>
                    <div>liability_premium → $.result.coverages.liability</div>
                    <div>comp_premium → $.result.coverages.comprehensive</div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ─── Operations Module ──────────────────────────────────────────────────────
function OperationsModule() {
  const [subTab, setSubTab] = useState("lifecycle");
  const [overrideState, setOverrideState] = useState("All");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Operations</h2>
        <p className="text-sm text-gray-500">How do we run the book?</p>
      </div>

      <ComponentVersionBar componentKey="lifecycle" />
      <StateOverrideBar componentKey="lifecycle" selectedState={overrideState} onStateChange={setOverrideState} />

      <TabBar
        tabs={[
          { id: "lifecycle", label: "Policy Lifecycle" },
          { id: "billing", label: "Billing & Payment" },
          { id: "workflow", label: "Workflow Rules" },
        ]}
        active={subTab}
        onChange={setSubTab}
      />

      {subTab === "lifecycle" && (
        <div className="space-y-5">
          {/* Visual timeline */}
          <Card>
            <div className="px-5 py-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Policy Lifecycle — Chronological</p>
              <div className="flex items-center gap-0 overflow-x-auto pb-2">
                {["Submission", "Quote", "Bind", "In-Force", "Endorsement", "Renewal", "Cancellation", "Reinstatement"].map((phase, i) => (
                  <div key={i} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">{i + 1}</div>
                      <span className="text-xs text-gray-600 mt-1 whitespace-nowrap">{phase}</span>
                    </div>
                    {i < 7 && <div className="w-10 h-px bg-gray-300 mx-1 mt-[-12px]" />}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 1. Submission Intake */}
          <Card>
            <SectionHeader title="1. Submission Intake" tier="configure" />
            <div className="grid grid-cols-2 gap-4 px-1">
              {[
                { label: "Accepted Submission Sources", value: "Portal, API, Email" },
                { label: "Required Fields for Clearance", value: "Named insured, FEIN, state, vehicle count" },
                { label: "Auto-Decline Triggers", value: "Excluded class, state not available" },
                { label: "Duplicate Check", value: "Enabled — match on FEIN + state" },
                { label: "Clearance SLA", value: "4 hours" },
                { label: "Submission Expiry", value: "30 days if no action" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-sm text-gray-600">{s.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right max-w-[50%]">{s.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 2. Quoting */}
          <Card>
            <SectionHeader title="2. Quoting" tier="configure" />
            <div className="grid grid-cols-2 gap-4 px-1">
              {[
                { label: "Auto-Rate on Submission", value: "Enabled" },
                { label: "Quote Validity Period", value: "30 days" },
                { label: "Max Requotes Allowed", value: "Unlimited" },
                { label: "Broker Visibility", value: "Show premium breakdown" },
                { label: "Multi-Option Quoting", value: "Up to 3 coverage options" },
                { label: "Minimum Premium Check", value: "Policy: $500, Liability: $300" },
                { label: "Quote Letter Generation", value: "Auto-generate on quote" },
                { label: "Referral Triggers", value: "Premium > $25K, fleet > 50 vehicles" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-sm text-gray-600">{s.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right max-w-[50%]">{s.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 3. Binding */}
          <Card>
            <SectionHeader title="3. Binding" tier="configure" />
            <div className="grid grid-cols-2 gap-4 px-1">
              {[
                { label: "Payment Required to Bind", value: "Yes" },
                { label: "Accepted Payment Methods", value: "ACH, Credit Card, Check" },
                { label: "Effective Date Range", value: "0 – 60 days from today" },
                { label: "Backdating Allowed", value: "No" },
                { label: "Auto-Bind Authority", value: "Up to $25,000 premium" },
                { label: "Approval Required Above", value: "$25,000 — Senior UW or Manager" },
                { label: "Binder Letter", value: "Auto-generate on bind" },
                { label: "Dec Page Generation", value: "Auto-generate within 24 hours" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-sm text-gray-600">{s.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right max-w-[50%]">{s.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 4. In-Force Policy */}
          <Card>
            <SectionHeader title="4. In-Force Policy Management" tier="configure" />
            <div className="grid grid-cols-2 gap-4 px-1">
              {[
                { label: "Policy Term", value: "12 months" },
                { label: "ID Card Generation", value: "Auto — per vehicle" },
                { label: "Certificate of Insurance", value: "On request, auto-populate" },
                { label: "Policy Document Delivery", value: "Email + portal" },
                { label: "Audit Required", value: "No" },
                { label: "Loss Run Requests", value: "Self-service via portal" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-sm text-gray-600">{s.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right max-w-[50%]">{s.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 5. Endorsements */}
          <Card>
            <SectionHeader title="5. Endorsements / Mid-Term Changes" tier="configure" />
            <div className="space-y-4 px-1">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Allowed Endorsement Types</p>
                <div className="flex flex-wrap gap-2">
                  {["Add Vehicle", "Remove Vehicle", "Change Coverage", "Change Driver", "Change Address", "Change Limit", "Change Deductible"].map((t, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded">{t}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Retroactive Days Allowed", value: "30 days" },
                  { label: "Future-Dated Endorsements", value: "Up to 60 days" },
                  { label: "Min Premium Change to Process", value: "$1" },
                  { label: "Pro-Rata Calculation", value: "Enabled" },
                  { label: "Auto-Approve Threshold", value: "Premium change < $5,000" },
                  { label: "Endorsement Authority", value: "Any underwriter" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                    <span className="text-sm text-gray-600">{s.label}</span>
                    <span className="text-sm font-medium text-gray-900 text-right max-w-[50%]">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 6. Renewal */}
          <Card>
            <SectionHeader title="6. Renewal" tier="configure" />
            <div className="grid grid-cols-2 gap-4 px-1">
              {[
                { label: "Auto Renewal", value: "Enabled" },
                { label: "Renewal Notice to Insured", value: "45 days before expiry" },
                { label: "Renewal Offer Generation", value: "30 days before expiry" },
                { label: "Allow Rate Changes on Renewal", value: "Yes" },
                { label: "Re-Underwriting Required", value: "If loss ratio > 60%" },
                { label: "Non-Renewal Notice", value: "60 days" },
                { label: "Renewal Invitation Letter", value: "Auto-generate" },
                { label: "Lapse Prevention", value: "Email + portal alert at 15 days" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-sm text-gray-600">{s.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right max-w-[50%]">{s.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 7. Cancellation */}
          <Card>
            <SectionHeader title="7. Cancellation" tier="configure" />
            <div className="overflow-hidden rounded border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600">Type</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600">Notice Required</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600">Refund Method</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600">Window</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600">Approval</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: "Insured Requested", notice: "0 days", refund: "Pro Rata", window: "Any time", approval: "Auto" },
                    { type: "Carrier — Underwriting", notice: "60 days", refund: "Pro Rata", window: "Within first 60 days", approval: "Manager" },
                    { type: "Carrier — Non-Payment", notice: "10 days", refund: "Short Rate", window: "After grace period", approval: "Auto" },
                    { type: "Flat Cancel", notice: "0 days", refund: "Full refund", window: "Within 30 days of inception", approval: "UW" },
                    { type: "Non-Renewal", notice: "60 days", refund: "N/A — term expires", window: "Before renewal", approval: "Manager" },
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2.5 px-3 font-medium text-gray-900">{r.type}</td>
                      <td className="py-2.5 px-3 text-gray-700">{r.notice}</td>
                      <td className="py-2.5 px-3 text-gray-700">{r.refund}</td>
                      <td className="py-2.5 px-3 text-xs text-gray-500">{r.window}</td>
                      <td className="py-2.5 px-3 text-xs text-gray-500">{r.approval}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-2 gap-4 px-1 mt-4">
              {[
                { label: "Cancellation Notice Delivery", value: "Mail + email" },
                { label: "Earned Premium Calculation", value: "Daily pro-rata" },
                { label: "Return Premium Timeline", value: "Within 30 days" },
                { label: "Reporting to State", value: "Auto-file within 10 days" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-sm text-gray-600">{s.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right max-w-[50%]">{s.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 8. Reinstatement */}
          <Card>
            <SectionHeader title="8. Reinstatement" tier="configure" />
            <div className="grid grid-cols-2 gap-4 px-1">
              {[
                { label: "Reinstatement Allowed", value: "Yes" },
                { label: "Max Days After Cancellation", value: "30 days" },
                { label: "Lapse-in-Coverage Letter Required", value: "Yes" },
                { label: "Outstanding Balance Required", value: "Full payment of past-due" },
                { label: "Re-Underwriting on Reinstatement", value: "Only if lapse > 15 days" },
                { label: "Reinstatement Authority", value: "Senior UW or Manager" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-sm text-gray-600">{s.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right max-w-[50%]">{s.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {subTab === "billing" && (
        <div className="space-y-5">
          <Card>
            <SectionHeader title="Payment Plans" tier="configure" />
            <div className="overflow-hidden rounded border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600">Plan</th>
                    <th className="text-right py-2.5 px-3 font-medium text-gray-600">Installments</th>
                    <th className="text-right py-2.5 px-3 font-medium text-gray-600">Down Payment</th>
                    <th className="text-right py-2.5 px-3 font-medium text-gray-600">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Pay in Full", installments: 1, down: "100%", fee: "$0" },
                    { name: "Quarterly", installments: 4, down: "25%", fee: "$10" },
                    { name: "Monthly", installments: 12, down: "15%", fee: "$5" },
                  ].map((p, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2.5 px-3 font-medium text-gray-900">{p.name}</td>
                      <td className="py-2.5 px-3 text-right text-gray-700">{p.installments}</td>
                      <td className="py-2.5 px-3 text-right text-gray-700">{p.down}</td>
                      <td className="py-2.5 px-3 text-right text-gray-700">{p.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <SectionHeader title="Fees & Penalties" tier="configure" />
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Grace Period", value: "10 days" },
                { label: "Late Fee", value: "$25" },
                { label: "NSF Fee", value: "$35" },
              ].map((s, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                  <p className="text-sm font-medium text-gray-900">{s.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {subTab === "workflow" && (
        <Card>
          <SectionHeader title="Authority Levels" tier="configure" />
          <div className="space-y-4">
            {[
              { title: "Bind Authority", desc: "Auto-bind up to $25,000 premium. Approval required above.", roles: "Senior UW, Manager" },
              { title: "Endorsement Authority", desc: "Auto-approve premium changes up to $5,000.", roles: "Any UW" },
            ].map((w, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm font-medium text-gray-900">{w.title}</p>
                <p className="text-xs text-gray-500 mt-1">{w.desc}</p>
                <p className="text-xs text-gray-400 mt-1">Approval roles: {w.roles}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Policy Forms Module ────────────────────────────────────────────────────
function PolicyFormsModule({ selectedState }) {
  const [subTab, setSubTab] = useState("base");
  const [overrideState, setOverrideState] = useState(selectedState || "All");
  const formsOverrides = getStateOverrides("forms", overrideState);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Policy Forms</h2>
        <p className="text-sm text-gray-500">What's in the contract? Forms for {overrideState === "All" ? "All States" : overrideState}</p>
      </div>

      <ComponentVersionBar componentKey="forms" />
      <StateOverrideBar componentKey="forms" selectedState={overrideState} onStateChange={setOverrideState} />

      <TabBar
        tabs={[
          { id: "base", label: "Base Forms" },
          { id: "endorsements", label: "Endorsements" },
          { id: "state", label: "State Forms" },
        ]}
        active={subTab}
        onChange={setSubTab}
      />

      {subTab === "base" && (
        <>
          {/* State form overrides */}
          {formsOverrides.length > 0 && (
            <Card>
              <SectionHeader title={`${overrideState} Form Overrides`} tier="configure">
                <span className="text-xs text-gray-500">{formsOverrides.length} override{formsOverrides.length !== 1 ? "s" : ""}</span>
              </SectionHeader>
              <div className="overflow-hidden rounded border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-2.5 px-3 font-medium text-gray-600">Form</th>
                      <th className="text-left py-2.5 px-3 font-medium text-gray-600">Base</th>
                      <th className="text-left py-2.5 px-3 font-medium text-gray-600">{overrideState} Value</th>
                      <th className="text-left py-2.5 px-3 font-medium text-gray-600">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formsOverrides.map((o, i) => (
                      <tr key={i} className="border-b border-gray-100 bg-gray-100/40">
                        <td className="py-2.5 px-3 font-medium text-gray-900">
                          {o.field}
                          <OverrideBadge state={overrideState} />
                        </td>
                        <td className="py-2.5 px-3 text-gray-400 line-through">{o.base}</td>
                        <td className="py-2.5 px-3 text-gray-800 font-medium">{o.override}</td>
                        <td className="py-2.5 px-3 text-gray-500 text-xs">{o.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <Card>
            <SectionHeader title="Base Forms" tier="document" />
            <div className="overflow-hidden rounded border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600">Form #</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600">Name</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600">Edition</th>
                    <th className="text-left py-2.5 px-3 font-medium text-gray-600">Type</th>
                    {overrideState !== "All" && <th className="text-left py-2.5 px-3 font-medium text-gray-600">Override</th>}
                  </tr>
                </thead>
                <tbody>
                  {BASE_FORMS.map((f, i) => {
                    const override = formsOverrides.find(o => o.field.includes(f.formNumber));
                    return (
                      <tr key={i} className={`group border-b border-gray-100 ${override ? "bg-gray-100/40" : ""}`}>
                        <td className="py-2.5 px-3 font-mono text-xs text-gray-700">{f.formNumber}</td>
                        <td className="py-2.5 px-3 text-gray-900">
                          {f.name}
                          {override && <OverrideBadge state={overrideState} />}
                        </td>
                        <td className="py-2.5 px-3 text-gray-500">{f.edition}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{f.type.replace("_", " ")}</span>
                        </td>
                        {overrideState !== "All" && (
                          <td className="py-2.5 px-3 text-xs">
                            {override ? (
                              <span className="text-gray-500">{override.override}</span>
                            ) : (
                              <AddOverrideButton />
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {subTab === "endorsements" && (
        <Card>
          <SectionHeader title="Endorsements" tier="configure">
            <button className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded hover:bg-gray-50">+ Add Endorsement</button>
          </SectionHeader>
          <div className="overflow-hidden rounded border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2.5 px-3 font-medium text-gray-600">Form #</th>
                  <th className="text-left py-2.5 px-3 font-medium text-gray-600">Name</th>
                  <th className="text-left py-2.5 px-3 font-medium text-gray-600">Rule</th>
                  <th className="text-left py-2.5 px-3 font-medium text-gray-600">Condition</th>
                </tr>
              </thead>
              <tbody>
                {ENDORSEMENTS.map((e, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2.5 px-3 font-mono text-xs text-gray-700">{e.formNumber}</td>
                    <td className="py-2.5 px-3 text-gray-900">{e.name}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${e.rule === "optional" ? "bg-gray-50 text-gray-500" : "bg-gray-100 text-gray-700"}`}>
                        {e.rule}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-xs text-gray-500">{e.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {subTab === "state" && (
        <Card>
          <SectionHeader title={`State-Mandated Forms — ${selectedState}`} tier="document" />
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center gap-3">
              <Icons.FileText />
              <div>
                <p className="text-sm font-medium text-gray-900">GA-AUTO-01</p>
                <p className="text-xs text-gray-500">Georgia Mandatory Uninsured Motorist Disclosure</p>
                <p className="text-xs text-gray-400 mt-0.5">Required for all policies</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-1">Form Rule</p>
            <p className="text-xs text-gray-500 font-mono">IF state == 'GA' AND um_uim_selected == false → attach GA-UM-REJECT</p>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Layouts Module ─────────────────────────────────────────────────────────
function LayoutsModule() {
  const [sections, setSections] = useState(LAYOUT_SECTIONS);
  const [dragIdx, setDragIdx] = useState(null);

  const moveSection = (from, to) => {
    const updated = [...sections];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);
    setSections(updated);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Layouts</h2>
        <p className="text-sm text-gray-500">How do underwriters see this?</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <Card>
            <SectionHeader title="Submission View Sections" tier="configure">
              <button className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded hover:bg-gray-50">+ Add Section</button>
            </SectionHeader>
            <p className="text-xs text-gray-400 mb-3">Drag to reorder sections in the underwriter workspace.</p>
            <div className="space-y-1.5">
              {sections.map((s, i) => (
                <div
                  key={s.id}
                  draggable
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => { if (dragIdx !== null) { moveSection(dragIdx, i); setDragIdx(null); } }}
                  className={`flex items-center justify-between p-3 rounded border cursor-move transition-colors ${s.visible ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50"} hover:border-gray-300`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300"><Icons.Grip /></span>
                    <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                    <span className={`text-sm ${s.visible ? "text-gray-900" : "text-gray-400"}`}>{s.title}</span>
                    <span className="text-xs text-gray-400">{s.fieldCount} fields</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Toggle enabled={s.visible} onChange={v => setSections(prev => prev.map((sec, idx) => idx === i ? { ...sec, visible: v } : sec))} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="bg-gray-50 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Icons.Eye />
              <h3 className="text-sm font-semibold text-gray-900">UW Workspace Preview</h3>
            </div>
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">ABC Trucking Co.</span>
                  <span className="text-xs text-gray-400">|</span>
                  <span className="text-xs text-gray-400">Commercial Auto · GA</span>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {sections.filter(s => s.visible).map((s, i) => (
                  <div key={s.id} className="p-2.5 border border-gray-200 rounded">
                    <p className="text-xs font-medium text-gray-600 mb-1">{s.title}</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: Math.min(s.fieldCount, 4) }).map((_, j) => (
                        <div key={j} className="h-2 bg-gray-100 rounded" style={{ width: `${20 + Math.random() * 40}%` }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex gap-2">
                {["Generate Quote", "Bind", "Refer", "Decline"].map((a, i) => (
                  <span key={i} className={`text-xs px-2 py-1 rounded ${i === 0 ? "bg-gray-800 text-white" : "border border-gray-200 text-gray-600"}`}>{a}</span>
                ))}
              </div>
            </div>
          </Card>

          <Card className="mt-5">
            <SectionHeader title="Analysis Panels" tier="configure" />
            <div className="space-y-2">
              {[
                { title: "Fleet Composition", type: "Pie Chart", metric: "Vehicle count by class" },
                { title: "Premium by Coverage", type: "Bar Chart", metric: "Premium by coverage type" },
                { title: "Risk Indicators", type: "Scorecard", metric: "Avg vehicle age, fleet size, avg cost new" },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded border border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.type} · {p.metric}</p>
                  </div>
                  <Toggle enabled={true} onChange={() => {}} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Versions Module ────────────────────────────────────────────────────────

const PRODUCT_VERSIONS = [
  {
    id: "v3.2", status: "Draft", effective: "—", expiry: "—", created: "Feb 3, 2026", author: "Sarah Chen",
    states: ["GA", "FL", "SC", "NC", "AL", "TN"], summary: "3 factor changes, 1 coverage added",
    components: {
      eligibility: { version: "v3.1", status: "Published", lastChanged: "Jan 12, 2026", changes: 0 },
      rates: { version: "v4.1-draft", status: "Draft", lastChanged: "Feb 3, 2026", changes: 3 },
      forms: { version: "v2.1", status: "Published", lastChanged: "Jan 12, 2026", changes: 0 },
      lifecycle: { version: "v1.0", status: "Published", lastChanged: "Dec 20, 2025", changes: 0 },
    },
  },
  {
    id: "v3.1", status: "Published", effective: "Jan 15, 2026", expiry: "—", created: "Jan 12, 2026", author: "Sarah Chen",
    states: ["GA", "FL", "SC", "NC", "AL", "TN"], summary: "Updated eligibility rules, new endorsement form",
    components: {
      eligibility: { version: "v3.1", status: "Published", lastChanged: "Jan 12, 2026", changes: 0 },
      rates: { version: "v4.0", status: "Published", lastChanged: "Dec 20, 2025", changes: 0 },
      forms: { version: "v2.1", status: "Published", lastChanged: "Jan 12, 2026", changes: 0 },
      lifecycle: { version: "v1.0", status: "Published", lastChanged: "Dec 20, 2025", changes: 0 },
    },
  },
  {
    id: "v3.0", status: "Published", effective: "Jan 1, 2026", expiry: "Jan 14, 2026", created: "Dec 20, 2025", author: "Mike Rodriguez",
    states: ["GA", "FL", "SC", "NC", "AL", "TN"], summary: "Annual rate revision",
    components: {
      eligibility: { version: "v3.0", status: "Published", lastChanged: "Dec 20, 2025", changes: 0 },
      rates: { version: "v4.0", status: "Published", lastChanged: "Dec 20, 2025", changes: 0 },
      forms: { version: "v2.0", status: "Published", lastChanged: "Dec 20, 2025", changes: 0 },
      lifecycle: { version: "v1.0", status: "Published", lastChanged: "Dec 20, 2025", changes: 0 },
    },
  },
  {
    id: "v2.4", status: "Archived", effective: "Oct 1, 2025", expiry: "Dec 31, 2025", created: "Sep 25, 2025", author: "James Wilson",
    states: ["GA", "FL", "SC", "NC", "AL", "TN"], summary: "Added FL and TN states",
    components: {
      eligibility: { version: "v2.4", status: "Archived", lastChanged: "Sep 25, 2025", changes: 0 },
      rates: { version: "v3.2", status: "Archived", lastChanged: "Sep 25, 2025", changes: 0 },
      forms: { version: "v2.0", status: "Archived", lastChanged: "Sep 25, 2025", changes: 0 },
      lifecycle: { version: "v1.0", status: "Archived", lastChanged: "Sep 25, 2025", changes: 0 },
    },
  },
];

const COMPONENT_DEFS = [
  { key: "eligibility", label: "Eligibility Rules", icon: <Icons.Shield />, filedWith: "DOI as rules" },
  { key: "rates", label: "Rates & Rating Factors", icon: <Icons.DollarSign />, filedWith: "DOI as rates" },
  { key: "forms", label: "Policy Forms", icon: <Icons.FileText />, filedWith: "DOI as forms" },
  { key: "lifecycle", label: "Lifecycle & Operations", icon: <Icons.Settings />, filedWith: "Not filed separately" },
];

const AUDIT_LOG = [
  { id: 1, timestamp: "Feb 3, 2026 2:14 PM", user: "Sarah Chen", component: "rates", componentVersion: "v4.1-draft", productVersion: "v3.2",
    action: "Modified", field: "GA Liability State Factor", before: "1.05", after: "1.08", reason: "Rate filing GA-2026-0042 approved" },
  { id: 2, timestamp: "Feb 3, 2026 2:12 PM", user: "Sarah Chen", component: "rates", componentVersion: "v4.1-draft", productVersion: "v3.2",
    action: "Modified", field: "GA Physical Damage Factor", before: "1.04", after: "1.06", reason: "Rate filing GA-2026-0042 approved" },
  { id: 3, timestamp: "Feb 3, 2026 1:58 PM", user: "Sarah Chen", component: "rates", componentVersion: "v4.1-draft", productVersion: "v3.2",
    action: "Modified", field: "FL Liability State Factor", before: "1.15", after: "1.18", reason: "Loss ratio adjustment per actuarial review" },
  { id: 4, timestamp: "Feb 1, 2026 10:30 AM", user: "Mike Rodriguez", component: "rates", componentVersion: "v4.1-draft", productVersion: "v3.2",
    action: "Added", field: "Towing & Labor Coverage", before: "—", after: "Enabled (limit: $75)", reason: "Product expansion request" },
  { id: 5, timestamp: "Jan 12, 2026 4:45 PM", user: "Sarah Chen", component: "eligibility", componentVersion: "v3.1", productVersion: "v3.1",
    action: "Modified", field: "Fleet Size Maximum", before: "75 vehicles", after: "100 vehicles", reason: "Expanded appetite per UW committee" },
  { id: 6, timestamp: "Jan 12, 2026 4:40 PM", user: "Sarah Chen", component: "eligibility", componentVersion: "v3.1", productVersion: "v3.1",
    action: "Modified", field: "Driver Age Minimum", before: "25 years", after: "21 years", reason: "Competitive positioning adjustment" },
  { id: 7, timestamp: "Jan 12, 2026 3:20 PM", user: "Sarah Chen", component: "forms", componentVersion: "v2.1", productVersion: "v3.1",
    action: "Added", field: "CA 04 03 — Additional Insured Lessor", before: "—", after: "Conditional: Leased vehicles present", reason: "New endorsement for leasing programs" },
  { id: 8, timestamp: "Jan 12, 2026 3:15 PM", user: "Sarah Chen", component: "forms", componentVersion: "v2.1", productVersion: "v3.1",
    action: "Published", field: "Forms Component v2.1", before: "Draft", after: "Published", reason: "Filing FL-2026-0018 approved" },
  { id: 9, timestamp: "Dec 20, 2025 11:00 AM", user: "Mike Rodriguez", component: "rates", componentVersion: "v4.0", productVersion: "v3.0",
    action: "Published", field: "Rates Component v4.0", before: "Draft", after: "Published", reason: "Annual rate revision effective Jan 1" },
  { id: 10, timestamp: "Dec 20, 2025 10:45 AM", user: "Mike Rodriguez", component: "rates", componentVersion: "v4.0", productVersion: "v3.0",
    action: "Modified", field: "Heavy Truck Base Rate", before: "$3,200", after: "$3,500", reason: "Annual rate increase 9.4%" },
];

const VERSION_DIFF = {
  from: "v3.1",
  to: "v3.2-draft",
  sections: [
    {
      component: "Rates & Rating Factors",
      componentFrom: "v4.0",
      componentTo: "v4.1-draft",
      changes: [
        { field: "GA Liability State Factor", type: "modified", before: "1.05", after: "1.08", impact: "+2.9%" },
        { field: "GA Physical Damage Factor", type: "modified", before: "1.04", after: "1.06", impact: "+1.9%" },
        { field: "FL Liability State Factor", type: "modified", before: "1.15", after: "1.18", impact: "+2.6%" },
        { field: "Towing & Labor Coverage", type: "added", before: "—", after: "Enabled ($75 limit)", impact: "+$75/vehicle" },
      ],
    },
    {
      component: "Eligibility Rules",
      componentFrom: "v3.1",
      componentTo: "v3.1 (unchanged)",
      changes: [],
    },
    {
      component: "Policy Forms",
      componentFrom: "v2.1",
      componentTo: "v2.1 (unchanged)",
      changes: [],
    },
    {
      component: "Lifecycle & Operations",
      componentFrom: "v1.0",
      componentTo: "v1.0 (unchanged)",
      changes: [],
    },
  ],
};

// ─── State Override Data ────────────────────────────────────────────────────
const SAMPLE_STATE_OVERRIDES = {
  GA: {
    eligibility: [
      { field: "Min Years in Business", base: "3 years", override: "2 years", reason: "State minimum requirement" },
    ],
    rates: [
      { field: "Base Rate — Liability", base: "$850", override: "$920", reason: "GA loss ratio adjustment" },
      { field: "Fleet Discount Threshold", base: "10 vehicles", override: "8 vehicles", reason: "Regional fleet size" },
      { field: "Experience Mod Minimum", base: "0.75", override: "0.80", reason: "GA regulatory floor" },
    ],
    forms: [
      { field: "CG 00 01 — Commercial General Liability", base: "Included", override: "GA-Modified", reason: "State-mandated endorsement" },
    ],
    lifecycle: [],
  },
  FL: {
    eligibility: [
      { field: "PIP Coverage Required", base: "No", override: "Yes", reason: "FL no-fault state requirement" },
      { field: "Min Combined Single Limit", base: "$500,000", override: "$750,000", reason: "FL minimum for commercial" },
    ],
    rates: [
      { field: "Hurricane Surcharge", base: "N/A", override: "+12%", reason: "FL catastrophe loading" },
    ],
    forms: [],
    lifecycle: [],
  },
  SC: {
    eligibility: [],
    rates: [
      { field: "UM/UIM Minimum", base: "$25,000", override: "$50,000", reason: "SC statutory minimum" },
    ],
    forms: [
      { field: "SC-001 — State Amendatory", base: "Not included", override: "Required", reason: "SC mandatory endorsement" },
    ],
    lifecycle: [],
  },
};

function getStateOverrides(componentKey, state) {
  if (!state || state === "All" || !SAMPLE_STATE_OVERRIDES[state]) return [];
  return SAMPLE_STATE_OVERRIDES[state][componentKey] || [];
}

function getOverrideSummary(componentKey) {
  const summary = {};
  let totalOverrideStates = 0;
  Object.keys(SAMPLE_STATE_OVERRIDES).forEach(state => {
    const overrides = SAMPLE_STATE_OVERRIDES[state][componentKey] || [];
    if (overrides.length > 0) {
      summary[state] = overrides.length;
      totalOverrideStates++;
    }
  });
  return { perState: summary, overrideStateCount: totalOverrideStates, baseStateCount: 6 - totalOverrideStates };
}

// ─── Component Version Bar ──────────────────────────────────────────────────
function ComponentVersionBar({ componentKey }) {
  const [showAudit, setShowAudit] = useState(false);
  const currentVersion = PRODUCT_VERSIONS[0];
  const cv = currentVersion.components[componentKey];
  const componentLabel = COMPONENT_DEFS.find(c => c.key === componentKey)?.label || componentKey;
  const recentAudit = AUDIT_LOG.filter(e => e.component === componentKey).slice(0, 3);
  const overrideSummary = getOverrideSummary(componentKey);
  const isLocked = cv.status === "Published";

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden mb-4">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {isLocked ? <Icons.Lock /> : <Icons.Unlock />}
            <span className="text-xs font-medium text-gray-700">{componentLabel}</span>
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
          <button
            onClick={() => setShowAudit(!showAudit)}
            className="text-[11px] text-gray-500 hover:text-gray-700 underline"
          >
            {showAudit ? "Hide" : "Recent Changes"}
          </button>
        </div>
      </div>

      {/* Override summary line */}
      {Object.keys(overrideSummary.perState).length > 0 && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-100/50 border-t border-gray-200 text-[11px] text-gray-500">
          <span>State overrides:</span>
          {Object.entries(overrideSummary.perState).map(([state, count]) => (
            <span key={state} className="font-medium text-gray-600">{state} ({count})</span>
          ))}
          <span className="text-gray-400">· {overrideSummary.baseStateCount} states using base</span>
        </div>
      )}
      {Object.keys(overrideSummary.perState).length === 0 && (
        <div className="px-4 py-1.5 bg-gray-100/50 border-t border-gray-200 text-[11px] text-gray-400">
          All states using base configuration
        </div>
      )}

      {/* Expandable audit log */}
      {showAudit && recentAudit.length > 0 && (
        <div className="border-t border-gray-200">
          {recentAudit.map((entry, i) => (
            <div key={entry.id} className={`flex items-center justify-between px-4 py-2 text-[11px] ${i < recentAudit.length - 1 ? "border-b border-gray-100" : ""}`}>
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
      {showAudit && recentAudit.length === 0 && (
        <div className="border-t border-gray-200 px-4 py-2 text-[11px] text-gray-400">No recent changes for this component</div>
      )}
    </div>
  );
}

// ─── State Override UI Components ───────────────────────────────────────────
function OverrideBadge({ state }) {
  return (
    <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 rounded px-2 py-0.5 text-[11px] font-medium ml-2">
      {state} Override
    </span>
  );
}

function AddOverrideButton() {
  return (
    <button
      onClick={() => alert("Add Override — This would open a state override configuration form")}
      className="text-[11px] text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      + Add Override
    </button>
  );
}

function StateOverrideBar({ componentKey, selectedState, onStateChange }) {
  const overrides = getStateOverrides(componentKey, selectedState);
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
          {["GA", "FL", "SC", "NC", "AL", "TN"].map(s => (
            <option key={s} value={s}>{s}{SAMPLE_STATE_OVERRIDES[s] ? " ★" : ""}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── Override Table Helper ──────────────────────────────────────────────────
function OverrideAwareRow({ children, isOverridden, overrideData, selectedState }) {
  return (
    <tr className={`group border-b border-gray-100 hover:bg-gray-50 ${isOverridden ? "bg-amber-50/30" : ""}`}>
      {children}
      {isOverridden && overrideData && (
        <td className="py-2.5 px-3 text-xs">
          <OverrideBadge state={selectedState} />
          <span className="text-gray-400 line-through text-[11px] ml-2">Base: {overrideData.base}</span>
        </td>
      )}
      {!isOverridden && selectedState && selectedState !== "All" && (
        <td className="py-2.5 px-3 text-xs">
          <AddOverrideButton />
        </td>
      )}
    </tr>
  );
}

function VersionsModule() {
  const [selectedVersion, setSelectedVersion] = useState(PRODUCT_VERSIONS[0]);
  const [subTab, setSubTab] = useState("components");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedAuditRows, setExpandedAuditRows] = useState(new Set());
  const [auditComponentFilter, setAuditComponentFilter] = useState("all");
  const [diffExpanded, setDiffExpanded] = useState(new Set(["Rates & Rating Factors"]));

  const toggleAuditRow = (id) => {
    setExpandedAuditRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleDiffSection = (name) => {
    setDiffExpanded(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const filteredAuditLog = auditComponentFilter === "all"
    ? AUDIT_LOG
    : AUDIT_LOG.filter(e => e.component === auditComponentFilter);

  const isImmutable = selectedVersion.status === "Published" || selectedVersion.status === "Archived";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Version Management</h2>
          <p className="text-sm text-gray-500">Product and component version history with audit trail</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gray-800 rounded hover:bg-gray-700"
        >
          <Icons.Plus /> New Version
        </button>
      </div>

      {/* Version Timeline */}
      <Card>
        <SectionHeader title="Product Versions">
          <span className="text-xs text-gray-400">Selection: Active within effective/expiry, most recent first</span>
        </SectionHeader>
        <div className="space-y-1">
          {PRODUCT_VERSIONS.map((v) => {
            const isSelected = selectedVersion.id === v.id;
            return (
              <button
                key={v.id}
                onClick={() => { setSelectedVersion(v); setSubTab("components"); }}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                  isSelected
                    ? "border-gray-400 bg-gray-50 ring-1 ring-gray-300"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 font-mono">{v.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        v.status === "Draft" ? "bg-white text-gray-600 border border-gray-300" :
                        v.status === "Published" ? "bg-gray-800 text-white" :
                        "bg-gray-100 text-gray-400"
                      }`}>{v.status}</span>
                      {(v.status === "Published" || v.status === "Archived") && (
                        <span className="text-gray-400" title="Immutable — changes require new version"><Icons.Lock /></span>
                      )}
                      {v.status === "Draft" && (
                        <span className="text-gray-400" title="Editable"><Icons.Unlock /></span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {v.effective !== "—" && (
                      <span>Effective: {v.effective}{v.expiry !== "—" ? ` → ${v.expiry}` : ""}</span>
                    )}
                    <span>{v.author}</span>
                    <span className="text-gray-400">{v.created}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{v.summary}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Version Detail Tabs */}
      <TabBar
        tabs={[
          { id: "components", label: "Component Versions" },
          { id: "diff", label: "Version Diff" },
          { id: "audit", label: "Audit Log" },
        ]}
        active={subTab}
        onChange={setSubTab}
      />

      {/* Component Versions Tab */}
      {subTab === "components" && (
        <div className="space-y-4">
          {/* Immutability Banner */}
          {isImmutable && (
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg border border-gray-200">
              <Icons.Lock />
              <p className="text-sm text-gray-600">
                <span className="font-medium">{selectedVersion.id}</span> is {selectedVersion.status.toLowerCase()} and immutable. To make changes, create a new product version.
              </p>
            </div>
          )}

          {/* Component Cards */}
          <div className="grid grid-cols-2 gap-4">
            {COMPONENT_DEFS.map(comp => {
              const cv = selectedVersion.components[comp.key];
              const hasChanges = cv.changes > 0;
              return (
                <Card key={comp.key}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-gray-50 rounded flex items-center justify-center text-gray-500">
                        {comp.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{comp.label}</p>
                        <p className="text-[11px] text-gray-400">{comp.filedWith}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-medium text-gray-700">{cv.version}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        cv.status === "Draft" ? "bg-white text-gray-600 border border-gray-300" :
                        cv.status === "Published" ? "bg-gray-800 text-white" :
                        "bg-gray-100 text-gray-400"
                      }`}>{cv.status}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded">
                      <span className="text-gray-500">Last changed</span>
                      <span className="text-gray-700">{cv.lastChanged}</span>
                    </div>
                    {hasChanges && (
                      <div className="flex items-center justify-between py-1.5 px-3 bg-gray-100 rounded border border-gray-200">
                        <span className="text-gray-600 font-medium">{cv.changes} pending change{cv.changes > 1 ? "s" : ""}</span>
                        <span className="text-gray-500">in this draft</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded">
                      <span className="text-gray-500">Versioned independently</span>
                      <span className="text-gray-700">{comp.filedWith !== "Not filed separately" ? "Yes" : "No"}</span>
                    </div>
                    {/* State Override Summary */}
                    {(() => {
                      const oSummary = getOverrideSummary(comp.key);
                      const entries = Object.entries(oSummary.perState);
                      return entries.length > 0 ? (
                        <div className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded">
                          <span className="text-gray-500">State overrides</span>
                          <span className="text-gray-700 text-[11px]">
                            {entries.map(([s, c]) => `${s} (${c})`).join(", ")} · {oSummary.baseStateCount} base
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded">
                          <span className="text-gray-500">State overrides</span>
                          <span className="text-gray-400 text-[11px]">All states using base</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Component Actions */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    {cv.status === "Draft" && !isImmutable && (
                      <>
                        <button className="px-2.5 py-1 text-[11px] font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                          View Changes
                        </button>
                        <button className="px-2.5 py-1 text-[11px] font-medium text-white bg-gray-800 rounded hover:bg-gray-700">
                          Publish Component
                        </button>
                      </>
                    )}
                    {(cv.status === "Published" || isImmutable) && (
                      <button className="px-2.5 py-1 text-[11px] font-medium text-gray-500 border border-gray-200 rounded hover:bg-gray-50">
                        View History
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Component Independence Explainer */}
          <Card>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-500 flex-shrink-0 mt-0.5">
                <Icons.GitBranch />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Independent Component Versioning</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Forms, rates, and eligibility rules are filed independently with state DOIs. Product Studio tracks each component's
                  version separately so you can update and publish a rate change without bumping the forms version, or file a new
                  endorsement form without touching the rates. The product version ties the component versions together as a snapshot.
                </p>
                <div className="flex items-center gap-4 mt-3 text-[11px]">
                  <span className="text-gray-400">Current snapshot for {selectedVersion.id}:</span>
                  {COMPONENT_DEFS.map(comp => (
                    <span key={comp.key} className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-gray-600 font-mono">
                      {comp.label.split(" ")[0]} {selectedVersion.components[comp.key].version}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Version Diff Tab */}
      {subTab === "diff" && (
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded border border-gray-200">
                  <span className="text-xs text-gray-500">From</span>
                  <span className="text-sm font-mono font-medium text-gray-700">{VERSION_DIFF.from}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-white font-medium">Published</span>
                </div>
                <Icons.ArrowRight />
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded border border-gray-200">
                  <span className="text-xs text-gray-500">To</span>
                  <span className="text-sm font-mono font-medium text-gray-700">{VERSION_DIFF.to}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-white text-gray-600 border border-gray-300 font-medium">Draft</span>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {VERSION_DIFF.sections.reduce((sum, s) => sum + s.changes.length, 0)} total changes across {VERSION_DIFF.sections.filter(s => s.changes.length > 0).length} component{VERSION_DIFF.sections.filter(s => s.changes.length > 0).length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="space-y-2">
              {VERSION_DIFF.sections.map(section => {
                const isExpanded = diffExpanded.has(section.component);
                const hasChanges = section.changes.length > 0;
                return (
                  <div key={section.component} className={`border rounded-lg overflow-hidden ${hasChanges ? "border-gray-300" : "border-gray-200"}`}>
                    <button
                      onClick={() => toggleDiffSection(section.component)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left ${hasChanges ? "bg-gray-50" : "bg-white"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${hasChanges ? "text-gray-900" : "text-gray-500"}`}>{section.component}</span>
                        <span className="text-xs text-gray-400 font-mono">{section.componentFrom} → {section.componentTo}</span>
                        {hasChanges && (
                          <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded font-medium">
                            {section.changes.length} change{section.changes.length > 1 ? "s" : ""}
                          </span>
                        )}
                        {!hasChanges && (
                          <span className="text-xs text-gray-400 italic">No changes</span>
                        )}
                      </div>
                      <span className="text-gray-400">
                        {isExpanded ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
                      </span>
                    </button>
                    {isExpanded && hasChanges && (
                      <div className="border-t border-gray-200">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50/50">
                              <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Field</th>
                              <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Change</th>
                              <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Before</th>
                              <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">After</th>
                              <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">Impact</th>
                            </tr>
                          </thead>
                          <tbody>
                            {section.changes.map((ch, i) => (
                              <tr key={i} className="border-t border-gray-100">
                                <td className="px-4 py-2.5 text-sm text-gray-900">{ch.field}</td>
                                <td className="px-4 py-2.5">
                                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                    ch.type === "added" ? "bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-600"
                                  }`}>{ch.type}</span>
                                </td>
                                <td className="px-4 py-2.5 text-sm text-gray-500 font-mono">{ch.before}</td>
                                <td className="px-4 py-2.5 text-sm text-gray-900 font-mono font-medium">{ch.after}</td>
                                <td className="px-4 py-2.5 text-sm text-right text-gray-600">{ch.impact}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Filing Narrative Preview */}
          <Card>
            <SectionHeader title="Change Narrative Preview">
              <button className="text-xs text-gray-500 hover:text-gray-700 underline">Export for Filing</button>
            </SectionHeader>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-sm text-gray-700 leading-relaxed">
              <p className="font-medium text-gray-900 mb-2">Product Version v3.2 — Change Summary</p>
              <p className="mb-2">
                This version includes rate factor adjustments for Georgia and Florida. The Georgia liability
                state factor increased from 1.05 to 1.08 (+2.9%) and the physical damage factor from 1.04 to 1.06 (+1.9%),
                reflecting approved filing GA-2026-0042. The Florida liability state factor increased from 1.15 to 1.18 (+2.6%)
                based on actuarial loss ratio review.
              </p>
              <p className="mb-2">
                Additionally, Towing & Labor coverage was added as an optional coverage with a default limit of $75.
              </p>
              <p className="text-gray-500 text-xs italic">
                Eligibility rules (v3.1), policy forms (v2.1), and lifecycle configuration (v1.0) are unchanged from v3.1.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Audit Log Tab */}
      {subTab === "audit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <select
                value={auditComponentFilter}
                onChange={e => setAuditComponentFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Components</option>
                <option value="eligibility">Eligibility Rules</option>
                <option value="rates">Rates & Rating Factors</option>
                <option value="forms">Policy Forms</option>
                <option value="lifecycle">Lifecycle & Operations</option>
              </select>
              <span className="text-xs text-gray-400">{filteredAuditLog.length} entries</span>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
              <Icons.Upload /> Export CSV
            </button>
          </div>

          <Card>
            <div className="overflow-hidden rounded border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="w-8 px-3 py-2.5"></th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Timestamp</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">User</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Component</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Field</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Version</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditLog.map(entry => {
                    const isExpanded = expandedAuditRows.has(entry.id);
                    const compDef = COMPONENT_DEFS.find(c => c.key === entry.component);
                    return [
                      <tr
                        key={entry.id}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleAuditRow(entry.id)}
                      >
                        <td className="px-3 py-2.5 text-gray-400">
                          {isExpanded ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-gray-600 whitespace-nowrap">{entry.timestamp}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-700">{entry.user}</td>
                        <td className="px-4 py-2.5">
                          <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{compDef?.label || entry.component}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            entry.action === "Added" ? "bg-gray-200 text-gray-700" :
                            entry.action === "Modified" ? "bg-gray-100 text-gray-600" :
                            entry.action === "Published" ? "bg-gray-800 text-white" :
                            "bg-gray-50 text-gray-500"
                          }`}>{entry.action}</span>
                        </td>
                        <td className="px-4 py-2.5 text-sm text-gray-700">{entry.field}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-400 font-mono">{entry.productVersion}</span>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs text-gray-500 font-mono">{entry.componentVersion}</span>
                          </div>
                        </td>
                      </tr>,
                      isExpanded && (
                        <tr key={`${entry.id}-detail`} className="bg-gray-50 border-b border-gray-200">
                          <td colSpan={7} className="px-12 py-3">
                            <div className="grid grid-cols-3 gap-4 text-xs">
                              <div>
                                <p className="text-gray-500 mb-0.5">Before</p>
                                <p className="text-gray-700 font-mono bg-white px-2 py-1 rounded border border-gray-200">{entry.before}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-0.5">After</p>
                                <p className="text-gray-900 font-medium font-mono bg-white px-2 py-1 rounded border border-gray-200">{entry.after}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-0.5">Reason</p>
                                <p className="text-gray-700">{entry.reason}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ),
                    ];
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Create Version Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Create New Product Version</h3>
              <p className="text-xs text-gray-500 mt-0.5">New version will inherit all component versions from the current latest.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Version Number</label>
                <input type="text" defaultValue="v3.3" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
                <textarea rows={2} placeholder="What's changing in this version?" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-600 mb-2">Inheriting from v3.2 (Draft)</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {COMPONENT_DEFS.map(comp => {
                    const cv = PRODUCT_VERSIONS[0].components[comp.key];
                    return (
                      <div key={comp.key} className="flex items-center justify-between py-1.5 px-3 bg-white rounded border border-gray-200">
                        <span className="text-gray-600">{comp.label}</span>
                        <span className="font-mono text-gray-700">{cv.version}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  Component versions are inherited as-is. You can update individual components after creation.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Applicable States</label>
                <div className="flex flex-wrap gap-1.5">
                  {STATES.map(st => (
                    <span key={st} className="px-2.5 py-1 text-xs bg-gray-800 text-white rounded">{st}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2 rounded-b-lg">
              <button onClick={() => setShowCreateModal(false)} className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded hover:bg-white">
                Cancel
              </button>
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-1.5 text-xs font-medium text-white bg-gray-800 rounded hover:bg-gray-700">
                Create Version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Product List Page ──────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const styles = {
    Draft: "bg-white text-gray-600 border border-gray-300",
    "In Review": "bg-gray-200 text-gray-700",
    Published: "bg-gray-800 text-white",
    Archived: "bg-gray-100 text-gray-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

function CategoryTag({ category }) {
  const styles = {
    Auto: "bg-gray-100 text-gray-600",
    Liability: "bg-gray-50 text-gray-500",
    Property: "bg-gray-100 text-gray-600",
    Package: "bg-gray-50 text-gray-500",
    Specialty: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${styles[category] || "bg-gray-50 text-gray-500"}`}>
      {category}
    </span>
  );
}

function NewProductModal({ onClose, onCreateProduct }) {
  const [step, setStep] = useState("choose"); // "choose" | "configure"
  const [selectedLob, setSelectedLob] = useState(null); // null = blank
  const [productName, setProductName] = useState("");
  const [selectedStates, setSelectedStates] = useState([]);
  const allStates = ["GA", "FL", "SC", "NC", "AL", "TN", "TX", "CA", "NY", "IL", "PA", "OH"];

  const handleSelectLob = (lob) => {
    setSelectedLob(lob);
    setProductName(lob ? `${lob.name} — New` : "");
    setStep("configure");
  };

  const toggleState = (st) => {
    setSelectedStates(prev => prev.includes(st) ? prev.filter(s => s !== st) : [...prev, st]);
  };

  const handleCreate = () => {
    onCreateProduct({
      name: productName,
      lobId: selectedLob?.id || null,
      states: selectedStates,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {step === "choose" ? "Create New Product" : "Configure Product"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {step === "choose"
                ? "Choose a Line of Business template or start from scratch"
                : selectedLob
                  ? `Starting from ${selectedLob.name} template`
                  : "Starting with a blank product"
              }
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><Icons.X /></button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "60vh" }}>
          {step === "choose" ? (
            <div className="space-y-4">
              {/* Blank option */}
              <button
                onClick={() => handleSelectLob(null)}
                className="w-full text-left p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <Icons.Plus />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Blank Product</p>
                    <p className="text-xs text-gray-400">Start from scratch — configure all modules manually</p>
                  </div>
                </div>
              </button>

              {/* LOB Templates */}
              <div className="pt-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Or start from a Line of Business</p>
                <div className="grid grid-cols-2 gap-3">
                  {LINES_OF_BUSINESS.map(lob => {
                    const IconComp = Icons[lob.icon] || Icons.Briefcase;
                    return (
                      <button
                        key={lob.id}
                        onClick={() => handleSelectLob(lob)}
                        className="text-left p-3.5 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 bg-gray-50 rounded flex items-center justify-center text-gray-500 flex-shrink-0">
                            <IconComp />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-medium text-gray-800 truncate">{lob.name}</p>
                              <CategoryTag category={lob.category} />
                            </div>
                            <p className="text-[11px] text-gray-400 line-clamp-2">{lob.description}</p>
                            <p className="text-[11px] text-gray-500 mt-1.5">
                              {lob.defaultCoverages} coverages · {lob.defaultForms} forms · {lob.defaultRatingFactors} factors
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="e.g., Commercial Auto — Texas"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                />
              </div>

              {/* What's included (if from LOB) */}
              {selectedLob && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">Included from {selectedLob.name} template</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5"><Icons.Check /> <span>{selectedLob.defaultCoverages} coverages pre-configured</span></div>
                    <div className="flex items-center gap-1.5"><Icons.Check /> <span>{selectedLob.defaultForms} base forms attached</span></div>
                    <div className="flex items-center gap-1.5"><Icons.Check /> <span>{selectedLob.defaultRatingFactors} rating factors</span></div>
                    <div className="flex items-center gap-1.5"><Icons.Check /> <span>{selectedLob.defaultLifecycleStages} lifecycle stages</span></div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">You can modify any inherited setting after creation without affecting the base LOB.</p>
                </div>
              )}

              {/* States */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Available States</label>
                <div className="flex flex-wrap gap-2">
                  {allStates.map(st => (
                    <button
                      key={st}
                      onClick={() => toggleState(st)}
                      className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                        selectedStates.includes(st)
                          ? "bg-gray-800 text-white border-gray-800"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                {selectedStates.length > 0 && (
                  <p className="text-[11px] text-gray-400 mt-1.5">{selectedStates.length} state{selectedStates.length > 1 ? "s" : ""} selected</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {step === "configure" && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button onClick={() => setStep("choose")} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
              <Icons.ArrowLeft /> Back
            </button>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded hover:bg-white">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!productName.trim()}
                className="px-4 py-1.5 text-xs font-medium text-white bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create Product
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LOBDetailPanel({ lob, onClose }) {
  const IconComp = Icons[lob.icon] || Icons.Briefcase;
  const productsUsingLob = PRODUCTS.filter(p => p.lobId === lob.id);

  return (
    <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto flex-shrink-0">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-500"><IconComp /></span>
          <h3 className="text-sm font-semibold text-gray-900">{lob.name}</h3>
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><Icons.X /></button>
      </div>

      <div className="p-5 space-y-5">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Description</p>
          <p className="text-sm text-gray-700">{lob.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <CategoryTag category={lob.category} />
          {lob.isStandard && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-400 border border-gray-200">Standard</span>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Template Contents</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-xs">
              <span className="text-gray-600">Coverages</span>
              <span className="font-medium text-gray-800">{lob.defaultCoverages}</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-xs">
              <span className="text-gray-600">Forms</span>
              <span className="font-medium text-gray-800">{lob.defaultForms}</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-xs">
              <span className="text-gray-600">Rating Factors</span>
              <span className="font-medium text-gray-800">{lob.defaultRatingFactors}</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-xs">
              <span className="text-gray-600">Lifecycle Stages</span>
              <span className="font-medium text-gray-800">{lob.defaultLifecycleStages}</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Default Coverages</p>
          <div className="flex flex-wrap gap-1.5">
            {lob.includedCoverages.map((c, i) => (
              <span key={i} className="px-2 py-0.5 text-[11px] bg-gray-50 text-gray-600 rounded border border-gray-200">{c}</span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Products Using This LOB ({productsUsingLob.length})
          </p>
          {productsUsingLob.length > 0 ? (
            <div className="space-y-2">
              {productsUsingLob.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                  <div>
                    <p className="text-xs font-medium text-gray-700">{p.name}</p>
                    <p className="text-[11px] text-gray-400">{p.version} · {p.status}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No products reference this LOB yet.</p>
          )}
        </div>

        {productsUsingLob.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Push Update</p>
            <p className="text-[11px] text-gray-400 mb-3">Modify the LOB template and push changes to selected products.</p>
            <div className="space-y-1.5 mb-3">
              {productsUsingLob.map(p => (
                <label key={p.id} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span>{p.name}</span>
                </label>
              ))}
            </div>
            <button className="w-full px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
              Push Update to Selected Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductListPage({ onSelectProduct, onCreateProduct }) {
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [lobFilter, setLobFilter] = useState("All");
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedLob, setSelectedLob] = useState(null);
  const [lobSearchQuery, setLobSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      const matchesLob = lobFilter === "All" || p.lobId === lobFilter;
      return matchesSearch && matchesStatus && matchesLob;
    });
  }, [searchQuery, statusFilter, lobFilter]);

  const filteredLobs = useMemo(() => {
    if (!lobSearchQuery) return LINES_OF_BUSINESS;
    return LINES_OF_BUSINESS.filter(l =>
      l.name.toLowerCase().includes(lobSearchQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(lobSearchQuery.toLowerCase())
    );
  }, [lobSearchQuery]);

  const stats = {
    total: PRODUCTS.length,
    published: PRODUCTS.filter(p => p.status === "Published").length,
    draft: PRODUCTS.filter(p => p.status === "Draft").length,
    lobs: LINES_OF_BUSINESS.length,
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-700"><Icons.Package /></span>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Product Studio</h1>
                <p className="text-xs text-gray-400">Configure and manage insurance products</p>
              </div>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Icons.Plus />
              New Product
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 flex items-center gap-0">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "products"
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              Products
              <span className="ml-1.5 px-1.5 py-0.5 text-[11px] bg-gray-100 text-gray-500 rounded">{PRODUCTS.length}</span>
            </button>
            <button
              onClick={() => { setActiveTab("lobs"); setSelectedLob(null); }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "lobs"
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              Lines of Business
              <span className="ml-1.5 px-1.5 py-0.5 text-[11px] bg-gray-100 text-gray-500 rounded">{LINES_OF_BUSINESS.length}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "products" ? (
              <div className="space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Total Products", value: stats.total, icon: <Icons.Package /> },
                    { label: "Published", value: stats.published, icon: <Icons.Check /> },
                    { label: "In Draft", value: stats.draft, icon: <Icons.Edit /> },
                    { label: "Lines of Business", value: stats.lobs, icon: <Icons.Layers /> },
                  ].map((s, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">{s.icon}</span>
                      </div>
                      <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Search & Filters */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400 cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option>Draft</option>
                    <option>In Review</option>
                    <option>Published</option>
                    <option>Archived</option>
                  </select>
                  <select
                    value={lobFilter}
                    onChange={e => setLobFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400 cursor-pointer"
                  >
                    <option value="All">All Lines of Business</option>
                    {LINES_OF_BUSINESS.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                {/* Product Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Product</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Line of Business</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Version</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">States</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Last Modified</th>
                        <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product, idx) => {
                        const lob = LINES_OF_BUSINESS.find(l => l.id === product.lobId);
                        return (
                          <tr key={product.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 1 ? "bg-gray-50/50" : ""}`}>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => onSelectProduct(product)}
                                className="text-left hover:underline"
                              >
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{product.description}</p>
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              {lob && (
                                <div className="flex items-center gap-1.5">
                                  <CategoryTag category={lob.category} />
                                  <span className="text-xs text-gray-600">{lob.name}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3"><StatusBadge status={product.status} /></td>
                            <td className="px-4 py-3 text-xs text-gray-600 font-mono">{product.version}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                {(product.states[0] === "All" ? ["All States"] : product.states.slice(0, 3)).map(st => (
                                  <span key={st} className="px-1.5 py-0.5 text-[11px] bg-gray-100 text-gray-600 rounded">{st}</span>
                                ))}
                                {product.states.length > 3 && (
                                  <span className="text-[11px] text-gray-400">+{product.states.length - 3}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-xs text-gray-600">{product.lastModified}</p>
                              <p className="text-[11px] text-gray-400">{product.author}</p>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => onSelectProduct(product)}
                                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded"
                                  title="Edit"
                                >
                                  <Icons.Edit />
                                </button>
                                <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded" title="Duplicate">
                                  <Icons.Copy />
                                </button>
                                <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded" title="Archive">
                                  <Icons.Archive />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {filteredProducts.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-sm text-gray-400">No products match your filters.</p>
                      <button
                        onClick={() => { setSearchQuery(""); setStatusFilter("All"); setLobFilter("All"); }}
                        className="mt-2 text-xs text-gray-500 underline hover:text-gray-700"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Lines of Business Tab */
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="relative flex-1 max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></span>
                    <input
                      type="text"
                      value={lobSearchQuery}
                      onChange={e => setLobSearchQuery(e.target.value)}
                      placeholder="Search lines of business..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Icons.Plus /> New Line of Business
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {filteredLobs.map(lob => {
                    const IconComp = Icons[lob.icon] || Icons.Briefcase;
                    const productsCount = PRODUCTS.filter(p => p.lobId === lob.id).length;
                    const isSelected = selectedLob?.id === lob.id;

                    return (
                      <button
                        key={lob.id}
                        onClick={() => setSelectedLob(isSelected ? null : lob)}
                        className={`text-left bg-white border rounded-lg p-5 transition-all hover:shadow-sm ${
                          isSelected ? "border-gray-400 ring-1 ring-gray-300" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
                              <IconComp />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{lob.name}</p>
                              <CategoryTag category={lob.category} />
                            </div>
                          </div>
                          {lob.isStandard && (
                            <span className="px-1.5 py-0.5 text-[10px] text-gray-400 border border-gray-200 rounded">Standard</span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{lob.description}</p>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-400">
                            {lob.defaultCoverages} coverages · {lob.defaultForms} forms · {lob.defaultRatingFactors} factors
                          </span>
                          <span className="text-gray-500 font-medium">
                            {productsCount > 0 ? `${productsCount} product${productsCount > 1 ? "s" : ""}` : "No products"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* LOB Detail Panel */}
          {activeTab === "lobs" && selectedLob && (
            <LOBDetailPanel lob={selectedLob} onClose={() => setSelectedLob(null)} />
          )}
        </div>
      </div>

      {/* New Product Modal */}
      {showNewModal && (
        <NewProductModal
          onClose={() => setShowNewModal(false)}
          onCreateProduct={onCreateProduct}
        />
      )}
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────
const MODULES = [
  { id: "overview", label: "Overview", icon: <Icons.Home /> },
  { id: "versions", label: "Versions", icon: <Icons.Clock /> },
  { id: "eligibility", label: "Eligibility", icon: <Icons.Shield /> },
  { id: "pricing", label: "Pricing", icon: <Icons.DollarSign /> },
  { id: "operations", label: "Operations", icon: <Icons.Settings /> },
  { id: "forms", label: "Policy Forms", icon: <Icons.FileText /> },
  { id: "layouts", label: "Layouts", icon: <Icons.Layout /> },
];

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeModule, setActiveModule] = useState("overview");
  const [selectedState, setSelectedState] = useState("All");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const activeModuleLabel = MODULES.find(m => m.id === activeModule)?.label || "";

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveModule("overview");
    setSelectedState("All");
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
    setActiveModule("overview");
  };

  const handleCreateProduct = (config) => {
    // Prototype: just navigate to the new "product"
    const newProduct = {
      id: `new-${Date.now()}`,
      name: config.name,
      lobId: config.lobId,
      status: "Draft",
      version: "v0.1",
      states: config.states.length > 0 ? config.states : ["All"],
      lastModified: "Just now",
      author: "You",
      coverageCount: config.lobId ? LINES_OF_BUSINESS.find(l => l.id === config.lobId)?.defaultCoverages || 0 : 0,
      formCount: config.lobId ? LINES_OF_BUSINESS.find(l => l.id === config.lobId)?.defaultForms || 0 : 0,
      description: "New product",
    };
    handleSelectProduct(newProduct);
  };

  const renderModule = () => {
    switch (activeModule) {
      case "overview": return <Overview selectedState={selectedState} />;
      case "versions": return <VersionsModule />;
      case "eligibility": return <EligibilityModule selectedState={selectedState} />;
      case "pricing": return <PricingModule selectedState={selectedState} />;
      case "operations": return <OperationsModule />;
      case "forms": return <PolicyFormsModule selectedState={selectedState} />;
      case "layouts": return <LayoutsModule />;
      default: return null;
    }
  };

  // ── Product List View ──
  if (!selectedProduct) {
    return (
      <ProductListPage
        onSelectProduct={handleSelectProduct}
        onCreateProduct={handleCreateProduct}
      />
    );
  }

  // ── Product Config View ──
  const productLob = LINES_OF_BUSINESS.find(l => l.id === selectedProduct.lobId);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Sidebar */}
      <div className={`flex flex-col bg-white border-r border-gray-200 ${sidebarExpanded ? "w-56" : "w-14"} transition-all duration-200`}>
        {/* Logo + Back */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
          <span className="text-gray-700"><Icons.Package /></span>
          {sidebarExpanded && <span className="text-sm font-semibold text-gray-900 tracking-tight">Product Studio</span>}
        </div>

        {/* Back to Products + Product Name */}
        {sidebarExpanded && (
          <div className="px-3 py-3 border-b border-gray-100 space-y-2">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Icons.ArrowLeft /> All Products
            </button>
            <div className="px-2.5 py-2 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-700 truncate">{selectedProduct.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={selectedProduct.status} />
                <span className="text-[11px] text-gray-400 font-mono">{selectedProduct.version}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-2 px-2">
          {MODULES.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-sm mb-0.5 transition-colors ${
                activeModule === m.id
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={activeModule === m.id ? "text-gray-700" : "text-gray-400"}>{m.icon}</span>
              {sidebarExpanded && <span>{m.label}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        {sidebarExpanded && (
          <div className="px-3 py-3 border-t border-gray-100">
            <div className="text-xs text-gray-400">
              {productLob && <p className="text-gray-500 font-medium">{productLob.name}</p>}
              <p className="mt-0.5">{selectedProduct.version} · {selectedProduct.status}</p>
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
            <button onClick={handleBackToList} className="text-gray-400 hover:text-gray-600 transition-colors">Products</button>
            <Icons.ChevronRight />
            <span className="text-gray-600">{selectedProduct.name}</span>
            {activeModule !== "overview" && (
              <>
                <Icons.ChevronRight />
                <span className="text-gray-900 font-medium">{activeModuleLabel}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 rounded border border-gray-200">
              <Icons.Globe />
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="text-sm font-medium text-gray-700 bg-transparent border-none focus:outline-none cursor-pointer pr-4"
              >
                <option value="All">All States</option>
                {(selectedProduct.states[0] === "All" ? STATES : selectedProduct.states).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
              Compare Versions
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-white bg-gray-800 rounded hover:bg-gray-700">
              Publish
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderModule()}
        </div>
      </div>
    </div>
  );
}
