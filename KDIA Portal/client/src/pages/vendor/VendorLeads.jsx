import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import VendorLayout from '../../components/VendorLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';

const VendorLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    // Filtering & Sorting State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [locationFilter, setLocationFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');

    // UI State
    const [selectedLead, setSelectedLead] = useState(null);
    const [showNotesModal, setShowNotesModal] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, [token]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await api.get('/leads', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeads(res.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching leads:", err);
            setError("Unable to load leads. Please check your connection and try again.");
            setToast({ message: "Error fetching leads", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus, e) => {
        if (e) e.stopPropagation(); // Prevent row click

        try {
            await api.patch(`/leads/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setLeads(prev => prev.map(lead =>
                lead.id === id ? { ...lead, status: newStatus } : lead
            ));

            if (selectedLead && selectedLead.id === id) {
                setSelectedLead(prev => ({ ...prev, status: newStatus }));
            }

            setToast({ message: `Status updated to ${newStatus}`, type: "success" });
        } catch (err) {
            console.error("Error updating status:", err);
            setToast({ message: "Failed to update status", type: "error" });
        }
    };

    const handleOnboard = (lead, e) => {
        if (e) e.stopPropagation();
        navigate('/vendor/onboarding', { state: { lead } });
    };

    const statusOptions = ['New', 'Contacted', 'Meeting Scheduled', 'Not Interested', 'Converted'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Contacted': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Meeting Scheduled': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'Not Interested': return 'bg-slate-50 text-slate-700 border-slate-100';
            case 'Converted': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getProgressStage = (status) => {
        const stages = ['New', 'Contacted', 'Meeting Scheduled', 'Converted'];
        const currentIdx = stages.indexOf(status);
        if (currentIdx === -1) return 0;
        return ((currentIdx + 1) / stages.length) * 100;
    };

    // Derived State: filtered and sorted leads
    const filteredLeads = useMemo(() => {
        return leads
            .filter(lead => {
                const matchesSearch =
                    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lead.location.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
                const matchesLocation = locationFilter === 'All' || lead.location === locationFilter;

                return matchesSearch && matchesStatus && matchesLocation;
            })
            .sort((a, b) => {
                if (sortBy === 'newest') return new Date(b.assignedDate) - new Date(a.assignedDate);
                if (sortBy === 'name') return a.name.localeCompare(b.name);
                return 0;
            });
    }, [leads, searchTerm, statusFilter, locationFilter, sortBy]);

    const locations = useMemo(() => ['All', ...new Set(leads.map(l => l.location))], [leads]);

    const LeadDetailModal = ({ lead, onClose }) => {
        if (!lead) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">{lead.name}</h2>
                            <p className="text-sm text-slate-500 font-medium">Assigned on {lead.assignedDate}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Details</h4>
                                <p className="text-sm font-bold text-slate-700">{lead.contact.split('|')[0]}</p>
                                <p className="text-sm text-slate-500">{lead.contact.split('|')[1]}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location</h4>
                                <p className="text-sm font-bold text-slate-700">{lead.location}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Current Progress</h4>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${getProgressStage(lead.status)}%` }}></div>
                            </div>
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                <span>New</span>
                                <span>Contacted</span>
                                <span>Meeting</span>
                                <span>Converted</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex gap-4">
                            <button
                                onClick={(e) => handleOnboard(lead, e)}
                                disabled={lead.status === 'Converted' || lead.status === 'Not Interested'}
                                className="flex-1 py-4 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all disabled:opacity-50"
                            >
                                {lead.status === 'Converted' ? 'Already Converted' : 'Onboard Now'}
                            </button>
                            <a
                                href={`tel:${lead.contact.split('|')[0].trim()}`}
                                className="px-6 flex items-center justify-center bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <VendorLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Assigned Leads</h1>
                        <p className="text-slate-500 font-medium text-lg italic">Optimize your outreach and track conversions.</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 px-6 py-4 rounded-3xl">
                        <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1 text-center">Active Funnel</p>
                        <p className="text-2xl font-black text-emerald-900 leading-none text-center">
                            {leads.filter(l => l.status !== 'Converted' && l.status !== 'Not Interested').length}
                            <span className="text-xs font-bold text-emerald-600 ml-2">Leads</span>
                        </p>
                    </div>
                </div>

                {/* Filters & Search Control Bar */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search by name, contact, or location..."
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
                            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>

                        <select
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="px-4 py-3 bg-slate-50 border-0 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                        >
                            {locations.map(loc => <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>)}
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 bg-slate-50 border-0 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                        >
                            <option value="newest">Newest First</option>
                            <option value="name">Sort by Name</option>
                        </select>
                    </div>
                </div>

                {/* Leads Table Component */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-[500px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600 mb-4"></div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Leads...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col justify-center items-center h-[500px] text-center px-10">
                            <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Something went wrong</h3>
                            <p className="text-slate-500 mb-8 max-w-sm">{error}</p>
                            <button onClick={fetchLeads} className="px-8 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all">Try Again</button>
                        </div>
                    ) : filteredLeads.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 border-collapse">
                                <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Informtion</th>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</th>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {filteredLeads.map((lead, idx) => (
                                        <tr
                                            key={lead.id}
                                            onClick={() => setSelectedLead(lead)}
                                            className={`hover:bg-slate-50 cursor-pointer transition-all duration-300 group ${idx % 2 !== 0 ? 'bg-slate-50/30' : ''}`}
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black group-hover:bg-white transition-colors">
                                                        {lead.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-slate-900 mb-0.5">{lead.name}</div>
                                                        <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                                                            <span>{lead.contact.split('|')[0].trim()}</span>
                                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{lead.assignedDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                                                    <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    {lead.location}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 min-w-[150px]">
                                                <div className="flex flex-col gap-2">
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-emerald-500 transition-all duration-1000"
                                                            style={{ width: `${getProgressStage(lead.status)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                                        {lead.status === 'Converted' ? 'Lifecycle Complete' : 'Lead In Progress'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => handleStatusUpdate(lead.id, e.target.value, e)}
                                                    className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border-0 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer transition-all shadow-sm ${getStatusColor(lead.status)}`}
                                                >
                                                    {statusOptions.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center gap-2">
                                                    {(lead.status === 'Contacted' || lead.status === 'Meeting Scheduled') ? (
                                                        <button
                                                            onClick={(e) => handleOnboard(lead, e)}
                                                            className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                                                        >
                                                            Onboard
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-slate-300 uppercase italic tracking-widest">
                                                            {lead.status === 'Converted' ? 'Completed' : 'Follow up required'}
                                                        </span>
                                                    )}

                                                    <div className="hidden group-hover:flex items-center gap-1 ml-2 animate-in fade-in slide-in-from-right-2 duration-300">
                                                        <a href={`tel:${lead.contact.split('|')[0]}`} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Call">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                        </a>
                                                        <a href={`mailto:${lead.contact.split('|')[1]?.trim()}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Email">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center h-[500px] text-center px-6">
                            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-8">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 font-manrope">No leads matched your criteria</h3>
                            <p className="text-slate-500 max-w-sm font-medium">Try adjusting your filters or search term to find what you're looking for.</p>
                            {(searchTerm || statusFilter !== 'All' || locationFilter !== 'All') && (
                                <button
                                    onClick={() => { setSearchTerm(''); setStatusFilter('All'); setLocationFilter('All'); }}
                                    className="mt-8 px-8 py-3 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all font-plus-jakarta"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile View Card Layout (Shown via CSS media queries elsewhere or inline) */}
                <div className="md:hidden space-y-4 mt-8">
                    {filteredLeads.map(lead => (
                        <div key={lead.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm" onClick={() => setSelectedLead(lead)}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">{lead.name}</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{lead.assignedDate}</p>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${getStatusColor(lead.status)}`}>
                                    {lead.status}
                                </span>
                            </div>
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                    <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                    {lead.location}
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${getProgressStage(lead.status)}%` }}></div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => handleOnboard(lead, e)}
                                    className="flex-1 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
                                >
                                    Onboard
                                </button>
                                <a href={`tel:${lead.contact.split('|')[0]}`} className="p-3 bg-slate-100 text-slate-500 rounded-xl">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
        </VendorLayout>
    );
};

export default VendorLeads;
