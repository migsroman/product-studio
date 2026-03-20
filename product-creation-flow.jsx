import { useState } from "react";

// ─── Nav Tab Definitions ──────────────────────────────────────────────────────

const NAV_TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: "◻",
    affected: [],
    getContent: () => ({
      type: "sections",
      sections: [
        {
          title: "Product Info",
          items: ["Name & description", "LOB type & LOB object", "Owner & created date"],
        },
        {
          title: "Product Type",
          note: "Set at creation — cannot be changed without creating a new version",
          items: ["Admitted / Non-Admitted", "Monoline / Package"],
          locked: true,
          tag: "Immutable",
          tagColor: "gray",
        },
        {
          title: "Status",
          items: ["Current lifecycle status", "Active version reference", "Quick links to Versions tab"],
        },
      ],
    }),
  },
  {
    id: "eligibility",
    label: "Eligibility",
    icon: "✓",
    affected: ["admitted"],
    getContent: (admitted) =>
      admitted
        ? {
            type: "sections",
            note: { text: "Rules sourced from regulatory filing. Changes require a new filing.", color: "blue" },
            sections: [
              {
                title: "State Availability",
                tag: "Filed",
                tagColor: "blue",
                locked: true,
                items: [
                  "Grid of states where product is filed & approved",
                  "Approval date per state",
                  "Effective date of filing",
                ],
              },
              {
                title: "Filed Rules",
                tag: "Filed",
                tagColor: "blue",
                locked: true,
                items: [
                  "Hard parameter limits from the filed product (GVW caps, fleet size, TIV bounds)",
                  "Excluded class codes per ISO form or filing",
                  "State-mandated minimum/maximum limits",
                  "Reinsurance treaty hard restrictions",
                  "Mandatory decline triggers",
                ],
              },
              {
                title: "Appetite Controls",
                tag: "Control Tower",
                tagColor: "green",
                linked: true,
                items: [
                  "Read-only view of active CT appetite rules for this product",
                  "Referral triggers, class preferences, geographic restrictions",
                  "→ Manage in Control Tower",
                ],
              },
            ],
          }
        : {
            type: "sections",
            note: { text: "No regulatory filing — hard limits sourced from reinsurance treaties and binding authority agreements.", color: "amber" },
            sections: [
              {
                title: "Surplus Lines States",
                items: [
                  "States where carrier is on the approved surplus lines carrier list",
                  "E&S placement eligibility status per state",
                ],
              },
              {
                title: "Treaty & Binding Authority Limits",
                tag: "Treaty",
                tagColor: "amber",
                locked: true,
                items: [
                  "Reinsurance treaty hard limits (max TIV, excluded classes, geography)",
                  "Binding authority parameter bounds (if MGA / coverholder model)",
                  "Hard decline triggers sourced from reinsurer or BA document",
                ],
              },
              {
                title: "Appetite Controls",
                tag: "Control Tower",
                tagColor: "green",
                linked: true,
                items: [
                  "Read-only view of active CT appetite rules for this product",
                  "Referral triggers, class preferences, geographic restrictions",
                  "→ Manage in Control Tower",
                ],
              },
            ],
          },
  },
  {
    id: "productdef",
    label: "Product Definition",
    icon: "⬡",
    affected: ["package"],
    getContent: (_admitted, pkg) =>
      pkg
        ? {
            type: "sections",
            note: { text: "Package: rater lives at the package level. Each LOB contributes coverages but the package rater unifies pricing.", color: "purple" },
            sections: [
              {
                title: "Coverages",
                items: [
                  "Coverage types, limits, and deductibles per LOB",
                  "Required vs. optional coverages across the package",
                  "Inter-LOB coverage dependencies",
                ],
              },
              {
                title: "Rating",
                tag: "Package Rater",
                tagColor: "purple",
                items: [
                  "Package-level rater (Excel workbook or external REST API)",
                  "Per-LOB rater configs if package uses component pricing",
                  "Input/output field mappings",
                ],
              },
              {
                title: "Workflow",
                items: [
                  "Unified sequential UW workflow spanning all LOBs in package",
                  "Auto-generated from package product definition",
                  "UW fills in rater inputs → rater returns unified quote",
                ],
              },
            ],
          }
        : {
            type: "sections",
            note: { text: "Monoline: rater lives at the LOB level. One product, one rater, one sequential workflow.", color: "gray" },
            sections: [
              {
                title: "Coverages",
                items: [
                  "Coverage types: limits, deductibles, and options",
                  "Required vs. optional coverages",
                  "State-level coverage overrides",
                ],
              },
              {
                title: "Rating",
                tag: "LOB Rater",
                tagColor: "blue",
                items: [
                  "LOB-level rater: Excel workbook upload or external REST API",
                  "Input field mappings (UW → rater)",
                  "Output field mappings (rater → quote)",
                ],
              },
              {
                title: "Workflow",
                items: [
                  "Sequential UW workflow auto-generated from product definition",
                  "UW fills in rater inputs step-by-step → rater returns quote",
                ],
              },
            ],
          },
  },
  {
    id: "forms",
    label: "Forms",
    icon: "▤",
    affected: [],
    getContent: () => ({
      type: "sections",
      sections: [
        {
          title: "Policy Forms",
          items: [
            "Attachment logic and conditional rules",
            'e.g. IF state = GA AND coverage = liability THEN attach form X',
            "Form sequencing and dependency rules",
          ],
        },
        {
          title: "Form Templates",
          items: [
            "PDF documents with data injection fields",
            "Field mapping: insured data → PDF placeholders",
            "Quote generation templates",
          ],
        },
      ],
    }),
  },
  {
    id: "operations",
    label: "Operations",
    icon: "⚙",
    affected: [],
    getContent: () => ({
      type: "sections",
      sections: [
        {
          title: "UW Guidelines",
          items: ["Internal guidelines surfaced during workflow", "Reference documents linked to workflow steps"],
        },
        {
          title: "LOAs",
          items: ["Authority grants by UW role and tier", "Referral thresholds and escalation paths"],
        },
        {
          title: "Notifications",
          items: ["Alerts, escalation rules, and SLA triggers"],
        },
      ],
    }),
  },
  {
    id: "versions",
    label: "Versions",
    icon: "◷",
    affected: ["admitted"],
    getContent: (admitted) => ({
      type: "versions",
      lifecycle: admitted
        ? ["Draft", "Under Filing", "Filed / Pending Response", "Active", "Archived"]
        : ["Draft", "Active", "Archived"],
      note: admitted
        ? "Filing workflow required before activation. Each component (Eligibility, Product Def, Forms, Operations) is independently versioned."
        : "No regulatory filing step — product moves directly from Draft to Active. Each component is still independently versioned.",
      color: admitted ? "blue" : "amber",
    }),
  },
];

