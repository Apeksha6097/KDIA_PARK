import React, { useState, useEffect } from 'react';
import VendorLayout from '../../components/VendorLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

const VendorCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(null); // Track which ID is being submitted
    const { token } = useAuth();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/vendor-customers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomers(res.data);
        } catch (err) {
            console.error("Error fetching customers:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitForApproval = async (customerId) => {
        if (!window.confirm("Submit this application for admin review? This will lock the record from further edits.")) return;

        setSubmitting(customerId);
        try {
            await api.post(`/vendor-customers/${customerId}/submit`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Application submitted for admin review successfully.");
            fetchCustomers();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to submit application");
        } finally {
            setSubmitting(null);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'DRAFT': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'REJECTED': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

    return (
        <VendorLayout>
            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">My Onboarded Customers</h1>
                        <p className="text-slate-500 font-medium">Manage your customer applications and track their approval status.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Customer Relationships</h3>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                        </div>
                    ) : customers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                        <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Consumer ID</th>
                                        <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Onboarded</th>
                                        <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {customers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-slate-900">{customer.fullName}</div>
                                                <div className="text-xs text-slate-500">{customer.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{customer.consumerId}</code>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                                                {new Date(customer.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(customer.approval_status)}`}>
                                                    {customer.approval_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {customer.approval_status === 'DRAFT' && (
                                                    <button
                                                        onClick={() => handleSubmitForApproval(customer.id)}
                                                        disabled={submitting === customer.id}
                                                        className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg shadow-slate-900/10"
                                                    >
                                                        {submitting === customer.id ? 'Submitting...' : 'Submit for Approval'}
                                                    </button>
                                                )}
                                                {customer.approval_status !== 'DRAFT' && (
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Action Locked</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-20 px-6">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No Customers Yet</h3>
                            <p className="text-sm text-slate-500">Begin onboarding customers from the Leads section to see them here.</p>
                        </div>
                    )}
                </div>
            </main>
        </VendorLayout>
    );
};

export default VendorCustomers;
