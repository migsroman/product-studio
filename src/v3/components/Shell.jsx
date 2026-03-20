import React from 'react';
import { Icons } from '../utils/icons';

/**
 * Shell.jsx - Federato App Shell (matching production UI from screenshot)
 *
 * - Top bar: warm dark brown (#2C2416), FEDERATO wordmark, action icons
 * - Left nav: icon-only, same warm dark tone
 * - Breadcrumb area with product context
 */
export default function Shell({ children, breadcrumb = [], activeNav = 'package' }) {
  const navItems = [
    { id: 'grid', icon: 'BarChart', tooltip: 'Dashboard' },
    { id: 'layers', icon: 'Layers', tooltip: 'Submissions' },
    { id: 'flag', icon: 'Globe', tooltip: 'Policies' },
    { id: 'briefcase', icon: 'Briefcase', tooltip: 'Control Tower' },
    { id: 'play', icon: 'Activity', tooltip: 'Workflows' },
    { id: 'eye', icon: 'Eye', tooltip: 'Analytics' },
    { id: 'package', icon: 'Package', tooltip: 'Product Studio' },
    { id: 'file', icon: 'FileText', tooltip: 'Documents' },
  ];

  return (
    <div className="flex h-screen" style={{ background: '#F7F7F8' }}>
      {/* Left Navigation - icon only, warm dark */}
      <nav
        className="w-14 flex flex-col items-center py-3 gap-1"
        style={{ background: '#2C2416' }}
      >
        {navItems.map((item) => {
          const Icon = Icons[item.icon];
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              className="relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
              style={{
                color: isActive ? '#FFFFFF' : '#9B8E7B',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              }}
              title={item.tooltip}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r"
                  style={{ background: '#FFFFFF' }}
                />
              )}
              {Icon && <Icon size={20} />}
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Bar - warm dark brown */}
        <header
          className="h-12 flex items-center px-5 justify-between flex-shrink-0"
          style={{ background: '#2C2416' }}
        >
          {/* Left: FEDERATO Wordmark */}
          <div className="flex items-center gap-4">
            <span
              className="font-bold text-sm tracking-[0.2em]"
              style={{ color: '#F5F0E8' }}
            >
              FEDERATO
            </span>
          </div>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded transition" style={{ color: '#9B8E7B' }}>
              <Icons.Zap size={18} />
            </button>
            <button className="p-1.5 rounded transition" style={{ color: '#9B8E7B' }}>
              <Icons.Settings size={18} />
            </button>
            <button className="p-1.5 rounded transition" style={{ color: '#9B8E7B' }}>
              <Icons.Globe size={18} />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: '#D4A853' }}
            >
              MR
            </div>
          </div>
        </header>

        {/* Breadcrumb bar */}
        <div className="bg-white border-b border-gray-200 px-5 py-2.5 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-sm">
            {breadcrumb.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-gray-300 mx-1">/</span>}
                {item.icon && <span className="mr-1">{item.icon}</span>}
                <button
                  onClick={item.onClick}
                  className={`transition ${
                    idx === breadcrumb.length - 1
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
                {item.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs font-medium rounded bg-gray-100 border border-gray-200 text-gray-600">
                    {item.badge}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto" style={{ background: '#F7F7F8' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
