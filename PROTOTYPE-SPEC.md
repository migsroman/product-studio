# Product Studio — E2E Prototype Spec

**Author:** Miguel Roman
**Date:** March 19, 2026
**Status:** Draft v2 — updated with Miguel's feedback (Mar 19)
**Demo LOB:** Habitational GL (Ascendex Underwriters)
**Prototype type:** Interactive React (Vite + Tailwind), Federato UI shell

---

## 1. Purpose & Audience

This prototype demonstrates the full Product Studio V1 (Poseidon) experience — from product list to product operations — using Federato's production UI patterns. It is designed for:

- **William / Shan** — validate the consolidated product definition experience
- **Zohaib / Mitch** — design review and IA heuristic feedback
- **Jesse / Engineering** — understand scope and surface area for implementation
- **Prospects / GTM** — demo the vision at trade shows and sales calls

The prototype uses **Habitational GL** as the primary LOB to showcase the per-location field cardinality and array scoping discovered in the Mar 18 prototyping session.

---

## 2. Scope Summary

### Pages (9 total)

| # | Page | Interactivity | Notes |
|---|------|---------------|-------|
| 1 | Product Studio List | Interactive | Three tabs: Products, Policy Form Library, Lines of Business |
| 2 | Product Create | Interactive | Single-step modal: name, description, dates, states, admitted/non-admitted |
| 3 | Product Detail | Interactive | Overview/summary with version info, status, metadata panel |
| 4 | Eligibility Rules | Interactive | Hard ineligibility gates (not appetite). Binary: pass → continue, fail → decline |
| 5 | Policy Forms | Visual mock | Single unified table with Type column + lock icon for required forms |
| 6 | Data Mapping | Interactive | Rater field → Federato field mapping table with auto-mapping |
| 7 | Rater Workflow | Interactive | Sequential workflow builder with generated steps from data graph |
| 8 | Product Operations | Visual mock | Policy lifecycle + billing settings cards |
| 9 | Policy Page Layouts | Visual mock | Widget-based layout configurator |

### What's NOT in scope

- Actual backend / API integration
- Persona split (FDE blue / PM green) — deferred; using unified tab view per Blitz UX
- Progressive workflow generation with confidence scoring — deferred to next iteration
- State variations UI
- Version diff / audit trail display
- Custom field addition at LOB Object level

---

## 3. Federato UI Shell

The prototype must render inside Federato's production app chrome. This sets the visual foundation for every page.

### 3.1 Global Layout

```
┌─────────────────────────────────────────────────────────┐
│  Top Bar (48px, dark charcoal #1E1E2D)                  │
│  [FEDERATO logo white] [ASCENDEXUM TEST green badge]    │
│  right: [pencil] [zap] [gear] [avatar]                  │
├──────────┬──────────────────────────────────────────────┤
│          │  Breadcrumb: Admin > Product Studio           │
│  Left    │  Page Title: Product Studio                   │
│  Nav     │                                              │
│  (56px   │  Content Area                                │
│  icons   │                                              │
│  only)   │                                              │
│          │                                              │
│  🏠 ⚡ 📋│                                              │
│  🗂 🛡 ⚙│                                              │
│  📦←act │                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

> **Figma observation (Product Create frame):** The left nav is icon-only (narrow, ~56px),
> not a full sidebar with labels. The top bar uses a dark charcoal background with the
> FEDERATO wordmark in white and a green carrier badge. Breadcrumb format is "Admin > Product Studio".
> The "Create Product" button is green/teal, not purple.

### 3.2 Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--fed-primary` | `#6B4EFF` (Federato purple) | Primary actions, active nav, accent |
| `--fed-primary-light` | `#EDE9FF` | Selected states, badges, hover bg |
| `--fed-surface` | `#FFFFFF` | Card backgrounds, content area |
| `--fed-bg` | `#F5F5F7` | Page background |
| `--fed-sidebar` | `#1A1A2E` | Left nav background (dark) |
| `--fed-sidebar-text` | `#A0A0B8` | Nav item text |
| `--fed-sidebar-active` | `#FFFFFF` | Active nav item text |
| `--fed-text-primary` | `#1A1A2E` | Headings, primary text |
| `--fed-text-secondary` | `#6B7280` | Labels, descriptions |
| `--fed-border` | `#E5E7EB` | Card borders, dividers |
| `--fed-success` | `#10B981` | Active/published status |
| `--fed-warning` | `#F59E0B` | Draft/under filing status |
| `--fed-danger` | `#EF4444` | Declined/excluded/errors |
| `--fed-info` | `#3B82F6` | Info callouts |
| Font family | `Inter, system-ui, sans-serif` | All text |
| Font size base | `14px` | Body text |
| Border radius | `8px` (cards), `6px` (buttons), `4px` (inputs) | Consistent rounding |

