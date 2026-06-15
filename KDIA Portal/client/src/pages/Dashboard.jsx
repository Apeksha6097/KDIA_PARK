import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ActivityTimeline from '../components/ActivityTimeline';
import DashboardBanner from '../components/DashboardBanner';
import DemoIndicator from '../components/DemoIndicator';
import LifecycleTimeline from '../components/LifecycleTimeline';

const Dashboard = () => {
    const { user, token, logout } = useAuth();
    const [data, setData] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedPlan = localStorage.getItem('kdia_selected_plan');
        if (storedPlan) {
            setSelectedPlan(JSON.parse(storedPlan));
        }
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/api/dashboard/summary', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return (
        <div className="p-8 text-center text-red-600">
            {error}
        </div>
    );

    const totalSubscribed = selectedPlan ? selectedPlan.units : data.totalSubscribed;

    // [DEPRECATED] Consumption metrics removed
    // const consumptionPercentage = Math.round((data.totalConsumed / totalSubscribed) * 100);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <>
            <DashboardBanner
                title="KDIA Managed Solar Service"
                text="Your solar energy allocation is managed by KDIA Re Park. This portal provides visibility into your allocation status and access to support services."
            />
            
            <div className="flex-grow w-full">
                {/* Hero Section */}
                <div className="mb-12 bg-teal-900 rounded-[3rem] p-10 sm:p-16 text-white shadow-2xl shadow-teal-900/10 relative overflow-hidden border border-teal-800">
                    <div className="relative z-10 max-w-3xl">
                        <span className="inline-block px-4 py-1 rounded-full bg-teal-400/10 border border-teal-400/20 text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-teal-300">Managed Service</span>
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">{getGreeting()}, {user.fullName.split(' ')[0]}</h1>
                        <p className="mt-6 text-xl text-teal-100/70 font-medium leading-relaxed">
                            Your clean energy allocation is active and secured.
                            <br className="hidden sm:block" />KDIA manages all infrastructure operations to ensure consistent solar delivery.
                        </p>

                        <div className="mt-12 flex flex-wrap gap-6 sm:gap-10">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-teal-400/10 rounded-2xl border border-teal-400/20">
                                    <svg className="w-6 h-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-teal-400">Service Status</p>
                                    <p className="text-lg font-bold">Allocation Active</p>
                                </div>
                            </div>

                            {/* [DEPRECATED] Financial metrics removed
                            <div className="h-10 w-px bg-teal-800 hidden sm:block"></div>
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-emerald-400/10 rounded-2xl border border-emerald-400/20">
                                    <svg className="w-6 h-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400">Allocated Credit</p>
                                    <p className="text-lg font-bold">₹{monthlySavings.toLocaleString()}</p>
                                </div>
                            </div>
                            */}
                        </div>
                    </div>
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-0 left-1/2 -ml-24 -mb-24 w-72 h-72 bg-teal-400/5 rounded-full blur-[60px]"></div>
                    <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-10 hidden lg:block">
                        <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
                    </div>
                </div>

                {/* [DEPRECATED] Value Insights Grid removed */}

                {/* Simplified Stats Grid - Primary Actions */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Energy Allocation Card */}
                    <div className="card-premium overflow-hidden border-t-8 border-t-teal-600 sm:col-span-2">
                        <div className="p-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <dt className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Energy Allocation</dt>
                                    <dd className="mt-2 text-2xl font-black text-slate-900">{data?.allocationName || 'Standard Allocation'}</dd>
                                </div>
                                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    Managed by KDIA
                                </span>
                            </div>

                            {/* Lifecycle Timeline Visual */}
                            <div className="mt-8 mb-6">
                                <LifecycleTimeline
                                    status={user.approvalStatus === 'APPROVED' ? 'ACTIVE' : user.approvalStatus}
                                    hasAllocation={!!data?.allocationName}
                                />
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                                <p className="text-[10px] font-black text-teal-700 bg-teal-50 inline-block px-3 py-1 rounded-full uppercase tracking-widest">{totalSubscribed} kWh Monthly Quota</p>
                                {data?.allocationStatus === 'ACTIVE' && (
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Active
                                    </span>
                                )}
                            </div>

                            <div className="mt-8">
                                <a
                                    href="/customer/know-your-project"
                                    className="inline-flex items-center px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10 group/btn"
                                >
                                    Know Your Project
                                    <svg className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                    Solar allocations are assigned and managed by KDIA. Customers and vendors cannot modify allocations directly.
                                    <span className="block mt-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                                        For changes, contact support.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Promoted Support Card */}
                    <a href="/support" className="card-premium overflow-hidden border-t-8 border-t-indigo-600 group hover:shadow-xl transition-all duration-300">
                        <div className="p-8 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <dt className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Help & Assistance</dt>
                                <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                            </div>
                            <dd className="text-xl font-black text-slate-900 mb-2">Need Help?</dd>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 flex-grow">
                                Contact our team for allocation queries, billing clarification, or general assistance.
                            </p>
                            <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center">
                                Open Support Center
                                <svg className="w-3 h-3 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
