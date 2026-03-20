// Carrier metadata - Ascendex Underwriters
export const CARRIER = {
  id: 'ascendex',
  name: 'Ascendex Underwriters',
  displayName: 'ASCENDEX',
  badgeColor: '#10B981', // green
};

export const LOB_TYPES = [
  { id: 'gl', name: 'General Liability', label: 'General Liability' },
  { id: 'ca', name: 'Commercial Auto', label: 'Commercial Auto' },
  { id: 'wc', name: "Workers' Compensation", label: "Workers' Comp" },
  { id: 'bop', name: 'Business Owners Policy', label: 'BOP Package' },
  { id: 'property', name: 'Property', label: 'Property' },
];

export const LOB_OBJECTS = [
  {
    id: 'ascendex-hab-gl',
    name: 'Ascendex Habitational GL',
    lobTypeId: 'gl',
    carrier: 'ascendex',
    status: 'active',
  },
];

export const STATES = ['NY', 'NJ', 'CT', 'PA', 'MA'];
