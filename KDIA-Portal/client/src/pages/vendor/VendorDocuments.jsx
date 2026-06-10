import React from 'react';
import VendorLayout from '../../components/VendorLayout';

const MOCK_DOCS = [
    { title: 'KDIA Vendor Grid Agreement 2026', type: 'Agreement', size: '2.4 MB', date: '2026-06-08', status: 'Approved' },
    { title: 'Vendor KYC Documents', type: 'KYC Documents', size: '4.1 MB', date: '2026-06-01', status: 'Approved' },
    { title: 'Invoice #INV-2026-05', type: 'Invoice', size: '1.2 MB', date: '2026-05-30', status: 'Approved' },
    { title: 'Phase 1 Project Layout & Documents', type: 'Project Documents', size: '15.6 MB', date: '2026-05-15', status: 'Pending Review' },
    { title: 'DISCOM Connection Clearance Certificate', type: 'Uploaded Documents', size: '1.8 MB', date: '2026-06-05', status: 'Approved' },
];

const VendorDocuments = () => {
    return (
        <VendorLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Compliance & Documents</h1>
                    <p className="text-slate-500 mt-2 font-medium">Certified vendor documents and net metering agreements.</p>
                </div>

                <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                        <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">Document Registry</h3>
                        <button className="px-4 py-2 text-xs font-black text-white bg-emerald-600 uppercase tracking-widest hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-600/10">
                            + Upload Document
                        </button>
                    </div>

                    <div className="space-y-4">
                        {MOCK_DOCS.map((doc, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-4 hover:border-emerald-200 transition-all">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-slate-800 text-sm">{doc.title}</h4>
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">{doc.type}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium mt-1">Size: {doc.size} | Uploaded: {doc.date}</p>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${
                                        doc.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}>{doc.status}</span>
                                    <button className="px-3.5 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all">
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </VendorLayout>
    );
};

export default VendorDocuments;
