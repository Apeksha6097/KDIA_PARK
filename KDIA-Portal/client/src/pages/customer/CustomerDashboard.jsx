import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CustomerLayout from '../../components/CustomerLayout';
import DemoIndicator from '../../components/DemoIndicator';

const CustomerDashboard = () => {
    const { user, token } = useAuth();
    const [data, setData] = useState({
        allocationName: 'Standard Solar Allocation',
        allocationStatus: 'ACTIVE',
        totalSubscribed: 500,
        totalConsumed: 312,
        activeStatus: 'APPROVED',
        billingCycle: 'Monthly',
        nextBillingDate: '2026-07-01',
        agreementStatus: 'Signed & Active',
        agreementExpiry: '2031-06-08',
        openTickets: 0,
        projectInfo: 'KDIA Clean Energy Grid Alpha',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/api/dashboard/summary', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(prev => ({ ...prev, ...res.data }));
            } catch (err) {
                console.info('Using offline fallback metrics for Customer.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [token]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
    );

    return (
        <CustomerLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back, {user?.fullName || 'Customer'}</h1>
                    <p className="text-slate-500 mt-2 font-medium">Your solar energy client control portal.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Allocation Overview */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">01 / ENERGY</span>
                            <h3 className="text-lg font-black text-slate-800 mt-2">Allocation Overview</h3>
                            <p className="text-sm text-slate-500 mt-1">Status of your active solar grid allocation.</p>
                        </div>
                        <div className="mt-6">
                            <p className="text-2xl font-black text-teal-600">{data.totalSubscribed} kWh</p>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 block">Monthly Quota</span>
                        </div>
                    </div>

                    {/* Subscription Details */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">02 / BILLING</span>
                            <h3 className="text-lg font-black text-slate-800 mt-2">Subscription Details</h3>
                            <p className="text-sm text-slate-500 mt-1">Billing frequency and subscription tier.</p>
                        </div>
                        <div className="mt-6 space-y-1">
                            <p className="text-lg font-black text-slate-800">Tier Rates: Standard</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Next Invoice: {data.nextBillingDate}</p>
                        </div>
                    </div>

                    {/* Agreement Details */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">03 / COMPLIANCE</span>
                            <h3 className="text-lg font-black text-slate-800 mt-2">Agreement Details</h3>
                            <p className="text-sm text-slate-500 mt-1">Legal and operational grid agreement details.</p>
                        </div>
                        <div className="mt-6 space-y-1">
                            <p className="text-lg font-black text-slate-800">{data.agreementStatus}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Expires: {data.agreementExpiry}</p>
                        </div>
                    </div>

                    {/* Support Summary */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">04 / SUPPORT</span>
                            <h3 className="text-lg font-black text-slate-800 mt-2">Support Summary</h3>
                            <p className="text-sm text-slate-500 mt-1">Active customer support inquiries status.</p>
                        </div>
                        <div className="mt-6">
                            <p className="text-lg font-black text-indigo-600">{data.openTickets} Open Tickets</p>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 block">SLA Priority: High</span>
                        </div>
                    </div>

                    {/* Project Information */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between md:col-span-2">
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">05 / INFRASTRUCTURE</span>
                            <h3 className="text-lg font-black text-slate-800 mt-2">Project Information</h3>
                            <p className="text-sm text-slate-500 mt-1">Regional clean energy grid parameter values.</p>
                        </div>
                        <div className="mt-6 space-y-2">
                            <p className="text-lg font-black text-slate-800">{data.projectInfo}</p>
                            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                                Clean grid operations managed directly by KDIA authorities to guarantee consistent power distribution parameters.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <DemoIndicator />
        </CustomerLayout>
    );
};

export default CustomerDashboard;
