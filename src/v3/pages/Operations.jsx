import React from 'react';
import { Icons } from '../utils/icons';

export default function Operations() {
  // Policy lifecycle stages with mock data
  const stages = [
    { name: 'Submission', configured: true, sla: '24 hours', approval: 'Auto' },
    { name: 'Quote', configured: true, sla: '48 hours', approval: 'Manager' },
    { name: 'Bind', configured: true, sla: '4 hours', approval: 'UW Lead' },
    { name: 'In-Force', configured: true, sla: '0 hours', approval: 'Auto' },
    { name: 'Endorsement', configured: false, sla: '—', approval: '—' },
    { name: 'Renewal', configured: false, sla: '—', approval: '—' },
    { name: 'Cancellation', configured: false, sla: '—', approval: '—' },
  ];

  return (
    <div className="space-y-6">
      {/* Card 1: Policy Lifecycle Pipeline */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Policy Lifecycle</h2>

        {/* Pipeline visualization */}
        <div className="flex items-center gap-1 overflow-x-auto pb-4">
          {stages.map((stage, idx) => (
            <React.Fragment key={stage.name}>
              {/* Stage card */}
              <div className="flex-shrink-0 w-40">
                <div className={`rounded-md border-2 p-4 transition-all ${
                  stage.configured
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-gray-900">{stage.name}</span>
                    {stage.configured ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        <Icons.Check size={12} />
                        Configured
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-medium">
                        Not Set
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-gray-600 block">SLA</span>
                      <span className="text-gray-900 font-medium">{stage.sla}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Approval</span>
                      <span className="text-gray-900 font-medium">{stage.approval}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow connector between stages */}
              {idx < stages.length - 1 && (
                <div className="flex-shrink-0 w-4 flex items-center justify-center">
                  <div className="w-4 h-0.5 bg-gray-300"></div>
                  <Icons.ChevronRight size={16} className="text-gray-400 -ml-2" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            Each stage shows configuration status, SLA target, and required approval level.
            Unconfigured stages (gray) can be enabled when operations rules are defined.
          </p>
        </div>
      </div>

      {/* Card 2: Billing Settings */}
      <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        {/* Coming Soon Banner */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</div>
            <p className="text-sm text-gray-600">Billing settings configuration will be available in a future release.</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing Settings</h2>

        <div className="space-y-6 pointer-events-none opacity-50">
          {/* Payment Methods section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Payment Methods</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                <span className="text-sm text-gray-700">Credit Card</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                <span className="text-sm text-gray-700">ACH / Bank Transfer</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">Check / Money Order</span>
              </label>
            </div>
          </div>

          {/* Installment Plans section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Installment Plans</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option>Monthly (12 payments)</option>
              <option>Quarterly (4 payments)</option>
              <option>Semi-Annual (2 payments)</option>
              <option>Annual (1 payment)</option>
            </select>
          </div>

          {/* Grace Period section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grace Period (days)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Late Fee (%)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="10"
              />
            </div>
          </div>

          {/* Cancellation Policy section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Cancellation Policy</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                <input type="radio" name="cancellation" className="w-4 h-4 text-blue-600" defaultChecked />
                <span className="text-sm text-gray-700">Cancellation fee applies</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                <input type="radio" name="cancellation" className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Pro-rata refund, no fee</span>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Info callout */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Icons.AlertTriangle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Policy operations are foundational</p>
          <p className="text-blue-800">Before activating this product, configure the policy lifecycle stages and billing rules that govern customer interactions throughout the policy term.</p>
        </div>
      </div>
    </div>
  );
}
