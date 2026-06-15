// [DEPRECATED] Vendor-Led Allocation Model
// This component is no longer accessible to customers.
// Plans are now assigned by vendors/admins directly.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Subscription = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const plans = [
        {
            id: 'small',
            name: 'Small Energy Allocation',
            units: 500,
            indicativePrice: '₹2,500 - ₹3,000',
            intendedUse: 'Apartments / Lower Load',
            offset: '~75% of average load',
            features: ['VNM/GNM Authorized', 'Digital Performance Ledger', 'Quarterly Infrastructure Audit'],
            color: 'teal'
        },
        {
            id: 'medium',
            name: 'Medium Energy Allocation',
            units: 1000,
            indicativePrice: '₹4,500 - ₹5,500',
            intendedUse: 'Standard Households',
            offset: '~100% of average load',
            features: ['Priority Grid Sync', 'Real-time Yield Monitoring', 'Optimization Alerts'],
            color: 'emerald',
            recommended: true
        },
        {
            id: 'large',
            name: 'Large Energy Allocation',
            units: 2000,
            indicativePrice: '₹9,000 - ₹11,000',
            intendedUse: 'High-Demand Res / SMEs',
            offset: '100%+ Coverage Capacity',
            features: ['Dedicated Portfolio Analyst', 'Multi-site Allocation Support', 'Yield Optimization Reports'],
            color: 'slate'
        }
    ];

    const handleSelect = (planId) => {
        setSelectedPlan(plans.find(p => p.id === planId));
    };

    const handleProceed = () => {
        if (selectedPlan && !isSubmitting) {
            setIsSubmitting(true);
            // Mock saving the plan to localStorage or state for MVP demo
            localStorage.setItem('kdia_selected_plan', JSON.stringify(selectedPlan));
            setTimeout(() => {
                setConfirmed(true);
                setIsSubmitting(false);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }, 1000);
        }
    };

    if (confirmed) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-10 animate-pulse border border-teal-100 shadow-xl shadow-teal-900/5">
                    <svg className="w-12 h-12 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">Allocation Recorded</h2>
                <div className="bg-white card-premium py-6 px-10 border-slate-100">
                    <p className="text-slate-500 font-medium">
                        Your intent for the <strong className="text-teal-800">{selectedPlan.name}</strong> has been secured.
                        <br /><span className="text-[10px] uppercase font-black tracking-widest mt-4 block text-slate-400">Final allocation subject to regulatory site-visit and approval.</span>
                    </p>
                </div>
                <div className="mt-12 w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-800 animate-[progress_2s_ease-in-out]" style={{ width: '100%' }}></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 animate-fade-in">
                    <img src="/logo.png" alt="KDIA Re Park" className="h-16 w-auto mx-auto mb-10 transition-transform duration-700" />
                    <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:text-6xl font-heading">
                        Energy Allocation Framework
                    </h1>
                    <p className="mt-3 text-[10px] font-black text-teal-600 uppercase tracking-widest">
                        Clean Energy Portal
                    </p>
                    <p className="mt-6 text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
                        Identify your energy segment under the centralized Energy Investment Program (EIP).
                        Our virtual allocation yields clean energy credits for your Consumer ID.
                    </p>

                    <div className="mt-12 inline-flex items-center px-8 py-3 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-black uppercase tracking-widest shadow-sm">
                        <svg className="w-5 h-5 mr-3 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Infrastructure-grade security & Guaranteed Regulatory Compliance
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`card-premium p-10 flex flex-col relative transition-all duration-500 cursor-pointer ${selectedPlan?.id === plan.id
                                ? 'border-teal-500 ring-8 ring-teal-50 scale-[1.02] z-10'
                                : 'hover:scale-[1.01]'
                                }`}
                            onClick={() => handleSelect(plan.id)}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                                    Strategic Choice
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-slate-900 leading-tight">{plan.name}</h3>
                                <p className="text-[10px] text-teal-700 font-black uppercase mt-2 tracking-widest">{plan.intendedUse}</p>
                            </div>

                            <div className="mb-10 flex flex-col bg-slate-50 p-6 rounded-3xl border border-slate-100/50">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Offset Est.</span>
                                <span className="text-3xl font-black text-slate-900">{plan.indicativePrice}</span>
                                <span className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tight italic">Indicative Range*</span>
                            </div>

                            <div className="space-y-3 mb-10">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-400">Total Allocation</span>
                                    <span className="font-black text-slate-900">{plan.units} kWh</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-400">Yield Coverage</span>
                                    <span className="font-black text-teal-700">{plan.offset}</span>
                                </div>
                            </div>

                            <ul className="space-y-5 mb-12 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start text-sm text-slate-500 font-medium">
                                        <div className="p-1 bg-teal-50 rounded-full mr-4 mt-0.5">
                                            <svg className="w-3 h-3 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={(e) => { e.stopPropagation(); handleSelect(plan.id); }}
                                className={`btn-premium w-full text-sm font-black uppercase tracking-[0.2em] ${selectedPlan?.id === plan.id
                                    ? 'bg-teal-800 text-white shadow-teal-900/20'
                                    : 'bg-white border-2 border-slate-50 text-slate-400 hover:border-teal-500/20 hover:text-teal-700'
                                    }`}
                            >
                                {selectedPlan?.id === plan.id ? 'Allocation Secured' : 'Reserve Allocation'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Educational Section */}
                <div className="mt-20 max-w-5xl mx-auto">
                    <div className="card-premium p-10 bg-white shadow-xl shadow-slate-200/50">
                        <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center uppercase tracking-tight">
                            <span className="p-3 bg-teal-900 text-white rounded-2xl mr-5 shadow-lg shadow-teal-900/10">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </span>
                            Framework Education
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 text-sm text-slate-500 font-medium leading-relaxed">
                            <div className="flex items-start group">
                                <div className="font-black text-teal-100 text-4xl mr-5 leading-none group-hover:text-teal-200 transition-colors">01</div>
                                <div>
                                    <h4 className="text-slate-900 font-black mb-1 uppercase tracking-wide text-[11px]">Infrastructure Generation</h4>
                                    <p className="text-[13px]">Units are generated at <strong>KDIA Re Park</strong> centralized renewable hubs, secured by long-term power purchase agreements.</p>
                                </div>
                            </div>
                            <div className="flex items-start group">
                                <div className="font-black text-teal-100 text-4xl mr-5 leading-none group-hover:text-teal-200 transition-colors">02</div>
                                <div>
                                    <h4 className="text-slate-900 font-black mb-1 uppercase tracking-wide text-[11px]">Virtual Allocation</h4>
                                    <p className="text-[13px]">Your intent records a <strong>reserved allocation</strong> in the centralized ledger, tied uniquely to your utility Consumer ID.</p>
                                </div>
                            </div>
                            <div className="flex items-start group">
                                <div className="font-black text-teal-100 text-4xl mr-5 leading-none group-hover:text-teal-200 transition-colors">03</div>
                                <div>
                                    <h4 className="text-slate-900 font-black mb-1 uppercase tracking-wide text-[11px]">DISCOM Settlement</h4>
                                    <p className="text-[13px]">Allocated units act as <strong>bill-offsets</strong> via Virtual Net Metering (VNM) protocols on your regular DISCOM electricity ledger.</p>
                                </div>
                            </div>
                            <div className="flex items-start group">
                                <div className="font-black text-teal-100 text-4xl mr-5 leading-none group-hover:text-teal-200 transition-colors">04</div>
                                <div>
                                    <h4 className="text-slate-900 font-black mb-1 uppercase tracking-wide text-[11px]">Seamless Continuity</h4>
                                    <p className="text-[13px]">Benefit from clean energy <strong>without rooftop installations</strong>. Maintain your existing grid reliability with KDIA yield benefits.</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 pt-8 border-t border-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] italic text-center">
                            Virtual & Group Net Metering is governed by state renewable mandates.
                            <br />Priority is given to early-movers under the initial EIP transition phase.
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <button
                        onClick={handleProceed}
                        disabled={!selectedPlan || isSubmitting}
                        className="btn-premium inline-flex items-center justify-center px-12 py-5 bg-teal-800 text-white text-base font-black uppercase tracking-[0.2em] disabled:opacity-20 shadow-2xl shadow-teal-900/20"
                    >
                        {isSubmitting ? 'Processing Framework...' : 'Initialize Onboarding'}
                        {!isSubmitting && (
                            <svg className="ml-4 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        )}
                    </button>
                    <p className="mt-8 text-[10px] text-slate-400 font-bold max-w-2xl mx-auto uppercase tracking-[0.15em] leading-relaxed">
                        Allocation Intent Statement: By proceeding, you express interest in the selected Energy Allocation segment.
                        Final yield pricing, regulatory settlements, and technical feasibility will be confirmed during formal onboarding.
                        Savings and offset values are indicative based on current infrastructure projections.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
