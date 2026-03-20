import React from 'react';

/**
 * StatusBadge.jsx - Reusable Status Pill Component
 *
 * Props:
 *   - status: string ('Active', 'Published', 'Draft', 'Under Filing', 'Archived', 'Declined')
 *   - size: 'sm' (11px) | 'md' (12px, default)
 *   - className: optional additional tailwind classes
 */
export default function StatusBadge({ status, size = 'md', className = '' }) {
  const statusConfig = {
    'Active': { bg: 'bg-green-100', text: 'text-green-700' },
    'Published': { bg: 'bg-green-100', text: 'text-green-700' },
    'Draft': { bg: 'bg-amber-100', text: 'text-amber-700' },
    'Under Filing': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'Archived': { bg: 'bg-gray-100', text: 'text-gray-700' },
    'Declined': { bg: 'bg-red-100', text: 'text-red-700' },
  };

  const config = statusConfig[status] || statusConfig['Draft'];

  const sizeClasses = {
    'sm': 'px-2 py-0.5 text-xs',
    'md': 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-block font-medium rounded-full
        ${config.bg} ${config.text}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {status}
    </span>
  );
}
