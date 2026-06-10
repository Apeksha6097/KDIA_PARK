import React from 'react';
import SuperAdminLayout from '../../components/SuperAdminLayout';

const MOCK_PERMISSIONS = [
    { key: 'manage_users', module: 'Auth', desc: 'Allows provisioning administrator accounts.' },
    { key: 'manage_roles', module: 'Auth', desc: 'Allows modifying global role properties.' },
    { key: 'manage_rbac_settings', module: 'Auth', desc: 'Allows overriding route-guard lists.' },
    { key: 'manage_customers', module: 'Operations', desc: 'Allows approval of customer registrations.' },
    { key: 'manage_vendors', module: 'Operations', desc: 'Allows onboarding vendor partners.' },
    { key: 'manage_subscriptions', module: 'Billing', desc: 'Allows modifying subscription pricing tiers.' },
    { key: 'manage_tickets_admin', module: 'Support', desc: 'Allows admin override on ticket assignments.' },
];

const SuperAdminPermissions = () => {
    return (
        <SuperAdminLayout>
            <div style={{ paddingBottom: '60px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '8px' }}>System Permissions Matrix</h1>
                    <p style={{ color: '#64748b' }}>Configure granular policy parameters and security access lists.</p>
                </div>

                <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Module</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Permission Key</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Description</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', textAlign: 'center' }}>Global Policy Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_PERMISSIONS.map(p => (
                                <tr key={p.key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '18px 24px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '0.65rem',
                                            fontWeight: '800',
                                            background: '#f1f5f9',
                                            color: '#475569',
                                            textTransform: 'uppercase'
                                        }}>{p.module}</span>
                                    </td>
                                    <td style={{ padding: '18px 24px', fontWeight: '800', color: '#1e1b4b' }}>{p.key}</td>
                                    <td style={{ padding: '18px 24px', color: '#4a5568', fontSize: '0.9rem' }}>{p.desc}</td>
                                    <td style={{ padding: '18px 24px', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '999px',
                                            fontSize: '0.7rem',
                                            fontWeight: '800',
                                            background: '#ecfdf5',
                                            color: '#059669',
                                            border: '1px solid #a7f3d0',
                                            textTransform: 'uppercase'
                                        }}>Enabled</span>
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

export default SuperAdminPermissions;
