import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import VendorLayout from '../../components/VendorLayout';
import { MOCK_TICKETS, TICKET_STATUSES, PRIORITIES, ISSUE_TYPES } from '../../data/vendorSupportData';
import StatusBadge from '../../components/StatusBadge';

const VendorSupportRequests = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState(MOCK_TICKETS);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');

    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            const matchesSearch =
                ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.issueType.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
            const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tickets, searchTerm, statusFilter, priorityFilter]);

    const getPriorityColor = (priority) => {
        return PRIORITIES.find(p => p.value === priority)?.color || 'bg-slate-50 text-slate-600';
    };

    const getStatusColor = (status) => {
        return TICKET_STATUSES.find(s => s.value === status)?.color || 'bg-slate-50 text-slate-600';
    };

    return (
        <VendorLayout>
            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Support Requests</h1>
                        <p className="text-slate-500 font-medium text-lg italic">Manage and resolve customer complaints effectively.</p>
                    </div>
                    <div className="bg-rose-50 border border-rose-100 px-6 py-4 rounded-3xl">
                        <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-1 text-center">Open Tickets</p>
                        <p className="text-2xl font-black text-rose-900 leading-none text-center">
                            {tickets.filter(t => t.status !== 'Resolved').length}
                            <span className="text-xs font-bold text-rose-600 ml-2">Active</span>
                        </p>
                    </div>
                </div>

                {/* Filters & Search Bar */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search by ID, customer name, issue type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border-0 rounded-2xl text-sm font-bold text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                        />
                        <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 bg-slate-50 border-0 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                        >
                            <option value="All">All Statuses</option>
                            {TICKET_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-4 py-3 bg-slate-50 border-0 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                        >
                            <option value="All">All Priorities</option>
                            {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* Tickets Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                    {filteredTickets.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 border-collapse">
                                <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket Info</th>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Type</th>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Raised On</th>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {filteredTickets.map((ticket, idx) => (
                                        <tr
                                            key={ticket.id}
                                            onClick={() => navigate(`/vendor/support/${ticket.id}`)}
                                            className={`hover:bg-slate-50 cursor-pointer transition-all duration-300 group ${idx % 2 !== 0 ? 'bg-slate-50/30' : ''}`}
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black group-hover:bg-white transition-colors">
                                                        {ticket.customerName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-slate-900 mb-0.5">{ticket.customerName}</div>
                                                        <div className="text-[10px] font-bold text-rose-500 uppercase tracking-tight">{ticket.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm text-slate-500 font-bold">{ticket.issueType}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-xs text-slate-500 font-bold uppercase">{ticket.raisedOn}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center h-[500px] text-center px-6">
                            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-8">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.477 2.387a2 2 0 001.414 1.96l2.387.477a2 2 0 001.96-1.414l.477-2.387a2 2 0 00-1.414-1.96l-2.387-.477z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">No tickets found</h3>
                            <p className="text-slate-500 max-w-sm font-medium">Try matching your criteria to see customer requests.</p>
                            {(searchTerm || statusFilter !== 'All' || priorityFilter !== 'All') && (
                                <button
                                    onClick={() => { setSearchTerm(''); setStatusFilter('All'); setPriorityFilter('All'); }}
                                    className="mt-8 px-8 py-3 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4 mt-8">
                    {filteredTickets.map(ticket => (
                        <div
                            key={ticket.id}
                            onClick={() => navigate(`/vendor/support/${ticket.id}`)}
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">{ticket.customerName}</h3>
                                    <p className="text-xs text-rose-500 font-bold uppercase tracking-widest">{ticket.id}</p>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${getStatusColor(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-slate-500 font-bold">{ticket.issueType}</div>
                                <div className="text-xs text-slate-400 font-bold uppercase">{ticket.raisedOn}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </VendorLayout>
    );
};

export default VendorSupportRequests;
