import React from 'react';
import SuperAdminLayout from '../../components/SuperAdminLayout';

const MOCK_CUSTOMERS = [
    { id: 'KDIA-MOCK-001', name: 'Apeksha Sharma', email: 'customer@kdia.com', capacity: '500 kWh', status: 'Active' },
    { id: 'KDIA-MOCK-002', name: 'Rajesh Kumar', email: 'rajesh@kdia.com', capacity: '1,500 kWh', status: 'Pending Approval' },
    { id: 'KDIA-MOCK-003', name: 'Solar Tech Solutions', email: 'solartech@kdia.com', capacity: '5,000 kWh', status: 'Active' },
];

const SuperAdminCustomers = () => {
    return (
        <SuperAdminLayout>
            <div style={{ paddingBottom: '60px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '8px' }}>All Customers</h1>
                    <p style={{ color: '#64748b' }}>Complete system-wide registry of clean energy portal customers.</p>
                </div>

                <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Consumer ID</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Customer Name</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Email</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Subscribed Capacity</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_CUSTOMERS.map(c => (
                                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '18px 24px', fontWeight: '700', color: '#1a202c' }}>{c.id}</td>
                                    <td style={{ padding: '18px 24px', fontWeight: '700' }}>{c.name}</td>
                                    <td style={{ padding: '18px 24px', color: '#4a5568' }}>{c.email}</td>
                                    <td style={{ padding: '18px 24px', fontWeight: '700', color: '#059669' }}>{c.capacity}</td>
                                    <td style={{ padding: '18px 24px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '999px',
                                            fontSize: '0.7rem',
                                            fontWeight: '800',
                                            background: c.status === 'Active' ? '#ecfdf5' : '#fffbeb',
                                            color: c.status === 'Active' ? '#059669' : '#d97706',
                                            border: c.status === 'Active' ? '1px solid #a7f3d0' : '1px solid #fde68a',
                                            textTransform: 'uppercase'
                                        }}>{c.status}</span>
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

export default SuperAdminCustomers;
