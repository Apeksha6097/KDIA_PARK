import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    Clock,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    ChevronRight,
    Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SupportDashboard = () => {
    const [stats, setStats] = useState({
        open: 0,
        inProgress: 0,
        escalated: 0,
        resolved: 0
    });
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/support/agent/tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const tickets = res.data;

            // Calculate stats
            const today = new Date().toDateString();
            const s = {
                open: tickets.filter(t => t.status === 'PENDING' || t.status === 'OPEN').length,
                inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
                escalated: tickets.filter(t => t.status === 'ESCALATED').length,
                resolved: tickets.filter(t => t.status === 'RESOLVED' && new Date(t.updatedAt || t.createdAt).toDateString() === today).length
            };
            setStats(s);
            setRecentTickets(tickets.slice(0, 5));
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color, bgColor, borderColor }) => (
        <div className={`bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300`}>
            {/* Accent Line */}
            <div className={`absolute top-0 left-0 w-1 h-full ${bgColor.replace('bg-', 'bg-').replace('50', '500')}`}></div>

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-3xl font-extrabold text-neutral-800">{value}</p>
                </div>
                <div className={`p-3 rounded-xl ${bgColor} ${color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="p-8">Loading Dashboard...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Support Overview</h1>
                    <p className="text-neutral-500">Track and manage ticket resolutions across all regions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors font-medium">
                        New Ticket
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Clock}
                    label="Open Tickets"
                    value={stats.open}
                    color="text-orange-600"
                    bgColor="bg-orange-50"
                />
                <StatCard
                    icon={TrendingUp}
                    label="In Progress"
                    value={stats.inProgress}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <StatCard
                    icon={AlertCircle}
                    label="Escalated"
                    value={stats.escalated}
                    color="text-red-600"
                    bgColor="bg-red-50"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Resolved Today"
                    value={stats.resolved}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
            </div>

            {/* Recent Tickets Table */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-neutral-50 flex items-center justify-between">
                    <h2 className="font-bold text-neutral-800">Recently Updated Tickets</h2>
                    <Link to="/support/tickets" className="text-emerald-600 text-sm font-semibold hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50 text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">Ticket ID</th>
                                <th className="px-6 py-4 text-left">Subject</th>
                                <th className="px-6 py-4 text-left">Customer</th>
                                <th className="px-6 py-4 text-left">Priority</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {recentTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-neutral-800">#TK-{ticket.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-neutral-800">{ticket.subject}</p>
                                        <span className="text-xs text-neutral-400">{ticket.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-600">{ticket.customerName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${ticket.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                            ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${ticket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            (ticket.status === 'PENDING' || ticket.status === 'OPEN') ? 'bg-red-50 text-red-700 border-red-100' :
                                                ticket.status === 'ESCALATED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            to={`/support/tickets/${ticket.id}`}
                                            className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-sm hover:underline"
                                        >
                                            Handle <ChevronRight size={16} />
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

export default SupportDashboard;
