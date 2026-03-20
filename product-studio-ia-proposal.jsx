import { useState } from "react";

// ─── Color Palette ──────────────────────────────────────────────────────────
const COLORS = {
  fde: { bg: "#EFF6FF", border: "#BFDBFE", text: "#1E40AF", light: "#DBEAFE", accent: "#3B82F6", badge: "#1D4ED8" },
  pm: { bg: "#F0FDF4", border: "#BBF7D0", text: "#166534", light: "#DCFCE7", accent: "#22C55E", badge: "#15803D" },
  shared: { bg: "#FDF4FF", border: "#E9D5FF", text: "#6B21A8", light: "#F3E8FF", accent: "#A855F7", badge: "#7C3AED" },
  neutral: { bg: "#F9FAFB", border: "#E5E7EB", text: "#374151", light: "#F3F4F6", accent: "#6B7280" },
  warn: { bg: "#FFFBEB", border: "#FDE68A", text: "#92400E", accent: "#F59E0B" },
};

// ─── Data Model ─────────────────────────────────────────────────────────────
const CURRENT_STATE = {
  module: "Rater Configuration",
  persona: "Mixed (FDE + PM)",
  steps: [
    {
      id: "rater",
      label: "Step 1: Rater Connection",
      persona: "fde",
      items: ["Upload workbook / connect endpoint", "Detect inputs & outputs via color coding", "Validate rater schema"],
    },
    {
      id: "mapping",
      label: "Step 2: Schema Mapping",
      persona: "fde",
      items: ["Map rater fields → Federato database columns", "Schema Sense auto-matching", "Semantic category assignment"],
    },
    {
      id: "coverage",
      label: "Step 3: Product Configuration",
      persona: "mixed",
      items: [
        "Coverage toggles & config (PM concern)",
        "Field definitions with source types (FDE concern)",
        "Visibility conditions & option filters (PM concern)",
        "Source detail paths & schema links (FDE concern)",
        "Linked field relationships (shared)",
      ],
    },
    {
      id: "workflow",
      label: "Step 4: Workflow Builder",
      persona: "pm",
      items: ["Assign fields to workflow steps", "Auto-generated vs custom steps", "Field ordering & grouping", "Inherited conditions (read-only from Step 3)"],
    },
    {
      id: "preview",
      label: "Step 5: Workflow Preview",
      persona: "pm",
      items: ["Live underwriter form preview", "Conditional visibility in action", "Option filtering in action"],
    },
  ],
};

const PROPOSED_STATE = {
  modules: [
    {
      id: "rater-config",
      label: "Rater Configuration",
      persona: "fde",
      personaLabel: "FDE / Technical",
      icon: "⚙️",
      description: "Technical wiring — how data flows into and through the rater",
      sections: [
        {
          label: "Rater Connection",
          items: ["Upload workbook / connect endpoint", "Detect inputs & outputs", "Validate rater schema"],
        },
        {
          label: "Schema Mapping (Graph)",
          items: [
            "Map rater fields → database columns",
            "Schema Sense auto-matching",
            "Link Schema Sense configs to each other",
            "Define dependency chains (field A → API → field B → rater input)",
            "Internal-to-internal mapping",
          ],
          isNew: true,
        },
        {
          label: "Data Source Configuration",
          items: [
            "Source types (rater, database, API, submission, user input, form)",
            "Source detail paths (cell refs, API endpoints)",
            "Dependency graph visualization",
            "Transformation definitions (API calls, lookups)",
          ],
          isNew: true,
        },
      ],
      williamsQuotes: [
        "\"This is really more like rater configuration... it's completely different from what a product manager is actually trying to do.\"",
        "\"All the nodes are just fields in our database and all the edges are effectively transformations or workflows.\"",
        "\"Schema Sense should be a graph.\"",
      ],
    },
    {
      id: "product-definition",
      label: "Product Definition",
      persona: "pm",
      personaLabel: "Product Manager",
      icon: "📋",
      description: "Business logic — what the product offers and how underwriters interact with it",
      sections: [
        {
          label: "Coverages & Options",
          items: [
            "Coverage toggles (liability, comp, collision, etc.)",
            "Deductible & limit options per coverage",
            "State-specific coverage rules",
            "Form attachment rules",
          ],
        },
        {
          label: "Field Definitions (PM View)",
          items: [
            "Available fields (sourced from rater config)",
            "Visibility conditions (show field X when Y = Z)",
            "Option-level conditions (filter values by state)",
            "Linked field relationships",
            "Choose: show this field OR its upstream inputs",
          ],
          isNew: true,
        },
        {
          label: "Workflow Builder",
          items: [
            "Assign fields to sequential steps",
            "Auto-generated vs PM-added steps",
            "Field ordering & drag-to-reorder",
            "Unassigned field pool",
          ],
        },
        {
          label: "Workflow Preview",
          items: ["Live underwriter form preview", "Conditional visibility", "Option filtering", "Data flow indicators"],
        },
      ],
      williamsQuotes: [
        "\"They don't care where the fields come from. They care about managing the product — what deductibles do we offer, what coverages.\"",
        "\"When defining the workflow UI, you need to be able to select: do I want to show this field or the sources of this field?\"",
      ],
    },
  ],
  handoff: {
    label: "The Handoff",
    description: "Rater Config publishes a set of available fields with their dependency graphs resolved. Product Definition consumes those fields as building blocks.",
    items: [
      { from: "Rater Config", to: "Product Definition", label: "Available field inventory (names, types, categories)" },
      { from: "Rater Config", to: "Product Definition", label: "Resolved source metadata (where each field comes from)" },
      { from: "Rater Config", to: "Product Definition", label: "Dependency graph (which fields feed into which)" },
      { from: "Product Definition", to: "Rater Config", label: "PM can trigger 'show upstream inputs' — needs graph data" },
    ],
  },
};

