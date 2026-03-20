import React, { useState } from 'react';
import { Icons } from '../utils/icons';

export default function Layouts() {
  const [draggedItem, setDraggedItem] = useState(null);

  // Available sections in the sidebar
  const availableSections = [
    { id: 'summary', name: 'Policy Summary', icon: 'FileText' },
    { id: 'locations', name: 'Location Details', icon: 'Map' },
    { id: 'coverage', name: 'Coverage Details', icon: 'Briefcase' },
    { id: 'factors', name: 'Underwriting Factors', icon: 'BarChart' },
    { id: 'documents', name: 'Documents', icon: 'Upload' },
    { id: 'notes', name: 'Notes', icon: 'FileText' },
  ];

  // Currently configured sections in the main layout
  const configuredSections = [
    { id: 'summary', name: 'Policy Summary' },
    { id: 'coverage', name: 'Coverage Details' },
    { id: 'locations', name: 'Location Details' },
    { id: 'notes', name: 'Notes' },
  ];

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  return (
    <div className="space-y-6">
      {/* Info banner at top */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Icons.AlertTriangle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Underwriter-facing layout design</p>
          <p className="text-blue-800">Configure how policy information is organized when UWs access the policy page. Drag sections from the left to arrange them in the main grid, or reorder within the grid using handles.</p>
        </div>
      </div>

      {/* Main layout grid with sidebar */}
      <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Coming Soon Banner */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</div>
            <p className="text-sm text-gray-600">Interactive layout configuration will be available in a future release.</p>
          </div>
        </div>

        {/* Two-panel layout */}
        <div className="flex h-full pointer-events-none opacity-50">
          {/* Left Sidebar - Available Sections */}
          <div className="w-56 bg-gray-50 border-r border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icons.Layers size={14} />
              Available Sections
            </h3>

            <div className="space-y-2">
              {availableSections.map((section) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, section)}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 cursor-grab active:cursor-grabbing transition-colors group"
                >
                  <Icons.Grip size={14} className="text-gray-400 group-hover:text-blue-600" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">{section.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-600">Drag sections to the right to add them to the UW page layout.</p>
            </div>
          </div>

          {/* Main Area - Configured Layout Grid */}
          <div className="flex-1 p-8 bg-white">
            <h3 className="text-sm font-semibold text-gray-900 mb-6">Policy Page Layout</h3>

            {/* Grid of section cards */}
            <div className="grid grid-cols-2 gap-6" onDragOver={handleDragOver}>
              {configuredSections.map((section, idx) => (
                <div
                  key={section.id}
                  className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  {/* Section card header with drag handle */}
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium text-gray-900 text-sm">{section.name}</h4>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icons.Grip size={14} className="text-gray-400 cursor-grab" />
                    </div>
                  </div>

                  {/* Placeholder content lines */}
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-300 rounded-full w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded-full"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-5/6"></div>
                    <div className="h-2 bg-gray-300 rounded-full w-1/2"></div>
                  </div>

                  {/* Section footer info */}
                  <div className="mt-4 pt-4 border-t border-gray-300 flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      {idx === 0 && 'Policy metadata section'}
                      {idx === 1 && 'Detailed coverage information'}
                      {idx === 2 && 'Per-location field array'}
                      {idx === 3 && 'Internal notes & history'}
                    </span>
                  </div>
                </div>
              ))}

              {/* Empty drop zone placeholder */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/50 transition-colors min-h-52">
                <Icons.Plus size={20} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Add more sections</p>
                <p className="text-xs text-gray-500 mt-1">Drag from left sidebar</p>
              </div>
            </div>

            {/* Layout guidance */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">2</div>
                  <p className="text-xs text-gray-600">Column layout</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">4</div>
                  <p className="text-xs text-gray-600">Sections configured</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">2</div>
                  <p className="text-xs text-gray-600">Available to add</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout presets (visual reference only) */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Layout Presets</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Preset 1: Single Column */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-not-allowed opacity-50">
            <div className="space-y-3 mb-4">
              <div className="w-full h-12 bg-gray-100 rounded border border-gray-300"></div>
              <div className="w-full h-12 bg-gray-100 rounded border border-gray-300"></div>
              <div className="w-full h-12 bg-gray-100 rounded border border-gray-300"></div>
            </div>
            <p className="text-xs font-medium text-gray-700">Single Column</p>
            <p className="text-xs text-gray-600 mt-1">All sections stacked vertically</p>
          </div>

          {/* Preset 2: Two Column */}
          <div className="bg-white border border-blue-300 rounded-lg p-4 shadow-sm ring-2 ring-blue-100">
            <div className="space-y-3 mb-4">
              <div className="flex gap-3">
                <div className="flex-1 h-10 bg-blue-100 rounded border border-blue-300"></div>
                <div className="flex-1 h-10 bg-blue-100 rounded border border-blue-300"></div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 h-10 bg-blue-100 rounded border border-blue-300"></div>
                <div className="flex-1 h-10 bg-blue-100 rounded border border-blue-300"></div>
              </div>
            </div>
            <p className="text-xs font-medium text-gray-700">Two Column (Current)</p>
            <p className="text-xs text-gray-600 mt-1">Balanced left-right layout</p>
          </div>

          {/* Preset 3: Three Column */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-not-allowed opacity-50">
            <div className="space-y-3 mb-4">
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-gray-100 rounded border border-gray-300"></div>
                <div className="flex-1 h-10 bg-gray-100 rounded border border-gray-300"></div>
                <div className="flex-1 h-10 bg-gray-100 rounded border border-gray-300"></div>
              </div>
            </div>
            <p className="text-xs font-medium text-gray-700">Three Column</p>
            <p className="text-xs text-gray-600 mt-1">Narrow columns for dense info</p>
          </div>
        </div>
      </div>

      {/* Configuration guide */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
          <Icons.AlertTriangle size={14} className="text-amber-600" />
          Layout Configuration Guide
        </h4>
        <ul className="text-xs text-amber-900 space-y-1 list-disc list-inside">
          <li>Drag sections from the left sidebar to customize the UW page</li>
          <li>Reorder sections within the grid using the drag handle (visible on hover)</li>
          <li>Each section will respect its field cardinality when displayed (single vs. repeating)</li>
          <li>The layout preview updates in real-time as you make changes</li>
          <li>Test your layout with the "Generate Preview" button when ready</li>
        </ul>
      </div>
    </div>
  );
}
