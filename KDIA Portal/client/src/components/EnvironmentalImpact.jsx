import React from 'react';

const EnvironmentalImpact = ({ totalConsumed, showLifetimeView = false }) => {
    // Frontend-only calculations using existing consumption data
    const co2PerKwh = 0.8; // kg CO₂ per kWh (average grid emission factor)
    const co2Avoided = (totalConsumed * co2PerKwh).toFixed(1);
    const treesEquivalent = Math.floor(co2Avoided / 20); // 1 tree absorbs ~20 kg CO₂ per year

    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto">
                <span className="inline-block px-4 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-emerald-700">
                    Environmental Impact
                </span>
                <h2 className="text-3xl font-black text-slate-900 mb-3">Your Environmental Contribution</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                    By using clean energy, you're helping reduce carbon emissions and supporting a sustainable future.
                    Below are estimated environmental equivalents based on your consumption.
                </p>
            </div>

            {/* Impact Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Clean Energy Used */}
                <div className="card-premium p-8 group border-t-4 border-t-teal-600">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-teal-50 text-teal-700 rounded-[1.25rem] group-hover:scale-110 transition-transform duration-500">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-black bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full uppercase tracking-widest">
                            Total
                        </span>
                    </div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Clean Energy Used</h3>
                    <p className="text-4xl font-black text-slate-900 mb-2">
                        {totalConsumed}
                        <span className="text-lg font-medium text-slate-400 ml-2">kWh</span>
                    </p>
                    <p className="text-xs text-slate-500 font-medium">Renewable energy consumed</p>
                </div>

                {/* CO₂ Emissions Avoided */}
                <div className="card-premium p-8 group border-t-4 border-t-emerald-600 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-[1.25rem] group-hover:scale-110 transition-transform duration-500">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="group relative">
                            <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full uppercase tracking-widest cursor-help">
                                Estimated*
                            </span>
                            {/* Tooltip */}
                            <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <div className="bg-slate-900 text-white text-[10px] p-3 rounded-2xl w-56 shadow-2xl font-medium leading-relaxed">
                                    Estimates are based on average grid emission factors (0.8 kg CO₂ per kWh).
                                </div>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">CO₂ Emissions Avoided</h3>
                    <p className="text-4xl font-black text-slate-900 mb-2">
                        {co2Avoided}
                        <span className="text-lg font-medium text-slate-400 ml-2">kg</span>
                    </p>
                    <p className="text-xs text-slate-500 font-medium">Estimated environmental equivalence*</p>
                </div>

                {/* Tree Equivalent */}
                <div className="card-premium p-8 group border-t-4 border-t-green-600">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-green-50 text-green-700 rounded-[1.25rem] group-hover:scale-110 transition-transform duration-500">
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-black bg-green-50 text-green-700 px-3 py-1.5 rounded-full uppercase tracking-widest">
                            Impact
                        </span>
                    </div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tree Equivalent</h3>
                    <p className="text-4xl font-black text-slate-900 mb-2">
                        {treesEquivalent}
                        <span className="text-lg font-medium text-slate-400 ml-2">Trees</span>
                    </p>
                    <p className="text-xs text-slate-500 font-medium">Annual CO₂ absorption equivalent*</p>

                    {/* Tree Icons Visualization */}
                    <div className="mt-6 flex space-x-1 flex-wrap">
                        {[...Array(Math.min(treesEquivalent, 10))].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        ))}
                        {treesEquivalent > 10 && (
                            <span className="text-xs font-bold text-green-600 ml-2">+{treesEquivalent - 10} more</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Lifetime View or Empty State */}
            {showLifetimeView && totalConsumed > 0 ? (
                <div className="card-premium p-10 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center p-4 bg-white rounded-full mb-6 shadow-lg">
                            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3">Lifetime Impact Summary</h3>
                        <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
                            Your clean energy journey has helped avoid <span className="font-black text-emerald-700">{co2Avoided} kg of CO₂</span> emissions,
                            equivalent to the annual absorption of <span className="font-black text-green-700">{treesEquivalent} trees</span>.
                        </p>
                    </div>
                </div>
            ) : !showLifetimeView && totalConsumed === 0 ? (
                <div className="card-premium p-10 text-center">
                    <svg className="mx-auto h-16 w-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Your Impact Will Grow</h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                        As you continue using clean energy, your environmental impact will be tracked here.
                        Check back after your first consumption cycle to see your contribution.
                    </p>
                </div>
            ) : null}

            {/* Disclaimer */}
            <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                    * Estimates based on regional grid emission averages. Actual environmental impact may vary.
                </p>
            </div>
        </div>
    );
};

export default EnvironmentalImpact;
