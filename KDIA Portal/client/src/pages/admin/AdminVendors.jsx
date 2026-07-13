import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

const AdminVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hoveredRow, setHoveredRow] = useState(null);
    const [searchFocused, setSearchFocused] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();

    const fetchVendors = async () => {
        try {
            const response = await api.get('/admin/vendors', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVendors(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch vendors');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const filteredVendors = vendors.filter(v =>
        v.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.consumerId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate Stats
    const stats = {
        total: vendors.length,
        approved: vendors.filter(v => v.approval_status === 'APPROVED').length,
        pending: vendors.filter(v => v.approval_status === 'PENDING').length,
        inactive: vendors.filter(v => !v.isActive).length
    };

    if (loading) return (
        <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
            <div style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Loading vendor directory...</div>
            <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error) return (
        <div style={{ padding: '24px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '12px', color: '#c53030', margin: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: '700', marginBottom: '8px', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px' }}>⚠️</span> System Error
            </div>
            <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>{error}</div>
        </div>
    );

    const StatCard = ({ label, value, icon, color }) => (
        <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            transition: 'transform 0.2s, box-shadow 0.2s'
        }}>
            <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                color: color
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>{value}</div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '8px' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Vendor Management</h1>
                    <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '6px' }}>Manage enterprise vendor profiles and verify application status.</p>
                </div>

                {/* Search Bar - Enhanced */}
                <div style={{ position: 'relative' }}>
                    <span style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: searchFocused ? '#3b82f6' : '#94a3b8',
                        fontSize: '14px',
                        transition: 'color 0.2s'
                    }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by name, email or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        style={{
                            padding: '12px 40px 12px 42px',
                            border: `1px solid ${searchFocused ? '#3b82f6' : '#e2e8f0'}`,
                            borderRadius: '10px',
                            width: '320px',
                            outline: 'none',
                            fontSize: '0.95rem',
                            color: '#1e293b',
                            boxShadow: searchFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                border: 'none',
                                background: '#f1f5f9',
                                color: '#64748b',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >✕</button>
                    )}
                </div>
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                <StatCard label="Total Vendors" value={stats.total} icon="👥" color="#64748b" />
                <StatCard label="Approved" value={stats.approved} icon="✅" color="#10b981" />
                <StatCard label="Pending Action" value={stats.pending} icon="⏳" color="#f59e0b" />
                <StatCard label="Inactive" value={stats.inactive} icon="🚫" color="#ef4444" />
            </div>

            {/* Table Card */}
            <div style={{
                background: '#fff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '18px 24px', fontWeight: '700', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vendor Details</th>
                            <th style={{ padding: '18px 24px', fontWeight: '700', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business ID</th>
                            <th style={{ padding: '18px 24px', fontWeight: '700', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applied On</th>
                            <th style={{ padding: '18px 24px', fontWeight: '700', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Approval</th>
                            <th style={{ padding: '18px 24px', fontWeight: '700', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account</th>
                            <th style={{ padding: '18px 24px', fontWeight: '700', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody style={{ position: 'relative' }}>
                        {filteredVendors.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '80px 24px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>📂</div>
                                    <div style={{ fontWeight: '700', fontSize: '1.2rem', color: '#1e293b', marginBottom: '4px' }}>No vendors found</div>
                                    <div style={{ color: '#64748b', fontSize: '0.95rem' }}>New vendor registrations will appear here.</div>
                                </td>
                            </tr>
                        ) : (
                            filteredVendors.map((vendor) => (
                                <tr
                                    key={vendor.id}
                                    onMouseEnter={() => setHoveredRow(vendor.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        borderBottom: '1px solid #f1f5f9',
                                        background: hoveredRow === vendor.id ? '#f8fafc' : 'transparent',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{vendor.fullName}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>{vendor.email}</div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{
                                            background: '#f1f5f9',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            color: '#475569',
                                            fontWeight: '600',
                                            display: 'inline-block',
                                            fontFamily: 'monospace'
                                        }}>
                                            {vendor.consumerId}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px', color: '#475569', fontSize: '0.9rem' }}>
                                        {new Date(vendor.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <StatusBadge status={vendor.approval_status} />
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <StatusBadge status={vendor.isActive ? 'ACTIVE' : 'INACTIVE'} />
                                    </td>
                                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                                            style={{
                                                background: '#0f172a',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '10px 18px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                transition: 'all 0.2s',
                                                boxShadow: hoveredRow === vendor.id ? '0 4px 12px rgba(15, 23, 42, 0.25)' : 'none',
                                                transform: hoveredRow === vendor.id ? 'translateY(-1px)' : 'none'
                                            }}
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
        </div>
    );
};

export default AdminVendors;
