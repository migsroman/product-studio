// Unified forms table - base forms and endorsements in single array
// Each form has type, attachment rule, required flag

export const FORMS = [
  // Base Forms (required, always attached)
  {
    id: 'form-001',
    formNumber: 'CG 00 01',
    formName: 'Commercial General Liability Coverage Form',
    edition: '04 13',
    type: 'base',
    attachmentRule: 'always',
    required: true,
    description: 'Primary GL coverage form for all policies',
  },
  {
    id: 'form-002',
    formNumber: 'CG 00 02',
    formName: 'Commercial General Liability Declarations',
    edition: '04 13',
    type: 'base',
    attachmentRule: 'always',
    required: true,
    description: 'Declarations page listing insured, limits, and endorsements',
  },
  {
    id: 'form-003',
    formNumber: 'IL 00 17',
    formName: 'Common Policy Conditions',
    edition: '09 07',
    type: 'base',
    attachmentRule: 'always',
    required: true,
    description: 'Standard policy conditions applicable to all coverages',
  },
  {
    id: 'form-004',
    formNumber: 'IL 00 21',
    formName: 'Nuclear Energy Liability Exclusion',
    edition: '09 08',
    type: 'base',
    attachmentRule: 'always',
    required: true,
    description: 'Standard nuclear exclusion per statute',
  },

  // Endorsements - Conditional
  {
    id: 'form-101',
    formNumber: 'CG 22 73',
    formName: 'Exclusion of Certified Acts of Terrorism',
    edition: '11 09',
    type: 'endorsement',
    attachmentRule: 'conditional',
    attachmentCondition: 'state = NY',
    required: true,
    description: 'Mandatory terrorism exclusion for NY policies',
  },
  {
    id: 'form-102',
    formNumber: 'CG 04 35',
    formName: 'Employee Benefits Liability',
    edition: '12 07',
    type: 'endorsement',
    attachmentRule: 'conditional',
    attachmentCondition: 'EBL coverage selected',
    required: false,
    description: 'Attached when Employee Benefits Liability coverage is selected',
  },

  // Endorsements - Optional
  {
    id: 'form-103',
    formNumber: 'CG 20 10',
    formName: 'Additional Insured - Owners, Lessees or Contractors',
    edition: '04 13',
    type: 'endorsement',
    attachmentRule: 'optional',
    required: false,
    description: 'Optional additional insured endorsement',
  },
  {
    id: 'form-104',
    formNumber: 'CG 24 04',
    formName: 'Waiver of Transfer of Rights of Recovery',
    edition: '04 13',
    type: 'endorsement',
    attachmentRule: 'optional',
    required: false,
    description: 'Optional waiver of subrogation',
  },

  // Endorsements - Required
  {
    id: 'form-105',
    formNumber: 'CG 21 47',
    formName: 'Employment-Related Practices Exclusion',
    edition: '09 04',
    type: 'endorsement',
    attachmentRule: 'always',
    required: true,
    description: 'Standard EPLI exclusion - always required',
  },
  {
    id: 'form-106',
    formNumber: 'CG 21 67',
    formName: 'Fungi or Bacteria Exclusion',
    edition: '07 06',
    type: 'endorsement',
    attachmentRule: 'always',
    required: true,
    description: 'Standard fungus/bacteria exclusion - always required',
  },

  // Additional Optional Forms
  {
    id: 'form-107',
    formNumber: 'CG 20 37',
    formName: 'Primary Limits Non-Stacking Endorsement',
    edition: '04 13',
    type: 'endorsement',
    attachmentRule: 'optional',
    required: false,
    description: 'Optional primary and non-stacking endorsement',
  },
  {
    id: 'form-108',
    formNumber: 'CG 00 39',
    formName: 'Liquor Liability Coverage',
    edition: '04 13',
    type: 'endorsement',
    attachmentRule: 'optional',
    required: false,
    description: 'Optional liquor liability coverage form',
  },
];

// Helper function to filter forms
export const getFormsByType = (type) => FORMS.filter((f) => f.type === type);
export const getRequiredForms = () => FORMS.filter((f) => f.required);
export const getBaseForms = () => FORMS.filter((f) => f.type === 'base');
export const getEndorsements = () => FORMS.filter((f) => f.type === 'endorsement');
