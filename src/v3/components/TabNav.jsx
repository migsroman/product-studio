import React from 'react';

/**
 * TabNav.jsx - Underline-Style Tab Navigation
 *
 * Features:
 *   - Underline-style active indicator (teal #10B981)
 *   - Bold text for active tab
 *   - 14px medium weight
 *   - Optional count badges per tab
 *   - Horizontal layout with gap
 *
 * Props:
 *   - tabs: array of {id, label, count?}
 *   - activeTab: currently active tab id
 *   - onChange: function(tabId)
 *   - className?: optional additional tailwind classes
 */
export default function TabNav({ tabs = [], activeTab, onChange, className = '' }) {
  return (
    <div className={`flex items-center gap-8 border-b border-gray-200 bg-white ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              px-1 py-3 text-sm font-medium transition-colors relative
              ${isActive
                ? 'text-gray-900 font-bold'
                : 'text-gray-600 hover:text-gray-900'}
            `}
          >
            <div className="flex items-center gap-2">
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-xs font-semibold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                  {tab.count}
                </span>
              )}
            </div>

            {/* Active underline */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"></div>
            )}
          </button>
        );
      })}
    </div>
  );
}
