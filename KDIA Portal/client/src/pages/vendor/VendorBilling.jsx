import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import VendorLayout from '../../components/VendorLayout';
import { MOCK_INVOICES, getBillingStats, INVOICE_STATUSES, INVOICE_TYPES } from '../../data/vendorBillingData';

const VendorBilling = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState(MOCK_INVOICES);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

    const stats = useMemo(() => getBillingStats(invoices), [invoices]);

    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            const matchesSearch =
                inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
            const matchesType = typeFilter === 'All' || inv.type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [invoices, searchTerm, statusFilter, typeFilter]);

    const getStatusColor = (status) => {
        return INVOICE_STATUSES.find(s => s.value === status)?.color || 'bg-slate-50 text-slate-600';
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <VendorLayout>
            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Billing & Payments</h1>
                    <p className="text-slate-500 font-medium text-lg italic">Monitor customer collections and invoice aging.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Invoiced</h3>
                        <p className="text-3xl font-black text-slate-900 mb-1">{formatCurrency(stats.totalInvoiced)}</p>
                        <p className="text-xs text-slate-500 font-medium">Billed across {invoices.length} invoices</p>
                    </div>

                    <div className="bg-emerald-50/30 p-7 rounded-[2rem] border border-emerald-100 shadow-sm hover:shadow-xl transition-all">
                        <h3 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-4">Total Collected</h3>
                        <p className="text-3xl font-black text-emerald-600 mb-1">{formatCurrency(stats.totalCollected)}</p>
                        <div className="h-1.5 w-full bg-white rounded-full mt-3 overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-1000"
                                style={{ width: `${(stats.totalCollected / stats.totalInvoiced) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-amber-50/30 p-7 rounded-[2rem] border border-amber-100 shadow-sm hover:shadow-xl transition-all">
                        <h3 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-4">Pending Amount</h3>
                        <p className="text-3xl font-black text-amber-600 mb-1">{formatCurrency(stats.pendingAmount)}</p>
                        <p className="text-xs text-slate-500 font-medium">Within due date</p>
                    </div>

                    <div className="bg-rose-50/30 p-7 rounded-[2rem] border border-rose-100 shadow-sm hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Overdue Amount</h3>
                            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                        </div>
                        <p className="text-3xl font-black text-rose-600 mb-1">{formatCurrency(stats.overdueAmount)}</p>
                        <p className="text-xs text-rose-500/80 font-bold uppercase tracking-tight">Requires Escalation</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search by customer or invoice ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border-0 rounded-2xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                        />
                        <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 bg-slate-50 border-0 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                        >
                            <option value="All">All Statuses</option>
                            {INVOICE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-3 bg-slate-50 border-0 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                        >
                            <option value="All">All Types</option>
                            {INVOICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100 border-collapse">
                            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {filteredInvoices.map((inv, idx) => (
                                    <tr
                                        key={inv.invoiceId}
                                        onClick={() => navigate(`/vendor/billing/${inv.invoiceId}`)}
                                        className={`hover:bg-slate-50 cursor-pointer transition-all duration-300 group ${idx % 2 !== 0 ? 'bg-slate-50/30' : ''}`}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black group-hover:bg-white transition-colors">
                                                    {inv.customerName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-900 mb-0.5">{inv.customerName}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{inv.invoiceId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-slate-500 uppercase">{inv.type}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-black text-slate-900">{formatCurrency(inv.amount)}</div>
                                            {inv.amountPaid > 0 && inv.status !== 'Paid' && (
                                                <div className="text-[9px] font-bold text-emerald-600 uppercase mt-0.5">Paid: {formatCurrency(inv.amountPaid)}</div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`text-xs font-bold uppercase ${inv.status === 'Overdue' ? 'text-rose-500' : 'text-slate-500'}`}>
                                                {inv.dueDate}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${getStatusColor(inv.status)}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all">
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </VendorLayout>
    );
};

export default VendorBilling;
