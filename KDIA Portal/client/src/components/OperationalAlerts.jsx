import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Use centralized API

const OperationalAlerts = ({ token }) => {
    const [alerts, setAlerts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            // Using centralized API
            const response = await api.get('/admin/alerts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlerts(response.data);
        } catch (err) {
            console.error('Failed to fetch alerts:', err);
            setError('Unable to load alerts');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ marginBottom: '48px' }}>
                <h2 style={{ marginBottom: '24px', fontSize: '1.4rem', fontWeight: '600' }}>Operational Alerts</h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        border: '3px solid #e2e8f0',
                        borderTopColor: '#3182ce',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ marginBottom: '48px' }}>
                <h2 style={{ marginBottom: '24px', fontSize: '1.4rem', fontWeight: '600' }}>Operational Alerts</h2>
                <div style={{
                    padding: '32px',
                    background: '#fff',
                    border: '1px solid #fed7d7',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#c53030', marginBottom: '24px' }}>
                        <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Alerts Sync Failed</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                        {[
                            { label: 'Critical', color: '#c53030', bg: '#fff5f5' },
                            { label: 'Warning', color: '#9b2c2c', bg: '#fffaf0' },
                            { label: 'Info', color: '#2c5282', bg: '#ebf8ff' }
                        ].map(bucket => (
                            <div key={bucket.label} style={{ background: bucket.bg, padding: '16px', borderRadius: '8px', textAlign: 'center', border: `1px solid ${bucket.color}20` }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: bucket.color, textTransform: 'uppercase', marginBottom: '4px' }}>{bucket.label}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: bucket.color }}>0</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #edf2f7' }}>
                        <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                            Last sync attempt: <span style={{ fontWeight: '600' }}>{new Date().toLocaleTimeString()}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => { setLoading(true); setError(null); fetchAlerts(); }}
                                style={{
                                    padding: '8px 16px',
                                    background: '#f7fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Retry Sync
                            </button>
                            <button
                                onClick={() => navigate('/admin/audit')}
                                style={{
                                    padding: '8px 16px',
                                    background: '#2d3748',
                                    color: 'white',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                View System Logs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const alertCards = [
        {
            label: 'Pending Customer Approvals',
            value: alerts?.pendingCustomerApprovals || 0,
            description: 'New enrollments awaiting review',
            color: '#0891b2',
            bgColor: '#cffafe',
            icon: (
                <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            ),
            link: '/admin/customers' // Assuming this filters for pending or goes to approvals via logic
        },
        {
            label: 'Pending Vendor Approvals',
            value: alerts?.pendingVendorApprovals || 0,
            description: 'Vendor registrations awaiting review',
            color: '#7c3aed',
            bgColor: '#ede9fe',
            icon: (
                <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            link: '/admin/vendors' // Corrected linking pattern for vendors
        },
        {
            label: 'Pending Support Requests',
            value: alerts?.supportSLA || 0,
            description: 'Pending for more than 48 hours',
            color: '#dc2626',
            bgColor: '#fee2e2',
            icon: (
                <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            link: '/admin/tickets'
        },
        {
            label: 'Profile Change Requests',
            value: alerts?.profileChangeRequests || 0,
            description: 'Awaiting admin approval',
            color: '#d97706',
            bgColor: '#fef3c7',
            icon: (
                <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            link: '/admin/tickets'
        }
    ];

    return (
        <div style={{ marginBottom: '48px' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '1.4rem', fontWeight: '600' }}>Operational Alerts</h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
            }}>
                {alertCards.map((alert) => (
                    <div
                        key={alert.label}
                        onClick={() => alert.value > 0 && navigate(alert.link)}
                        style={{
                            background: '#fff',
                            padding: '24px',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            cursor: alert.value > 0 ? 'pointer' : 'default',
                            transition: 'all 0.2s',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            if (alert.value > 0) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                        }}
                    >
                        {/* Background decoration */}
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            width: '100px',
                            height: '100px',
                            background: alert.bgColor,
                            borderRadius: '50%',
                            opacity: '0.3'
                        }}></div>

                        {/* Icon */}
                        <div style={{
                            display: 'inline-flex',
                            padding: '12px',
                            background: alert.bgColor,
                            borderRadius: '12px',
                            color: alert.color,
                            marginBottom: '16px',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            {alert.icon}
                        </div>

                        {/* Count */}
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: alert.value > 0 ? alert.color : '#cbd5e0',
                            marginBottom: '8px',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            {alert.value}
                        </div>

                        {/* Label */}
                        <div style={{
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: '#2d3748',
                            marginBottom: '4px',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            {alert.label}
                        </div>

                        {/* Description */}
                        <div style={{
                            fontSize: '0.75rem',
                            color: '#718096',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            {alert.description}
                        </div>

                        {/* Click indicator */}
                        {alert.value > 0 && (
                            <div style={{
                                position: 'absolute',
                                bottom: '12px',
                                right: '12px',
                                fontSize: '0.7rem',
                                color: '#a0aec0',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                View →
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OperationalAlerts;
