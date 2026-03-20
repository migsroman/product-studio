import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { Icons } from '../utils/icons';
import { FORMS } from '../data/forms';

/**
 * PolicyForms.jsx - Policy Forms Page (Page 5)
 *
 * Layout: Single unified table with filter pills
 *
 * Features:
 *   - Filter pills: All | Base Forms | Endorsements | Required | Conditional
 *   - Unified table: base forms + endorsements together
 *   - Columns: Form Number, Form Name, Edition, Type (badge), Attachment Rule, Required (lock icon)
 *   - "Add Form" button (ghost style with plus icon)
 *   - Dynamic filtering based on active filter
 *
 * Props: None (uses internal state and static data)
 */
export default function PolicyForms() {
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter forms based on active filter
  let filteredForms = FORMS;
  if (activeFilter === 'base-forms') {
    filteredForms = FORMS.filter((f) => f.type === 'base');
  } else if (activeFilter === 'endorsements') {
    filteredForms = FORMS.filter((f) => f.type === 'endorsement');
  } else if (activeFilter === 'required') {
    filteredForms = FORMS.filter((f) => f.required);
  } else if (activeFilter === 'conditional') {
    filteredForms = FORMS.filter((f) => f.attachmentRule === 'conditional');
  }

  // Sort by form number for consistent display
  filteredForms = [...filteredForms].sort((a, b) => a.formNumber.localeCompare(b.formNumber));

  // Table columns definition
  const columns = [
    {
      key: 'formNumber',
      label: 'Form Number',
      width: '120px',
      sortable: true,
    },
    {
      key: 'formName',
      label: 'Form Name',
      width: '300px',
      sortable: true,
    },
    {
      key: 'edition',
      label: 'Edition',
      width: '90px',
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      width: '120px',
      sortable: true,
      render: (val) => (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            val === 'base'
              ? 'bg-gray-200 text-gray-700'
              : 'bg-purple-200 text-purple-700'
          }`}
        >
          {val === 'base' ? 'Base Form' : 'Endorsement'}
        </span>
      ),
    },
    {
      key: 'attachmentRule',
      label: 'Attachment Rule',
      width: '240px',
      render: (val, row) => {
        if (val === 'always') {
          return <span className="text-sm text-gray-700">Always</span>;
        } else if (val === 'optional') {
          return <span className="text-sm text-gray-700">Optional</span>;
        } else if (val === 'conditional') {
          return (
            <span className="text-sm text-gray-700">
              When: {row.attachmentCondition || 'condition not specified'}
            </span>
          );
        }
        return <span className="text-sm text-gray-700">{val}</span>;
      },
    },
    {
      key: 'required',
      label: 'Required',
      width: '100px',
      render: (val) => {
        if (val) {
          return (
            <Icons.Lock
              size={14}
              className="text-gray-600"
              title="Required form"
            />
          );
        }
        return <span className="text-gray-400">—</span>;
      },
    },
  ];

  // Filter pills configuration
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'base-forms', label: 'Base Forms' },
    { id: 'endorsements', label: 'Endorsements' },
    { id: 'required', label: 'Required' },
    { id: 'conditional', label: 'Conditional' },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Forms Table */}
      <DataTable
        columns={columns}
        data={filteredForms}
        emptyMessage="No forms match the selected filter"
      />

      {/* Add Form Button */}
      <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
        <Icons.Plus size={14} />
        Add Form
      </button>

      {/* Info Section */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Base Forms are always attached. Endorsements are attached based on their attachment rules.
          Required forms are marked with a lock icon (🔒). Conditional endorsements are attached only when their conditions are met.
        </p>
      </div>
    </div>
  );
}
