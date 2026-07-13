import React from 'react';

const LifecycleTimeline = ({ status, hasAllocation }) => {
    // Determine current step index
    // Steps: 1. Onboarded (Always done if showing this)
    //        2. Approved (If status is APPROVED or higher)
    //        3. Allocated (If hasAllocation is true)
    //        4. Service Active (If hasAllocation && status is Active? Or just implied by Allocation for this demo)

    // Simplification for demo visual:
    // If status is PENDING -> Step 1 active
    // If status is APPROVED && !hasAllocation -> Step 2 active
    // If hasAllocation -> Step 4 active (jumping to end for simplicity or showing all complete)

    // Let's define steps linear path
    let currentStep = 1;
    if (status === 'APPROVED' || status === 'ACTIVE') currentStep = 2;
    if (hasAllocation) currentStep = 4; // Assuming allocation means service active for simplicity in this visual

    const steps = [
        { id: 1, label: 'Onboarded', sub: 'Sales Partner' },
        { id: 2, label: 'Approved', sub: 'KDIA Admin' },
        { id: 3, label: 'Allocated', sub: 'Assigned' },
        { id: 4, label: 'Active', sub: 'Service Live' },
    ];

    return (
        <div className="w-full py-4">
            <div className="relative flex items-center justify-between w-full">
                {/* Connecting Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100 -z-10"></div>
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-teal-500 transition-all duration-1000 -z-10"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step) => {
                    const isCompleted = step.id <= currentStep;
                    const isCurrent = step.id === currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center group relative bg-white px-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                                        ? 'bg-teal-50 border-teal-500 text-teal-600'
                                        : 'bg-white border-slate-200 text-slate-300'
                                    }`}
                            >
                                {isCompleted ? (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span className="text-xs font-bold">{step.id}</span>
                                )}
                            </div>
                            <div className="absolute top-full mt-2 text-center w-24">
                                <p className={`text-[10px] font-black uppercase tracking-wider ${isCompleted ? 'text-teal-900' : 'text-slate-400'}`}>
                                    {step.label}
                                </p>
                                <p className="text-[9px] text-slate-400 font-medium">{step.sub}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LifecycleTimeline;
