import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
    ArrowLeft,
    Send,
    Lock,
    User,
    Clock,
    AlertTriangle,
    CheckCircle2,
    MessageSquare,
    Paperclip,
    MoreHorizontal,
    UserPlus,
    Tag,
    Calendar,
    MapPin,
    Building2
} from 'lucide-react';

const SupportTicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [internalNote, setInternalNote] = useState('');
    const [activeTab, setActiveTab] = useState('reply'); // 'reply' or 'note'
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchTicketDetails();
    }, [id]);

    const fetchTicketDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get(`/support/agent/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTicket(res.data);
        } catch (err) {
            console.error("Error fetching ticket details:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendReply = async () => {
        if (!reply.trim()) return;
        setSending(true);
        try {
            const token = localStorage.getItem('token');
            await api.post(`/support/agent/tickets/${id}/reply`,
                { message: reply },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReply('');
            fetchTicketDetails(); // Refresh
        } catch (err) {
            console.error("Error sending reply:", err);
        } finally {
            setSending(false);
        }
    };

    const handleAddNote = async () => {
        if (!internalNote.trim()) return;
        setSending(true);
        try {
            const token = localStorage.getItem('token');
            await api.post(`/support/agent/tickets/${id}/note`,
                { note: internalNote },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setInternalNote('');
            fetchTicketDetails(); // Refresh
        } catch (err) {
            console.error("Error adding note:", err);
        } finally {
            setSending(false);
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await api.patch(`/support/agent/tickets/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTicketDetails();
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    if (loading) return <div className="p-8 text-neutral-500 flex items-center gap-2"><div className="animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div> Loading Ticket Details...</div>;
    if (!ticket) return <div className="p-8 text-red-500">Ticket not found or access denied.</div>;

    const allTimeline = [
        ...(ticket.messages || []).map(m => ({ ...m, type: 'message' })),
        ...(ticket.internalNotes || []).map(n => ({ ...n, type: 'note', createdAt: n.createdAt, message: n.note, senderName: n.agentName }))
    ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const getStatusStyle = (status) => {
        switch (status) {
            case 'RESOLVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'PENDING':
            case 'OPEN': return 'bg-red-100 text-red-700 border-red-200';
            case 'IN_PROGRESS': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'ESCALATED': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-neutral-100 text-neutral-600 border-neutral-200';
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 font-medium transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Tickets
                </button>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500"><Tag size={20} /></button>
                    <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500"><UserPlus size={20} /></button>
                    <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500"><MoreHorizontal size={20} /></button>
                </div>
            </div>

            {/* Top Infobar */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-widest">#TK-{ticket.id}</span>
                            <h1 className="text-2xl font-extrabold text-neutral-800 tracking-tight">{ticket.subject}</h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-neutral-500">
                            <div className="flex items-center gap-1.5"><User size={14} className="text-neutral-400" /> {ticket.customerName}</div>
                            <div className="flex items-center gap-1.5"><Building2 size={14} className="text-neutral-400" /> {ticket.discom}</div>
                            <div className="flex items-center gap-1.5"><MapPin size={14} className="text-neutral-400" /> {ticket.park_district || 'Not Specified'}</div>
                            <div className="flex items-center gap-1.5"><Calendar size={14} className="text-neutral-400" /> {new Date(ticket.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                        </div>
                    </div>
                    <div>
                        <span className={`px-5 py-2 rounded-full text-xs font-bold border-2 ${getStatusStyle(ticket.status)}`}>
                            {ticket.status?.replace('_', ' ') || 'New'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Ticket Description */}
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 overflow-hidden">
                        <div className="flex items-center gap-2 mb-4 border-b border-neutral-50 pb-2">
                            <MessageSquare size={16} className="text-emerald-500" />
                            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-tight">Technical Issue Details</h3>
                        </div>
                        <p className="text-neutral-600 text-sm leading-relaxed bg-neutral-50/50 p-5 rounded-xl border border-neutral-100 whitespace-pre-wrap">
                            {ticket.description}
                        </p>
                    </div>

                    {/* Conversation Timeline */}
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm flex flex-col min-h-[500px]">
                        <div className="p-4 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-20">
                            <h2 className="font-bold text-neutral-800 flex items-center gap-2">
                                <Clock size={18} className="text-emerald-600" />
                                Conversation Timeline
                            </h2>
                            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
                                <button
                                    onClick={() => setActiveTab('reply')}
                                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${activeTab === 'reply' ? 'bg-white text-emerald-700 shadow-sm' : 'text-neutral-500'}`}
                                >
                                    Reply
                                </button>
                                <button
                                    onClick={() => setActiveTab('note')}
                                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${activeTab === 'note' ? 'bg-white text-amber-700 shadow-sm' : 'text-neutral-500'}`}
                                >
                                    Internal Note
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 p-6 space-y-6 bg-neutral-50/20 max-h-[600px] overflow-y-auto">
                            {allTimeline.map((item, idx) => (
                                <div key={idx} className={`flex flex-col ${item.type === 'note' ? 'items-center py-2' : item.senderRole === 'customer' ? 'items-start' : 'items-end'}`}>
                                    {item.type === 'note' ? (
                                        <div className="w-full max-w-lg bg-amber-50/70 border border-amber-100/50 p-4 rounded-2xl border-dashed">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="flex items-center gap-2 text-amber-700 text-[10px] font-bold uppercase tracking-widest">
                                                    <Lock size={12} /> Internal Note: {item.senderName}
                                                </span>
                                                <span className="text-[10px] text-amber-400 font-medium">{new Date(item.createdAt).toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm text-amber-900 leading-relaxed italic">{item.message}</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col max-w-[85%]">
                                            <div className={`flex items-center gap-2 mb-1 px-1 ${item.senderRole === 'customer' ? 'justify-start' : 'justify-end'}`}>
                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">{item.senderName}</span>
                                            </div>
                                            <div className={`p-4 rounded-2xl shadow-sm ${item.senderRole === 'customer'
                                                ? 'bg-white border border-neutral-100 text-neutral-800 rounded-tl-none'
                                                : 'bg-emerald-600 text-white rounded-tr-none'
                                                }`}>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{item.message}</p>
                                            </div>
                                            <span className={`text-[10px] text-neutral-400 mt-1 px-1 ${item.senderRole === 'customer' ? 'text-left' : 'text-right'}`}>
                                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Reply Area (Bottom Section Redesign) */}
                        <div className="p-4 border-t border-neutral-100 bg-white rounded-b-2xl">
                            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 px-1">
                                {activeTab === 'reply' ? 'Reply to Customer' : 'Add Internal Note'}
                            </h4>
                            <div className={`relative rounded-2xl border transition-all ${activeTab === 'reply' ? 'focus-within:border-emerald-500 border-neutral-100' : 'focus-within:border-amber-500 border-amber-100 bg-amber-50/20'}`}>
                                <textarea
                                    className="w-full p-4 bg-transparent outline-none text-sm min-h-[120px] resize-none"
                                    placeholder={activeTab === 'reply' ? "Type your message to the customer..." : "Private thoughts for the support team..."}
                                    value={activeTab === 'reply' ? reply : internalNote}
                                    onChange={(e) => activeTab === 'reply' ? setReply(e.target.value) : setInternalNote(e.target.value)}
                                />
                                <div className="flex items-center justify-between p-2 border-t border-neutral-100/50">
                                    <div className="flex items-center gap-1">
                                        <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400"><Paperclip size={18} /></button>
                                        <span className="text-[10px] text-neutral-300 font-bold ml-2">{(activeTab === 'reply' ? reply : internalNote).length} chars</span>
                                    </div>
                                    <button
                                        onClick={activeTab === 'reply' ? handleSendReply : handleAddNote}
                                        disabled={sending || (activeTab === 'reply' ? !reply.trim() : !internalNote.trim())}
                                        className={`px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${activeTab === 'reply' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-amber-600 text-white hover:bg-amber-700'
                                            }`}
                                    >
                                        {sending ? 'Processing...' : activeTab === 'reply' ? 'Send Response' : 'Save Note'}
                                        {activeTab === 'reply' && !sending && <Send size={16} />}
                                        {activeTab === 'note' && !sending && <Lock size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info Area */}
                <div className="space-y-6">
                    {/* Management Box */}
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-neutral-50 text-neutral-600 rounded-lg border border-neutral-100"><AlertTriangle size={16} /></div>
                            <h3 className="font-bold text-neutral-800">Action Center</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 block">Change Status</label>
                                <select
                                    className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-semibold text-neutral-700 focus:bg-white focus:border-emerald-500 outline-none transition-all cursor-pointer"
                                    value={ticket.status}
                                    onChange={(e) => updateStatus(e.target.value)}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="Awaiting Customer Response">Awaiting customer</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="ESCALATED">Escalated</option>
                                </select>
                            </div>

                            <button
                                onClick={() => updateStatus('RESOLVED')}
                                className="w-full py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-100 flex items-center justify-center gap-2 border border-emerald-100 transition-all active:scale-[0.98]"
                            >
                                <CheckCircle2 size={16} /> Mark as Resolved
                            </button>
                            <button
                                onClick={() => updateStatus('ESCALATED')}
                                className="w-full py-3 bg-red-50 text-red-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-100 flex items-center justify-center gap-2 border border-red-100 transition-all active:scale-[0.98]"
                            >
                                <AlertTriangle size={16} /> Escalate Ticket
                            </button>
                        </div>
                    </div>

                    {/* Customer Profile Box */}
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100"><User size={16} /></div>
                            <h3 className="font-bold text-neutral-800">Customer Profile</h3>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center text-lg font-bold text-neutral-500 border border-neutral-100">
                                    {ticket.customerName?.charAt(0)}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold text-neutral-800 text-sm truncate">{ticket.customerName}</p>
                                    <p className="text-xs text-neutral-400 truncate">{ticket.customerEmail}</p>
                                </div>
                            </div>

                            <div className="space-y-2 bg-neutral-50/30 p-4 rounded-xl border border-neutral-100/50">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-neutral-400 font-medium">DISCOM</span>
                                    <span className="text-neutral-700 font-bold">{ticket.discom}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs pt-1 border-t border-dotted border-neutral-200">
                                    <span className="text-neutral-400 font-medium">Park/District</span>
                                    <span className="text-neutral-700 font-bold">{ticket.park_district || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportTicketDetail;
