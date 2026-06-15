import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VendorLayout from '../../components/VendorLayout';
import { MOCK_INVOICES, INVOICE_STATUSES } from '../../data/vendorBillingData';
import Toast from '../../components/Toast';

const VendorInvoiceDetail = () => {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    const initialInvoice = useMemo(() => MOCK_INVOICES.find(inv => inv.invoiceId === invoiceId), [invoiceId]);
    const [invoice, setInvoice] = useState(initialInvoice);
    const [note, setNote] = useState('');

    if (!invoice) {
        return (
            <VendorLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Invoice Not Found</h2>
                    <button
                        onClick={() => navigate('/vendor/billing')}
                        className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs"
                    >
                        Back to Billing
                    </button>
                </div>
            </VendorLayout>
        );
    }

    const isPaid = invoice.status === 'Paid';
    const isOverdue = invoice.status === 'Overdue';

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    const handleAction = (type) => {
        const timestamp = new Date().toLocaleString('en-IN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        }).toUpperCase();

        let updatedInvoice = { ...invoice };
        let message = "";

        if (type === 'MARK_PAID') {
            updatedInvoice.status = 'Paid';
            updatedInvoice.amountPaid = updatedInvoice.amount;
            updatedInvoice.history.push({
                date: timestamp,
                event: 'Payment Received',
                note: note || 'Full payment marked as received by vendor.'
            });
            message = "Invoice marked as Paid";
        } else if (type === 'ESCALATE') {
            updatedInvoice.status = 'Overdue';
            updatedInvoice.history.push({
                date: timestamp,
                event: 'Escalated to Finance',
                note: note || 'Payment overdue. Escalated for legal/finance review.'
            });
            message = "Invoice escalated to finance team";
        } else if (type === 'REMINDER') {
            updatedInvoice.history.push({
                date: timestamp,
                event: 'Payment Reminder Sent',
                note: 'Digital reminder notification sent to customer email.'
            });
            message = "Payment reminder sent to customer";
        }

        setInvoice(updatedInvoice);
        setNote('');
        setToast({ message, type: 'success' });
    };

    return (
        <VendorLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Back Link */}
                <button
                    onClick={() => navigate('/vendor/billing')}
                    className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Billing
                </button>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-black text-emerald-600 uppercase tracking-tight">{invoice.invoiceId}</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${INVOICE_STATUSES.find(s => s.value === invoice.status).color}`}>
                                {invoice.status}
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{invoice.type} Invoice</h1>
                        <p className="text-slate-500 font-medium italic">Associated with {invoice.customerName}</p>
                    </div>

                    {!isPaid && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleAction('REMINDER')}
                                className="px-5 py-3 bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all"
                            >
                                Send Reminder
                            </button>
                            <button
                                onClick={() => handleAction('ESCALATE')}
                                className="px-5 py-3 bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-600 hover:text-white transition-all"
                            >
                                Escalate
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Details */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Summary Card */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Invoice Summary</h3>
                            <div className="space-y-4">
                                {invoice.breakdown.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0">
                                        <span className="text-sm font-bold text-slate-700">{item.item}</span>
                                        <span className="text-sm font-black text-slate-900">{formatCurrency(item.price)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Total Amount</span>
                                    <span className="text-xl font-black text-emerald-600">{formatCurrency(invoice.amount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Actions */}
                        {!isPaid && (
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden group">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Receive Payment</h3>
                                <div className="space-y-6">
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Add payment notes, reference number, or offline collection details..."
                                        className="w-full bg-slate-50 border-0 rounded-3xl p-6 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none min-h-[100px]"
                                    />
                                    <button
                                        onClick={() => handleAction('MARK_PAID')}
                                        className="w-full py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                                    >
                                        Mark as Payment Received
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Customer */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Customer Info</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Full Name</p>
                                    <p className="text-sm font-black text-slate-900">{invoice.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Due Date</p>
                                    <p className={`text-sm font-black ${isOverdue ? 'text-rose-500' : 'text-slate-900'}`}>{invoice.dueDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* History */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Billing History</h3>
                            <div className="space-y-8 relative">
                                <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-100"></div>
                                {invoice.history.map((item, idx) => (
                                    <div key={idx} className="relative pl-12">
                                        <div className={`absolute left-[1.125rem] top-0 w-2.5 h-2.5 rounded-full border-2 border-white ring-4 ${idx === invoice.history.length - 1 ? 'bg-emerald-500 ring-emerald-50' : 'bg-slate-300 ring-slate-50'}`}></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{item.date}</p>
                                        <p className="text-xs font-black text-slate-900 mb-1 uppercase">{item.event}</p>
                                        {item.note && <p className="text-xs text-slate-500 leading-relaxed italic pr-2">“{item.note}”</p>}
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

export default VendorInvoiceDetail;
