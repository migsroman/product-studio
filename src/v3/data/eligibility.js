// Ineligibility gates (hard binary cutoffs, no refer outcomes)
// These gates auto-decline submissions. No appetite/refer outcomes here.

export const ELIGIBILITY_GATES = [
  {
    id: 'gate-001',
    name: 'Location Count',
    field: 'num_locations',
    scope: 'account',
    condition: 'less-than-or-equal',
    threshold: 25,
    passDescription: '1-25 locations',
    failDescription: '> 25 locations: auto-decline',
    enabled: true,
    order: 1,
  },
  {
    id: 'gate-003',
    name: 'Occupancy Type',
    field: 'occupancy_type',
    scope: 'per-location',
    condition: 'equals',
    threshold: 'residential',
    passDescription: 'Residential only',
    failDescription: 'Non-residential: auto-decline',
    enabled: true,
    order: 3,
  },
  {
    id: 'gate-004',
    name: 'Years in Business',
    field: 'years_in_operation',
    scope: 'account',
    condition: 'greater-than-or-equal',
    threshold: 3,
    passDescription: '≥ 3 years',
    failDescription: '< 3 years: auto-decline',
    enabled: true,
    order: 4,
  },
  {
    id: 'gate-005',
    name: 'Unit Count (per location)',
    field: 'num_units',
    scope: 'per-location',
    condition: 'less-than-or-equal',
    threshold: 500,
    passDescription: '≤ 500 units per location',
    failDescription: '> 500 units: auto-decline',
    enabled: true,
    order: 5,
  },
  {
    id: 'gate-006',
    name: 'Building Age',
    field: 'building_age',
    scope: 'per-location',
    condition: 'less-than',
    threshold: 75,
    passDescription: '< 75 years',
    failDescription: '≥ 75 years: auto-decline',
    enabled: true,
    order: 6,
  },
  {
    id: 'gate-007',
    name: 'Prior Claims (3yr)',
    field: 'claims_count_3yr',
    scope: 'account',
    condition: 'less-than-or-equal',
    threshold: 5,
    passDescription: '≤ 5 claims',
    failDescription: '> 5 claims: auto-decline',
    enabled: true,
    order: 7,
  },
];

export const EXCLUDED_CLASSES = [
  {
    id: 'exc-001',
    className: 'Rooming/Boarding Houses',
    reason: 'Specialized liability profile outside standard GL appetite',
    order: 1,
  },
  {
    id: 'exc-002',
    className: 'Hotels/Motels',
    reason: 'Wrong LOB — should be Hospitality GL',
    order: 2,
  },
  {
    id: 'exc-003',
    className: 'Vacant Buildings',
    reason: 'No active occupancy reduces underwriting data and increases risk',
    order: 3,
  },
  {
    id: 'exc-004',
    className: 'Subsidized/Public Housing',
    reason: 'Government entity exposure with different regulatory requirements',
    order: 4,
  },
  {
    id: 'exc-005',
    className: 'Student Housing (Dormitories)',
    reason: 'Unique risk profile and liability exposure specific to educational institutions',
    order: 5,
  },
];

// Helper function to calculate loss ratio from claims data
export const calculateLossRatio = (claimsCount, totalIncurred, totalPayroll) => {
  if (!totalPayroll || totalPayroll === 0) return 0;
  return totalIncurred / totalPayroll;
};
