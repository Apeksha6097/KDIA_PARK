import React from 'react';
import SuperAdminLayout from '../../components/SuperAdminLayout';

const MOCK_SUPPORT_USERS = [
    { id: 'SUP-001', name: 'John Doe', email: 'john@kdia.com', status: 'Active', shift: 'Morning' },
    { id: 'SUP-002', name: 'Jane Smith', email: 'jane@kdia.com', status: 'Active', shift: 'Evening' },
    { id: 'SUP-003', name: 'Robert Johnson', email: 'robert@kdia.com', status: 'Inactive', shift: 'Night' },
];

const SuperAdminSupportUsers = () => {
    return (
        <SuperAdminLayout>
            <div style={{ paddingBottom: '60px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '8px' }}>All Support Users</h1>
                    <p style={{ color: '#64748b' }}>Complete system-wide registry of regional support agents.</p>
                </div>

                <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Agent ID</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Name</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Email</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Shift</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_SUPPORT_USERS.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '18px 24px', fontWeight: '700', color: '#1a202c' }}>{s.id}</td>
                                    <td style={{ padding: '18px 24px', fontWeight: '700' }}>{s.name}</td>
                                    <td style={{ padding: '18px 24px', color: '#4a5568' }}>{s.email}</td>
                                    <td style={{ padding: '18px 24px', color: '#4a5568' }}>{s.shift}</td>
                                    <td style={{ padding: '18px 24px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '999px',
                                            fontSize: '0.7rem',
                                            fontWeight: '800',
                                            background: s.status === 'Active' ? '#ecfdf5' : '#f1f5f9',
                                            color: s.status === 'Active' ? '#059669' : '#475569',
                                            border: s.status === 'Active' ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                                            textTransform: 'uppercase'
                                        }}>{s.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SuperAdminLayout>
    );
};

export default SuperAdminSupportUsers;
