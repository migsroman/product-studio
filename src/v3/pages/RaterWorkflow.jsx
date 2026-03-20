import { useState } from 'react';
import { Icons } from '../utils/icons';
import { WORKFLOW_STEPS } from '../data/workflow';

// Toggle Switch Component - Federato style
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
        checked ? 'bg-slate-700' : 'bg-slate-400'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        } mt-0.5`}
      />
    </button>
  );
}

// Field Type Badge
function FieldTypeBadge({ type }) {
  const typeMap = {
    'string': 'TEXT',
    'date': 'DATE',
    'integer': 'NUMBER',
    'currency': 'CURRENCY',
    'enum': 'COMBOBOX',
    'boolean': 'CHECKBOX',
  };

  const displayType = typeMap[type] || type.toUpperCase();

  const colorMap = {
    'TEXT': 'bg-blue-100 text-blue-700',
    'DATE': 'bg-green-100 text-green-700',
    'NUMBER': 'bg-purple-100 text-purple-700',
    'CURRENCY': 'bg-amber-100 text-amber-700',
    'COMBOBOX': 'bg-pink-100 text-pink-700',
    'CHECKBOX': 'bg-indigo-100 text-indigo-700',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${colorMap[displayType] || 'bg-gray-100 text-gray-700'}`}>
      {displayType}
    </span>
  );
}

// Expandable Row Component
function FieldRow({ field, stepId }) {
  const [expanded, setExpanded] = useState(false);
  const [fieldState, setFieldState] = useState({
    enabled: true,
    required: field.required || false,
    hidden: false,
  });

  return (
    <>
      {/* Main row */}
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 w-8">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icons.ChevronRight
              size={16}
              className={`transition-transform ${expanded ? 'rotate-90' : ''}`}
            />
          </button>
        </td>
        <td className="px-4 py-3 w-12">
          <Toggle
            checked={fieldState.enabled}
            onChange={(v) => setFieldState({ ...fieldState, enabled: v })}
          />
        </td>
        <td className="px-4 py-3">
          <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm">
            {field.label}
          </a>
        </td>
        <td className="px-4 py-3 font-mono text-xs text-gray-600">{field.fieldName}</td>
        <td className="px-4 py-3">
          <FieldTypeBadge type={field.type} />
        </td>
        <td className="px-4 py-3 w-12">
          <Toggle
            checked={fieldState.required}
            onChange={(v) => setFieldState({ ...fieldState, required: v })}
          />
        </td>
        <td className="px-4 py-3 w-12">
          <Toggle
            checked={fieldState.hidden}
            onChange={(v) => setFieldState({ ...fieldState, hidden: v })}
          />
        </td>
        <td className="px-4 py-3 w-8">
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <Icons.MoreVertical size={16} />
          </button>
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr>
          <td colSpan="8" className="px-4 py-4 bg-gray-50 border-b border-gray-200">
            <div className="space-y-4">
              {/* Validation Rules */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Validation Rules
                </h4>
                <div className="text-xs text-gray-600">
                  {field.required ? 'Required field' : 'Optional field'}
                  {field.minValue !== undefined && `, Min: ${field.minValue}`}
                  {field.maxValue !== undefined && `, Max: ${field.maxValue}`}
                </div>
              </div>

              {/* Default Value */}
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">
                  Default Value
                </label>
                <input
                  type="text"
                  placeholder="Enter default value..."
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Options (for COMBOBOX) */}
              {field.type === 'enum' && (
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">
                    Options
                  </label>
                  <textarea
                    placeholder="Enter options (one per line)..."
                    rows="3"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Dependencies */}
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">
                  Dependencies
                </label>
                <input
                  type="text"
                  placeholder="Field dependencies..."
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function RaterWorkflow() {
  const [selectedStepId, setSelectedStepId] = useState(WORKFLOW_STEPS[0].id);
  const selectedStep = WORKFLOW_STEPS.find((s) => s.id === selectedStepId);

  const mockSteps = [
    {
      id: 'step-1',
      name: 'Submission Summary',
      fieldCount: 7,
      fields: [
        { id: 'f1', label: 'Insured Name', fieldName: 'insured_name', type: 'string', required: false },
        { id: 'f2', label: 'Effective Date', fieldName: 'effective_date', type: 'date', required: false },
        { id: 'f3', label: 'Expiration Date', fieldName: 'expiration_date', type: 'date', required: false },
        { id: 'f4', label: 'New/Renewal', fieldName: 'new_renewal', type: 'string', required: false },
        { id: 'f5', label: 'Carrier', fieldName: 'carrier_id', type: 'enum', required: true },
        { id: 'f6', label: 'Named Entity Type', fieldName: 'named_entity_type', type: 'enum', required: true },
        { id: 'f7', label: 'Management Company', fieldName: 'management_company', type: 'string', required: false },
      ],
    },
    {
      id: 'step-2',
      name: 'Rate Factors',
      fieldCount: 6,
      fields: [
        { id: 'rf1', label: 'Building Age', fieldName: 'building_age', type: 'integer', required: false },
        { id: 'rf2', label: 'Construction Type', fieldName: 'construction_type', type: 'enum', required: true },
        { id: 'rf3', label: 'Protection Class', fieldName: 'protection_class', type: 'enum', required: true },
        { id: 'rf4', label: 'Occupancy Type', fieldName: 'occupancy_type', type: 'enum', required: true },
        { id: 'rf5', label: 'Crime Score', fieldName: 'crime_score', type: 'integer', required: false },
        { id: 'rf6', label: 'Premises Condition', fieldName: 'premises_condition', type: 'integer', required: false },
      ],
    },
    {
      id: 'step-3',
      name: 'Limits',
      fieldCount: 13,
      fields: Array.from({ length: 13 }, (_, i) => ({
        id: `lim${i + 1}`,
        label: `Limit Field ${i + 1}`,
        fieldName: `limit_field_${i + 1}`,
        type: 'currency',
        required: i < 5,
      })),
    },
  ];

  const displayStep = mockSteps.find((s) => s.id === selectedStepId) || mockSteps[0];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Underwriter Workflow</h1>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            Draft changes
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Preview
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Save Workflow
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Steps */}
        <div className="w-60 border-r border-gray-200 bg-gray-50 overflow-y-auto flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">Rater Form</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {mockSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => setSelectedStepId(step.id)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                  selectedStepId === step.id
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{step.name}</span>
                  <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded">
                    {step.fieldCount}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 p-3">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Icons.Plus size={16} />
              Add Rater Step
            </button>
          </div>
        </div>

        {/* Right Content - Field Table */}
        <div className="flex-1 bg-white overflow-hidden flex flex-col">
          {/* Field table header and body */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left w-8"></th>
                  <th className="px-4 py-3 text-left w-12 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Is Enabled
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Display Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Field Type
                  </th>
                  <th className="px-4 py-3 text-left w-12 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Is Required
                  </th>
                  <th className="px-4 py-3 text-left w-12 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Is Hidden
                  </th>
                  <th className="px-4 py-3 text-left w-8"></th>
                </tr>
              </thead>
              <tbody>
                {displayStep.fields.map((field) => (
                  <FieldRow key={field.id} field={field} stepId={displayStep.id} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
