import { useState } from "react";

// ─── Sample data from the commercial auto workbook ────────────────────────────

const VEHICLE_CLASSES = [
  { name: "Private Passenger", baseLiab: 850, baseComp: 220, baseColl: 300 },
  { name: "Light Truck", baseLiab: 1250, baseComp: 260, baseColl: 360 },
  { name: "Medium Truck", baseLiab: 2250, baseComp: 300, baseColl: 420 },
  { name: "Heavy Truck", baseLiab: 3500, baseComp: 360, baseColl: 520 },
  { name: "Extra Heavy Truck", baseLiab: 4200, baseComp: 420, baseColl: 600 },
  { name: "Heavy Truck Tractor", baseLiab: 4800, baseComp: 480, baseColl: 680 },
  { name: "Extra Heavy Truck Tractor", baseLiab: 5400, baseComp: 540, baseColl: 800 },
  { name: "Trailer", baseLiab: 300, baseComp: 120, baseColl: 180 },
];

const STATE_FACTORS = [
  { state: "AL", liab: 1.00, pd: 1.00, medpay: 1.00 },
  { state: "CA", liab: 1.12, pd: 1.10, medpay: 1.08 },
  { state: "FL", liab: 1.15, pd: 1.12, medpay: 1.05 },
  { state: "GA", liab: 1.05, pd: 1.04, medpay: 1.01 },
  { state: "NY", liab: 1.12, pd: 1.10, medpay: 1.05 },
  { state: "TX", liab: 1.01, pd: 1.01, medpay: 1.00 },
];

const COVERAGES = [
  {
    id: "liability", name: "Commercial Auto Liability", required: true, level: "policy",
    type: "limit",
    limitOptions: [300000, 500000, 1000000], defaultLimit: 500000,
    contractField: "csl_limit", dbLocation: "policy.csl_limit",
    note: "CSL — Combined Single Limit",
  },
  {
    id: "um_uim", name: "UM / UIM", required: false, level: "policy",
    type: "percentage",
    pctOfLiability: "60%", note: "60% of liability premium per vehicle",
    contractField: "um_uim_selected", dbLocation: "policy.um_uim_selected",
  },
  {
    id: "medpay", name: "Medical Payments", required: false, level: "policy",
    type: "limit",
    limitOptions: [1000, 2000, 5000, 10000], defaultLimit: 5000,
    contractField: "medpay_selected", dbLocation: "policy.medpay_selected",
    note: "$40 flat per vehicle base rate",
  },
  {
    id: "comp", name: "Physical Damage — Comp", required: false, level: "vehicle",
    type: "deductible",
    deductibleOptions: [250, 500, 1000, 2500], defaultDeductible: 500,
    contractField: "pd_comp_selected", dbLocation: "vehicle.pd_coverage_type",
    note: "Scales with Cost New factor",
  },
  {
    id: "collision", name: "Physical Damage — Collision", required: false, level: "vehicle",
    type: "deductible",
    deductibleOptions: [250, 500, 1000, 2500], defaultDeductible: 500,
    contractField: "collision_selected", dbLocation: "vehicle.collision_selected",
  },
  {
    id: "towing", name: "Towing & Labor", required: false, level: "vehicle",
    type: "limit",
    limitOptions: [50, 75, 100], defaultLimit: 50,
    contractField: "towing_selected", dbLocation: "vehicle.towing_selected",
    note: "Flat rate per vehicle",
  },
  {
    id: "hired", name: "Hired Auto Liability", required: false, level: "policy",
    type: "flat", flatRate: 150,
    contractField: "hired_selected", dbLocation: "policy.hired_selected",
    note: "$150 flat surcharge",
  },
  {
    id: "nonowned", name: "Non-Owned Auto Liability", required: false, level: "policy",
    type: "flat", flatRate: 150,
    contractField: "nonowned_selected", dbLocation: "policy.nonowned_selected",
    note: "$150 flat surcharge",
  },
];

