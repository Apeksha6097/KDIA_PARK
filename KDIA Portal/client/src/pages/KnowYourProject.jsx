import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import EnvironmentalImpact from '../components/EnvironmentalImpact';
import DemoIndicator from '../components/DemoIndicator';

const KnowYourProject = () => {
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [projectData, setProjectData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProjectDetails();
    }, []);

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get('/customer/project-details', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjectData(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch project details:', err);
            setError('Failed to load project details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!projectData || !projectData.customer || projectData.customer.status !== 'Active') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-white p-12 rounded-[2.5rem] shadow-xl max-w-lg border border-slate-100">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Project Allocation Under Process</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Your solar project allocation is currently being finalized by our engineering team.
                        Details will appear here once the confirmation is complete.
                    </p>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="mt-10 px-8 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-slate-800 transition-all shadow-lg"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const { customer, project, documents } = projectData;

    return (
        <>
            <div className="w-full space-y-12 pb-20">


                {/* SECTION 1 – PROJECT SUMMARY */}
                <section className="bg-white rounded-[2.5rem] p-10 sm:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <svg className="w-64 h-64 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <span className="inline-block px-4 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-emerald-700">
                                    Active Allocation
                                </span>
                                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                    Your Solar Project Overview
                                </h1>
                            </div>
                            <div className="flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-black text-emerald-900 uppercase tracking-widest">{customer.status}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">DISCOM</p>
                                <p className="text-xl font-black text-slate-900">{customer.discom} DISCOM</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Location Type</p>
                                <p className="text-xl font-black text-slate-900">{customer.locationType}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Park / District Name</p>
                                <p className="text-xl font-black text-slate-900">{customer.locationName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Allocated Capacity</p>
                                <p className="text-xl font-black text-emerald-600">{customer.allocatedCapacity.toLocaleString()} <span className="text-sm text-slate-400">kWh</span></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Allocation Date</p>
                                <p className="text-xl font-black text-slate-900">{new Date(customer.allocationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Commissioning Status</p>
                                <p className="text-xl font-black text-slate-900">{project.commissioningStatus}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* SECTION 2 – PROJECT LOCATION DETAILS */}
                    <section className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
                        <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <span className="p-2 bg-slate-900 text-white rounded-xl">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </span>
                            Project Location Details
                        </h2>

                        <div className="flex-grow space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-1 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DISCOM Zone</p>
                                    <p className="text-lg font-bold text-slate-900">{project.discomZone}</p>
                                </div>
                                <div className="space-y-1 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technology Type</p>
                                    <p className="text-lg font-bold text-slate-900">{project.solarTechnology}</p>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Address</p>
                                <p className="text-lg font-bold text-slate-900 leading-relaxed">{project.address}</p>
                            </div>

                            {/* Map Placeholder */}
                            <div className="rounded-[1.5rem] overflow-hidden bg-slate-100 h-64 relative border border-slate-200 group">
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-200/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Interactive Map Integration Pending</p>
                                </div>
                                <div className="w-full h-full bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=25.3444,74.6333&zoom=10&size=800x400&key=MOCK_KEY')] bg-cover bg-center grayscale opacity-40"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="p-4 bg-white/80 rounded-2xl shadow-lg border border-white">
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Location: {customer.locationName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 5 – DOCUMENTS */}
                    <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-900/20 flex flex-col">
                        <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                            <span className="p-2 bg-emerald-500 text-white rounded-xl">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </span>
                            Documents
                        </h2>

                        <div className="space-y-4 flex-grow">
                            {documents.map((doc, idx) => (
                                <button key={idx} className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-emerald-500/10 rounded-xl">
                                            <svg className="w-5 h-5 text-emerald-400 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{doc.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.type}</p>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                            ))}
                        </div>

                        <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-3xl">
                            <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                                Note: Official documents are digitally signed. For physical copies, please visit the DISCOM regional office.
                            </p>
                        </div>
                    </section>
                </div>

                {/* SECTION 3 – PROJECT CAPACITY BREAKDOWN */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project Capacity Breakdown</h2>
                            <p className="text-sm text-slate-500 font-medium mt-1">Real-time capacity utilization for {customer.locationName}</p>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Read-Only Metrics</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50 group hover:border-emerald-200 transition-colors">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Park Capacity</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-900">{project.totalCapacity.toLocaleString()}</span>
                                <span className="text-sm font-bold text-slate-400">kWh</span>
                            </div>
                            <div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-900 w-full"></div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50 group hover:border-emerald-200 transition-colors">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Executed Capacity</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-emerald-600">{project.executedCapacity.toLocaleString()}</span>
                                <span className="text-sm font-bold text-slate-400">kWh</span>
                            </div>
                            <div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${(project.executedCapacity / project.totalCapacity) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50 group hover:border-emerald-200 transition-colors">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Under Execution</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-amber-500">{project.underExecutionCapacity.toLocaleString()}</span>
                                <span className="text-sm font-bold text-slate-400">kWh</span>
                            </div>
                            <div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400" style={{ width: `${(project.underExecutionCapacity / project.totalCapacity) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50 group hover:border-emerald-200 transition-colors">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Balance Capacity</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-400">{project.balanceCapacity.toLocaleString()}</span>
                                <span className="text-sm font-bold text-slate-400">kWh</span>
                            </div>
                            <div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-200" style={{ width: `${(project.balanceCapacity / project.totalCapacity) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4 – ENVIRONMENTAL IMPACT */}
                <section className="bg-white rounded-[2.5rem] p-10 sm:p-16 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <EnvironmentalImpact totalConsumed={customer.allocatedCapacity} showLifetimeView={true} />
                </section>
            </div>
        </>
    );
};

export default KnowYourProject;
