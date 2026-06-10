import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../../components/SuperAdminLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SuperAdminAuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
    const { token } = useAuth();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/admin/audit-logs', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLogs(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch administrative audit logs.');
                setLoading(false);
            }
        };
        fetchLogs();
    }, [token]);

    const formatDetails = (details) => {
        if (typeof details === 'object' && details !== null) {
            return Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(', ');
        }
        try {
            const d = typeof details === 'string' ? JSON.parse(details) : details;
            if (typeof d === 'object' && d !== null) {
                return Object.entries(d).map(([k, v]) => `${k}: ${v}`).join(', ');
            }
            return details;
        } catch (e) {
            return details;
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return '↕️';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const processedLogs = React.useMemo(() => {
        let filtered = [...logs];

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(log => {
                const timestampStr = new Date(log.timestamp).toLocaleString().toLowerCase();
                const adminStr = (log.adminName || '').toLowerCase();
                const actionStr = (log.actionType || '').toLowerCase();
                const detailsStr = formatDetails(log.details).toLowerCase();

                return timestampStr.includes(lowerSearch) ||
                    adminStr.includes(lowerSearch) ||
                    actionStr.includes(lowerSearch) ||
                    detailsStr.includes(lowerSearch);
            });
        }

        filtered.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'timestamp') {
                aValue = new Date(a.timestamp).getTime();
                bValue = new Date(b.timestamp).getTime();
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [logs, searchTerm, sortConfig]);

    if (loading) return (
        <SuperAdminLayout>
            <div style={{ padding: '64px', textAlign: 'center', color: '#64748b' }}>
                <div style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: '500' }}>Loading audit history...</div>
                <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </SuperAdminLayout>
    );

    if (error) return (
        <SuperAdminLayout>
            <div style={{ padding: '24px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '12px', color: '#c53030', margin: '24px 0' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>System Error</div>
                <div style={{ fontSize: '0.9rem' }}>{error}</div>
            </div>
        </SuperAdminLayout>
    );

    return (
        <SuperAdminLayout>
            <div style={{ padding: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e1b4b', margin: 0, letterSpacing: '-0.025em' }}>Platform Audit Logs</h1>
                        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '4px' }}>Traceable history of all administrative actions within the portal.</p>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search logs (admin, action, details)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '12px 16px 12px 40px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                width: '320px',
                                fontSize: '0.95rem',
                                outline: 'none',
                                transition: 'all 0.2s',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                        />
                        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', opacity: 0.4 }}>🔍</span>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.1rem' }}
                            >✕</button>
                        )}
                    </div>
                </div>

                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th
                                    onClick={() => handleSort('timestamp')}
                                    style={{ padding: '16px 24px', fontWeight: '700', color: '#475569', cursor: 'pointer', userSelect: 'none' }}
                                >
                                    Timestamp {getSortIcon('timestamp')}
                                </th>
                                <th
                                    onClick={() => handleSort('adminName')}
                                    style={{ padding: '16px 24px', fontWeight: '700', color: '#475569', cursor: 'pointer', userSelect: 'none' }}
                                >
                                    Admin {getSortIcon('adminName')}
                                </th>
                                <th
                                    onClick={() => handleSort('actionType')}
                                    style={{ padding: '16px 24px', fontWeight: '700', color: '#475569', cursor: 'pointer', userSelect: 'none' }}
                                >
                                    Action {getSortIcon('actionType')}
                                </th>
                                <th style={{ padding: '16px 24px', fontWeight: '700', color: '#475569' }}>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedLogs.map((log) => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                                    <td style={{ padding: '14px 24px', color: '#64748b', fontFamily: 'monospace' }}>
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '14px 24px', fontWeight: '700', color: '#1e293b' }}>{log.adminName}</td>
                                    <td style={{ padding: '14px 24px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            background: '#ede9fe',
                                            color: '#4338ca',
                                            fontSize: '0.75rem',
                                            fontWeight: '800',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            border: '1px solid #c4b5fd'
                                        }}>
                                            {log.actionType}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 24px', color: '#4a5568', lineHeight: '1.5' }}>{formatDetails(log.details)}</td>
                                </tr>
                            ))}
                            {processedLogs.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '80px 24px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.2 }}>📝</div>
                                        <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1e293b', marginBottom: '4px' }}>
                                            {searchTerm ? 'No matching logs found' : 'No audit history available'}
                                        </div>
                                        <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                                            {searchTerm ? `No results found for "${searchTerm}"` : 'Activity records will appear here.'}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SuperAdminLayout>
    );
};

export default SuperAdminAuditLogs;