### 3.3 Component Patterns

- **Cards**: White bg, 1px border `--fed-border`, 8px radius, `0 1px 3px rgba(0,0,0,0.06)` shadow
- **Tables**: Striped rows (`#FAFAFA` alt), sticky header, 14px text, sortable columns
- **Status badges**: Pill shape, 12px text, colored bg+text per status
- **Tabs**: Underline style, `--fed-primary` active indicator, 14px medium weight
- **Buttons**: Primary = filled purple, Secondary = outlined, Tertiary = ghost
- **Modals**: Centered, 480-640px wide, dimmed overlay at `rgba(0,0,0,0.4)`

---

## 4. Demo Data: Habitational GL (Ascendex Underwriters)

### 4.1 Carrier Context

- **Carrier:** Ascendex Underwriters
- **Product:** Habitational General Liability
- **LOB Type:** General Liability
- **LOB Object:** Ascendex Habitational GL
- **States:** NY, NJ, CT, PA, MA
- **Version:** v2.1 (Draft)
- **Rater:** `ascendex-hab-gl-rater-v3.xlsx`

### 4.2 Rater Workbook Structure (from `sample-workbook.xlsx`)

| Sheet | Cardinality | Max Items | Driven By | Fields |
|-------|-------------|-----------|-----------|--------|
| Inputs | Single (account) | 1 | — | 8 account-level fields |
| Inputs_Loc | Array (per-location) | 10 | `num_locations` | 9 fields × 10 locations |
| Coverages | Mixed | — | — | 8 account + 7 per-location |
| RateFactors | Array (per-location) | 10 | `num_locations` | 8 factors × 10 locations |
| Ind_RF | Lookup (reference) | 19 | — | Industry class table |

### 4.3 Account-Level Fields

| Field | Type | Source | Rater Cell |
|-------|------|--------|------------|
| `policy_effective_date` | date | UW input | Inputs!B3 |
| `policy_expiration_date` | date | UW input | Inputs!B4 |
| `num_locations` | integer | UW input | Inputs!B6 |
| `total_payroll` | currency | UW input | Inputs!B8 |
| `years_in_operation` | integer | UW input | Inputs!B10 |
| `prior_carrier` | string | UW input | Inputs!B12 |
| `claims_count_3yr` | integer | UW input | Inputs!B14 |
| `total_incurred_3yr` | currency | UW input | Inputs!B16 |

### 4.4 Per-Location Fields (× up to 10 locations)

| Field | Type | Scope | Rater Sheet |
|-------|------|-------|-------------|
| `location_address` | string | per-location | Inputs_Loc |
| `location_state` | enum | per-location | Inputs_Loc |
| `building_age` | integer | per-location | Inputs_Loc |
| `construction_type` | enum | per-location | Inputs_Loc |
| `occupancy_type` | enum | per-location | Inputs_Loc |
| `num_units` | integer | per-location | Inputs_Loc |
| `square_footage` | integer | per-location | Inputs_Loc |
| `protection_class` | enum (1-10) | per-location | Inputs_Loc |
| `crime_score` | integer | per-location (synthetic) | Inputs_Loc |

### 4.5 Coverages

**Account-level coverages:**
- General Aggregate Limit: $1M / $2M options
- Products-Completed Operations Aggregate: $1M / $2M
- Personal & Advertising Injury: $1M
- Damage to Rented Premises: $100K / $300K / $500K
- Medical Expense: $5K / $10K
- Hired & Non-Owned Auto: optional add-on
- Employee Benefits Liability: optional add-on
- Umbrella/Excess: optional, $1M-$5M

**Per-location coverages:**
- Each Occurrence Limit: $1M / $2M
- Premises Medical Payments: $5K / $10K
- Tenant Legal Liability: $50K / $100K / $300K
- Fire Legal Liability: $50K / $100K
- Assault & Battery: sublimit options
- Building Coverage (if added): per TIV
- Loss of Rents: 12/18/24 months

