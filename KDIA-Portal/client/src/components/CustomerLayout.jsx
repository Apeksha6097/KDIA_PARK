import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DemoIndicator from './DemoIndicator';

const CustomerLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);



    const navLinks = [
        { label: 'Dashboard', href: '/customer/dashboard' },
        { label: 'Know Your Project', href: '/customer/know-your-project' },
        { label: 'Support', href: '/customer/support' },
        { label: 'My Profile', href: '/customer/profile' },
    ];

    const isActive = (href) =>
        location.pathname === href || location.pathname.startsWith(href + '/');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navigation */}
            <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
                <div className="max-container mx-auto px-4">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex items-center space-x-6">
                            <Link to="/customer/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
                                <img src="/logo.png" alt="KDIA" className="h-7 w-auto" />
                                <div className="hidden sm:flex flex-col items-start leading-none gap-1 mt-0.5">
                                    <span className="text-[11px] font-black text-teal-800 uppercase tracking-widest">Clean Energy Portal</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Customer</span>
                                </div>
                            </Link>

                            {/* Desktop Nav Links */}
                            <div className="hidden md:flex items-center gap-1">
                                {navLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                                            isActive(link.href)
                                                ? 'bg-teal-50 text-teal-700 border border-teal-100'
                                                : 'text-slate-500 hover:text-teal-700 hover:bg-teal-50'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>


                    </div>
                </div>
            </nav>

            <main className="flex-grow w-full py-8">
                <div className="max-container mx-auto px-4">
                    {children}
                </div>
            </main>

            <DemoIndicator />
        </div>
    );
};

export default CustomerLayout;
