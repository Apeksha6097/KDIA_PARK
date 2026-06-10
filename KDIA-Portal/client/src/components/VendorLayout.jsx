import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import DemoIndicator from './DemoIndicator';

const VendorLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();



    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { label: 'Dashboard', path: '/vendor/dashboard' },
        { label: 'Leads', path: '/vendor/leads' },
        { label: 'Customers', path: '/vendor/customers' },
        { label: 'Billing & Payments', path: '/vendor/billing' },
        { label: 'Documents', path: '/vendor/documents' },
        { label: 'Support', path: '/vendor/support' },
        { label: 'Vendor Profile', path: '/vendor/profile' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-6">
                            <Link to="/vendor/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                                <img src="/logo.png" alt="KDIA" className="h-7 w-auto" />
                                <div className="hidden sm:flex flex-col items-start leading-none gap-1 mt-0.5">
                                    <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">KDIA Re Park</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Vendor Portal</span>
                                </div>
                            </Link>

                            {/* Navigation Links */}
                            <div className="hidden md:flex space-x-2">
                                {navLinks.map(link => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`whitespace-nowrap px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${isActive(link.path)
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'text-slate-500 hover:text-emerald-600'
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
            <DemoIndicator />
        </div>
    );
};

export default VendorLayout;
