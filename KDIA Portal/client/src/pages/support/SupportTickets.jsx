import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    Filter,
    Search,
    ChevronRight,
    Download,
    MoreVertical,
    Calendar,
    MapPin,
    AlertCircle,
    Inbox,
    Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SupportTickets = ({ mode = 'all' }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        discom: ''
    });

    useEffect(() => {
        fetchTickets();
    }, [filters, mode]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let url = '/support/agent/tickets?';
            if (filters.status) url += `status=${filters.status}&`;
            if (filters.priority) url += `priority=${filters.priority}&`;
            if (filters.discom) url += `discom=${filters.discom}&`;

            const res = await api.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            let data = res.data;
            if (mode === 'escalated') {
                data = data.filter(t => t.status === 'ESCALATED');
            } else if (mode === 'assigned') {
                // Assuming we can filter by assigned agent, for now just a mock filter
                // In a real app, this would be a separate API endpoint or filter
            }

            setTickets(data);
        } catch (err) {
            console.error("Error fetching tickets:", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'RESOLVED': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
            case 'PENDING':
            case 'OPEN': return 'bg-red-50 text-red-700 border border-red-100 uppercase tracking-tight';
            case 'IN_PROGRESS': return 'bg-amber-50 text-amber-700 border border-amber-100';
            case 'ESCALATED': return 'bg-blue-50 text-blue-700 border border-blue-100';
            case 'Awaiting Customer Response': return 'bg-purple-50 text-purple-700 border border-purple-100';
            default: return 'bg-neutral-50 text-neutral-600 border border-neutral-100';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">
                        {mode === 'all' ? 'All Tickets' : mode === 'escalated' ? 'Escalated Tickets' : 'My Assigned Tickets'}
                    </h1>
                    <p className="text-neutral-500">Manage customer support requests and communication history.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-all font-medium">
                        <Download size={18} /> Export
                    </button>
                    <button className="bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700 shadow-sm transition-all font-semibold">
                        Create Ticket
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Ticket ID, Customer, or Subject..."
                        className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all text-sm"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <select
                        className="px-3 py-2 bg-neutral-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-all"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="Awaiting Customer Response">Awaiting customer</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="ESCALATED">Escalated</option>
                    </select>

                    <select
                        className="px-3 py-2 bg-neutral-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-all"
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    >
                        <option value="">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                    </select>

                    <select
                        className="px-3 py-2 bg-neutral-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-all"
                        value={filters.discom}
                        onChange={(e) => setFilters({ ...filters, discom: e.target.value })}
                    >
                        <option value="">All DISCOMs</option>
                        <option value="PVVNL">PVVNL</option>
                        <option value="MVVNL">MVVNL</option>
                        <option value="PuVVNL">PuVVNL</option>
                        <option value="DVVNL">DVVNL</option>
                    </select>
                </div>
            </div>

            {/* Tickets List */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50/50 border-b border-neutral-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Info</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Region</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-neutral-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-5">
                                            <div className="h-4 bg-neutral-100 rounded-lg w-3/4 mb-2"></div>
                                            <div className="h-3 bg-neutral-50 rounded-lg w-1/2"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20">
                                        <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                                            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-300">
                                                <Inbox size={32} />
                                            </div>
                                            <h3 className="text-lg font-bold text-neutral-800">
                                                {filters.status || filters.priority || filters.discom ? "No Match Found" :
                                                    mode === 'escalated' ? "No Escalated Tickets" :
                                                        mode === 'assigned' ? "No Assigned Tickets" : "No Active Support Tickets"}
                                            </h3>
                                            <p className="text-neutral-500 text-sm mt-1">
                                                {filters.status || filters.priority || filters.discom
                                                    ? "No tickets match your current filters. Try adjusting them."
                                                    : mode === 'escalated' ? "Great job! All high-priority issues have been resolved." :
                                                        mode === 'assigned' ? "You're all caught up. New assigned tickets will appear here." :
                                                            "All customer queries have been addressed. New tickets will appear here automatically."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-neutral-50/80 transition-all duration-200 group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-emerald-600 mb-1 tracking-wider uppercase">#TK-{ticket.id}</span>
                                            <p className="font-bold text-neutral-800 text-sm group-hover:text-emerald-700 transition-colors">{ticket.subject}</p>
                                            <span className="text-[11px] text-neutral-500 flex items-center gap-1 mt-1 font-medium">
                                                <AlertCircle size={10} /> {ticket.customerName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-xs text-neutral-600">
                                            <span className="flex items-center gap-1"><MapPin size={12} className="text-neutral-400" /> {ticket.discom}</span>
                                            <span className="mt-0.5 ml-4">{ticket.park_district}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ticket.priority === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-100' :
                                            ticket.priority === 'HIGH' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                                'bg-blue-50 text-blue-700 border border-blue-100'
                                            }`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${getStatusStyle(ticket.status)}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                                            <Calendar size={12} />
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            to={`/support/tickets/${ticket.id}`}
                                            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-bold transition-all"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SupportTickets;
