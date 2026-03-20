import React, { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { Icons } from '../utils/icons';
import { PRODUCTS } from '../data/products';

import Eligibility from './Eligibility';
import PolicyForms from './PolicyForms';
import DataMapping from './DataMapping';
import RaterWorkflow from './RaterWorkflow';
import Operations from './Operations';
import Layouts from './Layouts';

// Status circle: gray dashed = not configured, yellow outline = in progress, green filled = complete
function StatusCircle({ status }) {
  if (status === 'complete') {
    return (
      <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
        <Icons.Check size={10} className="text-white" />
      </div>
    );
  }
  if (status === 'in-progress') {
    return (
      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{
        border: '2px solid #F59E0B',
        background: 'rgba(245,158,11,0.1)',
      }} />
    );
  }
  return (
    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{
      border: '2px dashed #D1D5DB',
    }} />
  );
}

// Navigation sections
const NAV_SECTIONS = [
  { id: 'eligibility', label: 'Eligibility Rules', status: 'in-progress' },
  { id: 'forms', label: 'Policy Forms', status: 'complete' },
  {
    id: 'rater',
    label: 'Rater',
    status: 'in-progress',
    children: [
      { id: 'data-mapping', label: 'Data Mapping' },
      { id: 'workflow', label: 'Underwriter Workflow' },
    ],
  },
  { id: 'layouts', label: 'Page Layouts', status: 'not-configured' },
  { id: 'operations', label: 'Policy Lifecycle', status: 'not-configured' },
];

// Page-specific action buttons
const PAGE_ACTIONS = {
  'overview': null, // no action on overview, Publish Version in the version banner
  'eligibility': { label: 'Save Rules', style: 'primary' },
  'forms': { label: 'Add Form', style: 'secondary' },
  'data-mapping': { label: 'Save Mapping', style: 'primary' },
  'workflow': { label: 'Save Workflow', style: 'primary' },
  'operations': null,
  'layouts': null,
};

const PAGE_TITLES = {
  'overview': 'Overview',
  'eligibility': 'Eligibility Rules',
  'forms': 'Policy Forms & Templates',
  'data-mapping': 'Data Mapping',
  'workflow': 'Underwriter Workflow',
  'operations': 'Policy Lifecycle',
  'layouts': 'Page Layouts',
};