const RATING_FACTORS = [
  {
    name: "Vehicle Class Base Rates", source: "rater", type: "table",
    desc: "Base Liability / Comp / Collision rates by vehicle class",
    rows: VEHICLE_CLASSES.length, cols: "4 (class + 3 coverages)",
  },
  {
    name: "Use Class Multipliers", source: "rater", type: "factor",
    desc: "Service: 0.95–1.00 | Retail: 1.03–1.05 | Commercial: 1.00",
    rows: 3, cols: "per vehicle class",
  },
  {
    name: "State Factors", source: "rater", type: "table",
    desc: "Liability, Physical Damage, MedPay factors by state",
    rows: STATE_FACTORS.length, cols: "4 (state + 3 factors)",
  },
  {
    name: "Symbol / Year Factors", source: "rater", type: "factor",
    desc: "Model year brackets: 2016+ = 1.00, 2011–2015 = 0.98, ≤ 2005 = 0.94",
    rows: 4, cols: "2",
  },
  {
    name: "Limit Multipliers (CSL)", source: "rater", type: "factor",
    desc: "$300K = 1.00 | $500K = 1.18 | $1M = 1.45",
    rows: 3, cols: "2",
  },
  {
    name: "Deductible Credits", source: "rater", type: "factor",
    desc: "$250 = 0.92 | $500 = 1.00 | $1K = 1.06 | $2.5K = 1.15",
    rows: 4, cols: "2",
  },
  {
    name: "PD Symbol Factors", source: "rater", type: "factor",
    desc: "Symbol 2 = 0.90 | Symbol 4 = 1.00 | Symbol 8 = 1.20",
    rows: 5, cols: "2",
  },
  {
    name: "MedPay Limit Multipliers", source: "rater", type: "factor",
    desc: "$1K = 0.60 | $2K = 1.00 | $5K = 2.20 | $10K = 4.00",
    rows: 4, cols: "2",
  },
];

const WORKFLOW_STEPS = [
  {
    step: 1, label: "Policy Info", icon: "◻",
    fields: ["State", "Effective / Expiration Date", "Fleet Policy (Y/N)", "Territory Code (optional)"],
    source: "Exposure + Classification",
  },
  {
    step: 2, label: "Coverage Selections", icon: "⬡",
    fields: ["CSL Limit", "UM/UIM (Y/N) + Symbol", "MedPay (Y/N) + Limit", "Hired Auto (Y/N)", "Non-Owned (Y/N)", "Default Comp Symbol", "Default Collision Symbol"],
    source: "Coverages",
  },
  {
    step: 3, label: "Vehicle Schedule", icon: "⊞",
    fields: ["Vehicle Class", "Use Class", "Model Year", "Cost New ($)", "GVW / GCW", "Radius", "Comp Deductible", "Collision Deductible", "PD Coverage Type", "Collision (Y/N)", "Towing (Y/N) + Limit"],
    source: "Exposure + Classification + per-vehicle Coverages",
  },
  {
    step: 4, label: "Rate", icon: "✓",
    fields: ["[Rate button] → external rater call", "Returns: premium per vehicle + total by coverage"],
    source: "Rater Setup",
    isRateStep: true,
  },
  {
    step: 5, label: "Quote Output", icon: "◷",
    fields: ["Total Liability Premium", "Total Comp / Collision Premium", "UM/UIM, MedPay, Towing premiums", "Grand Total Premium"],
    source: "Rater output mapping",
    isOutput: true,
  },
];

// ─── Contract JSON helper ─────────────────────────────────────────────────────

