import React from 'react';
import SuperAdminLayout from '../../components/SuperAdminLayout';

const MOCK_ROLES = [
    { name: 'Super Admin', key: 'super_admin', description: 'Complete system control, role provisions, and server configurations.', permCount: 22 },
    { name: 'Administrator', key: 'admin', description: 'Manage regional operations, customer approvals, vendors, and allocations.', permCount: 14 },
    { name: 'Support Representative', key: 'support', description: 'Handle support tickets, FAQ content, lookup customer issues.', permCount: 6 },
    { name: 'Vendor Partner', key: 'vendor', description: 'View onboarding leads, execute customer plans, billing parameters.', permCount: 3 },
    { name: 'Customer Client', key: 'customer', description: 'View own allocation quota, subscription timeline, submit tickets.', permCount: 2 },
];

const SuperAdminRoles = () => {
    return (
        <SuperAdminLayout>
            <div style={{ paddingBottom: '60px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '8px' }}>Role Management</h1>
                    <p style={{ color: '#64748b' }}>Configure global system roles and granular user classification parameters.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    {MOCK_ROLES.map(role => (
                        <div key={role.key} style={{ background: '#fff', padding: '24px 32px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1a202c' }}>{role.name}</h3>
                                    <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>{role.key}</span>
                                </div>
                                <p style={{ color: '#4a5568', fontSize: '0.9rem', marginTop: '8px' }}>{role.description}</p>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Allowed Actions</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#4f46e5', marginTop: '4px' }}>{role.permCount}</p>
                                </div>
                                <button
                                    style={{
                                        padding: '10px 20px',
                                        background: '#ede9fe',
                                        color: '#4338ca',
                                        border: '1px solid #c4b5fd',
                                        borderRadius: '12px',
                                        fontWeight: '750',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Modify Role
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SuperAdminLayout>
    );
};

export default SuperAdminRoles;