### 4.6 UW Risk Factors (all per-location, scored 1-5)

| Factor | Description | Weight |
|--------|-------------|--------|
| Years in Operation | Tenure of building management | 15% |
| Operational Excellence | Maintenance, safety protocols | 15% |
| Claim History | Location-specific loss experience | 20% |
| Endorsement Factor | Additional coverages complexity | 10% |
| Premises Condition | Physical state of property | 15% |
| Complexity of Risk | Mixed-use, high-rise, etc. | 10% |
| LRO Complexity | Liquor/restaurant operations | 10% |
| Vacant Land Factor | Vacant/undeveloped parcels | 5% |

### 4.7 Ineligibility Rules (Hard Gates)

> **Design principle:** These are hard cutoffs that filter out a submission before it
> reaches underwriting. This is NOT appetite — appetite lives in Control Tower. Every rule
> here is binary: the submission either clears the gate or is declined. No "refer" outcomes.

| Rule | Condition to PASS | Fail = Decline |
|------|-------------------|----------------|
| Location Count | 1-25 locations | > 25 locations: auto-decline |
| Loss Ratio (3yr) | < 60% | ≥ 60%: auto-decline |
| Occupancy Type | Residential only | Non-residential: auto-decline |
| Years in Business | ≥ 3 years | < 3 years: auto-decline |
| Unit Count (per loc) | ≤ 500 units per location | > 500 units: auto-decline |
| Building Age | < 75 years | ≥ 75 years: auto-decline |
| Prior Claims (3yr) | ≤ 5 claims | > 5 claims: auto-decline |

**Excluded Classes (always declined):**
- Rooming/Boarding Houses
- Hotels/Motels (wrong LOB — should be Hospitality)
- Vacant Buildings
- Subsidized/Public Housing
- Student Housing (dormitories)

### 4.8 Policy Forms

**Base Forms:**
- CG 00 01 — Commercial General Liability Coverage Form (04 13)
- CG 00 02 — Commercial General Liability Declarations (04 13)
- IL 00 17 — Common Policy Conditions (09 07)
- IL 00 21 — Nuclear Energy Liability Exclusion (09 08)

**Endorsements:**
- CG 22 73 — Exclusion of Certified Acts of Terrorism (conditional: state = NY)
- CG 04 35 — Employee Benefits Liability (conditional: EBL coverage selected)
- CG 20 10 — Additional Insured - Owners, Lessees or Contractors (optional)
- CG 24 04 — Waiver of Transfer of Rights of Recovery (optional)
- CG 21 47 — Employment-Related Practices Exclusion (required)
- CG 21 67 — Fungi or Bacteria Exclusion (required)

---

## 5. Page-by-Page Specification

### Page 1: Product Studio List

**URL route:** `/product-studio`

**Layout:** Full-width content area with three horizontal tabs at top.

