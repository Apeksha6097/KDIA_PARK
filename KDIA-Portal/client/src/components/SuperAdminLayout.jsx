import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DemoIndicator from './DemoIndicator';

const SuperAdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/super-admin/dashboard', icon: '👑' },
        { name: 'Admin Users', path: '/super-admin/admins', icon: '👤' },
        { name: 'Role Management', path: '/super-admin/roles', icon: '🛡️' },
        { name: 'Permissions', path: '/super-admin/permissions', icon: '🔑' },
        { name: 'Customers', path: '/super-admin/customers', icon: '👥' },
        { name: 'Vendors', path: '/super-admin/vendors', icon: '🏢' },
        { name: 'Support Users', path: '/super-admin/support-users', icon: '🎧' },
        { name: 'Reports', path: '/super-admin/reports', icon: '📋' },
        { name: 'System Settings', path: '/super-admin/settings', icon: '⚙️' },
        { name: 'Audit Logs', path: '/super-admin/audit-logs', icon: '📝' },
    ];

    return (
        <div className="super-admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar */}
            <aside className="sidebar" style={{
                width: '280px',
                background: 'linear-gradient(180deg, #1e1b4b 0%, #0F172A 100%)', // Deep indigo-purple to slate
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Manrope, sans-serif',
                boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
                zIndex: 20
            }}>
                {/* Header */}
                <div className="sidebar-header" style={{
                    padding: '40px 32px 32px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'transparent'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/logo.png" alt="KDIA" style={{ height: '32px', width: 'auto', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '1rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff', lineHeight: '1.2' }}>KDIA Re Park</span>
                        <span style={{
                            display: 'block',
                            fontSize: '0.65rem',
                            fontWeight: '700',
                            letterSpacing: '0.15em',
                            color: '#a5b4fc',
                            textTransform: 'uppercase',
                            marginTop: '2px'
                        }}>
                            Super Admin
                        </span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="sidebar-nav" style={{ flex: 1, padding: '16px 16px', overflowY: 'auto' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 16px', marginBottom: '12px' }}>
                        Menu
                    </div>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 20px',
                                    marginBottom: '4px',
                                    color: isActive ? '#fff' : '#94a3b8',
                                    textDecoration: 'none',
                                    background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                                    borderRadius: '12px',
                                    transition: 'all 0.2s ease-in-out',
                                    fontSize: '0.9rem',
                                    fontWeight: isActive ? '700' : '500',
                                    borderLeft: isActive ? '3px solid #a5b4fc' : '3px solid transparent',
                                    position: 'relative',
                                }}
                                onMouseOver={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                        e.currentTarget.style.color = '#e2e8f0';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#94a3b8';
                                    }
                                }}
                            >
                                <span style={{ marginRight: '16px', fontSize: '1.1rem', opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer" style={{ padding: '32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '36px', height: '36px',
                            background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 'bold',
                            border: '2px solid rgba(165,180,252,0.4)',
                        }}>
                            👑
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.fullName}</div>
                            <div style={{
                                fontSize: '0.7rem',
                                color: '#a5b4fc',
                                fontWeight: '700',
                            }}>
                                Super Admin Access
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#e2e8f0',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            width: '100%',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e2e8f0'; }}
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <header style={{
                    height: '80px',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 40px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.02em', fontFamily: 'Manrope, sans-serif' }}>
                            {navItems.find(i => location.pathname.startsWith(i.path))?.name || 'Dashboard'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
                            Full System Administration
                        </span>
                    </div>
                </header>
                <div style={{ flex: 1, padding: '40px', overflowY: 'auto', background: '#f8fafc' }}>
                    <div className="max-container">
                        {children}
                    </div>
                </div>
            </main>

            <DemoIndicator />
        </div>
    );
};

export default SuperAdminLayout;
