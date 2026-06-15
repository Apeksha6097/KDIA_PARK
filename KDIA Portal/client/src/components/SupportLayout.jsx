import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Ticket,
    UserCheck,
    AlertTriangle,
    LogOut,
    Menu,
    X,
    MessageSquare,
    User
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
        { path: '/support/tickets', icon: <Ticket size={20} />, label: 'All Tickets' },
        { path: '/support/assigned', icon: <UserCheck size={20} />, label: 'My Assigned' },
        { path: '/support/escalated', icon: <AlertTriangle size={20} />, label: 'Escalated' },
    ];

    return (
        <div className="flex h-screen bg-neutral-50">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-neutral-200 transition-all duration-300 flex flex-col`}>
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                            <span className="font-bold text-neutral-800">Support Portal</span>
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold mx-auto">S</div>
                    )}
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
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
                        <div className="text-right">
                            <p className="text-sm font-semibold text-neutral-800">{user?.fullName || 'Support Agent'}</p>
                            <span className="text-xs text-neutral-500">Support Team</span>
                        </div>
                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600">
                            <User size={20} />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-container">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SupportLayout;
