import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { Icons } from '../utils/icons';
import { ELIGIBILITY_GATES, EXCLUDED_CLASSES } from '../data/eligibility';

/**
 * Eligibility.jsx - Eligibility Rules Page (Page 4)
 *
 * Layout: Two sections stacked (left) + collapsible right panel (live preview)
 *
 * Features:
 *   - Framing banner explaining hard ineligibility gates vs appetite
 *   - Section 1: Threshold Gates (editable inline)
 *     - Grouped by Account-Level and Per-Location Gates
 *     - Columns: Gate Name, Field, Condition, Scope badge, Enabled toggle
 *   - Section 2: Excluded Classes (editable inline)
 *     - Columns: Class Name, Reason
 *   - Right panel: Live preview with pass/fail indicators
 *
 * Props: None (uses internal state)
 */
export default function Eligibility() {
  const [gates, setGates] = useState(ELIGIBILITY_GATES);
  const [excludedClasses, setExcludedClasses] = useState(EXCLUDED_CLASSES);
  const [showPreview, setShowPreview] = useState(true);
  const [editingGateId, setEditingGateId] = useState(null);
  const [editingClassId, setEditingClassId] = useState(null);

  // Split gates by scope
  const accountGates = gates.filter((g) => g.scope === 'account').sort((a, b) => a.order - b.order);
  const perLocationGates = gates.filter((g) => g.scope === 'per-location').sort((a, b) => a.order - b.order);

  // Handle inline editing for gates
  const handleGateChange = (gateId, field, value) => {
    setGates((prev) =>
      prev.map((g) => (g.id === gateId ? { ...g, [field]: value } : g))
    );
  };

  // Handle inline editing for excluded classes
  const handleClassChange = (classId, field, value) => {
    setExcludedClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, [field]: value } : c))
    );
  };

  // Render condition editor for a gate
  const renderConditionEditor = (gate) => {
    if (editingGateId === gate.id) {
      // Show editable controls
      return (
        <div className="flex items-center gap-2">
          <select
            value={gate.condition}
            onChange={(e) => handleGateChange(gate.id, 'condition', e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="equals">Equals</option>
            <option value="less-than">Less than</option>
            <option value="less-than-or-equal">≤</option>
            <option value="greater-than">Greater than</option>
            <option value="greater-than-or-equal">≥</option>
          </select>
          <input
            type={typeof gate.threshold === 'number' ? 'number' : 'text'}
            value={gate.threshold}
            onChange={(e) => {
              const val = typeof gate.threshold === 'number' ? parseFloat(e.target.value) : e.target.value;
              handleGateChange(gate.id, 'threshold', val);
            }}
            className="px-2 py-1 border border-gray-300 rounded text-sm w-24"
          />
          <button
            onClick={() => setEditingGateId(null)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Done
          </button>
        </div>
      );
    }

    // Display mode
    return (
      <button
        onClick={() => setEditingGateId(gate.id)}
        className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer"
      >
        {gate.passDescription}
      </button>
    );
  };

  // Gate table renderer
  const gateColumns = [
    {
      key: 'name',
      label: 'Gate Name',
      width: '200px',
      sortable: true,
    },
    {
      key: 'field',
      label: 'Field',
      width: '150px',
      sortable: true,
    },
    {
      key: 'condition',
      label: 'Condition (to pass)',
      width: '280px',
      render: (val, row) => renderConditionEditor(row),
    },
    {
      key: 'scope',
      label: 'Scope',
      width: '140px',
      render: (val, row) => (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            row.scope === 'per-location'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {row.scope === 'per-location' ? 'Per-Location' : 'Account'}
        </span>
      ),
    },
    {
      key: 'enabled',
      label: 'Enabled',
      width: '80px',
      render: (val, row) => (
        <input
          type="checkbox"
          checked={row.enabled}
          onChange={(e) => handleGateChange(row.id, 'enabled', e.target.checked)}
          className="w-4 h-4"
        />
      ),
    },
  ];

  // Excluded class table renderer
  const classColumns = [
    {
      key: 'className',
      label: 'Class Name',
      width: '200px',
      sortable: true,
    },
    {
      key: 'reason',
      label: 'Reason',
      width: '400px',
      render: (val, row) => {
        if (editingClassId === row.id) {
          return (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={val}
                onChange={(e) => handleClassChange(row.id, 'reason', e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
              />
              <button
                onClick={() => setEditingClassId(null)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Done
              </button>
            </div>
          );
        }
        return (
          <button
            onClick={() => setEditingClassId(row.id)}
            className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer"
          >
            {val}
          </button>
        );
      },
    },
  ];

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1">
        {/* Framing Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            <strong>Ineligibility Gates:</strong> These are hard ineligibility gates — conditions that automatically decline a submission before it reaches underwriting. Appetite rules are managed in Control Tower.
          </p>
        </div>

        {/* Section 1: Threshold Gates */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Threshold Gates</h2>

          {/* Account-Level Gates */}
          {accountGates.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                Account-Level Gates
              </h3>
              <DataTable columns={gateColumns} data={accountGates} />
            </div>
          )}

          {/* Per-Location Gates */}
          {perLocationGates.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                Per-Location Gates
              </h3>
              <DataTable columns={gateColumns} data={perLocationGates} />
            </div>
          )}

          {/* Add Gate Button */}
          <button className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Icons.Plus size={14} />
            Add Gate
          </button>
        </div>

        {/* Section 2: Excluded Classes */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Excluded Classes</h2>
          <DataTable columns={classColumns} data={excludedClasses} />

          {/* Add Excluded Class Button */}
          <button className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Icons.Plus size={14} />
            Add Excluded Class
          </button>
        </div>
      </div>

      {/* Right Panel: Live Preview (Collapsible) */}
      <div className="w-80">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="mb-3 text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-2"
        >
          {showPreview ? <Icons.ChevronDown size={16} /> : <Icons.ChevronRight size={16} />}
          Live Preview
        </button>

        {showPreview && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
            <div className="space-y-3">
              {/* Sample submission mock */}
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                Sample Submission
              </div>

              {/* Passing gates */}
              <div className="flex items-start gap-2">
                <Icons.Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Location Count: 12</p>
                  <p className="text-xs text-gray-600">✓ Passes (≤ 25)</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Icons.Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Years in Business: 8</p>
                  <p className="text-xs text-gray-600">{"✓ Passes (≥ 3 years)"}</p>
                </div>
              </div>

              {/* Failing gate - example: Building Age */}
              <div className="border-l-4 border-red-500 pl-3 py-2 bg-red-50 rounded">
                <div className="flex items-start gap-2">
                  <svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-red-600 mt-0.5 flex-shrink-0"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Building Age: 82 years</p>
                    <p className="text-xs text-gray-600">{"✗ Fails (>= 75 years)"}</p>
                  </div>
                </div>
              </div>

              {/* Outcome */}
              <div className="mt-4 p-3 bg-red-100 rounded border border-red-300">
                <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                  DECLINED
                </span>
                <p className="text-xs text-red-800 mt-2">Building Age gate triggered auto-decline</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