const CONTRACT_SNIPPETS = {
  exposure: `{
  "section": "exposure",
  "rating_unit": "per_vehicle",
  "exposure_fields": [
    {
      "field": "cost_new",
      "label": "Cost New ($)",
      "type": "number",
      "db_location": "vehicle.cost_new",
      "default": null,
      "required": true,
      "note": "Used for PD cost factor: MIN(MAX(cost_new/25000, 0.5), 3.0)"
    },
    {
      "field": "fleet_policy",
      "label": "Fleet Policy (Y/N)",
      "type": "boolean",
      "db_location": "policy.is_fleet",
      "default": false
    }
  ]
}`,
  classification: `{
  "section": "classification",
  "inputs": [
    {
      "field": "vehicle_class",
      "label": "Vehicle Class",
      "type": "select",
      "options": ["Private Passenger","Light Truck","Medium Truck",
                  "Heavy Truck","Extra Heavy Truck",
                  "Heavy Truck Tractor","Trailer"],
      "db_location": "vehicle.vehicle_class",
      "required": true
    },
    {
      "field": "use_class",
      "label": "Use Class",
      "type": "select",
      "options": ["Service","Retail","Commercial"],
      "db_location": "vehicle.use_class",
      "required": true
    },
    {
      "field": "radius",
      "label": "Radius",
      "type": "select",
      "options": ["Local","Intermediate","Long"],
      "db_location": "vehicle.radius",
      "required": true
    }
  ]
}`,
  coverages: `{
  "section": "coverages",
  "policy_level": [
    {
      "field": "csl_limit",
      "label": "CSL Limit",
      "type": "select",
      "options": [300000, 500000, 1000000],
      "default": 500000,
      "db_location": "policy.csl_limit",
      "required": true
    },
    {
      "field": "um_uim_selected",
      "type": "boolean",
      "default": false,
      "db_location": "policy.um_uim_selected"
    }
  ],
  "vehicle_level": [
    {
      "field": "pd_coverage_type",
      "type": "select",
      "options": ["None","Comp","Specified Causes"],
      "default": "Comp",
      "db_location": "vehicle.pd_coverage_type"
    },
    {
      "field": "ded_comp",
      "label": "Comp Deductible",
      "type": "select",
      "options": [250, 500, 1000, 2500],
      "default": 500,
      "db_location": "vehicle.deductible_comp",
      "conditional": "pd_coverage_type != 'None'"
    }
  ]
}`,
  rating_factors: `{
  "section": "rating_factors",
  "source": "rater",
  "note": "Factor tables live inside the rater workbook.
           PS surfaces them as read-only context.",
  "factors_used": [
    "vehicle_class_base_rates",
    "use_class_multipliers",
    "state_factors",
    "symbol_year_factors",
    "limit_multipliers",
    "deductible_credits"
  ]
}`,
  rater_setup: `{
  "rater_type": "excel_api",
  "version": "excel_api_v1",
  "endpoint": "POST /rater/calculate-values",
  "auth": { "type": "api_key", "header": "X-Rater-Key" },
  "rating_trigger": "Coverages step → Rate button",
  "inputs_location": "policy + vehicle tables",
  "outputs": [
    {
      "field": "total_premium",
      "db_location": "rater_output.total_premium"
    },
    {
      "field": "liability_premium",
      "db_location": "rater_output.liability_premium"
    },
    {
      "field": "comp_premium",
      "db_location": "rater_output.comp_premium"
    }
  ]
}`,
};

// ─── Section definitions ──────────────────────────────────────────────────────

const SECTIONS = [
  { id: "exposure",        label: "Exposure Basis",         icon: "◉" },
  { id: "classification",  label: "Classification",          icon: "⊞" },
  { id: "territory",       label: "Territory",               icon: "⊕" },
  { id: "coverages",       label: "Coverages",               icon: "⬡" },
  { id: "rating_factors",  label: "Rating Factors",          icon: "×" },
  { id: "adjustments",     label: "Premium Adjustments",     icon: "%" },
  { id: "fees",            label: "Fees & Minimums",         icon: "$" },
  { id: "rater_setup",     label: "Rater Setup",             icon: "⟳" },
  { id: "workflow",        label: "Workflow Preview",         icon: "→" },
];

