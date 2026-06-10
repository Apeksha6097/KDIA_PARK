import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';


const SupportProfile = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState('Online');

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header section */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support Agent Profile</h1>
                <p className="text-slate-500 mt-2 font-medium">Manage your agent profile, shift timings, and online status.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Profile Card (1/3 width on large screens) */}
                <div className="lg:col-span-1 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center">
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-700 rounded-3xl flex items-center justify-center text-4xl font-black mb-6 border border-emerald-100 shadow-inner">
                        {user?.fullName?.charAt(0) || 'S'}
                    </div>
                    <h2 className="font-black text-slate-900 text-xl">{user?.fullName || 'Support Representative'}</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1.5">SLA Specialist</p>

                    <div className="w-full mt-8 pt-8 border-t border-slate-100 space-y-5">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Shift</span>
                            <span className="font-black text-slate-700 text-sm">Morning (9AM - 6PM)</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Duty Status</span>
                            <select
                                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest outline-none text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Online">Online / Duty</option>
                                <option value="Away">Away</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Right Performance Card (2/3 width on large screens) */}
                <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                    <div className="mb-8">
                        <h3 className="font-black text-slate-900 text-xl tracking-tight mb-2">Agent Performance</h3>
                        <p className="text-sm text-slate-500 font-medium">Your SLA metrics for the current billing cycle.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Tickets Handled</p>
                            <p className="text-4xl font-black text-slate-900">142</p>
                        </div>
                        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex flex-col items-start hover:shadow-md transition-shadow">
                            <p className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-widest mb-2">Avg Resolution SLA</p>
                            <p className="text-4xl font-black text-emerald-700">4.2 <span className="text-lg font-bold text-emerald-600/70">Hrs</span></p>
                        </div>
                        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex flex-col items-start hover:shadow-md transition-shadow">
                            <p className="text-[10px] text-indigo-600/70 font-bold uppercase tracking-widest mb-2">Satisfaction Rate</p>
                            <p className="text-4xl font-black text-indigo-700">98.5<span className="text-lg font-bold text-indigo-600/70">%</span></p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                        <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-5">Assigned Queue Regional Coverage</h4>
                        <div className="flex flex-wrap gap-3">
                            {['West District', 'East District', 'Corporate SLA', 'High Priority'].map((tag) => (
                                <span key={tag} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl shadow-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportProfile;
