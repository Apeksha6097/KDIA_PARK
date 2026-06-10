import React from 'react';
import SuperAdminLayout from '../../components/SuperAdminLayout';

const SuperAdminDashboard = () => {
    return (
        <SuperAdminLayout>
            <div style={{ paddingBottom: '60px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '8px' }}>Platform Operations Center</h1>
                    <p style={{ color: '#64748b' }}>Complete administrative oversight, configuration control, and security telemetry logs.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                    {/* Platform Overview */}
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '16px' }}>Platform Overview</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.9rem' }}>
                                <span style={{ color: '#64748b' }}>Clean Energy Project Power Grid Capacity</span>
                                <span style={{ fontWeight: '800', color: '#4f46e5' }}>14,200 kW</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.9rem' }}>
                                <span style={{ color: '#64748b' }}>Certified Regional Payout Tiers</span>
                                <span style={{ fontWeight: '800', color: '#059669' }}>3 Subscription Levels</span>
                            </div>
                        </div>
                    </div>

                    {/* User Statistics */}
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '16px' }}>User Statistics</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.9rem' }}>
                                <span style={{ color: '#64748b' }}>Registered Customer Clients</span>
                                <span style={{ fontWeight: '800', color: '#0f172a' }}>3,842</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.9rem' }}>
                                <span style={{ color: '#64748b' }}>Approved Regional Vendor Partners</span>
                                <span style={{ fontWeight: '800', color: '#0f172a' }}>84</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                    {/* Security Logs */}
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '20px' }}>Security Logs</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { time: '12:25 PM', type: 'JWT', text: 'Active Super Admin authentication token verified.' },
                                { time: '11:42 AM', type: 'RBAC', text: 'Role permissions matrix configuration saved.' },
                                { time: '10:15 AM', type: 'SYS', text: 'System settings synced across dispatch databases.' },
                            ].map((log, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                                    <span style={{ color: '#64748b', fontWeight: '600' }}>{log.time}</span>
                                    <span style={{ fontWeight: '800', color: '#4338ca' }}>[{log.type}]</span>
                                    <span style={{ color: '#334155' }}>{log.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Role Matrix Summary */}
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '20px' }}>Role Matrix Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ fontWeight: '700' }}>Super Admin</span>
                                <span style={{ color: '#4338ca', fontWeight: '800' }}>Full Policies</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ fontWeight: '700' }}>Admin</span>
                                <span style={{ color: '#059669', fontWeight: '800' }}>Ops Control</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'between' }}>
                                <span style={{ fontWeight: '700' }}>Support</span>
                                <span style={{ color: '#d97706', fontWeight: '800' }}>Ticket Queue</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit Summary */}
                <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0', marginTop: '32px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '16px' }}>Audit Summary</h3>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>Global operational audit data parameters summary.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>GRID AUDITS</span>
                            <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e1b4b', marginTop: '6px' }}>32 Audited Zones</p>
                        </div>
                        <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>COMPLIANCE RATE</span>
                            <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669', marginTop: '6px' }}>99.8% Global</p>
                        </div>
                        <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>LAST SYSTEM CHECK</span>
                            <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#3182ce', marginTop: '6px' }}>08-06-2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
};

export default SuperAdminDashboard;
