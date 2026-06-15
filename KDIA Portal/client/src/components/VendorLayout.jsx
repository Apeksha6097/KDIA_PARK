import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import DemoIndicator from './DemoIndicator';
import { MOCK_TICKETS } from '../data/vendorSupportData';

const VendorLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/vendor/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center space-x-8">
                            <span className="text-xl font-black text-emerald-900 tracking-tight uppercase">KDIA <span className="text-emerald-500">Vendor</span></span>

                            {/* Navigation Links */}
                            <div className="hidden md:flex space-x-4">
                                <Link
                                    to="/vendor/dashboard"
                                    className={`px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${isActive('/vendor/dashboard')
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'text-slate-500 hover:text-emerald-600'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/vendor/leads"
                                    className={`px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${isActive('/vendor/leads')
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'text-slate-500 hover:text-emerald-600'
                                        }`}
                                >
                                    Leads
                                </Link>
                                <Link
                                    to="/vendor/customers"
                                    className={`px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${isActive('/vendor/customers')
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'text-slate-500 hover:text-emerald-600'
                                        }`}
                                >
                                    Customers
                                </Link>
                                <Link
                                    to="/vendor/support"
                                    className={`px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 ${isActive('/vendor/support') || isActive('/vendor/support/')
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'text-slate-500 hover:text-emerald-600'
                                        }`}
                                >
                                    Support
                                    {MOCK_TICKETS.filter(t => t.status !== 'Resolved').length > 0 && (
                                        <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
                                    )}
                                </Link>
                                <Link
                                    to="/vendor/billing"
                                    className={`px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${isActive('/vendor/billing') || isActive('/vendor/billing/')
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'text-slate-500 hover:text-emerald-600'
                                        }`}
                                >
                                    Billing & Payments
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-bold text-slate-900">{user.fullName}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.consumerId}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow w-full py-8">
                <div className="max-container">
                    {children}
                </div>
            </main>
            <DemoIndicator />
        </div>
    );
};

export default VendorLayout;