const SIDEBAR_PROPOSED = [
  { id: "overview", label: "Overview", icon: "🏠", persona: null },
  { id: "eligibility", label: "Eligibility Rules", icon: "🛡️", persona: "pm" },
  { id: "forms", label: "Policy Forms", icon: "📄", persona: "pm" },
  { id: "rater-config", label: "Rater Configuration", icon: "⚙️", persona: "fde", isChanged: true },
  { id: "product-definition", label: "Product Definition", icon: "📋", persona: "pm", isNew: true },
  { id: "lifecycle", label: "Policy Life Cycle", icon: "🔄", persona: "pm" },
  { id: "layouts", label: "Layouts", icon: "🖼️", persona: null },
  { id: "versions", label: "Versions", icon: "🌿", persona: null },
];

// ─── Components ─────────────────────────────────────────────────────────────

function PersonaBadge({ persona, size = "sm" }) {
  const config = {
    fde: { label: "FDE / Technical", color: COLORS.fde },
    pm: { label: "Product Manager", color: COLORS.pm },
    mixed: { label: "Mixed Personas", color: COLORS.warn },
    shared: { label: "Shared", color: COLORS.shared },
  };
  const c = config[persona] || config.shared;
  const sizeClass = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span
      className={`${sizeClass} font-semibold rounded-full inline-flex items-center gap-1`}
      style={{ backgroundColor: c.color.light, color: c.color.badge, border: `1px solid ${c.color.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color.accent }} />
      {c.label}
    </span>
  );
}

function QuoteBlock({ quotes }) {
  if (!quotes || quotes.length === 0) return null;
  return (
    <div className="mt-4 space-y-2">
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">William's Feedback</div>
      {quotes.map((q, i) => (
        <div key={i} className="text-xs text-gray-500 italic border-l-2 border-gray-200 pl-3 py-1 leading-relaxed">
          {q}
        </div>
      ))}
    </div>
  );
}

function CurrentStateView() {
  const [expandedStep, setExpandedStep] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-gray-100 rounded-lg px-3 py-1.5">
          <span className="text-sm font-semibold text-gray-700">Single Module: "Rater Configuration"</span>
        </div>
        <PersonaBadge persona="mixed" size="md" />
      </div>

      <div className="text-xs text-gray-500 mb-4 max-w-xl">
        Everything lives in one sequential flow (Steps 1→5) under one sidebar module. FDE-level schema work and PM-level product decisions are interleaved, especially in Step 3.
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200" />

        <div className="space-y-3">
          {CURRENT_STATE.steps.map((step, idx) => {
            const isExpanded = expandedStep === step.id;
            const personaColor = step.persona === "fde" ? COLORS.fde : step.persona === "pm" ? COLORS.pm : COLORS.warn;

            return (
              <div key={step.id} className="relative">
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  className="w-full flex items-start gap-3 text-left group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm relative z-10 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: personaColor.light, color: personaColor.text, border: `2px solid ${personaColor.border}` }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800">{step.label}</span>
                      <PersonaBadge persona={step.persona} />
                      <svg
                        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                    {isExpanded && (
                      <div className="mt-2 space-y-1.5 pb-2">
                        {step.items.map((item, i) => {
                          const isFDE = item.includes("(FDE");
                          const isPM = item.includes("(PM");
                          const itemColor = isFDE ? COLORS.fde : isPM ? COLORS.pm : COLORS.neutral;
                          return (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs rounded-md px-2.5 py-1.5"
                              style={{ backgroundColor: isFDE || isPM ? itemColor.bg : "transparent", color: itemColor.text }}
                            >
                              <span className="mt-0.5 flex-shrink-0" style={{ color: itemColor.accent }}>
                                {isFDE ? "🔧" : isPM ? "📋" : "•"}
                              </span>
                              <span>{item}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Problem callout */}
      <div
        className="mt-6 rounded-xl p-4"
        style={{ backgroundColor: COLORS.warn.bg, border: `1px solid ${COLORS.warn.border}` }}
      >
        <div className="flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <div>
            <div className="text-sm font-semibold" style={{ color: COLORS.warn.text }}>Problem: Persona Bleed</div>
            <div className="text-xs mt-1" style={{ color: COLORS.warn.text }}>
              Step 3 mixes technical data mapping (source types, schema paths, dependency chains) with business-level product decisions
              (coverage toggles, conditions, form rules). This forces PMs into technical territory and buries business logic inside
              rater wiring screens.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProposedStateView() {
  const [expandedModule, setExpandedModule] = useState("rater-config");
  const [expandedSection, setExpandedSection] = useState(null);

  return (
    <div className="space-y-6">
      {/* Sidebar preview */}
      <div>
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Proposed Sidebar</div>
        <div className="flex flex-wrap gap-1.5">
          {SIDEBAR_PROPOSED.map(item => {
            const c = item.persona === "fde" ? COLORS.fde : item.persona === "pm" ? COLORS.pm : COLORS.neutral;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "rater-config" || item.id === "product-definition") {
                    setExpandedModule(item.id);
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: (expandedModule === item.id) ? c.text : c.bg,
                  color: (expandedModule === item.id) ? "#fff" : c.text,
                  border: `1px solid ${(expandedModule === item.id) ? c.text : c.border}`,
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.isNew && (
                  <span className="text-[9px] bg-green-500 text-white px-1.5 py-0 rounded-full font-bold">NEW</span>
                )}
                {item.isChanged && (
                  <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0 rounded-full font-bold">CHANGED</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Module detail cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {PROPOSED_STATE.modules.map(mod => {
          const c = mod.persona === "fde" ? COLORS.fde : COLORS.pm;
          const isActive = expandedModule === mod.id;

          return (
            <div
              key={mod.id}
              className="rounded-xl overflow-hidden transition-all"
              style={{
                border: `2px solid ${isActive ? c.accent : c.border}`,
                boxShadow: isActive ? `0 0 0 3px ${c.light}` : "none",
              }}
            >
              {/* Module header */}
              <button
                onClick={() => setExpandedModule(isActive ? null : mod.id)}
                className="w-full text-left p-4 transition-colors"
                style={{ backgroundColor: isActive ? c.bg : "#fff" }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{mod.icon}</span>
                    <div>
                      <div className="text-sm font-bold" style={{ color: c.text }}>{mod.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{mod.description}</div>
                    </div>
                  </div>
                  <PersonaBadge persona={mod.persona} size="md" />
                </div>
              </button>

              {/* Sections */}
              {isActive && (
                <div className="border-t" style={{ borderColor: c.border }}>
                  {mod.sections.map((section, sIdx) => {
                    const sKey = `${mod.id}-${sIdx}`;
                    const sExpanded = expandedSection === sKey;
                    return (
                      <div key={sIdx} className="border-b last:border-b-0" style={{ borderColor: c.border }}>
                        <button
                          onClick={() => setExpandedSection(sExpanded ? null : sKey)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
                              style={{ backgroundColor: c.light, color: c.text }}
                            >
                              {sIdx + 1}
                            </div>
                            <span className="text-sm font-medium text-gray-800">{section.label}</span>
                            {section.isNew && (
                              <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0 rounded-full font-bold">NEW</span>
                            )}
                          </div>
                          <svg
                            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            className={`text-gray-400 transition-transform ${sExpanded ? "rotate-180" : ""}`}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                        {sExpanded && (
                          <div className="px-4 pb-3 space-y-1.5">
                            {section.items.map((item, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="mt-0.5 flex-shrink-0" style={{ color: c.accent }}>▸</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* William quotes */}
                  <div className="px-4 pb-4">
                    <QuoteBlock quotes={mod.williamsQuotes} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Handoff section */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: COLORS.shared.bg, border: `2px solid ${COLORS.shared.border}` }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🔗</span>
          <span className="text-sm font-bold" style={{ color: COLORS.shared.text }}>{PROPOSED_STATE.handoff.label}</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">{PROPOSED_STATE.handoff.description}</p>
        <div className="space-y-2">
          {PROPOSED_STATE.handoff.items.map((item, i) => {
            const isReverse = item.from === "Product Definition";
            return (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span
                  className="px-2 py-1 rounded font-medium flex-shrink-0"
                  style={{
                    backgroundColor: isReverse ? COLORS.pm.light : COLORS.fde.light,
                    color: isReverse ? COLORS.pm.text : COLORS.fde.text,
                  }}
                >
                  {item.from}
                </span>
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="flex-shrink-0">
                  <line x1="0" y1="6" x2="16" y2="6" stroke={COLORS.shared.accent} strokeWidth="1.5" />
                  <polygon points="20,6 14,2 14,10" fill={COLORS.shared.accent} />
                </svg>
                <span
                  className="px-2 py-1 rounded font-medium flex-shrink-0"
                  style={{
                    backgroundColor: isReverse ? COLORS.fde.light : COLORS.pm.light,
                    color: isReverse ? COLORS.fde.text : COLORS.pm.text,
                  }}
                >
                  {item.to}
                </span>
                <span className="text-gray-500 ml-1">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DataFlowDiagram() {
  // Simple visual showing the graph concept William described
  const nodes = [
    { id: "address", x: 60, y: 40, label: "Address", type: "user-input", desc: "UW enters" },
    { id: "iso_api", x: 230, y: 40, label: "ISO API", type: "transformation", desc: "Schema Sense" },
    { id: "iso_score", x: 400, y: 40, label: "ISO Score", type: "database", desc: "Stored in DB" },
    { id: "state", x: 60, y: 130, label: "State", type: "database", desc: "From submission" },
    { id: "vehicle_class", x: 230, y: 130, label: "Vehicle Class", type: "database", desc: "From DB" },
    { id: "cost_new", x: 60, y: 220, label: "Cost New", type: "user-input", desc: "UW enters" },
    { id: "rater", x: 400, y: 150, label: "RATER", type: "rater", desc: "Premium output" },
  ];

  const edges = [
    { from: "address", to: "iso_api" },
    { from: "iso_api", to: "iso_score" },
    { from: "iso_score", to: "rater" },
    { from: "state", to: "rater" },
    { from: "vehicle_class", to: "rater" },
    { from: "cost_new", to: "rater" },
  ];

  const typeColors = {
    "user-input": { fill: "#D1FAE5", stroke: "#10B981", text: "#065F46" },
    "transformation": { fill: "#FEF3C7", stroke: "#F59E0B", text: "#92400E" },
    "database": { fill: "#DBEAFE", stroke: "#3B82F6", text: "#1E40AF" },
    "rater": { fill: "#1E293B", stroke: "#475569", text: "#F8FAFC" },
  };

  const getNodeCenter = (id) => {
    const n = nodes.find(n => n.id === id);
    return { x: n.x + 55, y: n.y + 22 };
  };

  return (
    <div className="space-y-3">
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
        William's Graph Model — Example: ISO Score Dependency Chain
      </div>
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 overflow-x-auto">
        <svg width="520" height="280" viewBox="0 0 520 280">
          {/* Edges */}
          {edges.map((e, i) => {
            const from = getNodeCenter(e.from);
            const to = getNodeCenter(e.to);
            return (
              <g key={i}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#CBD5E1" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
              </g>
            );
          })}

          {/* Arrow marker */}
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#94A3B8" />
            </marker>
          </defs>

          {/* Nodes */}
          {nodes.map(n => {
            const tc = typeColors[n.type];
            return (
              <g key={n.id}>
                <rect
                  x={n.x} y={n.y}
                  width={n.type === "rater" ? 110 : 110} height={44}
                  rx="8" ry="8"
                  fill={tc.fill} stroke={tc.stroke} strokeWidth="1.5"
                />
                <text x={n.x + 55} y={n.y + 18} textAnchor="middle" fill={tc.text} fontSize="11" fontWeight="600">
                  {n.label}
                </text>
                <text x={n.x + 55} y={n.y + 32} textAnchor="middle" fill={tc.text} fontSize="9" opacity="0.7">
                  {n.desc}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
          {[
            { type: "user-input", label: "User Input (UW)" },
            { type: "transformation", label: "Transformation (API/Schema Sense)" },
            { type: "database", label: "Database Field" },
            { type: "rater", label: "Rater" },
          ].map(l => (
            <div key={l.type} className="flex items-center gap-1.5 text-[10px] text-gray-500">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: typeColors[l.type].fill, border: `1px solid ${typeColors[l.type].stroke}` }}
              />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500 leading-relaxed max-w-lg">
        <span className="font-medium text-gray-700">Key insight:</span> The PM building the workflow sees "Address" as a field
        to show the underwriter. They don't need to know it feeds an ISO API. They just choose: "show the address field" (an
        upstream input) instead of "show the ISO score" (the derived value). The graph resolves the rest.
      </div>
    </div>
  );
}

function KeyDecisions() {
  const decisions = [
    {
      question: "Where do field definitions live?",
      current: "Mixed into Step 3 alongside coverage toggles",
      proposed: "Technical source/mapping config in Rater Config; business rules (conditions, options) in Product Definition",
      williamSays: "You're editing the UI, which is not what I'm talking about. I think you should be editing that in the schema mapping itself.",
    },
    {
      question: "How does schema mapping work?",
      current: "Flat table: rater field → database column",
      proposed: "Graph: Schema Sense configs link to each other. Dependencies chain. Internal-to-internal mapping.",
      williamSays: "You can link schema sense schemas to each other... this field is populated by the output field of this schema sense config.",
    },
    {
      question: "What does the PM see for each field?",
      current: "Full source detail, schema paths, and conditions all in one panel",
      proposed: "Available fields with resolved types. PM chooses: show this field or its upstream inputs. Conditions & business rules only.",
      williamSays: "You need to select: do I want to show this field or do I want to show the sources of this field?",
    },
    {
      question: "Is the flow sequential (1→2→3→4)?",
      current: "Yes, strict step progression",
      proposed: "Rater Config and Product Definition are parallel modules, not sequential steps. Within each, steps may not be strictly linear.",
      williamSays: "It might not make sense, especially when you start thinking about maintaining this.",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Key Decisions</div>
      {decisions.map((d, i) => (
        <div key={i} className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2.5">
            <span className="text-sm font-semibold text-gray-800">{d.question}</span>
          </div>
          <div className="px-4 py-3 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">NOW</span>
              <span className="text-xs text-gray-600">{d.current}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[10px] font-bold text-white bg-emerald-600 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">NEXT</span>
              <span className="text-xs text-gray-700 font-medium">{d.proposed}</span>
            </div>
            <div className="text-xs text-gray-400 italic border-l-2 border-gray-200 pl-2 mt-1">{d.williamSays}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ProductStudioIAProposal() {
  const [view, setView] = useState("proposed"); // current | proposed | graph | decisions

  const tabs = [
    { id: "current", label: "Current State", icon: "📍" },
    { id: "proposed", label: "Proposed Split", icon: "✨" },
    { id: "graph", label: "Data Flow Graph", icon: "🔀" },
    { id: "decisions", label: "Key Decisions", icon: "🎯" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Product Studio — Information Architecture Proposal</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Separating Rater Configuration (FDE) from Product Definition (PM) — based on William's March 17 feedback
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <PersonaBadge persona="fde" size="md" />
              <PersonaBadge persona="pm" size="md" />
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-1 mt-4 -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                  view === tab.id
                    ? "border-gray-900 text-gray-900 bg-gray-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        {view === "current" && <CurrentStateView />}
        {view === "proposed" && <ProposedStateView />}
        {view === "graph" && <DataFlowDiagram />}
        {view === "decisions" && <KeyDecisions />}
      </div>
    </div>
  );
}
