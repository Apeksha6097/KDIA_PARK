import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VendorLayout from '../../components/VendorLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DashboardBanner from '../../components/DashboardBanner';
import { MOCK_TICKETS } from '../../data/vendorSupportData';

const VendorDashboard = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        assignedLeads: 0,
        customersOnboarded: 0,
        pendingActions: 0,
        pendingCustomers: 0
    });
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, leadsRes] = await Promise.all([
                    api.get('/vendor-customers/stats', { headers: { Authorization: `Bearer ${token}` } }),
                    api.get('/leads', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setStats(statsRes.data);
                setLeads(leadsRes.data);
            } catch (err) {
                console.error("Error fetching vendor data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchData();
    }, [token]);

    const statsConfig = [
        {
            label: 'Assigned Leads',
            value: stats.assignedLeads,
            icon: (
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            description: 'New leads assigned for follow-up',
            path: '/vendor/leads',
            tooltip: 'Total potential customers assigned to you by admin.'
        },
        {
            label: 'Draft Applications',
            value: stats.pendingActions,
            icon: (
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            description: 'Unsubmitted applications',
            path: '/vendor/customers',
            tooltip: 'Customers you have started onboarding but not yet submitted for KDIA approval.'
        },
        {
            label: 'Active Customers',
            value: stats.customersOnboarded,
            icon: (
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            description: 'Successfully onboarded',
            path: '/vendor/customers',
            tooltip: 'Total number of customers who have been successfully onboarded and approved.'
        }
    ];

    const todayFocus = [
        {
            title: 'New Leads',
            count: leads.filter(l => l.status === 'New').length,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            action: () => navigate('/vendor/leads'),
            label: 'Respond'
        },
        {
            title: 'Action Required',
            count: stats.pendingActions,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            action: () => navigate('/vendor/customers'),
            label: 'Complete'
        },
        {
            title: 'Scheduled Meetings',
            count: leads.filter(l => l.status === 'Meeting Scheduled').length,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-100',
            action: () => navigate('/vendor/leads'),
            label: 'View'
        }
    ];

    const onboardingSteps = [
        { icon: '🎯', text: 'Review new assigned leads', done: stats.assignedLeads > 0 },
        { icon: '📞', text: 'Contact prospective customers', done: leads.some(l => l.status !== 'New') },
        { icon: '📝', text: 'Fill out draft application', done: stats.pendingActions > 0 || stats.customersOnboarded > 0 },
        { icon: '🚀', text: 'Submit for admin approval', done: stats.customersOnboarded > 0 }
    ];

    const conversionRate = stats.assignedLeads > 0
        ? Math.round((stats.customersOnboarded / stats.assignedLeads) * 100)
        : 0;

    return (
        <VendorLayout>
            <DashboardBanner
                title="Sales Partner Workspace"
                text="Streamline your workflow, manage assignments, and accelerate customer onboarding."
            />

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
                {/* Action-Oriented Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Sales Dashboard</h1>
                        <p className="text-slate-500 font-medium text-lg">Your performance and priorities at a glance.</p>
                    </div>

                    {/* Primary Actions */}
                    <div className="flex flex-wrap gap-3">
                        {stats.assignedLeads > 0 && (
                            <button
                                onClick={() => navigate('/vendor/leads')}
                                className="px-6 py-3 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 group"
                            >
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                                Follow Up on Leads
                            </button>
                        )}
                        {stats.pendingActions > 0 && (
                            <button
                                onClick={() => navigate('/vendor/customers')}
                                className="px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center gap-2 group"
                            >
                                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Complete Drafts
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Stats & Today's Focus */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Interactive Stat Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {statsConfig.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => navigate(item.path)}
                                    className="group relative bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="p-2 bg-emerald-50 rounded-full">
                                            <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                            {item.icon}
                                        </div>
                                        <div className="relative group/tooltip">
                                            <svg className="w-4 h-4 text-slate-300 cursor-help hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all duration-300 z-50">
                                                <div className="bg-slate-900 text-white text-[10px] p-3 rounded-xl w-48 shadow-2xl font-bold leading-relaxed tracking-wide uppercase">
                                                    {item.tooltip}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-5xl font-black text-slate-900 mb-2">{loading ? '...' : item.value}</p>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{item.label}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{item.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Today's Focus Widget */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 group-hover:opacity-40 transition-opacity duration-700"></div>

                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-1">Today's Focus</h3>
                                    <p className="text-sm text-slate-500 font-medium italic">High priority tasks requiring attention</p>
                                </div>
                                <span className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Prioritized
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {todayFocus.map((item, idx) => (
                                    <div key={idx} className={`p-6 rounded-2xl border ${item.border} ${item.bg} flex flex-col justify-between group/item hover:scale-[1.02] transition-transform`}>
                                        <div className="mb-4">
                                            <p className={`text-4xl font-black ${item.color} mb-1`}>{loading ? '...' : item.count}</p>
                                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{item.title}</p>
                                        </div>
                                        <button
                                            onClick={item.action}
                                            className={`w-full py-2.5 rounded-xl border border-white bg-white/50 text-[10px] font-black uppercase tracking-tight hover:bg-white transition-all ${item.color.replace('text', 'text')}`}
                                        >
                                            {item.label} Tasks
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Customer Support Requests Section */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-rose-50 rounded-full blur-3xl opacity-10 -mr-20 -mt-20 group-hover:opacity-20 transition-opacity duration-700"></div>

                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-1">Customer Support Requests</h3>
                                    <p className="text-sm text-slate-500 font-medium italic">Monitor and resolve customer complaints</p>
                                </div>
                                <button
                                    onClick={() => navigate('/vendor/support')}
                                    className="px-6 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                                >
                                    View All Requests →
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between group/card hover:bg-white hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-300">
                                    <div>
                                        <p className="text-4xl font-black text-slate-900 mb-1">
                                            {loading ? '...' : MOCK_TICKETS.filter(t => t.status === 'Open' || t.status === 'In Progress').length}
                                        </p>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Open Requests</p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-200/50">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Attention Required</span>
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between group/card hover:bg-white hover:shadow-xl hover:shadow-rose-900/5 transition-all duration-300">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-4xl font-black text-rose-600 mb-1">
                                                {loading ? '...' : MOCK_TICKETS.filter(t => t.priority === 'High' && t.status !== 'Resolved').length}
                                            </p>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">High Priority</p>
                                        </div>
                                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-200/50">
                                        <span className="text-[9px] font-bold text-rose-500 uppercase">Urgent Action</span>
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between group/card hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300">
                                    <div>
                                        <p className="text-4xl font-black text-emerald-600 mb-1">
                                            {loading ? '...' : MOCK_TICKETS.filter(t => t.status === 'Resolved').length}
                                        </p>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resolved This Week</p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-200/50">
                                        <span className="text-[9px] font-bold text-emerald-500 uppercase">Efficiency Target Met</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity / Onboarding Guided Empty State */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                            <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
                                Recent Activity
                            </h3>

                            {/* Empty State Replacement: Guided Onboarding Checklist */}
                            <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl p-10 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Your Success Checklist</h4>
                                    <p className="text-xs text-slate-500 font-bold mb-8 uppercase tracking-widest">Follow these steps to start generating revenue</p>

                                    <div className="space-y-4 text-left mb-10">
                                        {onboardingSteps.map((step, idx) => (
                                            <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                                <span className="text-xl">{step.icon}</span>
                                                <span className={`text-sm font-bold flex-1 ${step.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{step.text}</span>
                                                {step.done ? (
                                                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 border-2 border-slate-100 rounded-full"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {!onboardingSteps.every(s => s.done) && (
                                        <button
                                            onClick={() => navigate('/vendor/leads')}
                                            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20"
                                        >
                                            Start My First Task
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Performance & Help */}
                    <div className="space-y-8">

                        {/* Performance Snapshot */}
                        <div className="card-premium p-8 border-t-4 border-t-emerald-600">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Partner Performance</h3>

                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-sm font-bold text-slate-700">Lead Conversion Rate</p>
                                        <p className="text-2xl font-black text-emerald-600">{loading ? '...' : `${conversionRate}%`}</p>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 transition-all duration-1000 ease-out rounded-full"
                                            style={{ width: `${loading ? 0 : conversionRate}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Avg. Onboarding</p>
                                        <p className="text-lg font-black text-slate-900">2.4 Days</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Goal Status</p>
                                        <p className="text-lg font-black text-emerald-600">On Track</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contextual Help Widget */}
                        <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl shadow-slate-900/40">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                                <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Vendor Support</h3>
                            <div className="space-y-6">
                                <div className="relative group/help">
                                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-1 cursor-help flex items-center gap-2">
                                        Your Role
                                        <svg className="w-3 h-3 opacity-50" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                                    </p>
                                    <p className="text-sm text-slate-400 leading-relaxed group-hover/help:text-white transition-colors">
                                        As a KDIA Sales Partner, you manage the end-to-end customer onboarding journey—from lead assignment to submission.
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Quick Shortcuts</p>
                                    <div className="space-y-3">
                                        <button className="w-full text-left text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest py-1">• Lead Assignment Flow</button>
                                        <button className="w-full text-left text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest py-1">• Submission Guide</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </VendorLayout>
    );
};

export default VendorDashboard;

