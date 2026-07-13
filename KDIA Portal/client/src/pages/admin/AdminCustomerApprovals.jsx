 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/dateUtils';

const AdminCustomerApprovals = () => {
    const [pendingCustomers, setPendingCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredRow, setHoveredRow] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) fetchPendingCustomers();
    }, [token]);

    const fetchPendingCustomers = async () => {
        try {
            const response = await api.get('/admin/pending-customers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPendingCustomers(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '64px', textAlign: 'center', color: '#64748b' }}>
            <div style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: '500' }}>Loading application queue...</div>
            <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error) return (
        <div style={{ padding: '40px', margin: '24px', background: '#fffcfc', border: '1px solid #fee2e2', borderRadius: '12px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div>
                <div style={{ fontWeight: '700' }}>Failed to load applications</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{error}</div>
            </div>
        </div>
    );

    const StatCard = ({ label, value, icon, color }) => (
        <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                color: color
            }}>{icon}</div>
            <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{value}</div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '8px' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '900', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.025em' }}>Customer Approvals</h1>
                <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Main queue for reviewing applications onboarded by KDIA sales partners.</p>
            </div>

            {/* Approval Summary Stats */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <StatCard label="Total Queue" value={pendingCustomers.length} icon="📋" color="#3b82f6" />
                <StatCard label="Pending Review" value={pendingCustomers.length} icon="⏳" color="#f59e0b" />
                <StatCard label="Avg. Waiting" value="< 24h" icon="⚡" color="#10b981" />
                <StatCard label="Priority" value="High" icon="🎯" color="#ef4444" />
            </div>

            <div style={{
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04), 0 4px 6px -2px rgba(0,0,0,0.02)',
                overflow: 'hidden',
                border: '1px solid #e2e8f0'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '20px 24px', fontWeight: '700', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer Details</th>
                            <th style={{ padding: '20px 24px', fontWeight: '700', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sales Partner</th>
                            <th style={{ padding: '20px 24px', fontWeight: '700', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submission Date</th>
                            <th style={{ padding: '20px 24px', fontWeight: '700', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Status</th>
                            <th style={{ padding: '20px 24px', fontWeight: '700', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingCustomers.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '100px 24px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '3.5rem', marginBottom: '20px', opacity: 0.2 }}>📁</div>
                                    <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#1e293b', marginBottom: '6px' }}>No pending customer applications</div>
                                    <div style={{ color: '#64748b', fontSize: '0.95rem' }}>New applications submitted by sales partners will appear here automatically.</div>
                                </td>
                            </tr>
                        ) : (
                            pendingCustomers.map((customer) => (
                                <tr
                                    key={customer.id}
                                    onMouseEnter={() => setHoveredRow(customer.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        borderBottom: '1px solid #f1f5f9',
                                        transition: 'all 0.2s',
                                        background: hoveredRow === customer.id ? '#fbfcfe' : 'transparent',
                                        borderLeft: '4px solid #f59e0b' // Subtle urgency border for pending
                                    }}
                                >
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>{customer.fullName}</div>
                                        <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '2px' }}>{customer.email}</div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            color: customer.vendorName ? '#334155' : '#94a3b8',
                                            fontWeight: customer.vendorName ? '600' : '400'
                                        }}>
                                            {customer.vendorName ? (
                                                <>
                                                    <span style={{ fontSize: '1.1rem' }}>🏢</span>
                                                    {customer.vendorName}
                                                </>
                                            ) : (
                                                'Self-Registered'
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px', color: '#475569', fontSize: '0.95rem' }}>{formatDate(customer.createdAt)}</td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '6px 14px',
                                            borderRadius: '10px',
                                            fontSize: '0.75rem',
                                            fontWeight: '800',
                                            background: '#fffbeb',
                                            color: '#b45309',
                                            border: '1px solid #fef3c7',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            <span style={{ fontSize: '0.9rem' }}>⏱️</span>
                                            PENDING
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => navigate(`/admin/customers/${customer.id}/review`)}
                                            style={{
                                                padding: '10px 20px',
                                                background: '#10b981',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                fontWeight: '700',
                                                fontSize: '0.9rem',
                                                transition: 'all 0.2s',
                                                boxShadow: hoveredRow === customer.id ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none',
                                                transform: hoveredRow === customer.id ? 'translateY(-1px)' : 'none'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
                                            onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
                                        >
                                            Review Application
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🛡️</span> All applications are verified against KDIA compliance guidelines.
                </p>
            </div>
        </div>
    );
};

export default AdminCustomerApprovals;