// ─── Tag color map ────────────────────────────────────────────────────────────
const TAG_STYLES = {
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  green: "bg-green-100 text-green-700",
  purple: "bg-purple-100 text-purple-700",
  gray: "bg-gray-100 text-gray-500",
};

const LIFECYCLE_STYLES = {
  Draft: "bg-gray-100 border-gray-200 text-gray-600",
  "Under Filing": "bg-blue-50 border-blue-200 text-blue-700",
  "Filed / Pending Response": "bg-yellow-50 border-yellow-200 text-yellow-700",
  Active: "bg-green-50 border-green-200 text-green-700",
  Archived: "bg-gray-50 border-gray-200 text-gray-400",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionsContent({ content }) {
  return (
    <div className="space-y-3">
      {content.note && (
        <div className={`text-sm px-4 py-2.5 rounded-lg mb-4 ${
          content.note.color === "blue" ? "bg-blue-50 text-blue-800" :
          content.note.color === "amber" ? "bg-amber-50 text-amber-800" :
          content.note.color === "purple" ? "bg-purple-50 text-purple-800" :
          "bg-gray-50 text-gray-600"
        }`}>
          {content.note.text}
        </div>
      )}
      {content.sections.map((section, i) => (
        <div key={i} className="border border-gray-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
            {section.tag && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${TAG_STYLES[section.tagColor] || TAG_STYLES.gray}`}>
                {section.locked && <span>🔒</span>}
                {section.linked && <span>↗</span>}
                {section.tag}
              </span>
            )}
            {section.note && (
              <span className="text-xs text-gray-400 italic">{section.note}</span>
            )}
          </div>
          <ul className="space-y-1.5">
            {section.items.map((item, j) => (
              <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-gray-300 mt-0.5 flex-shrink-0">–</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function VersionsContent({ content }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {content.lifecycle.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`px-3 py-2 rounded-lg text-sm font-medium border ${LIFECYCLE_STYLES[step] || "bg-gray-50 border-gray-200 text-gray-600"}`}>
              {step}
            </div>
            {i < content.lifecycle.length - 1 && (
              <span className="text-gray-300 text-lg">→</span>
            )}
          </div>
        ))}
      </div>
      <div className={`text-sm px-4 py-3 rounded-lg ${
        content.color === "blue" ? "bg-blue-50 text-blue-800" : "bg-amber-50 text-amber-800"
      }`}>
        {content.note}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [admitted, setAdmitted] = useState(null);   // true | false | null
  const [pkg, setPkg] = useState(null);             // true | false | null
  const [activeTab, setActiveTab] = useState("overview");

  const ready = admitted !== null && pkg !== null;
  const currentTab = NAV_TABS.find((t) => t.id === activeTab);
  const tabContent = ready ? currentTab.getContent(admitted, pkg) : null;

  const productLabel = ready
    ? `${admitted ? "Admitted" : "Non-Admitted"} ${pkg ? "Package" : "Monoline"}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div className="max-w-5xl mx-auto p-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Product Studio — Creation Flow & Nav IA</h1>
          <p className="text-gray-400 text-sm mt-1">
            Click through the product type decisions below to see how the navigation adapts
          </p>
        </div>

        {/* ── Decision Flow ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Product Creation Decisions</p>

          <div className="flex items-center gap-3 flex-wrap">

            {/* Start */}
            <div className="bg-gray-900 text-white rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap">
              Create Product
            </div>

            <span className="text-gray-300 text-lg">→</span>

            {/* Step 1 */}
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-gray-400 text-center font-medium">Step 1 · Market type</p>
              <div className="flex gap-2">
                {[
                  { value: true, label: "Admitted", active: "bg-blue-600 text-white border-blue-600", inactive: "bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400", dim: "bg-gray-50 text-gray-300 border-gray-100" },
                  { value: false, label: "Non-Admitted", active: "bg-amber-500 text-white border-amber-500", inactive: "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400", dim: "bg-gray-50 text-gray-300 border-gray-100" },
                ].map(({ value, label, active, inactive, dim }) => (
                  <button
                    key={label}
                    onClick={() => setAdmitted(value)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                      admitted === value ? active : admitted !== null ? dim : inactive
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <span className={`text-gray-300 text-lg transition-opacity ${admitted !== null ? "opacity-100" : "opacity-20"}`}>→</span>

            {/* Step 2 */}
            <div className={`flex flex-col gap-1.5 transition-opacity ${admitted !== null ? "opacity-100" : "opacity-30"}`}>
              <p className="text-xs text-gray-400 text-center font-medium">Step 2 · Structure</p>
              <div className="flex gap-2">
                {[
                  { value: false, label: "Monoline", active: "bg-gray-800 text-white border-gray-800", inactive: "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400", dim: "bg-gray-50 text-gray-300 border-gray-100" },
                  { value: true, label: "Package", active: "bg-purple-600 text-white border-purple-600", inactive: "bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400", dim: "bg-gray-50 text-gray-300 border-gray-100" },
                ].map(({ value, label, active, inactive, dim }) => (
                  <button
                    key={label}
                    onClick={() => admitted !== null && setPkg(value)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                      pkg === value ? active : pkg !== null ? dim : inactive
                    } ${admitted === null ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {ready && (
              <>
                <span className="text-gray-300 text-lg">→</span>
                <div className={`px-4 py-2.5 rounded-lg text-sm font-bold border-2 ${
                  admitted ? "bg-blue-600 text-white border-blue-600" : "bg-amber-500 text-white border-amber-500"
                }`}>
                  {productLabel}
                </div>
                <button
                  onClick={() => { setAdmitted(null); setPkg(null); setActiveTab("overview"); }}
                  className="text-xs text-gray-400 hover:text-gray-600 underline ml-1"
                >
                  reset
                </button>
              </>
            )}
          </div>

          {/* Decision impact summary */}
          {ready && (
            <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3 flex-wrap">
              <span className="text-xs text-gray-400 font-medium self-center">Nav impacts:</span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${admitted ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                {admitted ? "Eligibility uses Filed Rules + State approvals" : "Eligibility uses Treaty/BA Limits + SL States"}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${pkg ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                {pkg ? "Product Def: package-level rater across LOBs" : "Product Def: LOB-level rater, single workflow"}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${admitted ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                {admitted ? "Versions: includes filing workflow stages" : "Versions: Draft → Active (no filing steps)"}
              </span>
            </div>
          )}
        </div>

        {/* ── Nav + Content Panel ───────────────────────────────────────────── */}
        {ready ? (
          <div className="flex gap-5">

            {/* Left Nav */}
            <div className="w-52 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-3">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{productLabel}</p>
                </div>
                {NAV_TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const byAdmitted = tab.affected.includes("admitted");
                  const byPackage = tab.affected.includes("package");
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left border-b border-gray-50 last:border-b-0 transition-colors ${
                        isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-base w-5 text-center flex-shrink-0">{tab.icon}</span>
                      <span className="font-medium flex-1">{tab.label}</span>
                      <div className="flex gap-1">
                        {byAdmitted && (
                          <span
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${admitted ? "bg-blue-400" : "bg-amber-400"}`}
                            title="Affected by Admitted/Non-Admitted"
                          />
                        )}
                        {byPackage && (
                          <span
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${pkg ? "bg-purple-400" : "bg-gray-400"}`}
                            title="Affected by Monoline/Package"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Dot legend</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${admitted ? "bg-blue-400" : "bg-amber-400"}`} />
                    <span className="text-xs text-gray-500">Varies by market type</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${pkg ? "bg-purple-400" : "bg-gray-400"}`} />
                    <span className="text-xs text-gray-500">Varies by structure</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">🔒</span>
                    <span className="text-xs text-gray-500">Locked / regulatory</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">↗</span>
                    <span className="text-xs text-gray-500">Links to Control Tower</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Panel */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Tab header */}
                <div className={`px-6 py-4 border-b border-gray-100 ${
                  currentTab.affected.includes("admitted")
                    ? admitted ? "bg-blue-50" : "bg-amber-50"
                    : currentTab.affected.includes("package")
                    ? pkg ? "bg-purple-50" : "bg-gray-50"
                    : "bg-gray-50"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{currentTab.icon}</span>
                      <div>
                        <h2 className="text-base font-bold text-gray-900">{currentTab.label}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {currentTab.affected.length === 0
                            ? "Same for all product types"
                            : `Content varies — driven by ${
                                currentTab.affected
                                  .map((a) =>
                                    a === "admitted"
                                      ? admitted ? "Admitted selection" : "Non-Admitted selection"
                                      : pkg ? "Package selection" : "Monoline selection"
                                  )
                                  .join(" + ")
                              }`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {tabContent.type === "versions" ? (
                    <VersionsContent content={tabContent} />
                  ) : (
                    <SectionsContent content={tabContent} />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 p-16 text-center">
            <p className="text-gray-300 text-sm">Make your selections above to see how the navigation adapts</p>
          </div>
        )}

      </div>
    </div>
  );
}
