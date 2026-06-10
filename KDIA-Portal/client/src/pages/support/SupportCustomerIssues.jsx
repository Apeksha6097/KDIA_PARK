import React, { useState } from 'react';


const MOCK_CUSTOMERS = [
    { id: 'KDIA-MOCK-001', name: 'Apeksha Sharma', status: 'ACTIVE', type: 'Residential', region: 'West District', issueCount: 1, email: 'customer@kdia.com' },
    { id: 'KDIA-MOCK-002', name: 'Rajesh Kumar', status: 'PENDING_APPROVAL', type: 'Commercial', region: 'North District', issueCount: 2, email: 'rajesh@kdia.com' },
    { id: 'KDIA-MOCK-003', name: 'Solar Tech Solutions', status: 'ACTIVE', type: 'Industrial', region: 'South District', issueCount: 0, email: 'solartech@kdia.com' },
    { id: 'KDIA-MOCK-004', name: 'Priya Mehta', status: 'ACTIVE', type: 'Residential', region: 'East District', issueCount: 0, email: 'priya@kdia.com' },
];

const SupportCustomerIssues = () => {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    const filteredCustomers = MOCK_CUSTOMERS.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'ALL' || c.type.toUpperCase() === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Customer Issues & Lookup</h1>
                    <p className="text-neutral-500">Search customers, check active allocations, and view ticket history.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                    <input
                        type="text"
                        placeholder="Search by name or Consumer ID..."
                        className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:max-w-xs"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="ALL">All Types</option>
                        <option value="RESIDENTIAL">Residential</option>
                        <option value="COMMERCIAL">Commercial</option>
                        <option value="INDUSTRIAL">Industrial</option>
                    </select>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 text-left">Consumer ID</th>
                                    <th className="px-6 py-4 text-left">Name</th>
                                    <th className="px-6 py-4 text-left">Type</th>
                                    <th className="px-6 py-4 text-left">Region</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-left">Open Issues</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50 text-neutral-600">
                                {filteredCustomers.map(customer => (
                                    <tr key={customer.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-neutral-800">{customer.id}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-neutral-800">{customer.name}</p>
                                            <span className="text-xs text-neutral-400">{customer.email}</span>
                                        </td>
                                        <td className="px-6 py-4">{customer.type}</td>
                                        <td className="px-6 py-4">{customer.region}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                customer.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                                {customer.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {customer.issueCount > 0 ? (
                                                <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold">
                                                    {customer.issueCount} Open
                                                </span>
                                            ) : (
                                                <span className="text-neutral-400 text-xs font-medium">None</span>
                                            )}
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

export default SupportCustomerIssues;