export default function ProductDetail({ productId, activeTab = 'overview', onNavigate }) {
  const product = PRODUCTS.find(p => p.id === productId);
  const [raterExpanded, setRaterExpanded] = useState(
    ['data-mapping', 'workflow'].includes(activeTab)
  );

  if (!product) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const handleNavClick = (sectionId) => {
    if (sectionId === 'overview') {
      onNavigate(`/product-studio/products/${productId}`);
    } else {
      onNavigate(`/product-studio/products/${productId}/${sectionId}`);
    }
  };

  const isActive = (id) => activeTab === id;
  const isRaterChild = ['data-mapping', 'workflow'].includes(activeTab);
  const pageAction = PAGE_ACTIONS[activeTab];

  const getLobTypeLabel = (lobType) => {
    const labels = { gl: 'General Liability', ca: 'Commercial Auto', wc: "Workers' Compensation", bop: 'Business Owners Package', property: 'Property' };
    return labels[lobType] || lobType;
  };

  return (
    <div className="flex h-full">
      {/* Left Navigation Panel */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-auto">
        {/* Product header */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => onNavigate('/product-studio')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="text-sm font-medium text-gray-900">Products</span>
            <span className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">3</span>
              <Icons.ChevronRight size={14} className="text-gray-400" />
            </span>
          </button>
          <div className="mt-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Product</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">{product.name}</p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Version</p>
              <p className="text-sm text-gray-900 mt-0.5">{product.version}</p>
            </div>
            <div className="ml-auto">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
              <div className="mt-0.5">
                <StatusBadge
                  status={product.status === 'draft' ? 'Draft' : product.status === 'active' ? 'Active' : 'Under Filing'}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-2">
          {/* Overview link */}
          <button
            onClick={() => handleNavClick('overview')}
            className={`w-full flex items-center px-4 py-2 text-sm transition ${
              isActive('overview') ? 'bg-amber-50 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Overview
          </button>

          <div className="border-t border-gray-100 my-1" />

          {NAV_SECTIONS.map((section) => (
            <div key={section.id}>
              {section.children ? (
                <>
                  <button
                    onClick={() => setRaterExpanded(!raterExpanded)}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <span className="font-medium">{section.label}</span>
                    <StatusCircle status={section.status} />
                  </button>
                  {(raterExpanded || isRaterChild) && (
                    <div className="ml-4">
                      {section.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleNavClick(child.id)}
                          className={`w-full flex items-center px-4 py-1.5 text-sm transition ${
                            isActive(child.id) ? 'bg-amber-50 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleNavClick(section.id)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm transition ${
                    isActive(section.id) ? 'bg-amber-50 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{section.label}</span>
                  <StatusCircle status={section.status} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto flex flex-col min-w-0">
        {/* Version banner (shows on all pages) */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <Icons.Edit size={14} className="text-gray-400" />
            <span className="text-gray-600">
              <strong className="text-amber-600">{product.version}</strong> is the current working draft version of this product.
            </span>
          </div>
          <div className="flex items-center gap-3">
            {pageAction && (
              <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                pageAction.style === 'primary'
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
                {pageAction.label}
              </button>
            )}
            <button className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition">
              Publish Version
            </button>
          </div>
        </div>

        {/* Page title */}
        <div className="px-6 pt-5 pb-2 flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-900">
            {PAGE_TITLES[activeTab] || 'Product Studio'}
            {activeTab !== 'overview' && (
              <span className="ml-2 text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                Draft changes
              </span>
            )}
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          {activeTab === 'overview' && (
            <OverviewTab product={product} onNavClick={handleNavClick} getLobTypeLabel={getLobTypeLabel} />
          )}
          {activeTab === 'eligibility' && <Eligibility />}
          {activeTab === 'forms' && <PolicyForms />}
          {activeTab === 'data-mapping' && <DataMapping />}
          {activeTab === 'workflow' && <RaterWorkflow />}
          {activeTab === 'operations' && <Operations />}
          {activeTab === 'layouts' && <Layouts />}
        </div>
      </div>
    </div>
  );
}

/** OverviewTab — version table + product definition summary */
function OverviewTab({ product, onNavClick, getLobTypeLabel }) {
  const versions = [
    { version: 'v2.1', status: 'Draft', date: 'Mar 19, 2026', author: 'Miguel Roman', notes: 'Updated eligibility rules, added Hab GL coverages' },
    { version: 'v2.0', status: 'Active', date: 'Mar 1, 2026', author: 'Miguel Roman', notes: 'Initial Hab GL product launch' },
    { version: 'v1.0', status: 'Archived', date: 'Jan 15, 2026', author: 'Miguel Roman', notes: 'Pilot version' },
  ];

  const definitionItems = [
    { id: 'eligibility', label: 'Eligibility Rules', detail: '6 ineligibility gates configured', items: ['Location Count (1-25)', 'Occupancy Type (Residential only)', 'Years in Business (≥ 3)', 'Unit Count (≤ 500/loc)', 'Building Age (< 75 yrs)', 'Prior Claims (≤ 5)'], status: 'in-progress' },
    { id: 'forms', label: 'Policy Forms', detail: '10 forms attached (4 base, 6 endorsements)', items: ['CG 00 01 — CGL Coverage Form', 'CG 00 02 — CGL Declarations', 'IL 00 17 — Common Policy Conditions', '+7 more endorsements'], status: 'complete' },
    { id: 'workflow', label: 'Coverages', detail: '15 coverage options across account and per-location scopes', items: ['General Aggregate ($1M/$2M)', 'Each Occurrence ($1M/$2M)', 'Products-Completed Ops Aggregate', 'Premises Medical Payments', 'Tenant Legal Liability', 'Fire Legal Liability', 'Hired & Non-Owned Auto', '+8 more coverages'], status: 'in-progress' },
  ];

  return (
    <div className="max-w-4xl space-y-8 pt-2">
      {/* Product summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Line of Business Type</span>
            <p className="font-medium text-gray-900 mt-0.5">{getLobTypeLabel(product.lobType)}</p>
          </div>
          <div>
            <span className="text-gray-500">States</span>
            <div className="flex gap-1.5 mt-0.5 flex-wrap">
              {product.states.map(s => (
                <span key={s} className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-700">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Effective Date</span>
            <p className="font-medium text-gray-900 mt-0.5">{product.effectiveDate || 'Not set'}</p>
          </div>
          <div>
            <span className="text-gray-500">Current Version</span>
            <p className="font-medium text-gray-900 mt-0.5">{product.version} <span className="text-gray-400">(Draft)</span></p>
          </div>
        </div>
      </div>

      {/* Version History */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Version History</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Version</th>
                <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v, i) => (
                <tr key={v.version} className={`border-b border-gray-50 ${i === 0 ? 'bg-amber-50/50' : ''}`}>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{v.version}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={v.status} size="sm" /></td>
                  <td className="px-4 py-2.5 text-gray-600">{v.date}</td>
                  <td className="px-4 py-2.5 text-gray-600">{v.author}</td>
                  <td className="px-4 py-2.5 text-gray-600">{v.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Definition Summary */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Product Definition</h3>
        <div className="space-y-3">
          {definitionItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className="w-full text-left bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <StatusCircle status={item.status} />
                  <div>
                    <span className="font-medium text-gray-900 text-sm group-hover:text-amber-700 transition">{item.label}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                  </div>
                </div>
                <Icons.ChevronRight size={14} className="text-gray-400 mt-1" />
              </div>
              {item.items.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5" style={{ marginLeft: '26px' }}>
                  {item.items.map((sub, idx) => (
                    <span key={idx} className="text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded">{sub}</span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
