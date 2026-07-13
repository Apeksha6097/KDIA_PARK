import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

const AdminTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [hoveredRow, setHoveredRow] = useState(null);
    const [filterFocused, setFilterFocused] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    const fetchTickets = async () => {
        try {
            const response = await api.get('/admin/tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch support tickets');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const filteredTickets = tickets.filter(t => {
        const matchesStatus = filterStatus === 'ALL' ? true : t.status === filterStatus;
        const category = t.category || t.subject;
        const matchesCategory = filterCategory === 'ALL' ? true : category === filterCategory;
        return matchesStatus && matchesCategory;
    });

    const stats = {
        total: tickets.length,
        action: tickets.filter(t => t.status === 'PENDING').length,
        open: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolved: tickets.filter(t => t.status === 'RESOLVED').length
    };

    if (loading) return (
        <div style={{ padding: '64px', textAlign: 'center', color: '#64748b' }}>
            <div style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: '500' }}>Retrieving support tickets...</div>
            <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error) return (
        <div style={{ padding: '24px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '12px', color: '#c53030', margin: '24px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: '700', marginBottom: '8px', fontSize: '1.1rem' }}>⚠️ System Error</div>
            <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>{error}</div>
        </div>
    );

    const StatCard = ({ label, value, icon, color }) => (
        <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
            <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                color: color
            }}>{icon}</div>
            <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{value}</div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '8px' }}>
            {/* Header section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Support Requests</h1>
                    <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '6px' }}>Manage and respond to customer infrastructure queries.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        onFocus={() => setFilterFocused('category')}
                        onBlur={() => setFilterFocused(null)}
                        style={{
                            padding: '10px 16px',
                            border: `1px solid ${filterFocused === 'category' ? '#3b82f6' : '#e2e8f0'}`,
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            outline: 'none',
                            background: '#fff',
                            cursor: 'pointer',
                            boxShadow: filterFocused === 'category' ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                            transition: 'all 0.2s',
                            fontWeight: '500'
                        }}
                    >
                        <option value="ALL">All Categories</option>
                        <option value="General Question">General Question</option>
                        <option value="Consumption Clarification">Consumption Clarification</option>
                        <option value="Allocation Related">Allocation Related</option>
                        <option value="PROFILE_UPDATE_REQUEST">Profile Update Request</option>
                        <option value="Other">Other</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        onFocus={() => setFilterFocused('status')}
                        onBlur={() => setFilterFocused(null)}
                        style={{
                            padding: '10px 16px',
                            border: `1px solid ${filterFocused === 'status' ? '#3b82f6' : '#e2e8f0'}`,
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            outline: 'none',
                            background: '#fff',
                            cursor: 'pointer',
                            boxShadow: filterFocused === 'status' ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                            transition: 'all 0.2s',
                            fontWeight: '500'
                        }}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REVOKED">Revoked</option>
                    </select>
                </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                <StatCard label="Total Tickets" value={stats.total} icon="📬" color="#64748b" />
                <StatCard label="Action Required" value={stats.action} icon="🚨" color="#f59e0b" />
                <StatCard label="Open Tickets" value={stats.open} icon="⚙️" color="#3b82f6" />
                <StatCard label="Resolved" value={stats.resolved} icon="✅" color="#10b981" />
            </div>

            {/* Table Container */}
            <div style={{
                background: '#fff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '18px 24px', fontWeight: '700', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket ID</th>
                            <th style={{ padding: '18px 24px', fontWeight: '700', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
                            <th style={{ padding: '18px 24px', fontWeight: '700', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                            <th style={{ padding: '18px 24px', fontWeight: '700', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</th>
                            <th style={{ padding: '18px 24px', fontWeight: '700', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                            <th style={{ padding: '18px 24px', fontWeight: '700', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '80px 24px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>🎧</div>
                                    <div style={{ fontWeight: '700', fontSize: '1.2rem', color: '#1e293b', marginBottom: '4px' }}>No support requests found</div>
                                    <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                                        {filterCategory !== 'ALL' || filterStatus !== 'ALL'
                                            ? 'Try adjusting your filters to find what you\'re looking for.'
                                            : 'New tickets will appear here automatically.'}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <tr
                                    key={ticket.id}
                                    onMouseEnter={() => setHoveredRow(ticket.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        borderBottom: '1px solid #f1f5f9',
                                        background: hoveredRow === ticket.id ? '#f8fafc' : 'transparent',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <td style={{ padding: '20px 24px' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: '#94a3b8',
                                            letterSpacing: '0.02em',
                                            padding: '4px 8px',
                                            background: '#f8fafc',
                                            borderRadius: '4px',
                                            fontFamily: 'monospace'
                                        }}>#TK-{1000 + ticket.id}</span>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{ticket.customerName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>ID: {ticket.customerConsumerId}</div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            background: '#f1f5f9',
                                            color: '#475569',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {ticket.category || 'General'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '700', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {ticket.subject}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                                            Last updated: {new Date(ticket.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <StatusBadge
                                            status={ticket.status}
                                            customLabel={ticket.status === 'PENDING' ? 'Admin Action Required' : null}
                                        />
                                    </td>
                                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                                            style={{
                                                background: '#0f172a',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '10px 20px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                transition: 'all 0.2s',
                                                boxShadow: hoveredRow === ticket.id ? '0 4px 12px rgba(15, 23, 42, 0.25)' : 'none',
                                                transform: hoveredRow === ticket.id ? 'translateY(-1px)' : 'none'
                                            }}
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTickets;
