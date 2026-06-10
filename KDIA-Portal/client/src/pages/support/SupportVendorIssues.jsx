import React, { useState } from 'react';


const MOCK_VENDOR_ISSUES = [
    { id: 'VI-012', vendor: 'Vendor Partner', subject: 'Net Metering Calibration Refusal', status: 'IN_PROGRESS', date: '2026-06-08' },
    { id: 'VI-013', vendor: 'SunLight Power Partners', subject: 'Inverter Dispatch Delay Phase 2', status: 'OPEN', date: '2026-06-07' },
    { id: 'VI-014', vendor: 'GreenGrid Installations', subject: 'West Zone Feeder Link Error', status: 'RESOLVED', date: '2026-06-04' },
];

const SupportVendorIssues = () => {
    const [issues] = useState(MOCK_VENDOR_ISSUES);

    return (
        <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Vendor Issues & Dispatches</h1>
                    <p className="text-neutral-500">Track structural net metering and installation issues reported by vendor partners.</p>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 text-left">Issue ID</th>
                                    <th className="px-6 py-4 text-left">Vendor Partner</th>
                                    <th className="px-6 py-4 text-left">Subject / Description</th>
                                    <th className="px-6 py-4 text-left">Date Opened</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50 text-neutral-600">
                                {issues.map((issue) => (
                                    <tr key={issue.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-neutral-800">#{issue.id}</td>
                                        <td className="px-6 py-4 font-semibold">{issue.vendor}</td>
                                        <td className="px-6 py-4">{issue.subject}</td>
                                        <td className="px-6 py-4 text-sm text-neutral-400">{issue.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                                                issue.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                issue.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                                {issue.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
    );
};

export default SupportVendorIssues;
