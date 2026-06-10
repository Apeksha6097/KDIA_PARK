import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Ticket,
    UserCheck,
    Users,
    FileText,
    HelpCircle,
    User,
    LogOut,
    Menu,
    X
} from 'lucide-react';

const SupportLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/support/login');
    };

    const menuItems = [
        { path: '/support/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/support/tickets', icon: <Ticket size={20} />, label: 'Tickets' },
        { path: '/support/customer-issues', icon: <UserCheck size={20} />, label: 'Customer Issues' },
        { path: '/support/vendor-issues', icon: <Users size={20} />, label: 'Vendor Issues' },
        { path: '/support/faq-management', icon: <FileText size={20} />, label: 'FAQ Management' },
        { path: '/support/help-center', icon: <HelpCircle size={20} />, label: 'Help Center' },
        { path: '/support/profile', icon: <User size={20} />, label: 'Profile' },
    ];

    return (
        <div className="flex h-screen bg-neutral-50">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-neutral-200 transition-all duration-300 flex flex-col`}>
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-2.5">
                            <img src="/logo.png" alt="KDIA" className="h-7 w-auto" />
                            <div className="flex flex-col items-start leading-none gap-1 mt-0.5">
                                <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">KDIA Re Park</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Support Portal</span>
                            </div>
                        </div>
                    ) : (
                        <img src="/logo.png" alt="KDIA" className="h-7 w-auto mx-auto" />
                    )}
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${location.pathname === item.path
                                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
                                }`}
                        >
                            <span className={location.pathname === item.path ? 'text-emerald-600' : 'text-neutral-400'}>
                                {item.icon}
                            </span>
                            {isSidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-neutral-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-neutral-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-500"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-4">
                        <Link to="/support/profile" className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                            <User size={20} />
                        </Link>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-container mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SupportLayout;
