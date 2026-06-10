import React from 'react';
import SuperAdminLayout from '../../components/SuperAdminLayout';

const MOCK_VENDORS = [
    { id: 'VEND-MOCK-001', name: 'Vendor Partner', email: 'vendor@kdia.com', capacity: '1,200 kW', status: 'Approved' },
    { id: 'VEND-MOCK-002', name: 'SunLight Power Partners', email: 'sunlight@kdia.com', capacity: '2,500 kW', status: 'Approved' },
    { id: 'VEND-MOCK-003', name: 'GreenGrid Installations', email: 'greengrid@kdia.com', capacity: '800 kW', status: 'Pending Review' },
];

const SuperAdminVendors = () => {
    return (
        <SuperAdminLayout>
            <div style={{ paddingBottom: '60px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '8px' }}>All Vendors</h1>
                    <p style={{ color: '#64748b' }}>Complete system-wide registry of KDIA certified vendor partners.</p>
                </div>

                <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Vendor ID</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Company Name</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Email</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Operational Target</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_VENDORS.map(v => (
                                <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '18px 24px', fontWeight: '700', color: '#1a202c' }}>{v.id}</td>
                                    <td style={{ padding: '18px 24px', fontWeight: '700' }}>{v.name}</td>
                                    <td style={{ padding: '18px 24px', color: '#4a5568' }}>{v.email}</td>
                                    <td style={{ padding: '18px 24px', fontWeight: '700', color: '#0891b2' }}>{v.capacity}</td>
                                    <td style={{ padding: '18px 24px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '999px',
                                            fontSize: '0.7rem',
                                            fontWeight: '800',
                                            background: v.status === 'Approved' ? '#ecfdf5' : '#fffbeb',
                                            color: v.status === 'Approved' ? '#059669' : '#d97706',
                                            border: v.status === 'Approved' ? '1px solid #a7f3d0' : '1px solid #fde68a',
                                            textTransform: 'uppercase'
                                        }}>{v.status}</span>
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

export default SuperAdminVendors;
