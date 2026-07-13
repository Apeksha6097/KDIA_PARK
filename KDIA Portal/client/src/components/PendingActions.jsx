import React from 'react';
import { useNavigate } from 'react-router-dom';

const PendingActions = ({ alerts, stats }) => {
    const navigate = useNavigate();

    const actions = [
        {
            label: 'Customers pending approval',
            count: alerts?.pendingCustomerApprovals ?? 0,
            link: '/admin/customers',
            unavailable: alerts === null
        },
        {
            label: 'Allocations awaiting confirmation',
            count: (stats?.activeCustomers === undefined || stats?.totalCustomers === undefined)
                ? 0
                : Math.max(0, stats.totalCustomers - stats.activeCustomers),
            link: '/admin/customers', // Assuming this is where approvals happen
            unavailable: stats === null
        },
        {
            label: 'Overdue support requests',
            count: alerts?.supportSLA ?? 0,
            link: '/admin/tickets',
            unavailable: alerts === null
        }
    ];

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: '700', color: '#1a202c' }}>Pending Actions</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {actions.map((action, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.9rem', color: '#4a5568' }}>{action.label}</span>
                            {action.unavailable && (
                                <div style={{ position: 'relative', display: 'inline-block', cursor: 'help' }} title="Data unavailable">
                                    <svg style={{ width: '14px', height: '14px', color: '#a0aec0' }} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                color: action.unavailable ? '#cbd5e0' : action.count > 0 ? '#e53e3e' : '#2d3748'
                            }}>
                                {action.count}
                            </span>
                            <button
                                onClick={() => navigate(action.link)}
                                style={{
                                    padding: '4px 8px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    color: '#3182ce',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                View →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #edf2f7' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/admin/customers')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: '#ebf8ff',
                            color: '#2b6cb0',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            cursor: 'pointer'
                        }}
                    >
                        Review Approvals
                    </button>
                    <button
                        onClick={() => navigate('/admin/tickets')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: '#f7fafc',
                            color: '#4a5568',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            cursor: 'pointer'
                        }}
                    >
                        View Support Queue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PendingActions;
