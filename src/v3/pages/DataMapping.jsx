import { useState } from 'react';
import { Icons } from '../utils/icons';
import { FIELD_MAPPINGS } from '../data/mapping';
import { RATER_SHEETS, RATER_FIELDS } from '../data/raterSchema';

export default function DataMapping() {
  const [expandedSheets, setExpandedSheets] = useState({
    'sheet-inputs': true,
    'sheet-inputs-loc': true,
    'sheet-coverages': false,
    'sheet-rate-factors': false,
    'sheet-ind-rf': false,
  });
  const [selectedSheet, setSelectedSheet] = useState('sheet-inputs');

  const toggleSheet = (sheetId) => {
    setExpandedSheets((prev) => ({
      ...prev,
      [sheetId]: !prev[sheetId],
    }));
    setSelectedSheet(sheetId);
  };

  // Get field count by sheet
  const getFieldCountBySheet = (sheetId) => {
    return RATER_FIELDS.filter((f) => f.sheetId === sheetId).length;
  };

  // Get mappings for a sheet
  const getMappingsForSheet = (sheetId) => {
    const fieldNames = RATER_FIELDS.filter((f) => f.sheetId === sheetId).map((f) => f.fieldName);
    return FIELD_MAPPINGS.filter((m) => fieldNames.includes(m.fieldName));
  };

  const sheetMappings = getMappingsForSheet(selectedSheet);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 flex items-center gap-3">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md font-medium text-sm hover:bg-purple-700 transition-colors">
          <Icons.Sparkles size={16} />
          Auto-Map
        </button>
        <div className="text-sm text-gray-500">
          {FIELD_MAPPINGS.length} field mappings
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Rater Schema Browser (30%) */}
        <div className="w-[30%] border-r border-gray-200 bg-white overflow-y-auto">
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">
            Rater Workbook
            <div className="text-xs font-normal text-gray-500 mt-1">
              {'ascendex-hab-gl-rater-v3.xlsx'}
            </div>
          </div>

          <div className="p-3 space-y-2">
            {RATER_SHEETS.map((sheet) => {
              const fieldCount = getFieldCountBySheet(sheet.id);
              const sheetFields = RATER_FIELDS.filter((f) => f.sheetId === sheet.id);
              const isSelected = selectedSheet === sheet.id;

              return (
                <div
                  key={sheet.id}
                  className={`border rounded-lg overflow-hidden transition-colors ${
                    isSelected ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Sheet header */}
                  <button
                    onClick={() => toggleSheet(sheet.id)}
                    className={`w-full px-3 py-2 flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Icons.ChevronRight
                        size={16}
                        className={`text-gray-600 transition-transform ${
                          expandedSheets[sheet.id] ? 'rotate-90' : ''
                        }`}
                      />
                      <span className="font-medium text-sm text-gray-900">{sheet.name}</span>
                      <span className="ml-auto text-xs text-gray-500">({fieldCount})</span>
                    </div>
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                      {sheet.cardinalityLabel}
                      {sheet.maxItems && sheet.cardinality === 'array' && ` ×${sheet.maxItems}`}
                    </span>
                  </button>

                  {/* Field list */}
                  {expandedSheets[sheet.id] && (
                    <div className={`border-t ${isSelected ? 'border-purple-200' : 'border-gray-200'} bg-white`}>
                      {sheetFields.map((field, idx) => (
                        <div
                          key={field.id}
                          className={`px-3 py-2 border-b text-xs ${
                            idx === sheetFields.length - 1
                              ? 'border-b-0'
                              : 'border-gray-100'
                          }`}
                        >
                          <div className="font-medium text-gray-700">{field.label}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{field.cellReference}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel - Mapping Table (70%) */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-w-full bg-white">
            {/* Table header */}
            <div className="sticky top-0 grid gap-0 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700"
              style={{
                gridTemplateColumns: '2fr 1.2fr 1.8fr 1fr 1.2fr'
              }}
            >
              <div className="px-4 py-3 border-r border-gray-200">Rater Field</div>
              <div className="px-4 py-3 border-r border-gray-200">Cell Ref</div>
              <div className="px-4 py-3 border-r border-gray-200">Federato Field</div>
              <div className="px-4 py-3 border-r border-gray-200">Type</div>
              <div className="px-4 py-3">Scope</div>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-gray-200">
              {sheetMappings.length > 0 ? (
                sheetMappings.map((mapping) => (
                  <div
                    key={mapping.id}
                    className={`grid gap-0 hover:bg-gray-50 transition-colors ${
                      mapping.scope === 'per-location' ? 'border-l-4 border-l-sky-400' : ''
                    }`}
                    style={{
                      gridTemplateColumns: '2fr 1.2fr 1.8fr 1fr 1.2fr'
                    }}
                  >
                    <div className="px-4 py-3 border-r border-gray-100 text-sm">
                      <div className="font-medium text-gray-900">{mapping.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{mapping.fieldName}</div>
                    </div>

                    <div className="px-4 py-3 border-r border-gray-100 text-sm text-gray-600">
                      {mapping.cellReference}
                    </div>

                    <div className="px-4 py-3 border-r border-gray-100 text-sm text-gray-900">
                      {mapping.mappedTo}
                    </div>

                    <div className="px-4 py-3 border-r border-gray-100 text-sm text-gray-600">
                      {mapping.type}
                    </div>

                    <div className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {mapping.scope === 'account' ? 'Account' : 'Per-Loc'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  No mappings for this sheet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