const NAV_TABS = ["Overview", "Eligibility", "Product Definition", "Forms", "Operations", "Versions"];

// ─── Section content components ───────────────────────────────────────────────

function ExposureContent({ contractView }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Defines the unit and measure by which risk is sized. All per-unit premium calculations reference this.</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Rating Unit" value="Per Vehicle" locked contractView={contractView} contractKey="rating_unit" contractVal='"per_vehicle"' />
        <Field label="Exposure Measure" value="Cost New ($)" contractView={contractView} contractKey="exposure_field" contractVal='"cost_new"' />
        <Field label="Fleet Policy Toggle" value="Y / N" contractView={contractView} contractKey="field" contractVal='"fleet_policy"' />
        <Field label="Cost Factor Formula" value="MIN(MAX(Cost New / $25,000, 0.5), 3.0)" locked contractView={contractView} contractKey="db_location" contractVal='"vehicle.cost_new"' />
      </div>
      {contractView && <ContractPanel snippet={CONTRACT_SNIPPETS.exposure} />}
    </div>
  );
}

function ClassificationContent({ contractView }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Categorical risk descriptors that determine base rate selection. Defined here; values entered per-vehicle during underwriting.</p>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Vehicle Class", opts: ["Private Passenger", "Light Truck", "Medium Truck", "Heavy Truck", "Extra Heavy Truck", "Heavy Truck Tractor", "Trailer"] },
          { label: "Use Class", opts: ["Service", "Retail", "Commercial"] },
          { label: "Radius", opts: ["Local", "Intermediate", "Long"] },
          { label: "GVW / GCW", opts: ["0–10,000", "10,001–20,000", "20,001–45,000", "45,001+"] },
          { label: "Liability Symbol", opts: ["1", "2", "7", "8", "9"] },
          { label: "PD Symbol", opts: ["2", "3", "4", "7", "8"] },
        ].map(({ label, opts }) => (
          <div key={label} className="border border-gray-100 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-500 mb-1.5">{label}</p>
            <div className="flex flex-wrap gap-1">
              {opts.map(o => (
                <span key={o} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{o}</span>
              ))}
            </div>
            {contractView && <p className="text-xs text-purple-500 mt-1.5 font-mono">type: "select"</p>}
          </div>
        ))}
      </div>
      {contractView && <ContractPanel snippet={CONTRACT_SNIPPETS.classification} />}
    </div>
  );
}

