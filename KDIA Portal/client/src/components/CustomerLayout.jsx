import React from 'react';
import { useAuth } from '../context/AuthContext';
import DemoIndicator from './DemoIndicator';

const CustomerLayout = ({ children }) => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header / Top Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
                <div className="max-container">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <a href="/dashboard" className="flex items-center gap-4 transition-all hover:opacity-80 group">
                                <img src="/logo.png" alt="KDIA" className="h-8 w-auto" />
                                <div className="hidden sm:block">
                                    <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] block">Clean Energy Portal</span>
                                </div>
                            </a>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-black text-slate-900">{user?.fullName}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {user?.consumerId}</span>
                            </div>
                            <a
                                href="/dashboard"
                                className="inline-flex items-center px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-full text-slate-700 hover:text-teal-700 hover:bg-teal-50 transition-all"
                            >
                                Dashboard
                            </a>
                            {user?.role === 'admin' && (
                                <a
                                    href="/admin"
                                    className="inline-flex items-center px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                                >
                                    Admin Panel
                                </a>
                            )}
                            <a
                                href="/profile"
                                className="inline-flex items-center px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-full text-slate-700 hover:text-teal-700 hover:bg-teal-50 transition-all"
                            >
                                My Profile
                            </a>
                            <button
                                onClick={logout}
                                className="inline-flex items-center px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
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

export default CustomerLayout;
