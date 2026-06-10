import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ROLES } from '../config/rbac';

/**
 * SuperAdminBanner — displayed at the top of AdminDashboard only when the
 * logged-in user has the super_admin role. Returns null for all other roles.
 */
const SuperAdminBanner = () => {
    const { user } = useAuth();

    if (user?.role !== ROLES.SUPER_ADMIN) return null;

    const portalLinks = [
        { label: 'Support Portal', to: '/support/dashboard', color: '#059669', bg: '#ecfdf5', border: '#6ee7b7' },
        { label: 'Vendor Portal', to: '/vendor/dashboard', color: '#0284c7', bg: '#e0f2fe', border: '#7dd3fc' },
        { label: 'Customer Portal', to: '/customer/dashboard', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
        { label: 'RBAC Settings', to: '/admin/settings', color: '#b45309', bg: '#fffbeb', border: '#fcd34d' },
    ];

    return (
        <div style={{
            marginBottom: '28px',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #c4b5fd',
            boxShadow: '0 4px 24px rgba(109, 40, 217, 0.08)',
        }}>
            {/* Top gradient bar */}
            <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #7c3aed 100%)',
                padding: '20px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Crown Icon */}
                    <div style={{
                        width: '48px', height: '48px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.6rem',
                        border: '1px solid rgba(255,255,255,0.15)',
                        flexShrink: 0,
                    }}>
                        👑
                    </div>
                    <div>
                        <div style={{ fontSize: '0.6rem', fontWeight: '800', letterSpacing: '0.2em', color: '#a5b4fc', textTransform: 'uppercase', marginBottom: '2px' }}>
                            Super Administrator
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.01em' }}>
                            Welcome, {user?.fullName?.split(' ')[0]}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#c4b5fd', marginTop: '2px', fontWeight: '500' }}>
                            Full system access — all portals, roles, and permissions enabled
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    color: '#e9d5ff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
                    System Online
                </div>
            </div>

            {/* Quick Portal Access Row */}
            <div style={{
                background: '#faf9ff',
                padding: '14px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                borderTop: '1px solid #ede9fe',
            }}>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.12em', flexShrink: 0 }}>
                    Quick Access:
                </span>
                {portalLinks.map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            background: link.bg,
                            border: `1px solid ${link.border}`,
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            color: link.color,
                            textDecoration: 'none',
                            transition: 'all 0.15s ease',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.08)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                    >
                        {link.label}
                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SuperAdminBanner;
