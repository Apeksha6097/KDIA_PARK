import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VendorLayout from '../../components/VendorLayout';
import { MOCK_TICKETS, TICKET_STATUSES, PRIORITIES } from '../../data/vendorSupportData';
import Toast from '../../components/Toast';

const VendorTicketDetail = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    // Find ticket from mock data
    const initialTicket = useMemo(() => MOCK_TICKETS.find(t => t.id === ticketId), [ticketId]);
    const [ticket, setTicket] = useState(initialTicket);
    const [resolutionNote, setResolutionNote] = useState('');

    if (!ticket) {
        return (
            <VendorLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Ticket Not Found</h2>
                    <button
                        onClick={() => navigate('/vendor/support')}
                        className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs"
                    >
                        Back to Support
                    </button>
                </div>
            </VendorLayout>
        );
    }

    const isResolved = ticket.status === 'Resolved';
    const isEscalated = ticket.status === 'Escalated';
    const isReadOnly = isResolved || isEscalated;

    const handleUpdateStatus = (newStatus) => {
        const timestamp = new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).toUpperCase();

        const newHistoryItem = {
            date: timestamp,
            event: newStatus,
            note: resolutionNote || (newStatus === 'Escalated' ? 'Handled by Support Team.' : 'Status updated by vendor.')
        };

        setTicket(prev => ({
            ...prev,
            status: newStatus,
            history: [...prev.history, newHistoryItem]
        }));

        setResolutionNote('');
        setToast({ message: `Ticket ${newStatus.toLowerCase()} successfully`, type: 'success' });
    };

    const getStatusColor = (status) => {
        return TICKET_STATUSES.find(s => s.value === status)?.color || 'bg-slate-50 text-slate-600';
    };

    return (
        <VendorLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Back Link */}
                <button
                    onClick={() => navigate('/vendor/support')}
                    className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to All Requests
                </button>

                {/* Main Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-black text-rose-500 uppercase tracking-tight">{ticket.id}</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{ticket.issueType}</h1>
                        <p className="text-slate-500 font-medium italic">Raised by {ticket.customerName} on {ticket.raisedOn}</p>
                    </div>

                    {!isReadOnly && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleUpdateStatus('Escalated')}
                                className="px-6 py-3 bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest rounded-2xl border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-600/5"
                            >
                                Escalate Ticket
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details & Actions */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Complaint Details */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Complaint Description</h3>
                            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                <p className="text-slate-700 leading-relaxed font-medium">
                                    {ticket.description}
                                </p>
                            </div>

                            {/* Attachments Placeholder */}
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Attachments (1)</h4>
                                <div className="flex gap-4">
                                    <div className="p-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer group">
                                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900">site_photo_01.jpg</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">2.4 MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Panel */}
                        {!isReadOnly ? (
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 group-hover:opacity-40 transition-opacity duration-700"></div>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Resolve Complaint</h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Resolution / Update Notes</label>
                                        <textarea
                                            value={resolutionNote}
                                            onChange={(e) => setResolutionNote(e.target.value)}
                                            placeholder="Add notes about findings or resolution steps..."
                                            className="w-full bg-slate-50 border-0 rounded-3xl p-6 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none min-h-[120px]"
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <button
                                            onClick={() => handleUpdateStatus('In Progress')}
                                            disabled={ticket.status === 'In Progress'}
                                            className="flex-1 px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-slate-900/10"
                                        >
                                            Mark In Progress
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus('Resolved')}
                                            className="flex-1 px-8 py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
                                        >
                                            Mark as Resolved
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={`rounded-[2.5rem] border p-8 ${isResolved ? 'bg-emerald-50/30 border-emerald-100' : 'bg-red-50/20 border-red-100'}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isResolved ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                        {isResolved ? (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">{isResolved ? 'Issue Resolved' : 'Ticket Escalated'}</h3>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            {isResolved ? 'This ticket is now closed and read-only.' : 'Handled by Internal Support Team. Non-editable by vendor.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Customer & History */}
                    <div className="space-y-8">
                        {/* Customer Sidebar Card */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Customer Details</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black">
                                        {ticket.customerName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">{ticket.customerName}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Customer</p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                                        <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        {ticket.customerEmail}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                                        <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        {ticket.customerPhone}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* History Timeline */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">History Timeline</h3>
                            <div className="space-y-8 relative">
                                <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-100"></div>
                                {ticket.history.map((item, idx) => (
                                    <div key={idx} className="relative pl-12">
                                        <div className={`absolute left-[1.125rem] top-0 w-2.5 h-2.5 rounded-full border-2 border-white ring-4 ${idx === ticket.history.length - 1 ? 'bg-emerald-500 ring-emerald-50' : 'bg-slate-300 ring-slate-50'}`}></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.date}</p>
                                        <p className="text-xs font-black text-slate-900 mb-1 uppercase tracking-tight">{item.event}</p>
                                        {item.note && (
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed italic pr-4">“{item.note}”</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </VendorLayout>
    );
};

export default VendorTicketDetail;