function TerritoryContent({ contractView }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Geographic rating parameters. State is required; territory code is optional and overrides state default.</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="State (required)" value="Select from 24 available states" contractView={contractView} contractKey="db_location" contractVal='"policy.state"' />
        <Field label="Territory Code" value="Optional — overrides state default" contractView={contractView} contractKey="db_location" contractVal='"policy.territory_code"' />
      </div>
      <div className="border border-gray-100 rounded-lg overflow-hidden mt-2">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              {["State", "Liab Factor", "PD Factor", "MedPay Factor"].map(h => (
                <th key={h} className="text-left px-3 py-2 text-gray-500 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STATE_FACTORS.map((r, i) => (
              <tr key={r.state} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                <td className="px-3 py-2 font-medium text-gray-700">{r.state}</td>
                <td className="px-3 py-2 text-gray-600">{r.liab.toFixed(2)}</td>
                <td className="px-3 py-2 text-gray-600">{r.pd.toFixed(2)}</td>
                <td className="px-3 py-2 text-gray-600">{r.medpay.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-3 py-2 bg-amber-50 border-t border-amber-100">
          <p className="text-xs text-amber-700">⟳ Sourced from rater — displayed here as read-only context</p>
        </div>
      </div>
    </div>
  );
}

function CoveragesContent({ contractView }) {
  const policy = COVERAGES.filter(c => c.level === "policy");
  const vehicle = COVERAGES.filter(c => c.level === "vehicle");
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">Available coverages, their parameters, and whether they are required or optional. Policy-level selections apply to the entire policy; vehicle-level are configured per vehicle.</p>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Policy-Level</p>
        <div className="space-y-2">
          {policy.map(c => <CoverageRow key={c.id} c={c} contractView={contractView} />)}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Per-Vehicle</p>
        <div className="space-y-2">
          {vehicle.map(c => <CoverageRow key={c.id} c={c} contractView={contractView} />)}
        </div>
      </div>
      {contractView && <ContractPanel snippet={CONTRACT_SNIPPETS.coverages} />}
    </div>
  );
}

function CoverageRow({ c, contractView }) {
  return (
    <div className={`border rounded-lg p-3 flex items-start gap-3 ${c.required ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50/30"}`}>
      <span className={`mt-0.5 text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${c.required ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
        {c.required ? "Required" : "Optional"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{c.name}</p>
        <div className="mt-1 flex flex-wrap gap-2 items-center">
          {c.limitOptions && (
            <span className="text-xs text-gray-500">Limits: {c.limitOptions.map(l => `$${l.toLocaleString()}`).join(" / ")}</span>
          )}
          {c.deductibleOptions && (
            <span className="text-xs text-gray-500">Deductibles: {c.deductibleOptions.map(d => `$${d}`).join(" / ")}</span>
          )}
          {c.flatRate && (
            <span className="text-xs text-gray-500">Flat: ${c.flatRate}</span>
          )}
          {c.pctOfLiability && (
            <span className="text-xs text-gray-500">{c.pctOfLiability} of Liability</span>
          )}
          {c.note && <span className="text-xs text-gray-400 italic">{c.note}</span>}
        </div>
        {contractView && (
          <div className="mt-1.5 flex gap-3 text-xs font-mono">
            <span className="text-purple-600">field: "{c.contractField}"</span>
            <span className="text-green-600">db: "{c.dbLocation}"</span>
          </div>
        )}
      </div>
    </div>
  );
}

function RatingFactorsContent({ contractView }) {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 text-sm text-amber-800">
        Rating factor tables live inside the external rater (Excel workbook or API). They are surfaced here as read-only context so configurators understand what factors are in play — and so the sequential workflow knows what inputs to collect.
      </div>
      <div className="space-y-2">
        {RATING_FACTORS.map(f => (
          <div key={f.name} className="border border-gray-100 rounded-lg p-3 flex items-start gap-3">
            <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-amber-100 text-amber-700 flex-shrink-0 mt-0.5">From Rater</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{f.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
              {contractView && (
                <p className="text-xs font-mono text-purple-600 mt-1">referenced_in_contract: true</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {contractView && <ContractPanel snippet={CONTRACT_SNIPPETS.rating_factors} />}
    </div>
  );
}

function AdjustmentsContent({ contractView }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Schedule rating credits/debits and structured discounts applied on top of the base rate. Not present in this commercial auto workbook — shown here as a universal section that applies to other LOBs.</p>
      <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-400">No schedule rating configured for this product.</p>
        <button className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add schedule rating plan</button>
      </div>
      <div className="border border-gray-100 rounded-lg p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Composite Rating</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Use Composite Rating" value="No (per-vehicle default)" contractView={contractView} contractKey="field" contractVal='"composite_rating"' />
          <Field label="Composite Exposure Basis" value="Per Vehicle" contractView={contractView} contractKey="db_location" contractVal='"composite.exposure_basis"' />
        </div>
      </div>
    </div>
  );
}

function FeesContent({ contractView }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Minimum premiums and policy fees applied at the policy level, independent of the rater calculation.</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Minimum Premium (per policy)" value="Not configured" contractView={contractView} contractKey="field" contractVal='"min_premium"' />
        <Field label="Minimum Premium (per vehicle)" value="Not configured" contractView={contractView} contractKey="field" contractVal='"min_premium_per_vehicle"' />
        <Field label="Policy Fee" value="Not configured" contractView={contractView} contractKey="field" contractVal='"policy_fee"' />
        <Field label="Stamping Fee (Non-Admitted)" value="N/A — Admitted product" locked contractView={contractView} contractKey="field" contractVal='"stamping_fee"' />
      </div>
    </div>
  );
}

function RaterSetupContent({ contractView }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Defines the external rater connection. Inputs tell PS what UW data to collect; outputs define where the rater's response gets stored in the policy.</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Rater Type" value="Excel Workbook (excel_api_v1)" contractView={contractView} contractKey="rater_type" contractVal='"excel_api"' />
        <Field label="Rating Trigger" value="Rate button on Coverages step" contractView={contractView} contractKey="trigger" contractVal='"button:rate"' />
        <Field label="Endpoint" value="POST /rater/calculate-values" contractView={contractView} contractKey="endpoint" contractVal='"/rater/calculate-values"' />
        <Field label="Auth" value="API Key" contractView={contractView} contractKey="auth.type" contractVal='"api_key"' />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="border border-gray-100 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Input Mappings (PS → Rater)</p>
          {[
            ["State", "policy.state → inputs.state"],
            ["CSL Limit", "policy.csl_limit → inputs.liability_limit"],
            ["Vehicle Class", "vehicle.vehicle_class → inputs.class"],
            ["Cost New", "vehicle.cost_new → inputs.cost_new"],
            ["Comp Deductible", "vehicle.ded_comp → inputs.ded_comp"],
          ].map(([label, mapping]) => (
            <div key={label} className="text-xs py-1 border-b border-gray-50 last:border-0">
              <span className="font-medium text-gray-700">{label}</span>
              <span className="text-gray-400 block font-mono text-xs">{mapping}</span>
            </div>
          ))}
        </div>
        <div className="border border-gray-100 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Output Mappings (Rater → Policy)</p>
          {[
            ["Total Premium", "rater_output.total → policy.total_premium"],
            ["Liability Prem", "rater_output.liability → policy.liab_prem"],
            ["Comp Premium", "rater_output.comp → policy.comp_prem"],
            ["Collision Prem", "rater_output.collision → policy.coll_prem"],
            ["Per Vehicle", "rater_output.per_vehicle → vehicle.premium"],
          ].map(([label, mapping]) => (
            <div key={label} className="text-xs py-1 border-b border-gray-50 last:border-0">
              <span className="font-medium text-gray-700">{label}</span>
              <span className="text-gray-400 block font-mono text-xs">{mapping}</span>
            </div>
          ))}
        </div>
      </div>
      {contractView && <ContractPanel snippet={CONTRACT_SNIPPETS.rater_setup} />}
    </div>
  );
}

function WorkflowContent() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Auto-generated from the sections above. This is the sequential UW experience a Maestro agent or underwriter navigates to collect rater inputs and trigger the rating API.</p>
      <div className="space-y-2">
        {WORKFLOW_STEPS.map((step, i) => (
          <div key={step.step} className={`border rounded-lg p-4 ${step.isRateStep ? "border-green-200 bg-green-50" : step.isOutput ? "border-blue-100 bg-blue-50" : "border-gray-100 bg-white"}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${step.isRateStep ? "bg-green-500 text-white" : step.isOutput ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                {step.step}
              </span>
              <p className="font-semibold text-gray-800 text-sm">{step.label}</p>
              <span className="text-xs text-gray-400 ml-auto">Source: {step.source}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 ml-10">
              {step.fields.map(f => (
                <span key={f} className={`text-xs px-2 py-0.5 rounded ${step.isRateStep ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{f}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-purple-50 border border-purple-100 rounded-lg px-4 py-3 text-xs text-purple-800">
        <strong>Maestro (Option 4):</strong> The Quote Agent uses the rater contract — not this step-by-step flow — to produce quotes programmatically. This workflow is the human UW experience; the contract is the machine interface. Both are derived from the same Product Definition.
      </div>
    </div>
  );
}

// ─── Shared UI atoms ──────────────────────────────────────────────────────────

function Field({ label, value, locked, contractView, contractKey, contractVal }) {
  return (
    <div className="border border-gray-100 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        {locked && <span className="text-xs">🔒</span>}
      </div>
      <p className="text-sm text-gray-800">{value}</p>
      {contractView && contractKey && (
        <p className="text-xs font-mono text-purple-600 mt-1.5">{contractKey}: {contractVal}</p>
      )}
    </div>
  );
}

function ContractPanel({ snippet }) {
  return (
    <div className="border border-purple-100 rounded-lg overflow-hidden">
      <div className="bg-purple-50 px-3 py-2 border-b border-purple-100 flex items-center gap-2">
        <span className="text-xs font-semibold text-purple-700">Rater Contract Schema (Option 4)</span>
        <span className="text-xs text-purple-400">— what Maestro builds against</span>
      </div>
      <pre className="p-4 text-xs text-gray-600 bg-gray-50 overflow-auto leading-relaxed">{snippet}</pre>
    </div>
  );
}

// ─── Section router ───────────────────────────────────────────────────────────

function SectionContent({ sectionId, contractView }) {
  switch (sectionId) {
    case "exposure":       return <ExposureContent contractView={contractView} />;
    case "classification": return <ClassificationContent contractView={contractView} />;
    case "territory":      return <TerritoryContent contractView={contractView} />;
    case "coverages":      return <CoveragesContent contractView={contractView} />;
    case "rating_factors": return <RatingFactorsContent contractView={contractView} />;
    case "adjustments":    return <AdjustmentsContent contractView={contractView} />;
    case "fees":           return <FeesContent contractView={contractView} />;
    case "rater_setup":    return <RaterSetupContent contractView={contractView} />;
    case "workflow":       return <WorkflowContent />;
    default:               return null;
  }
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeSection, setActiveSection] = useState("coverages");
  const [contractView, setContractView] = useState(false);

  const section = SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Product Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <div>
          <p className="text-xs text-gray-400">Products / Commercial Lines</p>
          <h1 className="text-base font-bold text-gray-900">Commercial Auto — Admitted Monoline</h1>
        </div>
        <div className="flex gap-2 ml-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">Admitted</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">Monoline</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">Draft</span>
        </div>
      </div>

      {/* Top Nav Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 flex gap-1">
        {NAV_TABS.map(tab => (
          <button
            key={tab}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "Product Definition"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex max-w-6xl mx-auto p-6 gap-5">
        {/* Left Section Nav */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Product Definition</p>
            </div>
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left border-b border-gray-50 last:border-0 transition-colors ${
                  activeSection === s.id ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="w-4 text-center flex-shrink-0 text-xs">{s.icon}</span>
                <span className="font-medium">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Section header + toggle */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{section.label}</h2>
              <p className="text-xs text-gray-400 mt-0.5">Commercial Auto · Admitted · Monoline</p>
            </div>
            {activeSection !== "workflow" && (
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setContractView(false)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${!contractView ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Product View
                </button>
                <button
                  onClick={() => setContractView(true)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${contractView ? "bg-purple-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Contract View (Maestro)
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionContent sectionId={activeSection} contractView={contractView} />
          </div>

          {/* Maestro alignment note */}
          {contractView && activeSection !== "workflow" && (
            <div className="mt-3 bg-purple-50 border border-purple-100 rounded-lg px-4 py-3 text-xs text-purple-800">
              <strong>Option 4 alignment:</strong> The contract schema for this section is auto-derivable from Product Definition. Product Studio IS the configuration UI for the rater contract — not a separate concept.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