**Tab 1 — Products (default)**
- Table columns: Product Name, LOB Type, Version, States, Status, Last Modified, Modified By
- Each row is clickable → navigates to Product Detail
- Status badge colors: Draft (amber), Active (green), Under Filing (blue), Archived (gray)
- "Create Product" button top-right (purple primary)
- Search bar + filter dropdowns above table: LOB Type, Status
- Sample data: 4-5 products (Habitational GL as highlighted, plus Commercial Auto, Workers' Comp, BOP Package)

**Tab 2 — Policy Form Library**
- Table columns: Form Number, Form Name, Edition, Type (base/endorsement), Products Using, Last Modified
- Read-only reference view showing all forms across the carrier
- Search + filter by form type

**Tab 3 — Lines of Business**
- Table columns: LOB Object Name, LOB Type, Products, Created, Status
- Shows "Ascendex Habitational GL" linked to "General Liability" LOB Type
- "Create LOB" button

### Page 2: Product Create

**Trigger:** Click "+ Create Product" (green/teal button, top-right of list page)

**Layout:** Centered modal overlay (~480px wide), single step

**Fields (per Figma + feedback):**
- **Product Name** — text input, placeholder "Enter product name", required
- **Description** — textarea, placeholder "Add a brief description", optional
- **Line of Business Type** — dropdown selecting from available LOB Types (General Liability, Commercial Auto, Property, Workers' Comp, etc.). Required. For many carriers the default LOB Object will share the same name as the LOB Type; LOB Object management happens in the Lines of Business tab on the list page.
- **Effective Date (Optional)** / **Expiry Date (Optional)** — side-by-side date pickers with calendar icons
- **Applicable States** — multi-select dropdown, placeholder "Input / Type to find and select"
- **Admitted / Non-admitted** — toggle or dropdown

**Actions:**
- "Cancel" (secondary) | "Create" (primary, green/teal)
- On create → navigates to Product Detail page with new draft

### Page 3: Product Detail

**URL route:** `/product-studio/products/:id`

**Layout:** Two-zone — metadata sidebar (320px right) + tabbed content area

**Metadata Sidebar (right side):**
- Product name (editable inline)
- Status badge (Draft)
- Version: v2.1
- Line of Business Type: General Liability (set at creation, displayed as reference)
- States: NY, NJ, CT, PA, MA (chips)
- Effective Date: (date picker)
- Expiry Date: (date picker)
- Created by: Miguel Roman
- Last modified: Mar 19, 2026
- Actions: "Publish Version" (primary), "Discard Draft" (danger ghost)

**Content Tabs:**
- **Overview** (default) — summary cards showing config completeness per component:
  - Eligibility: 7 rules configured ✓
  - Coverages: 15 coverages defined ✓
  - Policy Forms: 10 forms attached ✓
  - Data Mapping: 17/17 fields mapped ✓
  - Rater Workflow: 4 steps generated ✓
  - Operations: Not configured ○
  - Layouts: Not configured ○
- **Eligibility** → Page 4
- **Policy Forms** → Page 5
- **Data Mapping** → Page 6
- **Rater Workflow** → Page 7
- **Operations** → Page 8
- **Layouts** → Page 9

### Page 4: Eligibility Rules (Ineligibility Gates)

**URL route:** `/product-studio/products/:id/eligibility`

> **Framing:** This tab defines hard ineligibility gates — the conditions that automatically
> decline a submission before it ever reaches an underwriter. This is distinct from "appetite"
> (handled in Control Tower), which is about strategic preference rather than hard limits.

**Layout:** Two sections stacked

**Section 1 — Threshold Gates**
- Table with columns: Rule Name, Field, Condition (to pass), Scope, Enabled (toggle)
- No outcome column needed — every fail = auto-decline
- Each rule row is editable inline (click to edit condition/thresholds)
- "Add Gate" button at bottom
- Scope badge per rule: "Account" or "Per-Location"
- Per-location rules (Building Age, Unit Count) show a sky-blue scope badge
- Group headers: "Account-Level Gates" and "Per-Location Gates"

**Section 2 — Excluded Classes**
- Table: Class Name, Reason
- All entries here are always-decline (no accept/refer dropdown needed)
- "Add Excluded Class" button
- Each row editable inline

**Right panel (collapsible):** Live preview showing a mock submission running through the
gates with pass/fail indicators. A failed gate shows a red "Declined" badge with the
specific rule that triggered it.

### Page 5: Policy Forms (Visual Mock)

**URL route:** `/product-studio/products/:id/forms`

**Layout:** Single unified table

**Table columns:** Form Number, Form Name, Edition, Type (Base Form / Endorsement),
Attachment Rule, Required (lock icon)

- All forms in one table, sortable/filterable by Type column
- Required forms show a 🔒 lock icon — visually distinct but same table
- Attachment rules shown inline: "Always" for base forms, conditional logic for endorsements
  (e.g., "When: state = NY", "When: EBL coverage selected")
- "Add Form" button opens a search/select to attach additional endorsements
- Filter pills above table: "All" | "Base Forms" | "Endorsements" | "Required" | "Conditional"

**Interaction level:** Display only with mock data. No inline editing needed.

### Page 6: Data Mapping

**URL route:** `/product-studio/products/:id/data-mapping`

**Layout:** Two-panel

**Left panel — Rater Schema (source)**
- Header: "Rater Workbook: ascendex-hab-gl-rater-v3.xlsx"
- Grouped by sheet: Inputs, Inputs_Loc, Coverages, RateFactors, Ind_RF
- Each sheet group shows cardinality badge: "Single", "Array (×10)", "Mixed", "Lookup"
- Fields listed under each group with cell reference

**Right panel — Mapping Table**
- Columns: Rater Field, Cell Reference, Mapped To (Federato field), Type, Scope, Status, In Workflow (toggle)
- Status: Mapped (green check), Unmapped (yellow warning), Auto-mapped (purple sparkle)
- Scope column shows "Account" or "Per-Location" badge
- **"In Workflow" toggle** — controls whether this field appears in the Rater Workflow tab
  - **Smart default:** Fields with source = "UW input" auto-toggle ON. Fields with source = "API" or "Derived" auto-toggle OFF.
  - PM can override either direction (add a derived field to workflow, or exclude a UW field)
  - Toggle state flows to the Rater Workflow page — only toggled-on fields appear there
- "Auto-Map" button in toolbar that animates filling in suggested mappings
- Per-location fields highlighted with a sky-blue left border
- Synthetic fields (e.g., crime_score) show dependency chain tooltip: "address → Geo API → crime_score"

**Stat cards at top:**
- Total Fields: 34
- Mapped: 30
- Auto-Mapped: 22
- Unmapped: 4
- Repeating Schedules: 3 sheets

### Page 7: Rater Workflow

**URL route:** `/product-studio/products/:id/workflow`

> **Field flow model (Smart Default + Override):** Fields appear in this tab automatically
> based on the "In Workflow" toggle in Data Mapping. By default, all UW-input fields are
> included and all API/derived fields are excluded. The PM can override either direction in
> Data Mapping, and the workflow updates accordingly. This means the workflow is always a
> curated subset of mapped fields — the ones that UWs actually interact with.

**Layout:** Two sections — step list (left, 60%) + step detail panel (right, 40%)

**Step List:**
- Ordered list of workflow steps auto-generated from data mapping (UW-input fields only by default)
- Each step shows: step number, name, field count, scope badge
- Steps grouped by domain:
  1. **Account Information** (account scope) — 8 fields
  2. **Location Details** (per-location, repeating) — 8 fields per location, badge "×10 max"
     (9 total per-loc fields minus crime_score which is API-derived → excluded by default)
  3. **Coverage Selection** (mixed) — 8 account + 7 per-location fields
  4. **Underwriting Risk Factors** (per-location, repeating) — 8 factors per location
- Per-location steps show sky-blue repeating badge
- Drag handles on each step for reordering
- Info banner at top: "Showing 26 of 34 mapped fields. 8 API/derived fields hidden. Manage in Data Mapping →"

**Step Detail Panel (on step click):**
- Step name (editable)
- Fields in this step (reorderable list)
- Each field shows: name, type, source (UW input / DB / API), scope badge, required toggle
- "Add Field" dropdown to pull from excluded-but-mapped field pool
- Warning indicators for fields with unresolved dependencies

**Bottom toolbar:**
- "Generate Preview" button → shows what the UW form would look like
- "Reset to Auto-Generated" button
- Status indicator: "All UW-input fields accounted for ✓" or "X fields unassigned ⚠"

### Page 8: Product Operations (Visual Mock)

**URL route:** `/product-studio/products/:id/operations`

**Layout:** Two stacked cards

**Card 1 — Policy Lifecycle**
- Visual pipeline showing stages: Submission → Quote → Bind → In-Force → Endorsement → Renewal → Cancellation
- Each stage shows: status (configured/not configured), SLA field, approval requirements
- Not editable in this prototype — placeholder content

**Card 2 — Billing Settings**
- Form layout (non-functional): Payment methods, installment plans, grace period, late fees
- "Coming soon" banner

### Page 9: Policy Page Layouts (Visual Mock)

**URL route:** `/product-studio/products/:id/layouts`

**Layout:** Shows existing layout configurator pattern from Federato

- Left sidebar: section list (Policy Summary, Location Details, Coverage Details, etc.)
- Main area: widget grid showing configured sections
- Not interactive — static representation of how the UW-facing policy page would look

---

## 6. Key Interactions

### 6.1 Navigation Flow

```
Product List → [click row] → Product Detail (Overview tab)
Product Detail → [click tab] → Eligibility / Forms / Data Mapping / Workflow / Operations / Layouts
Product List → [Create Product] → Create Modal → Product Detail
```

All tab navigation should be instant (client-side routing, no page reloads). Back button via breadcrumb.

### 6.2 Eligibility Gate Editing

1. Click on a gate row → inline edit mode
2. Condition field becomes editable (dropdown for operator, text input for threshold value)
3. Toggle enabled/disabled (disabled gates are skipped, not deleted)
4. No outcome column needed — every fail = auto-decline
5. "Add Gate" opens a new empty row at the bottom
6. Per-location gates display a sky-blue scope badge and are grouped under "Per-Location Gates" header

### 6.3 Data Mapping Auto-Map + Workflow Toggle

1. Initial state: all fields shown with "Unmapped" status, "In Workflow" toggles all OFF
2. Click "Auto-Map" button → animated fill of 22 fields with suggested Federato field mappings
3. After auto-map completes, "In Workflow" toggles auto-set:
   - UW input fields → ON (26 fields)
   - API/Derived fields → OFF (8 fields, e.g., crime_score, geo_risk_score)
4. Remaining unmapped fields (synthetic) show yellow warning
5. Click on any mapping row → dropdown to change the target Federato field
6. Toggle "In Workflow" on/off per field → immediately reflected in Rater Workflow tab
7. Synthetic fields show a dependency chain popover on hover

### 6.4 Workflow Step Management

1. Steps are auto-generated from fields where "In Workflow" = ON in Data Mapping
2. Click a step → right panel shows step detail with field list
3. Drag fields between steps or reorder within a step
4. "Add Field" dropdown shows fields that are mapped but currently excluded from workflow
5. Per-location steps show a repeating indicator and render field list with location index notation
6. Info banner links back to Data Mapping to manage field inclusion

---

## 7. Feedback Integration

### From William (Mar 16-18)

- **Forms before page config**: The product definition (forms, coverages, eligibility) must be visually established before layout/page configuration. The tab order reflects this: Eligibility → Forms → Data Mapping → Workflow → Operations → Layouts.
- **Working backwards from rater**: Data Mapping tab shows the rater schema first, then maps to Federato fields. This is the "working backwards" approach William validated.
- **Auto-generated workflow**: Rater Workflow tab shows steps generated from the data mapping, not manually configured. The UW fills in fields, and the system rates automatically.
- **Field source complexity hidden from PM**: The Data Mapping tab is the technical layer. The Workflow tab is the PM-friendly view of the same data. Synthetic field chains (address → API → score) are visible in Data Mapping but abstracted in Workflow.

### From Mitch (IA review)

- Tab ordering follows the logical configuration sequence: define what you accept (Eligibility) → define the contract (Forms) → connect the rater (Data Mapping) → build the UW flow (Workflow) → set operational rules (Operations) → design the page (Layouts)
- Breadcrumb navigation provides persistent context
- Each tab is self-contained with its own save state

### From Zohaib (design)

- Federato's existing UI patterns (dark left nav, card-based layouts, table styles) must be preserved
- The right-side metadata panel on Product Detail matches the existing policy detail pattern
- Status badges and version indicators follow established conventions

---

## 8. Technical Implementation

### Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (CDN for prototype speed)
- **Icons:** Inline SVGs (lucide-react pattern from existing prototype)
- **Routing:** Client-side hash routing (no react-router dependency needed)
- **State:** React useState/useReducer (no external state management)
- **Data:** Static JSON constants (no API calls)

### File Structure (v3, alongside existing prototypes)

```
src/
├── main.jsx                        # v1 entry (KEEP — existing)
├── main-eligibility.jsx            # Eligibility entry (KEEP — existing)
├── ProductStudio.jsx               # v1 prototype (KEEP — existing)
├── ProductDefinitionV2.jsx         # v2 prototype (KEEP — existing)
├── EligibilityGLHab.jsx            # Eligibility prototype (KEEP — existing)
│
├── main-v3.jsx                     # NEW — v3 entry point
├── v3/
│   ├── App.jsx                     # Hash router + Federato shell
│   ├── components/
│   │   ├── Shell.jsx               # Top bar + icon-only left nav + breadcrumb
│   │   ├── StatusBadge.jsx         # Reusable status pill
│   │   ├── DataTable.jsx           # Reusable sortable/filterable table
│   │   └── TabNav.jsx              # Underline tab navigation
│   ├── pages/
│   │   ├── ProductList.jsx         # Page 1 (3 tabs)
│   │   ├── ProductCreate.jsx       # Page 2 (modal)
│   │   ├── ProductDetail.jsx       # Page 3 (container + metadata sidebar)
│   │   ├── Eligibility.jsx         # Page 4 (ineligibility gates)
│   │   ├── PolicyForms.jsx         # Page 5 (visual — unified table)
│   │   ├── DataMapping.jsx         # Page 6 (interactive + In Workflow toggle)
│   │   ├── RaterWorkflow.jsx       # Page 7 (interactive — smart default fields)
│   │   ├── Operations.jsx          # Page 8 (visual mock)
│   │   └── Layouts.jsx             # Page 9 (visual mock)
│   ├── data/
│   │   ├── carrier.js              # Carrier + product metadata
│   │   ├── products.js             # Product list mock data
│   │   ├── eligibility.js          # Ineligibility gates + excluded classes
│   │   ├── coverages.js            # GL Hab coverage definitions
│   │   ├── forms.js                # Unified forms table data
│   │   ├── raterSchema.js          # Workbook structure + field defs
│   │   ├── mapping.js              # Field mapping state + In Workflow flags
│   │   └── workflow.js             # Generated workflow steps
│   └── utils/
│       └── icons.jsx               # SVG icon components
```

### Build & Deploy

- Vite config updated to support multiple entry points
- `npm run dev` → defaults to v3 entry point (`main-v3.jsx`)
- `npm run dev:v1` → legacy v1 entry
- `npm run build` → `dist/` folder, v3 as default
- Deploy to GitHub Pages at `migsroman.github.io/product-studio/`

---

## 9. Open Items

| Item | Blocker? | Notes |
|------|----------|-------|
| Remaining 6 Figma frames (Detail, Eligibility, Forms, Data Mapping, Workflow, Operations) | Low — hit Figma MCP rate limit after 2 screenshots | Have Product List + Product Create frames captured. Can revisit when limit resets. |
| Exact Federato color values | Low — using approximations from FigJam overview | Can refine from production CSS |
| Per-location UX for risk factors table | No | Using the indexed row pattern from the Mar 18 prototype session |
| Rater workflow generation algorithm | No | Prototype uses static pre-generated steps; algorithm is for production |
| Version management UI | No | Deferred from prototype — just showing version badge in metadata |
| LOB Object / LOB Type selection flow | Resolved | LOB Type selected at product creation. LOB Object management in Lines of Business tab. |

---

## 10. Success Criteria

The prototype is complete when:

1. All 9 pages render with Federato UI chrome (left nav, top bar, breadcrumbs)
2. The Product List → Create → Detail navigation flow works end-to-end
3. Eligibility rules are editable inline with per-location scope badges
4. Data Mapping shows the full Ascendex GL rater schema with auto-map animation
5. Rater Workflow displays generated steps with per-location repeating indicators
6. The Habitational GL demo data is realistic and internally consistent
7. Visual mock pages (Forms, Operations, Layouts) display plausible content
8. The prototype can be walked through in a 10-minute demo without breaking

---

## Appendix: Spec Changelog

**v2 (Mar 19, 2026) — Miguel's feedback incorporated:**

1. **Eligibility → Ineligibility Gates:** Reframed as hard cutoffs that decline submissions before underwriting. Removed all "Refer" outcomes. Appetite-level decisions live in Control Tower, not here. Excluded classes are always-decline.

2. **Policy Forms — Single Table:** Merged base forms and endorsements into one unified table with a Type column and lock icon for required forms. Filter pills for quick slicing. Simpler mental model.

3. **Data Mapping → Workflow Field Flow (Smart Default + Override):** Added "In Workflow" toggle per field in Data Mapping. Smart default: UW-input fields auto-included, API/derived fields auto-excluded. PM can override. Rater Workflow tab only shows toggled-on fields.

4. **Product Create — Simplified to Figma:** Replaced 3-step wizard with single-step modal matching Figma: Product Name, Description, Effective/Expiry dates, Applicable States, Admitted/Non-admitted. LOB Type selection deferred.

5. **Build Structure — v3 Alongside Existing:** New files live in `src/v3/` with `main-v3.jsx` entry point. Existing v1/v2 prototypes preserved for reference.

6. **Federato Shell — Updated from Figma:** Icon-only left nav (~56px), dark charcoal top bar, green carrier badge, "Admin > Product Studio" breadcrumb format.
