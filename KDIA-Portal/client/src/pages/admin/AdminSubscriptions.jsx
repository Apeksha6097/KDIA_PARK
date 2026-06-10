import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

const MOCK_SUBSCRIPTIONS = [
    { id: 'SUB-101', name: 'Standard Solar Quota', capacity: '500 kWh', price: '₹4,500/mo', activeUsers: 34 },
    { id: 'SUB-102', name: 'Premium Commercial Solar', capacity: '1,500 kWh', price: '₹12,000/mo', activeUsers: 18 },
    { id: 'SUB-103', name: 'Industrial Heavy Solar', capacity: '5,000 kWh', price: '₹38,000/mo', activeUsers: 7 },
];

const AdminSubscriptions = () => {
    const [subs, setSubs] = useState(MOCK_SUBSCRIPTIONS);

    return (
        <AdminLayout>
            <div style={{ paddingBottom: '60px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1a202c', marginBottom: '8px' }}>Subscriptions & Quotas</h1>
                    <p style={{ color: '#718096' }}>Manage solar quota subscription models and subscription tiers.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    {subs.map(sub => (
                        <div key={sub.id} style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
                            <div>
                                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#718096', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sub.id}</span>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a202c', marginTop: '16px', marginBottom: '8px' }}>{sub.name}</h3>
                                <p style={{ color: '#4a5568', fontSize: '0.9rem', marginBottom: '24px' }}>Solar distribution tier optimized for customer segments.</p>
                            </div>
                            
                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: '#718096' }}>Allocation Capacity</span>
                                    <span style={{ fontWeight: '700', color: '#1a202c' }}>{sub.capacity}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: '#718096' }}>Monthly Subscription Rate</span>
                                    <span style={{ fontWeight: '700', color: '#022c22' }}>{sub.price}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '16px' }}>
                                    <span style={{ color: '#718096' }}>Active Users</span>
                                    <span style={{ fontWeight: '700', color: '#3182ce' }}>{sub.activeUsers} Consumers</span>
                                </div>
                                <button
                                    style={{
                                        padding: '10px',
                                        background: '#f1f5f9',
                                        color: '#475569',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        transition: 'all 0.15s'
                                    }}
                                >
                                    Modify Tier Settings
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSubscriptions;
