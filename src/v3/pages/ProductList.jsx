import React, { useState, useMemo } from 'react';
import TabNav from '../components/TabNav';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { Icons } from '../utils/icons';
import { PRODUCTS } from '../data/products';
import { FORMS } from '../data/forms';
import { LOB_TYPES, STATES } from '../data/carrier';

/**
 * ProductList.jsx - Page 1: Product Studio List
 *
 * Three-tab interface for managing products, forms library, and lines of business.
 * Includes an embedded Create Product modal.
 *
 * Props:
 *   - onNavigate: function(path) - navigate to a different page
 *   - onCreateProduct: function(productData) - handle product creation
 *   - showCreateModal: boolean - control modal visibility
 *   - onCloseCreateModal: function() - close the modal
 */
export default function ProductList({
  onNavigate = () => {},
  onCreateProduct = () => {},
  showCreateModal = false,
  onCloseCreateModal = () => {},
}) {
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLOBType, setFilterLOBType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLOB = !filterLOBType || product.lobType === filterLOBType;
      const matchesStatus = !filterStatus || product.status === filterStatus;
      return matchesSearch && matchesLOB && matchesStatus;
    });
  }, [searchQuery, filterLOBType, filterStatus]);

  // Format state names into chip badges
  const renderStates = (states) => {
    if (!states || states.length === 0) return '—';
    return (
      <div className="flex flex-wrap gap-1">
        {states.slice(0, 3).map((state) => (
          <span
            key={state}
            className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
          >
            {state}
          </span>
        ))}
        {states.length > 3 && (
          <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600">
            +{states.length - 3}
          </span>
        )}
      </div>
    );
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Products tab columns
  const productColumns = [
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      width: '280px',
      render: (value) => <span className="font-medium text-gray-900">{value}</span>,
    },
    {
      key: 'lobType',
      label: 'LOB Type',
      sortable: true,
      width: '140px',
      render: (value) => {
        const lob = LOB_TYPES.find((t) => t.id === value);
        return lob ? lob.label : value;
      },
    },
    {
      key: 'version',
      label: 'Version',
      sortable: true,
      width: '100px',
    },
    {
      key: 'states',
      label: 'States',
      sortable: false,
      width: '200px',
      render: renderStates,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '120px',
      render: (value) => {
        const statusMap = {
          draft: 'Draft',
          active: 'Active',
          'under-filing': 'Under Filing',
          archived: 'Archived',
        };
        return <StatusBadge status={statusMap[value] || 'Draft'} />;
      },
    },
    {
      key: 'lastModified',
      label: 'Last Modified',
      sortable: true,
      width: '140px',
      render: formatDate,
    },
  ];

  // Forms table columns
  const formColumns = [
    {
      key: 'formNumber',
      label: 'Form Number',
      sortable: true,
      width: '120px',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'formName',
      label: 'Form Name',
      sortable: true,
      width: '320px',
    },
    {
      key: 'edition',
      label: 'Edition',
      sortable: true,
      width: '100px',
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      width: '120px',
      render: (value) => {
        const typeMap = {
          base: 'Base Form',
          endorsement: 'Endorsement',
        };
        const bg = value === 'base' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700';
        return (
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${bg}`}>
            {typeMap[value]}
          </span>
        );
      },
    },
    {
      key: 'required',
      label: 'Required',
      sortable: false,
      width: '100px',
      render: (value) =>
        value ? (
          <div className="flex items-center gap-1 text-gray-700">
            <Icons.Lock size={14} />
            <span className="text-xs">Required</span>
          </div>
        ) : (
          <span className="text-xs text-gray-500">Optional</span>
        ),
    },
  ];

  // Lines of Business table columns
  const lobColumns = [
    {
      key: 'name',
      label: 'LOB Object Name',
      sortable: true,
      width: '240px',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'lobTypeId',
      label: 'LOB Type',
      sortable: true,
      width: '160px',
      render: (value) => {
        const lob = LOB_TYPES.find((t) => t.id === value);
        return lob ? lob.label : value;
      },
    },
    {
      key: 'id',
      label: 'Products',
      sortable: false,
      width: '160px',
      render: (value) => {
        const count = PRODUCTS.filter((p) => p.lobObject === value).length;
        return <span className="text-gray-700">{count} product(s)</span>;
      },
    },
    {
      key: 'created',
      label: 'Created',
      sortable: true,
      width: '140px',
      render: (value = '2026-03-18') => formatDate(value),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '120px',
      render: (value = 'active') => (
        <StatusBadge status={value === 'active' ? 'Active' : 'Draft'} />
      ),
    },
  ];

  // Mock LOB Objects data
  const lobObjects = [
    {
      id: 'ascendex-hab-gl',
      name: 'Ascendex Habitational GL',
      lobTypeId: 'gl',
      created: '2026-01-15',
      status: 'active',
    },
  ];

  return (
    <div className="bg-white rounded-lg">
      {/* Tab Navigation */}
      <div className="px-6 pt-6">
        <TabNav
          tabs={[
            { id: 'products', label: 'Products', count: PRODUCTS.length },
            { id: 'forms', label: 'Policy Form Library', count: FORMS.length },
            { id: 'lob', label: 'Lines of Business', count: lobObjects.length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />
      </div>

      {/* Tab Content */}
      <div className="px-6 pb-8">
        {/* ===== PRODUCTS TAB ===== */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Header with search and create button */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Icons.Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => onCreateProduct?.()}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm transition-colors"
              >
                <Icons.Plus size={16} />
                Create Product
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">LOB Type</label>
                <select
                  value={filterLOBType}
                  onChange={(e) => setFilterLOBType(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Types</option>
                  {LOB_TYPES.map((lob) => (
                    <option key={lob.id} value={lob.id}>
                      {lob.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="under-filing">Under Filing</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {(searchQuery || filterLOBType || filterStatus) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterLOBType('');
                    setFilterStatus('');
                  }}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium mt-5"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Products Table */}
            <DataTable
              columns={productColumns}
              data={filteredProducts}
              onRowClick={(row) => onNavigate(`/product-studio/products/${row.id}`)}
              emptyMessage={searchQuery || filterLOBType || filterStatus ? 'No products match your filters' : 'No products yet'}
            />
          </div>
        )}

        {/* ===== POLICY FORM LIBRARY TAB ===== */}
        {activeTab === 'forms' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              All forms across the carrier ({FORMS.length} total)
            </div>
            <DataTable
              columns={formColumns}
              data={FORMS}
              emptyMessage="No forms found"
            />
          </div>
        )}

        {/* ===== LINES OF BUSINESS TAB ===== */}
        {activeTab === 'lob' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {lobObjects.length} Lines of Business
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-lg font-medium text-sm transition-colors">
                <Icons.Plus size={16} />
                Create LOB
              </button>
            </div>
            <DataTable
              columns={lobColumns}
              data={lobObjects}
              emptyMessage="No lines of business configured"
            />
          </div>
        )}
      </div>

      {/* ===== CREATE PRODUCT MODAL ===== */}
      {showCreateModal && (
        <CreateProductModal
          onClose={onCloseCreateModal}
          onCreate={onCreateProduct}
        />
      )}
    </div>
  );
}

/**
 * CreateProductModal - Single-step modal for creating a new product
 *
 * Props:
 *   - onClose: function() - close modal without saving
 *   - onCreate: function(productData) - save new product and close
 */
function CreateProductModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lobType: '',
    effectiveDate: '',
    expiryDate: '',
    states: [],
    admitted: true,
  });

  const [errors, setErrors] = useState({});

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Handle state selection (multi-select)
  const handleStateToggle = (state) => {
    setFormData((prev) => ({
      ...prev,
      states: prev.states.includes(state)
        ? prev.states.filter((s) => s !== state)
        : [...prev.states, state],
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.lobType) newErrors.lobType = 'Line of Business is required';
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call onCreate with form data
    onCreate(formData);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div
          className="w-full max-w-lg bg-white rounded-lg shadow-lg pointer-events-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Create Product</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
              aria-label="Close modal"
            >
              <Icons.X size={20} />
            </button>
          </div>

          {/* Modal Content */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter product name"
                className={`w-full px-4 py-2 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                  errors.name ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Add a brief description"
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            {/* Line of Business Type */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Line of Business Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.lobType}
                onChange={(e) => handleChange('lobType', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                  errors.lobType ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                <option value="">Select a Line of Business</option>
                {LOB_TYPES.map((lob) => (
                  <option key={lob.id} value={lob.id}>
                    {lob.label}
                  </option>
                ))}
              </select>
              {errors.lobType && (
                <p className="mt-1 text-xs text-red-600">{errors.lobType}</p>
              )}
            </div>

            {/* Effective & Expiry Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Effective Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => handleChange('effectiveDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Expiry Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleChange('expiryDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Applicable States */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Applicable States
              </label>
              <div className="flex flex-wrap gap-2">
                {STATES.map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => handleStateToggle(state)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      formData.states.includes(state)
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            {/* Admitted / Non-admitted Toggle */}
            <div className="flex items-center justify-between py-2">
              <label className="text-sm font-medium text-gray-900">
                Admitted Status
              </label>
              <button
                type="button"
                onClick={() => handleChange('admitted', !formData.admitted)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.admitted ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.admitted ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-xs text-gray-600">
                {formData.admitted ? 'Admitted' : 'Non-admitted'}
              </span>
            </div>
          </form>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
