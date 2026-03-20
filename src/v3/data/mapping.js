// Field mapping state with In Workflow flags
// Smart defaults: UW input → inWorkflow true, API/Derived → false

export const FIELD_MAPPINGS = [
  // Account-level fields (Inputs sheet)
  {
    id: 'map-001',
    fieldName: 'policy_effective_date',
    label: 'Policy Effective Date',
    cellReference: 'Inputs!B3',
    mappedTo: 'effective_date',
    type: 'date',
    scope: 'account',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 1,
  },
  {
    id: 'map-002',
    fieldName: 'policy_expiration_date',
    label: 'Policy Expiration Date',
    cellReference: 'Inputs!B4',
    mappedTo: 'expiration_date',
    type: 'date',
    scope: 'account',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 2,
  },
  {
    id: 'map-003',
    fieldName: 'num_locations',
    label: 'Number of Locations',
    cellReference: 'Inputs!B6',
    mappedTo: 'location_count',
    type: 'integer',
    scope: 'account',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 3,
  },
  {
    id: 'map-004',
    fieldName: 'total_payroll',
    label: 'Total Annual Payroll',
    cellReference: 'Inputs!B8',
    mappedTo: 'annual_payroll',
    type: 'currency',
    scope: 'account',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 4,
  },
  {
    id: 'map-005',
    fieldName: 'years_in_operation',
    label: 'Years in Operation',
    cellReference: 'Inputs!B10',
    mappedTo: 'years_business_established',
    type: 'integer',
    scope: 'account',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 5,
  },
  {
    id: 'map-006',
    fieldName: 'prior_carrier',
    label: 'Prior Carrier',
    cellReference: 'Inputs!B12',
    mappedTo: 'previous_insurance_carrier',
    type: 'string',
    scope: 'account',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 6,
  },
  {
    id: 'map-007',
    fieldName: 'claims_count_3yr',
    label: 'Claims Count (3 Years)',
    cellReference: 'Inputs!B14',
    mappedTo: 'claims_history_3yr_count',
    type: 'integer',
    scope: 'account',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 7,
  },
  {
    id: 'map-008',
    fieldName: 'total_incurred_3yr',
    label: 'Total Incurred (3 Years)',
    cellReference: 'Inputs!B16',
    mappedTo: 'claims_history_3yr_incurred',
    type: 'currency',
    scope: 'account',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 8,
  },

  // Per-location fields (Inputs_Loc sheet)
  {
    id: 'map-101',
    fieldName: 'location_address',
    label: 'Location Address',
    cellReference: 'Inputs_Loc!A',
    mappedTo: 'street_address',
    type: 'string',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 1,
  },
  {
    id: 'map-102',
    fieldName: 'location_state',
    label: 'Location State',
    cellReference: 'Inputs_Loc!B',
    mappedTo: 'state_code',
    type: 'enum',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 2,
  },
  {
    id: 'map-103',
    fieldName: 'building_age',
    label: 'Building Age (Years)',
    cellReference: 'Inputs_Loc!C',
    mappedTo: 'building_construction_year',
    type: 'integer',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 3,
  },
  {
    id: 'map-104',
    fieldName: 'construction_type',
    label: 'Construction Type',
    cellReference: 'Inputs_Loc!D',
    mappedTo: 'building_construction_type',
    type: 'enum',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 4,
  },
  {
    id: 'map-105',
    fieldName: 'occupancy_type',
    label: 'Occupancy Type',
    cellReference: 'Inputs_Loc!E',
    mappedTo: 'property_occupancy_class',
    type: 'enum',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 5,
  },
  {
    id: 'map-106',
    fieldName: 'num_units',
    label: 'Number of Units',
    cellReference: 'Inputs_Loc!F',
    mappedTo: 'residential_units_count',
    type: 'integer',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 6,
  },
  {
    id: 'map-107',
    fieldName: 'square_footage',
    label: 'Square Footage',
    cellReference: 'Inputs_Loc!G',
    mappedTo: 'building_square_footage',
    type: 'integer',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 7,
  },
  {
    id: 'map-108',
    fieldName: 'protection_class',
    label: 'Protection Class (1-10)',
    cellReference: 'Inputs_Loc!H',
    mappedTo: 'fire_protection_class',
    type: 'enum',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 8,
  },
  {
    id: 'map-109',
    fieldName: 'crime_score',
    label: 'Crime Score',
    cellReference: 'Inputs_Loc!I',
    mappedTo: 'location_crime_risk_score',
    type: 'integer',
    scope: 'per-location',
    source: 'Derived (API)',
    status: 'mapped',
    inWorkflow: false, // API/Derived → default false
    derivedFrom: 'location_address → Geo API → crime_score',
    order: 9,
  },

  // Coverage fields (Coverages sheet - mixed)
  {
    id: 'map-201',
    fieldName: 'general_aggregate_limit',
    label: 'General Aggregate Limit',
    cellReference: 'Coverages!B3',
    mappedTo: 'gl_general_aggregate_limit',
    type: 'string',
    scope: 'account',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 1,
  },
  {
    id: 'map-202',
    fieldName: 'each_occurrence_limit',
    label: 'Each Occurrence Limit',
    cellReference: 'Coverages!B5',
    mappedTo: 'gl_each_occurrence_limit',
    type: 'string',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 2,
  },
  {
    id: 'map-203',
    fieldName: 'medical_expense_limit',
    label: 'Medical Expense Limit',
    cellReference: 'Coverages!B7',
    mappedTo: 'gl_medical_expense_limit',
    type: 'string',
    scope: 'account',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 3,
  },
  {
    id: 'map-204',
    fieldName: 'premises_medical_limit',
    label: 'Premises Medical Limit',
    cellReference: 'Coverages!B9',
    mappedTo: 'gl_premises_medical_limit',
    type: 'string',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 4,
  },
  {
    id: 'map-205',
    fieldName: 'tenant_legal_liability_limit',
    label: 'Tenant Legal Liability Limit',
    cellReference: 'Coverages!B11',
    mappedTo: 'gl_tenant_legal_liability_limit',
    type: 'string',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 5,
  },
  {
    id: 'map-206',
    fieldName: 'fire_legal_liability_limit',
    label: 'Fire Legal Liability Limit',
    cellReference: 'Coverages!B13',
    mappedTo: 'gl_fire_legal_liability_limit',
    type: 'string',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: false, // optional coverage → exclude by default
    order: 6,
  },
  {
    id: 'map-207',
    fieldName: 'ebl_coverage_included',
    label: 'Employee Benefits Liability',
    cellReference: 'Coverages!B15',
    mappedTo: 'gl_ebl_coverage_indicator',
    type: 'boolean',
    scope: 'account',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 7,
  },
  {
    id: 'map-208',
    fieldName: 'umbrella_coverage_limit',
    label: 'Umbrella Coverage Limit',
    cellReference: 'Coverages!B17',
    mappedTo: 'umbrella_excess_limit',
    type: 'string',
    scope: 'account',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: false, // optional coverage → exclude by default
    order: 8,
  },

  // Rate Factors (RateFactors sheet - per-location)
  {
    id: 'map-301',
    fieldName: 'years_in_operation_rf',
    label: 'Years in Operation (RF)',
    cellReference: 'RateFactors!B',
    mappedTo: 'uw_factor_years_operation',
    type: 'integer',
    scope: 'per-location',
    source: 'Derived',
    status: 'mapped',
    inWorkflow: false, // Derived → default false
    order: 1,
  },
  {
    id: 'map-302',
    fieldName: 'operational_excellence_rf',
    label: 'Operational Excellence (RF)',
    cellReference: 'RateFactors!C',
    mappedTo: 'uw_factor_operational_excellence',
    type: 'integer',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 2,
  },
  {
    id: 'map-303',
    fieldName: 'claim_history_rf',
    label: 'Claim History (RF)',
    cellReference: 'RateFactors!D',
    mappedTo: 'uw_factor_claim_history',
    type: 'integer',
    scope: 'per-location',
    source: 'DB',
    status: 'mapped',
    inWorkflow: false, // API/DB → default false
    order: 3,
  },
  {
    id: 'map-304',
    fieldName: 'endorsement_factor_rf',
    label: 'Endorsement Factor (RF)',
    cellReference: 'RateFactors!E',
    mappedTo: 'uw_factor_endorsement_complexity',
    type: 'integer',
    scope: 'per-location',
    source: 'Derived',
    status: 'mapped',
    inWorkflow: false, // Derived → default false
    order: 4,
  },
  {
    id: 'map-305',
    fieldName: 'premises_condition_rf',
    label: 'Premises Condition (RF)',
    cellReference: 'RateFactors!F',
    mappedTo: 'uw_factor_premises_condition',
    type: 'integer',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: true, // UW input → default true
    order: 5,
  },
  {
    id: 'map-306',
    fieldName: 'complexity_risk_rf',
    label: 'Complexity of Risk (RF)',
    cellReference: 'RateFactors!G',
    mappedTo: 'uw_factor_risk_complexity',
    type: 'integer',
    scope: 'per-location',
    source: 'Derived',
    status: 'mapped',
    inWorkflow: false, // Derived → default false
    order: 6,
  },
  {
    id: 'map-307',
    fieldName: 'lro_complexity_rf',
    label: 'LRO Complexity (RF)',
    cellReference: 'RateFactors!H',
    mappedTo: 'uw_factor_lro_complexity',
    type: 'integer',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: false, // optional → exclude by default
    order: 7,
  },
  {
    id: 'map-308',
    fieldName: 'vacant_land_rf',
    label: 'Vacant Land Factor (RF)',
    cellReference: 'RateFactors!I',
    mappedTo: 'uw_factor_vacant_land',
    type: 'integer',
    scope: 'per-location',
    source: 'UW input',
    status: 'mapped',
    inWorkflow: false, // optional → exclude by default
    order: 8,
  },
];

export const MAPPING_STATS = {
  totalFields: 34,
  mapped: 30,
  autoMapped: 22,
  unmapped: 4,
  inWorkflow: 18,
  excludedFromWorkflow: 12,
  repeatingSchedules: 3, // Inputs_Loc, RateFactors, Coverages mixed
};

// Helper to get mappings by scope
export const getMappingsByScope = (scope) =>
  FIELD_MAPPINGS.filter((m) => m.scope === scope);

// Helper to get mappings in workflow
export const getMappingsInWorkflow = () =>
  FIELD_MAPPINGS.filter((m) => m.inWorkflow === true);

// Helper to get mappings excluded from workflow
export const getMappingsExcludedFromWorkflow = () =>
  FIELD_MAPPINGS.filter((m) => m.inWorkflow === false);
