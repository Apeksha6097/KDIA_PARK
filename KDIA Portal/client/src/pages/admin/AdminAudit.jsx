import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminAudit = () => {
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
    }, []);

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

    // Filter and Sort implementation
    const processedLogs = React.useMemo(() => {
        let filtered = [...logs];

        // 1. Filter
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

        // 2. Sort
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
        <div style={{ padding: '64px', textAlign: 'center', color: '#64748b' }}>
            <div style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: '500' }}>Loading audit history...</div>
            <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error) return (
        <div style={{ padding: '24px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '12px', color: '#c53030', margin: '24px 0' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>System Error</div>
            <div style={{ fontSize: '0.9rem' }}>{error}</div>
        </div>
    );

    return (
        <div style={{ padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>System Audit Logs</h1>
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
                        onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#e2e8f0';
                            e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
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
                                style={{ padding: '16px 24px', fontWeight: '700', color: '#475569', cursor: 'pointer', userSelect: 'none', transition: 'background 0.2s' }}
                                onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
                                onMouseOut={(e) => e.target.style.background = 'transparent'}
                            >
                                Timestamp <span style={{ marginLeft: '4px', opacity: sortConfig.key === 'timestamp' ? 1 : 0.3 }}>{getSortIcon('timestamp')}</span>
                            </th>
                            <th
                                onClick={() => handleSort('adminName')}
                                style={{ padding: '16px 24px', fontWeight: '700', color: '#475569', cursor: 'pointer', userSelect: 'none', transition: 'background 0.2s' }}
                                onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
                                onMouseOut={(e) => e.target.style.background = 'transparent'}
                            >
                                Admin <span style={{ marginLeft: '4px', opacity: sortConfig.key === 'adminName' ? 1 : 0.3 }}>{getSortIcon('adminName')}</span>
                            </th>
                            <th
                                onClick={() => handleSort('actionType')}
                                style={{ padding: '16px 24px', fontWeight: '700', color: '#475569', cursor: 'pointer', userSelect: 'none', transition: 'background 0.2s' }}
                                onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
                                onMouseOut={(e) => e.target.style.background = 'transparent'}
                            >
                                Action <span style={{ marginLeft: '4px', opacity: sortConfig.key === 'actionType' ? 1 : 0.3 }}>{getSortIcon('actionType')}</span>
                            </th>
                            <th style={{ padding: '16px 24px', fontWeight: '700', color: '#475569' }}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedLogs.map((log) => (
                            <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem', transition: 'background 0.2s' }}>
                                <td style={{ padding: '14px 24px', color: '#64748b', fontFamily: 'monospace' }}>
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td style={{ padding: '14px 24px', fontWeight: '700', color: '#1e293b' }}>{log.adminName}</td>
                                <td style={{ padding: '14px 24px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '8px',
                                        background: '#f1f5f9',
                                        color: '#475569',
                                        fontSize: '0.75rem',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        border: '1px solid #e2e8f0'
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
                                    <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.2 }}>🔍</div>
                                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1e293b', marginBottom: '4px' }}>
                                        {searchTerm ? 'No matching logs found' : 'No audit history available'}
                                    </div>
                                    <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                                        {searchTerm ? `No results found for "${searchTerm}"` : 'Activity records will appear here as admins perform actions.'}
                                    </div>
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            style={{ marginTop: '16px', background: 'none', border: 'none', color: '#3b82f6', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                                        >Clear search results</button>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAudit;
