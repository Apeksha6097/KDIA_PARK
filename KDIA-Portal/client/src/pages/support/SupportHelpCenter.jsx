import React from 'react';


const SupportHelpCenter = () => {
    return (
        <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Operational Help Center</h1>
                    <p className="text-neutral-500">Agent support policies, guidelines, and direct regional contacts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* SLA Guidelines */}
                    <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-neutral-800 text-lg border-b border-neutral-50 pb-3">Priority & SLA Policy</h3>
                        <div className="space-y-3 text-sm text-neutral-600">
                            <p><strong>CRITICAL:</strong> Response within 2 hours. Resolution within 12 hours. (e.g. Total Power Failure)</p>
                            <p><strong>HIGH:</strong> Response within 4 hours. Resolution within 24 hours. (e.g. Net Metering Failure)</p>
                            <p><strong>MEDIUM:</strong> Response within 8 hours. Resolution within 48 hours. (e.g. Portal Login Failure)</p>
                        </div>
                    </div>

                    {/* Regional escalation list */}
                    <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-neutral-800 text-lg border-b border-neutral-50 pb-3">Regional Escalations</h3>
                        <div className="space-y-3 text-sm text-neutral-600">
                            <div className="flex justify-between">
                                <span className="font-semibold text-neutral-800">West Zone Discom Officer</span>
                                <span className="text-emerald-700 font-bold">+91 78901 23456</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-neutral-800">North Zone Feeder Head</span>
                                <span className="text-emerald-700 font-bold">+91 89012 34567</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-neutral-800">SLA Override Desk</span>
                                <span className="text-emerald-700 font-bold">+91 90123 45678</span>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default SupportHelpCenter;
